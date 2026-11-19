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
    // --- MYSTERY SCOOPS ---
  {
    id: 'scoop-mini',
    name: 'Scoop Storey - Mini Scoop',
    category: 'Mystery Scoops',
    badge: 'Popular Starter 🎀',
    priceINR: 799,
    image: '/images/scoop-bowl.jpg',
    description: 'Handpicked cute surprises just for you! Filled with 7–8 aesthetic kawaii products drawn from our 54-item official scoop board (Beauty Essentials, Accessories, Stationery & Lifestyle), extra free gifts, and free delivery across India.',
    includes: [
      '7–8 Handpicked Surprise Products',
      'From 54 Official Scoop Board Items',
      'Extra Free Surprise Gifts Included',
      'Free Express Shipping Across India',
      'Cute Packaging & Free Stickers'
    ]
  },
  {
    id: 'scoop-midi',
    name: 'Scoop Storey - Midi Scoop',
    category: 'Mystery Scoops',
    badge: 'Best Value 🔥',
    priceINR: 1299,
    image: '/images/scoop-bowl.jpg',
    description: 'Our fan-favorite haul! 2 deep satisfying scoops packed with 12–15 premium kawaii products drawn from our 54-item official scoop board (Beauty Essentials, Accessories, Stationery & Lifestyle), extra free gifts, and free delivery across India.',
    includes: [
      '12–15 Handpicked Surprise Products',
      'From 54 Official Scoop Board Items',
      'Extra Free Surprise Gifts Included',
      'Free Express Shipping Across India',
      'ASMR Reel Filming Eligible'
    ]
  },
  {
    id: 'scoop-big',
    name: 'Scoop Storey - Big Scoop',
    category: 'Mystery Scoops',
    badge: 'Collector Choice ✨',
    priceINR: 1799,
    image: '/images/deluxe-giftbox.jpg',
    description: 'The ultimate luxury hamper! Includes everything from a Mini Scoop + Midi Scoop with over 20+ aesthetic items drawn from our 54-item official scoop board (Beauty Essentials, Accessories, Stationery & Lifestyle), plushies, even more extra free gifts, and free delivery across India.',
    includes: [
      'Over 20+ Premium Items',
      'From 54 Official Scoop Board Items',
      'Everything from Mini + Midi Scoop',
      'Even More Extra Free Gifts',
      'Free Express Shipping Across India',
      'VIP Hamper Packaging'
    ]
  },

  // --- PENDANTS & CHAINS ---
  {
    id: 'pend-bow-heart',
    name: 'Bow Heart Aesthetic Pendant',
    category: 'Pendants & Chains',
    badge: 'Trending on Insta 🎀',
    priceINR: 199,
    image: '/images/pendants/bow-heart-pendant.png',
    description: 'A dainty rose-gold bow tied atop a faceted crystal heart charm on a non-tarnish shimmer chain.',
    includes: ['Anti-Tarnish Plating', 'Lobster Clasp with Extender', 'Velvet Jewelry Pouch', 'Prepaid Shipping']
  },
  {
    id: 'pend-heart',
    name: 'Classic Heart Pendant',
    category: 'Pendants & Chains',
    badge: 'Best Seller 💖',
    priceINR: 199,
    image: '/images/pendants/heart-pendant.png',
    description: 'Classic high-polish romantic heart pendant on a delicate cable chain for everyday elegance.',
    includes: ['Mirror Finish Heart', 'Hypoallergenic Chain', 'Gift Display Card', 'Prepaid Shipping']
  },
  {
    id: 'pend-snake-chain',
    name: 'Snake Chain Minimalist Pendant',
    category: 'Pendants & Chains',
    badge: 'Daily Wear ✨',
    priceINR: 199,
    image: '/images/pendants/snake-chain-pendant.png',
    description: 'Sleek, fluid herringbone snake link chain featuring a polished micro-pendant for modern layering.',
    includes: ['Liquid Smooth Snake Links', '18k Gold PVD Coating', 'Water-Resistant Finish', 'Hypoallergenic']
  },
  {
    id: 'pend-little-heart',
    name: 'Little Heart Dainty Pendant',
    category: 'Pendants & Chains',
    badge: 'Cute Essential 💖',
    priceINR: 199,
    image: '/images/pendants/little-heart-pendant.png',
    description: 'A delicate polished puffed heart pendant that rests gracefully on your collarbone.',
    includes: ['Subtle Mirror Polish', 'Adjustable 16-18" Length', 'Lightweight & Comfortable', 'Gift Packaging']
  },
  {
    id: 'pend-rose-heart',
    name: 'Rose Heart Deluxe Pendant',
    category: 'Pendants & Chains',
    badge: 'Special Edition 🌹',
    priceINR: 240,
    image: '/images/pendants/rose-heart-pendant.png',
    description: 'Intricately carved floral rose bloom encased inside a sculpted romantic heart frame.',
    includes: ['Intricate Floral Relief', 'Premium Rose Gold Tone', 'Collector Backing Card']
  },
  {
    id: 'pend-pearl',
    name: 'Lustrous Pearl Drop Pendant',
    category: 'Pendants & Chains',
    badge: 'Timeless Beauty 🦪',
    priceINR: 240,
    image: '/images/pendants/pearl-pendant.jpg',
    description: 'Natural high-luster baroque pearl pendant suspended on a fine shimmer chain for a radiant touch.',
    includes: ['Natural Luster Pearl', 'Tarnish-Resistant Alloy', 'Gift Ready Display Box']
  },
  {
    id: 'pend-monalisa',
    name: 'Monalisa Lustrous Gem Pendant',
    category: 'Pendants & Chains',
    badge: 'Elegant Classic ✨',
    priceINR: 240,
    image: '/images/pendants/monalisa-pendant.png',
    description: 'Sculpted Monalisa faceted stone pendant accented with a sparkling pavé setting for timeless charm.',
    includes: ['Faceted Crystal Setting', 'Tarnish-Resistant Alloy', 'Gift Ready Display Card']
  },
  {
    id: 'pend-sun',
    name: 'Sunburst Celestial Pendant',
    category: 'Pendants & Chains',
    badge: 'Golden Glow ☀️',
    priceINR: 199,
    image: '/images/pendants/sun-pendant.png',
    description: 'Radiant embossed sun pendant with textured sun rays capturing ambient warmth and positivity.',
    includes: ['Embossed Sun Rays', 'Gold-Tone Finish', 'Layer-Friendly Chain']
  },

  // --- BRACELETS ---
  {
    id: 'brac-butterfly',
    name: 'Butterfly Charm Bracelet',
    category: 'Bracelets',
    badge: 'Insta Viral 🦋',
    priceINR: 199,
    image: '/images/bracelets/butterfly-charm-bracelet.png',
    description: 'Dainty links holding iridescent fluttering butterfly charms that catch rainbow pastel hues in daylight.',
    includes: ['Iridescent Acrylic Wings', 'Secure Lobster Lock', 'Adjustable Wrist Fit']
  },
  {
    id: 'brac-flower',
    name: 'Daisy Flower Charm Bracelet',
    category: 'Bracelets',
    badge: 'Fresh & Cute 🌸',
    priceINR: 199,
    image: '/images/bracelets-anklets.jpg',
    description: 'Enamel-filled pastel daisy flowers strung along a sparkling gold chain for spring vibes.',
    includes: ['Pastel Enamel Inlay', 'Golden Link Chain', 'Tarnish-Protected']
  },
  {
    id: 'brac-leaf',
    name: 'Botanical Leaf Vine Bracelet',
    category: 'Bracelets',
    badge: 'Subtle Chic 🍃',
    priceINR: 199,
    image: '/images/bracelets-anklets.jpg',
    description: 'Finely textured leaf vine accents that wrap delicately around the wrist with graceful movement.',
    includes: ['Sculpted Vine Details', 'Polished Finish', 'Universal Size']
  },
  {
    id: 'brac-evileye',
    name: 'Evil Eye Protection Bracelet',
    category: 'Bracelets',
    badge: 'Good Luck 🧿',
    priceINR: 170,
    image: '/images/bracelets-anklets.jpg',
    description: 'Traditional sapphire-blue and white evil eye talisman bead set on a radiant gold chain.',
    includes: ['Protective Evil Eye Bead', 'Durable Links', 'Positive Vibe Packaging']
  },

  // --- ANKLETS ---
  {
    id: 'anklet-snake',
    name: 'Snake Chain Sleek Anklet',
    category: 'Anklets',
    badge: 'Must-Have ✨',
    priceINR: 150,
    image: '/images/bracelets-anklets.jpg',
    description: 'The trendiest liquid gold snake chain anklet. Lies flat, won’t snag, and looks gorgeous with sneakers or heels.',
    includes: ['Silky Smooth Links', 'Non-Snag Design', 'Extender Chain Included']
  },
  {
    id: 'anklet-minimal',
    name: 'Classic Minimalist Bead Anklet',
    category: 'Anklets',
    badge: 'Subtle Dainty',
    priceINR: 120,
    image: '/images/bracelets-anklets.jpg',
    description: 'Ultra-dainty ankle chain with miniature stationed polished beads for that barely-there shimmer.',
    includes: ['Stationed Bead Accents', 'Ultra-Lightweight', 'Everyday Summer Ready']
  },

  // --- EYE MASKS ---
  {
    id: 'mask-kitty',
    name: 'Hello Kitty Kawaii Eye Mask',
    category: 'Self-Care',
    badge: 'Super Soft 🐱',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Plush velvet sleeping eye mask with adorable cat face embroidery. Blocks 100% light for restful naps.',
    includes: ['Ultra-Soft Cloud Velvet', 'Gentle Elastic Strap', 'Total Light Blockout']
  },
  {
    id: 'mask-miao',
    name: 'Miao Kitten Sleeping Mask',
    category: 'Self-Care',
    badge: 'Cute ASMR 🐾',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Cute pastel cartoon kitten eye mask with cooling comfort. A favorite in our unboxing parcels.',
    includes: ['Breathable Fabric', 'Snug Elastic Comfort', 'Individually Sealed']
  },
  {
    id: 'mask-heart',
    name: 'Heart & Floral Silk Eye Mask',
    category: 'Self-Care',
    badge: 'Relaxing 💖',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Silky smooth eye mask patterned with sweet pastel hearts and floral motifs for sensory sleep comfort.',
    includes: ['Skin-Friendly Satin Lining', 'Padded Light Protection', 'Travel-Friendly']
  },

  // --- SELF-CARE ---
  {
    id: 'skincare-can-wipes',
    name: 'Cute Soda Can Wet Wipes (30 Wipes)',
    category: 'Self-Care',
    badge: 'Viral Novelty 🥤',
    priceINR: 99,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Novelty miniature soda can that opens from the pop-tab to dispense refreshing, lightly scented wet wipes.',
    includes: ['Novelty Soda Can Dispenser', '30 Refreshing Wipes', 'Backpack Clip Keychain']
  },
  {
    id: 'skincare-nose-strips',
    name: 'Deep Cleansing Nose Pore Strips Pack',
    category: 'Self-Care',
    badge: 'Skincare Win 🌸',
    priceINR: 119,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Pore clearing nose strips that instantly pull out blackheads and leave your nose silky smooth.',
    includes: ['Pore Purifying Formula', 'Quick 10-Minute Action', 'Dermatologist Tested']
  },

  // --- KOREAN WALLETS AND BAGS ---
  {
    id: 'wallet-pink',
    name: 'Soft Korean Aesthetic Wallet (Blush Pink)',
    category: 'Korean wallets and bags',
    badge: 'Boutique Hot 🔥',
    priceINR: 250,
    image: '/images/korean-wallets.jpg',
    description: 'Quilted diamond-stitched soft leatherette pocket wallet with gold zip accents and a mini teddy bear charm pull.',
    includes: ['Multiple Card Slots', 'Zippered Coin Pocket', 'Attached Mini Plush Bear Charm', 'Compact Pocket Size']
  },
  {
    id: 'wallet-white',
    name: 'Soft Korean Minimalist Wallet (Ivory White)',
    category: 'Korean wallets and bags',
    badge: 'Clean Aesthetic 🤍',
    priceINR: 250,
    image: '/images/korean-wallets.jpg',
    description: 'Chic creamy ivory quilted pocket wallet with durable gold hardware and a cute teddy charm. Fits in any mini bag.',
    includes: ['Smooth Zipper Slider', 'Cash & Card Compartments', 'Aesthetic Pastel Finish']
  },

  // --- MAKE UP ---
  {
    id: 'prod-lip-gloss',
    name: 'Kawaii Fruit Tinted Lip Gloss Oil',
    category: 'Make up',
    badge: 'Viral Glow 💋',
    priceINR: 149,
    image: '/images/eyemasks-skincare.jpg',
    description: 'High-shine, non-sticky hydrating lip oil infused with sweet fruit essence and subtle plumping gloss for juicy lips.',
    includes: ['Non-Sticky Mirror Glaze', 'Fruit Extract Hydration', 'Compact Roller Wand', 'Prepaid Shipping']
  },
  {
    id: 'prod-jelly-blush',
    name: 'Pastel Jelly Blush & Lip Tint Stick',
    category: 'Make up',
    badge: 'Dewy Finish 🌸',
    priceINR: 199,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Bouncy cooling jelly tint stick that blends effortlessly on cheeks and lips for a fresh watercolor flush.',
    includes: ['Buildable Watercolor Flush', 'Cooling Jelly Texture', 'Long-Lasting Stain', 'Travel Friendly']
  },
  {
    id: 'prod-glitter-shadow',
    name: 'Shimmer Glitter Liquid Eyeshadow Wand',
    category: 'Make up',
    badge: 'Aurora Shimmer ✨',
    priceINR: 179,
    image: '/images/eyemasks-skincare.jpg',
    description: 'Ultra-reflective liquid shimmer eyeshadow packed with micro-fine iridescent sparkles that glide on smoothly without creasing.',
    includes: ['Zero-Fallout Glaze', 'Quick-Dry Waterproof Wear', 'Precision Doe-Foot Wand', 'Hypoallergenic Safe']
  },

  // --- SOFT TOYS ---
  {
    id: 'prod-boba-plush',
    name: 'Cloud-Soft Cuddle Boba Milk Tea Plushie',
    category: 'Soft Toys',
    badge: 'Super Fluffy 🧋',
    priceINR: 299,
    image: '/images/korean-wallets.jpg',
    description: 'Squishy boba milk tea plush with embroidered smiling face, mini plush pearls, and a straw topper for infinite cozy cuddles.',
    includes: ['Ultra-Squishy Down Cotton', 'Embroidered Facial Details', 'Anti-Deformation Fill', 'Safe for All Ages']
  },
  {
    id: 'prod-bunny-plush',
    name: 'Long-Eared Kawaii Bunny Snuggle Plushie',
    category: 'Soft Toys',
    badge: 'Sweet Snuggle 🐰',
    priceINR: 349,
    image: '/images/korean-wallets.jpg',
    description: 'Extra silky bunny soft toy with floppy ears, pastel cheeks, and soft velvet fur. A customer favorite unboxing surprise.',
    includes: ['Silky Minky Velvet Fur', 'Floppy Comfort Ears', 'Machine Washable Gentle', 'Gift Ready Packaging']
  },
  {
    id: 'prod-kitten-pillow',
    name: 'Sleeping Kitten Plush Pillow & Hand Warmer',
    category: 'Soft Toys',
    badge: 'Cozy Cloud 🐱',
    priceINR: 399,
    image: '/images/korean-wallets.jpg',
    description: 'Elongated sleeping kitty plush cushion with side hand pockets to keep hands warm while relaxing or watching ASMR reels.',
    includes: ['Dual Hand Warmer Pockets', 'Ergonomic Nap Contour', 'Plush Cloud Velvet Exterior', 'Stress-Relief Squeeze']
  },

  // --- KEY CHAINS ---
  {
    id: 'prod-floating-bear-key',
    name: 'Floating Liquid Glitter Kawaii Bear Keychain',
    category: 'Key chains',
    badge: 'Floating Glitter ✨',
    priceINR: 149,
    image: '/images/charm-bracelets.jpg',
    description: 'Enchanting liquid-filled acrylic bear charm with floating sparkles, matching silicone wrist strap, and gold lobster clasp.',
    includes: ['Leak-Proof Oil Suspension', 'Silicone Wrist Strap', 'Gold-Plated Key Ring & Snap', 'Bag & Backpack Charm']
  },
  {
    id: 'prod-sanrio-bell-key',
    name: 'Sanrio-Style Anime Bell & Strap Keychain',
    category: 'Key chains',
    badge: 'Sweet Jingle 🎀',
    priceINR: 129,
    image: '/images/charm-bracelets.jpg',
    description: 'Pastel anime character figure keychain accented with a crisp jingle bell and woven lanyard strap for bags and keys.',
    includes: ['Crisp Pleasant Mini Bell', 'Heavy-Duty Key Ring', 'Scratch-Proof Matte Resin', 'Cute Daily Companion']
  },
  {
    id: 'prod-wristlet-charm',
    name: 'Aesthetic Pastel Beaded Wristlet Phone Charm',
    category: 'Key chains',
    badge: 'Y2K Aesthetic 🌸',
    priceINR: 139,
    image: '/images/charm-bracelets.jpg',
    description: 'Handcrafted phone and bag wristlet stringed with iridescent hearts, acrylic pearls, and pastel flower beads.',
    includes: ['Heavy-Duty Braided Cord', 'Iridescent Pearl Beads', 'Universal Phone Case Loop', 'Anti-Drop Wrist Strap']
  },

  // --- HAIR ACCESSORIES ---
  {
    id: 'prod-butterfly-claw',
    name: 'Matte Butterfly Hair Claw Clip (Duo Set)',
    category: 'Hair Accessories',
    badge: 'Non-Slip Hold 🦋',
    priceINR: 149,
    image: '/images/bracelets-anklets.jpg',
    description: 'Pair of durable pastel matte butterfly hair claws with reinforced spring tension for effortless half-up or bun hairstyles.',
    includes: ['Set of 2 Claws', 'Non-Slip Soft-Touch Teeth', 'Rust-Proof Metal Spring', 'Gentle On Scalp']
  },
  {
    id: 'prod-cloud-scrunchie',
    name: 'Fluffy Cloud Plush Scrunchie Duo Pack',
    category: 'Hair Accessories',
    badge: 'Velvet Cloud ☁️',
    priceINR: 99,
    image: '/images/bracelets-anklets.jpg',
    description: 'Oversized ultra-soft plush velvet scrunchies that hold your hair firmly without kinks, breakage, or hair pulling.',
    includes: ['Pack of 2 Soft Scrunchies', 'Zero-Damage Gentle Hold', 'High-Elasticity Core', 'Wearable as Wrist Bracelet']
  },
  {
    id: 'prod-pearl-pins',
    name: 'Korean Crystal Pearl Decorative Bobby Pin Duo',
    category: 'Hair Accessories',
    badge: 'Pearl Glam 🦪',
    priceINR: 129,
    image: '/images/bracelets-anklets.jpg',
    description: 'Hand-wired lustrous pearl and sparkling crystal barrette pins designed to instantly elevate side-parted and braided hair.',
    includes: ['Duo Set of 2 Pins', 'Hand-Strung Luster Pearls', 'Strong Grip No-Snag Clips', 'Velvet Display Backing']
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
    coverImage: '/images/charm-bracelets.jpg',
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
    coverImage: '/images/bracelets-anklets.jpg',
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
    coverImage: '/images/eyemasks-skincare.jpg',
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
    coverImage: '/images/eyemasks-skincare.jpg',
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
    coverImage: '/images/korean-wallets.jpg',
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
    coverImage: '/images/charm-bracelets.jpg',
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
    coverImage: '/images/bracelets-anklets.jpg',
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
    coverImage: '/images/korean-wallets.jpg',
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
    coverImage: '/images/deluxe-giftbox.jpg',
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
    coverImage: '/images/deluxe-giftbox.jpg',
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
    coverImage: '/images/charm-bracelets.jpg',
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
