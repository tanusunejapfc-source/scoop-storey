import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ShoppingBag, Check, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { soundFX } from '../utils/audio';

const TRENDING_SEARCHES = [
  'Bow Heart Pendant',
  'Mini Scoop',
  'Butterfly Bracelet',
  'Snake Chain Anklet',
  'Velvet Eye Mask',
  'Korean Wallet',
  'Under ₹200'
];

export default function GlobalSearchModal({
  isOpen,
  onClose,
  products = [],
  onSelectProduct,
  onAddToCart
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [justAddedId, setJustAddedId] = useState(null);
  const inputRef = useRef(null);

  // Focus input on open & handle ESC key
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter products based on search term & category filter
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (!q) {
      // If query is empty, show trending/popular hot picks
      return list.slice(0, 8);
    }

    // Special check for "under ₹200" / "under 200"
    if (q.includes('under 200') || q.includes('under ₹200')) {
      return list.filter(p => p.priceINR <= 200);
    }

    return list.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const badgeMatch = p.badge?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const incMatch = p.includes?.some(inc => inc.toLowerCase().includes(q));
      return nameMatch || catMatch || badgeMatch || descMatch || incMatch;
    });
  }, [products, query, selectedCategory]);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    soundFX.playPop(650);
    soundFX.playSuccess();
    onAddToCart?.(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const handleSelect = (product) => {
    soundFX.playPop(550);
    onSelectProduct?.(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-start justify-center animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
      />

      {/* Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E172E] rounded-3xl shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden z-10 my-4 sm:my-8 animate-scaleUp">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/40 bg-gradient-to-r from-pink-50/50 via-white to-purple-50/50 dark:from-[#251A38] dark:to-[#1E172E]">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#E60067] dark:text-pink-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pendants, charm scoops, bracelets, eye masks..."
              className="flex-1 text-sm sm:text-base font-medium bg-transparent text-[#231733] dark:text-white placeholder:text-neutral-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                  soundFX.playPop(400);
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-xl bg-pink-100 dark:bg-pink-950 text-[#E60067] dark:text-pink-300 font-bold text-xs hover:bg-pink-200 transition"
            >
              ESC
            </button>
          </div>

          {/* Quick Trending Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none text-[11px]">
            <span className="text-neutral-400 font-bold shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              Trending:
            </span>
            {TRENDING_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  soundFX.playPop(500);
                }}
                className="px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-neutral-800 text-[#554664] dark:text-neutral-300 border border-pink-200/60 dark:border-neutral-700 hover:border-pink-400 whitespace-nowrap transition cursor-pointer font-semibold"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  soundFX.playPop(450);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E60067] text-white shadow-xs'
                    : 'bg-white dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-pink-100 dark:border-neutral-700 hover:bg-pink-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container (Scrollable) */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-1 pb-1">
            <span>
              {query ? `Search results for "${query}"` : 'Top Recommended Picks'}
            </span>
            <span>{searchResults.length} Products Found</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <div className="text-3xl">🔍</div>
              <p className="font-display font-bold text-base text-neutral-700 dark:text-neutral-300">
                No goodies found matching "{query}"
              </p>
              <p className="text-xs text-neutral-400">
                Try searching "heart", "gold", "scoop", or clear your filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {searchResults.map((product) => {
                const isJustAdded = justAddedId === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="p-2.5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-pink-100 dark:border-pink-900/40 hover:border-pink-400 dark:hover:border-pink-500 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-pink-50/70 dark:bg-neutral-700/60 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image || product.images?.[0] || '/images/deluxe-giftbox.jpg'}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-display font-bold text-xs text-[#231733] dark:text-white truncate group-hover:text-[#E60067] transition-colors">
                          {product.name}
                        </h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold text-[#E60067] dark:text-pink-400">
                            ₹{product.priceINR}
                          </span>
                          <span className="text-[9px] text-neutral-400">•</span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1 shrink-0 transition-all ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'btn-3d-pink text-white'
                      }`}
                      title="Add directly to your scoop bag"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-pink-50/70 dark:bg-neutral-900 border-t border-pink-100 dark:border-neutral-800 text-center text-[11px] text-neutral-500 font-medium">
          <span>✨ Minimum 3 items required to order • 100% Prepaid Delivery across India</span>
        </div>

      </div>
    </div>
  );
}

