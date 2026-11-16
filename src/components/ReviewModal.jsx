import React, { useState, useRef } from 'react';
import { 
  Star, 
  X, 
  Upload, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Heart, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import { submitCustomerReview } from '../utils/reviewStore';
import { uploadImageToSupabase } from '../utils/supabaseClient';

export default function ReviewModal({
  isOpen,
  onClose,
  initialProduct = null,
  products = []
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(initialProduct?.id || 'general');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const RATING_LABELS = {
    5: '💖 Absolutely Loved It! Super Kawaii!',
    4: '✨ Really Loved It! Great Quality',
    3: '🌸 It was Good!',
    2: '🌿 Fair Experience',
    1: '⚠️ Needs Improvement'
  };

  const handleSelectStar = (num) => {
    soundFX.playPop(450 + num * 60);
    setRating(num);
  };

  // Handle customer image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 3) {
      setErrorMsg('You can upload up to 3 unboxing photos.');
      soundFX.playPop(300);
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      // 1. Try uploading to Supabase Storage if configured
      try {
        const res = await uploadImageToSupabase(file);
        if (res && res.success && res.url) {
          setImages(prev => [...prev, res.url]);
          soundFX.playPop(600);
          continue;
        }
      } catch {}

      // 2. Fallback to client FileReader base64 compression
      const reader = new FileReader();
      reader.onload = (uploadEv) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          setImages(prev => [...prev, compressed]);
          soundFX.playPop(600);
        };
        img.src = uploadEv.target.result;
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(false);
  };

  const handleRemoveImage = (index) => {
    soundFX.playPop(400);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your name.');
      soundFX.playPop(300);
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('Please write a short review or feedback.');
      soundFX.playPop(300);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    let prodName = 'Scoop Storey Store Experience';
    if (selectedProductId !== 'general') {
      const found = products.find(p => p.id === selectedProductId);
      if (found) prodName = found.name;
    }

    try {
      await submitCustomerReview({
        productId: selectedProductId,
        productName: prodName,
        customerName: customerName.trim(),
        handle: handle.trim(),
        rating,
        title: title.trim() || RATING_LABELS[rating].split('!')[0],
        comment: comment.trim(),
        images
      });

      // Confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      soundFX.playSuccess();
      setIsSuccess(true);
    } catch (err) {
      setErrorMsg('Failed to submit review. Please try again.');
      soundFX.playPop(300);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    soundFX.playPop(450);
    setIsSuccess(false);
    setCustomerName('');
    setHandle('');
    setTitle('');
    setComment('');
    setImages([]);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1A1226] border-2 border-pink-200 dark:border-pink-900/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white leading-tight">
                Write a Review ✨
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Share your unboxing happiness with charm lovers across India
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {isSuccess ? (
            /* Success Card */
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-black text-xl text-neutral-900 dark:text-white">
                  Thank You for Your Review! 💖
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto">
                  Your feedback has been submitted to the Scoop Storey team for verification and will appear on the store shortly!
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#E60067] to-purple-600 text-white font-display font-bold text-xs shadow-lg hover:brightness-110 transition active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Review Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Star Rating Interactive Selector */}
              <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-100 dark:border-pink-900/40 text-center space-y-2">
                <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                  Overall Experience Rating
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const isFilled = (hoverRating || rating) >= starNum;
                    return (
                      <button
                        type="button"
                        key={starNum}
                        onMouseEnter={() => setHoverRating(starNum)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleSelectStar(starNum)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        aria-label={`${starNum} stars`}
                      >
                        <Star 
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-bold text-[#E60067] dark:text-pink-400 animate-fadeIn">
                  {RATING_LABELS[hoverRating || rating]}
                </div>
              </div>

              {/* Product selector if not pinned */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Product Reviewed
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none focus:border-[#E60067]"
                >
                  <option value="general">🍨 General Store Experience & Mystery Scoop</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.priceINR})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Handle row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Diya Kapoor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none focus:border-[#E60067]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Instagram Handle <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="e.g. @diya_glam"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none focus:border-[#E60067]"
                  />
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Super cute packaging and heavy charms! 💖"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-semibold focus:outline-none focus:border-[#E60067]"
                />
              </div>

              {/* Detailed Review Text */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Your Honest Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked about the charms, the ASMR packaging, delivery speed, or cute extras..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-800 dark:text-white font-medium focus:outline-none focus:border-[#E60067] resize-none"
                />
              </div>

              {/* Photo Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-neutral-700 dark:text-neutral-300">
                    Add Unboxing Photos 📸 <span className="text-neutral-400 font-normal">(Up to 3 photos)</span>
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {images.length}/3
                  </span>
                </div>

                {/* Previews & Add Button */}
                <div className="flex items-center gap-2 flex-wrap">
                  {images.map((imgSrc, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-pink-200 dark:border-neutral-700 group">
                      <img src={imgSrc} alt="Review upload" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-pink-300 dark:border-neutral-700 hover:border-[#E60067] flex flex-col items-center justify-center text-neutral-400 hover:text-[#E60067] transition cursor-pointer bg-pink-50/30 dark:bg-neutral-900/40"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-1">Upload</span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-fadeIn">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E60067] via-rose-500 to-purple-600 text-white font-display font-extrabold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Review...' : 'Submit Verified Review ✨'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
