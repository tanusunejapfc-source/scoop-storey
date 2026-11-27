import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';
import MiniScoopIcon from './MiniScoopIcon';
import { getStoredCategories, fetchCategoriesFromCloud, resolveCategoryCoverImage } from '../utils/categoryStore';

// Curated Category Icons matching Scoop Storey Kawaii Luxury Aesthetic
export const CATEGORY_ICONS_DATA = [
  {
    id: 'mystery-scoops',
    category: 'Mystery Scoops',
    name: 'Mystery Scoops',
    shortName: '3D Scoops',
    image: '/images/scoop-bowl.webp',
    icon: MiniScoopIcon,
    emoji: '✨',
    tag: 'Live ASMR',
    gradient: 'from-pink-500 via-rose-500 to-purple-500',
    ringColor: 'from-[#FF4D8D] to-[#D8005A]'
  },
  {
    id: 'pendants-chains',
    category: 'Pendants & Chains',
    name: 'Pendants & Chains',
    shortName: 'Pendants',
    image: '/images/pendants/bow-heart-pendant.webp',
    emoji: '✨',
    tag: '18K Gold',
    gradient: 'from-amber-400 via-pink-400 to-rose-400',
    ringColor: 'from-amber-400 to-pink-500'
  },
  {
    id: 'bracelets',
    category: 'Bracelets',
    name: 'Bracelets',
    shortName: 'Bracelets',
    image: '/uploads/products/image-404767-30y2.webp',
    emoji: '🎀',
    tag: 'Charm Links',
    gradient: 'from-purple-400 via-pink-400 to-indigo-500',
    ringColor: 'from-purple-500 to-pink-500'
  },
  {
    id: 'anklets',
    category: 'Anklets',
    name: 'Anklets',
    shortName: 'Anklets',
    image: '/uploads/products/image-777653-czgk.webp',
    emoji: '💫',
    tag: 'Liquid Gold',
    gradient: 'from-amber-400 via-orange-400 to-pink-400',
    ringColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 'makeup',
    category: 'Make up',
    name: 'Make up',
    shortName: 'Make up',
    image: '/uploads/products/image-474478-84v8.webp',
    emoji: '💄',
    tag: 'Pastel Glow',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-400',
    ringColor: 'from-rose-500 to-pink-500'
  },
  {
    id: 'soft-toys',
    category: 'Soft Toys',
    name: 'Soft Toys',
    shortName: 'Soft Toys',
    image: '/uploads/products/image-615687-q8ve.webp',
    emoji: '🧸',
    tag: 'Plushies',
    gradient: 'from-amber-400 via-rose-400 to-pink-400',
    ringColor: 'from-amber-500 to-pink-500'
  },
  {
    id: 'keychains',
    category: 'Key chains',
    name: 'Key chains',
    shortName: 'Keychains',
    image: '/uploads/products/image-403327-hwdu.webp',
    emoji: '🗝️',
    tag: 'Bag Charms',
    gradient: 'from-purple-400 via-pink-400 to-amber-400',
    ringColor: 'from-purple-500 to-pink-500'
  },
  {
    id: 'hair-accessories',
    category: 'Hair Accessories',
    name: 'Hair Accessories',
    shortName: 'Hair Clips',
    image: '/uploads/products/image-544752-oom9.webp',
    emoji: '🌸',
    tag: 'Claw Clips',
    gradient: 'from-pink-400 via-purple-400 to-rose-400',
    ringColor: 'from-pink-500 to-purple-500'
  },
  {
    id: 'self-care',
    category: 'Self-Care',
    name: 'Self-Care',
    shortName: 'Self-Care',
    image: '/uploads/products/image-830292-lu23.webp',
    emoji: '🌸',
    tag: 'Glow Routine',
    gradient: 'from-rose-400 via-teal-400 to-emerald-400',
    ringColor: 'from-rose-500 to-teal-500'
  },
  {
    id: 'korean-wallets-and-bags',
    category: 'Korean wallets and bags',
    name: 'Korean wallets and bags',
    shortName: 'Wallets & Bags',
    image: '/uploads/products/image-245381-g9l6.webp',
    emoji: '👛',
    tag: 'Quilted & Totes',
    gradient: 'from-pink-400 via-purple-400 to-rose-400',
    ringColor: 'from-pink-500 to-purple-600'
  },
  {
    id: 'kawaii-stationery',
    category: 'Kawaii Stationery',
    name: 'Kawaii Stationery',
    shortName: 'Stationery',
    image: '/uploads/products/image-022892-2wuh.webp',
    emoji: '📝',
    tag: 'Pastel Diaries',
    gradient: 'from-amber-400 via-rose-400 to-pink-400',
    ringColor: 'from-amber-500 to-pink-500'
  },
  {
    id: 'bottles-mugs',
    category: 'Bottles & Mugs',
    name: 'Bottles & Mugs',
    shortName: 'Bottles & Mugs',
    image: '/uploads/products/image-385062-6ud0.webp',
    emoji: '🥛',
    tag: 'Cute Drinkware',
    gradient: 'from-teal-400 via-cyan-400 to-blue-500',
    ringColor: 'from-teal-500 to-blue-500'
  },
  {
    id: 'accessories',
    category: 'Accessories',
    name: 'Accessories',
    shortName: 'Accessories',
    image: '/uploads/products/image-984999-ibrm.webp',
    emoji: '✨',
    tag: 'Everyday Cute',
    gradient: 'from-purple-400 via-pink-400 to-amber-400',
    ringColor: 'from-purple-500 to-pink-500'
  },
  {
    id: 'all-collections',
    category: 'All Items',
    name: 'All Collections',
    shortName: 'Explore All',
    image: '/images/deluxe-giftbox.webp',
    emoji: '🛍️',
    tag: 'All Goodies',
    gradient: 'from-purple-500 via-pink-500 to-amber-400',
    ringColor: 'from-purple-600 to-pink-500'
  }
];

export default function CategoryIconsBar({ 
  activeCategory, 
  onSelectCategory,
  products = [],
  className = ''
}) {
  const scrollContainerRef = useRef(null);
  const [categoriesList, setCategoriesList] = useState(getStoredCategories);

  useEffect(() => {
    // Sync with remote cloud storage so changes from Admin are live for all visitors
    fetchCategoriesFromCloud().then(cloudCats => {
      if (cloudCats && Array.isArray(cloudCats)) {
        setCategoriesList(cloudCats);
      }
    });

    const handleCatUpdate = (e) => {
      if (e?.detail) setCategoriesList(e.detail);
      else setCategoriesList(getStoredCategories());
    };
    window.addEventListener('scoop_categories_updated', handleCatUpdate);
    return () => window.removeEventListener('scoop_categories_updated', handleCatUpdate);
  }, []);

  // Dynamically merge presets with stored categories and products
  const displayItems = useMemo(() => {
    const iconDataMap = new Map(CATEGORY_ICONS_DATA.map(i => [i.category.toLowerCase(), i]));
    const list = [];
    const seen = new Set();
    const ghostMergedSet = new Set(['eye masks', 'korean wallets', 'bottles', 'bracelets & anklets', 'eye masks & self-care']);

    // 1. Process all categories stored in categoryStore
    for (const cat of categoriesList) {
      if (!cat || typeof cat.name !== 'string' || !cat.name.trim()) continue;
      const lower = cat.name.toLowerCase().trim();
      if (ghostMergedSet.has(lower)) continue;

      const categoryItems = (products || []).filter(p => p.category && p.category.toLowerCase().trim() === lower);
      // If products are loaded, ensure collection has items (or is a valid curated collection)
      if (products && products.length > 0 && categoryItems.length === 0) {
        continue;
      }

      if (!seen.has(lower)) {
        seen.add(lower);
        const preset = iconDataMap.get(lower);
        const resolvedImage = resolveCategoryCoverImage(cat.image, preset?.image, categoryItems);
        if (preset) {
          list.push({
            ...preset,
            tag: cat.badge || preset.tag,
            emoji: cat.icon || preset.emoji,
            image: resolvedImage
          });
        } else {
          // Custom category created in Admin Panel!
          list.push({
            id: cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: cat.name,
            name: cat.name,
            shortName: cat.name,
            image: resolvedImage,
            emoji: cat.icon || '🎀',
            tag: cat.badge || 'New Drop',
            gradient: 'from-pink-400 via-purple-400 to-rose-400',
            ringColor: 'from-pink-500 to-purple-600'
          });
        }
      }
    }

    // 2. Also check any categories that exist on products but not in categoriesList
    if (products && products.length > 0) {
      for (const p of products) {
        if (!p.category) continue;
        const lower = p.category.toLowerCase().trim();
        if (ghostMergedSet.has(lower) || seen.has(lower)) continue;

        seen.add(lower);
        const categoryItems = products.filter(item => item.category && item.category.toLowerCase().trim() === lower);
        const preset = iconDataMap.get(lower);
        const resolvedImage = resolveCategoryCoverImage(null, preset?.image, categoryItems);
        if (preset) {
          list.push({
            ...preset,
            image: resolvedImage
          });
        } else {
          list.push({
            id: lower.replace(/[^a-z0-9]+/g, '-'),
            category: p.category,
            name: p.category,
            shortName: p.category,
            image: resolvedImage,
            emoji: '🎀',
            tag: 'Curated ✨',
            gradient: 'from-pink-400 via-purple-400 to-rose-400',
            ringColor: 'from-pink-500 to-purple-600'
          });
        }
      }
    }

    // 3. Always append "All Collections" at the end
    const allPreset = CATEGORY_ICONS_DATA.find(i => i.category === 'All Items');
    if (allPreset && !seen.has('all items')) {
      const flagshipProduct = products?.find(p => p.id === 'scoop-big') || products?.[0];
      list.push({
        ...allPreset,
        image: flagshipProduct?.image || flagshipProduct?.images?.[0] || allPreset.image
      });
    }

    return list;
  }, [categoriesList, products]);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    soundFX.playPop(450);
  };

  const handleItemClick = (catItem) => {
    soundFX.playPop(550);
    onSelectCategory?.(catItem.category);
  };

  return (
    <section className={`w-full py-4 sm:py-6 bg-gradient-to-b from-pink-50/70 via-white to-pink-50/30 dark:from-[#171024] dark:via-[#1A1326] dark:to-[#171024] border-b border-pink-100/80 dark:border-pink-900/40 relative z-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        
        {/* Header Tagline & Micro-Notice */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B81D24] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-[#B81D24] dark:text-pink-400">
              Explore Collections
            </span>
            <span className="text-neutral-400 text-xs hidden sm:inline">•</span>
            <span className="text-[11px] text-[#554664] dark:text-[#D5CBE2] font-semibold hidden sm:inline">
              Tap any circle to view its collection
            </span>
          </div>

          {/* Desktop Left/Right Scroll Arrows */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-[#B81D24] hover:border-pink-400 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-[#B81D24] hover:border-pink-400 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Row of Category Circles */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex items-start gap-3.5 sm:gap-5 md:gap-6 overflow-x-auto pb-3.5 pt-2.5 px-2 sm:px-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
          >
            {displayItems.map((item) => {
              const isSelected = activeCategory === item.category;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center group shrink-0 snap-center cursor-pointer transition-all duration-300 focus:outline-none"
                >
                  {/* Outer Stylish Circle with Theme Glow Ring */}
                  <div className="relative mb-2">
                    <div 
                      className={`relative p-[2.5px] rounded-full transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-tr ${item.ringColor} shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/50 scale-105`
                          : `bg-gradient-to-tr from-pink-300/80 via-purple-200/80 to-rose-300/80 dark:from-pink-900/60 dark:to-purple-900/60 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-pink-300/40`
                      }`}
                    >
                      {/* Inner Circular Card Frame */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[86px] md:h-[86px] rounded-full overflow-hidden bg-gradient-to-b from-pink-100 via-white to-pink-50 dark:from-[#251A38] dark:via-[#1E172E] dark:to-[#181126] flex items-center justify-center shadow-inner relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/deluxe-giftbox.webp';
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Shimmer Light Reflection effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* Floating Cute Category Badge */}
                    <span 
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-[#1E172E] border-2 shadow-sm flex items-center justify-center text-xs transition-transform group-hover:scale-110 overflow-hidden ${
                        isSelected 
                          ? 'border-[#B81D24] shadow-pink-500/30 animate-bounce' 
                          : 'border-pink-200 dark:border-pink-900'
                      }`}
                    >
                      {item.icon ? (
                        <item.icon className="w-3.5 h-3.5" />
                      ) : (
                        item.emoji
                      )}
                    </span>
                  </div>

                  {/* Category Name Label */}
                  <span 
                    className={`font-display font-bold text-xs sm:text-[13px] tracking-tight text-center max-w-[80px] sm:max-w-[95px] line-clamp-1 transition-colors leading-tight ${
                      isSelected
                        ? 'text-[#B81D24] dark:text-pink-400 font-extrabold'
                        : 'text-[#231733] dark:text-white group-hover:text-[#B81D24] dark:group-hover:text-pink-400'
                    }`}
                  >
                    {item.shortName || item.name}
                  </span>

                  {/* Micro Accent Tag / Price */}
                  <span 
                    className={`text-[10px] font-semibold mt-0.5 tracking-tight transition-colors ${
                      isSelected
                        ? 'text-[#B81D24] dark:text-pink-300 font-bold'
                        : 'text-[#716182] dark:text-neutral-400'
                    }`}
                  >
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

