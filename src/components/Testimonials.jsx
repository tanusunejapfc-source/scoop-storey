import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  Filter, 
  ThumbsUp, 
  X, 
  ChevronRight, 
  PenTool,
  ShoppingBag
} from 'lucide-react';
import { useReviews } from '../utils/reviewStore';
import { soundFX } from '../utils/audio';

export default function Testimonials({ onOpenReviewModal }) {
  const { publishedReviews, summary } = useReviews();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'photos' | 5 | 4 | 'verified'
  const [lightboxImg, setLightboxImg] = useState(null);
  const [likedReviews, setLikedReviews] = useState({});

  const handleLike = (id, e) => {
    e.stopPropagation();
    soundFX.playPop(520);
    setLikedReviews(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const reviewsWithPhotosCount = publishedReviews.filter(r => r.images && r.images.length > 0).length;
  const fiveStarsCount = summary.breakdown[5] || 0;
  const verifiedCount = publishedReviews.filter(r => r.verifiedBuyer).length;

  // Filter reviews
  const filteredReviews = publishedReviews.filter(rev => {
    if (activeFilter === 'photos') return rev.images && rev.images.length > 0;
    if (activeFilter === 5) return Number(rev.rating) === 5;
    if (activeFilter === 4) return Number(rev.rating) === 4;
    if (activeFilter === 'verified') return rev.verifiedBuyer;
    return true;
  });

  return (
    <section id="reviews" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-pink-100 dark:border-pink-900/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 text-xs font-black tracking-wider uppercase mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#E60067] text-[#E60067]" />
            <span>Real Happiness Delivered Across India</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
            Loved by Charm Lovers
          </h2>
          <p className="mt-2 text-sm text-[#554664] dark:text-[#D5CBE2] font-medium">
            100% genuine unboxings and customer reviews from across India.
          </p>
        </div>

        {/* CTA TO WRITE REVIEW */}
        <button
          type="button"
          onClick={() => {
            soundFX.playPop(500);
            if (typeof onOpenReviewModal === 'function') {
              onOpenReviewModal();
            }
          }}
          className="self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
        >
          <PenTool className="w-4 h-4" />
          <span>Write a Review</span>
          <Sparkles className="w-4 h-4 text-pink-200" />
        </button>
      </div>

      {/* RATINGS SUMMARY & BREAKDOWN SCORECARD */}
      <div className="mb-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-pink-50/70 via-white to-purple-50/50 dark:from-neutral-900 dark:via-[#1B1429] dark:to-neutral-900 border-2 border-pink-200/80 dark:border-pink-900/40 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Overall Rating */}
        <div className="md:col-span-4 text-center md:text-left md:border-r border-pink-200/80 dark:border-pink-900/40 md:pr-8">
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="font-display font-black text-5xl md:text-6xl text-[#231733] dark:text-white">
              {summary.average.toFixed(1)}
            </span>
            <span className="text-xl font-bold text-neutral-400">/ 5.0</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 my-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${star <= Math.round(summary.average) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}`} 
              />
            ))}
          </div>

          <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            Based on <strong className="text-neutral-900 dark:text-white font-extrabold">{summary.total} published reviews</strong>
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>99.2% Recommend Scoop Storey</span>
          </div>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="md:col-span-5 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.breakdown[star] || 0;
            const pct = summary.percentages[star] || 0;
            const isSelected = activeFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => {
                  soundFX.playPop(400 + star * 30);
                  setActiveFilter(isSelected ? 'all' : star);
                }}
                className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-xl transition ${
                  isSelected ? 'bg-pink-100/70 dark:bg-pink-950/40 font-bold' : 'hover:bg-pink-50/50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-1 w-12 font-bold text-neutral-700 dark:text-neutral-300 shrink-0">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="w-14 text-right text-neutral-500 dark:text-neutral-400 font-semibold shrink-0 text-[11px]">
                  <span>{count}</span>
                  <span className="text-[10px] text-neutral-400 ml-1">({pct}%)</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Unboxing Proof Badges */}
        <div className="md:col-span-3 space-y-3 bg-white dark:bg-neutral-800/70 p-4 rounded-2xl border border-pink-100 dark:border-pink-900/30 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-[#E60067] dark:text-pink-300 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-neutral-900 dark:text-white">Customer Photos</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">See real ASMR scoops & unboxings before you order.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-pink-50 dark:border-neutral-700">
            <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-neutral-900 dark:text-white">Verified Deliveries</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Reviews strictly tied to real UPI orders and deliveries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <span className="text-xs font-bold text-neutral-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>

        <button
          type="button"
          onClick={() => {
            soundFX.playPop(420);
            setActiveFilter('all');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#E60067] text-white shadow-xs'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-pink-200 dark:border-neutral-700 hover:border-[#E60067]'
          }`}
        >
          All Reviews ({publishedReviews.length})
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playPop(440);
            setActiveFilter(activeFilter === 'photos' ? 'all' : 'photos');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFilter === 'photos'
              ? 'bg-[#E60067] text-white shadow-xs'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-pink-200 dark:border-neutral-700 hover:border-[#E60067]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>With Photos ({reviewsWithPhotosCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playPop(460);
            setActiveFilter(activeFilter === 5 ? 'all' : 5);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFilter === 5
              ? 'bg-[#E60067] text-white shadow-xs'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-pink-200 dark:border-neutral-700 hover:border-[#E60067]'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>5 Stars Only ({fiveStarsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.playPop(480);
            setActiveFilter(activeFilter === 'verified' ? 'all' : 'verified');
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeFilter === 'verified'
              ? 'bg-[#E60067] text-white shadow-xs'
              : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-pink-200 dark:border-neutral-700 hover:border-[#E60067]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Buyers ({verifiedCount})</span>
        </button>
      </div>

      {/* REVIEWS GRID */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-pink-50/50 dark:bg-neutral-900 rounded-3xl border border-pink-200 dark:border-neutral-800 p-8">
          <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3" />
          <h3 className="font-display font-extrabold text-lg text-neutral-900 dark:text-white">
            No reviews matching this filter
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            Try switching filters or be the first customer to share your experience with photos!
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="mt-4 px-4 py-2 rounded-xl bg-pink-100 dark:bg-neutral-800 text-[#E60067] dark:text-pink-300 text-xs font-bold hover:bg-pink-200 transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const currentLikes = (rev.likesCount || 0) + (likedReviews[rev.id] || 0);

            return (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-200/80 dark:border-pink-900/40 flex flex-col justify-between hover:shadow-xl hover:border-pink-400 transition-all shadow-sm group"
              >
                <div>
                  {/* Top Bar: Stars + Verified Badge + Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}`} 
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {rev.verifiedBuyer && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                      <span className="text-[10px] text-neutral-400 font-bold">
                        {rev.date || 'Recently'}
                      </span>
                    </div>
                  </div>

                  {/* Product Tag if available */}
                  {rev.productName && (
                    <div className="mb-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-lg border border-pink-200/60 dark:border-pink-900/40 truncate max-w-full">
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      <span className="truncate">{rev.productName}</span>
                    </div>
                  )}

                  {/* Title & Body */}
                  {rev.title && (
                    <h4 className="font-display font-bold text-base text-[#231733] dark:text-white mb-2 leading-snug">
                      "{rev.title}"
                    </h4>
                  )}
                  <p className="text-xs md:text-sm text-[#483A54] dark:text-[#D5CBE2] leading-relaxed font-body font-medium">
                    {rev.comment}
                  </p>

                  {/* Customer Photos Gallery */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      {rev.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            soundFX.playPop(550);
                            setLightboxImg(img);
                          }}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-pink-200 dark:border-neutral-700 group/img cursor-pointer hover:opacity-90 transition"
                          title="Click to view full photo"
                        >
                          <img 
                            src={img} 
                            alt={`Customer unboxing photo ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                            <Camera className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Customer Profile + Helpful Like Button */}
                <div className="mt-6 pt-4 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-xs text-[#231733] dark:text-white block leading-tight">
                        {rev.customerName}
                      </span>
                      {rev.handle && (
                        <span className="text-[10px] text-[#E60067] dark:text-pink-400 font-bold block">
                          {rev.handle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Helpful Button */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(rev.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#E60067] hover:bg-pink-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                    title="Mark as helpful"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews[rev.id] ? 'fill-[#E60067] text-[#E60067]' : ''}`} />
                    <span>{currentLikes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div 
            className="relative max-w-2xl max-h-[85vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-pink-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={lightboxImg} 
              alt="Customer unboxing photo preview" 
              className="w-full max-h-[80vh] object-contain bg-neutral-950" 
            />
            <div className="p-3 text-center text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Verified Customer Unboxing Photo
            </div>
          </div>
        </div>
      )}
    </section>
  );
}