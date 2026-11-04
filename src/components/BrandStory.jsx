import React from 'react';
import { Sparkles, Heart, ShieldCheck, Smile, Gift, Award } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function BrandStory() {
  const values = [
    {
      icon: <Smile className="w-6 h-6 text-pink-600" />,
      title: 'Collect Happiness',
      desc: 'Our motto and North Star. We believe the simple joy of an unexpected cute surprise brightens any day.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      title: 'Artisan Non-Toxic Resin',
      desc: 'All charms are made with high-grade, skin-safe craft polymers with silky smooth hand-polished edges.'
    },
    {
      icon: <Gift className="w-6 h-6 text-amber-600" />,
      title: 'ASMR Sensory Packing',
      desc: 'From custom crinkle shreds to hand-stamped wax seals, the unboxing ritual is designed to soothe your senses.'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: 'Community First',
      desc: 'We film real customer scoops on Instagram and co-create limited editions with our passionate community.'
    }
  ];

  return (
    <section id="story" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual / Photography Collage (Left 6 cols) */}
        <div className="lg:col-span-6 relative">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800">
            <img
              src="/images/deluxe-giftbox.jpg"
              alt="Scoop Storey Unboxing"
              className="w-full h-[420px] object-cover"
            />
          </div>

          {/* Overlapping Floating Badge */}
          <div className="absolute -bottom-6 -right-4 md:right-6 z-20 bg-white/95 dark:bg-[#1E172E]/95 p-4 rounded-2xl shadow-xl border-2 border-pink-300 dark:border-pink-800 flex items-center gap-3 animate-float">
            <img
              src="/brand-avatar.jpg"
              alt="Bhaskar Scoop Storey"
              className="w-12 h-12 rounded-full border-2 border-pink-400 object-cover shadow-sm"
            />
            <div>
              <div className="font-display font-extrabold text-sm text-[#231733] dark:text-white">
                Bhaskar • Creator & Curator
              </div>
              <div className="text-xs text-[#E60067] dark:text-pink-400 font-bold flex items-center gap-1">
                <span>Hand-packing happiness daily</span>
                <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Narrative (Right 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 text-xs font-black tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>The Journey & Craft</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white leading-tight">
              Every Scoop Has A Story. <br />
              <span className="shimmer-text">Meet Scoop Storey.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#483A54] dark:text-[#E0D7EB] font-medium leading-relaxed font-body">
            What started as a creative passion on Instagram <a href="https://www.instagram.com/bhaskar_scoopstorey/" target="_blank" rel="noopener noreferrer" className="text-[#E60067] dark:text-pink-400 font-black underline">@bhaskar_scoopstorey</a> has blossomed into India's favorite boutique for lovers of kawaii charms, sensory ASMR, and the magic of mystery scoops.
          </p>

          <p className="text-sm md:text-base text-[#483A54] dark:text-[#E0D7EB] font-medium leading-relaxed font-body">
            Founded by <strong>Bhaskar</strong>, Scoop Storey was born from the belief that small, tactile treasures can spark deep childhood joy. Every scoop spoon is hand-dipped, every charm is curated for vibrant luster, and every package is wrapped with heartfelt care.
          </p>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/40 shadow-sm"
              >
                <div className="mb-2">{v.icon}</div>
                <h4 className="font-display font-extrabold text-sm text-[#231733] dark:text-white">
                  {v.title}
                </h4>
                <p className="text-xs text-[#554664] dark:text-[#D5CBE2] font-medium mt-1">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
