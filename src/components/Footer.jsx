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
    a: 'We have a strict minimum order requirement of 3 products. Single item orders are not available. You can mix and match any 3 items across Pendants, Bracelets, Eye Masks, and Mystery Scoops!'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We only accept 100% Prepaid payments via UPI QR Code (Google Pay, PhonePe, Paytm, or NetBanking). Once you place your order or message us on WhatsApp (+91 8199922653), we send you the payment QR code.'
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

export default function Footer({ onOpenAdmin, onOpenTracking }) {
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
    setEmailInput('');
  };

  return (
    <footer className="mt-20 border-t border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-b from-white/40 via-pink-50/40 to-pink-100/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Guarantees Bar (India-Centric) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-b border-pink-100 dark:border-pink-900/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <button
            type="button"
            onClick={() => {
              onOpenTracking?.();
              soundFX.playPop(550);
            }}
            className="flex items-center justify-center md:justify-start gap-3 text-left hover:opacity-80 transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-neutral-800 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                <span>Free Delivery Across India</span>
                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold underline ml-1">Track ➔</span>
              </div>
              <div className="text-xs text-neutral-500">On all prepaid orders over ₹499</div>
            </div>
          </button>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                Minimum 3 Products Required
              </div>
              <div className="text-xs text-neutral-500">Mix & match any charms, pendants, or masks</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                100% Prepaid UPI Guarantee
              </div>
              <div className="text-xs text-neutral-500">Verified QR payment via WhatsApp: +91 8199922653</div>
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

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/918199922653"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-xs flex items-center gap-2 text-xs font-bold"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>+91 8199922653</span>
              </a>

              <a
                href="https://www.instagram.com/bhaskar_scoopstorey/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white hover:opacity-90 transition shadow-xs flex items-center gap-2 text-xs font-bold"
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
