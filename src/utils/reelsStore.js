import { useState, useEffect, useCallback } from 'react';

export const DEFAULT_REELS = [
  {
    id: 'reel-1',
    title: 'Packing 5x Scoop Order for @aaradhya_k 🎀',
    views: '482K',
    likes: '42.8K',
    comments: '1,280',
    audio: 'Original Audio - Bhaskar Scoop Storey (ASMR)',
    tag: '#mysteryscoop #asmrpacking #satisfying',
    image: '/images/asmr-packing.jpg',
    videoUrl: '',
    instagramUrl: 'https://www.instagram.com/bhaskar_scoopstorey/'
  },
  {
    id: 'reel-2',
    title: 'The Golden Scoop Dip: 3x Bear Loot Drop! ✨',
    views: '890K',
    likes: '78.2K',
    comments: '2,410',
    audio: 'Pure ASMR Charm Clinks • Bhaskar',
    tag: '#kawaiicharms #resinart #scoopstorey',
    image: '/images/scoop-bowl.jpg',
    videoUrl: '',
    instagramUrl: 'https://www.instagram.com/bhaskar_scoopstorey/'
  },
  {
    id: 'reel-3',
    title: 'DIY Beaded Phone Strap Tutorial & Order Packing 📱',
    views: '320K',
    likes: '29.4K',
    comments: '890',
    audio: 'Pastel Dreams Chill Beats • Bhaskar',
    tag: '#phonestrap #y2kcharms #crafttok',
    image: '/images/charm-bracelets.jpg',
    videoUrl: '',
    instagramUrl: 'https://www.instagram.com/bhaskar_scoopstorey/'
  },
  {
    id: 'reel-4',
    title: 'Opening the Royal Collector Vault Gift Box 👑',
    views: '1.2M',
    likes: '115K',
    comments: '3,840',
    audio: 'Unboxing Happiness • Bhaskar Scoop Storey',
    tag: '#blindbox #unboxinghappiness #kawaiiaesthetic',
    image: '/images/deluxe-giftbox.jpg',
    videoUrl: '',
    instagramUrl: 'https://www.instagram.com/bhaskar_scoopstorey/'
  }
];

const REELS_STORAGE_KEY = 'bhaskar_store_reels_v1';
const IDB_NAME = 'ScoopStoreyDB_v2';
const IDB_REELS_STORE = 'store_reels';

let memoryReels = null;

// Open IndexedDB with object store for reels & large video blobs
function openReelsDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      // Version 2 ensures store_reels is created if upgrading from v1
      const req = indexedDB.open(IDB_NAME, 2);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('store_catalog')) {
          db.createObjectStore('store_catalog');
        }
        if (!db.objectStoreNames.contains(IDB_REELS_STORE)) {
          db.createObjectStore(IDB_REELS_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => {
        console.warn('Reels IndexedDB open error:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('Reels IndexedDB exception:', err);
      resolve(null);
    }
  });
}

export async function getIDBReels() {
  try {
    const db = await openReelsDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_REELS_STORE, 'readonly');
      const store = tx.objectStore(IDB_REELS_STORE);
      const req = store.get('reels');
      req.onsuccess = () => {
        const val = req.result;
        if (Array.isArray(val) && val.length > 0) {
          resolve(val);
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

export async function saveIDBReels(reels) {
  try {
    const db = await openReelsDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_REELS_STORE, 'readwrite');
      const store = tx.objectStore(IDB_REELS_STORE);
      store.put(reels, 'reels');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('IndexedDB save error:', err);
    return false;
  }
}

export function getStoredReels() {
  if (memoryReels && Array.isArray(memoryReels) && memoryReels.length > 0) {
    return memoryReels;
  }

  try {
    const raw = localStorage.getItem(REELS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryReels = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read reels from localStorage:', err);
  }

  memoryReels = [...DEFAULT_REELS];
  return memoryReels;
}

export function saveStoredReels(reels) {
  if (!Array.isArray(reels)) return;

  memoryReels = reels;

  // 1. Save full payload to IndexedDB (unlimited video storage)
  saveIDBReels(reels);

  // 2. Save lean metadata payload to localStorage (strip massive data URLs if > 1MB to prevent quota crash)
  try {
    const leanReels = reels.map(reel => {
      let cleanVideo = reel.videoUrl || '';
      // If videoUrl is a huge base64 data string, don't store in localStorage (it's safe in IndexedDB)
      if (cleanVideo && cleanVideo.startsWith('data:') && cleanVideo.length > 200000) {
        cleanVideo = '__STORED_IN_INDEXEDDB__';
      }
      return {
        ...reel,
        videoUrl: cleanVideo
      };
    });
    localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(leanReels));
  } catch (err) {
    console.warn('localStorage reels save failed (using IndexedDB only):', err);
  }

  // 3. Dispatch event to update all components reactively
  try {
    window.dispatchEvent(new CustomEvent('scoop_reels_updated', { detail: reels }));
  } catch {
    // ignore
  }
}

// Automatically extract video frame as thumbnail
export function captureVideoPoster(videoFileOrUrl) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;

      let blobUrl = null;
      if (videoFileOrUrl instanceof File || videoFileOrUrl instanceof Blob) {
        blobUrl = URL.createObjectURL(videoFileOrUrl);
        video.src = blobUrl;
      } else if (typeof videoFileOrUrl === 'string') {
        video.src = videoFileOrUrl;
      } else {
        resolve(null);
        return;
      }

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, video.duration / 2 || 0.5);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 540;
          canvas.height = video.videoHeight || 960;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          resolve(dataUrl);
        } catch {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          resolve(null);
        }
      };

      video.onerror = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        resolve(null);
      };

      // Timeout fallback
      setTimeout(() => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        resolve(null);
      }, 4000);
    } catch {
      resolve(null);
    }
  });
}

export function useStoreReels() {
  const [reels, setReels] = useState(() => getStoredReels());
  const [loading, setLoading] = useState(true);

  // Initialize from IndexedDB on client-side
  useEffect(() => {
    let isMounted = true;
    getIDBReels().then((idbReels) => {
      if (!isMounted) return;
      if (idbReels && Array.isArray(idbReels) && idbReels.length > 0) {
        memoryReels = idbReels;
        setReels(idbReels);
      }
      setLoading(false);
    });

    const handleUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setReels(e.detail);
      } else {
        setReels(getStoredReels());
      }
    };

    window.addEventListener('scoop_reels_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('scoop_reels_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateReel = useCallback((updatedReel) => {
    const current = getStoredReels();
    const updated = current.map(r => r.id === updatedReel.id ? updatedReel : r);
    saveStoredReels(updated);
    setReels(updated);
    return updated;
  }, []);

  const addReel = useCallback((newReel) => {
    const current = getStoredReels();
    const cleanReel = {
      ...newReel,
      id: newReel.id || `reel-${Date.now()}`
    };
    const updated = [...current, cleanReel];
    saveStoredReels(updated);
    setReels(updated);
    return cleanReel;
  }, []);

  const deleteReel = useCallback((reelId) => {
    const current = getStoredReels();
    const updated = current.filter(r => r.id !== reelId);
    saveStoredReels(updated);
    setReels(updated);
    return updated;
  }, []);

  const resetReels = useCallback(() => {
    saveStoredReels(DEFAULT_REELS);
    setReels(DEFAULT_REELS);
  }, []);

  return {
    reels,
    loading,
    updateReel,
    addReel,
    deleteReel,
    resetReels
  };
}
