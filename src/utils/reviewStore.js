/**
 * Scoop Storey Customer Ratings & Reviews Store
 * Supports customer submissions, admin moderation (Approve / Reject),
 * custom merchant uploads, rating statistics, and realtime synchronization.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchConfigFromCloud,
  syncConfigToCloud,
  fetchReviewsFromApi,
  saveReviewToApi,
  updateReviewInApi,
  deleteReviewFromApi
} from './apiClient';
import { INITIAL_PRODUCT_REVIEWS } from '../data/productReviewsData';

const REVIEWS_STORAGE_KEY = 'scoop_store_reviews_v5';
const OLD_REVIEWS_KEY = 'bhaskar_store_reviews_v3';

export const INITIAL_REVIEWS = [
  ...INITIAL_PRODUCT_REVIEWS
];

export async function syncReviewsToCloud(reviewsList) {
  try {
    await syncConfigToCloud('reviews', reviewsList);
  } catch {}
}

export async function fetchReviewsFromCloud() {
  if (typeof window === 'undefined') return null;
  try {
    const [configReviews, dbReviews] = await Promise.all([
      fetchConfigFromCloud('reviews'),
      fetchReviewsFromApi()
    ]);

    const base = Array.isArray(configReviews) && configReviews.length > 0
      ? configReviews
      : null;

    if (Array.isArray(dbReviews) && dbReviews.length > 0) {
      const seenIds = new Set(dbReviews.map(r => r.id));
      const merged = [
        ...dbReviews,
        ...(base || INITIAL_REVIEWS).filter(r => !seenIds.has(r.id))
      ];
      return merged;
    }

    return base;
  } catch {}
  return null;
}

let inMemoryReviews = null;

// Helper to cleanse any old lingering Bhaskar / Bhasker mentions
function sanitizeReviewRecord(rev) {
  if (!rev || typeof rev !== 'object') return rev;
  const clean = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str
      .replace(/Bhaskar bhaiya/gi, 'Tanu di')
      .replace(/Bhasker bhaiya/gi, 'Tanu di')
      .replace(/Bhaskar Scoop Storey/gi, 'Scoop Storey')
      .replace(/Bhasker Scoop Storey/gi, 'Scoop Storey')
      .replace(/Bhaskar's Vault/gi, "Tanu's Vault")
      .replace(/Bhasker's Vault/gi, "Tanu's Vault")
      .replace(/Bhaskar/gi, 'Tanu')
      .replace(/Bhasker/gi, 'Tanu');
  };
  return {
    ...rev,
    comment: clean(rev.comment),
    title: clean(rev.title),
    customerName: clean(rev.customerName),
    reply: rev.reply ? clean(rev.reply) : rev.reply
  };
}

/**
 * Retrieve all reviews from storage
 */
export function getStoredReviews() {
  if (inMemoryReviews && Array.isArray(inMemoryReviews)) {
    return inMemoryReviews.map(sanitizeReviewRecord);
  }

  try {
    let raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      const oldRaw = localStorage.getItem(OLD_REVIEWS_KEY);
      if (oldRaw) {
        raw = oldRaw;
        try { localStorage.removeItem(OLD_REVIEWS_KEY); } catch {}
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure we load the full product reviews suite if old cache has fewer items
      if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCT_REVIEWS.length) {
        const sanitized = parsed.map(sanitizeReviewRecord);
        inMemoryReviews = sanitized;
        try {
          localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(sanitized));
        } catch {}
        return sanitized;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored reviews:', err);
  }

  inMemoryReviews = INITIAL_REVIEWS.map(sanitizeReviewRecord);
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(inMemoryReviews));
  } catch {}
  return inMemoryReviews;
}

/**
 * Save reviews list to storage & dispatch update event
 */
function persistReviews(reviewsList) {
  inMemoryReviews = reviewsList;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsList));
  } catch (err) {
    console.warn('Storage quota issue while saving reviews:', err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('scoop_reviews_updated', { detail: reviewsList }));
  }
  syncReviewsToCloud(reviewsList);
}

/**
 * Customer submits a review (defaults to 'pending' for admin moderation)
 */
export async function submitCustomerReview({
  productId = 'general',
  productName = 'Scoop Storey Store',
  customerName,
  handle = '',
  rating = 5,
  title = '',
  comment = '',
  images = []
}) {
  const cleanName = (customerName || '').trim() || 'Happy Customer';
  const cleanTitle = (title || '').trim() || 'Loved it!';
  const cleanComment = (comment || '').trim();
  const validRating = Math.min(5, Math.max(1, Number(rating) || 5));

  const newReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    productId: productId || 'general',
    productName: productName || 'Scoop Storey Store',
    customerName: cleanName,
    handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '',
    rating: validRating,
    title: cleanTitle,
    comment: cleanComment,
    images: Array.isArray(images) ? images : [],
    verifiedBuyer: true,
    status: 'pending', // Requires admin approval
    createdAt: Date.now(),
    date: 'Just now',
    isCustomMerchant: false,
    likesCount: 0
  };

  const existing = getStoredReviews();
  const updated = [newReview, ...existing];
  persistReviews(updated);

  // Persist directly to Railway PostgreSQL reviews table
  saveReviewToApi(newReview).catch(() => {});

  return newReview;
}

/**
 * Merchant uploads custom review (from WhatsApp, Instagram, or pop-up)
 * Defaults to 'published'
 */
export async function createMerchantReview({
  productId = 'general',
  productName = 'Scoop Storey Store',
  customerName,
  handle = '',
  rating = 5,
  title = '',
  comment = '',
  images = [],
  verifiedBuyer = true,
  status = 'published',
  date = 'Recently'
}) {
  const newReview = {
    id: `rev_m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    productId: productId || 'general',
    productName: productName || 'Scoop Storey Store',
    customerName: (customerName || '').trim() || 'Verified Customer',
    handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : '',
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    title: (title || '').trim() || 'Verified Customer Feedback',
    comment: (comment || '').trim(),
    images: Array.isArray(images) ? images : [],
    verifiedBuyer: verifiedBuyer !== false,
    status: status || 'published',
    createdAt: Date.now(),
    date: date || 'Recently',
    isCustomMerchant: true,
    likesCount: 1
  };

  const existing = getStoredReviews();
  const updated = [newReview, ...existing];
  persistReviews(updated);
  saveReviewToApi(newReview).catch(() => {});
  return newReview;
}

/**
 * Moderate review status ('published' | 'pending' | 'rejected')
 */
export function updateReviewStatus(reviewId, newStatus) {
  const existing = getStoredReviews();
  const updated = existing.map(rev => 
    rev.id === reviewId ? { ...rev, status: newStatus } : rev
  );
  persistReviews(updated);
  updateReviewInApi(reviewId, { status: newStatus }).catch(() => {});
  return true;
}

/**
 * Delete review permanently
 */
export function deleteReview(reviewId) {
  const existing = getStoredReviews();
  const updated = existing.filter(rev => rev.id !== reviewId);
  persistReviews(updated);
  deleteReviewFromApi(reviewId).catch(() => {});
  return true;
}

/**
 * Toggle verified buyer badge
 */
export function toggleReviewVerified(reviewId) {
  const existing = getStoredReviews();
  const updated = existing.map(rev => 
    rev.id === reviewId ? { ...rev, verifiedBuyer: !rev.verifiedBuyer } : rev
  );
  persistReviews(updated);
  return true;
}

/**
 * Calculate ratings summary & star distribution
 */
export function calculateRatingSummary(reviewsList = [], productId = null) {
  const filtered = productId && productId !== 'all' && productId !== 'general'
    ? reviewsList.filter(r => r.productId === productId && r.status === 'published')
    : reviewsList.filter(r => r.status === 'published');

  const total = filtered.length;
  if (total === 0) {
    return {
      average: 5.0,
      total: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentages: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  filtered.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    breakdown[star] = (breakdown[star] || 0) + 1;
    sum += star;
  });

  const average = Number((sum / total).toFixed(1));
  const percentages = {
    5: Math.round(((breakdown[5] || 0) / total) * 100),
    4: Math.round(((breakdown[4] || 0) / total) * 100),
    3: Math.round(((breakdown[3] || 0) / total) * 100),
    2: Math.round(((breakdown[2] || 0) / total) * 100),
    1: Math.round(((breakdown[1] || 0) / total) * 100)
  };

  return {
    average,
    total,
    breakdown,
    percentages
  };
}

/**
 * Custom React Hook for live reviews in components
 */
export function useReviews(productId = null) {
  const [reviews, setReviews] = useState(() => getStoredReviews());

  const refreshReviews = useCallback(() => {
    const latest = getStoredReviews();
    setReviews([...latest]);
  }, []);

  useEffect(() => {
    fetchReviewsFromCloud().then(cloudReviews => {
      if (cloudReviews && Array.isArray(cloudReviews) && cloudReviews.length > 0) {
        inMemoryReviews = cloudReviews;
        setReviews(cloudReviews);
        try {
          localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(cloudReviews));
        } catch {}
      }
    });

    const handleUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setReviews(e.detail);
      } else {
        refreshReviews();
      }
    };

    window.addEventListener('scoop_reviews_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('scoop_reviews_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshReviews]);

  // Published reviews accessible to shoppers
  const publishedReviews = useMemo(() => {
    if (!productId || productId === 'all') {
      return reviews.filter(r => r.status === 'published');
    }
    return reviews.filter(r => (r.productId === productId || r.productId === 'general') && r.status === 'published');
  }, [reviews, productId]);

  // Moderation counts for admin badge
  const pendingCount = useMemo(() => {
    return reviews.filter(r => r.status === 'pending').length;
  }, [reviews]);

  const summary = useMemo(() => {
    return calculateRatingSummary(reviews, productId);
  }, [reviews, productId]);

  return {
    allReviews: reviews,
    publishedReviews,
    pendingCount,
    summary,
    refreshReviews,
    submitReview: submitCustomerReview,
    createMerchantReview,
    updateStatus: updateReviewStatus,
    deleteReview,
    toggleVerified: toggleReviewVerified
  };
}
