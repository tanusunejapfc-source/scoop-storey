import { useState, useEffect } from 'react';

const PAYMENT_SETTINGS_KEY = 'bhaskar_payment_settings_v1';
const PAYMENT_SETTINGS_EVENT = 'bhaskar_payment_settings_updated';

export const DEFAULT_PAYMENT_SETTINGS = {
  upiId: '8199922653@upi',
  upiPhone: '8199922653',
  payeeName: 'Bhaskar - Scoop Storey',
  qrImage: '', // Base64 data URL or external image URL uploaded by admin
  instructions: 'Scan QR with GPay / PhonePe / Paytm or pay using UPI ID / Phone. Then enter your 12-digit UPI Ref/UTR No. to confirm order!'
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
export function buildUpiUri({ upiId, payeeName, amount, orderId }) {
  const pa = upiId || DEFAULT_PAYMENT_SETTINGS.upiId;
  const pn = payeeName || DEFAULT_PAYMENT_SETTINGS.payeeName;
  const am = Number(amount || 0).toFixed(2);
  const tn = orderId ? `Order ${orderId}` : 'Scoop Storey Prepaid';

  return `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(am)}&cu=INR&tn=${encodeURIComponent(tn)}`;
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
