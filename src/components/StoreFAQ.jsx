import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Droplet, 
  Film, 
  Truck, 
  Search,
  Heart,
  MessageCircle
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';

const FAQ_CATEGORIES = [
  { id: 'care', label: 'Jewelry Care & Anti-Tarnish', icon: Droplet },
  { id: 'orders', label: 'Order Rules & Payment', icon: ShieldCheck },
  { id: 'scoops', label: 'Mystery Scoops & Reels', icon: Film },
  { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
];

const FAQS_DATA = [
  // JEWELRY CARE
  {
    category: 'care',
    q: 'How durable is the 18K Gold PVD coating & Anti-Tarnish plating?',
    a: 'Our pendants and chains are finished with advanced 18K Gold PVD (Physical Vapor Deposition) coating. Unlike traditional plating, PVD bonding is highly resistant to sweat, minor moisture, and daily tarnish. With standard care, your piece retains its lustrous golden shine for 1–2+ years.'
  },
  {
    category: 'care',
    q: 'Can I wear the jewelry while washing hands or showering?',
    a: 'Yes, our anti-tarnish pieces are water-resistant. However, to maximize the lifespan of the mirror polish, we advise avoiding direct exposure to harsh chemical perfumes, pool chlorine, and saltwater. Simply pat dry with a soft microfiber cloth if it gets wet.'
  },
  {
    category: 'care',
    q: 'How should I store my Scoop Storey pieces?',
    a: 'Store each piece individually in the airtight pink Kawaii ziplock pouch provided in your order box. Keeping items separate prevents tangled chains and surface micro-scratches.'
  },
  {
    category: 'care',
    q: 'Is the jewelry hypoallergenic and skin-safe?',
    a: 'Yes! All chains and charm bases are 100% nickel-free and lead-free stainless steel or premium brass, making them gentle on sensitive skin without causing green marks or irritation.'
  },

  // ORDER RULES
  {
    category: 'orders',
    q: 'Why is there a minimum 3 products requirement to place an order?',
    a: 'Scoop Storey is a boutique mystery gift & aesthetic accessories studio. To keep our product prices affordable (as low as ₹99–₹199 per piece) while offering Free Express Delivery across India on orders over ₹499, single-item orders cannot be sustained. You can freely mix and match any 3 items from Pendants, Bracelets, Eye Masks, and Mystery Scoops!'
  },
  {
    category: 'orders',
    q: 'How does the Prepaid UPI / QR Code payment process work?',
    a: 'We are 100% Prepaid to prevent transit damage and delivery fraud. Once you enter your delivery address in the Bag, our system generates a verified UPI QR Code and handles instant UTR confirmation. You can also chat directly on WhatsApp (+91 8199922653) to pay via Google Pay, PhonePe, or Paytm.'
  },
  {
    category: 'orders',
    q: 'What if I made a payment but forgot to note down the UTR / Ref Number?',
    a: 'No worries at all! Send a screenshot of your payment transfer on WhatsApp (+91 8199922653) along with your Order ID or phone number. Bhaskar verifies all incoming transactions manually and updates your order within minutes.'
  },

  // MYSTERY SCOOPS & REELS
  {
    category: 'scoops',
    q: 'What is inside each Mystery Scoop tier?',
    a: 'Every scoop is drawn live from our charm bowl filled with resin gummy bears, gemstone hearts, crystal bow charms, pastel beads, and jewelry accessories:\n• Mini Scoop (₹799): 7–8 handcrafted charms & surprises + Free Gifts\n• Midi Scoop (₹1299): 12–15 charms & surprises (2 deep scoops) + Free Gifts\n• Big Scoop (₹1799): 20+ items + extra deluxe gifts + free priority shipping!'
  },
  {
    category: 'scoops',
    q: 'How do I request my order to be filmed for an Instagram ASMR Reel?',
    a: 'During checkout, simply check the box "Film My Order on IG Reel" and enter your Instagram @handle. When packing your order, Bhaskar will record the ASMR dipping and unboxing video and tag your handle on @bhaskar_scoopstorey!'
  },
  {
    category: 'scoops',
    q: 'Can I request specific charm colors or themes in my scoop?',
    a: 'Yes! Mention your preferences in the "Special Packing Notes" box at checkout (e.g. "mostly pink & lavender" or "extra gummy bears"). While mystery scoops are random by nature, Bhaskar loves tailoring scoops to your aesthetic wishes.'
  },

  // SHIPPING & DELIVERY
  {
    category: 'shipping',
    q: 'How long does delivery take to my city?',
    a: 'Orders are packed and dispatched within 24 to 48 hours. Express transit takes 3 to 5 business days across all states and metro cities in India (Mumbai, Delhi NCR, Bangalore, Kolkata, Hyderabad, Chennai, Pune, etc.). You can use our "Track Order" tool anytime.'
  },
  {
    category: 'shipping',
    q: 'Which courier partners do you ship with?',
    a: 'We ship through trusted pan-India express carriers including Delhivery, Blue Dart, DTDC, and Xpressbees. Full tracking numbers are provided upon dispatch.'
  },
  {
    category: 'shipping',
    q: 'What is your transit damage or missing item policy?',
    a: 'Customer happiness is our top priority! In the rare event of damage during transit, please take a clear 360° unboxing video when opening the sealed parcel and share it on WhatsApp (+91 8199922653) within 48 hours. We provide a 100% free immediate replacement or credit note.'
  }
];

export default function StoreFAQ() {
  const [activeCategory, setActiveCategory] = useState('care');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCat = searchQuery.trim() ? true : faq.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
  });

  const toggleAccordion = (idx) => {
    soundFX.playPop(480);
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>Care Guide & Help Hub</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Everything You Need To Know
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
          Explore jewelry care instructions, order rules, ASMR Reel recording requests, and nationwide delivery details.
        </p>

        {/* Search Input inside FAQ */}
        <div className="pt-3 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. anti-tarnish, minimum 3, water, reel..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-pink-200 dark:border-pink-900/60 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#E60067]"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery.trim() && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {FAQ_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(0);
                  soundFX.playPop(520);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E60067] to-purple-600 text-white shadow-md scale-105'
                    : 'bg-pink-50/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-pink-200/60 dark:border-neutral-700 hover:bg-pink-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all border ${
                isOpen 
                  ? 'bg-white dark:bg-neutral-800/90 border-pink-300 dark:border-pink-700 shadow-md ring-2 ring-pink-100 dark:ring-pink-950'
                  : 'bg-white/70 dark:bg-neutral-900/60 border-pink-100 dark:border-neutral-800 hover:border-pink-200'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-neutral-700 text-[#E60067] dark:text-pink-300 text-xs font-black flex items-center justify-center shrink-0">
                    Q
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                    {faq.q}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#E60067] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-pink-50 dark:border-neutral-800/60 font-body animate-fadeIn whitespace-pre-line pl-12 sm:pl-14">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-pink-50/50 dark:bg-neutral-800/40 text-neutral-500 text-xs">
            No FAQ questions found matching "{searchQuery}". Ask us directly on WhatsApp!
          </div>
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="mt-10 p-5 rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border border-pink-200/80 dark:border-pink-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-display font-bold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
            <span>Still have a question or special custom request?</span>
            <Sparkles className="w-4 h-4 text-[#E60067]" />
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Bhaskar is active daily on WhatsApp to help with orders, reel packing & queries.
          </p>
        </div>

        <a
          href="https://wa.me/918199922653?text=Hi%20Bhaskar!%20I%20have%20a%20question%20about%20Scoop%20Storey%20jewelry"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFX.playPop(520)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition shrink-0 active:scale-95"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>Chat on WhatsApp (+91 8199922653)</span>
        </a>
      </div>
    </section>
  );
}
