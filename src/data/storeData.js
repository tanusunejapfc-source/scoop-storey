// Official Product Catalog & Mystery Scoop Tiers for Scoop Storey
export const SCOOP_TIERS = [
  {
    id: 'mini-scoop',
    name: 'Scoop Storey - Mini Scoop',
    subtitle: '7–8 Products + Free Gifts',
    scoops: 1,
    productCount: 8,
    itemsCount: '7–8 Products + Extra Free Gifts',
    priceINR: 799,
    badge: 'Popular Starter 🎀',
    color: 'from-pink-400 to-rose-400',
    btnClass: 'btn-3d-pink',
    features: ['7–8 Products', 'Extra Free Gifts Included', 'Free Shipping Across India']
  },
  {
    id: 'midi-scoop',
    name: 'Scoop Storey - Midi Scoop',
    subtitle: '12–15 Products + Free Gifts',
    scoops: 2,
    productCount: 14,
    itemsCount: '12–15 Products + Extra Free Gifts',
    priceINR: 1299,
    badge: '★ Best Value ★',
    color: 'from-purple-400 to-indigo-500',
    btnClass: 'btn-3d-purple',
    features: ['12–15 Products', 'Extra Free Gifts Included', 'Free Shipping Across India']
  },
  {
    id: 'big-scoop',
    name: 'Scoop Storey - Big Scoop',
    subtitle: 'Over 20 Items (Mini + Midi Included)',
    scoops: 3,
    productCount: 22,
    itemsCount: 'Everything from Mini + Midi (20+ Items)',
    priceINR: 1799,
    badge: 'Collector Choice ✨',
    color: 'from-amber-400 to-orange-500',
    btnClass: 'btn-3d-gold',
    features: ['Everything from a Mini Scoop + Midi Scoop', 'Over 20 Items', 'Even More Extra Free Gifts', 'Free Shipping Across India']
  }
];

// Official Mystery Scoop Rewards Chart (54 Items across 4 Categories from Official Scoop Board)
export const MYSTERY_SCOOP_CATEGORIES = [
  {
    id: 'beauty-essentials',
    title: 'Beauty Essentials',
    icon: '💄',
    badge: '15 Items',
    description: 'Aesthetic beauty treats, viral lip glazes, liners & cute tools',
    items: [
      { id: 'be-claw-clip', name: 'Claw Clip', category: 'Beauty Essentials', charm: 'Purple Star Bead', icon: '⭐', color: '#B388FF', rarity: 'Common' },
      { id: 'be-scrunchy', name: 'Scrunchy', category: 'Beauty Essentials', charm: 'Yellow Butterfly Charm', icon: '🦋', color: '#FFD166', rarity: 'Common' },
      { id: 'be-head-band', name: 'Head Band', category: 'Beauty Essentials', charm: 'Red Heart Charm', icon: '💖', color: '#FF4D8D', rarity: 'Common' },
      { id: 'be-lip-gloss', name: 'Lip Gloss', category: 'Beauty Essentials', charm: 'Blue Gem Charm', icon: '💎', color: '#48CAE4', rarity: 'Rare' },
      { id: 'be-lipstick', name: 'Lipstick', category: 'Beauty Essentials', charm: 'Pink Bow Charm', icon: '🎀', color: '#FF94C2', rarity: 'Rare' },
      { id: 'be-lip-liner', name: 'Lip Liner', category: 'Beauty Essentials', charm: 'Mint Oval Charm', icon: '✏️', color: '#A0E7E5', rarity: 'Common' },
      { id: 'be-makeup-brush', name: 'Makeup Brush', category: 'Beauty Essentials', charm: 'Pink Bow Charm', icon: '🖌️', color: '#FFAAA6', rarity: 'Rare' },
      { id: 'be-blusher', name: 'Blusher', category: 'Beauty Essentials', charm: 'White Butterfly Charm', icon: '🌸', color: '#FFFFFF', rarity: 'Rare' },
      { id: 'be-eye-liner', name: 'Eye Liner', category: 'Beauty Essentials', charm: 'Winged Mint Bead', icon: '👁️', color: '#70D6FF', rarity: 'Common' },
      { id: 'be-mascara', name: 'Mascara', category: 'Beauty Essentials', charm: 'Black Faceted Charm', icon: '✨', color: '#333333', rarity: 'Rare' },
      { id: 'be-blender', name: 'Blender', category: 'Beauty Essentials', charm: 'Magenta Heart Charm', icon: '💜', color: '#D8005A', rarity: 'Common' },
      { id: 'be-beauty-puff', name: 'Beauty Puff', category: 'Beauty Essentials', charm: 'Lime Butterfly Charm', icon: '🧽', color: '#C1E1C1', rarity: 'Common' },
      { id: 'be-anklets', name: 'Anklets', category: 'Beauty Essentials', charm: 'Lilac Bow Bead', icon: '💫', color: '#D8B4F8', rarity: 'Rare' },
      { id: 'be-highlighters', name: 'Highlighters', category: 'Beauty Essentials', charm: 'Double Bow Charm', icon: '✨', color: '#FFD166', rarity: 'Rare' },
      { id: 'be-makeup-kit', name: 'Makeup Kit', category: 'Beauty Essentials', charm: 'Candy Pouch Charm', icon: '👑', color: '#FF4D8D', rarity: 'Legendary' }
    ]
  },
  {
    id: 'accessories-fun',
    title: 'Accessories & Fun',
    icon: '💍',
    badge: '15 Items',
    description: 'Korean jewelry, charming bracelets, nails & fun accessories',
    items: [
      { id: 'af-charm-bracelet', name: 'Charm Bracelet', category: 'Accessories & Fun', charm: 'Winged Pink Bead', icon: '🎀', color: '#FF94C2', rarity: 'Epic' },
      { id: 'af-pendants', name: 'Pendants', category: 'Accessories & Fun', charm: 'Bronze Heart Charm', icon: '✨', color: '#FFD700', rarity: 'Epic' },
      { id: 'af-earrings', name: 'Earrings', category: 'Accessories & Fun', charm: 'White Butterfly Charm', icon: '💎', color: '#FFFFFF', rarity: 'Rare' },
      { id: 'af-kda-bracelet', name: 'Kda Bracelet', category: 'Accessories & Fun', charm: 'Blue Flower Charm', icon: '🌸', color: '#70D6FF', rarity: 'Rare' },
      { id: 'af-nail-paint', name: 'Nail Paint', category: 'Accessories & Fun', charm: 'Green Gem Charm', icon: '💅', color: '#A8E6CF', rarity: 'Common' },
      { id: 'af-nail-paint-remover', name: 'Nail Paint Remover', category: 'Accessories & Fun', charm: 'Red Gem Charm', icon: '✨', color: '#FF6B6B', rarity: 'Common' },
      { id: 'af-wet-wipes', name: 'Wet Wipes', category: 'Accessories & Fun', charm: 'Lavender Butterfly Charm', icon: '🧻', color: '#D8B4F8', rarity: 'Common' },
      { id: 'af-key-chain', name: 'Key Chain', category: 'Accessories & Fun', charm: 'Green Candy Charm', icon: '🗝️', color: '#A0E7E5', rarity: 'Common' },
      { id: 'af-mirror', name: 'Mirror', category: 'Accessories & Fun', charm: 'Winged Pink Bead', icon: '🪞', color: '#FF99C8', rarity: 'Rare' },
      { id: 'af-comb', name: 'Comb', category: 'Accessories & Fun', charm: 'Yellow Shell Charm', icon: '🪮', color: '#FFD166', rarity: 'Common' },
      { id: 'af-eye-mask', name: 'Eye Mask', category: 'Accessories & Fun', charm: 'Purple Cube Bead', icon: '💤', color: '#B388FF', rarity: 'Rare' },
      { id: 'af-sheet-mask', name: 'Sheet Mask', category: 'Accessories & Fun', charm: 'Pink Heart Charm', icon: '🎭', color: '#FFAAA6', rarity: 'Common' },
      { id: 'af-hair-accessories', name: 'Hair Accessories', category: 'Accessories & Fun', charm: 'Cyan Heart Charm', icon: '🎀', color: '#48CAE4', rarity: 'Common' },
      { id: 'af-lunch-bag', name: 'Lunch Bag', category: 'Accessories & Fun', charm: 'Cream Butterfly Charm', icon: '👜', color: '#FFFDD0', rarity: 'Rare' },
      { id: 'af-mini-fan', name: 'Mini Fan', category: 'Accessories & Fun', charm: 'Dual Heart Charm', icon: '🪭', color: '#FF6B97', rarity: 'Epic' }
    ]
  },
  {
    id: 'stationery-diaries',
    title: 'Stationery & Diaries',
    icon: '📔',
    badge: '13 Items',
    description: 'Floral diaries, aesthetic gel pens, sticky notes & journals',
    items: [
      { id: 'sd-mini-diary', name: 'Mini Diary', category: 'Stationery & Diaries', charm: 'Pink Star Charm', icon: '📖', color: '#FF94C2', rarity: 'Common' },
      { id: 'sd-floral-diary', name: 'Floral Diary', category: 'Stationery & Diaries', charm: 'Blue & Pink Bow Charm', icon: '📔', color: '#70D6FF', rarity: 'Rare' },
      { id: 'sd-stapler', name: 'Stapler', category: 'Stationery & Diaries', charm: 'Green Shell Charm', icon: '📎', color: '#A8E6CF', rarity: 'Common' },
      { id: 'sd-floating-pen', name: 'Floating Pen', category: 'Stationery & Diaries', charm: 'White Star Charm', icon: '🖊️', color: '#FFFFFF', rarity: 'Rare' },
      { id: 'sd-multicolor-pen', name: 'Multicolor Pen', category: 'Stationery & Diaries', charm: 'Winged Yellow Bead', icon: '✒️', color: '#FFD166', rarity: 'Common' },
      { id: 'sd-bookmark', name: 'Bookmark', category: 'Stationery & Diaries', charm: 'Mint Star Charm', icon: '🔖', color: '#A0E7E5', rarity: 'Common' },
      { id: 'sd-sticky-notes', name: 'Sticky Notes', category: 'Stationery & Diaries', charm: 'Green Heart Charm', icon: '📝', color: '#C1E1C1', rarity: 'Common' },
      { id: 'sd-highlighter-pen', name: 'Highlighter Pen', category: 'Stationery & Diaries', charm: 'Purple Butterfly Charm', icon: '🖍️', color: '#B388FF', rarity: 'Common' },
      { id: 'sd-stamp', name: 'Stamp', category: 'Stationery & Diaries', charm: 'Brown Ribbon Charm', icon: '📮', color: '#D4A373', rarity: 'Common' },
      { id: 'sd-pouch', name: 'Pouch', category: 'Stationery & Diaries', charm: 'Pink Lips Charm', icon: '👝', color: '#FF6B97', rarity: 'Rare' },
      { id: 'sd-stationery-set', name: 'Stationery Set', category: 'Stationery & Diaries', charm: 'Winged Lavender Bead', icon: '🎨', color: '#E0AAFF', rarity: 'Epic' },
      { id: 'sd-floral-big-diary', name: 'Floral Big Diary', category: 'Stationery & Diaries', charm: 'Hot Pink Heart Charm', icon: '📕', color: '#E60067', rarity: 'Epic' },
      { id: 'sd-pen', name: 'Pen', category: 'Stationery & Diaries', charm: 'Lavender Oval Bead', icon: '✏️', color: '#D8B4F8', rarity: 'Common' }
    ]
  },
  {
    id: 'lifestyle-more',
    title: 'Lifestyle & More',
    icon: '🧸',
    badge: '11 Items',
    description: 'Cute plushies, sipper bottles, mugs, wallets & daily cuties',
    items: [
      { id: 'lm-lipstic-pouch', name: 'Lipstic Pouch', category: 'Lifestyle & More', charm: 'Lilac Candy Charm', icon: '👛', color: '#B388FF', rarity: 'Rare' },
      { id: 'lm-kawai-paper-soap', name: 'Kawai Paper Soap', category: 'Lifestyle & More', charm: 'Yellow Butterfly Charm', icon: '🧼', color: '#FFD166', rarity: 'Common' },
      { id: 'lm-soft-toy', name: 'Soft Toy', category: 'Lifestyle & More', charm: 'Red Cherry Charm', icon: '🧸', color: '#FF4D8D', rarity: 'Epic' },
      { id: 'lm-nails', name: 'Nails', category: 'Lifestyle & More', charm: 'Yellow Flower Charm', icon: '💅', color: '#FFEAA7', rarity: 'Common' },
      { id: 'lm-nail-cutter', name: 'Nail Cutter', category: 'Lifestyle & More', charm: 'Pastel Pink Butterfly Charm', icon: '✂️', color: '#FFAAA6', rarity: 'Common' },
      { id: 'lm-nose-strips', name: 'Nose Strips', category: 'Lifestyle & More', charm: 'Mint Star Charm', icon: '🧖‍♀️', color: '#A0E7E5', rarity: 'Common' },
      { id: 'lm-socks', name: 'Socks', category: 'Lifestyle & More', charm: 'Pink Bow Charm', icon: '🧦', color: '#FF94C2', rarity: 'Common' },
      { id: 'lm-bottles', name: 'Bottles', category: 'Lifestyle & More', charm: 'Winged Peach Bead', icon: '🍼', color: '#FFD3B6', rarity: 'Epic' },
      { id: 'lm-mug', name: 'Mug', category: 'Lifestyle & More', charm: 'Yellow Butterfly Charm', icon: '☕', color: '#FFD166', rarity: 'Rare' },
      { id: 'lm-wallet', name: 'Wallet', category: 'Lifestyle & More', charm: 'Cyan Butterfly Charm', icon: '👛', color: '#48CAE4', rarity: 'Epic' },
      { id: 'lm-bag', name: 'Bag', category: 'Lifestyle & More', charm: 'Yellow Candy Charm', icon: '🛍️', color: '#FFD166', rarity: 'Legendary' }
    ]
  }
];

export const CHARM_LOOT_POOL = MYSTERY_SCOOP_CATEGORIES.flatMap(cat => cat.items);

export const PRODUCTS = [
  {
    "id": "pend-sun",
    "name": "Sunburst Celestial Pendant",
    "category": "Pendants & Chains",
    "badge": "Golden Glow ☀️",
    "priceINR": 199,
    "image": "/images/pendants/sun-pendant.png",
    "images": [
      "/images/pendants/sun-pendant.png"
    ],
    "description": "Radiant embossed sun pendant with textured sun rays capturing ambient warmth and positivity.",
    "includes": [
      "Embossed Sun Rays",
      "Gold-Tone Finish",
      "Layer-Friendly Chain"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "brac-evileye",
    "name": "Evil Eye Protection Bracelet",
    "category": "Bracelets",
    "badge": "Good Luck 🧿",
    "priceINR": 170,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000022689-564739.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000022689-564739.png"
    ],
    "description": "Traditional sapphire-blue and white evil eye talisman bead set on a radiant gold chain.",
    "includes": [
      "Protective Evil Eye Bead",
      "Durable Links",
      "Positive Vibe Packaging"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "anklet-snake",
    "name": "Snake Chain Sleek Anklet",
    "category": "Anklets",
    "badge": "Must-Have ✨",
    "priceINR": 150,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020275-997799.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020275-997799.jpg"
    ],
    "description": "The trendiest liquid gold snake chain anklet. Lies flat, won’t snag, and looks gorgeous with sneakers or heels.",
    "includes": [
      "Silky Smooth Links",
      "Non-Snag Design",
      "Extender Chain Included"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "anklet-minimal",
    "name": "Classic Minimalist Bead Anklet",
    "category": "Anklets",
    "badge": "Subtle Dainty",
    "priceINR": 120,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020271-024004.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020271-024004.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020269-028838.png"
    ],
    "description": "Ultra-dainty ankle chain with miniature stationed polished beads for that barely-there shimmer.",
    "includes": [
      "Stationed Bead Accents",
      "Ultra-Lightweight",
      "Everyday Summer Ready"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-heart",
    "name": "Classic Heart Pendant",
    "category": "Pendants & Chains",
    "badge": "Best Seller 💖",
    "priceINR": 199,
    "image": "/images/pendants/heart-pendant.png",
    "images": [
      "/images/pendants/heart-pendant.png"
    ],
    "description": "Classic high-polish romantic heart pendant on a delicate cable chain for everyday elegance.",
    "includes": [
      "Mirror Finish Heart",
      "Hypoallergenic Chain",
      "Gift Display Card",
      "Prepaid Shipping"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-little-heart",
    "name": "Little Heart Dainty Pendant",
    "category": "Pendants & Chains",
    "badge": "Cute Essential 💖",
    "priceINR": 199,
    "image": "/images/pendants/little-heart-pendant.png",
    "images": [
      "/images/pendants/little-heart-pendant.png"
    ],
    "description": "A delicate polished puffed heart pendant that rests gracefully on your collarbone.",
    "includes": [
      "Subtle Mirror Polish",
      "Adjustable 16-18\" Length",
      "Lightweight & Comfortable",
      "Gift Packaging"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-rose-heart",
    "name": "Rose Heart Deluxe Pendant",
    "category": "Pendants & Chains",
    "badge": "Special Edition 🌹",
    "priceINR": 240,
    "image": "/images/pendants/rose-heart-pendant.png",
    "images": [
      "/images/pendants/rose-heart-pendant.png"
    ],
    "description": "Intricately carved floral rose bloom encased inside a sculpted romantic heart frame.",
    "includes": [
      "Intricate Floral Relief",
      "Premium Rose Gold Tone",
      "Collector Backing Card",
      "Anti-Tanish Coating"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-pearl",
    "name": "Lustrous Pearl Drop Pendant",
    "category": "Pendants & Chains",
    "badge": "Timeless Beauty 🦪",
    "priceINR": 240,
    "image": "/images/pendants/pearl-pendant.jpg",
    "images": [
      "/images/pendants/pearl-pendant.jpg"
    ],
    "description": "Natural high-luster baroque pearl pendant suspended on a fine shimmer chain for a radiant touch.",
    "includes": [
      "Natural Luster Pearl",
      "Tarnish-Resistant Alloy",
      "Gift Ready Display Box"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-monalisa",
    "name": "Monalisa Lustrous Gem Pendant",
    "category": "Pendants & Chains",
    "badge": "Elegant Classic ✨",
    "priceINR": 240,
    "image": "/images/pendants/monalisa-pendant.png",
    "images": [
      "/images/pendants/monalisa-pendant.png"
    ],
    "description": "Sculpted Monalisa faceted stone pendant accented with a sparkling pavé setting for timeless charm.",
    "includes": [
      "Faceted Crystal Setting",
      "Tarnish-Resistant Alloy",
      "Gift Ready Display Card"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-bow-heart",
    "name": "Bow Heart Aesthetic Pendant",
    "category": "Pendants & Chains",
    "badge": "Trending on Insta 🎀",
    "priceINR": 199,
    "image": "/images/pendants/bow-heart-pendant.png",
    "images": [
      "/images/pendants/bow-heart-pendant.png"
    ],
    "description": "A dainty rose-gold bow tied atop a faceted crystal heart charm on a non-tarnish shimmer chain.",
    "includes": [
      "Anti-Tarnish Plating",
      "Lobster Clasp with Extender",
      "Velvet Jewelry Pouch",
      "Prepaid Shipping"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "pend-snake-chain",
    "name": "Snake Chain Minimalist Pendant",
    "category": "Pendants & Chains",
    "badge": "Daily Wear ✨",
    "priceINR": 199,
    "image": "/images/pendants/snake-chain-pendant.png",
    "images": [
      "/images/pendants/snake-chain-pendant.png"
    ],
    "description": "Sleek, fluid herringbone snake link chain featuring a polished micro-pendant for modern layering.",
    "includes": [
      "Liquid Smooth Snake Links",
      "18k Gold PVD Coating",
      "Water-Resistant Finish",
      "Hypoallergenic"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "brac-butterfly",
    "name": "Butterfly Kda Bracelet",
    "category": "Bracelets",
    "badge": "Insta Viral 🦋",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018047-101633.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018047-101633.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018048-103653.png"
    ],
    "description": "Dainty links holding iridescent fluttering butterfly Kda that catch rainbow pastel hues in daylight.",
    "includes": [
      "Iridescent Acrylic Wings",
      "Secure Lobster Lock",
      "Adjustable Wrist Fit"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "brac-leaf",
    "name": "Botanical Leaf Vine  kda Bracelet",
    "category": "Bracelets",
    "badge": "Subtle Chic 🍃",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018049-530028.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018049-530028.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018050-533427.png"
    ],
    "description": "Finely textured leaf vine accents that wrap delicately around the wrist with graceful movement.",
    "includes": [
      "Sculpted Vine Details",
      "Polished Finish",
      "Universal Size"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-141399",
    "name": "Deep Flower Bracelet ",
    "category": "Bracelets",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018019-167287.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018019-167287.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018020-171543.png"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [
      "Anti-Tarnish Plating",
      "Gift Display Box",
      "Prepaid Shipping"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold",
        "image": null
      }
    ],
    "specifications": {
      "Finish": "18K Gold Plated",
      "Material": "Anti-Tarnish Alloy"
    },
    "inStock": true
  },
  {
    "id": "skincare-can-wipes",
    "name": "Cute Unicorn Can Wet Wipes (30 Wipes)",
    "category": "Self-Care",
    "badge": "Viral Novelty 🥤",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020284-107611.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020284-107611.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020286-105611.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020288-101584.jpg"
    ],
    "description": "Novelty miniature soda can that opens from the pop-tab to dispense refreshing, lightly scented wet wipes.",
    "includes": [
      "Novelty Soda Can Dispenser",
      "30 Refreshing Wipes",
      "Backpack Clip Keychain"
    ],
    "colors": [
      {
        "hex": "#8ad1f2",
        "name": "Sky Blue"
      },
      {
        "hex": "#ebb3ff",
        "name": "Baby Pink"
      },
      {
        "hex": "#ffffff",
        "name": "Cream"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-056604",
    "name": "Flower Kda Bracelet ",
    "category": "Bracelets",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018051-086505.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018051-086505.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000018052-091556.png"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [
      "Anti-Tarnish Plating",
      "Gift Display Box",
      "Prepaid Shipping"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {
      "Finish": "18K Gold Plated",
      "Material": "Anti-Tarnish Alloy",
      "Packaging": "Velvet Gift Card"
    },
    "inStock": true
  },
  {
    "id": "brac-flower",
    "name": "Daisy Flower Charm Bracelet",
    "category": "Bracelets",
    "badge": "Fresh & Cute 🌸",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020266-433964.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020266-433964.png"
    ],
    "description": "Enamel-filled pastel daisy flowers strung along a sparkling gold chain for spring vibes.",
    "includes": [
      "Pastel Enamel Inlay",
      "Golden Link Chain",
      "Tarnish-Protected"
    ],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "18K Yellow Gold"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "mask-kitty",
    "name": "Hello Kitty Kawaii Eye Mask",
    "category": "Self-Care",
    "badge": "Super Soft 🐱",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020328-310048.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020328-310048.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020383-314912.jpg"
    ],
    "description": "Plush velvet sleeping eye mask with adorable cat face embroidery. Blocks 100% light for restful naps.",
    "includes": [
      "Ultra-Soft Cloud Velvet",
      "Gentle Elastic Strap",
      "Total Light Blockout"
    ],
    "colors": [
      {
        "hex": "#2A2A2A",
        "name": "Midnight Black"
      },
      {
        "hex": "#8f8f8f",
        "name": "Ash grey"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "mask-miao",
    "name": "Miao Kitten Sleeping Mask",
    "category": "Self-Care",
    "badge": "Cute ASMR 🐾",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020336-417159.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020336-417159.jpg"
    ],
    "description": "Cute pastel cartoon kitten eye mask with cooling comfort. A favorite in our unboxing parcels.",
    "includes": [
      "Breathable Fabric",
      "Snug Elastic Comfort",
      "Individually Sealed"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-013024",
    "name": "Silk White Floral Eye mask ",
    "category": "Self-Care",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020354-070072.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020354-070072.jpg"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "Standard",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-510204",
    "name": "Refreshing Wet Wipes (25 Wipes)",
    "category": "Self-Care",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020295-597814.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020295-597814.jpg"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [],
    "colors": [
      {
        "hex": "#f7b50c",
        "name": "Vitamin C",
        "image": null
      },
      {
        "hex": "#5ba834",
        "name": "Alovera",
        "image": null
      },
      {
        "hex": "#f2bbf1",
        "name": "Rose",
        "image": null
      },
      {
        "hex": "#c22f33",
        "name": "Strawberry",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "skincare-nose-strips",
    "name": "Deep Cleansing Nose Pore Strips (4Pack)",
    "category": "Self-Care",
    "badge": "Skincare Win 🌸",
    "priceINR": 119,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020561-841285.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020561-841285.jpg"
    ],
    "description": "Pore clearing nose strips that instantly pull out blackheads and leave your nose silky smooth.",
    "includes": [
      "Pore Purifying Formula",
      "Quick 10-Minute Action",
      "Dermatologist Tested"
    ],
    "colors": [
      {
        "hex": "#000000",
        "name": "Charcoal"
      },
      {
        "hex": "#7cb041",
        "name": "Green tea"
      },
      {
        "hex": "#493e8c",
        "name": "Lavender"
      },
      {
        "hex": "#f5b00f",
        "name": "Vitamin C"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "mask-heart",
    "name": "Heart & Floral Eye Mask",
    "category": "Self-Care",
    "badge": "Relaxing 💖",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020332-575859.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020332-575859.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020379-580772.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020380-578894.jpg"
    ],
    "description": " Smooth eye mask patterned with sweet pastel hearts and floral motifs for sensory sleep comfort.",
    "includes": [
      "Skin-Friendly Satin Lining",
      "Padded Light Protection",
      "Travel-Friendly"
    ],
    "colors": [
      {
        "hex": "#2A2A2A",
        "name": "Midnight Black"
      },
      {
        "hex": "#74bff7",
        "name": "Sky blue"
      },
      {
        "hex": "#f2c2ed",
        "name": "Baby pink"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-375406",
    "name": "Blusher",
    "category": "Make up",
    "badge": "New Arrival ✨",
    "priceINR": 149,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023632-055369.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023632-055369.png"
    ],
    "description": "Liquid Blusher \n\nLightweight, blendable & long lasting.\nFresh flush look in seconds.\nPerfect for daily & party wear.",
    "includes": [],
    "colors": [
      {
        "hex": "#e663c0",
        "name": "Pink",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-960821",
    "name": "Sheet Mask",
    "category": "Self-Care",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023058-634200.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023058-634200.jpg"
    ],
    "description": "Self- care through our Sheet mask and see the Glow",
    "includes": [],
    "colors": [
      {
        "hex": "#ff881a",
        "name": "Vitamin C",
        "image": null
      },
      {
        "hex": "#000000",
        "name": "Charcoal",
        "image": null
      },
      {
        "hex": "#9e0d6b",
        "name": "Mix fruit",
        "image": null
      },
      {
        "hex": "#c48b35",
        "name": "24K Gold",
        "image": null
      },
      {
        "hex": "#2aad18",
        "name": "Tender Coconut",
        "image": null
      },
      {
        "hex": "#1d6b2e",
        "name": "Cucumber",
        "image": null
      },
      {
        "hex": "#3c7cb5",
        "name": "H2O",
        "image": null
      },
      {
        "hex": "#289993",
        "name": "Hydra Facial",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-374508",
    "name": "Labubu Bottles",
    "category": "Bottles & Mugs",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023670-563833.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023670-563833.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023678-781701.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023674-570054.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023671-567411.jpg"
    ],
    "description": "Cute Water Bottle - Labubu Edition\n\nSuper cute transparent pink bottle with fun cartoon print.\nEasy straw sipper - just flip & drink.\nLeak-proof, lightweight & easy to carry.\nPerfect for school, college, gym & travel.\n\nStay Hydrated, Stay Cute!",
    "includes": [],
    "colors": [
      {
        "hex": "#f291e7",
        "name": "Pink",
        "image": null
      },
      {
        "hex": "#c080ed",
        "name": "Lavender",
        "image": null
      },
      {
        "hex": "#789ff5",
        "name": "Blue",
        "image": null
      },
      {
        "hex": "#1bc4ae",
        "name": "Sea green",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-524486",
    "name": "Pearl Glass Cute Mug",
    "category": "Bottles & Mugs",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023727-559877.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023727-559877.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023754-580696.jpg"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [
      "Anti-Tarnish Plating",
      "Gift Display Box",
      "Prepaid Shipping"
    ],
    "colors": [
      {
        "hex": "#eda6d0",
        "name": "Baby pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023727-559877.jpg"
      },
      {
        "hex": "#edd974",
        "name": "Yellow",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023754-580696.jpg"
      }
    ],
    "specifications": {
      "Finish": "18K Gold Plated",
      "Material": "Anti-Tarnish Alloy",
      "Packaging": "Velvet Gift Card"
    },
    "inStock": true
  },
  {
    "id": "custom-item-788918",
    "name": "Highlighters ",
    "category": "Make up",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023502-903291.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023502-903291.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023505-902007.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023513-900718.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023519-897253.jpg"
    ],
    "description": "Pigmented Highlighters ",
    "includes": [],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "Standard",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-751639",
    "name": "Floral Magnetic Bookmark",
    "category": "Kawaii Stationery",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024332-291296.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024332-291296.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024333-288862.jpg"
    ],
    "description": "📚✨ Magnetic Bookmark - Set of 6 pcs\nFloral Design | Magnetic Clip | No Page Damage\nFor Books, Diary, Journal",
    "includes": [],
    "colors": [
      {
        "hex": "#8ec9ed",
        "name": "Sky blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024333-288862.jpg"
      },
      {
        "hex": "#d98db5",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024332-291296.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-602117",
    "name": "Plushie Soft Labubu Doll",
    "category": "Soft Toys",
    "badge": "New Arrival ✨",
    "priceINR": 299,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024255-720651.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024255-720651.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024256-718929.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024257-716559.jpg"
    ],
    "description": "Plushie Blush Labubu 🐰✨ Fluffy, dreamy & totally adorable!",
    "includes": [],
    "colors": [
      {
        "hex": "#ffa8a8",
        "name": "Peach",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024257-716559.jpg"
      },
      {
        "hex": "#81c4e6",
        "name": "Sky Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024255-720651.jpg"
      },
      {
        "hex": "#41b091",
        "name": "Green",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024256-718929.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-052853",
    "name": "Plushie Cute bunny🩷",
    "category": "Soft Toys",
    "badge": "New Arrival ✨",
    "priceINR": 349,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024183-215693.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024183-215693.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024203-214295.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024146-209936.jpg"
    ],
    "description": "Soft  Bunny Keychain 🐰💙 Floral dress, super cute & soft!",
    "includes": [],
    "colors": [
      {
        "hex": "#ebbee2",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024183-215693.jpg"
      },
      {
        "hex": "#faf2f2",
        "name": "Off white",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024146-209936.jpg"
      },
      {
        "hex": "#8ecaed",
        "name": "Sky Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024203-214295.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-713043",
    "name": "Floral Big Diary",
    "category": "Kawaii Stationery",
    "badge": "New Arrival ✨",
    "priceINR": 205,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024390-038768.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024390-038768.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024389-046768.jpg"
    ],
    "description": "Best Friends Forever Diary - A5 Big Size, 180 Pages\nPremium Hardbound Cover with Orange Roses Design\nPink Floral Inner Pages with Horizontal Lines + Red Ribbon Bookmark\nBest Gift for BFF, Girls, Friendship Day & Birthday - 1 Diary",
    "includes": [],
    "colors": [
      {
        "hex": "#bd4d4d",
        "name": "Brown",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024390-038768.jpg"
      },
      {
        "hex": "#dbb8b8",
        "name": "Beige",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024389-046768.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-992353",
    "name": "Labubu Lipgloss",
    "category": "Make up",
    "badge": "New Arrival ✨",
    "priceINR": 139,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024062-023958.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024062-023958.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024060-034709.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024061-028039.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024063-018270.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024064-012739.jpg"
    ],
    "description": "Labubu Lip Gloss - Sheer Pink Shade, High Shine, Hydrating & Non-Sticky, Long Lasting. Cute Labubu design, perfect for daily wear & gifting.",
    "includes": [],
    "colors": [
      {
        "hex": "#46c2a7",
        "name": "Sea Green",
        "image": null
      },
      {
        "hex": "#ffccf2",
        "name": "Baby pink",
        "image": null
      },
      {
        "hex": "#b08be0",
        "name": "Lavender",
        "image": null
      },
      {
        "hex": "#eaffab",
        "name": "Lemon",
        "image": null
      },
      {
        "hex": "#ffb8b8",
        "name": "Peach",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-480945",
    "name": "Bunny Ear Mug",
    "category": "Bottles & Mugs",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023710-654236.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023710-654236.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023707-652337.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023724-656135.jpg"
    ],
    "description": "Bunny Sip Mug\n\nGlass Mug+ Cute Bunny Lid + Straw Lid.\nLeak Proof, BPA Free & Easy to Carry.\nYour Cutest Sip Partner!",
    "includes": [],
    "colors": [
      {
        "hex": "#f564b1",
        "name": "Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023710-654236.jpg"
      },
      {
        "hex": "#fce8e8",
        "name": "Beige",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023724-656135.jpg"
      },
      {
        "hex": "#3d8754",
        "name": "Olive",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023707-652337.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-604104",
    "name": "Lip Oil",
    "category": "Make up",
    "badge": "New Arrival ✨",
    "priceINR": 139,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023802-811643.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023802-811643.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023799-817537.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023814-791387.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023804-808218.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023810-803779.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023811-796367.jpg"
    ],
    "description": "Lip Oil - Nourish, Hydrate & Shine\n\nGet soft, juicy & glossy lips in one swipe! This lightweight Lip Oil deeply moisturizes and softens your lips, adds a natural shine, and keeps them hydrated all day. Non-sticky, gentle & safe for daily use.",
    "includes": [],
    "colors": [
      {
        "hex": "#e663c0",
        "name": "Pink",
        "image": null
      },
      {
        "hex": "#c70000",
        "name": "Red",
        "image": null
      },
      {
        "hex": "#ffff30",
        "name": "Yellow",
        "image": null
      },
      {
        "hex": "#ffbfbf",
        "name": "Peach",
        "image": null
      },
      {
        "hex": "#6eb6ff",
        "name": "Sky Blue",
        "image": null
      },
      {
        "hex": "#974dff",
        "name": "Purple",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "prod-thermal-flask",
    "name": "Mini Pastel Insulated Stainless Steel Flask (350ml)",
    "category": "Mystery Scoops",
    "badge": "All-Day Cold ❄️",
    "priceINR": 420,
    "image": "/images/deluxe-giftbox.jpg",
    "images": [
      "/images/deluxe-giftbox.jpg",
      "/images/deluxe-giftbox.jpg",
      "/images/scoop-bowl.jpg",
      "/images/asmr-packing.jpg"
    ],
    "description": "Pocket-sized double-wall vacuum insulated stainless steel thermos that keeps drinks cold or hot for over 12 hours.",
    "includes": [
      "12-Hour Temperature Retain",
      "Double-Wall 304 Steel",
      "Pocket & Mini-Bag Friendly",
      "Powder-Coated Pastel Shell"
    ],
    "colors": [
      {
        "hex": "#FFB6C1",
        "name": "Pastel Pink"
      },
      {
        "hex": "#A8E6CF",
        "name": "Mint Green"
      },
      {
        "hex": "#DED2F9",
        "name": "Lilac Purple"
      },
      {
        "hex": "#FFD3B6",
        "name": "Sunset Ombre"
      }
    ],
    "specifications": {
      "Capacity": "350ml - 800ml Ergonomic Everyday Volume",
      "Cleaning": "Easy Disassemble Wide Mouth Opening",
      "Features": "Leak-Proof Lock Cap with Straw & Adjustable Strap",
      "Material": "Food-Grade BPA-Free Tritan & 304 Stainless Steel",
      "Thermal Retain": "Keeps beverages fresh and temperature controlled"
    },
    "inStock": true
  },
  {
    "id": "prod-gradient-bottle",
    "name": "Pastel Gradient Motivational Bottle (800ml)",
    "category": "Mystery Scoops",
    "badge": "Hydration Chic 🌸",
    "priceINR": 349,
    "image": "/images/deluxe-giftbox.jpg",
    "images": [
      "/images/deluxe-giftbox.jpg",
      "/images/deluxe-giftbox.jpg",
      "/images/scoop-bowl.jpg",
      "/images/asmr-packing.jpg"
    ],
    "description": "Stunning pastel ombre frosted bottle with hourly hydration markers, ergonomic grip handle, and spill-resistant flip lid.",
    "includes": [
      "Hourly Time Goal Markers",
      "Frosted Velvet Touch Body",
      "Durable Carry Loop Handle",
      "Wide Mouth for Ice Cubes"
    ],
    "colors": [
      {
        "hex": "#FFB6C1",
        "name": "Pastel Pink"
      },
      {
        "hex": "#A8E6CF",
        "name": "Mint Green"
      },
      {
        "hex": "#DED2F9",
        "name": "Lilac Purple"
      },
      {
        "hex": "#FFD3B6",
        "name": "Sunset Ombre"
      }
    ],
    "specifications": {
      "Capacity": "350ml - 800ml Ergonomic Everyday Volume",
      "Cleaning": "Easy Disassemble Wide Mouth Opening",
      "Features": "Leak-Proof Lock Cap with Straw & Adjustable Strap",
      "Material": "Food-Grade BPA-Free Tritan & 304 Stainless Steel",
      "Thermal Retain": "Keeps beverages fresh and temperature controlled"
    },
    "inStock": true
  },
  {
    "id": "prod-bear-sipper",
    "name": "Kawaii Bear Sipper Bottle with Strap (600ml)",
    "category": "Mystery Scoops",
    "badge": "Viral Sipper 🥤",
    "priceINR": 399,
    "image": "/images/deluxe-giftbox.jpg",
    "images": [
      "/images/deluxe-giftbox.jpg",
      "/images/deluxe-giftbox.jpg",
      "/images/scoop-bowl.jpg",
      "/images/asmr-packing.jpg"
    ],
    "description": "Adorable frosted bear water bottle with soft silicone straw, leak-proof lock lid, and detachable adjustable shoulder strap.",
    "includes": [
      "BPA-Free Food Grade Tritan",
      "One-Click Pop Straw Cap",
      "Adjustable Crossbody Strap",
      "Leak-Proof Silicone Seal"
    ],
    "colors": [
      {
        "hex": "#FFB6C1",
        "name": "Pastel Pink"
      },
      {
        "hex": "#A8E6CF",
        "name": "Mint Green"
      },
      {
        "hex": "#DED2F9",
        "name": "Lilac Purple"
      },
      {
        "hex": "#FFD3B6",
        "name": "Sunset Ombre"
      }
    ],
    "specifications": {
      "Capacity": "350ml - 800ml Ergonomic Everyday Volume",
      "Cleaning": "Easy Disassemble Wide Mouth Opening",
      "Features": "Leak-Proof Lock Cap with Straw & Adjustable Strap",
      "Material": "Food-Grade BPA-Free Tritan & 304 Stainless Steel",
      "Thermal Retain": "Keeps beverages fresh and temperature controlled"
    },
    "inStock": true
  },
  {
    "id": "custom-item-795398",
    "name": "Kawaii Socks",
    "category": "Self-Care",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024420-868838.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024420-868838.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024422-867051.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024426-863214.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024433-859317.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024446-854591.jpg"
    ],
    "description": "🧸 Kawaii Cute Ankle Socks - Teddy & Floral Collection 🧦\n\nSoftest socks you will ever wear!\n\n✓ Super Soft Cotton - No irritation, full day comfort\n✓ Cute 3D Fluffy Teddy & Small Flowers\n✓ Low Ankle Size - Perfect for shoes\n✓ Stretchable - One size for all girls\n✓ Frill Lace Border\n\nBest for College, Office, Daily Wear & Gifting\n\nAvailable in Pink Teddy, Yellow Floral & More Designs",
    "includes": [],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "Yellow",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024433-859317.jpg"
      },
      {
        "hex": "#f288b4",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024446-854591.jpg"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024420-868838.jpg"
      },
      {
        "hex": "#ffffff",
        "name": "Floral White",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024426-863214.jpg"
      },
      {
        "hex": "#eda6cd",
        "name": "Floral Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024422-867051.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-290705",
    "name": "Floral Diary(Medium)",
    "category": "Kawaii Stationery",
    "badge": "New Arrival ✨",
    "priceINR": 149,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024369-539994.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024369-539994.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024380-523733.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024376-532816.jpg"
    ],
    "description": "Friendship Forever Medium Diary - A5 Size, 160 Pages\nHardbound Cover with BFF Trophy & Friends Illustration Design\nCute Unicorn & Fairy Butterfly Inner Pages with Colorful Border + Lines\nPerfect Gift for Best Friends, Girls, School Journal, Birthday Gift - 1 Diary",
    "includes": [],
    "colors": [
      {
        "hex": "#914949",
        "name": "Brown",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024376-532816.jpg"
      },
      {
        "hex": "#e3d1d1",
        "name": "Biege",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024369-539994.jpg"
      },
      {
        "hex": "#d4198c",
        "name": "Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024380-523733.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-395494",
    "name": "Insulated Lunch Bags",
    "category": "Korean wallets and bags",
    "badge": "New Arrival ✨",
    "priceINR": 197,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024496-677056.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024496-677056.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024522-659097.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024518-672053.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024507-664208.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024526-652340.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024537-644075.jpg"
    ],
    "description": "Insulated Lunch Bag\n✓ Hot/Cold 4-6 Hours\n✓ Waterproof & Washable\n✓ Cute Bunny Print\n✓ Spacious & Portable\nFor School, Office, Picnic\nSize: 21x19x14cm",
    "includes": [],
    "colors": [
      {
        "hex": "#d0f5bf",
        "name": "Sea Green",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024496-677056.jpg"
      },
      {
        "hex": "#fcacdb",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024537-644075.jpg"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024522-659097.jpg"
      },
      {
        "hex": "#262642",
        "name": "Navy Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024518-672053.jpg"
      },
      {
        "hex": "#bd6fa9",
        "name": "Onion",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024507-664208.jpg"
      },
      {
        "hex": "#757575",
        "name": "Grey",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024526-652340.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-261681",
    "name": "Korean Sling Bag",
    "category": "Korean wallets and bags",
    "badge": "New Arrival ✨",
    "priceINR": 449,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024697-392666.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024697-392666.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024705-397375.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024701-390053.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024709-384601.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024713-381537.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024717-376939.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024727-371317.jpg"
    ],
    "description": "Knitted Bag, Soft, lightweight & spacious. Hand + shoulder carry.",
    "includes": [],
    "colors": [
      {
        "hex": "#785959",
        "name": "Mocha Brown",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024697-392666.jpg"
      },
      {
        "hex": "#e072e0",
        "name": "Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024709-384601.jpg"
      },
      {
        "hex": "#26a644",
        "name": "Green",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024713-381537.jpg"
      },
      {
        "hex": "#6dd1de",
        "name": "Sky Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024701-390053.jpg"
      },
      {
        "hex": "#8146f0",
        "name": "Lavender",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024717-376939.jpg"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024705-397375.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "wallet-white",
    "name": "Soft Korean Minimalist Wallet ",
    "category": "Korean wallets and bags",
    "badge": "Clean Aesthetic 🤍",
    "priceINR": 250,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound3601577665415700584-948820.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound3601577665415700584-948820.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound6308014432477278144-075762.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound9186225392587529994-080952.png"
    ],
    "description": "Chic creamy ivory quilted pocket wallet with durable gold hardware and a cute teddy charm. Fits in any mini bag.",
    "includes": [
      "Smooth Zipper Slider",
      "Cash & Card Compartments",
      "Aesthetic Pastel Finish"
    ],
    "colors": [
      {
        "hex": "#fff0f0",
        "name": "Ivory White",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound3601577665415700584-948820.png"
      },
      {
        "hex": "#d4a5d0",
        "name": "Blush pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound6308014432477278144-075762.png"
      },
      {
        "hex": "#6e4b36",
        "name": "Chocolate Brown",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/inbound9186225392587529994-080952.png"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-067783",
    "name": "Portable Mini Hand fan ",
    "category": "Accessories",
    "badge": "New Arrival ✨",
    "priceINR": 275,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024681-197035.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024681-197035.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024672-200055.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024677-194411.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024685-158336.jpg"
    ],
    "description": "🎀 Mini Portable Hand Fan 💨\nCute. Powerful. Portable.\nFull Speed | USB Charge | Lightweight | Pocket Size\nStay cute in this heat!",
    "includes": [],
    "colors": [
      {
        "hex": "#E5C158",
        "name": " Yellow ",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024677-194411.jpg"
      },
      {
        "hex": "#edaddc",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024685-158336.jpg"
      },
      {
        "hex": "#3e7052",
        "name": "Bottle Green",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024672-200055.jpg"
      },
      {
        "hex": "#4bc4a4",
        "name": "Sea Green",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024681-197035.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-352970",
    "name": "Tubby Bear Sticky Notes",
    "category": "Kawaii Stationery",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024322-580333.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024322-580333.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024320-558451.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024321-554459.jpg"
    ],
    "description": "🐻💜 Tubby Bear Sticky Notes -\n70 Sheets | Cute Bear Shape | Strong Sticky\nFor To-Do, Journal, Study\nScoopStorey ",
    "includes": [],
    "colors": [
      {
        "hex": "#b495f0",
        "name": "Lavender",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024322-580333.jpg"
      },
      {
        "hex": "#d991c8",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024321-554459.jpg"
      },
      {
        "hex": "#8ec9ed",
        "name": "Sky Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024320-558451.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-409538",
    "name": "Plushie Mirror ",
    "category": "Accessories",
    "badge": "New Arrival ✨",
    "priceINR": 449,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024569-493092.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024569-493092.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024585-490418.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024594-488965.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024597-486027.jpg"
    ],
    "description": "🎀 Plushie Mirror 🪞\nSoft Plush | Clear Mirror | Pocket Size\nCute & Handy 💖",
    "includes": [],
    "colors": [
      {
        "hex": "#d16f6f",
        "name": "Brown",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024597-486027.jpg"
      },
      {
        "hex": "#e381c1",
        "name": "Blush Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024569-493092.jpg"
      },
      {
        "hex": "#ffbde8",
        "name": "Baby pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024594-488965.jpg"
      },
      {
        "hex": "#b370ff",
        "name": "Lavender",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024585-490418.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-093697",
    "name": "Lipstick Pouch",
    "category": "Korean wallets and bags",
    "badge": "New Arrival ✨",
    "priceINR": 249,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024651-141482.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024651-141482.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024636-152651.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024648-147029.jpg"
    ],
    "description": "Luxury Lipstick Pouch- Cute mini pouch with keychain & satin scarf. Lipstick, coin, earbuds sab rakh lo.",
    "includes": [],
    "colors": [
      {
        "hex": "#422c2c",
        "name": "Chocolate Brown",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024651-141482.jpg"
      },
      {
        "hex": "#fff0f0",
        "name": "Beige",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024636-152651.jpg"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024648-147029.jpg"
      }
    ],
    "specifications": {
      "Finish": "18K Gold Plated",
      "Material": "Anti-Tarnish Alloy",
      "Packaging": "Velvet Gift Card"
    },
    "inStock": true
  },
  {
    "id": "custom-item-261431",
    "name": "Comb & Mirror Combo",
    "category": "Hair Accessories",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024279-340427.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024279-340427.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024305-187566.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024297-344840.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024284-333044.jpg"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [],
    "colors": [
      {
        "hex": "#b283d4",
        "name": "Lavender",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024279-340427.jpg"
      },
      {
        "hex": "#e5abf5",
        "name": "Baby Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024297-344840.jpg"
      },
      {
        "hex": "#bde4ff",
        "name": "Sky Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024284-333044.jpg"
      },
      {
        "hex": "#eeffa1",
        "name": "Lemon",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024305-187566.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-734868",
    "name": "Unicorn Lipgloss ",
    "category": "Make up",
    "badge": "New Arrival ✨",
    "priceINR": 139,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024024-052396.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024024-052396.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024028-065203.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024030-061943.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024022-048382.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024014-045154.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024032-057976.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024026-055408.jpg"
    ],
    "description": "Unicorn Pen Lip Gloss - Pink Glitter Shine, Glossy, Long Lasting & Super Hydrating. Cute pen design, perfect for daily wear & gifting.",
    "includes": [],
    "colors": [
      {
        "hex": "#f04a13",
        "name": "Orange",
        "image": null
      },
      {
        "hex": "#f5a9a9",
        "name": "Peach",
        "image": null
      },
      {
        "hex": "#f59fbf",
        "name": "Baby Pink",
        "image": null
      },
      {
        "hex": "#9557f2",
        "name": "Lavender",
        "image": null
      },
      {
        "hex": "#6bb7fa",
        "name": "Sky blue",
        "image": null
      },
      {
        "hex": "#fff491",
        "name": "Lemon",
        "image": null
      },
      {
        "hex": "#66d4b8",
        "name": "Sea Green",
        "image": null
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-382812",
    "name": "Pom Pom Doll keychain ",
    "category": "Key chains",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025663-831617.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025663-831617.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025659-836347.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025666-827907.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025673-825258.jpg"
    ],
    "description": " Doll Keychain 💖✨\nSuper soft fluffy pom-pom, cute doll face with glasses & tiny pom-pom feet! 🎀\nYour bag's new best friend!",
    "includes": [],
    "colors": [
      {
        "hex": "#ab0707",
        "name": "Red",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025659-836347.png"
      },
      {
        "hex": "#e2ff63",
        "name": "Neon Green",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025666-827907.jpg"
      },
      {
        "hex": "#cb9af5",
        "name": "Lavender",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025663-831617.jpg"
      },
      {
        "hex": "#c94d89",
        "name": "Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025673-825258.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-537341",
    "name": "Hello Kitty Keychain",
    "category": "Key chains",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025621-808786.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025621-808786.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025628-574296.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025626-571474.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025624-569229.jpg"
    ],
    "description": "Hello Kitty Lucky Day Keychain 🎀✨\nCute Hello Kitty with pretty bow + Lucky Day strap! ✨\nYour bag, keys & mood - sab lucky!",
    "includes": [],
    "colors": [
      {
        "hex": "#af74c4",
        "name": " Lavender ",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025624-569229.jpg"
      },
      {
        "hex": "#4196c4",
        "name": " Blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025628-574296.jpg"
      },
      {
        "hex": "#ffabe9",
        "name": "Pink",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025626-571474.jpg"
      },
      {
        "hex": "#b81818",
        "name": "Red",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025621-808786.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-664535",
    "name": "Camera Keychain 📸😻",
    "category": "Key chains",
    "badge": "New Arrival ✨",
    "priceINR": 99,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025600-777506.png",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025600-777506.png",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025606-772513.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025611-769728.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025614-766524.jpg"
    ],
    "description": "Camera Keychain 📸✨\nCute mini camera design with tiny bell charm! 🔔\nYour bag's cutest click! DM to order 📩",
    "includes": [],
    "colors": [
      {
        "hex": "#ffea00",
        "name": "Capybara ",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025600-777506.png"
      },
      {
        "hex": "#39005e",
        "name": "Nezha",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025611-769728.jpg"
      },
      {
        "hex": "#e6cf3e",
        "name": "Sahur",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025614-766524.jpg"
      },
      {
        "hex": "#8b48d4",
        "name": "Cinnamoroll",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025606-772513.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "custom-item-976246",
    "name": "Bubble Tea Keychain ",
    "category": "Key chains",
    "badge": "New Arrival ✨",
    "priceINR": 199,
    "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025652-104092.jpg",
    "images": [
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025652-104092.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025655-094655.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025658-090845.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025636-087399.jpg",
      "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025676-210752.jpg"
    ],
    "description": "Bubble Tea Keychain 🧋✨\nCute mini bubble cup with tiny boba balls inside + Bubble strap! 💖\nShake karo, shine karo - your bag's cutest sip!",
    "includes": [],
    "colors": [
      {
        "hex": "#77b9e6",
        "name": "Sky blue",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025655-094655.jpg"
      },
      {
        "hex": "#b88df7",
        "name": "Lavender",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025676-210752.jpg"
      },
      {
        "hex": "#e6dd40",
        "name": "Yellow",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025652-104092.jpg"
      },
      {
        "hex": "#b32d2d",
        "name": "Red",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025636-087399.jpg"
      },
      {
        "hex": "#4b9fd6",
        "name": "Balloon",
        "image": "https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025658-090845.jpg"
      }
    ],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "scoop-mini",
    "name": "Scoop Storey - Mini Scoop",
    "category": "Mystery Scoops",
    "badge": "Popular Starter 🎀",
    "priceINR": 799,
    "image": "/images/scoop-bowl.jpg",
    "images": [
      "/images/scoop-bowl.jpg",
      "/images/asmr-packing.jpg",
      "/images/deluxe-giftbox.jpg"
    ],
    "description": "Handpicked cute surprises just for you! Filled with 7–8 aesthetic kawaii products drawn from our 54-item official scoop board (Beauty Essentials, Accessories, Stationery & Lifestyle), extra free gifts, and free delivery across India.",
    "includes": [
      "7–8 Handpicked Surprise Products",
      "From 54 Official Scoop Board Items",
      "Extra Free Surprise Gifts Included",
      "Free Express Shipping Across India",
      "Cute Packaging & Free Stickers"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "scoop-midi",
    "name": "Scoop Storey - Midi Scoop",
    "category": "Mystery Scoops",
    "badge": "Best Value 🔥",
    "priceINR": 1299,
    "image": "/images/scoop-bowl.jpg",
    "images": [
      "/images/scoop-bowl.jpg",
      "/images/asmr-packing.jpg",
      "/images/deluxe-giftbox.jpg"
    ],
    "description": "Our fan-favorite haul! 2 deep satisfying scoops packed with 12–15 premium kawaii products drawn from our 54-item official scoop board (Beauty Essentials, Accessories, Stationery & Lifestyle), extra free gifts, and free delivery across India.",
    "includes": [
      "12–15 Handpicked Surprise Products",
      "From 54 Official Scoop Board Items",
      "Extra Free Surprise Gifts Included",
      "Free Express Shipping Across India",
      "ASMR Reel Filming Eligible"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  },
  {
    "id": "scoop-big",
    "name": "Scoop Storey - Big Scoop",
    "category": "Mystery Scoops",
    "badge": "Collector Choice ✨",
    "priceINR": 1799,
    "image": "/images/deluxe-giftbox.jpg",
    "images": [
      "/images/deluxe-giftbox.jpg",
      "/images/scoop-bowl.jpg",
      "/images/asmr-packing.jpg"
    ],
    "description": "The ultimate luxury hamper! Includes everything from a Mini Scoop + Midi Scoop with over 20+ aesthetic items drawn from our 54-item official scoop board (Beauty Essentials, Accessories, Stationery & Lifestyle), plushies, even more extra free gifts, and free delivery across India.",
    "includes": [
      "Over 20+ Premium Items",
      "From 54 Official Scoop Board Items",
      "Everything from Mini + Midi Scoop",
      "Even More Extra Free Gifts",
      "Free Express Shipping Across India",
      "VIP Hamper Packaging"
    ],
    "colors": [],
    "specifications": {},
    "inStock": true
  }
];

export const CATEGORIES = [
  'All Items',
  'Mystery Scoops',
  'Pendants & Chains',
  'Bracelets',
  'Anklets',
  'Make up',
  'Soft Toys',
  'Key chains',
  'Hair Accessories',
  'Self-Care',
  'Korean wallets and bags',
  'Kawaii Stationery',
  'Bottles & Mugs',
  'Accessories'
];

export const DEPARTMENTS_CONFIG = [
  { id: 'all', name: 'All Collections', icon: '🌟', badge: '13 Curations', count: 13 },
  { id: 'scoops', name: 'Mystery Scoops', icon: '🍨', badge: 'ASMR Hauls', count: 1 },
  { id: 'jewelry', name: 'Korean Jewels', icon: '💎', badge: 'Anti-Tarnish', count: 3 },
  { id: 'beauty', name: 'Beauty & Glow', icon: '💄', badge: 'Self-Care', count: 2 },
  { id: 'lifestyle', name: 'Kawaii Lifestyle', icon: '🧸', badge: 'Cute Goodies', count: 7 }
];

export const COLLECTIONS_CONFIG = [
  {
    id: 'mystery-scoops',
    category: 'Mystery Scoops',
    name: 'Mystery Scoops',
    department: 'scoops',
    icon: '🍨',
    badge: 'Popular ASMR Hauls 🎀',
    tagline: 'Hand-Scooped Charms, Keychain & Blind Surprises',
    description: 'Dip directly into hundreds of handcrafted Kawaii charms, pastel pearls, and VIP mystery blind boxes packed live on Instagram Reels.',
    coverImage: '/images/scoop-bowl.jpg',
    gradient: 'from-pink-500/15 via-rose-500/10 to-purple-500/20',
    borderHover: 'hover:border-pink-400',
    btnGradient: 'bg-gradient-to-r from-pink-500 to-rose-500'
  },
  {
    id: 'pendants-chains',
    category: 'Pendants & Chains',
    name: 'Pendants & Chains',
    department: 'jewelry',
    icon: '✨',
    badge: 'Korean Anti-Tarnish 💖',
    tagline: '18K Yellow & Rose Gold Plated Aesthetic Necklaces',
    description: 'Anti-tarnish, water-resistant dainty chains, sparkling bow hearts, sculpted Monalisa crystals, and lustrous baroque pearls.',
    coverImage: '/images/pendants.jpg',
    gradient: 'from-amber-500/15 via-pink-500/10 to-rose-500/20',
    borderHover: 'hover:border-amber-400',
    btnGradient: 'bg-gradient-to-r from-amber-500 to-pink-500'
  },
  {
    id: 'bracelets',
    category: 'Bracelets',
    name: 'Bracelets',
    department: 'jewelry',
    icon: '🎀',
    badge: 'Handcrafted Dainty ✨',
    tagline: 'Romantic Charm Links & Protective Evil Eye Talismans',
    description: 'Adjustable charm link bracelets, protective evil eye amulets, and fairy-core pastel glass beads designed for daily stacking.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000022689-564739.png',
    gradient: 'from-purple-500/15 via-pink-500/10 to-indigo-500/20',
    borderHover: 'hover:border-purple-400',
    btnGradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 'anklets',
    category: 'Anklets',
    name: 'Anklets',
    department: 'jewelry',
    icon: '💫',
    badge: 'Summer Shimmer ☀️',
    tagline: 'Liquid Gold Snake Chains & Barely-There Stationed Beads',
    description: 'Sleek, fluid herringbone snake chains and dainty beaded ankle chains that never snag and add instant shimmer to sneakers or heels.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020275-997799.jpg',
    gradient: 'from-amber-500/15 via-orange-500/10 to-pink-500/20',
    borderHover: 'hover:border-amber-400',
    btnGradient: 'bg-gradient-to-r from-amber-500 to-orange-500'
  },
  {
    id: 'makeup',
    category: 'Make up',
    name: 'Make up',
    department: 'beauty',
    icon: '💄',
    badge: 'Pastel Glow 💋',
    tagline: 'Fruit-Tinted Lip Oils, Jelly Blushes & Shimmer Glaze',
    description: 'Cute aesthetic lip tints, fruit lip oils, jelly blush sticks, and shimmer eyeshadows crafted for everyday pastel glow.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023632-055369.png',
    gradient: 'from-rose-500/15 via-pink-500/10 to-fuchsia-500/20',
    borderHover: 'hover:border-rose-400',
    btnGradient: 'bg-gradient-to-r from-rose-500 to-pink-500'
  },
  {
    id: 'self-care',
    category: 'Self-Care',
    name: 'Self-Care',
    department: 'beauty',
    icon: '🌸',
    badge: 'Glow Routine ✨',
    tagline: 'Cloud Sleeping Masks, Refreshing Wipes & Beauty Treats',
    description: 'Ultra-soft cloud velvet and silk sleeping masks, viral novelty soda can wet wipes, deep cleansing nose strips, and cute sensory self-care essentials.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000020284-107611.jpg',
    gradient: 'from-rose-500/15 via-teal-500/10 to-emerald-500/20',
    borderHover: 'hover:border-rose-400',
    btnGradient: 'bg-gradient-to-r from-rose-500 to-teal-500'
  },
  {
    id: 'soft-toys',
    category: 'Soft Toys',
    department: 'lifestyle',
    name: 'Soft Toys',
    icon: '🧸',
    badge: 'Super Fluffy ☁️',
    tagline: 'Cloud-Soft Cuddle Plushies, Boba Cups & Velvet Cuties',
    description: 'Ultra-soft squishy boba plushies, long-eared bunny cuties, and sleeping kitten pillows that bring instant cozy comfort.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024255-720651.jpg',
    gradient: 'from-amber-500/15 via-rose-500/10 to-pink-500/20',
    borderHover: 'hover:border-amber-400',
    btnGradient: 'bg-gradient-to-r from-amber-500 to-pink-500'
  },
  {
    id: 'keychains',
    category: 'Key chains',
    department: 'lifestyle',
    name: 'Key chains',
    icon: '🗝️',
    badge: 'Kawaii Charms ✨',
    tagline: 'Liquid Floating Bear Keychains, Sanrio Bells & Phone Charms',
    description: 'Floating glitter kawaii bear key rings, pastel anime bell strap charms, and aesthetic beaded wristlet phone lanyards.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000025663-831617.jpg',
    gradient: 'from-purple-500/15 via-pink-500/10 to-amber-500/20',
    borderHover: 'hover:border-purple-400',
    btnGradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 'hair-accessories',
    category: 'Hair Accessories',
    department: 'lifestyle',
    name: 'Hair Accessories',
    icon: '🎀',
    badge: 'Cute Styling 🌸',
    tagline: 'Pastel Butterfly Claws, Fluffy Scrunchies & Pearl Pins',
    description: 'Non-slip matte butterfly hair claws, cloud-plush velvet scrunchies, and iridescent Korean pearl clip pairs.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024279-340427.jpg',
    gradient: 'from-pink-500/15 via-purple-500/10 to-rose-500/20',
    borderHover: 'hover:border-pink-400',
    btnGradient: 'bg-gradient-to-r from-pink-500 to-purple-500'
  },
  {
    id: 'korean-wallets-and-bags',
    category: 'Korean wallets and bags',
    department: 'lifestyle',
    name: 'Korean wallets and bags',
    icon: '👛',
    badge: 'Boutique Hot 🔥',
    tagline: 'Quilted Diamond Pocket Wallets, Totes & Mini Bags',
    description: 'Soft pastel diamond-quilted pocket wallets, aesthetic totes, mini bags, and kawaii accessories featuring durable gold hardware and plush bear charms.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024496-677056.jpg',
    gradient: 'from-pink-500/15 via-purple-500/10 to-rose-500/20',
    borderHover: 'hover:border-pink-400',
    btnGradient: 'bg-gradient-to-r from-pink-500 to-purple-500'
  },
  {
    id: 'kawaii-stationery',
    category: 'Kawaii Stationery',
    department: 'lifestyle',
    name: 'Kawaii Stationery',
    icon: '📝',
    badge: 'Pastel Journaling ✨',
    tagline: 'Floral Diaries, Magnetic Bookmarks & Sticky Notes',
    description: 'Aesthetic floral diaries, magnetic bookmarks, kawaii sticky notes, and pastel journaling essentials.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024332-291296.jpg',
    gradient: 'from-amber-500/15 via-rose-500/10 to-pink-500/20',
    borderHover: 'hover:border-amber-400',
    btnGradient: 'bg-gradient-to-r from-amber-500 to-pink-500'
  },
  {
    id: 'bottles-mugs',
    category: 'Bottles & Mugs',
    department: 'lifestyle',
    name: 'Bottles & Mugs',
    icon: '🥛',
    badge: 'Cute Drinkware 🎀',
    tagline: 'Labubu Sippers, Pearl Glass Mugs & Bunny Drinkware',
    description: 'Aesthetic cute drinkware including Labubu bottles, pearl glass mugs, and cute bunny ear sippers.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000023670-563833.jpg',
    gradient: 'from-teal-500/15 via-cyan-500/10 to-blue-500/20',
    borderHover: 'hover:border-teal-400',
    btnGradient: 'bg-gradient-to-r from-teal-500 to-cyan-500'
  },
  {
    id: 'accessories',
    category: 'Accessories',
    department: 'lifestyle',
    name: 'Accessories',
    icon: '✨',
    badge: 'Everyday Cute ✨',
    tagline: 'Mini Portable Fans, Plushie Mirrors & Cute Gadgets',
    description: 'Everyday aesthetic accessories including portable handheld mini fans, plushie compact mirrors, and kawaii lifestyle essentials.',
    coverImage: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/uploads/1000024681-197035.jpg',
    gradient: 'from-purple-500/15 via-pink-500/10 to-amber-500/20',
    borderHover: 'hover:border-purple-400',
    btnGradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
  }
];

export function categoryToSlug(category) {
  if (!category || category === 'All Items') return 'all';
  if (category === 'Mystery Scoops') return 'mystery-scoops';
  if (category === 'Pendants & Chains') return 'pendants-chains';
  if (category === 'Bracelets') return 'bracelets';
  if (category === 'Anklets') return 'anklets';
  if (category === 'Make up' || category === 'Makeup') return 'makeup';
  if (category === 'Soft Toys' || category === 'soft toys') return 'soft-toys';
  if (category === 'Key chains' || category === 'Keychains' || category === 'key chains') return 'keychains';
  if (category === 'Hair Accessories' || category === 'hair accessories') return 'hair-accessories';
  if (category === 'Self-Care') return 'self-care';
  if (category === 'Eye Masks') return 'self-care';
  if (category === 'Kawaii Stationery' || category === 'kawaii stationery') return 'kawaii-stationery';
  if (category === 'Bottles & Mugs' || category === 'bottles & mugs' || category === 'bottles') return 'bottles-mugs';
  if (category === 'Accessories' || category === 'accessories') return 'accessories';
  if (
    category === 'Korean wallets and bags' ||
    category === 'Korean Wallets and Bags' ||
    category === 'Korean Wallets & Bags' ||
    category === 'Korean Wallets' ||
    category === 'Bags' ||
    category === 'Stationery and bags' ||
    category === 'Stationery & bags'
  ) return 'korean-wallets-and-bags';
  // Backward compatibility
  if (category === 'Bracelets & Anklets') return 'bracelets';
  if (category === 'Eye Masks & Self-Care') return 'self-care';
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function slugToCategory(slug, products = []) {
  if (!slug || slug === 'all') return 'All Items';
  if (slug === 'mystery-scoops' || slug === 'scoops') return 'Mystery Scoops';
  if (slug === 'pendants-chains' || slug === 'pendants') return 'Pendants & Chains';
  if (slug === 'bracelets') return 'Bracelets';
  if (slug === 'anklets') return 'Anklets';
  if (slug === 'bracelets-anklets') return 'Bracelets';
  if (slug === 'makeup' || slug === 'make-up') return 'Make up';
  if (slug === 'soft-toys' || slug === 'plushies') return 'Soft Toys';
  if (slug === 'keychains' || slug === 'key-chains') return 'Key chains';
  if (slug === 'hair-accessories') return 'Hair Accessories';
  if (slug === 'eye-masks' || slug === 'eyemasks') return 'Self-Care';
  if (slug === 'self-care' || slug === 'skincare') return 'Self-Care';
  if (slug === 'eyemasks-selfcare') return 'Self-Care';
  if (slug === 'kawaii-stationery' || slug === 'stationery') return 'Kawaii Stationery';
  if (slug === 'bottles-mugs' || slug === 'bottles') return 'Bottles & Mugs';
  if (slug === 'accessories') return 'Accessories';
  if (
    slug === 'korean-wallets-and-bags' ||
    slug === 'korean-wallets' || 
    slug === 'wallets' || 
    slug === 'bags' || 
    slug === 'stationery-and-bags' ||
    slug === 'stationery-bags'
  ) return 'Korean wallets and bags';
  
  // 1. Check custom categories stored in localStorage (created in Admin Panel)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('bhaskar_custom_categories_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const match = parsed.find(c => c.name && categoryToSlug(c.name) === slug);
          if (match) return match.name;
        }
      }
    } catch {}
  }

  // 2. Check categories in products list
  if (Array.isArray(products)) {
    const found = products.find(p => p.category && categoryToSlug(p.category) === slug);
    if (found) return found.category;
  }
  return null;
}
