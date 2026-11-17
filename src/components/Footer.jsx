import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Sliders 
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

const CURRENT_YEAR = new Date().getFullYear();

const FAQS = [
  {
    q: 'What is the minimum order requirement?',
    a: 'You can order with any 3 items, OR if any single or combo item total is ₹499 or above (such as our Mini, Midi, or Big Mystery Scoops)! You can freely mix and match across Pendants, Bracelets, Eye Masks, and Mystery Scoops.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept 100% Prepaid UPI (PhonePe, Google Pay, Paytm, BHIM) as well as Partial COD (Advance booking via UPI + balance in cash on delivery). Verified QR & direct WhatsApp support: +91 8199922653.'
  },
  {
    q: 'How does a Mystery Scoop work?',
    a: 'We dip our rose-gold scoop directly into our charm bowls containing hundreds of handcrafted resin bears, gemstone hearts, star beads, and Kawaii miniatures. Each order is packed as an exciting surprise!'
  },
  {
    q: 'How do I get my order packed on an Instagram Reel?',
    a: 'Simply check "Film My Order on IG Reel" in your cart or on WhatsApp, and provide your Instagram @handle. Bhaskar will tag your username in an upcoming ASMR order packing video!'
  },
  {
    q: 'How long does delivery take across India?',
    a: 'Orders are dispatched within 24-48 hours. Delivery takes 3-5 business days across India with full courier tracking.'
  }
];

export default function Footer({ onOpenAdmin, onOpenTracking, onOpenPolicy }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index) => {
    soundFX.playPop(480);
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;
    try {
      const raw = localStorage.getItem('bhaskar_newsletter_subscribers');
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(cleanEmail)) {
        list.push(cleanEmail);
        localStorage.setItem('bhaskar_newsletter_subscribers', JSON.stringify(list));
      }
    } catch (_) {}
    soundFX.playSuccess();
    setSubscribed(true);
    setEmailInput('');
  };

  return (
    <footer className="mt-20 border-t border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-b from-white/40 via-pink-50/40 to-pink-100/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 pb-28 sm:pb-20 md:pb-16">
      {/* Guarantees Bar (India-Centric) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-b border-pink-100 dark:border-pink-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 max-w-xl md:max-w-none mx-auto">
          <button
            type="button"
            onClick={() => {
              onOpenTracking?.();
              soundFX.playPop(550);
            }}
            className="w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-800/60 border border-pink-200/60 dark:border-neutral-700/60 shadow-xs hover:border-pink-300 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-neutral-800 transition cursor-pointer group text-left"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                <span>Free Delivery Across India</span>
                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold underline">Track ➔</span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">100% Free on all prepaid orders</div>
            </div>
          </button>

          <div className="w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-800/60 border border-pink-200/60 dark:border-neutral-700/60 shadow-xs text-left">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                3 Items or Order ₹499+
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Mix & match any 3 items or order any scoop/item above ₹499</div>
            </div>
          </div>

          <div className="w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-800/60 border border-pink-200/60 dark:border-neutral-700/60 shadow-xs text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                Prepaid UPI & Partial COD Guarantee
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Verified QR Scanner & UPI • WhatsApp: +91 8199922653</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Brand Bio (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/brand-avatar.jpg" 
                alt="Bhaskar Scoop Storey" 
                className="w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-md"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white leading-tight">
                  Bhaskar Scoop Storey
                </h3>
                <span className="text-xs text-pink-600 dark:text-pink-400 font-script font-bold">
                  • Collect Happiness In Every Scoop •
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
              India's premier 3D Kawaii mystery scoop studio. Bringing sensory ASMR unboxings, handcrafted resin bear charms, aesthetic Korean pendants, and delicate bracelets straight to your doorstep.
            </p>

            <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2.5 pt-2">
              <a
                href="https://wa.me/918199922653"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-xs flex items-center justify-center gap-2 text-xs font-bold"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>+91 8199922653</span>
              </a>

              <a
                href="https://www.instagram.com/bhaskar_scoopstorey/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white hover:opacity-90 transition shadow-xs flex items-center justify-center gap-2 text-xs font-bold"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@bhaskar_scoopstorey</span>
              </a>
            </div>
          </div>

          {/* Quick FAQ Accordion (Middle 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2">
              Store Rules & FAQs
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
              Get drop alerts and a <strong>Free Mini Charm</strong> with your first order.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
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

        {/* Policy Links Row */}
        <div className="mt-8 pt-6 border-t border-pink-100 dark:border-pink-900/30 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-neutral-600 dark:text-neutral-400">
          <button
            type="button"
            onClick={() => onOpenPolicy?.('shipping')}
            className="hover:text-[#E60067] dark:hover:text-pink-400 transition cursor-pointer"
          >
            Shipping Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenPolicy?.('returns')}
            className="hover:text-[#E60067] dark:hover:text-pink-400 transition cursor-pointer"
          >
            Returns & Replacements
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenPolicy?.('contact')}
            className="hover:text-[#E60067] dark:hover:text-pink-400 transition cursor-pointer"
          >
            Contact & Support
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenPolicy?.('terms')}
            className="hover:text-[#E60067] dark:hover:text-pink-400 transition cursor-pointer"
          >
            Terms & Privacy
          </button>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-6 border-t border-pink-100 dark:border-pink-900/30 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {CURRENT_YEAR} Bhaskar Scoop Storey (@bhaskar_scoopstorey). Strictly India Deliveries.</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[#E60067] dark:text-pink-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>Store Manager (Admin)</span>
              </button>
            )}
            {onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className="text-[#E60067] dark:text-pink-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Truck className="w-3 h-3" />
                <span>Track Order</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-pink-500 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>for collectors across India • Slogan: Collect Happiness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
