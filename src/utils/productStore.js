import { useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/storeData';
import { 
  fetchProductsFromSupabase, 
  saveProductToSupabase, 
  deleteProductFromSupabase 
} from './supabaseClient';

// Enrich default products with multiple images, color variants, specifications, and stock
export const DEFAULT_PRODUCTS = INITIAL_PRODUCTS.map(p => {
  // Category-specific color presets
  let defaultColors = [];
  if (p.category === 'Pendants & Chains') {
    defaultColors = [
      { name: '18K Yellow Gold', hex: '#E5C158' },
      { name: 'Rose Gold', hex: '#E0A899' },
      { name: 'Silver Shimmer', hex: '#D8D8D8' }
    ];
  } else if (p.category === 'Bracelets') {
    defaultColors = [
      { name: 'Pastel Rainbow', hex: '#FFB6C1' },
      { name: 'Gold Tone', hex: '#E5C158' },
      { name: 'Rose Gold', hex: '#E0A899' }
    ];
  } else if (p.category === 'Anklets') {
    defaultColors = [
      { name: '18K Yellow Gold', hex: '#E5C158' },
      { name: 'Rose Gold', hex: '#E0A899' },
      { name: 'Silver Shimmer', hex: '#D8D8D8' }
    ];
  } else if (p.category === 'Eye Masks') {
    defaultColors = [
      { name: 'Kawaii Pink', hex: '#FFB6C1' },
      { name: 'Cloud White', hex: '#F5F5F7' },
      { name: 'Lavender Mist', hex: '#E6E6FA' }
    ];
  } else if (p.category === 'Self-Care') {
    defaultColors = [
      { name: 'Fresh Mint', hex: '#A0E7E5' },
      { name: 'Berry Punch', hex: '#FF99C8' },
      { name: 'Citrus Pop', hex: '#FFD166' }
    ];
  } else if (p.category === 'Korean Wallets') {
    defaultColors = [
      { name: 'Blush Pink', hex: '#FFB6C1' },
      { name: 'Ivory White', hex: '#FFFDD0' },
      { name: 'Matcha Mint', hex: '#C1E1C1' },
      { name: 'Soft Lilac', hex: '#D8BFD8' }
    ];
  } else if (p.category === 'Make up') {
    defaultColors = [
      { name: 'Blush Cherry', hex: '#FF6B8B' },
      { name: 'Peach Glaze', hex: '#FFB085' },
      { name: 'Honey Dew', hex: '#FFEAA7' },
      { name: 'Berry Plum', hex: '#D68099' }
    ];
  } else if (p.category === 'Bottles') {
    defaultColors = [
      { name: 'Pastel Pink', hex: '#FFB6C1' },
      { name: 'Mint Green', hex: '#A8E6CF' },
      { name: 'Lilac Purple', hex: '#DED2F9' },
      { name: 'Sunset Ombre', hex: '#FFD3B6' }
    ];
  } else if (p.category === 'Soft Toys') {
    defaultColors = [
      { name: 'Classic Boba', hex: '#D4A373' },
      { name: 'Marshmallow White', hex: '#FDFBF7' },
      { name: 'Pastel Bunny Pink', hex: '#FFCAD4' },
      { name: 'Calico Peach', hex: '#FFD1BA' }
    ];
  } else if (p.category === 'Key chains') {
    defaultColors = [
      { name: 'Floating Sparkle Pink', hex: '#FF94C2' },
      { name: 'Sky Blue Aurora', hex: '#A0E7E5' },
      { name: 'Lilac Moon', hex: '#D8B4F8' },
      { name: 'Gold Bear Charm', hex: '#FFD700' }
    ];
  } else if (p.category === 'Hair Accessories') {
    defaultColors = [
      { name: 'Matte Rose', hex: '#FFAAA6' },
      { name: 'Cream Ivory', hex: '#FFF5EB' },
      { name: 'Matcha Green', hex: '#C1E1C1' },
      { name: 'Pastel Lilac', hex: '#E6E6FA' }
    ];
  } else {
    // Mystery Scoops
    defaultColors = [
      { name: 'Pastel Kawaii Mix', hex: '#FFAAA6' },
      { name: 'Sparkle Aurora Mix', hex: '#A0E7E5' },
      { name: 'Golden Vault Edition', hex: '#FFD700' }
    ];
  }

  // Category-specific multi-image gallery
  let defaultImages = [p.image];
  if (p.category === 'Pendants & Chains') {
    defaultImages = [
      p.image,
      '/images/pendants.jpg',
      '/images/asmr-packing.jpg',
      '/images/deluxe-giftbox.jpg'
    ];
  } else if (p.category === 'Bracelets') {
    defaultImages = [
      p.image,
      '/images/charm-bracelets.jpg',
      '/images/asmr-packing.jpg',
      '/images/deluxe-giftbox.jpg'
    ];
  } else if (p.category === 'Anklets') {
    defaultImages = [
      p.image,
      '/images/bracelets-anklets.jpg',
      '/images/asmr-packing.jpg'
    ];
  } else if (p.category === 'Eye Masks') {
    defaultImages = [
      p.image,
      '/images/eyemasks-skincare.jpg',
      '/images/asmr-packing.jpg'
    ];
  } else if (p.category === 'Self-Care') {
    defaultImages = [
      p.image,
      '/images/eyemasks-skincare.jpg',
      '/images/deluxe-giftbox.jpg'
    ];
  } else if (p.category === 'Korean Wallets') {
    defaultImages = [
      p.image,
      '/images/korean-wallets.jpg',
      '/images/deluxe-giftbox.jpg',
      '/images/asmr-packing.jpg'
    ];
  } else if (p.category === 'Make up') {
    defaultImages = [
      p.image,
      '/images/eyemasks-skincare.jpg',
      '/images/asmr-packing.jpg',
      '/images/deluxe-giftbox.jpg'
    ];
  } else if (p.category === 'Bottles') {
    defaultImages = [
      p.image,
      '/images/deluxe-giftbox.jpg',
      '/images/scoop-bowl.jpg',
      '/images/asmr-packing.jpg'
    ];
  } else if (p.category === 'Soft Toys') {
    defaultImages = [
      p.image,
      '/images/korean-wallets.jpg',
      '/images/deluxe-giftbox.jpg',
      '/images/scoop-bowl.jpg'
    ];
  } else if (p.category === 'Key chains') {
    defaultImages = [
      p.image,
      '/images/charm-bracelets.jpg',
      '/images/pendants.jpg',
      '/images/scoop-bowl.jpg'
    ];
  } else if (p.category === 'Hair Accessories') {
    defaultImages = [
      p.image,
      '/images/bracelets-anklets.jpg',
      '/images/charm-bracelets.jpg',
      '/images/eyemasks-skincare.jpg'
    ];
  } else {
    defaultImages = [
      p.image,
      '/images/deluxe-giftbox.jpg',
      '/images/asmr-packing.jpg'
    ];
  }

  // Category-specific specifications
  let defaultSpecs = {};
  if (p.category === 'Pendants & Chains') {
    defaultSpecs = {
      'Material': 'High-Grade Anti-Tarnish Alloy & 316L Stainless Steel',
      'Plating': '18K Gold / Rose Gold Vacuum PVD Coated',
      'Chain Length': '16 inches + 2 inch adjustable extender',
      'Clasp Type': 'Reinforced Lobster Clasp',
      'Water Resistance': 'Water-safe & Sweat-resistant',
      'Skin Friendly': '100% Nickel-Free & Hypoallergenic',
      'Packaging': 'Velvet Display Gift Card & Pouch'
    };
  } else if (p.category === 'Bracelets') {
    defaultSpecs = {
      'Material': 'Tarnish-Resistant Alloy & Acrylic Charms',
      'Length': '6.5 inches + 2 inch adjustable extender',
      'Finish': 'Polished Mirror Luster',
      'Closure': 'Secure Claw Lock',
      'Packaging': 'Organza Gift Bag with Wax-Sealed Tag'
    };
  } else if (p.category === 'Anklets') {
    defaultSpecs = {
      'Material': '18K Gold Plated Stainless Steel / Brass',
      'Style': 'Herringbone Snake Chain & Stationed Beads',
      'Length': '8.5 inches + 2 inch extender',
      'Water Resistance': 'Safe for splashes & everyday wear',
      'Skin Friendly': 'Hypoallergenic & Lead-Free'
    };
  } else if (p.category === 'Make up') {
    defaultSpecs = {
      'Formula': 'Hydrating Non-Sticky Aesthetic Pastel Glaze',
      'Finish': 'High-Shine Dewy / Iridescent Shimmer',
      'Skin Friendly': 'Dermatologist Tested, Cruelty-Free & Paraben-Free',
      'Net Volume': '4.5 ml - 8 ml Portable Wand / Stick',
      'Packaging': 'Aesthetic Kawaii Acrylic Tube with Box'
    };
  } else if (p.category === 'Bottles') {
    defaultSpecs = {
      'Material': 'Food-Grade BPA-Free Tritan & 304 Stainless Steel',
      'Features': 'Leak-Proof Lock Cap with Straw & Adjustable Strap',
      'Capacity': '350ml - 800ml Ergonomic Everyday Volume',
      'Thermal Retain': 'Keeps beverages fresh and temperature controlled',
      'Cleaning': 'Easy Disassemble Wide Mouth Opening'
    };
  } else if (p.category === 'Soft Toys') {
    defaultSpecs = {
      'Material': 'Ultra-Soft Cloud Velvet Minky & Down Cotton',
      'Stitching': 'Reinforced Seams with Safe Embroidered Facial Features',
      'Washable': 'Gentle Hand / Machine Washable in Cold Water',
      'Safety': '100% Child & Pet Safe, Non-Toxic Fill',
      'Packaging': 'Sealed Dust-Proof Bag with Kawaii Ribbon'
    };
  } else if (p.category === 'Key chains') {
    defaultSpecs = {
      'Material': 'Durable High-Grade Resin, Liquid Suspension & Alloy',
      'Hardware': 'Reinforced Gold-Tone Ring + Quick-Snap Swivel Clasp',
      'Feature': 'Floating Glitter Charms & Silicone Anti-Loss Strap',
      'Attachment': 'Perfect for Keys, Mini Bags, Backpacks & Phones'
    };
  } else if (p.category === 'Hair Accessories') {
    defaultSpecs = {
      'Material': 'Soft-Touch Matte Acrylic, Velvet Plush & Luster Pearls',
      'Spring': 'Rust-Proof High-Tension Steel Spring (No-Slip Grip)',
      'Hair Health': 'Anti-Breakage, Zero-Snag & Scalp-Gentle Teeth',
      'Packaging': 'Set Display Card with Protected Packaging'
    };
  } else if (p.category === 'Eye Masks') {
    defaultSpecs = {
      'Material': 'Ultra-Soft Cloud Velvet & Mulberry Satin Silk',
      'Band': 'Gentle Stretch Elastic (No-Hair Pull)',
      'Light Blocking': '100% Total Blackout Design',
      'Care': 'Gentle Hand Wash in Cold Water'
    };
  } else if (p.category === 'Self-Care') {
    defaultSpecs = {
      'Purpose': 'Sensory Refresh & Skincare Cleansing',
      'Packaging': 'Novelty Collectible Dispenser Pack',
      'Skin Friendly': 'Dermatologist-Approved & Alcohol-Free Formula',
      'Origin': 'Handpicked Kawaii Curation'
    };
  } else if (p.category === 'Korean Wallets') {
    defaultSpecs = {
      'Material': 'Soft Quilted Diamond-Stitch Vegan Leather',
      'Dimensions': '11 cm x 9 cm x 2.5 cm (Fits in Mini Bags)',
      'Compartments': '4 Card Slots, 1 Bill Pocket, 1 Zip Coin Section',
      'Hardware': 'Gold-Tone Smooth Zipper + Plush Bear Charm'
    };
  } else {
    defaultSpecs = {
      'Scoop Size': p.includes?.[0] || 'Handpicked Cute Surprises',
      'Extra Free Gifts': 'Included with every scoop',
      'Free Shipping': 'Free Delivery Across India (Prepaid)',
      'Packaging': 'Deluxe Kawaii Gift Packaging & Stickers',
      'ASMR Reel': 'Eligible for packing video request on Instagram'
    };
  }

  return {
    ...p,
    images: p.images || defaultImages,
    colors: p.colors || defaultColors,
    specifications: p.specifications || defaultSpecs,
    rating: p.rating || 4.9,
    reviewsCount: p.reviewsCount || Math.floor(60 + Math.random() * 80),
    inStock: p.inStock !== false
  };
});

const STORAGE_KEY = 'bhaskar_store_products_v4';

// Native IndexedDB for robust large image persistence (no 5MB localStorage quota limit!)
const IDB_NAME = 'ScoopStoreyDB_v2';
const IDB_VERSION = 1;
const IDB_STORE = 'store_catalog';

function openCatalogDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => {
        console.warn('IndexedDB open error:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB open exception:', err);
      resolve(null);
    }
  });
}

export async function getIDBProducts() {
  try {
    const db = await openCatalogDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get('products');
      req.onsuccess = () => {
        const val = req.result;
        if (Array.isArray(val) && val.length > 0) {
          resolve(val.filter(p => p.id !== 'scoop-vault' && p.id !== 'vault-mega-scoop'));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return null;
  }
}

export async function saveIDBProducts(products) {
  try {
    const db = await openCatalogDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(products, 'products');
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => {
        console.warn('IndexedDB write error:', e);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('IndexedDB save exception:', err);
    return false;
  }
}

export async function clearIDBProducts() {
  try {
    const db = await openCatalogDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete('products');
  } catch (err) {
    console.warn('IndexedDB clear error:', err);
  }
}

// Helper to automatically migrate any legacy combined categories
export function migrateLegacyProduct(p) {
  if (!p) return p;
  let category = p.category;
  if (category === 'Bracelets & Anklets') {
    category = (p.id?.startsWith('anklet') || p.name?.toLowerCase().includes('anklet')) ? 'Anklets' : 'Bracelets';
  } else if (category === 'Eye Masks & Self-Care') {
    category = (p.id?.startsWith('skincare') || p.name?.toLowerCase().includes('wipes') || p.name?.toLowerCase().includes('strip') || p.name?.toLowerCase().includes('care'))
      ? 'Self-Care'
      : 'Eye Masks';
  }
  return { ...p, category };
}

export function mergeWithDefaults(list) {
  if (!Array.isArray(list) || list.length === 0) return DEFAULT_PRODUCTS;
  const migrated = list
    .filter(p => p.id !== 'scoop-vault' && p.id !== 'vault-mega-scoop')
    .map(migrateLegacyProduct);
  const existingIds = new Set(migrated.map(p => p.id));
  const missingDefaults = DEFAULT_PRODUCTS.filter(dp => !existingIds.has(dp.id));
  if (missingDefaults.length > 0) {
    return [...migrated, ...missingDefaults];
  }
  return migrated;
}

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return mergeWithDefaults(parsed);
      }
    }
  } catch (err) {
    console.error('Failed to read products from localStorage:', err);
  }
  return DEFAULT_PRODUCTS;
}

export function saveStoredProducts(products) {
  // 1. Permanently store in IndexedDB (handles large uploaded images without hitting quotas)
  saveIDBProducts(products);

  // 2. Also sync to localStorage for instantaneous initial load
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn('localStorage quota exceeded (large image uploads). Data is safely persisted in IndexedDB.', err);
  }

  // 3. Broadcast update to active views
  window.dispatchEvent(new CustomEvent('scoop_products_updated', { detail: products }));
}

export function resetStoredProducts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    clearIDBProducts();
    window.dispatchEvent(new CustomEvent('scoop_products_updated', { detail: DEFAULT_PRODUCTS }));
  } catch (err) {
    console.error('Failed to reset products:', err);
  }
  return DEFAULT_PRODUCTS;
}

export function useStoreProducts() {
  const [products, setProducts] = useState(getStoredProducts);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live products from Supabase Cloud Database first
    fetchProductsFromSupabase().then((cloudList) => {
      if (isMounted && Array.isArray(cloudList) && cloudList.length > 0) {
        const merged = mergeWithDefaults(cloudList);
        setProducts(merged);
        saveStoredProducts(merged);
      }
    });

    // 2. Load from IndexedDB on refresh to restore cached images
    getIDBProducts().then((idbList) => {
      if (isMounted && idbList && Array.isArray(idbList) && idbList.length > 0) {
        const merged = mergeWithDefaults(idbList);
        setProducts((curr) => (curr.length > 0 ? curr : merged));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // Ignore localStorage quota
        }
      }
    });

    const handleUpdate = (e) => {
      if (e?.detail) {
        setProducts(e.detail);
      } else {
        getIDBProducts().then((idbList) => {
          if (isMounted) {
            setProducts(idbList ? mergeWithDefaults(idbList) : getStoredProducts());
          }
        });
      }
    };

    window.addEventListener('scoop_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('scoop_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateProduct = (updated) => {
    const updatedList = products.map(p => p.id === updated.id ? updated : p);
    saveStoredProducts(updatedList);
    setProducts(updatedList);
    saveProductToSupabase(updated);
  };

  const addProduct = (newProduct) => {
    const updatedList = [newProduct, ...products];
    saveStoredProducts(updatedList);
    setProducts(updatedList);
    saveProductToSupabase(newProduct);
  };

  const deleteProduct = (id) => {
    const updatedList = products.filter(p => p.id !== id);
    saveStoredProducts(updatedList);
    setProducts(updatedList);
    deleteProductFromSupabase(id);
  };

  const resetAll = () => {
    const defaultList = resetStoredProducts();
    setProducts(defaultList);
  };

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    resetAll
  };
}

