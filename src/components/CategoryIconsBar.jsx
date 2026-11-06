import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';
import MiniScoopIcon from './MiniScoopIcon';

// Curated Category Icons matching Scoop Storey Kawaii Luxury Aesthetic
export const CATEGORY_ICONS_DATA = [
  {
    id: 'mystery-scoops',
    category: 'Mystery Scoops',
    name: 'Mystery Scoops',
    shortName: '3D Scoops',
    image: '/images/scoop-bowl.jpg',
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
    image: '/images/pendants.jpg',
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
    image: '/images/charm-bracelets.jpg',
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
    image: '/images/bracelets-anklets.jpg',
    emoji: '💫',
    tag: 'Liquid Gold',
    gradient: 'from-amber-400 via-orange-400 to-pink-400',
    ringColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 'eye-masks',
    category: 'Eye Masks',
    name: 'Eye Masks',
    shortName: 'Eye Masks',
    image: '/images/eyemasks-skincare.jpg',
    emoji: '🌙',
    tag: 'Cloud Velvet',
    gradient: 'from-indigo-400 via-purple-400 to-pink-400',
    ringColor: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'self-care',
    category: 'Self-Care',
    name: 'Self-Care',
    shortName: 'Self-Care',
    image: '/images/asmr-packing.jpg',
    emoji: '🌸',
    tag: 'Glow Routine',
    gradient: 'from-rose-400 via-teal-400 to-emerald-400',
    ringColor: 'from-rose-500 to-teal-500'
  },
  {
    id: 'korean-wallets',
    category: 'Korean Wallets',
    name: 'Korean Wallets',
    shortName: 'Wallets',
    image: '/images/korean-wallets.jpg',
    emoji: '👛',
    tag: 'Quilted Mini',
    gradient: 'from-pink-400 via-purple-400 to-rose-400',
    ringColor: 'from-pink-500 to-purple-600'
  },
  {
    id: 'all-collections',
    category: null, // null represents All Items
    name: 'All Collections',
    shortName: 'Explore All',
    image: '/images/deluxe-giftbox.jpg',
    emoji: '🛍️',
    tag: 'All Goodies',
    gradient: 'from-purple-500 via-pink-500 to-amber-400',
    ringColor: 'from-purple-600 to-pink-500'
  }
];

export default function CategoryIconsBar({ 
  activeCategory, 
  onSelectCategory,
  className = ''
}) {
  const scrollContainerRef = useRef(null);

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
            <span className="w-2 h-2 rounded-full bg-[#E60067] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-[#E60067] dark:text-pink-400">
              Shop By Category
            </span>
            <span className="text-neutral-400 text-xs hidden sm:inline">•</span>
            <span className="text-[11px] text-[#554664] dark:text-[#D5CBE2] font-semibold hidden sm:inline">
              Tap any circle to explore its collection
            </span>
          </div>

          {/* Desktop Left/Right Scroll Arrows */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-[#E60067] hover:border-pink-400 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-[#E60067] hover:border-pink-400 transition flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
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
            className="flex items-start gap-4 sm:gap-6 md:gap-7 overflow-x-auto pb-3.5 pt-2.5 px-3 sm:px-6 scrollbar-none snap-x snap-mandatory scroll-smooth lg:justify-between"
          >
            {CATEGORY_ICONS_DATA.map((item) => {
              const isSelected = item.category === null 
                ? (activeCategory === null || activeCategory === 'All Items')
                : (activeCategory === item.category);

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
                            e.currentTarget.src = '/images/deluxe-giftbox.jpg';
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
                          ? 'border-[#E60067] shadow-pink-500/30 animate-bounce' 
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
                        ? 'text-[#E60067] dark:text-pink-400 font-extrabold'
                        : 'text-[#231733] dark:text-white group-hover:text-[#E60067] dark:group-hover:text-pink-400'
                    }`}
                  >
                    {item.shortName || item.name}
                  </span>

                  {/* Micro Accent Tag / Price */}
                  <span 
                    className={`text-[10px] font-semibold mt-0.5 tracking-tight transition-colors ${
                      isSelected
                        ? 'text-[#E60067] dark:text-pink-300 font-bold'
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

