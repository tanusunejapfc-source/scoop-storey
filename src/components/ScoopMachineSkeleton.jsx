import React from 'react';
import { Sparkles, Volume2 } from 'lucide-react';

export default function ScoopMachineSkeleton({ isHero = true }) {
  return (
    <section id="scoop-machine" className={`${isHero ? 'pt-2 pb-8 sm:pt-4 sm:pb-12' : 'my-12 sm:my-16'} max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8`}>
      {/* Flagship Hero Header */}
      <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:from-pink-950/80 dark:via-purple-950/70 dark:to-pink-950/80 border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 font-extrabold text-[10px] sm:text-xs tracking-wide uppercase mb-3 shadow-xs max-w-full text-center">
          <span className="w-2 h-2 rounded-full bg-[#E60067] animate-ping shrink-0" />
          <span className="leading-tight">India's 1st 3D Interactive ASMR Mystery Scoop Studio • Cash on Delivery Available</span>
        </div>
        <h1 className="text-2xl sm:text-5xl lg:text-[56px] font-display font-black tracking-tight text-[#231733] dark:text-white leading-[1.12]">
          Collect <span className="shimmer-text">Happiness</span> In Every Single Scoop.
        </h1>

        {/* Live Trust Metrics Bar */}
        <div className="mt-4 flex items-center justify-center gap-2.5 sm:gap-6 text-[11px] sm:text-xs font-bold text-[#554664] dark:text-[#D5CBE2] flex-wrap">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span><strong>15,000+</strong> Lucky Charms Scooped</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span>🚚</span>
            <span><strong>100% Free</strong> Delivery Across India</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 font-black">★ 4.9</span>
            <span>Verified IG Community</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <span className="text-[#E60067] dark:text-pink-400 font-extrabold">
            Loot Board (54 Items) 📋
          </span>
        </div>
      </div>

      {/* 3D Interactive Stage Container Placeholder */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-[#1E172E]/95 p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden">
        {/* Tier Selector & Audio Toggle Bar */}
        <div className="mb-5 pb-4 border-b border-pink-100 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Selected: <strong className="text-[#E60067] dark:text-pink-300">Mini Scoop</strong> (7–8 Products + Extra Gifts)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full max-w-xl p-1.5 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50/50 to-pink-50 dark:from-[#251A38] dark:to-[#1E172E] border border-pink-200/80 dark:border-pink-800/50 shadow-inner">
            <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#D8005A] text-white flex items-center justify-center gap-1.5 font-display font-extrabold text-xs">
              <span>Mini Scoop</span>
              <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-white/20 text-yellow-200">₹799</span>
            </div>
            <div className="py-2 px-3 rounded-xl text-neutral-600 dark:text-neutral-300 flex items-center justify-center gap-1.5 font-display font-extrabold text-xs">
              <span>Midi Scoop</span>
              <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-[#E60067]">₹1299</span>
            </div>
            <div className="py-2 px-3 rounded-xl text-neutral-600 dark:text-neutral-300 flex items-center justify-center gap-1.5 font-display font-extrabold text-xs">
              <span>Big Scoop</span>
              <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-[#E60067]">₹1799</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-neutral-800 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-neutral-700 flex items-center gap-1.5 shrink-0">
            <Volume2 className="w-3.5 h-3.5 text-pink-600" />
            <span>ASMR Audio Ready</span>
          </div>
        </div>

        {/* Shimmering 3D Stage Placeholder */}
        <div className="relative w-full h-[400px] sm:h-[460px] md:h-[520px] rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-pink-200/90 dark:border-pink-900/60 shadow-[0_20px_50px_-15px_rgba(230,0,103,0.18)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl bg-gradient-to-br from-[#FFF5F8] via-[#FFE8F0] to-[#FED7E2] dark:from-[#200B29] dark:via-[#1A0822] dark:to-[#120519] flex flex-col items-center justify-center p-6 text-center">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pink-400/20 dark:bg-pink-600/20 blur-3xl pointer-events-none animate-pulse" />

          {/* Cute Loading Avatar & Shimmer */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 dark:from-pink-900 dark:via-purple-900 dark:to-neutral-800 p-1 shadow-xl flex items-center justify-center border-2 border-pink-300/80 dark:border-pink-700">
              <span className="text-4xl sm:text-5xl animate-bounce">🍨</span>
              <div className="absolute inset-0 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <p className="font-display font-extrabold text-base sm:text-lg text-[#231733] dark:text-white">
                Preparing 3D ASMR Studio... ✨
              </p>
              <p className="text-xs text-[#554664] dark:text-[#D5CBE2] font-medium">
                Polishing Lotus Crystal Coupe & 15,000+ Kawaii Charms
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-pink-200 dark:border-pink-900 text-[11px] font-bold text-[#E60067] dark:text-pink-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E60067] animate-ping" />
              <span>Tap any tier or scroll down to browse 50+ aesthetic goodies</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
