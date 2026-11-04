import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Video, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';

export const PRODUCTS = [
  // --- MYSTERY SCOOPS ---
  {
    id: 'scoop-mini',
    name: 'Scoop Storey - Mini Scoop',
    category: 'Mystery Scoops',
    badge: 'Starter Favorite 🎀',
    priceINR: 199,
    image: '/images/scoop-bowl.jpg',
    description: 'Our iconic mini mystery scoop filled with 15-20 cute colorful resin charms, beads, and a pink storage pouch.',
    includes: ['15-20 Handpicked Charms', 'Gummy Bears & Star Beads', 'Cute Organza Bag', 'Only Prepaid Delivery']
  },
  {
    id: 'scoop-midi',
    name: 'Scoop Storey - Midi Scoop',
    category: 'Mystery Scoops',
    badge: 'Best Value 🔥',
    priceINR: 349,
    image: '/images/scoop-bowl.jpg',
    description: '2 deep satisfying scoops with 30+ charms, resin miniatures, pastel pearls, and sticker freebies.',
    includes: ['30+ Curated Charms', 'Resin Minis & Flower Beads', 'Filmed on IG Reel Request', 'Free Sticker Pack']
  },
  {
    id: 'scoop-big',
    name: 'Scoop Storey - Big Scoop',
    category: 'Mystery Scoops',
    badge: 'Collector Pack ✨',
    priceINR: 499,
    image: '/images/deluxe-giftbox.jpg',
    description: '3 deep scoops overflowing with 50+ charms, a surprise keychain, and a mystery blind box surprise.',
    includes: ['50+ Premium Charms', 'Teddy Bear Plush Keychain', 'Mystery Blind Surprise', 'ASMR Packing Video Eligible']
  },
  {
    id: 'scoop-vault',
    name: "Bhaskar's Vault Mega Scoop",
    category: 'Mystery Scoops',
    badge: '👑 VIP Mega Scoop',
    priceINR: 899,
    image: '/images/deluxe-giftbox.jpg',
    description: 'The ultimate Scoop Storey experience: 5 massive scoops, 80+ luxury charms, plus a guaranteed rare Gold Vault Bear!',
    includes: ['80+ Luxury Charms', 'Rare Gold Vault Charm', 'Deluxe Storage Box', 'Guaranteed IG Reel Feature']
  },

  // --- PENDANTS & CHAINS ---
  {
    id: 'pend-bow-heart',
    name: 'Bow Heart Aesthetic Pendant',
    category: 'Pendants & Chains',
    badge: 'Trending on Insta 🎀',
    priceINR: 199,
    image: '/images/pendants.jpg',
    description: 'A dainty rose-gold bow tied atop a faceted crystal heart charm on a non-tarnish shimmer chain.',
    includes: ['Anti-Tarnish Plating', 'Lobster Clasp with Extender', 'Velvet Jewelry Pouch', 'Prepaid Shipping']
  },
  {
    id: 'pend-snake-chain',
    name: 'Snake Chain Minimalist Pendant',
    category: 'Pendants & Chains',
    badge: 'Daily Wear ✨',
    priceINR: 199,
    image: '/images/pendants.jpg',
    description: 'Sleek, fluid herringbone snake link chain featuring a polished micro-pendant for modern layering.',
    includes: ['Liquid Smooth Snake Links', '18k Gold PVD Coating', 'Water-Resistant Finish', 'Hypoallergenic']
  },
  {
    id: 'pend-little-heart',
    name: 'Little Heart Dainty Pendant',
    category: 'Pendants & Chains',
    badge: 'Cute Essential 💖',
    priceINR: 199,
    image: '/images/pendants.jpg',
    description: 'A delicate polished puffed heart pendant that rests gracefully on your collarbone.',
    includes: ['Subtle Mirror Polish', 'Adjustable 16-18" Length', 'Lightweight & Comfortable', 'Gift Packaging']
  },
  {
    id: 'pend-monalisa',
    name: 'Monalisa Lustrous Pearl Pendant',
    category: 'Pendants & Chains',
    badge: 'Elegant Classic 🦪',
    priceINR: 199,
    image: '/images/pendants.jpg',
    description: 'Lustrous teardrop pearl pendant accented with a sparkling pavé stone setting for timeless charm.',
    includes: ['Lustrous Finish', 'Tarnish-Resistant Alloy', 'Gift Ready Display Card']
  },
  {
    id: 'pend-sun',
    name: 'Sunburst Celestial Pendant',
    category: 'Pendants & Chains',
    badge: 'Golden Glow ☀️',
    priceINR: 199,
    image: '/images/pendants.jpg',
    description: 'Radiant embossed sun pendant with textured sun rays capturing ambient warmth and positivity.',
    includes: ['Embossed Sun Rays', 'Gold-Tone Finish', 'Layer-Friendly Chain']
  },
  {
    id: 'pend-rose-heart',
    name: 'Rose Heart Deluxe Pendant',
    category: 'Pendants & Chains',
    badge: 'Special Edition 🌹',
    priceINR: 240,
    image: '/images/pendants.jpg',
    description: 'Intricately carved floral rose bloom encased inside a sculpted romantic heart frame.',
    includes: ['Intricate Floral Relief', 'Premium Rose Gold Tone', 'Collector Backing Card']
  },

  // --- BRACELETS & ANKLETS ---
  {
    id: 'brac-butterfly',
    name: 'Butterfly Charm Bracelet',
    category: 'Bracelets & Anklets',
    badge: 'Insta Viral 🦋',
    priceINR: 199,
    image: '/images/bracelets-anklets.jpg',
    description: 'Dainty links holding iridescent fluttering butterfly charms that catch rainbow pastel hues in daylight.',
    includes: ['Iridescent Acrylic Wings', 'Secure Lobster Lock', 'Adjustable Wrist Fit']
  },
  {
    id: 'brac-flower',
    name: 'Daisy Flower Charm Bracelet',
    category: 'Bracelets & Anklets',
    badge: 'Fresh & Cute 🌸',
    priceINR: 199,
    image: '/images/bracelets-anklets.jpg',
    description: 'Enamel-filled pastel daisy flowers strung along a sparkling gold chain for spring vibes.',
    includes: ['Pastel Enamel Inlay', 'Golden Link Chain', 'Tarnish-Protected']
  },
  {
    id: 'brac-leaf',
    name: 'Botanical Leaf Vine Bracelet',
    category: 'Bracelets & Anklets',
    badge: 'Subtle Chic 🍃',
    priceINR: 199,
    image: '/images/bracelets-anklets.jpg',
    description: 'Finely textured leaf vine accents that wrap delicately around the wrist with graceful movement.',
    includes: ['Sculpted Vine Details', 'Polished Finish', 'Universal Size']
  },
  {
    id: 'brac-evileye',
    name: 'Evil Eye Protection Bracelet',
    category: 'Bracelets & Anklets',
    badge: 'Good Luck 🧿',
    priceINR: 170,
    image: '/images/bracelets-anklets.jpg',
    description: 'Traditional sapphire-blue and white evil eye talisman bead set on a radiant gold chain.',
    includes: ['Protective Evil Eye Bead', 'Durable Links', 'Positive Vibe Packaging']
  },
  {
    id: 'anklet-snake',
    name: 'Snake Chain Sleek Anklet',
    category: 'Bracelets & Anklets',
    badge: 'Must-Have ✨',
    priceINR: 150,
    image: '/images/bracelets-anklets.jpg',
    description: 'The trendiest liquid gold snake chain anklet. Lies flat, won’t snag, and looks gorgeous with sneakers or heels.',
    includes: ['Silky Smooth Links', 'Non-Snag Design', 'Extender Chain Included']
  },
  {
    id: 'anklet-minimal',
    name: 'Classic Minimalist Bead Anklet',
    category: 'Bracelets & Anklets',
    badge: 'Subtle Dainty',
    priceINR: 120,
    image: '/images/bracelets-anklets.jpg',
    description: 'Ultra-dainty ankle chain with miniature stationed polished beads for that barely-there shimmer.',
    includes: ['Stationed Bead Accents', 'Ultra-Lightweight', 'Everyday Summer Ready']
  },

  // --- EYE MASKS & SKINCARE ---
  {
    id: 'mask-kitty',
    name: 'Hello Kitty Kawaii Eye Mask',
    category: 'Eye Masks & Self-Care',
    badge: 'Super Soft 🐱',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Plush velvet sleeping eye mask with adorable cat face embroidery. Blocks 100% light for restful naps.',
    includes: ['Ultra-Soft Cloud Velvet', 'Gentle Elastic Strap', 'Total Light Blockout']
  },
  {
    id: 'mask-miao',
    name: 'Miao Kitten Sleeping Mask',
    category: 'Eye Masks & Self-Care',
    badge: 'Cute ASMR 🐾',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Cute pastel cartoon kitten eye mask with cooling comfort. A favorite in our unboxing parcels.',
    includes: ['Breathable Fabric', 'Snug Elastic Comfort', 'Individually Sealed']
  },
  {
    id: 'mask-heart',
    name: 'Heart & Floral Silk Eye Mask',
    category: 'Eye Masks & Self-Care',
    badge: 'Relaxing 💖',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Silky smooth eye mask patterned with sweet pastel hearts and floral motifs for sensory sleep comfort.',
    includes: ['Skin-Friendly Satin Lining', 'Padded Light Protection', 'Travel-Friendly']
  },
  {
    id: 'skincare-can-wipes',
    name: 'Cute Soda Can Wet Wipes (30 Wipes)',
    category: 'Eye Masks & Self-Care',
    badge: 'Viral Novelty 🥤',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Novelty miniature soda can that opens from the pop-tab to dispense refreshing, lightly scented wet wipes.',
    includes: ['Novelty Soda Can Dispenser', '30 Refreshing Wipes', 'Backpack Clip Keychain']
  },
  {
    id: 'skincare-nose-strips',
    name: 'Deep Cleansing Nose Pore Strips Pack',
    category: 'Eye Masks & Self-Care',
    badge: 'Skincare Win 🌸',
    priceINR: 119,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Pore clearing nose strips that instantly pull out blackheads and leave your nose silky smooth.',
    includes: ['Pore Purifying Formula', 'Quick 10-Minute Action', 'Dermatologist Tested']
  },

  // --- KOREAN WALLETS ---
  {
    id: 'wallet-pink',
    name: 'Soft Korean Aesthetic Wallet (Blush Pink)',
    category: 'Korean Wallets',
    badge: 'Boutique Hot 🔥',
    priceINR: 250,
    image: '/images/korean-wallets.jpg',
    description: 'Quilted diamond-stitched soft leatherette pocket wallet with gold zip accents and a mini teddy bear charm pull.',
    includes: ['Multiple Card Slots', 'Zippered Coin Pocket', 'Attached Mini Plush Bear Charm', 'Compact Pocket Size']
  },
  {
    id: 'wallet-white',
    name: 'Soft Korean Minimalist Wallet (Ivory White)',
    category: 'Korean Wallets',
    badge: 'Clean Aesthetic 🤍',
    priceINR: 250,
    image: '/images/korean-wallets.jpg',
    description: 'Chic creamy ivory quilted pocket wallet with durable gold hardware and a cute teddy charm. Fits in any mini bag.',
    includes: ['Smooth Zipper Slider', 'Cash & Card Compartments', 'Aesthetic Pastel Finish']
  }
];

const CATEGORIES = [
  'All Items',
  'Mystery Scoops',
  'Pendants & Chains',
  'Bracelets & Anklets',
  'Eye Masks & Self-Care',
  'Korean Wallets'
];

export default function ProductCatalog({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [addedItem, setAddedItem] = useState(null);

  const filteredProducts = activeCategory === 'All Items'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleAdd = (product) => {
    soundFX.playPop(650);
    soundFX.playChime();
    onAddToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <section id="menu" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Policy Reminder Banner */}
      <div className="mb-8 p-3 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:bg-neutral-800/90 border-2 border-pink-300 dark:border-pink-800 flex items-center justify-center gap-2 text-xs font-bold text-[#231733] dark:text-[#E0D7EB] text-center shadow-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#E60067]" />
        <span>Order Rule: Minimum 3 Products Required • Single Item Order Not Available • 100% Prepaid Delivery</span>
      </div>

      {/* Title & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-extrabold tracking-wider uppercase mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>Official Scoop Storey India Catalog</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
            The Scoop Menu
          </h2>
          <p className="mt-2 text-[#554664] dark:text-[#E0D7EB] font-medium max-w-xl text-sm md:text-base">
            Explore authentic Pendants, Charm Bracelets, Self-Care Eye Masks, Korean Wallets, and Mystery Scoops. All prices in <strong className="text-[#231733] dark:text-white font-bold">₹ (INR)</strong> only.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                soundFX.playPop(500);
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#E60067] text-white border-[#E60067] shadow-md'
                  : 'bg-white dark:bg-[#1E172E] text-[#231733] dark:text-[#E0D7EB] border-pink-200/80 dark:border-pink-900 hover:bg-pink-50 dark:hover:bg-neutral-800 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredProducts.map((product) => {
          const isJustAdded = addedItem === product.id;
          const whatsappUrl = `https://wa.me/918199922653?text=${encodeURIComponent(`Hi! Mujhe ${product.name} Rs ${product.priceINR} wala order karna hai - Only Prepaid`)}`;

          return (
            <div
              key={product.id}
              className="group rounded-3xl bg-white dark:bg-[#1E172E] overflow-hidden border-2 border-pink-200/80 dark:border-pink-900/60 hover:shadow-2xl hover:border-pink-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-md"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-60 overflow-hidden bg-pink-100/50 dark:bg-neutral-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-black text-[#E60067] dark:text-pink-400 shadow-sm border border-pink-200/60 dark:border-pink-800">
                    {product.badge}
                  </span>

                  {/* Pack on Reel Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white shadow-xs">
                    <Video className="w-3 h-3 text-pink-400" />
                    <span>Eligible for IG Reel packing</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[11px] font-black text-[#E60067] dark:text-pink-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-display font-extrabold text-base md:text-lg text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#554664] dark:text-[#D5CBE2] line-clamp-2 leading-relaxed font-medium">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-3.5 pt-3 border-t border-pink-100 dark:border-pink-900/40 space-y-1">
                    {product.includes.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-[#483A54] dark:text-[#D5CBE2]">
                        <Check className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="p-5 pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-display font-black text-[#231733] dark:text-white">
                      ₹{product.priceINR}
                    </span>
                    <span className="text-[10px] text-[#716182] dark:text-neutral-400 font-bold ml-1">
                      (Prepaid)
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`py-2 px-3.5 rounded-xl font-display font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'btn-3d-pink text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Buy on WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Buy on WhatsApp (+91 8199922653)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
