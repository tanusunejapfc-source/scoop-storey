import { useState, useEffect, useCallback } from 'react';
import { soundFX } from './audio';

const WISHLIST_STORAGE_KEY = 'bhaskar_store_wishlist_v1';

export function getStoredWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to read wishlist from localStorage:', err);
  }
  return [];
}

export function saveWishlistToStore(items) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('scoop_wishlist_updated', { detail: items }));
  } catch (err) {
    console.error('Failed to save wishlist:', err);
  }
}

export function toggleWishlistItem(product) {
  if (!product || !product.id) return [];
  const current = getStoredWishlist();
  const exists = current.some(item => item.id === product.id);

  let updated;
  if (exists) {
    soundFX.playPop(420);
    updated = current.filter(item => item.id !== product.id);
  } else {
    soundFX.playPop(620);
    const cleanItem = {
      id: product.id,
      name: product.name,
      priceINR: product.priceINR,
      category: product.category,
      badge: product.badge || 'Popular ✨',
      image: product.image || (Array.isArray(product.images) && product.images[0]) || '/images/deluxe-giftbox.jpg',
      colors: product.colors || []
    };
    updated = [cleanItem, ...current];
  }

  saveWishlistToStore(updated);
  return updated;
}

export function isItemInWishlist(productId) {
  if (!productId) return false;
  const current = getStoredWishlist();
  return current.some(item => item.id === productId);
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => getStoredWishlist());

  const refreshWishlist = useCallback(() => {
    const fresh = getStoredWishlist();
    setWishlist(fresh);
    return fresh;
  }, []);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setWishlist(e.detail);
      } else {
        refreshWishlist();
      }
    };

    window.addEventListener('scoop_wishlist_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('scoop_wishlist_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshWishlist]);

  const toggle = (product) => {
    return toggleWishlistItem(product);
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const remove = (productId) => {
    const updated = wishlist.filter(item => item.id !== productId);
    saveWishlistToStore(updated);
    setWishlist(updated);
  };

  const clear = () => {
    saveWishlistToStore([]);
    setWishlist([]);
  };

  return {
    wishlist,
    toggle,
    isWishlisted,
    remove,
    clear,
    wishlistCount: wishlist.length
  };
}

