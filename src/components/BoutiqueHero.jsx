import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Eye, Star, Flame, Gem, Truck, Check, MessageCircle } from 'lucide-react';
import { soundFX } from '../utils/audio';
import MiniScoopIcon from './MiniScoopIcon';
import WhatsAppIcon from './WhatsAppIcon';

const HERO_FEATURED_COLLECTIONS = [
  {
    id: 'stationery',
    title: 'Aesthetic Stationery',
    caption: 'Aesthetic Stationery ♡',
    category: 'Kawaii Stationery',
    tagline: 'Pastel Diaries, Highlighters & Sticky Notes',
    badge: 'Popular 📝',
    image: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024332-291296.jpg',
    price: '₹149',
    tags: ['Korean Import', 'Smooth Paper', 'Pastel Vibe']
  },
  {
    id: 'pendants',
    title: '18K Anti-Tarnish Pendants',
    caption: '18K Anti-Tarnish Jewelry ♡',
    category: 'Pendants & Chains',
    tagline: 'Waterproof • Sweatproof • Real PVD Gold',
    badge: 'Bestseller 🔥',
    image: '/images/pendants.webp',
    price: '₹199',
    tags: ['18K PVD Gold', 'Waterproof', 'No Green Skin']
  },
  {
    id: 'wallets',
    title: 'Korean Wallets & Bags',
    caption: 'Pastel Korean Bags ♡',
    category: 'Korean wallets and bags',
    tagline: 'Diamond Quilt • Pastel Kawaii Chic',
    badge: 'Trending 👛',
    image: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024496-677056.jpg',
    price: '₹249',
    tags: ['Pastel Aesthetics', 'Gold Hardware', 'Viral on Reels']
  },
  {
    id: 'scoop-vault',
    title: '3D ASMR Mystery Scoops',
    caption: 'Perfect for Gifting ♡',
    category: 'Mystery Scoops',
    tagline: 'Dip & Cascade 54+ Rare Lucky Charms',
    badge: 'VIP Studio 🍨',
    image: '/images/deluxe-giftbox.webp',
    price: '₹299',
    tags: ['Live Reel Packing', 'Guaranteed Surprises', 'ASMR Audio']
  }
];

export default function BoutiqueHero({ onSelectCategory, isDark = false }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Rotating countdown timer (Seoulmate style)
  const [timeLeft, setTimeLeft] = useState({ hours: '05', minutes: '16', seconds: '05' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gentle auto-rotation every 5.5 seconds
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
    }
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToCollections = (e) => {
    e.preventDefault();
    soundFX.playPop(500);
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToScoopMachine = (e) => {
    e.preventDefault();
    soundFX.playPop(550);
    document.getElementById('scoop-machine')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-3 pb-8 md:pt-6 md:pb-12 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Soft Blush Glow */}
      <div className="absolute top-4 left-1/4 w-96 h-96 rounded-full bg-[#FDF2F4] dark:bg-pink-950/20 blur-3xl pointer-events-none -z-10" />

      {/* Main Hero Container */}
      <div className="rounded-3xl bg-[#FFF9F4] dark:bg-[#1E1724] border border-[#F3D7DC] dark:border-stone-800 p-5 sm:p-8 lg:p-10 transition-colors shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Seoulmate Exact Editorial Headline & CTAs   */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            
            {/* Top Subtitle Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-900 border border-[#EAE4E5] text-[#1A2536] dark:text-stone-200 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase shadow-2xs">
              <span>🌸</span>
              <span className="font-semibold">KOREAN STATIONERY, JEWELRY & ASMR SCOOPS</span>
              <span>🌸</span>
            </div>

            {/* Modern Korean Aesthetic Headline (Outfit & Caveat Script) */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-extrabold text-[#1A2536] dark:text-white leading-[1.14]">
              Cute Details <span className="font-display font-semibold text-[#1A2536] dark:text-stone-300">for a</span>
              <br />
              <span className="font-script text-4xl sm:text-6xl lg:text-[64px] text-[#B81D24] block mt-1">
                Happier Everyday ♡
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm md:text-base text-[#5A6270] dark:text-stone-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              India's favorite Korean aesthetic boutique for <strong className="text-[#1A2536] dark:text-white font-bold">18K anti-tarnish jewelry</strong>, pastel quilted bags, cute stationery, and interactive 3D ASMR mystery scoops — all packed with love!
            </p>

            {/* 4 Feature Pills (Stationery, Home Decor, Gifts, Korean Lifestyle) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-left">
              {[
                { icon: '📝', title: 'Aesthetic Stationery', cat: 'Kawaii Stationery' },
                { icon: '💎', title: '18K PVD Jewelry', cat: 'Pendants & Chains' },
                { icon: '👛', title: 'Korean Pastel Bags', cat: 'Korean wallets and bags' },
                { icon: '🍨', title: '3D ASMR Scoops', href: '#scoop-machine' }
              ].map((feat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundFX.playPop(480);
                    if (feat.cat) onSelectCategory?.(feat.cat);
                    const target = document.getElementById(feat.href ? feat.href.slice(1) : 'menu');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#EAE4E5] dark:border-stone-800 hover:border-[#B81D24] transition flex items-center gap-2 cursor-pointer shadow-2xs group text-left"
                >
                  <span className="text-base shrink-0">{feat.icon}</span>
                  <span className="text-[11px] font-bold text-[#1A2536] dark:text-stone-200 group-hover:text-[#B81D24] line-clamp-1">
                    {feat.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Seoulmate Exact Crimson Banner: 3 Guarantees */}
            <div className="bg-[#B81D24] text-white rounded-2xl p-3 sm:p-3.5 shadow-sm grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span className="text-base sm:text-lg">🚚</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold leading-tight">Fast Delivery</div>
                  <div className="text-[9px] text-pink-100 font-medium">Pan-India Dispatch</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border-x border-white/20 px-1">
                <span className="text-base sm:text-lg">🛡️</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold leading-tight">100% COD</div>
                  <div className="text-[9px] text-pink-100 font-medium">Pay at Doorstep</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span className="text-base sm:text-lg">❤️</span>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold leading-tight">Curated with Love</div>
                  <div className="text-[9px] text-pink-100 font-medium">15,000+ Happy Fans</div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons: Solid Crimson Pill & White Outline Pill */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#menu"
                onClick={handleScrollToCollections}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#B81D24] hover:bg-[#9B151C] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#scoop-machine"
                onClick={handleScrollToScoopMachine}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-stone-50 border border-stone-300 hover:border-[#B81D24] text-[#1A2536] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <MiniScoopIcon className="w-4 h-4 text-[#B81D24]" />
                <span>Dip 3D Scoop Studio</span>
              </a>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Polaroid Photo Collage (Seoulmate Style)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className="relative">
              
              {/* Featured Active Polaroid Card */}
              <div 
                onClick={() => handleSelectFeatured(activeItem)}
                className="group relative bg-white dark:bg-stone-900 p-3 sm:p-4 pb-4 sm:pb-5 rounded-2xl shadow-lg border border-[#EAE4E5] dark:border-stone-800 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Washi Tape Effect at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/90 dark:bg-amber-900/50 border border-amber-200/80 rounded-sm shadow-2xs rotate-1 z-20" />

                {/* Polaroid Image Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Price Pill */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-bold text-xs shadow-xs">
                    From {activeItem.price}
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-white/95 text-[#B81D24] font-bold text-[10px] shadow-xs">
                    {activeItem.badge}
                  </div>
                </div>

                {/* Polaroid Handwritten Style Caption (Seoulmate Exact) */}
                <div className="pt-3 text-center">
                  <span className="font-script text-xl sm:text-2xl text-[#1A2536] dark:text-white font-bold block">
                    {activeItem.caption}
                  </span>
                  <span className="text-[11px] font-medium text-[#5A6270] dark:text-stone-300 block">
                    {activeItem.tagline}
                  </span>
                </div>
              </div>

              {/* Quick Polaroid Selectors */}
              <div className="grid grid-cols-4 gap-2 mt-4">
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
                      className={`p-1.5 sm:p-2 rounded-xl text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#B81D24] text-white border-[#B81D24] shadow-sm scale-105'
                          : 'bg-white dark:bg-stone-900 text-[#1A2536] dark:text-stone-300 border-[#EAE4E5] dark:border-stone-800 hover:border-[#B81D24]'
                      }`}
                    >
                      <span className={`text-[10px] sm:text-xs font-bold truncate block ${isSelected ? 'text-white' : ''}`}>
                        {item.title.split(' ')[0]}
                      </span>
                      <span className={`text-[9px] font-semibold block mt-0.5 ${isSelected ? 'text-pink-100' : 'text-[#B81D24]'}`}>
                        {item.price}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM PROMO BAR: Countdown & Action Pills (Seoulmate)   */}
        {/* ======================================================== */}
        <div className="mt-8 pt-5 border-t border-[#F3D7DC] dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Countdown Clock (Seoulmate exact Crimson Boxes) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A2536] dark:text-stone-200">
            <span>Offer ends in</span>
            <div className="flex items-center gap-1 font-mono font-bold text-white text-xs sm:text-sm">
              <span className="bg-[#B81D24] px-2 py-1 rounded shadow-2xs">{timeLeft.hours}</span>
              <span className="text-[#B81D24] font-black">:</span>
              <span className="bg-[#B81D24] px-2 py-1 rounded shadow-2xs">{timeLeft.minutes}</span>
              <span className="text-[#B81D24] font-black">:</span>
              <span className="bg-[#B81D24] px-2 py-1 rounded shadow-2xs">{timeLeft.seconds}</span>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <button
              type="button"
              onClick={handleScrollToCollections}
              className="px-5 py-2 rounded-full bg-[#B81D24] hover:bg-[#9B151C] text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer"
            >
              Shop best sellers
            </button>

            <button
              type="button"
              onClick={handleScrollToScoopMachine}
              className="px-4 py-2 rounded-full bg-white hover:bg-stone-50 border border-stone-300 hover:border-[#B81D24] text-[#1A2536] text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer"
            >
              Make your box • ₹499
            </button>

            <a
              href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey!%20Mujhe%20inquiry%20karni%20hai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </section>
  );
}
