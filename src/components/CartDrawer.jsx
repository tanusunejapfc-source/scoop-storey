import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Tag, 
  Gift, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';

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

  // Direct WhatsApp Checkout Link
  const handleWhatsAppCheckout = () => {
    if (!isMinimumMet) {
      soundFX.playPop(300);
      alert(`Minimum ${minRequired} products are required to place an order. Please add ${itemsRemainingForMin} more item(s).`);
      return;
    }

    soundFX.playPop(600);
    const orderItemsSummary = cartItems
      .map(item => `• ${item.name} x${item.qty} = ₹${item.priceINR * item.qty}`)
      .join('\n');

    const msg = `Hi Scoop Storey! 🎀 Mujhe yeh order karna hai (Prepaid):\n\n${orderItemsSummary}\n\nTotal: ₹${totalINR} (Items: ${totalItemCount})\n${filmOnReel ? `Film on IG Reel: Yes (@${userHandle || 'my_account'})\n` : ''}${waxSealNote ? 'Handwritten Note: Yes\n' : ''}\nPlease send me the UPI QR code for payment! ✨`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/918199922653?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  // Instant Simulated Checkout
  const handleSimulatedCheckout = () => {
    if (!isMinimumMet) {
      soundFX.playPop(300);
      alert(`Minimum ${minRequired} products are required to place an order. Please add ${itemsRemainingForMin} more item(s).`);
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
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setIsCheckingOut(false);
      onClearCart();
    }, 1200);
  };

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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
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
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/30 flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-pink-200/50 shrink-0"
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
                          className="p-1 hover:text-pink-600"
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
                          className="p-1 hover:text-pink-600"
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
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-pink-100 dark:border-pink-900/30 bg-white/95 dark:bg-neutral-900/95 space-y-3.5">
              {/* Creator Options */}
              <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
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
                    className="w-full text-xs p-2 rounded-lg bg-pink-50/60 dark:bg-neutral-800 border border-pink-200 dark:border-pink-800 focus:outline-none focus:ring-1 focus:ring-pink-400"
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
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (SCOOP10)"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-pink-400"
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

              {/* Pricing Breakdown (India INR Only) */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
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

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-1">
                {/* Primary WhatsApp Order & QR Link */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
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

      {/* ORDER SUCCESS MODAL */}
      {orderCompleteData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-pink-300 dark:border-pink-700 text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl">
              🎉
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              Order Received!
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Order ID: <strong className="text-pink-600">{orderCompleteData.orderId}</strong>
            </p>

            <div className="my-5 p-4 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/70 text-left text-xs space-y-2 border border-pink-100 dark:border-pink-900/30">
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
              {orderCompleteData.filmOnReel && (
                <div className="flex justify-between text-pink-600 dark:text-pink-400 font-semibold">
                  <span>Tagged for IG Reel:</span>
                  <span>{orderCompleteData.filmOnReel}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-5 font-body">
              Please share your transaction screenshot or complete payment via WhatsApp on <strong>+91 8199922653</strong>. Bhaskar will start hand-packing your order!
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/918199922653?text=${encodeURIComponent(`Hi Bhaskar! 🎀 Mera Order ID ${orderCompleteData.orderId} hai (Total: Rs ${orderCompleteData.totalINR}). Please send me the payment QR code!`)}`}
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
