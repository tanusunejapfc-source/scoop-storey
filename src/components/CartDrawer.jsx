import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  Gift,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Building2,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileText,
  QrCode,
  Copy,
  Check,
  Upload,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Lock,
  Download,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';
import { lookupPincode } from '../utils/pincodeApi';
import { saveOrderToStore } from '../utils/orderStore';
import { dispatchAllOrderNotifications } from '../utils/notificationService';
import { trackCheckoutStarted, trackOrderCompleted } from '../utils/analyticsTelemetry';
import { usePaymentSettings, calculatePaymentBreakdown, getQrDisplayUrl } from '../utils/paymentStore';
import { DEFAULT_PRODUCTS } from '../utils/productStore';
import { CLOUD_DISCOUNTS_URL } from './admin/AdminDiscountsCMS';
import { uploadPaymentProofToSupabase } from '../utils/supabaseClient';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Delhi NCR', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  catalogProducts = []
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [filmOnReel, setFilmOnReel] = useState(false);
  const [userHandle, setUserHandle] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [orderCompleteData, setOrderCompleteData] = useState(null);

  // Curated affordable add-ons to help customers complete the 3-item minimum
  const bundleAddOns = React.useMemo(() => {
    const inCartIds = new Set(cartItems.map(it => it.id));
    const pool = (Array.isArray(catalogProducts) && catalogProducts.length > 0)
      ? catalogProducts
      : DEFAULT_PRODUCTS;
    return pool
      .filter(p => !p.isScoopTier && !inCartIds.has(p.id) && (p.priceINR || p.price) <= 250)
      .slice(0, 8);
  }, [catalogProducts, cartItems]);

  const handleQuickAddBundleItem = (prod) => {
    soundFX.playPop(650);
    soundFX.playChime();
    if (onAddToCart) {
      onAddToCart(prod);
    }
    if (totalItemCount + 1 >= minRequired) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      soundFX.playSuccess();
    }
  };

  // Payment Settings & Checkout Step
  const { settings: paymentSettings } = usePaymentSettings();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'address' | 'upi_payment'
  const [paymentMode, setPaymentMode] = useState('full_cod'); // 'full_cod' | 'full_prepaid' | 'partial_cod'
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [upiRefError, setUpiRefError] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Auto PIN Code detection states
  const [isDetectingPin, setIsDetectingPin] = useState(false);
  const [pinDetected, setPinDetected] = useState(false);
  const [pinStatusMsg, setPinStatusMsg] = useState('');

  // Delivery Address & Contact Details State (saved in localStorage for repeat customers)
  const [addressData, setAddressData] = useState(() => {
    try {
      const saved = localStorage.getItem('bhaskar_delivery_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          fullName: '',
          phone: '',
          email: '',
          streetAddress: '',
          landmark: '',
          city: '',
          state: 'Maharashtra',
          pincode: '',
          ...parsed
        };
      }
    } catch {
      // ignore
    }
    return {
      fullName: '',
      phone: '',
      email: '',
      streetAddress: '',
      landmark: '',
      city: '',
      state: 'Maharashtra',
      pincode: ''
    };
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const addressRef = useRef(null);
  const cartContentRef = useRef(null);

  // Authoritative price resolver protecting against client-side price tampering
  const getAuthoritativePrice = (itemId, fallbackPrice) => {
    if (!itemId) return Number(fallbackPrice || 0);
    const catalogItem = (Array.isArray(catalogProducts) && catalogProducts.find(p => p.id === itemId)) ||
                        DEFAULT_PRODUCTS.find(p => p.id === itemId);
    if (catalogItem && (catalogItem.priceINR || catalogItem.price)) {
      return Number(catalogItem.priceINR || catalogItem.price);
    }
    return Number(fallbackPrice || 0);
  };

  // Cart totals & calculations with authoritative prices
  const totalItemCount = cartItems.reduce((acc, item) => acc + Math.max(1, Math.min(20, Math.floor(Number(item.qty || 1)))), 0);
  const subtotalINR = cartItems.reduce((acc, item) => {
    const verifiedPrice = getAuthoritativePrice(item.id, item.priceINR);
    const verifiedQty = Math.max(1, Math.min(20, Math.floor(Number(item.qty || 1))));
    return acc + verifiedPrice * verifiedQty;
  }, 0);

  const discountAmountINR = useMemo(() => {
    if (appliedCoupon) {
      // Re-verify minimum spend condition
      if (appliedCoupon.minSpend && subtotalINR < Number(appliedCoupon.minSpend)) {
        return 0;
      }
      if (appliedCoupon.type === 'percent') {
        return Math.round(subtotalINR * (Number(appliedCoupon.value) / 100));
      }
      if (appliedCoupon.type === 'flat') {
        return Math.min(subtotalINR, Number(appliedCoupon.value) || 0);
      }
      return 0;
    }
    return Math.round(subtotalINR * appliedDiscount);
  }, [subtotalINR, appliedCoupon, appliedDiscount]);

  // Shipping Rules:
  // - FREE Shipping on all orders >= ₹499 net items total (or with free shipping coupon)
  // - Flat ₹49 Standard Delivery on orders below ₹499
  const FREE_SHIPPING_THRESHOLD = 499;
  const FLAT_SHIPPING_FEE = 49;
  const itemsNetINR = Math.max(0, subtotalINR - discountAmountINR);
  const isFreeShipping = totalItemCount > 0 && (itemsNetINR >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.type === 'shipping');
  const shippingINR = totalItemCount === 0 || isFreeShipping ? 0 : FLAT_SHIPPING_FEE;
  const totalINR = totalItemCount === 0 ? 0 : itemsNetINR + shippingINR;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - itemsNetINR);
  const shippingProgressPct = Math.min(100, Math.round((itemsNetINR / FREE_SHIPPING_THRESHOLD) * 100));

  // Partial COD & Payment Breakdown
  // Dedicated Partial COD preview (always calculated with 'partial_cod' mode)
  const partialCodPreview = useMemo(() => {
    return calculatePaymentBreakdown(totalINR, 'partial_cod', {
      ...paymentSettings,
      partialCodEnabled: true
    });
  }, [totalINR, paymentSettings]);

  // Active payment breakdown based on selected paymentMode
  const paymentBreakdown = useMemo(() => {
    return calculatePaymentBreakdown(totalINR, paymentMode, paymentSettings);
  }, [totalINR, paymentMode, paymentSettings]);

  // Order Eligibility: No minimum item restriction! Any cart with items can checkout.
  const hasItems = totalItemCount > 0;

  // If cart is emptied while on address or payment step, return to cart immediately
  useEffect(() => {
    if (checkoutStep !== 'cart' && !hasItems) {
      setCheckoutStep('cart');
    }
  }, [checkoutStep, hasItems]);

  // Sync latest merchant discount coupons from cloud storage
  useEffect(() => {
    if (isOpen) {
      fetch(`${CLOUD_DISCOUNTS_URL}?t=${Date.now()}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.coupons && Array.isArray(data.coupons)) {
            try {
              localStorage.setItem('bhaskar_store_coupons_v1', JSON.stringify(data.coupons));
            } catch {}
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Return to cart items smoothly and scroll to top
  const handleBackToCart = () => {
    soundFX.playPop(500);
    setCheckoutStep('cart');
    setTimeout(() => {
      cartContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 25);
  };

  // Return to address step smoothly and scroll to top
  const handleBackToAddress = () => {
    soundFX.playPop(500);
    setCheckoutStep('address');
    setTimeout(() => {
      cartContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 25);
  };

  if (!isOpen) return null;

  const handleAddressChange = (field, val) => {
    let cleanVal = val;
    if (field === 'phone') {
      cleanVal = val.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'pincode') {
      cleanVal = val.replace(/\D/g, '').slice(0, 6);
    }

    const updated = { ...addressData, [field]: cleanVal };
    setAddressData(updated);

    if (addressErrors[field]) {
      setAddressErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    try {
      localStorage.setItem('bhaskar_delivery_address', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Automatic PIN Code Lookup API (Auto-fills City & State)
  const handlePincodeChange = async (val) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    handleAddressChange('pincode', cleanPin);

    if (cleanPin.length === 6) {
      setIsDetectingPin(true);
      setPinStatusMsg('');
      try {
        const res = await lookupPincode(cleanPin);
        if (res.success && res.city) {
          const updated = {
            ...addressData,
            pincode: cleanPin,
            city: res.city,
            state: res.state
          };
          setAddressData(updated);
          try {
            localStorage.setItem('bhaskar_delivery_address', JSON.stringify(updated));
          } catch {
            // ignore
          }

          setPinDetected(true);
          setPinStatusMsg(`Auto-detected: ${res.city}, ${res.state} ✨`);
          soundFX.playPop(550);

          // Clear errors
          setAddressErrors(prev => {
            const next = { ...prev };
            delete next.pincode;
            delete next.city;
            delete next.state;
            return next;
          });
        } else {
          setPinDetected(false);
          setPinStatusMsg('Could not auto-detect. Please enter City & State.');
        }
      } catch (err) {
        console.warn('PIN Lookup Error:', err);
        setPinDetected(false);
      } finally {
        setIsDetectingPin(false);
      }
    } else {
      setPinDetected(false);
      setPinStatusMsg('');
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (!addressData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    const cleanPhone = addressData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = '10-digit mobile number is required';
    }
    if (!addressData.email || !addressData.email.trim()) {
      errors.email = 'Email address is required for order receipt & tracking updates';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(addressData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }
    if (!addressData.streetAddress.trim()) {
      errors.streetAddress = 'Flat / House No. and Street address are required';
    }
    const cleanPin = addressData.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = 'Valid 6-digit PIN code is required';
    }
    if (!addressData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!addressData.state.trim()) {
      errors.state = 'State is required';
    }
    return errors;
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    // 1. Check live merchant coupons configured in Admin Discounts CMS
    let storeCoupons = [];
    try {
      const saved = localStorage.getItem('bhaskar_store_coupons_v1');
      if (saved) storeCoupons = JSON.parse(saved);
    } catch {}

    const matched = storeCoupons.find(c => c.code === clean && c.active !== false);

    if (matched) {
      if (matched.minSpend && subtotalINR < matched.minSpend) {
        setPromoMessage(`⚠️ Min order of ₹${matched.minSpend} required for code ${matched.code}`);
        soundFX.playPop(350);
        return;
      }
      setAppliedCoupon(matched);
      if (matched.type === 'percent') {
        setAppliedDiscount(matched.value / 100);
        setPromoMessage(`✨ ${matched.value}% discount applied! (${matched.code})`);
      } else if (matched.type === 'flat') {
        setAppliedDiscount(0);
        setPromoMessage(`✨ ₹${matched.value} flat discount applied! (${matched.code})`);
      } else if (matched.type === 'shipping') {
        setPromoMessage(`✨ Free Express Priority Courier unlocked! (${matched.code})`);
      }
      soundFX.playSuccess();
      return;
    }

    // 2. Built-in promo codes fallback
    if (clean === 'SCOOP10') {
      setAppliedCoupon(null);
      setAppliedDiscount(0.10);
      setPromoMessage('✨ 10% discount applied!');
      soundFX.playSuccess();
    } else if (clean === 'HAPPINESS') {
      setAppliedCoupon(null);
      setAppliedDiscount(0.15);
      setPromoMessage('💖 15% VIP Happiness discount applied!');
      soundFX.playSuccess();
    } else if (clean === 'PINK10') {
      setAppliedCoupon(null);
      setAppliedDiscount(0.10);
      setPromoMessage('🌸 10% Pink Club discount applied!');
      soundFX.playSuccess();
    } else {
      setPromoMessage('❌ Invalid code. Try SCOOP10 or PINK10');
      soundFX.playPop(300);
    }
  };

  // Direct WhatsApp Checkout Link with Address & Order Details - REMOVED to prevent unpaid order confirmation bypass.
  // All orders must proceed through UPI QR Code payment first.

  // Navigate to Collections Hub
  const handleGoToCollections = () => {
    soundFX.playPop(500);
    onClose?.();
    window.location.hash = '#collections';
    setTimeout(() => {
      const menuEl = document.getElementById('menu') || document.getElementById('collections');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleCopyText = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    soundFX.playPop(500);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadQr = async () => {
    try {
      const qrUrl = getQrDisplayUrl(paymentSettings, paymentBreakdown.payNowINR, currentOrderId);
      if (qrUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = qrUrl;
        a.download = `ScoopStorey-QR-Rs${paymentBreakdown.payNowINR}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const res = await fetch(qrUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `ScoopStorey-QR-Rs${paymentBreakdown.payNowINR}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      }
      setQrDownloaded(true);
      soundFX.playPop(600);
      setTimeout(() => setQrDownloaded(false), 3500);
    } catch (err) {
      console.warn('QR download error:', err);
      window.open(getQrDisplayUrl(paymentSettings, paymentBreakdown.payNowINR, currentOrderId), '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareBagOnWhatsApp = () => {
    soundFX.playPop(520);
    if (!cartItems.length) return;
    const itemList = cartItems
      .map(item => `• ${item.name}${item.selectedColor ? ` (${item.selectedColor})` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');
    const storeUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://scoopstorey.com';
    const msg = `Hey! 💖 Here are the cute jewelry finds I saved in my cart on Scoop Storey:\n\n${itemList}\n\n💰 Total: ₹${totalINR} (${totalItemCount} items)\n✨ Look at them here: ${storeUrl}/\nWould make the dreamiest gift or surprise! 🎁✨`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // Transition to Delivery Address Step (Separated from bag view for clean, un-congested UX)
  const handleProceedToAddress = () => {
    if (!hasItems) {
      soundFX.playPop(300);
      alert('Your cart is empty! Please add some cute items to checkout.');
      return;
    }

    soundFX.playPop(600);
    setCheckoutStep('address');
    setAddressErrors({});
    setTimeout(() => {
      cartContentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }, 20);
  };

  // Transition to UPI & QR Payment Step
  const handleProceedToUpiPayment = () => {
    if (paymentMode === 'full_cod') {
      handleConfirmFullCodOrder();
      return;
    }

    if (!hasItems) {
      soundFX.playPop(300);
      alert('Your cart is empty! Please add some cute items to checkout.');
      setCheckoutStep('cart');
      return;
    }

    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      soundFX.playPop(300);
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    soundFX.playPop(700);
    soundFX.playChime();
    const newId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentOrderId(newId);
    trackCheckoutStarted(paymentBreakdown.finalTotalINR, totalItemCount);
    setCheckoutStep('upi_payment');
    setUpiRefError('');
    setTimeout(() => {
      cartContentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }, 20);
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          setPaymentScreenshot(compressed);
          soundFX.playPop(600);

          // Upload compressed image to Supabase Storage in background for permanent admin visibility
          canvas.toBlob(async (blob) => {
            if (!blob) return;
            setIsUploadingScreenshot(true);
            try {
              const cloudUrl = await uploadPaymentProofToSupabase(blob, currentOrderId || 'order');
              if (cloudUrl) {
                setPaymentScreenshot(cloudUrl);
              }
            } catch (err) {
              console.warn('Could not sync screenshot to cloud storage:', err);
            } finally {
              setIsUploadingScreenshot(false);
            }
          }, 'image/jpeg', 0.8);
        } catch {
          setPaymentScreenshot(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 1-Tap Quick Order on WhatsApp (Direct chat with Tanu)
  const handleQuickWhatsAppOrder = () => {
    if (!hasItems) {
      soundFX.playPop(300);
      alert('Your cart is empty! Please add some cute items to order.');
      return;
    }

    soundFX.playPop(700);
    soundFX.playChime();

    const orderItemsSummary = cartItems
      .map(item => `• ${item.name}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const msg = `Hi Scoop Storey! 🎀 Mujhe yeh cute goodies order karne hain:

🛍️ ITEMS IN BAG:
${orderItemsSummary}

${discountAmountINR > 0 ? `🏷️ Discount Applied: -₹${discountAmountINR}\n` : ''}🚚 Delivery: ${isFreeShipping ? 'FREE (Across India ✨)' : `₹${shippingINR}`}
💰 Total: ₹${totalINR} (${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'})

Maine bag me items select kar liye hain. Please delivery address & payment details share kar dijiye! ✨`;

    window.open(`https://wa.me/918199922653?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // 1-Tap Cash on Delivery Order Placement (Zero Advance Required!)
  const handleConfirmFullCodOrder = () => {
    if (!hasItems) {
      soundFX.playPop(300);
      alert('Your cart is empty! Please add some cute items to checkout.');
      setCheckoutStep('cart');
      return;
    }

    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      soundFX.playPop(300);
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    soundFX.playSuccess();
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FF3385', '#10B981']
    });

    const newId = currentOrderId || `SS-COD-${Math.floor(100000 + Math.random() * 900000)}`;
    const cleanItems = cartItems.map(item => ({
      id: item.id || '',
      name: item.name || 'Scoop Storey Item',
      priceINR: getAuthoritativePrice(item.id, item.priceINR),
      qty: Math.max(1, Math.min(20, Math.floor(Number(item.qty || 1)))),
      image: item.image || (Array.isArray(item.images) && item.images[0]) || '/images/deluxe-giftbox.webp',
      selectedColor: item.selectedColor || null,
      selectedColorHex: item.selectedColorHex || null
    }));

    const finalPayableOnDelivery = paymentBreakdown.finalTotalINR;

    const newOrder = {
      orderId: newId,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'Cash on Delivery',
      status: 'COD - Order Placed (Pending Dispatch)',
      paymentMethod: 'Cash on Delivery',
      isFullCod: true,
      isPartialCod: false,
      advancePaidINR: 0,
      balanceDueOnDeliveryINR: finalPayableOnDelivery,
      codFeeINR: paymentBreakdown.codFeeINR || 0,
      advancePercentage: 0,
      upiRefNumber: 'N/A (Cash on Delivery)',
      paymentScreenshot: null,
      customer: { ...addressData },
      items: cleanItems,
      totalItemCount,
      subtotalINR,
      discountAmountINR,
      shippingINR,
      totalINR: finalPayableOnDelivery,
      filmOnReel: filmOnReel ? (userHandle || '@customer') : null,
      additionalNotes: additionalNotes.trim() || null
    };

    saveOrderToStore(newOrder);
    trackOrderCompleted(newOrder);
    dispatchAllOrderNotifications(newOrder);

    onClearCart();
    setOrderCompleteData(newOrder);
    setCheckoutStep('cart');

    const orderItemsSummary = cleanItems
      .map(item => `• ${item.name}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const msg = `Hi Scoop Storey! 🎀 Maine Cash on Delivery (COD) order place kiya hai!

Order ID: ${newId}
📦 PAYMENT TYPE: 100% Cash on Delivery (₹0 Advance)
💵 Amount to Pay Courier on Delivery: ₹${finalPayableOnDelivery}
🚚 Delivery: ${isFreeShipping ? 'FREE (Orders ₹499+ ✨)' : `₹${shippingINR}`}

🛍️ ITEMS ORDERED:
${orderItemsSummary}
${filmOnReel ? `🎬 Film on IG Reel: Yes (@${userHandle || 'customer'})\n` : ''}${additionalNotes.trim() ? `📝 Notes: ${additionalNotes.trim()}\n` : ''}
📍 DELIVERY ADDRESS:
• Name: ${addressData.fullName}
• Mobile/WhatsApp: +91 ${addressData.phone}
${addressData.email ? `• Email: ${addressData.email.trim()}\n` : ''}• Address: ${addressData.streetAddress}
${addressData.landmark ? `• Landmark: ${addressData.landmark}\n` : ''}• City, State: ${addressData.city}, ${addressData.state}
• PIN Code: ${addressData.pincode}

Mera address verified hai. Please parcel pack karke dispatch kar dijiye! ✨`;

    window.open(`https://wa.me/918199922653?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // Place & Book Order with Address directly on WhatsApp
  const handleDirectAddressWhatsAppOrder = () => {
    if (!hasItems) {
      soundFX.playPop(300);
      alert('Your cart is empty! Please add some cute items to checkout.');
      return;
    }

    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      soundFX.playPop(300);
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    soundFX.playSuccess();
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FF3385']
    });

    const newId = currentOrderId || `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    const cleanItems = cartItems.map(item => ({
      id: item.id || '',
      name: item.name || 'Scoop Storey Item',
      priceINR: getAuthoritativePrice(item.id, item.priceINR),
      qty: Math.max(1, Math.min(20, Math.floor(Number(item.qty || 1)))),
      image: item.image || (Array.isArray(item.images) && item.images[0]) || '/images/deluxe-giftbox.webp',
      selectedColor: item.selectedColor || null,
      selectedColorHex: item.selectedColorHex || null
    }));

    const isPartialCod = Boolean(paymentBreakdown.isPartialCod);
    const newOrder = {
      orderId: newId,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'WhatsApp Order with Address',
      status: 'WhatsApp Verification Pending',
      paymentMethod: isPartialCod ? 'Partial COD (WhatsApp)' : 'WhatsApp Direct',
      isPartialCod,
      advancePaidINR: paymentBreakdown.payNowINR,
      balanceDueOnDeliveryINR: paymentBreakdown.balanceCodINR,
      codFeeINR: paymentBreakdown.codFeeINR,
      advancePercentage: paymentBreakdown.advancePercentage,
      upiRefNumber: 'WhatsApp Verified',
      paymentScreenshot: null,
      customer: { ...addressData },
      items: cleanItems,
      totalItemCount,
      subtotalINR,
      discountAmountINR,
      shippingINR,
      totalINR: paymentBreakdown.finalTotalINR,
      filmOnReel: filmOnReel ? (userHandle || '@customer') : null,
      additionalNotes: additionalNotes.trim() || null
    };

    saveOrderToStore(newOrder);
    trackOrderCompleted(newOrder);
    dispatchAllOrderNotifications(newOrder);

    onClearCart();
    setOrderCompleteData(newOrder);
    setCheckoutStep('cart');

    const orderItemsSummary = cleanItems
      .map(item => `• ${item.name}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const msg = `Hi Scoop Storey! 🎀 Mera Order book kar dijiye!

Order ID: ${newId}
💰 Total: ₹${paymentBreakdown.finalTotalINR} (${totalItemCount} items)
🚚 Delivery: ${isFreeShipping ? 'FREE (Across India ✨)' : `₹${shippingINR}`}

🛍️ ITEMS ORDERED:
${orderItemsSummary}
${filmOnReel ? `🎬 Film on IG Reel: Yes (@${userHandle || 'my_account'})\n` : ''}${additionalNotes.trim() ? `📝 Notes: ${additionalNotes.trim()}\n` : ''}
📍 DELIVERY ADDRESS:
• Name: ${addressData.fullName}
• Mobile/WhatsApp: +91 ${addressData.phone}
${addressData.email ? `• Email: ${addressData.email.trim()}\n` : ''}• Address: ${addressData.streetAddress}
${addressData.landmark ? `• Landmark: ${addressData.landmark}\n` : ''}• City, State: ${addressData.city}, ${addressData.state}
• PIN Code: ${addressData.pincode}

Maine delivery details enter kar di hain. Please payment method confirm karke parcel pack kar dijiye! ✨`;

    window.open(`https://wa.me/918199922653?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // Final Order Confirmation (Screenshot is OPTIONAL - customer can provide on WhatsApp)
  const handleConfirmUpiOrder = () => {
    soundFX.playSuccess();
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FF3385']
    });

    const hasScreenshot = Boolean(paymentScreenshot);
    const utrDisplay = hasScreenshot ? 'Screenshot Attached' : 'Proof on WhatsApp';

    const cleanItems = cartItems.map(item => {
      const verifiedPrice = getAuthoritativePrice(item.id, item.priceINR);
      const verifiedQty = Math.max(1, Math.min(20, Math.floor(Number(item.qty || 1))));
      return {
        id: item.id || '',
        name: item.name || 'Scoop Storey Item',
        priceINR: verifiedPrice,
        qty: verifiedQty,
        image: item.image || (Array.isArray(item.images) && item.images[0]) || '/images/deluxe-giftbox.webp',
        selectedColor: item.selectedColor || null,
        selectedColorHex: item.selectedColorHex || null
      };
    });

    const isFullCod = Boolean(paymentBreakdown.isFullCod);
    const isPartialCod = Boolean(paymentBreakdown.isPartialCod);
    const newOrder = {
      orderId: currentOrderId,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: isFullCod ? 'Cash on Delivery' : isPartialCod ? 'Partial COD' : 'Prepaid UPI / QR Code',
      status: isFullCod
        ? 'COD - Order Placed (Pending Dispatch)'
        : hasScreenshot
        ? (isPartialCod ? 'Partial COD - Advance Paid (Screenshot Attached)' : 'Payment Received (Screenshot Attached)')
        : (isPartialCod ? 'Partial COD - Advance Verification Pending' : 'UPI - Pending WhatsApp Verification'),
      paymentMethod: isFullCod ? 'Cash on Delivery' : isPartialCod ? 'Partial COD' : 'UPI QR Code',
      isFullCod,
      isPartialCod,
      advancePaidINR: isFullCod ? 0 : paymentBreakdown.payNowINR,
      balanceDueOnDeliveryINR: isFullCod ? paymentBreakdown.finalTotalINR : paymentBreakdown.balanceCodINR,
      codFeeINR: paymentBreakdown.codFeeINR,
      advancePercentage: isFullCod ? 0 : paymentBreakdown.advancePercentage,
      upiRefNumber: isFullCod ? 'N/A (Cash on Delivery)' : utrDisplay,
      paymentScreenshot: isFullCod ? null : (paymentScreenshot || null),
      customer: { 
        ...addressData,
        paymentScreenshot: isFullCod ? null : (paymentScreenshot || null)
      },
      items: cleanItems,
      totalItemCount,
      subtotalINR,
      discountAmountINR,
      shippingINR,
      totalINR: paymentBreakdown.finalTotalINR,
      filmOnReel: filmOnReel ? (userHandle || '@customer') : null,
      additionalNotes: additionalNotes.trim() || null
    };

    // 1. Save to persistent order store & Supabase immediately (Captures all customer details!)
    saveOrderToStore(newOrder);
    trackOrderCompleted(newOrder);
    dispatchAllOrderNotifications(newOrder);

    // 2. Clear cart
    onClearCart();

    // 3. Set order complete modal data
    setOrderCompleteData(newOrder);
    setCheckoutStep('cart');

    // 4. Send on WhatsApp
    const orderItemsSummary = cleanItems
      .map(item => `• ${item.name}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const paymentSummaryText = isFullCod
      ? `📦 PAYMENT TYPE: 100% Cash on Delivery (₹0 Advance)
💵 Amount to Pay Courier on Delivery: ₹${paymentBreakdown.finalTotalINR}
🚚 Delivery: ${isFreeShipping ? 'FREE (Orders ₹499+)' : `₹${shippingINR}`}
💰 Total Order Value: ₹${paymentBreakdown.finalTotalINR}`
      : isPartialCod
      ? `📦 PAYMENT TYPE: Partial COD (Advance Booking)
✅ Advance to Pay: ₹${paymentBreakdown.payNowINR} (${paymentBreakdown.advancePercentage}% Advance)
💵 Balance to Collect in Cash on Delivery: ₹${paymentBreakdown.balanceCodINR}
🚚 Delivery: ${isFreeShipping ? 'FREE (Orders ₹499+)' : `₹${shippingINR}`}
💰 Total Order Value: ₹${paymentBreakdown.finalTotalINR}`
      : `📦 PAYMENT TYPE: 100% Prepaid UPI
🚚 Delivery: ${isFreeShipping ? 'FREE (Orders ₹499+)' : `₹${shippingINR}`}
💰 Total Paid: ₹${totalINR} (${totalItemCount} items)`;

    const proofSummaryText = isFullCod
      ? '📦 Cash Payment: Full amount to be paid in cash to delivery agent'
      : hasScreenshot
      ? '📸 Payment Proof: Attached via Screenshot in Web App'
      : '📸 Payment Proof: Main screenshot abhi WhatsApp pe bhej raha/rahi hu ✨';

    const closingUserMsg = isFullCod
      ? `Maine Cash on Delivery order confirm kiya hai. Courier aane par ₹${paymentBreakdown.finalTotalINR} cash dungi. Please verify karke parcel pack kar dijiye! ✨`
      : hasScreenshot
      ? (isPartialCod 
          ? `Maine ₹${paymentBreakdown.payNowINR} advance UPI se pay kar diya hai aur screenshot attach kar diya hai. Remaining ₹${paymentBreakdown.balanceCodINR} cash delivery ke time dunga/dungi. Please verify karke parcel dispatch kar dijiye! ✨`
          : `Maine UPI payment successfully transfer kar diya hai aur screenshot attach kar diya hai. Please verify karke packing start kar dijiye! ✨`)
      : (isPartialCod
          ? `Mera order book kar dijiye! Main ₹${paymentBreakdown.payNowINR} advance UPI screenshot yaha chat me bhej raha/rahi hu. Remaining ₹${paymentBreakdown.balanceCodINR} delivery ke time cash dungi! ✨`
          : `Mera order book kar dijiye! Main payment transfer karke uska screenshot yaha chat me bhej raha/rahi hu. Please verify karke packing start kar dijiye! ✨`);

    const msg = `Hi Scoop Storey! 🎀 Mera Order confirm ho gaya hai!

Order ID: ${currentOrderId}
${paymentSummaryText}
${proofSummaryText}
🛍️ ITEMS ORDERED:
${orderItemsSummary}
${filmOnReel ? `🎬 Film on IG Reel: Yes (@${userHandle || 'my_account'})\n` : ''}${additionalNotes.trim() ? `📝 Additional Notes: ${additionalNotes.trim()}\n` : ''}
📍 DELIVERY ADDRESS & CONTACT:
• Name: ${addressData.fullName}
• Mobile/WhatsApp: +91 ${addressData.phone}
${addressData.email ? `• Email: ${addressData.email.trim()}\n` : ''}• Address: ${addressData.streetAddress}
${addressData.landmark ? `• Landmark: ${addressData.landmark}\n` : ''}• City, State: ${addressData.city}, ${addressData.state}
• PIN Code: ${addressData.pincode}

${closingUserMsg}`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/918199922653?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const isAddressFilled = Boolean(
    addressData.fullName.trim() &&
    addressData.phone.replace(/\D/g, '').length === 10 &&
    addressData.email && addressData.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressData.email.trim()) &&
    addressData.streetAddress.trim() &&
    addressData.city.trim() &&
    addressData.state.trim() &&
    addressData.pincode.replace(/\D/g, '').length === 6
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-8">
        <div className="w-full sm:w-[425px] max-w-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-pink-200/60 dark:border-pink-900/40 relative">

          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between bg-gradient-to-r from-pink-50/70 via-white to-pink-50/40 dark:from-[#231733] dark:to-[#1A1326] sticky top-0 z-30 shadow-xs">
            {checkoutStep === 'upi_payment' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToAddress}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/80 dark:hover:bg-pink-900 text-[#B81D24] dark:text-pink-300 font-display font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                  title="Return to Address Details"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hidden xs:inline">
                  Step 3: Pay QR
                </span>
              </div>
            ) : checkoutStep === 'address' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/80 dark:hover:bg-pink-900 text-[#B81D24] dark:text-pink-300 font-display font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                  title="Return to Cart to add/remove items"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Bag</span>
                </button>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hidden xs:inline">
                  Step 2: Delivery Details
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-md">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                    Your Scoop Bag
                  </h3>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {totalItemCount} item(s) selected
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {checkoutStep !== 'cart' && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ₹{paymentMode === 'partial_cod' ? paymentBreakdown.payNowINR : totalINR}
                </span>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-pink-50 dark:bg-neutral-800 hover:bg-pink-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:text-neutral-300 transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Shipping Header Banner */}
          {isFreeShipping ? (
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 via-pink-50/60 to-emerald-50 dark:from-emerald-950/40 dark:via-[#261835] dark:to-emerald-950/40 border-b border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>🎉 Yay! You Unlocked FREE Delivery Across India! ✨</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                FREE
              </span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-gradient-to-r from-pink-50 via-purple-50/60 to-pink-50 dark:from-pink-950/40 dark:via-[#261835] dark:to-purple-950/40 border-b border-pink-200/60 dark:border-pink-900/40 flex items-center justify-between text-xs font-bold text-pink-800 dark:text-pink-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>🚚 FREE Delivery on orders ₹499+ (Only ₹49 below)</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-200">
                ₹499 FREE
              </span>
            </div>
          )}

          {/* Cart Items List & Checkout Form (Scrollable) */}
          <div ref={cartContentRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-neutral-800 flex items-center justify-center text-2xl mb-3">
                  🧸
                </div>
                <h4 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-200">
                  Your scoop bag is empty
                </h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Pick pendants, charm bracelets, eye masks, or take a 3D mystery scoop to collect happiness!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    window.location.hash = '';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-4 btn-3d-pink text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  Explore Scoop Menu
                </button>
              </div>
            ) : checkoutStep === 'upi_payment' ? (
              <div className="space-y-4 animate-fadeIn">
                {/* PROMINENT TOP BACK TO EDIT BANNER CARD */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-[#251A38] dark:via-[#2A1E40] dark:to-[#251A38] border-2 border-pink-200 dark:border-pink-900/60 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-[#B81D24] dark:text-pink-300 font-bold shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Need to change address or items?
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {totalItemCount} item(s) in bag • You can edit anytime
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleBackToAddress}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-pink-50 dark:hover:bg-neutral-700 text-[#B81D24] dark:text-pink-300 font-display font-extrabold text-xs shadow-xs border border-pink-200 dark:border-pink-800 cursor-pointer flex items-center gap-1 active:scale-95 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Address</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBackToCart}
                      className="px-2 py-1.5 rounded-xl bg-pink-50 dark:bg-neutral-700 hover:bg-pink-100 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-display font-extrabold text-xs shadow-xs border border-pink-200 dark:border-pink-700 cursor-pointer flex items-center gap-1 active:scale-95 transition"
                    >
                      <span>Bag</span>
                    </button>
                  </div>
                </div>

                {/* PAYMENT OPTION SELECTOR (100% PREPAID vs PARTIAL COD) */}
                {paymentSettings.partialCodEnabled && (
                  <div className="p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/90 border border-pink-200 dark:border-neutral-700 grid grid-cols-2 gap-2">
                    {/* Option 1: Full Prepaid */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMode('full_prepaid');
                        soundFX.playPop(550);
                      }}
                      className={`p-3 rounded-xl text-left transition relative cursor-pointer flex flex-col justify-between ${paymentMode === 'full_prepaid'
                          ? 'bg-white dark:bg-neutral-900 shadow-md border-2 border-[#B81D24] dark:border-pink-500 text-neutral-900 dark:text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent'
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-display font-extrabold text-xs text-[#B81D24] dark:text-pink-400 flex items-center gap-1">
                            <span>⚡ 100% Prepaid</span>
                          </span>
                          {paymentMode === 'full_prepaid' && (
                            <div className="w-4 h-4 rounded-full bg-[#B81D24] text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <div className="font-display font-black text-sm mt-1 text-neutral-900 dark:text-white">
                          ₹{totalINR}
                        </div>
                      </div>
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold mt-1 block">
                        🎁 Free Mystery Charm
                      </span>
                    </button>

                    {/* Option 2: Partial COD */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMode('partial_cod');
                        soundFX.playPop(550);
                      }}
                      className={`p-3 rounded-xl text-left transition relative cursor-pointer flex flex-col justify-between ${paymentMode === 'partial_cod'
                          ? 'bg-white dark:bg-neutral-900 shadow-md border-2 border-purple-600 dark:border-purple-400 text-neutral-900 dark:text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent'
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-display font-extrabold text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <span>📦 Partial COD</span>
                          </span>
                          {paymentMode === 'partial_cod' && (
                            <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <div className="font-display font-black text-sm mt-1 text-purple-700 dark:text-purple-300">
                          ₹{partialCodPreview.payNowINR} <span className="text-[10px] font-normal text-neutral-500">now ({partialCodPreview.advancePercentage}%)</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1 block">
                        🚚 ₹{partialCodPreview.balanceCodINR} on Delivery
                      </span>
                    </button>
                  </div>
                )}

                {/* Amount to Pay Banner */}
                {paymentBreakdown.isPartialCod ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-300 dark:border-purple-800 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                          Pay Advance Now via UPI ({paymentBreakdown.advancePercentage}%)
                        </span>
                        <span className="font-display font-black text-2xl text-purple-700 dark:text-purple-400">
                          ₹{paymentBreakdown.payNowINR}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                          Partial COD Active 📦
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400 block mt-1">
                          {currentOrderId}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <span>🚚 Cash Due to Courier at Doorstep:</span>
                      </span>
                      <strong className="font-display font-black text-sm text-purple-900 dark:text-purple-200">
                        ₹{paymentBreakdown.balanceCodINR}
                      </strong>
                    </div>

                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                      Total Order Value: <strong>₹{paymentBreakdown.finalTotalINR}</strong> ({isFreeShipping ? '100% Free Shipping' : `Includes ₹${shippingINR} Shipping`})
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-800 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Total Amount to Pay</span>
                      <span className="font-display font-extrabold text-2xl text-pink-600 dark:text-pink-400">
                        ₹{totalINR}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">
                        {isFreeShipping ? '100% Free Express Delivery • Instant Dispatch Priority ⚡' : `Standard Delivery: ₹${shippingINR} (Free above ₹499)`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        100% Secure UPI
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 block mt-1">
                        {currentOrderId}
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 1: SCAN OR 1-CLICK PAY VIA UPI APPS */}
                <div className="p-4 rounded-2xl glass-panel border border-pink-200 dark:border-neutral-700 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                        {paymentBreakdown.isPartialCod ? `Pay ₹${paymentBreakdown.payNowINR} Advance via Scanner, UPI ID, or Number` : 'Scan QR Code or Pay via UPI ID / Number'}
                      </h4>
                    </div>
                    {(paymentSettings.qrImage || paymentSettings.customQrImage) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        Official Store QR
                      </span>
                    )}
                  </div>

                  {/* QR Image Container (Scanner Option) */}
                  <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-neutral-800 rounded-2xl border-2 border-dashed border-pink-300 dark:border-pink-700 shadow-inner">
                    <div className="text-center mb-2.5">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                        📸 Option 1: Scan QR Code with any UPI App
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        Open Google Pay, PhonePe, Paytm, or BHIM & scan directly
                      </span>
                    </div>

                    <div className="relative group">
                      <img
                        src={getQrDisplayUrl(paymentSettings, paymentBreakdown.payNowINR, currentOrderId)}
                        alt="Scoop Storey UPI Payment QR Code"
                        className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl shadow-md bg-white p-2"
                      />
                      <div className="absolute inset-x-0 bottom-1 text-center">
                        <span className="text-[10px] font-bold bg-neutral-900/80 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          ₹{paymentBreakdown.payNowINR}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mt-2.5 text-center">
                      Pay to: <strong className="text-neutral-900 dark:text-white">{paymentSettings.payeeName}</strong>
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] font-bold text-neutral-400">
                      <span>PhonePe</span> • <span>GPay</span> • <span>Paytm</span> • <span>BHIM</span> • <span>CRED</span>
                    </div>

                    {/* 1-Tap Save QR to Gallery Button */}
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="mt-3 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-95 w-full"
                    >
                      {qrDownloaded ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>QR Saved to Gallery! Open any app to scan ✨</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Save QR to Gallery / Photos</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Copy UPI ID & Phone */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      <span>💳 Option 2: Pay via UPI ID or Mobile Number</span>
                      <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold">Tap Copy to pay in any app</span>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          UPI ID / VPA
                        </span>
                        <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white truncate block">
                          {paymentSettings.upiId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(paymentSettings.upiId, 'upiId')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${copiedField === 'upiId'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-neutral-700 dark:text-white'
                          }`}
                      >
                        {copiedField === 'upiId' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Copy UPI Phone Number */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          UPI Mobile / Phone Number
                        </span>
                        <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white truncate block">
                          +91 {paymentSettings.upiPhone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(paymentSettings.upiPhone, 'upiPhone')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${copiedField === 'upiPhone'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-neutral-700 dark:text-white'
                          }`}
                      >
                        {copiedField === 'upiPhone' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Copy Amount */}
                    <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-200 dark:border-neutral-700 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 block">
                          {paymentBreakdown.isPartialCod ? 'Advance Booking Amount' : 'Exact Amount to Pay'}
                        </span>
                        <span className="font-mono font-black text-xs text-neutral-900 dark:text-white truncate block">
                          ₹{paymentBreakdown.payNowINR}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(String(paymentBreakdown.payNowINR), 'amount')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${copiedField === 'amount'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-neutral-700 dark:text-white'
                          }`}
                      >
                        {copiedField === 'amount' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Amount</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {(paymentSettings.instructions || paymentSettings.customNote) && (
                    <p className="text-[11px] text-pink-600 dark:text-pink-400 font-medium italic bg-pink-50 dark:bg-pink-950/30 p-2 rounded-lg">
                      💡 Note: {paymentSettings.instructions || paymentSettings.customNote}
                    </p>
                  )}
                </div>

                {/* STEP 2: SUBMIT PAYMENT PROOF */}
                <div className="p-4 rounded-2xl glass-panel border border-pink-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>Payment Screenshot</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          Optional • Send on WhatsApp
                        </span>
                      </h4>
                      <p className="text-[10px] text-neutral-500">
                        Upload here or share payment screenshot directly on WhatsApp after booking!
                      </p>
                    </div>
                  </div>

                  {/* Screenshot Upload (Optional) */}
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between mb-1">
                      <span>Payment Screenshot</span>
                      <span className="text-[10px] font-semibold text-neutral-400">(Optional)</span>
                    </label>
                    {paymentScreenshot ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 p-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={paymentScreenshot}
                            alt="Payment Proof"
                            onError={() => setPaymentScreenshot(null)}
                            className="w-12 h-12 object-cover rounded-lg border border-black/10 shadow-xs shrink-0"
                          />
                          <div>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                              {isUploadingScreenshot ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-600" />
                                  <span>Syncing screenshot to cloud... ☁️</span>
                                </>
                              ) : (
                                <span>Screenshot attached! ✨</span>
                              )}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                              {isUploadingScreenshot ? 'Optimizing receipt proof for Tanu' : 'Payment proof saved & ready for Admin verification'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentScreenshot(null);
                            soundFX.playPop(400);
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                        >
                          Change / Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition cursor-pointer text-center ${
                          upiRefError
                            ? 'border-rose-400 bg-rose-50/50 dark:border-rose-700'
                            : 'border-pink-300 dark:border-neutral-700 hover:border-[#B81D24] bg-pink-50/40 dark:bg-neutral-800/40'
                        }`}>
                          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950/60 text-[#B81D24] flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                              Tap to upload screenshot (Optional)
                            </span>
                            <span className="text-[10px] text-neutral-400 mt-0.5 block">
                              You can upload here, or share your payment screenshot directly on WhatsApp after booking!
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleScreenshotUpload}
                          />
                        </label>
                        {upiRefError && (
                          <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{upiRefError}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Order Confirmation Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmUpiOrder}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {paymentScreenshot
                        ? 'Confirm Order & Send on WhatsApp (Proof Attached 📸)'
                        : 'Confirm & Book Order (Verify on WhatsApp 💬)'}
                    </span>
                  </button>
                  <p className="text-center text-[10px] text-neutral-400 mt-1.5">
                    ✨ Your details and items will be instantly booked and saved!
                  </p>
                </div>
              </div>
            ) : checkoutStep === 'address' ? (
              <div className="space-y-4 animate-fadeIn">
                {/* ORDER RECAP CHIP */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-[#251A38] dark:via-[#2A1E40] dark:to-[#251A38] border border-pink-200 dark:border-pink-900/60 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-[#B81D24] dark:text-pink-300 font-bold shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {totalItemCount} item{totalItemCount > 1 ? 's' : ''} in Bag
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {paymentMode === 'partial_cod'
                          ? `Partial Payment • ₹${paymentBreakdown.payNowINR} Advance`
                          : `100% Prepaid • ₹${totalINR} Total`}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-pink-50 dark:hover:bg-neutral-700 text-[#B81D24] dark:text-pink-300 font-display font-extrabold text-[11px] shadow-xs border border-pink-200 dark:border-pink-800 shrink-0 cursor-pointer flex items-center gap-1 active:scale-95 transition"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Edit Bag</span>
                  </button>
                </div>

                {/* ADDRESS & CONTACT DETAILS FORM */}
                <div
                  ref={addressRef}
                  className={`p-4 rounded-2xl transition-all border ${Object.keys(addressErrors).length > 0
                      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 ring-2 ring-rose-400/30'
                      : 'bg-gradient-to-br from-pink-50/70 via-purple-50/40 to-pink-50/70 dark:from-neutral-800/80 dark:to-neutral-800/40 border-pink-200/80 dark:border-pink-900/50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-pink-500 text-white shadow-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                          Delivery Address & Contact
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Where should we dispatch your Kawaii order?
                        </p>
                      </div>
                    </div>
                    {isAddressFilled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Saved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-100/80 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* Full Name & Phone in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Customer Full Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Full Name <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={addressData.fullName}
                            onChange={(e) => handleAddressChange('fullName', e.target.value)}
                            placeholder="e.g. Ananya Sharma"
                            className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${addressErrors.fullName
                                ? 'border-rose-400 focus:ring-rose-400'
                                : 'border-pink-200 dark:border-neutral-700 focus:ring-pink-400'
                              }`}
                          />
                        </div>
                        {addressErrors.fullName && (
                          <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                            {addressErrors.fullName}
                          </span>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          <Phone className="w-3 h-3 text-pink-500" />
                          <span>WhatsApp / Phone</span>
                          <span className="text-pink-500">*</span>
                        </label>
                        <div className="flex rounded-xl overflow-hidden border transition bg-white dark:bg-neutral-900 focus-within:ring-1 focus-within:ring-pink-400">
                          <span className="px-2 py-2 bg-pink-100/70 dark:bg-neutral-800 text-[11px] font-bold text-neutral-600 dark:text-neutral-300 border-r border-pink-200 dark:border-neutral-700 flex items-center shrink-0">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={addressData.phone}
                            onChange={(e) => handleAddressChange('phone', e.target.value)}
                            placeholder="10-digit number"
                            className={`w-full px-2.5 py-2 text-xs bg-transparent focus:outline-none ${addressErrors.phone ? 'border-rose-400' : ''
                              }`}
                          />
                        </div>
                        {addressErrors.phone && (
                          <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                            {addressErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Email Address (For Order Updates & Auto-Receipt) */}
                    <div>
                      <label className="flex items-center justify-between text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-pink-500" />
                          <span>Email Address</span>
                          <span className="text-pink-500">*</span>
                          <span className="text-[10px] font-medium text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-1.5 py-0.5 rounded-md ml-1">For Order Receipt</span>
                        </span>
                        <span className="text-[10px] text-pink-500 font-semibold">Required</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={addressData.email || ''}
                          onChange={(e) => handleAddressChange('email', e.target.value)}
                          placeholder="e.g. ananya@gmail.com"
                          className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${
                            addressErrors.email
                              ? 'border-rose-400 focus:ring-rose-400'
                              : 'border-pink-200 dark:border-neutral-700 focus:ring-pink-400'
                          }`}
                        />
                      </div>
                      {addressErrors.email ? (
                        <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                          {addressErrors.email}
                        </span>
                      ) : (
                        <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 mt-0.5 block">
                          💌 Order confirmation receipt & parcel tracking link will be sent here
                        </span>
                      )}
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        House/Flat No., Building, Street, Area <span className="text-pink-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
                        <textarea
                          rows={2}
                          value={addressData.streetAddress}
                          onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                          placeholder="e.g. Flat 302, Lotus Garden, Near City Center"
                          className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition resize-none focus:outline-none focus:ring-1 ${addressErrors.streetAddress
                              ? 'border-rose-400 focus:ring-rose-400'
                              : 'border-pink-200 dark:border-neutral-700 focus:ring-pink-400'
                            }`}
                        />
                      </div>
                      {addressErrors.streetAddress && (
                        <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                          {addressErrors.streetAddress}
                        </span>
                      )}
                    </div>

                    {/* Landmark (Optional) */}
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Landmark <span className="text-neutral-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={addressData.landmark}
                        onChange={(e) => handleAddressChange('landmark', e.target.value)}
                        placeholder="e.g. Opposite Metro Station or Park"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>

                    {/* RE-ORDERED & ALIGNED: PIN CODE, CITY, AND STATE WITH AUTOMATIC PINCODE LOOKUP */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                      {/* 1. PIN Code (Placed First + Auto API) */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          PIN Code <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            value={addressData.pincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            placeholder="6 digits"
                            className={`w-full h-9 px-2.5 pr-7 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${addressErrors.pincode
                                ? 'border-rose-400 focus:ring-rose-400'
                                : 'border-pink-200 dark:border-neutral-700 focus:ring-pink-400'
                              }`}
                          />
                          {isDetectingPin && (
                            <Loader2 className="w-3.5 h-3.5 text-pink-500 animate-spin absolute right-2 top-1/2 -translate-y-1/2" />
                          )}
                          {!isDetectingPin && pinDetected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute right-2 top-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        {addressErrors.pincode && (
                          <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                            {addressErrors.pincode}
                          </span>
                        )}
                      </div>

                      {/* 2. City (Auto-filled from PIN) */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          City <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={addressData.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            placeholder="e.g. Mumbai"
                            className={`w-full h-9 pl-7 pr-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${addressErrors.city
                                ? 'border-rose-400 focus:ring-rose-400'
                                : 'border-pink-200 dark:border-neutral-700 focus:ring-pink-400'
                              }`}
                          />
                        </div>
                        {addressErrors.city && (
                          <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                            {addressErrors.city}
                          </span>
                        )}
                      </div>

                      {/* 3. State (Auto-selected from PIN) */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          State <span className="text-pink-500">*</span>
                        </label>
                        <select
                          value={addressData.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="w-full h-9 px-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Auto-detected PIN feedback message cleanly placed under the 3-column row */}
                    {pinStatusMsg && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
                        <Sparkles className="w-3 h-3 text-pink-500 shrink-0" />
                        <span>{pinStatusMsg}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Creator & Special Requests */}
                <div className="p-3.5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="font-bold text-neutral-800 dark:text-neutral-200 text-xs flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span>Special Requests & IG Tag</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filmOnReel}
                      onChange={(e) => setFilmOnReel(e.target.checked)}
                      className="accent-pink-500 rounded"
                    />
                    <span className="font-semibold text-pink-600 dark:text-pink-400">
                      Film My Order on IG Reel (@scoopstorey)
                    </span>
                  </label>

                  {filmOnReel && (
                    <input
                      type="text"
                      value={userHandle}
                      onChange={(e) => setUserHandle(e.target.value)}
                      placeholder="Enter your IG @handle for tag"
                      className="w-full text-xs p-2 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-pink-800 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  )}

                  {/* Additional Notes Option */}
                  <div className="pt-2 border-t border-pink-100 dark:border-neutral-800 space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-pink-500" />
                      <span>Additional Notes</span>
                      <span className="text-neutral-400 font-normal text-[10px]">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Add instructions, gift message, or special packaging notes..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 resize-none focus:outline-none focus:ring-1 focus:ring-pink-400 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* REWARD & SHIPPING PROGRESS BAR */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-200 dark:border-pink-900/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-900 dark:text-white flex items-center gap-1.5">
                      {isFreeShipping ? (
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-[#B81D24] dark:text-pink-400 shrink-0" />
                      )}
                      <span>
                        {!isFreeShipping
                          ? `Add ₹${amountNeededForFreeShipping} more for FREE Shipping! 🚚💨`
                          : itemsNetINR < 999
                            ? `Add ₹${999 - itemsNetINR} more for VIP Deluxe Box Packaging! 👑`
                            : `🎉 FREE Delivery + All VIP Milestone Rewards Unlocked! ✨`}
                      </span>
                    </span>
                    <span className="text-[11px] font-black">
                      {!isFreeShipping ? (
                        <span className="text-[#B81D24] dark:text-pink-400">
                          ₹{itemsNetINR}/₹499
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                          <span>✓ FREE</span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2.5 rounded-full bg-pink-100 dark:bg-neutral-800 overflow-hidden relative shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFreeShipping
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-pink-500'
                          : 'bg-gradient-to-r from-[#B81D24] via-pink-500 to-purple-500'
                      }`}
                      style={{
                        width: !isFreeShipping
                          ? `${Math.max(6, (itemsNetINR / FREE_SHIPPING_THRESHOLD) * 60)}%`
                          : itemsNetINR < 999
                            ? `${60 + Math.min(40, ((itemsNetINR - 499) / 500) * 40)}%`
                            : '100%'
                      }}
                    />
                  </div>

                  {/* Milestone Icons */}
                  <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 pt-0.5">
                    <span className={isFreeShipping ? 'text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1' : ''}>
                      {isFreeShipping ? '✓ ₹499 Free Shipping Unlocked' : '₹499 Free Shipping'}
                    </span>
                    <span className={itemsNetINR >= 999 ? 'text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1' : ''}>
                      {itemsNetINR >= 999 ? '✓ VIP Deluxe Box' : '₹999 VIP Box 👑'}
                    </span>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-1">
                    <span>Items In Bag ({totalItemCount})</span>
                    <span className="text-[11px] font-medium lowercase text-neutral-400">Total Price</span>
                  </div>

                  {cartItems.map((item) => {
                    const itemKey = item.cartKey || item.id;
                    return (
                      <div
                        key={itemKey}
                        className="p-3 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 flex items-center gap-3 transition hover:border-pink-300"
                      >
                        <img
                          src={item.image || '/images/deluxe-giftbox.webp'}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/deluxe-giftbox.webp';
                          }}
                          className="w-14 h-16 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 border border-pink-200/50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-display font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                              {item.name}
                            </h5>
                            <span className="font-display font-black text-xs sm:text-sm text-[#B81D24] dark:text-pink-400 shrink-0">
                              ₹{item.priceINR * item.qty}
                            </span>
                          </div>

                          {item.selectedColor && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {item.selectedColorHex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                  style={{ backgroundColor: item.selectedColorHex }}
                                />
                              )}
                              <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                                Color: {item.selectedColor}
                              </span>
                            </div>
                          )}

                          {/* Qty controls */}
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <div className="flex items-center rounded-lg bg-pink-100/60 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700">
                              <button
                                onClick={() => {
                                  onUpdateQty(itemKey, item.qty - 1);
                                  soundFX.playPop(420);
                                }}
                                className="p-1 hover:text-pink-600 transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => {
                                  onUpdateQty(itemKey, item.qty + 1);
                                  soundFX.playPop(520);
                                }}
                                className="p-1 hover:text-pink-600 transition"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                onRemoveItem(itemKey);
                                soundFX.playPop(350);
                              }}
                              className="text-neutral-400 hover:text-red-500 p-1.5 transition rounded-lg hover:bg-rose-50 dark:hover:bg-neutral-800"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BUNDLE ASSISTANT: Quick-Add Items to save ₹49 on shipping */}
                {!isFreeShipping && bundleAddOns.length > 0 && (
                  <div data-bundle-helper className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border-2 border-dashed border-pink-300 dark:border-pink-800 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#B81D24] dark:text-pink-400" />
                        <h5 className="font-display font-extrabold text-xs sm:text-sm text-[#231733] dark:text-white">
                          Add ₹{amountNeededForFreeShipping} more to unlock FREE Delivery! 🚚
                        </h5>
                      </div>
                      <span className="text-[10px] font-bold text-[#B81D24] dark:text-pink-300 bg-pink-100 dark:bg-pink-950 px-2 py-0.5 rounded-full">
                        Save ₹49 ✨
                      </span>
                    </div>

                    <p className="text-[11px] text-[#554664] dark:text-[#D5CBE2] font-medium">
                      Add any cute treat below under ₹250 to save ₹49 shipping & get free delivery:
                    </p>

                    <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                      {bundleAddOns.map((addon) => (
                        <div
                          key={addon.id}
                          className="w-32 sm:w-36 shrink-0 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-pink-200/80 dark:border-pink-900/40 shadow-xs flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <div className="w-full aspect-[4/5] rounded-lg bg-neutral-100 dark:bg-neutral-700 overflow-hidden flex items-center justify-center">
                              <img
                                src={addon.image || (Array.isArray(addon.images) && addon.images[0]) || '/images/deluxe-giftbox.webp'}
                                alt={addon.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/deluxe-giftbox.webp';
                                }}
                              />
                            </div>
                            <h6 className="font-display font-bold text-[11px] text-[#231733] dark:text-white line-clamp-1">
                              {addon.name}
                            </h6>
                            <div className="text-xs font-black text-[#B81D24] dark:text-pink-400">
                              ₹{addon.priceINR}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAddBundleItem(addon)}
                            className="mt-2 w-full py-1.5 px-2 rounded-lg bg-[#B81D24] hover:bg-[#D8005A] text-white font-display font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}

                      {/* Card at end of scroll to view full collection */}
                      <button
                        type="button"
                        onClick={handleGoToCollections}
                        className="w-32 sm:w-36 shrink-0 p-3 rounded-xl bg-gradient-to-b from-pink-100/90 to-purple-100/90 dark:from-pink-950/70 dark:to-purple-950/70 border-2 border-dashed border-[#B81D24]/50 hover:border-[#B81D24] flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 shadow-xs group"
                      >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-[#B81D24] mb-1.5 shadow-xs group-hover:scale-110 transition">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <span className="font-display font-extrabold text-[11px] text-[#231733] dark:text-white leading-tight">
                          View Full Collection
                        </span>
                        <span className="text-[10px] text-[#B81D24] dark:text-pink-400 font-bold mt-1">
                          Browse All →
                        </span>
                      </button>
                    </div>

                    {/* Dedicated Button to View Full Collection in Center Card */}
                    <button
                      type="button"
                      onClick={handleGoToCollections}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-pink-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#B81D24] dark:text-pink-300 font-display font-bold text-xs flex items-center justify-center gap-2 border border-pink-300 dark:border-pink-800 shadow-xs cursor-pointer transition active:scale-[0.99]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B81D24] dark:text-pink-400" />
                      <span>View Full Collection & Browse All Goodies →</span>
                    </button>
                  </div>
                )}

                {/* Promo Code Form */}
                <div className="p-3.5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 space-y-2">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code (SCOOP10)"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition"
                    >
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <div className="text-[11px] font-semibold text-pink-600 dark:text-pink-400">
                      {promoMessage}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sticky Bottom Controls for Step 1: Bag */}
          {cartItems.length > 0 && checkoutStep === 'cart' && (
            <div className="p-4 sm:p-5 border-t border-pink-100 dark:border-pink-900/30 bg-white/95 dark:bg-neutral-900/95 space-y-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.06)]">

              {/* Payment Option Selector at Bottom */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
                  <span>Payment Option:</span>
                  {paymentMode === 'full_cod' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                      <span>📦 Cash on Delivery</span>
                    </span>
                  ) : paymentMode === 'full_prepaid' ? (
                    <span className="text-[#B81D24] dark:text-pink-400 font-extrabold flex items-center gap-1">
                      <span>⚡ 100% Prepaid UPI</span>
                    </span>
                  ) : (
                    <span className="text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1">
                      <span>📦 Partial Payment</span>
                    </span>
                  )}
                </div>

                <div className="p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/90 border border-pink-200 dark:border-neutral-700 grid grid-cols-2 gap-2">
                  {/* Option 1: Cash on Delivery (Full COD) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('full_cod');
                      soundFX.playPop(550);
                    }}
                    className={`p-2.5 rounded-xl text-left transition relative cursor-pointer flex flex-col justify-between ${
                      paymentMode === 'full_cod'
                        ? 'bg-white dark:bg-neutral-900 shadow-md border-2 border-emerald-600 dark:border-emerald-500 text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-display font-extrabold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span>📦 Cash on Delivery</span>
                        </span>
                        {paymentMode === 'full_cod' && (
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2 h-2" />
                          </div>
                        )}
                      </div>
                      <div className="font-display font-black text-sm mt-1 text-neutral-900 dark:text-white">
                        ₹{totalINR}
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                      ₹0 Advance • Pay to Courier
                    </span>
                  </button>

                  {/* Option 2: Full Prepaid */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('full_prepaid');
                      soundFX.playPop(550);
                    }}
                    className={`p-2.5 rounded-xl text-left transition relative cursor-pointer flex flex-col justify-between ${
                      paymentMode === 'full_prepaid'
                        ? 'bg-white dark:bg-neutral-900 shadow-md border-2 border-[#B81D24] dark:border-pink-500 text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-display font-extrabold text-xs text-[#B81D24] dark:text-pink-400 flex items-center gap-1">
                          <span>⚡ 100% Prepaid</span>
                        </span>
                        {paymentMode === 'full_prepaid' && (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#B81D24] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2 h-2" />
                          </div>
                        )}
                      </div>
                      <div className="font-display font-black text-sm mt-1 text-neutral-900 dark:text-white">
                        ₹{totalINR}
                      </div>
                    </div>
                    <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold mt-1 block">
                      🎁 Free Mystery Charm
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Breakdown (India INR Only) */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span>₹{subtotalINR}</span>
                </div>
                {discountAmountINR > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount {appliedCoupon?.code ? `(${appliedCoupon.code})` : appliedDiscount > 0 ? `(${Math.round(appliedDiscount * 100)}%)` : ''}</span>
                    <span>-₹{discountAmountINR}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <span>Delivery (Across India)</span>
                    {isFreeShipping && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        FREE ₹499+
                      </span>
                    )}
                  </span>
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="line-through text-neutral-400 font-normal text-[11px]">₹49</span>
                      <span>FREE</span>
                    </span>
                  ) : (
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      ₹{FLAT_SHIPPING_FEE}
                    </span>
                  )}
                </div>

                {paymentMode === 'full_cod' ? (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400 font-semibold">
                      <span>Advance to Pay Now:</span>
                      <span className="text-emerald-600 font-bold">₹0 (Zero Advance ✨)</span>
                    </div>
                    <div className="flex justify-between font-display font-extrabold text-base text-neutral-900 dark:text-white pt-1 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                      <span>Cash Due on Delivery</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ₹{paymentBreakdown.finalTotalINR}
                      </span>
                    </div>
                  </div>
                ) : paymentMode === 'partial_cod' ? (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                    <div className="flex justify-between font-bold text-purple-700 dark:text-purple-300">
                      <span>Advance to Pay Now (UPI):</span>
                      <span>₹{paymentBreakdown.payNowINR}</span>
                    </div>
                    <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold">
                      <span>Cash Due on Delivery:</span>
                      <span>₹{paymentBreakdown.balanceCodINR}</span>
                    </div>
                    <div className="flex justify-between font-display font-extrabold text-base text-neutral-900 dark:text-white pt-1 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                      <span>Total Order Value</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        ₹{paymentBreakdown.finalTotalINR}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between font-display font-extrabold text-base text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span>Total (Prepaid UPI)</span>
                    <span className="text-pink-600 dark:text-pink-400">
                      ₹{totalINR}
                    </span>
                  </div>
                )}
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1-Tap Quick Order on WhatsApp */}
                <button
                  type="button"
                  onClick={handleQuickWhatsAppOrder}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.99] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white fill-current" />
                  <span>💬 1-Tap Quick Order on WhatsApp</span>
                </button>

                <div className="flex items-center gap-2 py-0.5">
                  <div className="flex-1 h-px bg-pink-100 dark:bg-neutral-800" />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">or fill address online</span>
                  <div className="flex-1 h-px bg-pink-100 dark:bg-neutral-800" />
                </div>

                <button
                  type="button"
                  onClick={handleProceedToAddress}
                  className="w-full py-3.5 rounded-full bg-[#B81D24] hover:bg-[#9B151C] active:scale-[0.99] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>{paymentMode === 'full_cod' ? 'Proceed to Delivery Details (COD)' : 'Proceed to Delivery Details'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Drop a Gift Hint / Share Bag on WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareBagOnWhatsApp}
                  className="w-full py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] cursor-pointer"
                  title="Share your bag with someone on WhatsApp"
                >
                  <Gift className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Drop a Gift Hint / Share Bag on WhatsApp 🎁</span>
                </button>

                {/* Need help support inquiry link */}
                <div className="text-center pt-0.5">
                  <a
                    href="https://wa.me/918199922653?text=Hi%20Tanu!%20I%20have%20a%20question%20about%20my%20Scoop%20Storey%20bag."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    <WhatsAppIcon className="w-3 h-3 text-emerald-500" />
                    <span>Need help? Chat with Tanu on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Bottom Controls for Step 2: Delivery Address */}
          {cartItems.length > 0 && checkoutStep === 'address' && (
            <div className="p-4 sm:p-5 border-t border-pink-100 dark:border-pink-900/30 bg-white/95 dark:bg-neutral-900/95 space-y-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.06)] animate-fadeIn">
              {/* Validation Warning Notice if fields missing */}
              {Object.keys(addressErrors).length > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>Please fill in the required address fields highlighted above.</span>
                </div>
              )}

              {/* Order total preview line */}
              <div className="flex items-center justify-between text-xs pb-1">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {paymentMode === 'full_cod' ? 'Cash Due on Delivery:' : paymentMode === 'partial_cod' ? 'Advance to Pay Now:' : 'Total Payable:'}{' '}
                  </span>
                  <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
                    ₹{paymentMode === 'partial_cod' ? paymentBreakdown.payNowINR : totalINR}
                  </span>
                  {paymentMode === 'full_cod' ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                      (₹0 Advance • Pay cash to courier ✨)
                    </span>
                  ) : paymentMode === 'partial_cod' ? (
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">
                      (₹{paymentBreakdown.balanceCodINR} cash due on delivery)
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Free Delivery Across India
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {paymentMode === 'full_cod' ? (
                  <button
                    type="button"
                    onClick={handleConfirmFullCodOrder}
                    className="w-full py-3.5 rounded-full text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-[0.99] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/25"
                  >
                    <span>📦 Place Cash on Delivery Order (Pay ₹{paymentBreakdown.finalTotalINR} on Delivery) →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleProceedToUpiPayment}
                    className="w-full py-3.5 rounded-full text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-[0.99] bg-[#B81D24] hover:bg-[#9B151C]"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>
                      {paymentMode === 'partial_cod'
                        ? `Proceed to Pay ₹${paymentBreakdown.payNowINR} Advance (UPI) →`
                        : `Proceed to Pay ₹${totalINR} (UPI QR Code) →`}
                    </span>
                  </button>
                )}

                {/* 1-Tap Book Directly on WhatsApp with Address */}
                <button
                  type="button"
                  onClick={handleDirectAddressWhatsAppOrder}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-[0.99]"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white fill-current" />
                  <span>💬 Book & Pay Directly on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="w-full text-center py-1 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-400 transition cursor-pointer"
                >
                  ← Back to Bag to Edit Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ORDER SUCCESS CONFIRMATION MODAL */}
      {orderCompleteData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-pink-300 dark:border-pink-700 text-center animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">
              🎉
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {orderCompleteData.isFullCod
                ? '🎉 Cash on Delivery Order Placed!'
                : orderCompleteData.isPartialCod
                ? 'Partial COD Order Confirmed!'
                : 'Prepaid Order Confirmed & Sent!'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Order ID: <strong className="text-pink-600 font-mono">{orderCompleteData.orderId}</strong>
            </p>

            <div className="my-5 p-4 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/70 text-left text-xs space-y-2.5 border border-pink-100 dark:border-pink-900/30">
              {orderCompleteData.isFullCod ? (
                <>
                  <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-300 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span>🚚 Cash Due on Delivery:</span>
                    <span className="font-mono text-base font-extrabold text-emerald-800 dark:text-emerald-200">
                      ₹{orderCompleteData.balanceDueOnDeliveryINR || orderCompleteData.totalINR}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Advance Payment:</span>
                    <span className="font-bold text-emerald-600">₹0 (Zero Advance Required ✨)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Payment Mode:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">100% Cash on Delivery</span>
                  </div>
                </>
              ) : orderCompleteData.isPartialCod ? (
                <>
                  <div className="flex justify-between font-bold text-purple-700 dark:text-purple-300">
                    <span>Advance Paid via UPI:</span>
                    <span>₹{orderCompleteData.advancePaidINR}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-700 dark:text-amber-300 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span>🚚 Cash Due on Delivery:</span>
                    <span className="font-mono text-sm">₹{orderCompleteData.balanceDueOnDeliveryINR}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Total Order Value:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">₹{orderCompleteData.totalINR}</span>
                  </div>
                  <div className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold">
                    <span>Payment Mode:</span>
                    <span>Partial COD ({orderCompleteData.advancePercentage || 20}% Advance Paid)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Paid (UPI):</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-100">₹{orderCompleteData.totalINR}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Payment Mode:</span>
                    <span>100% Prepaid UPI Verified</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">{orderCompleteData.date}</span>
              </div>

              {orderCompleteData.paymentScreenshot ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Proof:</span>
                  </div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-100 text-xs">
                    📸 Screenshot Attached
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Booking Status:</span>
                  </div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-100 text-xs">
                    💬 Verify via WhatsApp
                  </span>
                </div>
              )}

              {/* Delivery Address Details */}
              {orderCompleteData.customer && (
                <div className="pt-2 border-t border-pink-200/60 dark:border-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" />
                    <span>Shipping Address:</span>
                  </div>
                  <p className="text-neutral-800 dark:text-neutral-200 font-semibold pl-5">
                    {orderCompleteData.customer.fullName} • +91 {orderCompleteData.customer.phone}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 pl-5 leading-relaxed">
                    {orderCompleteData.customer.streetAddress}
                    {orderCompleteData.customer.landmark ? `, Near ${orderCompleteData.customer.landmark}` : ''}
                    <br />
                    {orderCompleteData.customer.city}, {orderCompleteData.customer.state} - {orderCompleteData.customer.pincode}
                  </p>
                </div>
              )}

              {orderCompleteData.filmOnReel && (
                <div className="flex justify-between text-pink-600 dark:text-pink-400 font-semibold pt-1 border-t border-pink-200/40 dark:border-neutral-700">
                  <span>Tagged for IG Reel:</span>
                  <span>{orderCompleteData.filmOnReel}</span>
                </div>
              )}

              {orderCompleteData.additionalNotes && (
                <div className="pt-2 border-t border-pink-200/40 dark:border-neutral-700 text-xs">
                  <div className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-pink-500" />
                    <span>Customer Note:</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 italic pl-5 mt-0.5">
                    "{orderCompleteData.additionalNotes}"
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-5 font-body">
              {orderCompleteData.isFullCod
                ? 'Your Cash on Delivery order has been successfully placed! Please keep cash ready for the courier when the package arrives.'
                : orderCompleteData.isPartialCod
                ? 'Your Partial COD order details have been recorded! Remaining balance will be collected in Cash by the courier.'
                : 'Your order details have been recorded! If WhatsApp hasn\'t opened automatically, click the button below to message Tanu directly to confirm your order.'}
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/918199922653?text=${encodeURIComponent(
                  orderCompleteData.isFullCod
                    ? `Hi Tanu! 🎀 Mera Cash on Delivery (COD) Order ID ${orderCompleteData.orderId} confirm hua hai (Total to Pay Courier: ₹${orderCompleteData.balanceDueOnDeliveryINR || orderCompleteData.totalINR}).\nDeliver to: ${orderCompleteData.customer?.fullName}, ${orderCompleteData.customer?.city} (${orderCompleteData.customer?.pincode}).\nPlease pack and dispatch! ✨`
                    : orderCompleteData.isPartialCod
                    ? `Hi Tanu! 🎀 Mera Partial COD Order ID ${orderCompleteData.orderId} hai (Advance: ₹${orderCompleteData.advancePaidINR}, Balance on Delivery: ₹${orderCompleteData.balanceDueOnDeliveryINR}, Total: ₹${orderCompleteData.totalINR}).\n${orderCompleteData.paymentScreenshot ? '📸 Payment Proof: Screenshot Attached via UPI' : '📸 Payment Proof: Chat me share kar raha/rahi hu'}\nDeliver to: ${orderCompleteData.customer?.fullName}, ${orderCompleteData.customer?.city} (${orderCompleteData.customer?.pincode}).\nPlease verify and pack! ✨`
                    : `Hi Tanu! 🎀 Mera Order ID ${orderCompleteData.orderId} hai (Total: ₹${orderCompleteData.totalINR}).\n${orderCompleteData.paymentScreenshot ? '📸 Payment Proof: Screenshot Attached via UPI' : '📸 Payment Proof: Chat me share kar raha/rahi hu'}\nDeliver to: ${orderCompleteData.customer?.fullName}, ${orderCompleteData.customer?.city} (${orderCompleteData.customer?.pincode}).\nPlease verify and pack! ✨`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-emerald-500 transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Open WhatsApp Chat (+91 8199922653)</span>
              </a>

              <button
                onClick={() => {
                  setOrderCompleteData(null);
                  onClose();
                }}
                className="w-full py-2 rounded-xl text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Back to Scoop Storey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
