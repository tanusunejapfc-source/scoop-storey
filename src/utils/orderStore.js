import { useState, useEffect, useCallback } from 'react';
import { supabase, saveOrderToSupabase, fetchOrdersFromSupabase } from './supabaseClient';

const ORDERS_STORAGE_KEY = 'bhaskar_store_orders_v1';

// Initial dummy orders so the admin panel has beautiful sample data right away
export const INITIAL_SAMPLE_ORDERS = [
  {
    orderId: 'SS-924110',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    date: new Date(Date.now() - 1000 * 60 * 15).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    source: 'Prepaid UPI / QR Code',
    status: 'Payment Received (Verify UTR)',
    paymentMethod: 'UPI QR Code',
    upiRefNumber: '431289551920',
    customer: {
      fullName: 'Diya Kapoor',
      phone: '9819922653',
      streetAddress: 'B-104, Rose Petal Apts, Linking Road',
      landmark: 'Opposite City Center Mall',
      pincode: '400050',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    items: [
      {
        id: 'scoop-midi',
        name: 'Scoop Storey - Midi Scoop',
        priceINR: 1299,
        qty: 1,
        selectedColor: 'Pastel Kawaii Mix',
        selectedColorHex: '#FFAAA6',
        image: '/images/scoop-bowl.webp'
      },
      {
        id: 'pend-bow-heart',
        name: 'Bow Heart Aesthetic Pendant',
        priceINR: 199,
        qty: 1,
        selectedColor: 'Rose Gold',
        selectedColorHex: '#E0A899',
        image: '/images/pendants/bow-heart-pendant.webp'
      }
    ],
    totalItemCount: 2,
    subtotalINR: 1498,
    discountAmountINR: 0,
    shippingINR: 0,
    totalINR: 1498,
    filmOnReel: '@diya_aesthetic',
    additionalNotes: 'Please pack in cute pink bubblewrap and add extra gummy bears! 💖'
  },
  {
    orderId: 'SS-914820',
    timestamp: Date.now() - 1000 * 60 * 65, // 65 mins ago
    date: new Date(Date.now() - 1000 * 60 * 65).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    source: 'WhatsApp Order',
    status: 'WhatsApp Verification Pending',
    paymentMethod: 'WhatsApp Direct',
    customer: {
      fullName: 'Aarohi Sen',
      phone: '9820145521',
      streetAddress: 'Flat 402, Lotus Garden, Bandra West',
      landmark: 'Near City Mall',
      pincode: '400050',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    items: [
      {
        id: 'pend-pearl',
        name: 'Lustrous Pearl Drop Pendant',
        priceINR: 240,
        qty: 1,
        selectedColor: 'Rose Gold',
        selectedColorHex: '#E0A899',
        image: '/images/pendants/pearl-pendant.webp'
      },
      {
        id: 'brac-butterfly',
        name: 'Butterfly Charm Bracelet',
        priceINR: 199,
        qty: 1,
        selectedColor: 'Pastel Rainbow',
        selectedColorHex: '#FFB6C1',
        image: '/images/bracelets-anklets.webp'
      },
      {
        id: 'mask-kitty',
        name: 'Hello Kitty Kawaii Eye Mask',
        priceINR: 99,
        qty: 1,
        selectedColor: 'Kawaii Pink',
        selectedColorHex: '#FFB6C1',
        image: '/images/eyemasks-skincare.webp'
      }
    ],
    totalItemCount: 3,
    subtotalINR: 538,
    discountAmountINR: 0,
    shippingINR: 0,
    totalINR: 538,
    filmOnReel: '@aarohi_style',
    additionalNotes: 'Please pack in a cute pink gift pouch with extra stickers! ✨'
  }
];

// In-memory orders cache so orders are never lost during the session
let memoryOrders = null;

// Sanitize order payload to prevent localStorage quota exhaustion
export function sanitizeOrder(order) {
  if (!order) return null;

  const sanitizedItems = (order.items || []).map(item => ({
    id: item.id || `item-${Date.now()}`,
    name: item.name || 'Scoop Storey Item',
    priceINR: Number(item.priceINR || item.price || 0),
    qty: Number(item.qty || item.quantity || 1),
    image: item.image || (Array.isArray(item.images) && item.images[0]) || '/images/deluxe-giftbox.webp',
    selectedColor: item.selectedColor || null,
    selectedColorHex: item.selectedColorHex || null
  }));

  // Extract payment screenshot from any valid location without corrupting base64/URL
  let cleanScreenshot = order.paymentScreenshot || 
    order.payment_screenshot || 
    order.customer?.paymentScreenshot || 
    order.customer?.payment_screenshot || 
    null;

  return {
    orderId: order.orderId || `SS-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: order.timestamp || Date.now(),
    date: order.date || new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    source: order.source || (order.isPartialCod ? 'Partial COD' : 'Prepaid Order'),
    status: order.status || 'Pending Verification',
    paymentMethod: order.paymentMethod || (order.isPartialCod ? 'Partial COD' : (order.source?.includes('UPI') ? 'UPI QR Code' : 'WhatsApp')),
    upiRefNumber: order.upiRefNumber || null,
    paymentScreenshot: cleanScreenshot,
    isPartialCod: Boolean(order.isPartialCod),
    advancePaidINR: order.advancePaidINR ?? (order.customer?.advancePaidINR ?? null),
    balanceDueOnDeliveryINR: order.balanceDueOnDeliveryINR ?? (order.customer?.balanceDueOnDeliveryINR ?? null),
    customer: {
      fullName: order.customer?.fullName || 'Customer',
      phone: order.customer?.phone || '',
      streetAddress: order.customer?.streetAddress || '',
      landmark: order.customer?.landmark || '',
      pincode: order.customer?.pincode || '',
      city: order.customer?.city || '',
      state: order.customer?.state || 'Maharashtra',
      paymentScreenshot: cleanScreenshot,
      advancePaidINR: order.advancePaidINR ?? null,
      balanceDueOnDeliveryINR: order.balanceDueOnDeliveryINR ?? null,
      isPartialCod: Boolean(order.isPartialCod)
    },
    items: sanitizedItems,
    totalItemCount: order.totalItemCount || sanitizedItems.reduce((acc, it) => acc + it.qty, 0),
    subtotalINR: Number(order.subtotalINR || order.totalINR || 0),
    discountAmountINR: Number(order.discountAmountINR || 0),
    shippingINR: Number(order.shippingINR || 0),
    totalINR: Number(order.totalINR || 0),
    filmOnReel: order.filmOnReel || null,
    additionalNotes: order.additionalNotes ? String(order.additionalNotes).trim() : null,
    courierName: order.courierName || null,
    trackingNumber: order.trackingNumber || null,
    trackingUrl: order.trackingUrl || (order.trackingNumber ? getCourierTrackingUrl(order.courierName, order.trackingNumber) : null)
  };
}

/**
 * Generate direct live tracking link for major Indian logistics partners
 */
export function getCourierTrackingUrl(courier, awb) {
  if (!awb) return '';
  const cleanAwb = String(awb).trim();
  const c = String(courier || '').toLowerCase();

  if (c.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${cleanAwb}`;
  }
  if (c.includes('blue') || c.includes('dart')) {
    return `https://www.bluedart.com/tracking?trackNumber=${cleanAwb}`;
  }
  if (c.includes('dtdc')) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${cleanAwb}`;
  }
  if (c.includes('india') || c.includes('post')) {
    return `https://www.indiapost.gov.in/_layouts/15/dpt.cpt.etracking/trackconsignment.aspx`;
  }
  return `https://shiprocket.co/tracking/${cleanAwb}`;
}

/**
 * Update order courier tracking & delivery status
 */
export function updateOrderTrackingInStore(orderId, { status, courierName, trackingNumber }) {
  try {
    const existing = getStoredOrders();
    const cleanTrackingUrl = trackingNumber ? getCourierTrackingUrl(courierName, trackingNumber) : null;
    const updated = existing.map(ord => {
      if (ord.orderId === orderId) {
        return {
          ...ord,
          status: status || ord.status,
          courierName: courierName !== undefined ? courierName : ord.courierName,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : ord.trackingNumber,
          trackingUrl: cleanTrackingUrl !== undefined ? cleanTrackingUrl : ord.trackingUrl
        };
      }
      return ord;
    });

    memoryOrders = updated;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to update order tracking:', err);
    return false;
  }
}

/**
 * Export orders formatted for Shiprocket / Indian Couriers Bulk Upload CSV
 */
export function exportOrdersToCourierCSV(ordersList) {
  if (!Array.isArray(ordersList) || ordersList.length === 0) return false;

  const headers = [
    'Order ID',
    'Order Date',
    'Customer Name',
    'Customer Phone',
    'Shipping Address',
    'Landmark',
    'City',
    'State',
    'Pincode',
    'Country',
    'Ordered Items',
    'Total Items',
    'Total Amount INR',
    'Payment Mode',
    'Advance Paid INR',
    'COD Balance Due INR',
    'UPI Ref UTR',
    'Status',
    'Courier Name',
    'Tracking AWB',
    'Reel Handle',
    'Customer Notes'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${clean}"`;
  };

  const rows = ordersList.map(order => {
    const cust = order.customer || {};
    const itemsSummary = (order.items || [])
      .map(it => `${it.name}${it.selectedColor ? ` [${it.selectedColor}]` : ''} (x${it.qty})`)
      .join(' + ');

    return [
      escapeCSV(order.orderId),
      escapeCSV(order.date),
      escapeCSV(cust.fullName),
      escapeCSV(cust.phone),
      escapeCSV(cust.streetAddress),
      escapeCSV(cust.landmark),
      escapeCSV(cust.city),
      escapeCSV(cust.state),
      escapeCSV(cust.pincode),
      escapeCSV('India'),
      escapeCSV(itemsSummary),
      escapeCSV(order.totalItemCount || order.items?.length || 1),
      escapeCSV(order.totalINR),
      escapeCSV(order.isPartialCod ? 'Partial COD' : (order.paymentMethod || 'Prepaid UPI')),
      escapeCSV(order.isPartialCod ? (order.advancePaidINR ?? 0) : (order.totalINR ?? 0)),
      escapeCSV(order.isPartialCod ? (order.balanceDueOnDeliveryINR ?? 0) : 0),
      escapeCSV(order.upiRefNumber || 'N/A'),
      escapeCSV(order.status),
      escapeCSV(order.courierName || 'Pending'),
      escapeCSV(order.trackingNumber || 'Pending'),
      escapeCSV(order.filmOnReel || ''),
      escapeCSV(order.additionalNotes || '')
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Scoop_Storey_Courier_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function getStoredOrders() {
  if (memoryOrders && Array.isArray(memoryOrders) && memoryOrders.length > 0) {
    return memoryOrders;
  }

  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryOrders = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read orders from localStorage, using memory/sample orders:', err);
  }

  memoryOrders = [...INITIAL_SAMPLE_ORDERS];
  return memoryOrders;
}

export function saveOrderToStore(order) {
  try {
    const cleanOrder = sanitizeOrder(order);
    if (!cleanOrder) return order;

    // 1. Sync directly to Supabase cloud database
    saveOrderToSupabase(cleanOrder);

    const existing = getStoredOrders();
    const updated = [cleanOrder, ...existing.filter(o => o.orderId !== cleanOrder.orderId)];
    
    // Always update in-memory cache first
    memoryOrders = updated;

    // Progressive storage with quota recovery
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (quotaErr) {
      console.warn('localStorage quota reached, attempting storage compression...', quotaErr);
      try {
        // Fallback 1: Strip paymentScreenshot from older orders (retain newest)
        const strippedOldScreenshots = updated.map((ord, idx) => {
          if (idx === 0) return ord;
          const { paymentScreenshot: _unused, ...rest } = ord;
          return rest;
        });
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(strippedOldScreenshots));
      } catch {
        try {
          // Fallback 2: Strip paymentScreenshot from all and keep last 25 orders
          const minimalOrders = updated.slice(0, 25).map(ord => {
            const { paymentScreenshot: _unused, ...rest } = ord;
            return rest;
          });
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(minimalOrders));
        } catch (err3) {
          console.error('All localStorage save attempts failed. Retained in memory cache.', err3);
        }
      }
    }

    // Always dispatch custom event to notify all components immediately
    try {
      window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: updated }));
    } catch {
      // ignore
    }

    return cleanOrder;
  } catch (err) {
    console.error('Failed to save order to store:', err);
    return order;
  }
}

export function updateOrderStatusInStore(orderId, newStatus) {
  try {
    const existing = getStoredOrders();
    const updated = existing.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
    memoryOrders = updated;

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore quota
    }

    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to update order status:', err);
  }
}

export function deleteOrderFromStore(orderId) {
  try {
    const existing = getStoredOrders();
    const updated = existing.filter(o => o.orderId !== orderId);
    memoryOrders = updated;

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete order:', err);
  }
}

export function clearAllOrdersFromStore() {
  try {
    memoryOrders = [];
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: [] }));
  } catch (err) {
    console.error('Failed to clear orders:', err);
  }
}

export function useStoreOrders() {
  const [orders, setOrders] = useState(() => getStoredOrders());

  const refreshOrders = useCallback(async () => {
    // 1. Fetch live cloud orders from Supabase first
    try {
      const cloudOrders = await fetchOrdersFromSupabase();
      if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
        // Pure cloud sync - replace sample data with actual live orders
        memoryOrders = cloudOrders;
        setOrders(cloudOrders);
        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(cloudOrders));
        } catch {}
        return cloudOrders;
      }
    } catch (err) {
      console.warn('Failed to fetch orders from Supabase:', err);
    }

    // 2. Fallback to localStorage if offline or Supabase empty
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryOrders = parsed;
          setOrders(parsed);
          return parsed;
        }
      }
    } catch {
      // fallback to memory
    }

    const fresh = getStoredOrders();
    setOrders(fresh);
    return fresh;
  }, []);

  useEffect(() => {
    // Fetch live orders from Supabase cloud database immediately
    refreshOrders();

    // Setup Supabase Realtime channel for instant live updates across devices
    if (supabase) {
      const channel = supabase
        .channel('realtime_admin_orders_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            console.log('⚡ Realtime Supabase order event received:', payload);
            refreshOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refreshOrders]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setOrders(e.detail);
      } else {
        refreshOrders();
      }
    };

    window.addEventListener('scoop_orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', refreshOrders);

    return () => {
      window.removeEventListener('scoop_orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', refreshOrders);
    };
  }, [refreshOrders]);

  const addOrder = (order) => {
    const saved = saveOrderToStore(order);
    refreshOrders();
    return saved;
  };

  const updateStatus = (orderId, newStatus) => {
    updateOrderStatusInStore(orderId, newStatus);
    refreshOrders();
  };

  const updateTracking = (orderId, trackingData) => {
    updateOrderTrackingInStore(orderId, trackingData);
    refreshOrders();
  };

  const deleteOrder = (orderId) => {
    deleteOrderFromStore(orderId);
    refreshOrders();
  };

  const clearOrders = () => {
    clearAllOrdersFromStore();
    setOrders([]);
  };

  return {
    orders,
    refreshOrders,
    addOrder,
    updateStatus,
    updateTracking,
    deleteOrder,
    clearOrders
  };
}
