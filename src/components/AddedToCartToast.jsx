import React, { useEffect, useState } from 'react';
import { ShoppingBag, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function AddedToCartToast({
  item,
  cartCount = 0,
  onOpenCart,
  onClose,
  durationMs = 4500
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!item) return;
    setProgress(100);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);
      if (remainingPct <= 0) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [item, durationMs]);

  if (!item) return null;

  const handleGoToCart = () => {
    soundFX.playPop(700);
    soundFX.playChime();
    if (onOpenCart) onOpenCart();
    if (onClose) onClose();
  };

  const handleDismiss = (e) => {
    e?.stopPropagation();
    soundFX.playPop(400);
    if (onClose) onClose();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-3 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-w-sm rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-2 border-pink-300 dark:border-pink-700/80 shadow-2xl shadow-pink-500/15 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Top Content Row */}
      <div className="p-3.5 sm:p-4">
        {/* Header notification */}
        <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-pink-100 dark:border-pink-900/40">
          <div className="flex items-center gap-1.5 text-xs font-display font-black text-emerald-600 dark:text-emerald-400">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
            </span>
            <span>Added to Bag! 🛍️</span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-pink-50 dark:hover:bg-neutral-800 transition cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-xl bg-pink-50 dark:bg-neutral-800 border border-pink-200/80 dark:border-pink-900/50 overflow-hidden shrink-0">
            <img
              src={item.image || '/images/deluxe-giftbox.webp'}
              alt={item.name || 'Product'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/deluxe-giftbox.webp';
              }}
            />
            {item.qty > 1 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-md bg-[#E60067] text-white text-[9px] font-black shadow-xs">
                x{item.qty}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
              {item.name}
            </h4>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {item.selectedColor && (
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  {item.selectedColorHex && (
                    <span
                      className="w-2 h-2 rounded-full border border-black/20"
                      style={{ backgroundColor: item.selectedColorHex }}
                    />
                  )}
                  <span>{item.selectedColor}</span>
                </span>
              )}
              <span className="text-xs font-black text-[#E60067] dark:text-pink-400">
                ₹{item.priceINR || item.price || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Go to Bag */}
        <div className="mt-3 pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleGoToCart}
            className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#FF1493] via-[#E60067] to-[#D8005A] hover:opacity-95 text-white font-display font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 active:scale-95 transition cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Go to Bag {cartCount > 0 ? `(${cartCount})` : ''}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Auto-dismiss progress timer */}
      <div className="w-full h-1 bg-pink-100 dark:bg-neutral-800">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-[#E60067] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
