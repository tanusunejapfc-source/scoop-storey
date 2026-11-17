// Notification Dispatcher Service for Scoop Storey
// Supports: Telegram Bot Instant Push, Direct Email Alerts (Web3Forms/Formspree), & Real-time Sound Chimes

import { soundFX } from './audio';

const NOTIFICATION_CONFIG_KEY = 'bhaskar_store_notifications_v1';
export const ORDER_BROADCAST_CHANNEL = 'bhaskar_store_order_events';

// Default Settings
export const DEFAULT_NOTIFICATION_SETTINGS = {
  telegram: {
    enabled: true,
    botToken: '', // e.g. 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
    chatId: '',   // e.g. 123456789
  },
  email: {
    enabled: true,
    recipientEmail: 'scoopstorey@gmail.com',
    provider: 'web3forms', // 'web3forms' | 'formspree' | 'custom'
    web3formsAccessKey: 'a840e691-884c-4739-9d78-6878b30f81d1', // default public gateway key
    formspreeUrl: '',
    customWebhookUrl: ''
  },
  sound: {
    enabled: true,
    vibrate: true
  }
};

/**
 * Retrieve saved notification preferences
 */
export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_CONFIG_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...parsed,
      telegram: { ...DEFAULT_NOTIFICATION_SETTINGS.telegram, ...(parsed.telegram || {}) },
      email: { ...DEFAULT_NOTIFICATION_SETTINGS.email, ...(parsed.email || {}) },
      sound: { ...DEFAULT_NOTIFICATION_SETTINGS.sound, ...(parsed.sound || {}) },
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

/**
 * Save notification preferences
 */
export function saveNotificationSettings(settings) {
  try {
    localStorage.setItem(NOTIFICATION_CONFIG_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save notification settings:', e);
    return false;
  }
}

/**
 * Format Order details for Telegram (HTML markup)
 */
function formatTelegramMessage(order) {
  const itemsText = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. <b>${item.name}</b>${item.selectedColor ? ` [${item.selectedColor}]` : ''} x${item.qty} — ₹${item.priceINR * item.qty}`)
    .join('\n');

  const customer = order.customer || {};
  const addressLine = [
    customer.streetAddress,
    customer.landmark ? `Near ${customer.landmark}` : null,
    `${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`
  ].filter(Boolean).join(', ');

  return `🎉 <b>NEW PREPAID ORDER RECEIVED!</b>

🆔 <b>Order ID:</b> <code>${order.orderId}</code>
💰 <b>Total Paid:</b> ₹${order.totalINR} (${order.totalItemCount || order.items?.length || 1} items)
🔢 <b>UPI UTR / Ref:</b> <code>${order.upiRefNumber || 'Verification Pending'}</code>
💳 <b>Method:</b> ${order.paymentMethod || 'Prepaid UPI QR'}

👤 <b>CUSTOMER DETAILS:</b>
• <b>Name:</b> ${customer.fullName || 'Valued Customer'}
• <b>Phone / WA:</b> +91 ${customer.phone || 'N/A'}
• <b>Address:</b> ${addressLine}
${order.filmOnReel ? `🎬 <b>Film on Reel:</b> Yes (${order.filmOnReel})\n` : ''}${order.additionalNotes ? `📝 <b>Note:</b> <i>${order.additionalNotes}</i>\n` : ''}
🛍️ <b>ITEMS ORDERED:</b>
${itemsText}

✨ <i>Order recorded in Admin Panel. Verify UPI and pack on Reels!</i>`;
}

/**
 * Format Order details for Email
 */
function formatEmailPayload(order, settings) {
  const customer = order.customer || {};
  const itemsText = (order.items || [])
    .map((item, idx) => `${idx + 1}. ${item.name} ${item.selectedColor ? `[Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
    .join('\n');

  const fullAddress = `${customer.fullName || ''}\nPhone: +91 ${customer.phone || ''}\n${customer.streetAddress || ''}\n${customer.landmark ? `Landmark: ${customer.landmark}\n` : ''}${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`;

  const message = `NEW PREPAID ORDER CONFIRMED!
----------------------------------------
Order ID: ${order.orderId}
Total Paid: ₹${order.totalINR}
Payment: 100% Prepaid UPI (UTR: ${order.upiRefNumber || 'N/A'})
Date: ${order.date || new Date().toLocaleString('en-IN')}

ITEMS:
${itemsText}

SHIPPING ADDRESS:
${fullAddress}

${order.filmOnReel ? `Film on IG Reel: Yes (${order.filmOnReel})\n` : ''}${order.additionalNotes ? `Customer Note: ${order.additionalNotes}\n` : ''}
----------------------------------------
Check live status in Scoop Storey Admin Panel!`;

  return {
    access_key: settings.email?.web3formsAccessKey || DEFAULT_NOTIFICATION_SETTINGS.email.web3formsAccessKey,
    subject: `🎀 New Order #${order.orderId} (₹${order.totalINR}) - ${customer.fullName || 'Customer'}`,
    from_name: 'Tanu - Scoop Storey',
    to_email: settings.email?.recipientEmail || 'scoopstorey@gmail.com',
    customer_name: customer.fullName || 'Customer',
    order_id: order.orderId,
    total_amount: `₹${order.totalINR}`,
    message: message
  };
}

/**
 * Send Telegram Notification
 */
export async function sendTelegramAlert(order, overrideSettings) {
  const settings = overrideSettings || getNotificationSettings();
  const { botToken, chatId, enabled } = settings.telegram;

  if (!enabled) return { success: false, reason: 'Telegram notifications disabled' };
  if (!botToken || !chatId) {
    return { success: false, reason: 'Bot Token or Chat ID missing' };
  }

  try {
    const text = formatTelegramMessage(order);
    const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await res.json();
    if (data.ok) {
      return { success: true };
    } else {
      console.warn('Telegram API error:', data);
      return { success: false, error: data.description };
    }
  } catch (err) {
    console.warn('Telegram send exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send Email Notification
 */
export async function sendEmailAlert(order, overrideSettings) {
  const settings = overrideSettings || getNotificationSettings();
  const { enabled, provider, formspreeUrl, customWebhookUrl } = settings.email;

  if (!enabled) return { success: false, reason: 'Email notifications disabled' };

  try {
    const payload = formatEmailPayload(order, settings);

    let targetUrl = 'https://api.web3forms.com/submit';
    if (provider === 'formspree' && formspreeUrl) {
      targetUrl = formspreeUrl.trim();
    } else if (provider === 'custom' && customWebhookUrl) {
      targetUrl = customWebhookUrl.trim();
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.message || 'Email delivery failed' };
    }
  } catch (err) {
    console.warn('Email send exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Broadcast New Order Event to open Admin Panel instances (Sound & Tab Chime)
 */
export function broadcastNewOrder(order) {
  try {
    // 1. Play sound directly if audio context is active
    const settings = getNotificationSettings();
    if (settings.sound.enabled) {
      soundFX.playCashRegister();
      if (settings.sound.vibrate && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    // 2. Broadcast to other tabs/windows via BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(ORDER_BROADCAST_CHANNEL);
      channel.postMessage({ type: 'NEW_ORDER', order });
      setTimeout(() => channel.close(), 1000);
    }

    // 3. Fallback via LocalStorage event
    localStorage.setItem('bhaskar_last_order_broadcast', JSON.stringify({
      orderId: order.orderId,
      time: Date.now()
    }));
  } catch (err) {
    console.warn('Order broadcast error:', err);
  }
}

/**
 * Master dispatcher triggered upon checkout completion
 */
export async function dispatchAllOrderNotifications(order) {
  if (!order) return;

  // 1. Broadcast locally for instant cash register chime in Admin Panel
  broadcastNewOrder(order);

  // 2. Dispatch Telegram Bot alert asynchronously
  const telegramPromise = sendTelegramAlert(order).catch(e => console.warn('Telegram alert failed:', e));

  // 3. Dispatch Email alert asynchronously
  const emailPromise = sendEmailAlert(order).catch(e => console.warn('Email alert failed:', e));

  // Allow them to run without blocking user UX
  return Promise.allSettled([telegramPromise, emailPromise]);
}

/**
 * Send Test Telegram Message
 */
export async function testTelegram(token, chatId) {
  const testOrder = {
    orderId: 'SS-TEST-' + Math.floor(1000 + Math.random() * 9000),
    totalINR: 499,
    totalItemCount: 1,
    paymentMethod: 'UPI QR Code (Test)',
    upiRefNumber: 'TEST99999999',
    customer: {
      fullName: 'Tanu (Store Owner Test)',
      phone: '8199922653',
      streetAddress: 'Scoop Storey Studio',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    items: [
      { name: 'Midi Mystery Scoop ✨', selectedColor: 'Pastel Kawaii', qty: 1, priceINR: 499 }
    ]
  };

  return sendTelegramAlert(testOrder, {
    telegram: { enabled: true, botToken: token, chatId: chatId }
  });
}

/**
 * Send Test Email
 */
export async function testEmail(recipientEmail, provider = 'web3forms', customUrl = '', accessKey = '') {
  const testOrder = {
    orderId: 'SS-TEST-' + Math.floor(1000 + Math.random() * 9000),
    totalINR: 499,
    totalItemCount: 1,
    paymentMethod: 'UPI QR Code (Test)',
    upiRefNumber: 'TEST88888888',
    customer: {
      fullName: 'Tanu (Store Owner Test)',
      phone: '8199922653',
      streetAddress: 'Scoop Storey Studio',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    items: [
      { name: 'Kawaii Mystery Charm Scoop', selectedColor: 'Gold Sparkle', qty: 1, priceINR: 499 }
    ]
  };

  return sendEmailAlert(testOrder, {
    email: {
      enabled: true,
      recipientEmail: recipientEmail,
      provider: provider,
      web3formsAccessKey: accessKey || DEFAULT_NOTIFICATION_SETTINGS.email.web3formsAccessKey,
      formspreeUrl: customUrl,
      customWebhookUrl: customUrl
    }
  });
}
