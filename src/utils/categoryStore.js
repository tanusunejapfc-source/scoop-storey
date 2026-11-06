const CATEGORIES_STORAGE_KEY = 'bhaskar_custom_categories_v2';

// Initial default rich category metadata based on store collections
export const DEFAULT_CATEGORY_METADATA = [
  {
    id: 'mystery-scoops',
    name: 'Mystery Scoops',
    icon: '🍨',
    badge: 'Popular ASMR Hauls 🎀',
    description: 'Hand-curated 3D mystery scoop parcels packed with resin charms, pendants, and surprises.',
    isDefault: true
  },
  {
    id: 'pendants-chains',
    name: 'Pendants & Chains',
    icon: '✨',
    badge: 'Anti-Tarnish 💖',
    description: 'Dainty 18K gold and rose-gold plated necklaces, bow hearts, Monalisa gems, and pearls.',
    isDefault: true
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    icon: '🎀',
    badge: 'Handcrafted Dainty ✨',
    description: 'Adjustable charm link bracelets, protective evil eye amulets, and fairy-core pastel glass beads.',
    isDefault: true
  },
  {
    id: 'anklets',
    name: 'Anklets',
    icon: '💫',
    badge: 'Summer Shimmer ☀️',
    description: 'Sleek, fluid herringbone snake chains and dainty stationed beaded ankle chains.',
    isDefault: true
  },
  {
    id: 'eye-masks',
    name: 'Eye Masks',
    icon: '💤',
    badge: 'Sweet Dreams 🌙',
    description: 'Ultra-soft cloud velvet and skin-friendly satin sleeping masks with 100% light blockout.',
    isDefault: true
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    icon: '🌸',
    badge: 'Glow Routine ✨',
    description: 'Refreshing novelty soda-can wet wipes, deep-cleansing blackhead pore strips, and self-care essentials.',
    isDefault: true
  },
  {
    id: 'korean-wallets',
    name: 'Korean Wallets',
    icon: '👛',
    badge: 'Boutique Hot 🔥',
    description: 'Quilted pastel diamond pocket wallets with gold zip accents and mini plush bear charm pulls.',
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
        const cleaned = parsed.filter(c => c.name !== 'Bracelets & Anklets' && c.name !== 'Eye Masks & Self-Care');
        
        // Ensure new separated categories exist in the list
        const existingNames = new Set(cleaned.map(c => c.name));
        for (const def of DEFAULT_CATEGORY_METADATA) {
          if (!existingNames.has(def.name)) {
            cleaned.push(def);
          }
        }
        return cleaned;
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
