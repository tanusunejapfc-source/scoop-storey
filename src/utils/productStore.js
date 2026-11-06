import { useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/storeData';

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
  } else if (p.category === 'Bracelets & Anklets') {
    defaultColors = [
      { name: 'Gold Tone', hex: '#E5C158' },
      { name: 'Rose Gold', hex: '#E0A899' },
      { name: 'Pastel Rainbow', hex: '#FFB6C1' }
    ];
  } else if (p.category === 'Eye Masks & Self-Care') {
    defaultColors = [
      { name: 'Kawaii Pink', hex: '#FFB6C1' },
      { name: 'Cloud White', hex: '#F5F5F7' },
      { name: 'Lavender Mist', hex: '#E6E6FA' }
    ];
  } else if (p.category === 'Korean Wallets') {
    defaultColors = [
      { name: 'Blush Pink', hex: '#FFB6C1' },
      { name: 'Ivory White', hex: '#FFFDD0' },
      { name: 'Matcha Mint', hex: '#C1E1C1' },
      { name: 'Soft Lilac', hex: '#D8BFD8' }
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
  } else if (p.category === 'Bracelets & Anklets') {
    defaultImages = [
      p.image,
      '/images/charm-bracelets.jpg',
      '/images/asmr-packing.jpg',
      '/images/deluxe-giftbox.jpg'
    ];
  } else if (p.category === 'Eye Masks & Self-Care') {
    defaultImages = [
      p.image,
      '/images/eyemasks-skincare.jpg',
      '/images/asmr-packing.jpg'
    ];
  } else if (p.category === 'Korean Wallets') {
    defaultImages = [
      p.image,
      '/images/korean-wallets.jpg',
      '/images/deluxe-giftbox.jpg',
      '/images/asmr-packing.jpg'
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
  } else if (p.category === 'Bracelets & Anklets') {
    defaultSpecs = {
      'Material': 'Tarnish-Resistant Alloy & Acrylic Charms',
      'Length': '6.5 inches + 2 inch adjustable extender',
      'Finish': 'Polished Mirror Luster',
      'Closure': 'Secure Claw Lock',
      'Packaging': 'Organza Gift Bag with Wax-Sealed Tag'
    };
  } else if (p.category === 'Eye Masks & Self-Care') {
    defaultSpecs = {
      'Material': 'Ultra-Soft Cloud Velvet & Mulberry Satin Silk',
      'Band': 'Gentle Stretch Elastic (No-Hair Pull)',
      'Light Blocking': '100% Total Blackout Design',
      'Care': 'Gentle Hand Wash in Cold Water'
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

const STORAGE_KEY = 'bhaskar_store_products_v3';

// Native IndexedDB for robust large image persistence (no 5MB localStorage quota limit!)
const IDB_NAME = 'ScoopStoreyDB';
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

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any legacy 4th scoop (scoop-vault)
        return parsed.filter(p => p.id !== 'scoop-vault' && p.id !== 'vault-mega-scoop');
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

    // Load from IndexedDB on refresh to restore full uploaded images
    getIDBProducts().then((idbList) => {
      if (isMounted && idbList && Array.isArray(idbList) && idbList.length > 0) {
        setProducts(idbList);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(idbList));
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
            setProducts(idbList || getStoredProducts());
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
  };

  const addProduct = (newProduct) => {
    const updatedList = [newProduct, ...products];
    saveStoredProducts(updatedList);
    setProducts(updatedList);
  };

  const deleteProduct = (id) => {
    const updatedList = products.filter(p => p.id !== id);
    saveStoredProducts(updatedList);
    setProducts(updatedList);
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

