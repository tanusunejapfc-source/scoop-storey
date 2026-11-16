/**
 * Scoop Storey Customer Ratings & Reviews Store
 * Supports customer submissions, admin moderation (Approve / Reject),
 * custom merchant uploads, rating statistics, and realtime synchronization.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, uploadImageToSupabase } from './supabaseClient';

const REVIEWS_STORAGE_KEY = 'bhaskar_store_reviews_v1';

export const INITIAL_REVIEWS = [
  {
    id: 'rev_101',
    productId: 'scoop-big',
    productName: 'Scoop Storey - Big Scoop (3 Scoops)',
    customerName: 'Ananya S.',
    handle: '@ananya_glam',
    rating: 5,
    title: 'Literally the cutest package I have ever received! 💖',
    comment: 'I ordered the Big Scoop and seeing Bhaskar pack it on Instagram was so exciting! The charms are surprisingly heavy, polished, and the teddy bear keychain is super fluffy. 10/10.',
    images: ['/images/deluxe-giftbox.jpg'],
    verifiedBuyer: true,
    status: 'published',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    date: '2 days ago',
    isCustomMerchant: false,
    likesCount: 14
  },
  {
    id: 'rev_102',
    productId: 'pend-bow-heart',
    productName: 'Bow Heart Aesthetic Pendant',
    customerName: 'Rohan M.',
    handle: '@rohan_aesthetic',
    rating: 5,
    title: 'ASMR packaging is 100% authentic ✨',
    comment: 'The scent of the crinkle shreds and the personalized wax seal made opening it feel like Christmas morning. My girlfriend loved the beaded phone strap and bow heart pendant.',
    images: ['/images/pendants/bow-heart-pendant.png'],
    verifiedBuyer: true,
    status: 'published',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    date: '1 week ago',
    isCustomMerchant: false,
    likesCount: 9
  },
  {
    id: 'rev_103',
    productId: 'scoop-mini',
    productName: 'Scoop Storey - Mini Scoop',
    customerName: 'Tanvi P.',
    handle: '@tanvi.crafts',
    rating: 5,
    title: 'Got the rare Gold Vault Bear! 🧸👑',
    comment: 'I was so hoping for the gold bear and I actually got it in my mystery scoop! You can tell Bhaskar genuinely cares about quality. Will order again for sure.',
    images: [],
    verifiedBuyer: true,
    status: 'published',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14, // 14 days ago
    date: '2 weeks ago',
    isCustomMerchant: false,
    likesCount: 22
  },
  {
    id: 'rev_104',
    productId: 'korean-wallet-cloud',
    productName: 'Korean Cute Cloud Pouch Wallet',
    customerName: 'Simran Kaur',
    handle: '@simran_kawaii',
    rating: 5,
    title: 'So soft and holds all my cards & lip balms! ☁️',
    comment: 'Received this in Delhi within 3 days with express delivery. The zipper is super smooth and pastel color is exactly like the photos.',
    images: ['/images/wallets/korean-cloud-wallet.jpg'],
    verifiedBuyer: true,
    status: 'published',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    date: '3 days ago',
    isCustomMerchant: true,
    likesCount: 8
  }
];

let inMemoryReviews = null;

/**
 * Retrieve all reviews from storage
 */
export function getStoredReviews() {
  if (inMemoryReviews && Array.isArray(inMemoryReviews)) {
    return inMemoryReviews;
  }

  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryReviews = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored reviews:', err);
  }

  inMemoryReviews = [...INITIAL_REVIEWS];
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

  // Attempt async sync to Supabase if table exists
  if (supabase) {
    try {
      supabase.from('reviews').insert({
        id: newReview.id,
        product_id: newReview.productId,
        product_name: newReview.productName,
        customer_name: newReview.customerName,
        handle: newReview.handle,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        images: newReview.images,
        verified_buyer: newReview.verifiedBuyer,
        status: newReview.status,
        created_at: new Date(newReview.createdAt).toISOString()
      }).then(() => {}).catch(() => {});
    } catch {}
  }

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
  return true;
}

/**
 * Delete review permanently
 */
export function deleteReview(reviewId) {
  const existing = getStoredReviews();
  const updated = existing.filter(rev => rev.id !== reviewId);
  persistReviews(updated);
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
