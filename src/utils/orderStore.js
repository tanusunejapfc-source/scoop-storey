import { useState, useEffect } from 'react';

const ORDERS_STORAGE_KEY = 'bhaskar_store_orders_v1';

// Initial dummy orders so the admin panel has beautiful sample data right away
const INITIAL_SAMPLE_ORDERS = [
  {
    orderId: 'SS-914820',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    date: new Date(Date.now() - 1000 * 60 * 45).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    source: 'WhatsApp Order',
    status: 'WhatsApp Verification Pending',
    customer: {
      fullName: 'Aarohi Sen',
      phone: '9820145521',
      streetAddress: 'Flat 402, Lotus Garden, Linking Road, Bandra West',
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
        image: '/images/pendants/pearl-pendant.jpg'
      },
      {
        id: 'brac-butterfly',
        name: 'Butterfly Charm Bracelet',
        priceINR: 199,
        qty: 1,
        selectedColor: 'Pastel Rainbow',
        selectedColorHex: '#FFB6C1',
        image: '/images/bracelets-anklets.jpg'
      },
      {
        id: 'mask-kitty',
        name: 'Hello Kitty Kawaii Eye Mask',
        priceINR: 99,
        qty: 1,
        selectedColor: 'Kawaii Pink',
        selectedColorHex: '#FFB6C1',
        image: '/images/eyemasks-skincare.jpg'
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

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read orders from localStorage:', err);
  }
  return INITIAL_SAMPLE_ORDERS;
}

export function saveOrderToStore(order) {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing.filter(o => o.orderId !== order.orderId)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: updated }));
    return order;
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
    return order;
  }
}

export function updateOrderStatusInStore(orderId, newStatus) {
  try {
    const existing = getStoredOrders();
    const updated = existing.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to update order status:', err);
  }
}

export function deleteOrderFromStore(orderId) {
  try {
    const existing = getStoredOrders();
    const updated = existing.filter(o => o.orderId !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to delete order:', err);
  }
}

export function clearAllOrdersFromStore() {
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('scoop_orders_updated', { detail: [] }));
  } catch (err) {
    console.error('Failed to clear orders:', err);
  }
}

export function useStoreOrders() {
  const [orders, setOrders] = useState(getStoredOrders);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        setOrders(e.detail);
      } else {
        setOrders(getStoredOrders());
      }
    };

    window.addEventListener('scoop_orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('scoop_orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addOrder = (order) => {
    saveOrderToStore(order);
    setOrders(getStoredOrders());
  };

  const updateStatus = (orderId, newStatus) => {
    updateOrderStatusInStore(orderId, newStatus);
    setOrders(getStoredOrders());
  };

  const deleteOrder = (orderId) => {
    deleteOrderFromStore(orderId);
    setOrders(getStoredOrders());
  };

  const clearOrders = () => {
    clearAllOrdersFromStore();
    setOrders([]);
  };

  return {
    orders,
    addOrder,
    updateStatus,
    deleteOrder,
    clearOrders
  };
}

