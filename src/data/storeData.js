// Official Product Catalog & Mystery Scoop Tiers for Bhaskar Scoop Storey
export const SCOOP_TIERS = [
  {
    id: 'mini-scoop',
    name: 'Scoop Storey - Mini',
    subtitle: 'Cute Starter Haul',
    scoops: 1,
    itemsCount: '15-20 Handpicked Charms',
    priceINR: 199,
    badge: 'Popular Starter 🎀',
    color: 'from-pink-400 to-rose-400',
    btnClass: 'btn-3d-pink'
  },
  {
    id: 'midi-scoop',
    name: 'Scoop Storey - Midi',
    subtitle: 'Fan Favorite Haul',
    scoops: 2,
    itemsCount: '30+ Charms & Resin Minis',
    priceINR: 349,
    badge: '★ Best Value ★',
    color: 'from-purple-400 to-indigo-500',
    btnClass: 'btn-3d-purple'
  },
  {
    id: 'big-scoop',
    name: 'Scoop Storey - Big',
    subtitle: 'Includes Keychain & Extras',
    scoops: 3,
    itemsCount: '50+ Charms + Keychain + Blind Surprise',
    priceINR: 499,
    badge: 'Collector Choice ✨',
    color: 'from-amber-400 to-orange-500',
    btnClass: 'btn-3d-gold'
  },
  {
    id: 'vault-mega-scoop',
    name: "Bhaskar's Vault Mega Scoop",
    subtitle: 'The Ultimate ASMR Haul',
    scoops: 5,
    itemsCount: '80+ Luxury Charms + Rare Gold Charm',
    priceINR: 899,
    badge: '👑 VIP Mega Scoop 👑',
    color: 'from-yellow-400 via-pink-400 to-purple-500',
    btnClass: 'btn-3d-gold'
  }
];

export const CHARM_LOOT_POOL = [
  { name: 'Kawaii Gummy Bear Charm', rarity: 'Common', icon: '🧸', color: '#FF94C2' },
  { name: 'Faceted Aurora Heart Gem', rarity: 'Rare', icon: '💖', color: '#FF4D8D' },
  { name: 'Shimmering Starlight Bead', rarity: 'Common', icon: '⭐', color: '#FFD166' },
  { name: 'Iridescent Sweetwater Pearl', rarity: 'Rare', icon: '🦪', color: '#E0AAFF' },
  { name: 'Mini Sanrio-Style Resin Donut', rarity: 'Rare', icon: '🍩', color: '#FFAAA6' },
  { name: 'Crystal Candy Flower Token', rarity: 'Common', icon: '🌸', color: '#A0E7E5' },
  { name: 'Glitter Heart Slider Charm', rarity: 'Rare', icon: '✨', color: '#C77DFF' },
  { name: 'Hand-Poured Holographic Bear', rarity: 'Epic', icon: '🌈', color: '#70D6FF' },
  { name: 'Pastel Butterfly Hair Pin', rarity: 'Epic', icon: '🦋', color: '#FF99C8' },
  { name: 'Bhaskar Gold Vault Bear Token', rarity: 'Legendary', icon: '👑', color: '#FFD700' },
  { name: 'Mystery Keychain Hardware Kit', rarity: 'Epic', icon: '🗝️', color: '#F3C98B' },
  { name: 'Collector Scented Wax Melt Charm', rarity: 'Rare', icon: '🕯️', color: '#D8B4F8' }
];

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

export const CATEGORIES = [
  'All Items',
  'Mystery Scoops',
  'Pendants & Chains',
  'Bracelets & Anklets',
  'Eye Masks & Self-Care',
  'Korean Wallets'
];

