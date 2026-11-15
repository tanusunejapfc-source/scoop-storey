import { useState, useEffect } from 'react';

const PAYMENT_SETTINGS_KEY = 'bhaskar_payment_settings_v1';
const PAYMENT_SETTINGS_EVENT = 'bhaskar_payment_settings_updated';

export const DEFAULT_PAYMENT_SETTINGS = {
  upiId: '8199922653@upi',
  upiPhone: '8199922653',
  payeeName: 'Bhaskar - Scoop Storey',
  qrImage: '', // Base64 data URL or external image URL uploaded by admin
  instructions: 'Scan QR with GPay / PhonePe / Paytm or pay using UPI ID / Phone. Then enter your 12-digit UPI Ref/UTR No. to confirm order!',
  // Partial COD Settings
  partialCodEnabled: true,
  partialCodType: 'percentage', // 'percentage' | 'flat'
  partialCodPercentage: 20, // 10%, 15%, 20%, 25% or custom %
  partialCodFlatAmount: 99, // Flat advance ₹ amount
  partialCodFee: 0, // Extra courier collection charge (0 = Free)
  partialCodInstructions: 'Pay small advance via UPI to confirm booking; balance in Cash on delivery.'
};

export function getPaymentSettings() {
  try {
    const raw = localStorage.getItem(PAYMENT_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PAYMENT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Error reading payment settings from localStorage:', err);
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

export function savePaymentSettings(newSettings) {
  try {
    const merged = { ...getPaymentSettings(), ...newSettings };
    localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(PAYMENT_SETTINGS_EVENT, { detail: merged }));
    return merged;
  } catch (err) {
    console.error('Error saving payment settings to localStorage:', err);
    return newSettings;
  }
}

export function resetPaymentSettings() {
  try {
    localStorage.removeItem(PAYMENT_SETTINGS_KEY);
    window.dispatchEvent(new CustomEvent(PAYMENT_SETTINGS_EVENT, { detail: DEFAULT_PAYMENT_SETTINGS }));
  } catch (err) {
    console.error('Error resetting payment settings:', err);
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

export function usePaymentSettings() {
  const [settings, setSettings] = useState(getPaymentSettings);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setSettings(e.detail);
      } else {
        setSettings(getPaymentSettings());
      }
    };
    window.addEventListener(PAYMENT_SETTINGS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(PAYMENT_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateSettings = (partial) => {
    const saved = savePaymentSettings(partial);
    setSettings(saved);
  };

  const reset = () => {
    const res = resetPaymentSettings();
    setSettings(res);
  };

  return { settings, updateSettings, reset };
}

/**
 * Builds a standard UPI deep-link intent URI for opening mobile apps (GPay, PhonePe, Paytm, etc.)
 */
export function buildUpiUri(arg1, arg2, arg3) {
  let upiId, payeeName, amount, orderId;
  if (typeof arg1 === 'object' && arg1 !== null) {
    if ('amount' in arg1 || 'orderId' in arg1) {
      upiId = arg1.upiId;
      payeeName = arg1.payeeName;
      amount = arg1.amount;
      orderId = arg1.orderId;
    } else {
      upiId = arg1.upiId;
      payeeName = arg1.payeeName;
      amount = arg2;
      orderId = arg3;
    }
  } else {
    upiId = arg1;
    amount = arg2;
    orderId = arg3;
  }

  const pa = upiId || DEFAULT_PAYMENT_SETTINGS.upiId;
  const pn = payeeName || DEFAULT_PAYMENT_SETTINGS.payeeName;
  const am = Number(amount || 0).toFixed(2);
  const tn = orderId ? `Order ${orderId}` : 'Scoop Storey Prepaid';

  return `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(am)}&cu=INR&tn=${encodeURIComponent(tn)}`;
}

/**
 * Builds specific UPI app deep-links for PhonePe, Google Pay, Paytm, etc.
 * Supports fallback to generic upi:// intent.
 */
export function buildAppUpiUri(app, { upiId, payeeName, amount, orderId }) {
  const pa = upiId || DEFAULT_PAYMENT_SETTINGS.upiId;
  const pn = payeeName || DEFAULT_PAYMENT_SETTINGS.payeeName;
  const am = Number(amount || 0).toFixed(2);
  const tn = orderId ? `Order ${orderId}` : 'Scoop Storey';
  const query = `pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(am)}&cu=INR&tn=${encodeURIComponent(tn)}`;

  switch (app) {
    case 'phonepe':
      return `phonepe://pay?${query}`;
    case 'gpay':
      return `tez://upi/pay?${query}`;
    case 'paytm':
      return `paytmmp://pay?${query}`;
    case 'bhim':
      return `bhim://pay?${query}`;
    case 'generic':
    default:
      return `upi://pay?${query}`;
  }
}

/**
 * Calculates payment split between Immediate UPI Pay and Balance on Delivery (Partial COD)
 */
export function calculatePaymentBreakdown(totalINR, paymentMode = 'full_prepaid', settings = {}) {
  const mergedSettings = { ...DEFAULT_PAYMENT_SETTINGS, ...settings };
  const baseOrderTotal = Math.max(0, Number(totalINR || 0));

  if (paymentMode !== 'partial_cod' || !mergedSettings.partialCodEnabled) {
    return {
      paymentMode: 'full_prepaid',
      payNowINR: baseOrderTotal,
      balanceCodINR: 0,
      codFeeINR: 0,
      finalTotalINR: baseOrderTotal,
      advancePercentage: 100,
      isPartialCod: false
    };
  }

  const codFee = Math.max(0, Number(mergedSettings.partialCodFee || 0));
  const orderWithFee = baseOrderTotal + codFee;

  let advanceINR = 0;
  let advancePct = 0;

  if (mergedSettings.partialCodType === 'flat') {
    const flatVal = Number(mergedSettings.partialCodFlatAmount || 99);
    advanceINR = Math.min(orderWithFee, Math.max(1, flatVal));
    advancePct = orderWithFee > 0 ? Math.round((advanceINR / orderWithFee) * 100) : 0;
  } else {
    // Percentage mode
    const pct = Number(mergedSettings.partialCodPercentage || 20);
    advancePct = Math.min(90, Math.max(5, pct));
    advanceINR = Math.round((orderWithFee * advancePct) / 100);
  }

  const balanceINR = Math.max(0, orderWithFee - advanceINR);

  return {
    paymentMode: 'partial_cod',
    payNowINR: advanceINR,
    balanceCodINR: balanceINR,
    codFeeINR: codFee,
    finalTotalINR: orderWithFee,
    advancePercentage: advancePct,
    isPartialCod: true
  };
}

/**
 * Generates the QR image source to render:
 * 1. If admin uploaded their custom QR image, returns the uploaded image!
 * 2. Otherwise generates a dynamic UPI QR code containing the exact amount and payee details!
 */
export function getQrDisplayUrl(settings, amount = 0, orderId = '') {
  if (settings?.qrImage && settings.qrImage.trim()) {
    return settings.qrImage;
  }
  const upiUri = buildUpiUri({
    upiId: settings?.upiId,
    payeeName: settings?.payeeName,
    amount,
    orderId
  });
  return `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(upiUri)}&bgcolor=FFFFFF&color=231733&qzone=2`;
}

