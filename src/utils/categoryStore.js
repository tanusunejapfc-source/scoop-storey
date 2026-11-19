const CATEGORIES_STORAGE_KEY = 'bhaskar_custom_categories_v2';
const CATEGORIES_DELETED_KEY = 'bhaskar_deleted_categories_v2';

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
    id: 'self-care',
    name: 'Self-Care',
    icon: '🌸',
    image: '/images/eyemasks-skincare.jpg',
    department: 'beauty',
    badge: 'Glow Routine ✨',
    description: 'Ultra-soft cloud velvet and silk sleeping masks, novelty soda-can wet wipes, deep-cleansing pore strips, and self-care essentials.',
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
  },
  {
    id: 'kawaii-stationery',
    name: 'Kawaii Stationery',
    icon: '📝',
    image: '/images/deluxe-giftbox.jpg',
    department: 'lifestyle',
    badge: 'Pastel Journaling ✨',
    description: 'Aesthetic floral diaries, magnetic bookmarks, kawaii sticky notes, and pastel journaling essentials.',
    isDefault: true
  },
  {
    id: 'bottles-mugs',
    name: 'Bottles & Mugs',
    icon: '🥛',
    image: '/images/deluxe-giftbox.jpg',
    department: 'lifestyle',
    badge: 'Cute Drinkware 🎀',
    description: 'Labubu sipper bottles, aesthetic pearl glass mugs, and cute bunny ear drinkware.',
    isDefault: true
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: '✨',
    image: '/images/charm-bracelets.jpg',
    department: 'lifestyle',
    badge: 'Everyday Cute ✨',
    description: 'Portable handheld mini fans, plushie compact mirrors, and aesthetic everyday accessories.',
    isDefault: true
  }
];

// Helper to slugify category names
export function slugifyCategory(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Get list of explicitly deleted category names so they are never restored
 */
export function getDeletedCategoryNames() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CATEGORIES_DELETED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * Record an explicit deletion tombstone
 */
export function recordCategoryDeletion(categoryName) {
  if (!categoryName || typeof window === 'undefined') return;
  try {
    const deleted = getDeletedCategoryNames();
    const clean = categoryName.trim();
    if (!deleted.some(d => d.toLowerCase() === clean.toLowerCase())) {
      deleted.push(clean);
      localStorage.setItem(CATEGORIES_DELETED_KEY, JSON.stringify(deleted));
    }
  } catch {}
}

/**
 * Remove an explicit deletion tombstone when a user recreates or restores a category
 */
export function removeCategoryFromDeleted(categoryName) {
  if (!categoryName || typeof window === 'undefined') return;
  try {
    const deleted = getDeletedCategoryNames();
    const clean = categoryName.trim().toLowerCase();
    const filtered = deleted.filter(d => d.toLowerCase() !== clean);
    localStorage.setItem(CATEGORIES_DELETED_KEY, JSON.stringify(filtered));
  } catch {}
}

// Retrieve stored categories or fallback to defaults
export function getStoredCategories() {
  if (typeof window === 'undefined') return DEFAULT_CATEGORY_METADATA;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const deletedNames = new Set(getDeletedCategoryNames().map(n => n.toLowerCase().trim()));

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out legacy combined categories, merged categories (e.g. Eye Masks into Self-Care), and any explicitly deleted categories
        let cleaned = parsed.filter(c => {
          if (!c || typeof c.name !== 'string' || !c.name.trim()) return false;
          const lower = c.name.toLowerCase().trim();
          if (lower === 'bracelets & anklets' || lower === 'eye masks & self-care') return false;
          if (lower === 'eye masks') return false; // Merged into Self-Care
          if (lower === 'bottles') return false;
          if (deletedNames.has(lower)) return false;
          return true;
        });
        
        // Migration: Merge "Korean Wallets", "Bags", and "Stationery and bags" into unified "Korean wallets and bags" (if not deleted)
        if (!deletedNames.has('korean wallets and bags')) {
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
          }
        }

        // Migration: Always remove legacy "Bottles" category
        cleaned = cleaned.filter(c => c && c.name && c.name.toLowerCase().trim() !== 'bottles');

        // Backfill any missing default categories (e.g. Kawaii Stationery, Bottles & Mugs, Accessories)
        const existingLowerNames = new Set(cleaned.map(c => c.name.toLowerCase().trim()));
        for (const def of DEFAULT_CATEGORY_METADATA) {
          const lower = def.name.toLowerCase().trim();
          if (!existingLowerNames.has(lower) && !deletedNames.has(lower)) {
            cleaned.push(def);
            existingLowerNames.add(lower);
          }
        }

        // Backfill image for any category that is missing an image
        const defMap = new Map(DEFAULT_CATEGORY_METADATA.map(d => [d.name.toLowerCase(), d]));
        const finalized = cleaned.map(c => {
          const def = c.name ? defMap.get(c.name.toLowerCase()) : null;
          return {
            ...c,
            image: c.image || def?.image || '/images/deluxe-giftbox.jpg'
          };
        });

        // Persist reconciled categories to localStorage
        try {
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(finalized));
        } catch {}

        return finalized;
      }
    }
  } catch (err) {
    console.error('Failed to parse categories from localStorage:', err);
  }

  // Initial first-time load: filter out any tombstoned categories
  const deletedNames = new Set(getDeletedCategoryNames().map(n => n.toLowerCase().trim()));
  return DEFAULT_CATEGORY_METADATA.filter(c => !deletedNames.has(c.name.toLowerCase().trim()));
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

/**
 * Permanently delete category: updates active storage and records tombstone
 */
export function deleteStoredCategory(categoryName) {
  if (!categoryName) return;
  recordCategoryDeletion(categoryName);
  const current = getStoredCategories();
  const updated = current.filter(c => c && c.name && c.name.toLowerCase().trim() !== categoryName.toLowerCase().trim());
  saveStoredCategories(updated);
  return updated;
}

// Reset categories to defaults (clears deletion tombstones)
export function resetStoredCategories() {
  try {
    localStorage.removeItem(CATEGORIES_DELETED_KEY);
  } catch {}
  saveStoredCategories(DEFAULT_CATEGORY_METADATA);
  return DEFAULT_CATEGORY_METADATA;
}
