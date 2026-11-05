import React, { useState, useRef } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Tag, 
  Gift, 
  AlertCircle,
  MapPin,
  User,
  Phone,
  Home,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';

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
  onClearCart
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [filmOnReel, setFilmOnReel] = useState(false);
  const [userHandle, setUserHandle] = useState('');
  const [waxSealNote, setWaxSealNote] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState(null);

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

  if (!isOpen) return null;

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
    if (!addressData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!addressData.state.trim()) {
      errors.state = 'State is required';
    }
    const cleanPin = addressData.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = 'Valid 6-digit PIN code is required';
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

  // Direct WhatsApp Checkout Link with Address & Order Details
  const handleWhatsAppCheckout = () => {
    if (!isMinimumMet) {
      soundFX.playPop(300);
      alert(`Minimum ${minRequired} products are required to place an order. Please add ${itemsRemainingForMin} more item(s).`);
      return;
    }

    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      soundFX.playPop(300);
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    soundFX.playPop(600);
    const orderItemsSummary = cartItems
      .map(item => `• ${item.name} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const msg = `Hi Scoop Storey! 🎀 Mujhe yeh order karna hai (Prepaid):

🛍️ ITEMS ORDERED:
${orderItemsSummary}

💰 TOTAL: ₹${totalINR} (${totalItemCount} items)
${filmOnReel ? `🎬 Film on IG Reel: Yes (@${userHandle || 'my_account'})\n` : ''}${waxSealNote ? '💌 Handwritten Wax-Sealed Note: Yes\n' : ''}
📍 DELIVERY ADDRESS & CONTACT:
• Name: ${addressData.fullName}
• Mobile/WhatsApp: +91 ${addressData.phone}
• Address: ${addressData.streetAddress}
${addressData.landmark ? `• Landmark: ${addressData.landmark}\n` : ''}• City, State: ${addressData.city}, ${addressData.state}
• PIN Code: ${addressData.pincode}

Please send me the UPI QR code for payment! ✨`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/918199922653?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  // Instant Simulated Checkout with Address Details
  const handleSimulatedCheckout = () => {
    if (!isMinimumMet) {
      soundFX.playPop(300);
      alert(`Minimum ${minRequired} products are required to place an order. Please add ${itemsRemainingForMin} more item(s).`);
      return;
    }

    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      soundFX.playPop(300);
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsCheckingOut(true);
    soundFX.playPop(700);

    setTimeout(() => {
      soundFX.playSuccess();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FF3385']
      });

      setOrderCompleteData({
        orderId: `SS-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cartItems],
        totalINR,
        filmOnReel: filmOnReel ? (userHandle || '@customer') : null,
        customer: { ...addressData },
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setIsCheckingOut(false);
      onClearCart();
    }, 1200);
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
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-pink-200/60 dark:border-pink-900/40 relative">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/30 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-neutral-900 dark:to-neutral-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500 text-white shadow-md">
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

            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-pill hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STORE POLICY: MINIMUM 3 PRODUCTS NOTICE */}
          <div className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between ${
            isMinimumMet 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-900'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-900'
          }`}>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isMinimumMet
                  ? '✅ Minimum order requirement met (3+ items)'
                  : `⚠️ Minimum 3 items required (Add ${itemsRemainingForMin} more)`}
              </span>
            </div>
            <span className="font-bold text-[11px] px-2 py-0.5 rounded-full bg-white/80 dark:bg-neutral-800 shadow-xs">
              {totalItemCount} / 3 Items
            </span>
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
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
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
                <a
                  href="#menu"
                  onClick={onClose}
                  className="mt-4 btn-3d-pink text-white text-xs font-bold py-2.5 px-4 rounded-xl"
                >
                  Explore Scoop Menu
                </a>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-1">
                    <span>Items Selected ({totalItemCount})</span>
                    <span>Price</span>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 flex items-center gap-3 transition hover:border-pink-300"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-contain bg-pink-50/80 dark:bg-neutral-800 p-0.5 border border-pink-200/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-display font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                          {item.name}
                        </h5>
                        <div className="text-xs font-extrabold text-pink-600 dark:text-pink-400 mt-0.5">
                          ₹{item.priceINR * item.qty}
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center rounded-lg bg-pink-100/60 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700">
                            <button
                              onClick={() => {
                                onUpdateQty(item.id, item.qty - 1);
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
                                onUpdateQty(item.id, item.qty + 1);
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
                              onRemoveItem(item.id);
                              soundFX.playPop(350);
                            }}
                            className="text-neutral-400 hover:text-red-500 p-1 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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

                    {/* City, State & PIN Code in 3 columns */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* City */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          City <span className="text-pink-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-3 h-3 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={addressData.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            placeholder="e.g. Mumbai"
                            className={`w-full pl-6 pr-2 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${
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

                      {/* State */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          State <span className="text-pink-500">*</span>
                        </label>
                        <select
                          value={addressData.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="w-full px-2 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* PIN Code */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          PIN Code <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={addressData.pincode}
                          onChange={(e) => handleAddressChange('pincode', e.target.value)}
                          placeholder="6 digits"
                          className={`w-full px-2.5 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border transition focus:outline-none focus:ring-1 ${
                            addressErrors.pincode
                              ? 'border-rose-400 focus:ring-rose-400'
                              : 'border-pink-200 dark:border-neutral-700 focus:ring-pink-400'
                          }`}
                        />
                        {addressErrors.pincode && (
                          <span className="text-[10px] text-rose-500 font-semibold mt-0.5 block">
                            {addressErrors.pincode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creator Options */}
                <div className="p-3.5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="font-bold text-neutral-800 dark:text-neutral-200 text-xs flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span>Special Packaging & IG Tag Options</span>
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

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waxSealNote}
                      onChange={(e) => setWaxSealNote(e.target.checked)}
                      className="accent-pink-500 rounded"
                    />
                    <span>Include custom handwritten wax-sealed note (Free)</span>
                  </label>
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
          {cartItems.length > 0 && (
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
                {/* Primary WhatsApp Order & QR Link */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Order on WhatsApp & Get UPI QR (+91 8199922653)</span>
                </button>

                {/* Instant Online Simulated Payment */}
                <button
                  onClick={handleSimulatedCheckout}
                  disabled={isCheckingOut}
                  className="w-full btn-3d-pink text-white py-3 rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isCheckingOut ? 'Generating Invoice...' : 'Instant Prepaid Checkout (UPI / Card)'}</span>
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
              Order Received!
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Order ID: <strong className="text-pink-600">{orderCompleteData.orderId}</strong>
            </p>

            <div className="my-5 p-4 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/70 text-left text-xs space-y-2.5 border border-pink-100 dark:border-pink-900/30">
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Amount:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-100">₹{orderCompleteData.totalINR}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">{orderCompleteData.date}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Payment Mode:</span>
                <span>Prepaid (UPI / QR)</span>
              </div>

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
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-5 font-body">
              Please share your transaction screenshot or complete payment via WhatsApp on <strong>+91 8199922653</strong>. Bhaskar will start hand-packing your mystery scoop!
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/918199922653?text=${encodeURIComponent(
                  `Hi Bhaskar! 🎀 Mera Order ID ${orderCompleteData.orderId} hai (Total: ₹${orderCompleteData.totalINR}).\n\nDeliver to: ${orderCompleteData.customer?.fullName}, ${orderCompleteData.customer?.city} (${orderCompleteData.customer?.pincode}).\nPlease send me the payment QR code!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-emerald-500 transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Confirm on WhatsApp (+91 8199922653)</span>
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
