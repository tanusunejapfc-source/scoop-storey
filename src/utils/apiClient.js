/**
 * Scoop Storey Railway PostgreSQL & Persistent Volume API Client
 * Replaces Supabase client calls with native Railway Express REST APIs.
 */

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) msg = errData.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// =======================
// MEDIA UPLOADS (Railway Persistent Volume)
// =======================
export async function uploadFileToCloud(fileOrBlob, folder = 'uploads', customName = '') {
  try {
    const formData = new FormData();
    formData.append('folder', folder);
    if (customName) {
      formData.append('name', customName);
    }

    if (typeof fileOrBlob === 'string' && fileOrBlob.startsWith('data:')) {
      const data = await requestJson('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          name: customName || 'image',
          folder,
          dataUrl: fileOrBlob
        })
      });
      return data;
    }

    const fallbackName = customName || fileOrBlob?.name || `media-${Date.now()}.jpg`;
    formData.append('file', fileOrBlob, fallbackName);

    const data = await requestJson('/api/upload', {
      method: 'POST',
      body: formData
    });
    return data;
  } catch (err) {
    console.warn('Cloud file upload error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function uploadImageToCloud(fileOrDataUrl, folder = 'products') {
  return uploadFileToCloud(fileOrDataUrl, folder);
}

export async function uploadVideoToCloud(file) {
  return uploadFileToCloud(file, 'reels');
}

export async function uploadPaymentProofToCloud(fileOrBlob, orderId = 'order') {
  const cleanId = String(orderId || 'order').replace(/[^a-zA-Z0-9_-]/g, '');
  const res = await uploadFileToCloud(fileOrBlob, 'payments', `receipt-${cleanId}`);
  return res?.success ? res.url : null;
}

// =======================
// PRODUCTS API
// =======================
export async function fetchProductsFromCloud() {
  try {
    const data = await requestJson('/api/products');
    return Array.isArray(data?.products) ? data.products : null;
  } catch (err) {
    console.warn('API fetch products error:', err.message);
    return null;
  }
}

export async function saveProductToCloud(product) {
  try {
    await requestJson('/api/products', {
      method: 'POST',
      body: JSON.stringify({ product })
    });
    return true;
  } catch (err) {
    console.warn('API save product error:', err.message);
    return false;
  }
}

export async function saveProductsBatchToCloud(products) {
  if (!Array.isArray(products) || products.length === 0) return true;
  try {
    await requestJson('/api/products', {
      method: 'POST',
      body: JSON.stringify({ products })
    });
    return true;
  } catch (err) {
    console.warn('API batch save products error:', err.message);
    return false;
  }
}

export async function deleteProductFromCloud(productId) {
  try {
    await requestJson(`/api/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
    return true;
  } catch (err) {
    console.warn('API delete product error:', err.message);
    return false;
  }
}

export async function deleteProductsBatchFromCloud(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return true;
  try {
    await requestJson('/api/products/delete-batch', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
    return true;
  } catch (err) {
    console.warn('API delete products batch error:', err.message);
    return false;
  }
}

export async function resetProductsInCloud() {
  try {
    const data = await requestJson('/api/products/reset', { method: 'POST' });
    return Array.isArray(data?.products) ? data.products : null;
  } catch (err) {
    console.warn('API reset products error:', err.message);
    return null;
  }
}

// =======================
// ORDERS & TRACKING API
// =======================
export async function fetchOrdersFromCloud() {
  try {
    const data = await requestJson('/api/orders');
    return Array.isArray(data?.orders) ? data.orders : null;
  } catch (err) {
    console.warn('API fetch orders error:', err.message);
    return null;
  }
}

export async function saveOrderToCloud(order) {
  try {
    await requestJson('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ order })
    });
    return true;
  } catch (err) {
    console.warn('API save order error:', err.message);
    return false;
  }
}

export async function updateOrderStatusInCloud(orderId, status) {
  try {
    await requestJson(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return true;
  } catch (err) {
    console.warn('API update order status error:', err.message);
    return false;
  }
}

export async function updateOrderTrackingInCloud(orderId, { status, courierName, trackingNumber }) {
  try {
    await requestJson(`/api/orders/${encodeURIComponent(orderId)}/tracking`, {
      method: 'PATCH',
      body: JSON.stringify({ status, courierName, trackingNumber })
    });
    return true;
  } catch (err) {
    console.warn('API update tracking error:', err.message);
    return false;
  }
}

export async function deleteOrderFromCloud(orderId) {
  try {
    await requestJson(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE'
    });
    return true;
  } catch (err) {
    console.warn('API delete order error:', err.message);
    return false;
  }
}

export async function clearAllOrdersFromCloud(orderIds = []) {
  try {
    await requestJson('/api/orders/clear', {
      method: 'POST',
      body: JSON.stringify({ orderIds })
    });
    return true;
  } catch (err) {
    console.warn('API clear orders error:', err.message);
    return false;
  }
}

export async function fetchSingleOrderForTracking(searchQuery) {
  const cleanQ = String(searchQuery || '').trim();
  if (!cleanQ || cleanQ.length < 3) return null;
  try {
    const data = await requestJson(`/api/tracking?q=${encodeURIComponent(cleanQ)}`);
    return data?.order || null;
  } catch (err) {
    console.warn('Order tracking lookup exception:', err.message);
    return null;
  }
}

// =======================
// REVIEWS API
// =======================
export async function fetchReviewsFromApi() {
  try {
    const data = await requestJson('/api/reviews');
    return Array.isArray(data?.reviews) ? data.reviews : null;
  } catch {
    return null;
  }
}

export async function saveReviewToApi(review) {
  try {
    await requestJson('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ review })
    });
    return true;
  } catch {
    return false;
  }
}

export async function updateReviewInApi(id, patch) {
  try {
    await requestJson(`/api/reviews/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch)
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteReviewFromApi(id) {
  try {
    await requestJson(`/api/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return true;
  } catch {
    return false;
  }
}

// =======================
// SITE CONFIGS API
// =======================
export async function fetchConfigFromCloud(key) {
  if (typeof window === 'undefined') return null;
  try {
    const data = await requestJson(`/api/config/${encodeURIComponent(key)}`);
    return data?.value ?? null;
  } catch {
    return null;
  }
}

export async function syncConfigToCloud(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    await requestJson(`/api/config/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    });
    return true;
  } catch {
    return false;
  }
}

// =======================
// TELEMETRY & PRESENCE API
// =======================
export async function syncTelemetrySessionToCloud(payload) {
  if (typeof window === 'undefined') return false;
  try {
    await requestJson('/api/telemetry/session', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return true;
  } catch {
    return false;
  }
}

export async function fetchTelemetrySummaryFromCloud() {
  if (typeof window === 'undefined') return null;
  try {
    return await requestJson('/api/telemetry/summary');
  } catch {
    return null;
  }
}

export async function fetchServerHealth() {
  try {
    return await requestJson('/api/health');
  } catch {
    return null;
  }
}
