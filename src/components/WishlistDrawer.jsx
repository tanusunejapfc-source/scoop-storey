import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useWishlist } from '../utils/wishlistStore';
import WhatsAppIcon from './WhatsAppIcon';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  onAddToCart,
  onOpenProduct 
}) {
  const { wishlist, remove, clear, wishlistCount } = useWishlist();

  if (!isOpen) return null;

  const totalValue = wishlist.reduce((acc, it) => acc + (it.priceINR || 0), 0);

  const handleMoveAllToBag = () => {
    soundFX.playSuccess();
    wishlist.forEach(item => {
      onAddToCart?.({
        ...item,
        qty: 1,
        selectedColor: item.colors?.[0]?.name || 'Standard'
      });
    });
    onClose();
  };

  const handleShareOnWhatsApp = () => {
    soundFX.playPop(520);
    const itemList = wishlist
      .map(item => `• ${item.name} - ₹${item.priceINR}`)
      .join('\n');
    const msg = `Hey! 💖 Here are my favorite jewelry pieces saved on Scoop Storey:\n\n${itemList}\n\nTotal: ₹${totalValue}\nCheck it out here: https://scoop-storey-1du8.vercel.app/ ✨🎁`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-8">
        <div className="w-full sm:w-[425px] max-w-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-pink-200/60 dark:border-pink-900/40 relative">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/30 flex items-center justify-between bg-gradient-to-r from-pink-50/70 to-purple-50/70 dark:from-neutral-900 dark:to-neutral-900">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-white leading-tight">
                  Your Favorites
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {wishlistCount} saved item{wishlistCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-pink-100/70 hover:bg-pink-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {wishlistCount === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-pink-100/80 dark:bg-neutral-800 text-[#E60067] flex items-center justify-center mx-auto shadow-inner text-2xl">
                  💖
                </div>
                <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                  Your Wishlist is Empty
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Tap the heart icon on any necklace, mystery scoop, or charm to save your favorites here.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    window.location.hash = '';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-2 btn-3d-pink text-white px-5 py-2.5 rounded-2xl font-display font-bold text-xs cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlist.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-pink-50/40 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-800 flex items-center justify-between gap-3 group hover:border-pink-300 transition"
                  >
                    <div 
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => {
                        onOpenProduct?.(item);
                        onClose();
                      }}
                    >
                      <img
                        src={item.image || '/images/deluxe-giftbox.jpg'}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-contain bg-white dark:bg-neutral-700 p-1 border border-pink-100 dark:border-neutral-700 shrink-0"
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = '/brand-avatar.jpg'; 
                        }}
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider block truncate">
                          {item.category || 'Jewelry'}
                        </span>
                        <h5 className="font-display font-bold text-xs text-neutral-900 dark:text-white truncate">
                          {item.name}
                        </h5>
                        <span className="font-display font-black text-xs text-[#E60067] dark:text-pink-400">
                          ₹{item.priceINR}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playSuccess();
                          onAddToCart?.({
                            ...item,
                            qty: 1,
                            selectedColor: item.colors?.[0]?.name || 'Standard'
                          });
                        }}
                        className="p-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-xs transition cursor-pointer"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playPop(420);
                          remove(item.id);
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-neutral-700 transition cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {wishlistCount > 0 && (
            <div className="p-4 sm:p-5 border-t border-pink-100 dark:border-pink-900/30 bg-gradient-to-t from-pink-50/50 to-white dark:from-neutral-900 dark:to-neutral-900 space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-neutral-500">Total Wishlist Value:</span>
                <span className="font-display font-black text-sm text-[#E60067] dark:text-pink-400">
                  ₹{totalValue}
                </span>
              </div>

              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E60067] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag ({wishlistCount} items)</span>
              </button>

              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Share Favorites on WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

