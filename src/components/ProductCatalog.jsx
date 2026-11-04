import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Video, 
  Star, 
  Filter, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'The Starlight Mystery Scoop Bowl',
    category: 'Mystery Scoops',
    badge: 'Best Seller 🔥',
    priceINR: 799,
    priceUSD: 19.99,
    image: '/images/scoop-bowl.jpg',
    description: 'Our signature 2-scoop mystery experience loaded with resin bears, faceted hearts, star beads, and pearls.',
    includes: ['35+ Kawaii Charms', '1x Rare Holographic Bear', 'Pastel Pink Storage Bag', 'Free Sticker Pack']
  },
  {
    id: 'prod-2',
    name: 'ASMR Creator Deluxe Packaging Kit',
    category: 'ASMR & Packaging',
    badge: 'Creator Pick 🎀',
    priceINR: 1199,
    priceUSD: 28.50,
    image: '/images/asmr-packing.jpg',
    description: 'The authentic unboxing setup: branded pouch, crinkle paper, thank-you card, wax seals, and satin ribbons.',
    includes: ['Custom Branded Pouch', 'Aesthetic Ribbons & Wax Seal', '45+ Curated Charms', 'Personalized Creator Note']
  },
  {
    id: 'prod-3',
    name: 'Handmade Pastel Beaded Phone Straps',
    category: 'DIY Charms & Accessories',
    badge: 'Trending ✨',
    priceINR: 499,
    priceUSD: 12.99,
    image: '/images/charm-bracelets.jpg',
    description: 'Chic, durable phone straps and charm bracelets strung with rose-gold clasps, teddy bear beads, and pastel pearls.',
    includes: ['Universal Phone Tether Tab', 'Reinforced Nylon Stringing', 'Rose-Gold Heart Clasp', 'Choice of 3 Pastel Tones']
  },
  {
    id: 'prod-4',
    name: "Bhaskar's Royal Collector Unboxing Box",
    category: 'Collector Gift Boxes',
    badge: '👑 Limited Edition',
    priceINR: 2499,
    priceUSD: 59.99,
    image: '/images/deluxe-giftbox.jpg',
    description: 'The pinnacle Scoop Storey experience: luxury rigid box, plush bear keychain, blind box, and 80+ surprise charms.',
    includes: ['Deluxe Rigid Pastel Box', 'Plush Teddy Bear Keychain', 'Exclusive Mystery Blind Box', '80+ Premium Craft Charms', 'Filmed on Instagram Guarantee']
  },
  {
    id: 'prod-5',
    name: 'Mini Confetti Charm Pouch (Pack of 20)',
    category: 'DIY Charms & Accessories',
    badge: 'Great Add-On',
    priceINR: 299,
    priceUSD: 7.99,
    image: '/images/scoop-bowl.jpg',
    description: 'A pocket-sized burst of cuteness! 20 hand-selected mini resin charms perfect for phone cases, crocs, and nail art.',
    includes: ['20 Mini Assorted Charms', 'Cute Organza Bag', 'Surprise Rarity Charm']
  },
  {
    id: 'prod-6',
    name: 'Kawaii Friends Surprise Blind Box',
    category: 'Collector Gift Boxes',
    badge: 'Secret Rarity',
    priceINR: 599,
    priceUSD: 14.99,
    image: '/images/deluxe-giftbox.jpg',
    description: 'Unbox an adorable mystery vinyl figurine with miniature accessories. 1 in 72 chance of finding the Golden Bear!',
    includes: ['1 Mystery Collectible Figure', 'Collector ID Card', 'Miniature Display Stand']
  }
];

const CATEGORIES = [
  'All Products',
  'Mystery Scoops',
  'DIY Charms & Accessories',
  'ASMR & Packaging',
  'Collector Gift Boxes'
];

export default function ProductCatalog({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [addedItem, setAddedItem] = useState(null);

  const filteredProducts = activeCategory === 'All Products'
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
      {/* Title & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel text-pink-600 dark:text-pink-300 text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Curated Artisan Collection</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900 dark:text-white">
            The Scoop Menu
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-xl text-sm md:text-base">
            Every item is packed with meticulous care. You can request your order to be packed on an upcoming Instagram Reel!
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
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                  : 'glass-panel text-neutral-700 dark:text-neutral-300 hover:bg-pink-100/50 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const isJustAdded = addedItem === product.id;
          return (
            <div
              key={product.id}
              className="group rounded-3xl glass-panel overflow-hidden border border-pink-200/50 dark:border-pink-900/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-64 overflow-hidden bg-pink-100/40 dark:bg-neutral-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-xs font-bold text-pink-600 dark:text-pink-400 shadow-sm">
                    {product.badge}
                  </span>

                  {/* Pack on Reel Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
                    <Video className="w-3 h-3 text-pink-400" />
                    <span>Eligible for IG Reel packing</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-[11px] font-bold text-pink-500 dark:text-pink-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-neutral-900 dark:text-white group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 pt-4 border-t border-pink-100/60 dark:border-pink-900/30 space-y-1.5">
                    {product.includes.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <Check className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 pt-0 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xl md:text-2xl font-display font-extrabold text-neutral-900 dark:text-white">
                    ₹{product.priceINR}
                  </span>
                  <span className="block text-xs text-neutral-400 font-medium">
                    (${product.priceUSD})
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  className={`py-3 px-5 rounded-2xl font-display font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${
                    isJustAdded
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'btn-3d-pink text-white'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

