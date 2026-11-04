import React from 'react';
import { Star, Heart, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Ananya S.',
    handle: '@ananya_glam',
    rating: 5,
    title: 'Literally the cutest package I have ever received! 💖',
    comment: 'I ordered the Big Scoop and seeing Bhaskar pack it on Instagram was so exciting! The charms are surprisingly heavy, polished, and the teddy bear keychain is super fluffy. 10/10.',
    scoopType: 'Big Scoop (3 Scoops)',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Rohan M.',
    handle: '@rohan_aesthetic',
    rating: 5,
    title: 'ASMR packaging is 100% authentic ✨',
    comment: 'The scent of the crinkle shreds and the personalized wax seal made opening it feel like Christmas morning. My girlfriend loved the beaded phone strap and bow heart pendant.',
    scoopType: 'Midi Scoop + Bow Heart Pendant',
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Tanvi P.',
    handle: '@tanvi.crafts',
    rating: 5,
    title: 'Got the rare Gold Vault Bear! 🧸👑',
    comment: 'I was so hoping for the gold bear and I actually got it in my mystery scoop! You can tell Bhaskar genuinely cares about quality. Will order again for sure.',
    scoopType: "Bhaskar's Vault Mega Scoop",
    date: '2 weeks ago'
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 text-xs font-black tracking-wider uppercase mb-2">
          <Heart className="w-3.5 h-3.5 fill-[#E60067] text-[#E60067]" />
          <span>Real Happiness Delivered Across India</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
          Loved by Charm Lovers
        </h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-500" />
            ))}
          </div>
          <span className="font-extrabold text-[#231733] dark:text-white text-base">4.9 / 5.0</span>
          <span className="text-xs text-[#554664] dark:text-[#D5CBE2] font-bold">(2,400+ Scoops Delivered)</span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-200/80 dark:border-pink-900/40 flex flex-col justify-between hover:shadow-xl hover:border-pink-400 transition-all shadow-md"
          >
            <div>
              {/* Star Rating & Verified */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Scoop</span>
                </div>
              </div>

              {/* Title & Body */}
              <h4 className="font-display font-bold text-base text-[#231733] dark:text-white mb-2">
                "{rev.title}"
              </h4>
              <p className="text-xs md:text-sm text-[#483A54] dark:text-[#D5CBE2] leading-relaxed font-body font-medium">
                {rev.comment}
              </p>
            </div>

            {/* Author */}
            <div className="mt-6 pt-4 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
              <div>
                <span className="font-display font-extrabold text-sm text-[#231733] dark:text-white block">
                  {rev.name}
                </span>
                <span className="text-[11px] text-[#E60067] dark:text-pink-400 font-bold">
                  {rev.handle}
                </span>
              </div>
              <span className="text-[10px] text-[#716182] dark:text-neutral-400 font-bold">
                {rev.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
