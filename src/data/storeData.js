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
    "image": "/images/pendants/sun-pendant.webp",
    "images": [
      "/images/pendants/sun-pendant.webp"
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
    "image": "/images/bracelets/butterfly-charm-bracelet.webp",
    "images": [
      "/images/bracelets/butterfly-charm-bracelet.webp"
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
    "image": "/images/bracelets-anklets.webp",
    "images": [
      "/images/bracelets-anklets.webp"
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
    "image": "/images/bracelets-anklets.webp",
    "images": [
      "/images/bracelets-anklets.webp"
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
    "image": "/images/pendants/heart-pendant.webp",
    "images": [
      "/images/pendants/heart-pendant.webp"
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
    "image": "/images/pendants/little-heart-pendant.webp",
    "images": [
      "/images/pendants/little-heart-pendant.webp"
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
    "image": "/images/pendants/rose-heart-pendant.webp",
    "images": [
      "/images/pendants/rose-heart-pendant.webp"
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
    "image": "/images/pendants/pearl-pendant.webp",
    "images": [
      "/images/pendants/pearl-pendant.webp"
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
    "image": "/images/pendants/monalisa-pendant.webp",
    "images": [
      "/images/pendants/monalisa-pendant.webp"
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
    "image": "/images/pendants/bow-heart-pendant.webp",
    "images": [
      "/images/pendants/bow-heart-pendant.webp"
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
    "image": "/images/pendants/snake-chain-pendant.webp",
    "images": [
      "/images/pendants/snake-chain-pendant.webp"
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
    "image": "/images/bracelets/butterfly-charm-bracelet.webp",
    "images": [
      "/images/bracelets/butterfly-charm-bracelet.webp"
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
    "image": "/images/bracelets/butterfly-charm-bracelet.webp",
    "images": [
      "/images/bracelets/butterfly-charm-bracelet.webp"
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
    "image": "/images/bracelets/butterfly-charm-bracelet.webp",
    "images": [
      "/images/bracelets/butterfly-charm-bracelet.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/bracelets/butterfly-charm-bracelet.webp",
    "images": [
      "/images/bracelets/butterfly-charm-bracelet.webp"
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
    "image": "/images/bracelets/butterfly-charm-bracelet.webp",
    "images": [
      "/images/bracelets/butterfly-charm-bracelet.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
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
    "image": "/images/scoop-bowl.webp",
    "images": [
      "/images/scoop-bowl.webp"
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
    "image": "/images/scoop-bowl.webp",
    "images": [
      "/images/scoop-bowl.webp"
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
        "image": "/images/scoop-bowl.webp"
      },
      {
        "hex": "#edd974",
        "name": "Yellow",
        "image": "/images/scoop-bowl.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/scoop-chart-stationery-lifestyle.webp",
    "images": [
      "/images/scoop-chart-stationery-lifestyle.webp"
    ],
    "description": "📚✨ Magnetic Bookmark - Set of 6 pcs\nFloral Design | Magnetic Clip | No Page Damage\nFor Books, Diary, Journal",
    "includes": [],
    "colors": [
      {
        "hex": "#8ec9ed",
        "name": "Sky blue",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
      },
      {
        "hex": "#d98db5",
        "name": "Baby Pink",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
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
    "image": "/images/deluxe-giftbox.webp",
    "images": [
      "/images/deluxe-giftbox.webp"
    ],
    "description": "Plushie Blush Labubu 🐰✨ Fluffy, dreamy & totally adorable!",
    "includes": [],
    "colors": [
      {
        "hex": "#ffa8a8",
        "name": "Peach",
        "image": "/images/deluxe-giftbox.webp"
      },
      {
        "hex": "#81c4e6",
        "name": "Sky Blue",
        "image": "/images/deluxe-giftbox.webp"
      },
      {
        "hex": "#41b091",
        "name": "Green",
        "image": "/images/deluxe-giftbox.webp"
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
    "image": "/images/deluxe-giftbox.webp",
    "images": [
      "/images/deluxe-giftbox.webp"
    ],
    "description": "Soft  Bunny Keychain 🐰💙 Floral dress, super cute & soft!",
    "includes": [],
    "colors": [
      {
        "hex": "#ebbee2",
        "name": "Baby Pink",
        "image": "/images/deluxe-giftbox.webp"
      },
      {
        "hex": "#faf2f2",
        "name": "Off white",
        "image": "/images/deluxe-giftbox.webp"
      },
      {
        "hex": "#8ecaed",
        "name": "Sky Blue",
        "image": "/images/deluxe-giftbox.webp"
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
    "image": "/images/scoop-chart-stationery-lifestyle.webp",
    "images": [
      "/images/scoop-chart-stationery-lifestyle.webp"
    ],
    "description": "Best Friends Forever Diary - A5 Big Size, 180 Pages\nPremium Hardbound Cover with Orange Roses Design\nPink Floral Inner Pages with Horizontal Lines + Red Ribbon Bookmark\nBest Gift for BFF, Girls, Friendship Day & Birthday - 1 Diary",
    "includes": [],
    "colors": [
      {
        "hex": "#bd4d4d",
        "name": "Brown",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
      },
      {
        "hex": "#dbb8b8",
        "name": "Beige",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/scoop-bowl.webp",
    "images": [
      "/images/scoop-bowl.webp"
    ],
    "description": "Bunny Sip Mug\n\nGlass Mug+ Cute Bunny Lid + Straw Lid.\nLeak Proof, BPA Free & Easy to Carry.\nYour Cutest Sip Partner!",
    "includes": [],
    "colors": [
      {
        "hex": "#f564b1",
        "name": "Pink",
        "image": "/images/scoop-bowl.webp"
      },
      {
        "hex": "#fce8e8",
        "name": "Beige",
        "image": "/images/scoop-bowl.webp"
      },
      {
        "hex": "#3d8754",
        "name": "Olive",
        "image": "/images/scoop-bowl.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/deluxe-giftbox.webp",
    "images": [
      "/images/deluxe-giftbox.webp",
      "/images/scoop-bowl.webp",
      "/images/asmr-packing.webp"
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
    "image": "/images/deluxe-giftbox.webp",
    "images": [
      "/images/deluxe-giftbox.webp",
      "/images/scoop-bowl.webp",
      "/images/asmr-packing.webp"
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
    "image": "/images/deluxe-giftbox.webp",
    "images": [
      "/images/deluxe-giftbox.webp",
      "/images/scoop-bowl.webp",
      "/images/asmr-packing.webp"
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
    "image": "/images/eyemasks-skincare.webp",
    "images": [
      "/images/eyemasks-skincare.webp"
    ],
    "description": "🧸 Kawaii Cute Ankle Socks - Teddy & Floral Collection 🧦\n\nSoftest socks you will ever wear!\n\n✓ Super Soft Cotton - No irritation, full day comfort\n✓ Cute 3D Fluffy Teddy & Small Flowers\n✓ Low Ankle Size - Perfect for shoes\n✓ Stretchable - One size for all girls\n✓ Frill Lace Border\n\nBest for College, Office, Daily Wear & Gifting\n\nAvailable in Pink Teddy, Yellow Floral & More Designs",
    "includes": [],
    "colors": [
      {
        "hex": "#E5C158",
        "name": "Yellow",
        "image": "/images/eyemasks-skincare.webp"
      },
      {
        "hex": "#f288b4",
        "name": "Baby Pink",
        "image": "/images/eyemasks-skincare.webp"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "/images/eyemasks-skincare.webp"
      },
      {
        "hex": "#ffffff",
        "name": "Floral White",
        "image": "/images/eyemasks-skincare.webp"
      },
      {
        "hex": "#eda6cd",
        "name": "Floral Pink",
        "image": "/images/eyemasks-skincare.webp"
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
    "image": "/images/scoop-chart-stationery-lifestyle.webp",
    "images": [
      "/images/scoop-chart-stationery-lifestyle.webp"
    ],
    "description": "Friendship Forever Medium Diary - A5 Size, 160 Pages\nHardbound Cover with BFF Trophy & Friends Illustration Design\nCute Unicorn & Fairy Butterfly Inner Pages with Colorful Border + Lines\nPerfect Gift for Best Friends, Girls, School Journal, Birthday Gift - 1 Diary",
    "includes": [],
    "colors": [
      {
        "hex": "#914949",
        "name": "Brown",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
      },
      {
        "hex": "#e3d1d1",
        "name": "Biege",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
      },
      {
        "hex": "#d4198c",
        "name": "Pink",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
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
    "image": "/images/korean-wallets.webp",
    "images": [
      "/images/korean-wallets.webp"
    ],
    "description": "Insulated Lunch Bag\n✓ Hot/Cold 4-6 Hours\n✓ Waterproof & Washable\n✓ Cute Bunny Print\n✓ Spacious & Portable\nFor School, Office, Picnic\nSize: 21x19x14cm",
    "includes": [],
    "colors": [
      {
        "hex": "#d0f5bf",
        "name": "Sea Green",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#fcacdb",
        "name": "Baby Pink",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#262642",
        "name": "Navy Blue",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#bd6fa9",
        "name": "Onion",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#757575",
        "name": "Grey",
        "image": "/images/korean-wallets.webp"
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
    "image": "/images/korean-wallets.webp",
    "images": [
      "/images/korean-wallets.webp"
    ],
    "description": "Knitted Bag, Soft, lightweight & spacious. Hand + shoulder carry.",
    "includes": [],
    "colors": [
      {
        "hex": "#785959",
        "name": "Mocha Brown",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#e072e0",
        "name": "Pink",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#26a644",
        "name": "Green",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#6dd1de",
        "name": "Sky Blue",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#8146f0",
        "name": "Lavender",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "/images/korean-wallets.webp"
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
    "image": "/images/korean-wallets.webp",
    "images": [
      "/images/korean-wallets.webp"
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
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#d4a5d0",
        "name": "Blush pink",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#6e4b36",
        "name": "Chocolate Brown",
        "image": "/images/korean-wallets.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
    ],
    "description": "🎀 Mini Portable Hand Fan 💨\nCute. Powerful. Portable.\nFull Speed | USB Charge | Lightweight | Pocket Size\nStay cute in this heat!",
    "includes": [],
    "colors": [
      {
        "hex": "#E5C158",
        "name": " Yellow ",
        "image": "/images/scoop-chart-beauty-accessories.webp"
      },
      {
        "hex": "#edaddc",
        "name": "Baby Pink",
        "image": "/images/scoop-chart-beauty-accessories.webp"
      },
      {
        "hex": "#3e7052",
        "name": "Bottle Green",
        "image": "/images/scoop-chart-beauty-accessories.webp"
      },
      {
        "hex": "#4bc4a4",
        "name": "Sea Green",
        "image": "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/scoop-chart-stationery-lifestyle.webp",
    "images": [
      "/images/scoop-chart-stationery-lifestyle.webp"
    ],
    "description": "🐻💜 Tubby Bear Sticky Notes -\n70 Sheets | Cute Bear Shape | Strong Sticky\nFor To-Do, Journal, Study\nScoopStorey ",
    "includes": [],
    "colors": [
      {
        "hex": "#b495f0",
        "name": "Lavender",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
      },
      {
        "hex": "#d991c8",
        "name": "Baby Pink",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
      },
      {
        "hex": "#8ec9ed",
        "name": "Sky Blue",
        "image": "/images/scoop-chart-stationery-lifestyle.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
    ],
    "description": "🎀 Plushie Mirror 🪞\nSoft Plush | Clear Mirror | Pocket Size\nCute & Handy 💖",
    "includes": [],
    "colors": [
      {
        "hex": "#d16f6f",
        "name": "Brown",
        "image": "/images/scoop-chart-beauty-accessories.webp"
      },
      {
        "hex": "#e381c1",
        "name": "Blush Pink",
        "image": "/images/scoop-chart-beauty-accessories.webp"
      },
      {
        "hex": "#ffbde8",
        "name": "Baby pink",
        "image": "/images/scoop-chart-beauty-accessories.webp"
      },
      {
        "hex": "#b370ff",
        "name": "Lavender",
        "image": "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/korean-wallets.webp",
    "images": [
      "/images/korean-wallets.webp"
    ],
    "description": "Luxury Lipstick Pouch- Cute mini pouch with keychain & satin scarf. Lipstick, coin, earbuds sab rakh lo.",
    "includes": [],
    "colors": [
      {
        "hex": "#422c2c",
        "name": "Chocolate Brown",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#fff0f0",
        "name": "Beige",
        "image": "/images/korean-wallets.webp"
      },
      {
        "hex": "#000000",
        "name": "Black",
        "image": "/images/korean-wallets.webp"
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
    "image": "/images/pendants/bow-heart-pendant.webp",
    "images": [
      "/images/pendants/bow-heart-pendant.webp"
    ],
    "description": "Aesthetic Kawaii jewelry hand-selected for Scoop Storey.",
    "includes": [],
    "colors": [
      {
        "hex": "#b283d4",
        "name": "Lavender",
        "image": "/images/pendants/bow-heart-pendant.webp"
      },
      {
        "hex": "#e5abf5",
        "name": "Baby Pink",
        "image": "/images/pendants/bow-heart-pendant.webp"
      },
      {
        "hex": "#bde4ff",
        "name": "Sky Blue",
        "image": "/images/pendants/bow-heart-pendant.webp"
      },
      {
        "hex": "#eeffa1",
        "name": "Lemon",
        "image": "/images/pendants/bow-heart-pendant.webp"
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
    "image": "/images/scoop-chart-beauty-accessories.webp",
    "images": [
      "/images/scoop-chart-beauty-accessories.webp"
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
    "image": "/images/charm-bracelets.webp",
    "images": [
      "/images/charm-bracelets.webp"
    ],
    "description": " Doll Keychain 💖✨\nSuper soft fluffy pom-pom, cute doll face with glasses & tiny pom-pom feet! 🎀\nYour bag's new best friend!",
    "includes": [],
    "colors": [
      {
        "hex": "#ab0707",
        "name": "Red",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#e2ff63",
        "name": "Neon Green",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#cb9af5",
        "name": "Lavender",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#c94d89",
        "name": "Pink",
        "image": "/images/charm-bracelets.webp"
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
    "image": "/images/charm-bracelets.webp",
    "images": [
      "/images/charm-bracelets.webp"
    ],
    "description": "Hello Kitty Lucky Day Keychain 🎀✨\nCute Hello Kitty with pretty bow + Lucky Day strap! ✨\nYour bag, keys & mood - sab lucky!",
    "includes": [],
    "colors": [
      {
        "hex": "#af74c4",
        "name": " Lavender ",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#4196c4",
        "name": " Blue",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#ffabe9",
        "name": "Pink",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#b81818",
        "name": "Red",
        "image": "/images/charm-bracelets.webp"
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
    "image": "/images/charm-bracelets.webp",
    "images": [
      "/images/charm-bracelets.webp"
    ],
    "description": "Camera Keychain 📸✨\nCute mini camera design with tiny bell charm! 🔔\nYour bag's cutest click! DM to order 📩",
    "includes": [],
    "colors": [
      {
        "hex": "#ffea00",
        "name": "Capybara ",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#39005e",
        "name": "Nezha",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#e6cf3e",
        "name": "Sahur",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#8b48d4",
        "name": "Cinnamoroll",
        "image": "/images/charm-bracelets.webp"
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
    "image": "/images/charm-bracelets.webp",
    "images": [
      "/images/charm-bracelets.webp"
    ],
    "description": "Bubble Tea Keychain 🧋✨\nCute mini bubble cup with tiny boba balls inside + Bubble strap! 💖\nShake karo, shine karo - your bag's cutest sip!",
    "includes": [],
    "colors": [
      {
        "hex": "#77b9e6",
        "name": "Sky blue",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#b88df7",
        "name": "Lavender",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#e6dd40",
        "name": "Yellow",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#b32d2d",
        "name": "Red",
        "image": "/images/charm-bracelets.webp"
      },
      {
        "hex": "#4b9fd6",
        "name": "Balloon",
        "image": "/images/charm-bracelets.webp"
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
    "image": "/images/scoop-bowl.webp",
    "images": [
      "/images/scoop-bowl.webp",
      "/images/asmr-packing.webp",
      "/images/deluxe-giftbox.webp"
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
    "image": "/images/scoop-bowl.webp",
    "images": [
      "/images/scoop-bowl.webp",
      "/images/asmr-packing.webp",
      "/images/deluxe-giftbox.webp"
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
    "image": "/images/deluxe-giftbox.webp",
    "images": [
      "/images/deluxe-giftbox.webp",
      "/images/scoop-bowl.webp",
      "/images/asmr-packing.webp"
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
    coverImage: '/images/scoop-bowl.webp',
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
    coverImage: '/images/pendants.webp',
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
    coverImage: '/images/bracelets/butterfly-charm-bracelet.webp',
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
    coverImage: '/images/bracelets-anklets.webp',
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
    coverImage: '/images/scoop-chart-beauty-accessories.webp',
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
    coverImage: '/images/eyemasks-skincare.webp',
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
    coverImage: '/images/deluxe-giftbox.webp',
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
    coverImage: '/images/charm-bracelets.webp',
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
    coverImage: '/images/pendants/bow-heart-pendant.webp',
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
    coverImage: '/images/korean-wallets.webp',
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
    coverImage: '/images/scoop-chart-stationery-lifestyle.webp',
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
    coverImage: '/images/scoop-bowl.webp',
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
    coverImage: '/images/scoop-chart-beauty-accessories.webp',
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
