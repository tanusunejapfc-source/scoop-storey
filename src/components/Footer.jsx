import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Check, 
  ShieldCheck, 
  Truck, 
  Gift 
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { soundFX } from '../utils/audio';

const FAQS = [
  {
    q: 'How does a Mystery Scoop work?',
    a: 'We fill our artisan pastel scoop directly from our charm bowls containing hundreds of handcrafted resin bears, gemstone hearts, star beads, and Kawaii miniatures. Each order is a unique, exciting surprise!'
  },
  {
    q: 'How do I get my order packed on Instagram Reels?',
    a: 'Simply check "Film My Scoop on Instagram Reel" at checkout and provide your Instagram @handle. Bhaskar will tag your username in an upcoming ASMR order unboxing video!'
  },
  {
    q: 'Are the charms safe and non-toxic?',
    a: 'Yes! All charms are made of premium, skin-safe craft polymers with smooth hand-polished edges. They are perfect for keychains, phone cases, bracelets, and desk decor.'
  },
  {
    q: 'How long does shipping take?',
    a: 'Orders are packed within 24-48 hours. Domestic delivery takes 3-5 business days, and international shipping typically takes 7-12 business days with full tracking.'
  }
];

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index) => {
    soundFX.playPop(480);
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    soundFX.playSuccess();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmailInput('');
    }, 4000);
  };

  return (
    <footer className="mt-20 border-t border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-b from-white/40 via-pink-50/40 to-pink-100/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-b border-pink-100 dark:border-pink-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-neutral-800 text-pink-600 dark:text-pink-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                Free Shipping Worldwide
              </div>
              <div className="text-xs text-neutral-500">On all orders over ₹999 ($35)</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                Guaranteed Surprise Joy
              </div>
              <div className="text-xs text-neutral-500">Hand-selected rare charms in every scoop</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-neutral-800 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                100% Non-Toxic Craft
              </div>
              <div className="text-xs text-neutral-500">Premium polished Japanese craft resin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Info (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand-avatar.jpg"
                alt="Bhaskar Scoop Storey"
                className="w-12 h-12 rounded-full border-2 border-pink-400 object-cover shadow-md"
              />
              <div>
                <span className="font-display font-bold text-xl text-neutral-900 dark:text-white">
                  Bhaskar Scoop Storey
                </span>
                <span className="block text-xs font-script font-bold text-pink-500">
                  • Collect Happiness •
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
              The official 3D interactive home of @bhaskar_scoopstorey. Bringing tactile ASMR, Kawaii resin aesthetics, and the joy of unboxing mystery scoops right to your doorstep.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/bhaskar_scoopstorey/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playPop(520)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold text-xs shadow-md hover:opacity-95 transition"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow on Instagram @bhaskar_scoopstorey</span>
              </a>
            </div>
          </div>

          {/* Quick FAQ Accordion (Middle 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h4>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 overflow-hidden text-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left font-display font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between gap-2"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-pink-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-3.5 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-pink-50 dark:border-pink-950/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* VIP Newsletter & Free Gift (Right 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white">
              Join The VIP Scoop Club
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Get secret drop alerts, exclusive discounts, and a <strong>Free Mini Bear Charm</strong> with your first order.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="w-full btn-3d-pink text-white py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Welcome to the Scoop Club!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claim Free Mini Charm</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-6 border-t border-pink-100 dark:border-pink-900/30 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <div>
            © {new Date().getFullYear()} Bhaskar Scoop Storey (@bhaskar_scoopstorey). All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-pink-500 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>for collectors worldwide • Slogan: Collect Happiness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
