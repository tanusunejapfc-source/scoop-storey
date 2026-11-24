import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Eye, Star, Flame, Gem } from 'lucide-react';
import { soundFX } from '../utils/audio';
import MiniScoopIcon from './MiniScoopIcon';

const HERO_FEATURED_COLLECTIONS = [
  {
    id: 'pendants',
    title: '18K Anti-Tarnish Pendants',
    category: 'Pendants & Chains',
    tagline: 'Waterproof • Sweatproof • Real PVD Gold',
    badge: 'Bestseller 🔥',
    image: '/images/pendants.webp',
    price: '₹199',
    accentColor: 'from-amber-500 to-pink-500',
    tags: ['18K PVD Gold', 'Waterproof', 'No Green Skin']
  },
  {
    id: 'wallets',
    title: 'Korean Wallets & Bags',
    category: 'Korean wallets and bags',
    tagline: 'Diamond Quilt • Pastel Kawaii Chic',
    badge: 'Trending 👛',
    image: '/images/korean-wallets.webp',
    price: '₹249',
    accentColor: 'from-pink-500 to-rose-400',
    tags: ['Pastel Aesthetics', 'Gold Zip Hardware', 'Viral on Reels']
  },
  {
    id: 'bracelets',
    title: 'Custom Charm Bracelets',
    category: 'Bracelets',
    tagline: 'Hand-strung with Love & Kawaii Charms',
    badge: 'Customer Fav 🎀',
    image: '/images/charm-bracelets.webp',
    price: '₹149',
    accentColor: 'from-purple-500 to-pink-500',
    tags: ['Adjustable Fit', 'Enamel Charms', 'Gift Ready']
  },
  {
    id: 'scoop-vault',
    title: '3D ASMR Mystery Scoops',
    category: 'Mystery Scoops',
    tagline: 'Dip & Cascade 54+ Rare Lucky Charms',
    badge: 'VIP Studio 🍨',
    image: '/images/deluxe-giftbox.webp',
    price: '₹299',
    accentColor: 'from-rose-500 to-purple-600',
    tags: ['Live Reel Packing', 'Guaranteed Surprises', 'ASMR Audio']
  }
];

export default function BoutiqueHero({ onSelectCategory, isDark = false }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Gentle auto-rotation every 5 seconds if user hasn't clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_FEATURED_COLLECTIONS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const activeItem = HERO_FEATURED_COLLECTIONS[activeIdx];

  const handleSelectFeatured = (item) => {
    soundFX.playPop(520);
    if (onSelectCategory) {
      onSelectCategory(item.category);
    } else {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCollections = (e) => {
    e.preventDefault();
    soundFX.playPop(500);
    const target = document.getElementById('menu');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToScoopMachine = (e) => {
    e.preventDefault();
    soundFX.playPop(550);
    const target = document.getElementById('scoop-machine');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-4 pb-8 md:pt-10 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Aesthetic Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-pink-400/15 dark:bg-pink-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-purple-400/15 dark:bg-purple-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Boutique Headline, Story & Quick CTAs     */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left z-10">
          
          {/* Top Boutique Live Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-[11px] sm:text-xs tracking-wide uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span>India 🇮🇳 • FREE Delivery on ₹499+ • Cash on Delivery</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-extrabold tracking-tight text-stone-900 dark:text-white leading-[1.12]">
            Collect <span className="shimmer-text">Happiness</span> In Every Single Scoop.
          </h1>

          {/* Boutique Tagline */}
          <p className="text-sm sm:text-base md:text-lg text-[#6B5E5B] dark:text-[#E0D7EB] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            India's viral boutique for <strong className="text-rose-600 dark:text-rose-300 font-semibold">18K anti-tarnish jewelry</strong>, pastel Korean quilted bags, handmade charm bracelets, and interactive 3D ASMR mystery scoops — all hand-packed live on Instagram Reels!
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
            <a
              href="#menu"
              onClick={handleScrollToCollections}
              className="w-full sm:w-auto btn-3d-pink px-7 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition cursor-pointer text-center"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#scoop-machine"
              onClick={handleScrollToScoopMachine}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-neutral-800/90 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-white font-display font-semibold text-sm sm:text-base hover:bg-stone-50 dark:hover:bg-neutral-700 hover:border-stone-400 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <MiniScoopIcon className="w-4 h-4 text-rose-500" />
              <span>Dip 3D Scoop Studio</span>
            </a>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-3 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left text-[11px] sm:text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold border-t border-pink-200/70 dark:border-pink-900/40 w-full max-w-md mx-auto lg:mx-0">
            <div className="px-1">
              <strong className="text-[#231733] dark:text-white text-xs sm:text-sm font-extrabold block leading-tight">15,000+</strong>
              <span className="text-[10px] sm:text-xs leading-tight">Charms Scooped</span>
            </div>
            <div className="px-1 border-x border-pink-200 dark:border-pink-800">
              <strong className="text-[#231733] dark:text-white text-xs sm:text-sm font-extrabold block leading-tight">100%</strong>
              <span className="text-[10px] sm:text-xs leading-tight">Cash on Delivery</span>
            </div>
            <div className="px-1">
              <strong className="text-[#231733] dark:text-white text-xs sm:text-sm font-extrabold block leading-tight">4.9 ★</strong>
              <span className="text-[10px] sm:text-xs leading-tight">IG Community</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Luxury Boutique Bento Visual Showcase     */}
        {/* Replaces heavy 3D canvas with lightning-fast elegance   */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 w-full max-w-xl mx-auto">
          <div className="relative rounded-3xl p-3 sm:p-4 bg-gradient-to-br from-white/95 via-pink-50/70 to-purple-50/60 dark:from-[#1D142A]/95 dark:via-[#241738]/90 dark:to-[#170F22]/95 border-2 border-pink-200/90 dark:border-pink-900/60 shadow-xl backdrop-blur-xl">
            
            {/* Top Showcase Header Pills */}
            <div className="flex items-center justify-between gap-2 mb-3 px-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-pink-200 dark:border-pink-800 text-[11px] font-extrabold text-[#E60067] dark:text-pink-300 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Featured Curation</span>
              </div>
              
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                Swipe & Tap to Explore
              </span>
            </div>

            {/* Featured Active Hero Card */}
            <div 
              onClick={() => handleSelectFeatured(activeItem)}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full cursor-pointer bg-neutral-100 dark:bg-neutral-800 shadow-md transition-all duration-300"
            >
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-[11px] font-black text-[#E60067] dark:text-pink-300 shadow-xs border border-pink-200">
                  {activeItem.badge}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black shadow-xs">
                  From {activeItem.price}
                </span>
              </div>

              {/* Card Bottom Content */}
              <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                <h3 className="font-display font-extrabold text-base sm:text-xl text-white group-hover:text-pink-200 transition-colors flex items-center gap-1.5">
                  <span>{activeItem.title}</span>
                  <ArrowRight className="w-4 h-4 text-pink-300 transform group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-pink-100 font-medium">
                  {activeItem.tagline}
                </p>
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {activeItem.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Interactive Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-3">
              {HERO_FEATURED_COLLECTIONS.map((item, idx) => {
                const isSelected = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundFX.playPop(480);
                      setActiveIdx(idx);
                    }}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-pink-500 text-white border-pink-600 shadow-md scale-[1.02]'
                        : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 border-pink-200/70 dark:border-pink-900/50 hover:bg-pink-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span className={`text-[10px] sm:text-xs font-black truncate block ${isSelected ? 'text-white' : 'text-[#231733] dark:text-white'}`}>
                      {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
                    </span>
                    <span className={`text-[9px] font-bold block mt-0.5 ${isSelected ? 'text-pink-100' : 'text-pink-600 dark:text-pink-400'}`}>
                      {item.price}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Quick-Action Link */}
            <div className="mt-3 pt-2.5 border-t border-pink-200/70 dark:border-pink-900/40 flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-300 px-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Guaranteed Anti-Tarnish</span>
              </span>
              <button
                type="button"
                onClick={() => handleSelectFeatured(activeItem)}
                className="text-[#E60067] dark:text-pink-400 font-extrabold hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
              >
                <span>Shop {activeItem.category}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
