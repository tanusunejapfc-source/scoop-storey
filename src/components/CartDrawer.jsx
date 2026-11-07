import React, { useState, useRef, useEffect } from 'react';
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
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';
import { lookupPincode } from '../utils/pincodeApi';
import { saveOrderToStore } from '../utils/orderStore';
import { usePaymentSettings, buildUpiUri, getQrDisplayUrl } from '../utils/paymentStore';
import { DEFAULT_PRODUCTS } from '../utils/productStore';

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
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'upi_payment'
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [upiRefNumber, setUpiRefNumber] = useState('');
  const [upiRefError, setUpiRefError] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Auto PIN Code detection states
  const [isDetectingPin, setIsDetectingPin] = useState(false);
  const [pinDetected, setPinDetected] = useState(false);
  const [pinStatusMsg, setPinStatusMsg] = useState('');

  // Delivery Address & Contact Details State (saved in localStorage for repeat customers)
  const [addressData, setAddressData] = useState(() => {
    try {
      const saved = localStorage.getItem('bhaskar_delivery_address');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: '',
      phone: '',
      streetAddress: '',
      landmark: '',
      city: '',
      state: 'Maharashtra',
      pincode: ''
    };
  });
  const [addressErrors, setAddressErrors] = useState({});
  const addressRef = useRef(null);
  const cartContentRef = useRef(null);

  // Cart totals & calculations
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotalINR = cartItems.reduce((acc, item) => acc + item.priceINR * item.qty, 0);

  const discountAmountINR = Math.round(subtotalINR * appliedDiscount);
  const shippingINR = subtotalINR >= 499 ? 0 : 60;
  const totalINR = Math.max(0, subtotalINR - discountAmountINR + shippingINR);

  // Minimum 3 products rule
  const minRequired = 3;
  const isMinimumMet = totalItemCount >= minRequired;
  const itemsRemainingForMin = Math.max(0, minRequired - totalItemCount);

  // Free shipping progress (499 INR)
  const freeShippingGoal = 499;
  const progressPercent = Math.min(100, Math.round((subtotalINR / freeShippingGoal) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotalINR);

  // If cart drops below 3 items while on payment step, return to cart immediately
  useEffect(() => {
    if (checkoutStep === 'upi_payment' && !isMinimumMet) {
      setCheckoutStep('cart');
    }
  }, [checkoutStep, isMinimumMet]);

  // Return to cart items smoothly and scroll to top
  const handleBackToCart = () => {
    soundFX.playPop(500);
    setCheckoutStep('cart');
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
    if (clean === 'SCOOP10') {
      setAppliedDiscount(0.10);
      setPromoMessage('✨ 10% discount applied!');
      soundFX.playSuccess();
    } else if (clean === 'HAPPINESS') {
      setAppliedDiscount(0.15);
      setPromoMessage('💖 15% VIP Happiness discount applied!');
      soundFX.playSuccess();
    } else {
      setPromoMessage('❌ Invalid code. Try SCOOP10 or HAPPINESS');
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

  const handleShareBagOnWhatsApp = () => {
    soundFX.playPop(520);
    if (!cartItems.length) return;
    const itemList = cartItems
      .map(item => `• ${item.name}${item.selectedColor ? ` (${item.selectedColor})` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');
    const msg = `Hey! 💖 Here are the cute jewelry finds I saved in my cart on Scoop Storey:\n\n${itemList}\n\n💰 Total: ₹${totalINR} (${totalItemCount} items)\n✨ Look at them here: https://scoop-storey-1du8.vercel.app/\nWould make the dreamiest gift or surprise! 🎁✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  // Transition to UPI & QR Payment Step
  const handleProceedToUpiPayment = () => {
    if (!isMinimumMet) {
      soundFX.playPop(300);
      alert(
        `⚠️ Order Rule: Minimum 3 products required to checkout.\n\nYou currently have ${totalItemCount} item(s) in your bag. Please add ${itemsRemainingForMin} more product(s) to unlock the payment QR code.`
      );
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
        } catch {
          setPaymentScreenshot(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Final Order Confirmation with Verified UPI Reference Number
  const handleConfirmUpiOrder = () => {
    const cleanRef = upiRefNumber.trim();
    if (!cleanRef && !paymentScreenshot) {
      setUpiRefError('⚠️ Please enter your 12-digit UPI Ref / UTR number or upload payment screenshot after completing payment.');
      soundFX.playPop(300);
      return;
    }

    if (cleanRef && cleanRef.length < 6 && !paymentScreenshot) {
      setUpiRefError('⚠️ Please enter a valid UPI Ref / UTR number (usually 12 digits) or upload payment screenshot.');
      soundFX.playPop(300);
      return;
    }

    soundFX.playSuccess();
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FF3385']
    });

    const hasUtr = Boolean(cleanRef && cleanRef.length >= 6);
    const utrDisplay = hasUtr ? cleanRef : 'Screenshot Attached';

    const cleanItems = cartItems.map(item => ({
      id: item.id || '',
      name: item.name || 'Scoop Storey Item',
      priceINR: Number(item.priceINR || item.price || 0),
      qty: Number(item.qty || 1),
      image: item.image || (Array.isArray(item.images) && item.images[0]) || '/images/deluxe-giftbox.jpg',
      selectedColor: item.selectedColor || null,
      selectedColorHex: item.selectedColorHex || null
    }));

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
      source: 'Prepaid UPI / QR Code',
      status: hasUtr ? 'Payment Received (Verify UTR)' : 'UPI Verification Pending (Screenshot)',
      paymentMethod: 'UPI QR Code',
      upiRefNumber: utrDisplay,
      paymentScreenshot: paymentScreenshot || null,
      customer: { ...addressData },
      items: cleanItems,
      totalItemCount,
      subtotalINR,
      discountAmountINR,
      shippingINR,
      totalINR,
      filmOnReel: filmOnReel ? (userHandle || '@customer') : null,
      additionalNotes: additionalNotes.trim() || null
    };

    // 1. Save to persistent order store
    saveOrderToStore(newOrder);

    // 2. Clear cart
    onClearCart();

    // 3. Set order complete modal data
    setOrderCompleteData(newOrder);
    setCheckoutStep('cart');

    // 4. Send on WhatsApp
    const orderItemsSummary = cleanItems
      .map(item => `• ${item.name}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const msg = `Hi Scoop Storey! 🎀 Mera Prepaid Order confirm ho gaya hai!

Order ID: ${currentOrderId}
💰 Total Paid: ₹${totalINR} (${totalItemCount} items)
🔢 UPI Ref / UTR No.: ${utrDisplay}
${paymentScreenshot ? '📸 Payment Screenshot: Attached\n' : ''}
🛍️ ITEMS ORDERED:
${orderItemsSummary}
${filmOnReel ? `🎬 Film on IG Reel: Yes (@${userHandle || 'my_account'})\n` : ''}${additionalNotes.trim() ? `📝 Additional Notes: ${additionalNotes.trim()}\n` : ''}
📍 DELIVERY ADDRESS & CONTACT:
• Name: ${addressData.fullName}
• Mobile/WhatsApp: +91 ${addressData.phone}
• Address: ${addressData.streetAddress}
${addressData.landmark ? `• Landmark: ${addressData.landmark}\n` : ''}• City, State: ${addressData.city}, ${addressData.state}
• PIN Code: ${addressData.pincode}

Maine UPI payment successfully transfer kar diya hai. Please verify karke packing start kar dijiye! ✨`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/918199922653?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const isAddressFilled = Boolean(
    addressData.fullName.trim() &&
    addressData.phone.replace(/\D/g, '').length === 10 &&
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
                  onClick={handleBackToCart}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/80 dark:hover:bg-pink-900 text-[#E60067] dark:text-pink-300 font-display font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                  title="Return to Cart to add/remove items"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Edit Bag</span>
                </button>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hidden xs:inline">
                  Step 2: Pay QR
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
              {checkoutStep === 'upi_payment' && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ₹{totalINR}
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

          {/* Free Shipping Progress (₹499) */}
          <div className="px-4 py-2.5 bg-pink-50/70 dark:bg-neutral-800/70 border-b border-pink-100 dark:border-pink-900/30">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-pink-500" />
                {remainingForFreeShipping > 0
                  ? `Add ₹${remainingForFreeShipping} more for Free Delivery Across India!`
                  : '🎉 Free Delivery Unlocked!'}
              </span>
              <span className="font-bold text-pink-600 dark:text-pink-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-pink-200/60 dark:bg-neutral-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

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
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-[#251A38] dark:via-[#2A1E40] dark:to-[#251A38] border-2 border-pink-200 dark:border-pink-900/60 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-[#E60067] dark:text-pink-300 font-bold shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Need to change items or address?
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {totalItemCount} item(s) in bag • You can edit anytime
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-pink-50 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-300 font-display font-extrabold text-xs shadow-xs border border-pink-200 dark:border-pink-800 shrink-0 cursor-pointer flex items-center gap-1 active:scale-95 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Cart</span>
                  </button>
                </div>

                {/* Amount to Pay Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Total Amount to Pay</span>
                    <span className="font-display font-extrabold text-2xl text-pink-600 dark:text-pink-400">
                      ₹{totalINR}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">Prepaid Order Only • Free Delivery</span>
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

                {/* STEP 1: SCAN QR CODE */}
                <div className="p-4 rounded-2xl glass-panel border border-pink-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                        Scan & Pay via any UPI App
                      </h4>
                    </div>
                    {paymentSettings.customQrImage && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        Official Store QR
                      </span>
                    )}
                  </div>

                  {/* QR Image Container */}
                  <div className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-neutral-800 rounded-2xl border-2 border-dashed border-pink-300 dark:border-pink-700 shadow-inner">
                    <div className="relative group">
                      <img
                        src={getQrDisplayUrl(paymentSettings, totalINR, currentOrderId)}
                        alt="Scoop Storey UPI Payment QR Code"
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl shadow-md bg-white p-2"
                      />
                      <div className="absolute inset-x-0 bottom-1 text-center">
                        <span className="text-[10px] font-bold bg-neutral-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                          ₹{totalINR}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mt-2 text-center">
                      Pay to: <strong className="text-neutral-900 dark:text-white">{paymentSettings.payeeName}</strong>
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] font-bold text-neutral-400">
                      <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span> • <span>CRED</span>
                    </div>
                  </div>

                  {/* Mobile Direct Pay Deep-Link */}
                  <a
                    href={buildUpiUri(paymentSettings, totalINR, currentOrderId)}
                    className="sm:hidden flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-display font-bold text-xs shadow-md active:scale-95 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Installed UPI App to Pay ₹{totalINR}</span>
                  </a>

                  {/* Copy UPI ID & Phone */}
                  <div className="space-y-2 pt-1">
                    {/* Copy UPI ID */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          UPI ID
                        </span>
                        <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white truncate block">
                          {paymentSettings.upiId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(paymentSettings.upiId, 'upiId')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          copiedField === 'upiId'
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
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Copy UPI Phone Number */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          UPI Phone Number
                        </span>
                        <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white truncate block">
                          {paymentSettings.upiPhone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(paymentSettings.upiPhone, 'upiPhone')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          copiedField === 'upiPhone'
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
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {paymentSettings.customNote && (
                    <p className="text-[11px] text-pink-600 dark:text-pink-400 font-medium italic bg-pink-50 dark:bg-pink-950/30 p-2 rounded-lg">
                      💡 Note: {paymentSettings.customNote}
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
                      <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                        Enter UPI Ref / UTR Number
                      </h4>
                      <p className="text-[10px] text-neutral-500">
                        Required to verify your payment and start packing!
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      12-Digit UPI Ref / UTR No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={upiRefNumber}
                      onChange={(e) => {
                        setUpiRefNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''));
                        setUpiRefError('');
                      }}
                      placeholder="e.g. 431289123456"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wider bg-white dark:bg-neutral-800 border focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                        upiRefError
                          ? 'border-rose-400 bg-rose-50/50 dark:border-rose-700'
                          : 'border-pink-200 dark:border-neutral-700'
                      }`}
                    />
                    {upiRefError ? (
                      <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{upiRefError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Check your GPay / PhonePe / Paytm payment receipt for UPI Ref / UTR.
                      </p>
                    )}
                  </div>

                  {/* Optional Screenshot Upload */}
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Payment Screenshot <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    {paymentScreenshot ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 p-2 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={paymentScreenshot}
                            alt="Payment Proof"
                            className="w-10 h-10 object-cover rounded-lg border border-black/10"
                          />
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            Screenshot attached! ✨
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaymentScreenshot(null)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-pink-300 dark:border-neutral-700 hover:border-pink-400 cursor-pointer text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-pink-600 transition bg-pink-50/40 dark:bg-neutral-800/40">
                        <Upload className="w-4 h-4 text-pink-500" />
                        <span>Tap to upload payment screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleScreenshotUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Final Order Confirmation Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmUpiOrder}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Order & Send on WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-contain bg-pink-50/80 dark:bg-neutral-800 p-0.5 border border-pink-200/50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-display font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                              {item.name}
                            </h5>
                            <span className="font-display font-black text-xs sm:text-sm text-[#E60067] dark:text-pink-400 shrink-0">
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

                {/* BUNDLE UNLOCK ASSISTANT: Quick-Add Items to reach 3 items */}
                {!isMinimumMet && bundleAddOns.length > 0 && (
                  <div data-bundle-helper className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border-2 border-dashed border-pink-300 dark:border-pink-800 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#E60067] dark:text-pink-400" />
                        <h5 className="font-display font-extrabold text-xs sm:text-sm text-[#231733] dark:text-white">
                          Add {itemsRemainingForMin} more to unlock checkout!
                        </h5>
                      </div>
                      <span className="text-[10px] font-bold text-[#E60067] dark:text-pink-300 bg-pink-100 dark:bg-pink-950 px-2 py-0.5 rounded-full">
                        Pocket-Friendly ✨
                      </span>
                    </div>

                    <p className="text-[11px] text-[#554664] dark:text-[#D5CBE2] font-medium">
                      Tap to add any cute add-on under ₹250 directly to your bag:
                    </p>

                    <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                      {bundleAddOns.map((addon) => (
                        <div
                          key={addon.id}
                          className="w-32 sm:w-36 shrink-0 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-pink-200/80 dark:border-pink-900/40 shadow-xs flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <div className="w-full aspect-square rounded-lg bg-pink-50/60 dark:bg-neutral-700/60 p-1 overflow-hidden flex items-center justify-center">
                              <img
                                src={addon.image || (Array.isArray(addon.images) && addon.images[0]) || '/images/deluxe-giftbox.jpg'}
                                alt={addon.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                                }}
                              />
                            </div>
                            <h6 className="font-display font-bold text-[11px] text-[#231733] dark:text-white line-clamp-1">
                              {addon.name}
                            </h6>
                            <div className="text-xs font-black text-[#E60067] dark:text-pink-400">
                              ₹{addon.priceINR}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAddBundleItem(addon)}
                            className="mt-2 w-full py-1.5 px-2 rounded-lg bg-[#E60067] hover:bg-[#D8005A] text-white font-display font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition"
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
                        className="w-32 sm:w-36 shrink-0 p-3 rounded-xl bg-gradient-to-b from-pink-100/90 to-purple-100/90 dark:from-pink-950/70 dark:to-purple-950/70 border-2 border-dashed border-[#E60067]/50 hover:border-[#E60067] flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95 shadow-xs group"
                      >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-[#E60067] mb-1.5 shadow-xs group-hover:scale-110 transition">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <span className="font-display font-extrabold text-[11px] text-[#231733] dark:text-white leading-tight">
                          View Full Collection
                        </span>
                        <span className="text-[10px] text-[#E60067] dark:text-pink-400 font-bold mt-1">
                          Browse All →
                        </span>
                      </button>
                    </div>

                    {/* Dedicated Button to View Full Collection in Center Card */}
                    <button
                      type="button"
                      onClick={handleGoToCollections}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-pink-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-300 font-display font-bold text-xs flex items-center justify-center gap-2 border border-pink-300 dark:border-pink-800 shadow-xs cursor-pointer transition active:scale-[0.99]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400" />
                      <span>View Full Collection & Browse All Goodies →</span>
                    </button>
                  </div>
                )}

                {/* ADDRESS & CONTACT DETAILS FORM */}
                <div 
                  ref={addressRef}
                  className={`p-4 rounded-2xl transition-all border ${
                    Object.keys(addressErrors).length > 0
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
                            className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${
                              addressErrors.fullName
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
                            className={`w-full px-2.5 py-2 text-xs bg-transparent focus:outline-none ${
                              addressErrors.phone ? 'border-rose-400' : ''
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
                          className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition resize-none focus:outline-none focus:ring-1 ${
                            addressErrors.streetAddress
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
                            className={`w-full h-9 px-2.5 pr-7 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${
                              addressErrors.pincode
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
                            className={`w-full h-9 pl-7 pr-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${
                              addressErrors.city
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
                      Film My Order on IG Reel (@bhaskar_scoopstorey)
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

          {/* Sticky Bottom Controls & Checkout Confirmation */}
          {cartItems.length > 0 && checkoutStep === 'cart' && (
            <div className="p-4 sm:p-5 border-t border-pink-100 dark:border-pink-900/30 bg-white/95 dark:bg-neutral-900/95 space-y-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.06)]">
              {/* Validation Warning Notice if fields missing */}
              {Object.keys(addressErrors).length > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>Please fill in your delivery address and contact details above to confirm order.</span>
                </div>
              )}

              {/* Pricing Breakdown (India INR Only) */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span>₹{subtotalINR}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount * 100}%)</span>
                    <span>-₹{discountAmountINR}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Delivery (Across India)</span>
                  <span>{shippingINR === 0 ? 'FREE' : `₹${shippingINR}`}</span>
                </div>
                <div className="flex justify-between font-display font-extrabold text-base text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span>Total (Prepaid)</span>
                  <span className="text-pink-600 dark:text-pink-400">
                    ₹{totalINR}
                  </span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                {!isMinimumMet ? (
                  /* Locked Payment Warning Button */
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playPop(300);
                      const helperCard = document.querySelector('[data-bundle-helper]');
                      if (helperCard) {
                        helperCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      } else {
                        handleGoToCollections();
                      }
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-700 cursor-pointer shadow-inner active:scale-[0.99] transition"
                  >
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Add {itemsRemainingForMin} more item{itemsRemainingForMin > 1 ? 's' : ''} to unlock payment</span>
                  </button>
                ) : (
                  /* Single Primary Prepaid UPI & QR Checkout */
                  <button
                    type="button"
                    onClick={handleProceedToUpiPayment}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-[0.99] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Proceed to Pay ₹{totalINR} (UPI QR Code)</span>
                  </button>
                )}

                {/* Drop a Gift Hint / Share Bag on WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareBagOnWhatsApp}
                  className="w-full py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.99] cursor-pointer"
                  title="Share your bag with someone on WhatsApp"
                >
                  <Gift className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Drop a Gift Hint / Share Bag on WhatsApp 🎁</span>
                </button>

                {/* Need help support inquiry link */}
                <div className="text-center pt-0.5">
                  <a
                    href="https://wa.me/918199922653?text=Hi%20Bhaskar!%20I%20have%20a%20question%20about%20my%20Scoop%20Storey%20bag."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    <WhatsAppIcon className="w-3 h-3 text-emerald-500" />
                    <span>Need help? Chat with Bhaskar on WhatsApp</span>
                  </a>
                </div>
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
              Prepaid Order Confirmed & Sent!
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Order ID: <strong className="text-pink-600 font-mono">{orderCompleteData.orderId}</strong>
            </p>

            <div className="my-5 p-4 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/70 text-left text-xs space-y-2.5 border border-pink-100 dark:border-pink-900/30">
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid (UPI):</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-100">₹{orderCompleteData.totalINR}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">{orderCompleteData.date}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Payment Mode:</span>
                <span>100% Prepaid UPI Verified</span>
              </div>

              {orderCompleteData.upiRefNumber && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>UPI Ref / UTR:</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-900 dark:text-emerald-100">
                    {orderCompleteData.upiRefNumber}
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
              Your prepaid order and payment details have been recorded! If WhatsApp hasn't opened automatically, click the button below to message Bhaskar directly with your UTR proof.
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/918199922653?text=${encodeURIComponent(
                  `Hi Bhaskar! 🎀 Mera Prepaid Order ID ${orderCompleteData.orderId} hai (Total: ₹${orderCompleteData.totalINR}).\n🔢 UPI Ref / UTR: ${orderCompleteData.upiRefNumber || 'Screenshot Attached'}\nDeliver to: ${orderCompleteData.customer?.fullName}, ${orderCompleteData.customer?.city} (${orderCompleteData.customer?.pincode}).\nPayment done via UPI! Please verify and pack!`
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
