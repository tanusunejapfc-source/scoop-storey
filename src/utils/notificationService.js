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
    recipientEmail: 'scoopstorey77@gmail.com', // Store owner alert inbox
    provider: 'web3forms', // 'web3forms' | 'formspree' | 'custom'
    web3formsAccessKey: 'a840e691-884c-4739-9d78-6878b30f81d1', // default public gateway key
    customerConfirmationEnabled: true, // Send confirmation receipt to customer
    resendApiKey: '', // Optional Resend API key for direct transactional receipts
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
${customer.email ? `• <b>Email:</b> ${customer.email}\n` : ''}• <b>Address:</b> ${addressLine}
${order.paymentScreenshot ? `📸 <b>Payment Proof:</b> <a href="${order.paymentScreenshot}">View Receipt</a>\n` : ''}${order.filmOnReel ? `🎬 <b>Film on Reel:</b> Yes (${order.filmOnReel})\n` : ''}${order.additionalNotes ? `📝 <b>Note:</b> <i>${order.additionalNotes}</i>\n` : ''}
🛍️ <b>ITEMS ORDERED:</b>
${itemsText}

✨ <i>Order recorded in Admin Panel. Verify UPI and pack on Reels!</i>`;
}

/**
 * Format Order details for Email Alert (Sent to Store Owner: scoopstorey77@gmail.com)
 */
function formatEmailPayload(order, settings) {
  const customer = order.customer || {};
  const itemsText = (order.items || [])
    .map((item, idx) => `${idx + 1}. ${item.name} ${item.selectedColor ? `[Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
    .join('\n');

  const fullAddress = `${customer.fullName || ''}\nPhone: +91 ${customer.phone || ''}\n${customer.email ? `Email: ${customer.email}\n` : ''}${customer.streetAddress || ''}\n${customer.landmark ? `Landmark: ${customer.landmark}\n` : ''}${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`;

  const message = `🎉 NEW PREPAID ORDER CONFIRMED!
----------------------------------------
Order ID: #${order.orderId}
Total Paid: ₹${order.totalINR}
Payment: ${order.paymentMethod || 'Prepaid UPI'} (UTR: ${order.upiRefNumber || 'Verification Pending'})
Date: ${order.date || new Date().toLocaleString('en-IN')}

🛍️ ITEMS ORDERED:
${itemsText}

📍 SHIPPING ADDRESS & CONTACT:
${fullAddress}

${order.paymentScreenshot ? `📸 PAYMENT SCREENSHOT / RECEIPT:\n${order.paymentScreenshot}\n` : ''}
${order.filmOnReel ? `🎬 Film on IG Reel: Yes (${order.filmOnReel})\n` : ''}
${order.additionalNotes ? `📝 Customer Note: ${order.additionalNotes}\n` : ''}
----------------------------------------
✨ Check and manage live orders in Scoop Storey Admin Panel!`;

  return {
    access_key: settings.email?.web3formsAccessKey || DEFAULT_NOTIFICATION_SETTINGS.email.web3formsAccessKey,
    subject: `🎀 New Order #${order.orderId} (₹${order.totalINR}) - ${customer.fullName || 'Customer'}`,
    from_name: 'Scoop Storey Store',
    to_email: settings.email?.recipientEmail || 'scoopstorey77@gmail.com',
    email: customer.email || settings.email?.recipientEmail || 'scoopstorey77@gmail.com', // sets reply-to
    reply_to: customer.email || undefined,
    customer_name: customer.fullName || 'Customer',
    customer_phone: customer.phone ? `+91 ${customer.phone}` : 'N/A',
    customer_email: customer.email || 'Not provided',
    order_id: order.orderId,
    total_amount: `₹${order.totalINR}`,
    payment_method: order.paymentMethod || 'Prepaid UPI',
    utr_number: order.upiRefNumber || 'N/A',
    payment_proof_link: order.paymentScreenshot || 'None attached',
    message: message
  };
}

/**
 * Format Customer Order Confirmation Email Receipt
 */
function formatCustomerReceiptPayload(order, settings) {
  const customer = order.customer || {};
  const itemsText = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. ${item.name}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} x${item.qty} — ₹${item.priceINR * item.qty}`)
    .join('\n');

  const fullAddress = `${customer.fullName || ''}\n${customer.streetAddress || ''}\n${customer.landmark ? `Near ${customer.landmark}\n` : ''}${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}\nPhone: +91 ${customer.phone || ''}`;

  const message = `✨ Hi ${customer.fullName || 'there'}! 🎀
Thank you for shopping with Scoop Storey! Your order has been placed successfully and our studio team has received your order details.

📦 ORDER RECEIPT:
----------------------------------------
Order ID: #${order.orderId}
Order Date: ${order.date || new Date().toLocaleString('en-IN')}
Total Paid: ₹${order.totalINR}
Payment: ${order.paymentMethod || 'Prepaid UPI'} (${order.upiRefNumber ? `UTR: ${order.upiRefNumber}` : 'Verified'})

🛍️ ITEMS IN YOUR PARCEL:
${itemsText}

📍 SHIPPING ADDRESS:
${fullAddress}

${order.filmOnReel ? `🎬 Packing Video: Requested for Instagram Reel (${order.filmOnReel})\n` : ''}
✨ WHAT TO EXPECT NEXT:
1. Packing: Your kawaii goodies are being handpicked, wrapped with cute stickers & gifts in our studio!
2. Dispatch & Tracking: You will receive a tracking link via WhatsApp/SMS once dispatched.
3. Delivery: Delivery usually takes 3 to 5 business days across India.

Need any help or wish to add items to your parcel?
• Chat with Tanu on WhatsApp: +91 8199922653
• Email: scoopstorey77@gmail.com
• Website: https://scoopstorey.com

With love & sparkle,
Tanu & The Scoop Storey Team 💖`;

  return {
    access_key: settings.email?.web3formsAccessKey || DEFAULT_NOTIFICATION_SETTINGS.email.web3formsAccessKey,
    subject: `🎀 Your Scoop Storey Order #${order.orderId} is Confirmed! ✨`,
    from_name: 'Scoop Storey 🎀',
    to_email: customer.email,
    email: customer.email,
    reply_to: settings.email?.recipientEmail || 'scoopstorey77@gmail.com',
    customer_name: customer.fullName || 'Customer',
    order_id: order.orderId,
    total_amount: `₹${order.totalINR}`,
    message: message
  };
}

/**
 * Send Customer Confirmation Email
 */
export async function sendCustomerConfirmationEmail(order, overrideSettings) {
  const settings = overrideSettings || getNotificationSettings();
  const customer = order.customer || {};
  const customerEmail = customer.email?.trim();

  if (!customerEmail) {
    return { success: false, reason: 'No customer email provided' };
  }

  if (settings.email?.customerConfirmationEnabled === false) {
    return { success: false, reason: 'Customer confirmation emails disabled' };
  }

  try {
    // 1. Direct Resend API (if configured by store owner)
    if (settings.email?.resendApiKey) {
      const itemsListHtml = (order.items || [])
        .map(item => `<tr style="border-bottom: 1px solid #fce7f3;"><td style="padding: 10px 0;"><strong>${item.name}</strong>${item.selectedColor ? `<br><span style="font-size: 11px; color: #ec4899;">Color: ${item.selectedColor}</span>` : ''}</td><td style="padding: 10px 0; text-align: center;">x${item.qty}</td><td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${item.priceINR * item.qty}</td></tr>`)
        .join('');

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.email.resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Scoop Storey <orders@scoopstorey.com>',
          to: [customerEmail],
          reply_to: settings.email?.recipientEmail || 'scoopstorey77@gmail.com',
          subject: `🎀 Your Scoop Storey Order #${order.orderId} is Confirmed! ✨`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #fff5f8; border-radius: 24px; padding: 32px; border: 1px solid #fbcfe8;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #e60067; font-size: 26px; margin: 0 0 8px;">Scoop Storey 🎀</h1>
                <p style="color: #831843; font-size: 14px; margin: 0;">Midi Mystery Scoops, Dainty Jewelry & Kawaii Lifestyle</p>
              </div>
              <div style="background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #fce7f3;">
                <h2 style="color: #1f2937; font-size: 18px; margin-top: 0;">Order Confirmed! 🎉</h2>
                <p style="color: #4b5563; font-size: 13px; line-height: 1.6;">Hi <strong>${customer.fullName || 'there'}</strong>, thank you for your order! We are packing your kawaii goodies with extra love in our studio.</p>
                <div style="background: #fdf2f8; border-radius: 12px; padding: 12px 16px; margin: 16px 0; font-size: 12px; color: #831843;">
                  <strong>Order ID:</strong> #${order.orderId}<br>
                  <strong>Total Paid:</strong> ₹${order.totalINR} (${order.paymentMethod || 'Prepaid UPI'})<br>
                  <strong>Date:</strong> ${order.date || new Date().toLocaleString('en-IN')}
                </div>
                <table style="width: 100%; font-size: 13px; color: #374151; border-collapse: collapse; margin-top: 16px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #fbcfe8; color: #9d174d; font-size: 11px; text-transform: uppercase;">
                      <th style="text-align: left; padding-bottom: 8px;">Item</th>
                      <th style="text-align: center; padding-bottom: 8px;">Qty</th>
                      <th style="text-align: right; padding-bottom: 8px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemsListHtml}</tbody>
                </table>
                <div style="margin-top: 20px; padding-top: 16px; border-top: 2px dashed #fbcfe8; font-size: 12px; color: #4b5563;">
                  <strong>📍 Shipping to:</strong><br>
                  ${customer.fullName || ''}<br>
                  ${customer.streetAddress || ''}<br>
                  ${customer.landmark ? `Near ${customer.landmark}<br>` : ''}
                  ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}<br>
                  Phone: +91 ${customer.phone || ''}
                </div>
              </div>
              <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af;">
                Need help? WhatsApp Tanu: <strong>+91 8199922653</strong> | Email: <strong>scoopstorey77@gmail.com</strong>
              </div>
            </div>
          `
        })
      });
      if (resendRes.ok) return { success: true, provider: 'resend' };
    }

    // 2. Web3Forms customer confirmation dispatch
    const payload = formatCustomerReceiptPayload(order, settings);
    const targetUrl = 'https://api.web3forms.com/submit';

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      return { success: true, provider: 'web3forms' };
    } else {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.message || 'Customer confirmation send failed' };
    }
  } catch (err) {
    console.warn('Customer confirmation email error:', err);
    return { success: false, error: err.message };
  }
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
 * Send Store Owner Email Notification (scoopstorey77@gmail.com)
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

  // 3. Dispatch Email alert to Store Owner (scoopstorey77@gmail.com)
  const emailPromise = sendEmailAlert(order).catch(e => console.warn('Store alert email failed:', e));

  // 4. Dispatch Customer confirmation receipt email (if customer provided email)
  const customerEmailPromise = order.customer?.email
    ? sendCustomerConfirmationEmail(order).catch(e => console.warn('Customer receipt email failed:', e))
    : Promise.resolve({ success: false, reason: 'No customer email' });

  // Allow them to run without blocking user UX
  return Promise.allSettled([telegramPromise, emailPromise, customerEmailPromise]);
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
      email: 'scoopstorey77@gmail.com',
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
 * Send Test Email to Store Owner
 */
export async function testEmail(recipientEmail = 'scoopstorey77@gmail.com', provider = 'web3forms', customUrl = '', accessKey = '') {
  const testOrder = {
    orderId: 'SS-TEST-' + Math.floor(1000 + Math.random() * 9000),
    totalINR: 499,
    totalItemCount: 1,
    paymentMethod: 'UPI QR Code (Test)',
    upiRefNumber: 'TEST88888888',
    customer: {
      fullName: 'Tanu (Store Owner Test)',
      phone: '8199922653',
      email: 'customer-test@example.com',
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
      recipientEmail: recipientEmail || 'scoopstorey77@gmail.com',
      provider: provider,
      web3formsAccessKey: accessKey || DEFAULT_NOTIFICATION_SETTINGS.email.web3formsAccessKey,
      formspreeUrl: customUrl,
      customWebhookUrl: customUrl
    }
  });
}

/**
 * Send Test Customer Receipt Email
 */
export async function testCustomerEmail(customerEmail, accessKey = '', resendApiKey = '') {
  const testOrder = {
    orderId: 'SS-TEST-' + Math.floor(1000 + Math.random() * 9000),
    totalINR: 499,
    totalItemCount: 1,
    date: new Date().toLocaleString('en-IN'),
    paymentMethod: 'Prepaid UPI QR (Test)',
    upiRefNumber: 'UTR-TEST88888',
    customer: {
      fullName: 'Ananya Sharma (Test Customer)',
      phone: '8199922653',
      email: customerEmail,
      streetAddress: 'Flat 302, Lotus Garden, Near City Center',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    items: [
      { name: 'Kawaii Mystery Charm Scoop ✨', selectedColor: 'Pastel Dreams', qty: 1, priceINR: 499 }
    ]
  };

  return sendCustomerConfirmationEmail(testOrder, {
    email: {
      enabled: true,
      customerConfirmationEnabled: true,
      recipientEmail: 'scoopstorey77@gmail.com',
      web3formsAccessKey: accessKey || DEFAULT_NOTIFICATION_SETTINGS.email.web3formsAccessKey,
      resendApiKey: resendApiKey || ''
    }
  });
}
