import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Video, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { soundFX } from '../utils/audio';

export default function PolicyModal({ isOpen, onClose, initialTab = 'shipping' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', label: 'Returns & Replacements', icon: RotateCcw },
    { id: 'contact', label: 'Contact Us', icon: Phone },
    { id: 'terms', label: 'Terms & Privacy', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1A1326] rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between bg-pink-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E60067] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-neutral-900 dark:text-white">
                Store Policies & Support
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Official guidelines for Scoop Storey collectors across India 🇮🇳
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playPop(400);
              onClose?.();
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-pink-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-pink-100 dark:border-pink-900/30">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundFX.playPop(480);
                  setActiveTab(t.id);
                }}
                className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
                  active
                    ? 'border-[#E60067] text-[#E60067] dark:text-pink-400 bg-pink-50/60 dark:bg-pink-950/40'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {/* TAB 1: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/40 space-y-1.5">
                <h4 className="font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>100% Free Express Delivery Across India</span>
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Every order on Scoop Storey is eligible for zero delivery fees anywhere in India when you complete the minimum 3 products requirement.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-neutral-800 text-[#E60067] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-neutral-900 dark:text-white block">Dispatch Timeline:</strong>
                    Orders are hand-assembled, wrapped with bubble wrap and cute confetti, and dispatched within <strong>24 to 48 hours</strong> from our Delhi studio.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-neutral-800 text-[#E60067] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-neutral-900 dark:text-white block">Transit Timeline:</strong>
                    Metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata): <strong>2–4 business days</strong>. Rest of India: <strong>3–6 business days</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-neutral-800 text-[#E60067] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-neutral-900 dark:text-white block">Courier Partners:</strong>
                    We ship via verified courier networks including <strong>Blue Dart, Delhivery, DTDC, and India Post Speed Post</strong> with end-to-end SMS and live web tracking.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RETURNS & REPLACEMENTS */}
          {activeTab === 'returns' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                <h4 className="font-display font-extrabold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>Mandatory 360° Unboxing Video Requirement</span>
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300/90 leading-relaxed">
                  Due to the nature of mystery scoops and personal accessories, a <strong>continuous, uncut 360-degree unboxing video</strong> recorded from outer package seal opening is strictly mandatory to claim replacements for any transit damage or missing items.
                </p>
              </div>

              <div className="space-y-2.5">
                <h5 className="font-bold text-neutral-900 dark:text-white">Our Replacement Policy:</h5>
                <ul className="space-y-2 text-xs list-disc list-inside">
                  <li><strong>Transit Damage or Defective Items:</strong> If any charm, jewelry piece, or mug arrives broken, send your uncut unboxing video to our WhatsApp (+91 8199922653) within <strong>48 hours</strong> of parcel delivery. We will immediately dispatch a free replacement!</li>
                  <li><strong>Mystery Scoop Nature:</strong> Mystery scoops are exciting random surprises hand-selected from our live charm bowls. Since items are mystery surprises, returns based on personal style preference are not accepted.</li>
                  <li><strong>Cancellations:</strong> You can cancel your order within <strong>3 hours</strong> of placing it before the packing stage begins by sending a message on WhatsApp.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                We are always excited to hear from you! Reach out for order status, custom scoop requests, or wholesale inquiries:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="https://wa.me/918199922653"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 hover:scale-[1.01] transition"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block">WhatsApp Support</span>
                    <strong className="text-xs text-neutral-900 dark:text-white">+91 8199922653</strong>
                  </div>
                </a>

                <a
                  href="mailto:bhaskar.scoopstorey@gmail.com"
                  className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3 hover:scale-[1.01] transition"
                >
                  <div className="p-2.5 rounded-xl bg-[#E60067] text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">Official Email</span>
                    <strong className="text-xs text-neutral-900 dark:text-white truncate block">bhaskar.scoopstorey@gmail.com</strong>
                  </div>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-neutral-800/50 border border-pink-100 dark:border-neutral-700 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                  <MapPin className="w-4 h-4 text-[#E60067] shrink-0" />
                  <span><strong>Studio Address:</strong> Scoop Storey Studio, Delhi NCR, India (Pincode: 110001)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                  <Clock className="w-4 h-4 text-[#E60067] shrink-0" />
                  <span><strong>Working Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS & PRIVACY */}
          {activeTab === 'terms' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <h5 className="font-bold text-neutral-900 dark:text-white">Customer Data & Privacy:</h5>
              <p>
                Scoop Storey respects your privacy. Customer names, delivery addresses, and phone numbers are stored strictly for order fulfillment, courier shipping label generation, and WhatsApp updates. We never sell or share your personal details with third-party marketers.
              </p>

              <h5 className="font-bold text-neutral-900 dark:text-white pt-2">100% Prepaid UPI Payments:</h5>
              <p>
                All payments are processed via verified Indian UPI QR standards (Google Pay, PhonePe, Paytm, BHIM, CRED). Transactions are encrypted and directly routed to the verified store account of Bhaskar Scoop Storey.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-pink-100 dark:border-pink-900/40 bg-pink-50/30 dark:bg-neutral-900/30 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Boutique Store in India 🇮🇳</span>
          </span>
          <button
            onClick={() => {
              soundFX.playPop(400);
              onClose?.();
            }}
            className="px-4 py-2 rounded-xl bg-pink-100 dark:bg-neutral-800 hover:bg-pink-200 text-[#E60067] dark:text-pink-300 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
