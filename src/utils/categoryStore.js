import { fetchConfigFromCloud, syncConfigToCloud } from './apiClient';

const CATEGORIES_STORAGE_KEY = 'bhaskar_custom_categories_v3';
const CATEGORIES_DELETED_KEY = 'bhaskar_deleted_categories_v3';

// Initial default rich category metadata based on store collections
export const DEFAULT_CATEGORY_METADATA = [
  {
    id: 'mystery-scoops',
    name: 'Mystery Scoops',
    icon: '🍨',
    image: '/images/scoop-bowl.webp',
    department: 'scoops',
    badge: 'Popular ASMR Hauls 🎀',
    description: 'Hand-curated 3D mystery scoop parcels packed with resin charms, pendants, and surprises.',
    isDefault: true
  },
  {
    id: 'pendants-chains',
    name: 'Pendants & Chains',
    icon: '✨',
    image: '/images/pendants.webp',
    department: 'jewelry',
    badge: 'Anti-Tarnish 💖',
    description: 'Dainty 18K gold and rose-gold plated necklaces, bow hearts, Monalisa gems, and pearls.',
    isDefault: true
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    icon: '🎀',
    image: '/images/bracelets/butterfly-charm-bracelet.webp',
    department: 'jewelry',
    badge: 'Handcrafted Dainty ✨',
    description: 'Adjustable charm link bracelets, protective evil eye amulets, and fairy-core pastel glass beads.',
    isDefault: true
  },
  {
    id: 'anklets',
    name: 'Anklets',
    icon: '💫',
    image: '/images/bracelets-anklets.webp',
    department: 'jewelry',
    badge: 'Summer Shimmer ☀️',
    description: 'Sleek, fluid herringbone snake chains and dainty stationed beaded ankle chains.',
    isDefault: true
  },
  {
    id: 'makeup',
    name: 'Make up',
    icon: '💄',
    image: '/images/scoop-chart-beauty-accessories.webp',
    department: 'beauty',
    badge: 'Pastel Glow 💋',
    description: 'Fruit-tinted lip oils, bouncy jelly blush sticks, and radiant liquid glitter eyeshadows.',
    isDefault: true
  },
  {
    id: 'soft-toys',
    name: 'Soft Toys',
    icon: '🧸',
    image: '/images/deluxe-giftbox.webp',
    department: 'lifestyle',
    badge: 'Super Fluffy ☁️',
    description: 'Cloud-soft cuddle plushies, squishy boba milk teas, and cute sleeping kitten pillows.',
    isDefault: true
  },
  {
    id: 'keychains',
    name: 'Key chains',
    icon: '🗝️',
    image: '/images/charm-bracelets.webp',
    department: 'lifestyle',
    badge: 'Kawaii Charms ✨',
    description: 'Floating liquid glitter bears, Sanrio anime bell straps, and handcrafted beaded phone charms.',
    isDefault: true
  },
  {
    id: 'hair-accessories',
    name: 'Hair Accessories',
    icon: '🎀',
    image: '/images/pendants/bow-heart-pendant.webp',
    department: 'lifestyle',
    badge: 'Cute Styling 🌸',
    description: 'Matte pastel butterfly hair claws, velvet plush cloud scrunchies, and pearl barrette duos.',
    isDefault: true
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    icon: '🌸',
    image: '/images/eyemasks-skincare.webp',
    department: 'beauty',
    badge: 'Glow Routine ✨',
    description: 'Ultra-soft cloud velvet and silk sleeping masks, novelty soda-can wet wipes, deep-cleansing pore strips, and self-care essentials.',
    isDefault: true
  },
  {
    id: 'korean-wallets-and-bags',
    name: 'Korean wallets and bags',
    icon: '👛',
    image: '/images/korean-wallets.webp',
    department: 'lifestyle',
    badge: 'Boutique Hot 🔥',
    description: 'Quilted pastel diamond pocket wallets, aesthetic totes, mini bags, and kawaii accessories with gold zip accents and plush bear charm pulls.',
    isDefault: true
  },
  {
    id: 'kawaii-stationery',
    name: 'Kawaii Stationery',
    icon: '📝',
    image: '/images/scoop-chart-stationery-lifestyle.webp',
    department: 'lifestyle',
    badge: 'Pastel Journaling ✨',
    description: 'Aesthetic floral diaries, magnetic bookmarks, kawaii sticky notes, and pastel journaling essentials.',
    isDefault: true
  },
  {
    id: 'bottles-mugs',
    name: 'Bottles & Mugs',
    icon: '🥛',
    image: '/images/scoop-bowl.webp',
    department: 'lifestyle',
    badge: 'Cute Drinkware 🎀',
    description: 'Labubu sipper bottles, aesthetic pearl glass mugs, and cute bunny ear drinkware.',
    isDefault: true
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: '✨',
    image: '/images/scoop-chart-beauty-accessories.webp',
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

export async function syncDeletedCategoriesToCloud(deletedList) {
  await syncConfigToCloud('deleted_categories', deletedList);
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
      syncDeletedCategoriesToCloud(deleted);
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
    syncDeletedCategoriesToCloud(filtered);
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
      if (Array.isArray(parsed) && parsed.length > 0) {
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
        
        // Migration: Clean up legacy fragmented categories ("Korean Wallets", "Bags", "Stationery and bags")
        if (!deletedNames.has('korean wallets and bags')) {
          const isOldFragment = (name) => {
            if (!name) return false;
            const lower = name.toLowerCase().trim();
            return lower === 'korean wallets' || 
                   lower === 'bags' || 
                   lower === 'stationery and bags' || 
                   lower === 'stationery & bags';
          };

          const hasOldFragments = cleaned.some(c => isOldFragment(c.name));
          const existingWalletCat = cleaned.find(c => c && c.name && (c.name.toLowerCase().trim() === 'korean wallets and bags' || c.name.toLowerCase().trim() === 'korean wallets & bags'));

          if (hasOldFragments) {
            cleaned = cleaned.filter(c => !isOldFragment(c.name));
            if (!existingWalletCat) {
              cleaned.push({
                id: 'korean-wallets-and-bags',
                name: 'Korean wallets and bags',
                icon: '👛',
                image: '/images/korean-wallets.webp',
                department: 'lifestyle',
                badge: 'Boutique Hot 🔥',
                description: 'Quilted pastel diamond pocket wallets, aesthetic totes, mini bags, and kawaii accessories with gold zip accents and plush bear charm pulls.',
                isDefault: true
              });
            }
          }
        }

        // Migration: Always remove legacy "Bottles" category
        cleaned = cleaned.filter(c => c && c.name && c.name.toLowerCase().trim() !== 'bottles');

        const defMap = new Map(DEFAULT_CATEGORY_METADATA.map(d => [d.name.toLowerCase().trim(), d]));
        const finalized = cleaned.map(c => {
          const def = c.name ? defMap.get(c.name.toLowerCase().trim()) : null;
          const safeImg = c.image && !String(c.image).includes('supabase.co') ? c.image : (def?.image || '/images/deluxe-giftbox.webp');
          return {
            ...c,
            image: safeImg
          };
        });

        return finalized.length > 0 ? finalized : DEFAULT_CATEGORY_METADATA;
      }
    }
  } catch (err) {
    console.error('Failed to parse categories from localStorage:', err);
  }

  // Initial first-time load: filter out any tombstoned categories
  const deletedNames = new Set(getDeletedCategoryNames().map(n => n.toLowerCase().trim()));
  return DEFAULT_CATEGORY_METADATA.filter(c => !deletedNames.has(c.name.toLowerCase().trim()));
}

/**
 * Fetch categories from Railway PostgreSQL config store
 */
export async function fetchCategoriesFromCloud() {
  if (typeof window === 'undefined') return null;
  try {
    const cloudDeleted = await fetchConfigFromCloud('deleted_categories');
    if (Array.isArray(cloudDeleted) && cloudDeleted.length > 0) {
      const localDeleted = getDeletedCategoryNames();
      const combined = Array.from(new Set([...localDeleted, ...cloudDeleted]));
      localStorage.setItem(CATEGORIES_DELETED_KEY, JSON.stringify(combined));
    }

    const cloudCats = await fetchConfigFromCloud('categories');
    if (Array.isArray(cloudCats) && cloudCats.length > 0) {
      const deletedNames = new Set(getDeletedCategoryNames().map(n => n.toLowerCase().trim()));
      const defMap = new Map(DEFAULT_CATEGORY_METADATA.map(d => [d.name.toLowerCase().trim(), d]));
      const filtered = cloudCats
        .filter(c => c && c.name && !deletedNames.has(c.name.toLowerCase().trim()))
        .map(c => {
          const def = defMap.get(c.name.toLowerCase().trim());
          const safeImg = c.image && !String(c.image).includes('supabase.co') ? c.image : (def?.image || '/images/deluxe-giftbox.webp');
          return { ...c, image: safeImg };
        });
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));
      } catch {}
      window.dispatchEvent(new CustomEvent('scoop_categories_updated', { detail: filtered }));
      return filtered;
    }
  } catch {
    // Non-blocking fallback
  }
  return null;
}

// Save categories to localStorage, dispatch event, and sync to Railway PostgreSQL
export function saveStoredCategories(categories) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('scoop_categories_updated', { detail: categories }));
    syncConfigToCloud('categories', categories).catch((cloudErr) => {
      console.warn('Could not sync categories to cloud:', cloudErr);
    });
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
    syncDeletedCategoriesToCloud([]);
  } catch {}
  saveStoredCategories(DEFAULT_CATEGORY_METADATA);
  return DEFAULT_CATEGORY_METADATA;
}
