import React, { useState, useMemo, useRef } from 'react';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Plus, 
  Search, 
  Upload, 
  Eye, 
  Check, 
  Filter, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Image as ImageIcon,
  ChevronDown,
  ExternalLink,
  ThumbsUp,
  X,
  AlertCircle
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import { 
  useReviews, 
  updateReviewStatus, 
  deleteReview, 
  toggleReviewVerified, 
  createMerchantReview 
} from '../../utils/reviewStore';
import { uploadImageToCloud } from '../../utils/apiClient';

export default function AdminReviewsManager({ products = [] }) {
  const { allReviews, refreshReviews } = useReviews();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'published' | 'rejected'
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | 5 | 4 | 3 | 2 | 1
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Photo lightbox

  // Custom Merchant Review Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customHandle, setCustomHandle] = useState('');
  const [customRating, setCustomRating] = useState(5);
  const [customProductId, setCustomProductId] = useState('general');
  const [customTitle, setCustomTitle] = useState('');
  const [customComment, setCustomComment] = useState('');
  const [customDate, setCustomDate] = useState('Recently');
  const [customImages, setCustomImages] = useState([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Metrics summary
  const stats = useMemo(() => {
    const total = allReviews.length;
    const pending = allReviews.filter(r => r.status === 'pending').length;
    const published = allReviews.filter(r => r.status === 'published').length;
    const rejected = allReviews.filter(r => r.status === 'rejected').length;

    let ratingSum = 0;
    const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    allReviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Number(r.rating) || 5));
      ratingDist[star] = (ratingDist[star] || 0) + 1;
      ratingSum += star;
    });

    const averageRating = total > 0 ? (ratingSum / total).toFixed(1) : '5.0';

    return { total, pending, published, rejected, averageRating, ratingDist };
  }, [allReviews]);

  // Filtered reviews list
  const filteredReviews = useMemo(() => {
    return allReviews.filter(r => {
      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;

      // Star rating filter
      if (ratingFilter !== 'all' && Number(r.rating) !== Number(ratingFilter)) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (r.customerName || '').toLowerCase().includes(q);
        const matchesHandle = (r.handle || '').toLowerCase().includes(q);
        const matchesText = (r.comment || '').toLowerCase().includes(q);
        const matchesTitle = (r.title || '').toLowerCase().includes(q);
        const matchesProd = (r.productName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesHandle && !matchesText && !matchesTitle && !matchesProd) {
          return false;
        }
      }

      return true;
    });
  }, [allReviews, statusFilter, ratingFilter, searchQuery]);

  // Actions
  const handleApprove = (id) => {
    soundFX.playSuccess();
    updateReviewStatus(id, 'published');
    showToast('Review approved & published to store!');
  };

  const handleReject = (id) => {
    soundFX.playPop(400);
    updateReviewStatus(id, 'rejected');
    showToast('Review hidden from storefront.');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review permanently?')) {
      soundFX.playPop(350);
      deleteReview(id);
      showToast('Review deleted.');
    }
  };

  const handleToggleVerified = (id) => {
    soundFX.playPop(500);
    toggleReviewVerified(id);
    showToast('Verified Buyer badge updated.');
  };

  // Custom photo upload for merchant modal
  const handleUploadCustomPhoto = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingPhoto(true);
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      // Upload to Railway Persistent Volume
      try {
        const res = await uploadImageToCloud(file, 'reviews');
        if (res && res.success && res.url) {
          setCustomImages(prev => [...prev, res.url]);
          soundFX.playPop(600);
          continue;
        }
      } catch {}

      // Fallback base64
      const reader = new FileReader();
      reader.onload = (uploadEv) => {
        setCustomImages(prev => [...prev, uploadEv.target.result]);
        soundFX.playPop(600);
      };
      reader.readAsDataURL(file);
    }
    setIsUploadingPhoto(false);
  };

  const handleSaveCustomReview = async (e) => {
    e.preventDefault();
    if (!customName.trim() || !customComment.trim()) {
      alert('Please enter customer name and review comment.');
      return;
    }

    let pName = 'Scoop Storey Store Experience';
    if (customProductId !== 'general') {
      const p = products.find(prod => prod.id === customProductId);
      if (p) pName = p.name;
    }

    await createMerchantReview({
      productId: customProductId,
      productName: pName,
      customerName: customName.trim(),
      handle: customHandle.trim(),
      rating: customRating,
      title: customTitle.trim() || 'Verified Customer Review',
      comment: customComment.trim(),
      images: customImages,
      date: customDate.trim() || 'Recently',
      status: 'published'
    });

    soundFX.playSuccess();
    showToast('Custom customer review published!');
    setIsAddModalOpen(false);
    // Reset form
    setCustomName('');
    setCustomHandle('');
    setCustomRating(5);
    setCustomTitle('');
    setCustomComment('');
    setCustomImages([]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn pb-16">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-neutral-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-pink-500/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-200/80 dark:border-pink-900/40 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-xl sm:text-2xl text-neutral-900 dark:text-white">
              Customer Ratings & Reviews
            </h1>
            {stats.pending > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
                {stats.pending} Pending Approval
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Moderate incoming customer reviews, publish verified feedback, or upload custom reviews from WhatsApp & Instagram.
          </p>
        </div>

        <button
          onClick={() => {
            soundFX.playPop(500);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E60067] via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Custom Review</span>
        </button>
      </div>

      {/* Executive Ratings KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Rating */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-pink-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Average Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-neutral-800 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-neutral-900 dark:text-white mt-2 flex items-baseline gap-1.5">
            <span>{stats.averageRating}</span>
            <span className="text-xs font-semibold text-neutral-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        {/* Card 2: Total Reviews */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-pink-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Reviews
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-neutral-800 text-[#E60067] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-neutral-900 dark:text-white mt-2">
            {stats.total}
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Across all store collections
          </div>
        </div>

        {/* Card 3: Pending Approval */}
        <div 
          onClick={() => setStatusFilter('pending')}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-pink-900/40 shadow-sm cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Awaiting Moderation
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              stats.pending > 0 
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 animate-pulse' 
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className={`font-display font-black text-3xl mt-2 ${
            stats.pending > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-900 dark:text-white'
          }`}>
            {stats.pending}
          </div>
          <div className="mt-2 text-[11px] font-semibold text-amber-600">
            {stats.pending > 0 ? 'Click to view & approve' : 'All reviews reviewed'}
          </div>
        </div>

        {/* Card 4: Published */}
        <div 
          onClick={() => setStatusFilter('published')}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-pink-900/40 shadow-sm cursor-pointer hover:border-emerald-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Live on Storefront
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-neutral-800 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-3xl text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.published}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold">
            Visible to charm buyers
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-pink-100 dark:border-pink-900/40 shadow-xs">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: 'pending', label: `Pending (${stats.pending})` },
            { id: 'published', label: `Published (${stats.published})` },
            { id: 'rejected', label: `Rejected (${stats.rejected})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playPop(500);
                setStatusFilter(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#E60067] text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rating Filter & Search */}
        <div className="flex items-center gap-2">
          {/* Star dropdown */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Stars</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>

          {/* Search box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-white focus:outline-none focus:border-[#E60067]"
            />
          </div>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-pink-900/40 p-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-pink-50 dark:bg-neutral-800 flex items-center justify-center text-pink-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-base text-neutral-800 dark:text-neutral-200">
              No reviews found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all' || ratingFilter !== 'all'
                ? 'Try clearing your search or status filter to view reviews.'
                : 'Customer reviews submitted on the store will appear here for verification.'}
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-3xl bg-white dark:bg-neutral-900 border-2 transition-all shadow-xs space-y-3 ${
                rev.status === 'pending'
                  ? 'border-amber-400/80 bg-amber-50/10'
                  : rev.status === 'rejected'
                  ? 'border-neutral-200 dark:border-neutral-800 opacity-70'
                  : 'border-pink-100 dark:border-pink-900/40 hover:border-pink-300'
              }`}
            >
              {/* Header row: Author, Stars & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 text-white font-display font-black text-sm flex items-center justify-center shrink-0">
                    {rev.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-extrabold text-sm text-neutral-900 dark:text-white">
                        {rev.customerName}
                      </span>
                      {rev.handle && (
                        <span className="text-xs text-[#E60067] dark:text-pink-400 font-bold">
                          {rev.handle}
                        </span>
                      )}
                      {rev.isCustomMerchant && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200">
                          Custom Merchant Upload
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>{rev.date || 'Recently'}</span>
                      {rev.productName && (
                        <>
                          <span>•</span>
                          <span className="text-neutral-600 dark:text-neutral-300 font-medium truncate max-w-xs">
                            {rev.productName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating & Status Badge */}
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-200 dark:text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    rev.status === 'published'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : rev.status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 animate-pulse'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                  }`}>
                    {rev.status === 'published' ? '● Live' : rev.status === 'pending' ? '⏳ Pending' : '✕ Hidden'}
                  </span>
                </div>
              </div>

              {/* Review Title & Comment */}
              <div className="space-y-1 pt-1">
                {rev.title && (
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                    "{rev.title}"
                  </h4>
                )}
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-body">
                  {rev.comment}
                </p>
              </div>

              {/* Attached Photos (if any) */}
              {Array.isArray(rev.images) && rev.images.length > 0 && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {rev.images.map((imgSrc, imgIdx) => (
                    <button
                      type="button"
                      key={imgIdx}
                      onClick={() => setSelectedPhoto(imgSrc)}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-pink-200 dark:border-neutral-700 hover:scale-105 transition cursor-pointer group relative"
                    >
                      <img src={imgSrc} alt="Customer upload" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                        <Eye className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Verified Buyer toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleVerified(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition ${
                    rev.verifiedBuyer
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                  title="Toggle Verified Buyer Badge"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{rev.verifiedBuyer ? 'Verified Buyer' : 'Unverified'}</span>
                </button>

                {/* Status Moderation Buttons */}
                <div className="flex items-center gap-2">
                  {rev.status !== 'published' && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}

                  {rev.status === 'published' && (
                    <button
                      onClick={() => handleReject(rev.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Hide from Store</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                    title="Delete review permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: Upload Custom Merchant Review */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1A1226] border-2 border-pink-200 dark:border-pink-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white leading-tight">
                    Upload Custom Review ✨
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Add customer feedback from WhatsApp, Instagram DMs, or Pop-Up Events
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCustomReview} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Star selector */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setCustomRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${
                        star <= customRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'
                      }`} />
                    </button>
                  ))}
                  <span className="font-bold text-neutral-600 dark:text-neutral-300 ml-2">
                    {customRating} Stars
                  </span>
                </div>
              </div>

              {/* Product selector */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Product Tag
                </label>
                <select
                  value={customProductId}
                  onChange={(e) => setCustomProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                >
                  <option value="general">🍨 General Store Review / Mystery Scoop</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.priceINR})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Handle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Nikita Varma"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Handle / Source
                  </label>
                  <input
                    type="text"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder="e.g. @nikita_kawaii or WhatsApp"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Got the gold charm bear! 🧸✨"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              {/* Feedback Comment */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Review Feedback Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Paste what the customer said on WhatsApp or Instagram..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-medium focus:outline-none resize-none"
                />
              </div>

              {/* Date string */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Display Date
                </label>
                <input
                  type="text"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  placeholder="e.g. Yesterday, 2 days ago, 1 week ago"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Customer Photos / Screenshot Proof 📸
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {customImages.map((src, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-pink-200 dark:border-neutral-700">
                      <img src={src} alt="Upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCustomImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-xl border-2 border-dashed border-pink-300 dark:border-neutral-700 hover:border-[#E60067] flex flex-col items-center justify-center text-neutral-400 hover:text-[#E60067] transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold mt-1">Photo</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadCustomPhoto}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E60067] to-purple-600 text-white font-display font-extrabold text-xs shadow-md hover:brightness-110 transition cursor-pointer"
                >
                  Publish Custom Review Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Review full size" className="w-full h-full object-contain max-h-[80vh] rounded-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
