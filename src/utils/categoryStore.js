const CATEGORIES_STORAGE_KEY = 'bhaskar_custom_categories_v2';

// Initial default rich category metadata based on store collections
export const DEFAULT_CATEGORY_METADATA = [
  {
    id: 'mystery-scoops',
    name: 'Mystery Scoops',
    icon: '🍨',
    image: '/images/scoop-bowl.jpg',
    department: 'scoops',
    badge: 'Popular ASMR Hauls 🎀',
    description: 'Hand-curated 3D mystery scoop parcels packed with resin charms, pendants, and surprises.',
    isDefault: true
  },
  {
    id: 'pendants-chains',
    name: 'Pendants & Chains',
    icon: '✨',
    image: '/images/pendants.jpg',
    department: 'jewelry',
    badge: 'Anti-Tarnish 💖',
    description: 'Dainty 18K gold and rose-gold plated necklaces, bow hearts, Monalisa gems, and pearls.',
    isDefault: true
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    icon: '🎀',
    image: '/images/charm-bracelets.jpg',
    department: 'jewelry',
    badge: 'Handcrafted Dainty ✨',
    description: 'Adjustable charm link bracelets, protective evil eye amulets, and fairy-core pastel glass beads.',
    isDefault: true
  },
  {
    id: 'anklets',
    name: 'Anklets',
    icon: '💫',
    image: '/images/bracelets-anklets.jpg',
    department: 'jewelry',
    badge: 'Summer Shimmer ☀️',
    description: 'Sleek, fluid herringbone snake chains and dainty stationed beaded ankle chains.',
    isDefault: true
  },
  {
    id: 'makeup',
    name: 'Make up',
    icon: '💄',
    image: '/images/eyemasks-skincare.jpg',
    department: 'beauty',
    badge: 'Pastel Glow 💋',
    description: 'Fruit-tinted lip oils, bouncy jelly blush sticks, and radiant liquid glitter eyeshadows.',
    isDefault: true
  },
  {
    id: 'bottles',
    name: 'Bottles',
    icon: '🥤',
    image: '/images/deluxe-giftbox.jpg',
    department: 'lifestyle',
    badge: 'Viral Hydration 🌸',
    description: 'Kawaii frosted bear sippers with strap, gradient time-marked bottles, and mini thermal flasks.',
    isDefault: true
  },
  {
    id: 'soft-toys',
    name: 'Soft Toys',
    icon: '🧸',
    image: '/images/korean-wallets.jpg',
    department: 'lifestyle',
    badge: 'Super Fluffy ☁️',
    description: 'Cloud-soft cuddle plushies, squishy boba milk teas, and cute sleeping kitten pillows.',
    isDefault: true
  },
  {
    id: 'keychains',
    name: 'Key chains',
    icon: '🗝️',
    image: '/images/charm-bracelets.jpg',
    department: 'lifestyle',
    badge: 'Kawaii Charms ✨',
    description: 'Floating liquid glitter bears, Sanrio anime bell straps, and handcrafted beaded phone charms.',
    isDefault: true
  },
  {
    id: 'hair-accessories',
    name: 'Hair Accessories',
    icon: '🎀',
    image: '/images/bracelets-anklets.jpg',
    department: 'lifestyle',
    badge: 'Cute Styling 🌸',
    description: 'Matte pastel butterfly hair claws, velvet plush cloud scrunchies, and pearl barrette duos.',
    isDefault: true
  },
  {
    id: 'eye-masks',
    name: 'Eye Masks',
    icon: '💤',
    image: '/images/eyemasks-skincare.jpg',
    department: 'beauty',
    badge: 'Sweet Dreams 🌙',
    description: 'Ultra-soft cloud velvet and skin-friendly satin sleeping masks with 100% light blockout.',
    isDefault: true
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    icon: '🌸',
    image: '/images/asmr-packing.jpg',
    department: 'beauty',
    badge: 'Glow Routine ✨',
    description: 'Refreshing novelty soda-can wet wipes, deep-cleansing blackhead pore strips, and self-care essentials.',
    isDefault: true
  },
  {
    id: 'korean-wallets-and-bags',
    name: 'Korean wallets and bags',
    icon: '👛',
    image: '/images/korean-wallets.jpg',
    department: 'lifestyle',
    badge: 'Boutique Hot 🔥',
    description: 'Quilted pastel diamond pocket wallets, aesthetic totes, mini bags, and kawaii accessories with gold zip accents and plush bear charm pulls.',
    isDefault: true
  }
];

// Helper to slugify category names
export function slugifyCategory(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Retrieve stored categories or fallback to defaults
export function getStoredCategories() {
  if (typeof window === 'undefined') return DEFAULT_CATEGORY_METADATA;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Migration: If legacy combined categories exist in storage, remove them
        let cleaned = parsed.filter(c => c && typeof c.name === 'string' && c.name.trim() !== '' && c.name !== 'Bracelets & Anklets' && c.name !== 'Eye Masks & Self-Care');
        
        // Migration: Merge "Korean Wallets", "Bags", and "Stationery and bags" into unified "Korean wallets and bags"
        const isFragmentedWalletOrBag = (name) => {
          if (!name) return false;
          const lower = name.toLowerCase().trim();
          return lower === 'korean wallets' || 
                 lower === 'bags' || 
                 lower === 'stationery and bags' || 
                 lower === 'stationery & bags' || 
                 lower === 'korean wallets and bags' ||
                 lower === 'korean wallets & bags';
        };

        const hadFragmentedWalletOrBag = cleaned.some(c => isFragmentedWalletOrBag(c.name));
        if (hadFragmentedWalletOrBag) {
          cleaned = cleaned.filter(c => !isFragmentedWalletOrBag(c.name));
          cleaned.push({
            id: 'korean-wallets-and-bags',
            name: 'Korean wallets and bags',
            icon: '👛',
            image: '/images/korean-wallets.jpg',
            department: 'lifestyle',
            badge: 'Boutique Hot 🔥',
            description: 'Quilted pastel diamond pocket wallets, aesthetic totes, mini bags, and kawaii accessories with gold zip accents and plush bear charm pulls.',
            isDefault: true
          });
          try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cleaned));
          } catch {}
        }

        // Ensure new separated categories exist in the list
        const existingNames = new Set(cleaned.map(c => c.name));
        for (const def of DEFAULT_CATEGORY_METADATA) {
          if (!existingNames.has(def.name)) {
            cleaned.push(def);
          }
        }

        // Backfill image for any category that is missing an image
        const defMap = new Map(DEFAULT_CATEGORY_METADATA.map(d => [d.name.toLowerCase(), d]));
        return cleaned.map(c => {
          const def = c.name ? defMap.get(c.name.toLowerCase()) : null;
          return {
            ...c,
            image: c.image || def?.image || '/images/deluxe-giftbox.jpg'
          };
        });
      }
    }
  } catch (err) {
    console.error('Failed to parse categories from localStorage:', err);
  }
  return DEFAULT_CATEGORY_METADATA;
}

// Save categories to localStorage and dispatch event
export function saveStoredCategories(categories) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('scoop_categories_updated', { detail: categories }));
  } catch (err) {
    console.error('Failed to save categories to localStorage:', err);
  }
}

// Reset categories to defaults
export function resetStoredCategories() {
  saveStoredCategories(DEFAULT_CATEGORY_METADATA);
  return DEFAULT_CATEGORY_METADATA;
}
