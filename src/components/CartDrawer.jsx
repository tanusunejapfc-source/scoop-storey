import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  CreditCard, 
  Check, 
  Tag, 
  Gift, 
  Heart, 
  ArrowRight 
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal e.g. 0.1 for 10%
  const [promoMessage, setPromoMessage] = useState('');
  const [filmOnReel, setFilmOnReel] = useState(false);
  const [userHandle, setUserHandle] = useState('');
  const [waxSealNote, setWaxSealNote] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState(null);

  if (!isOpen) return null;

  // Calculate Subtotals
  const subtotalINR = cartItems.reduce((acc, item) => acc + item.priceINR * item.qty, 0);
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.priceUSD * item.qty, 0);

  const discountAmountINR = Math.round(subtotalINR * appliedDiscount);
  const discountAmountUSD = (subtotalUSD * appliedDiscount).toFixed(2);

  const totalINR = Math.max(0, subtotalINR - discountAmountINR);
  const totalUSD = Math.max(0, subtotalUSD - discountAmountUSD).toFixed(2);

  // Free shipping threshold: 999 INR
  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotalINR / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotalINR);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'SCOOP10') {
      setAppliedDiscount(0.10);
      setPromoMessage('✨ 10% discount applied successfully!');
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

  // Direct Instagram Checkout link
  const handleInstagramCheckout = () => {
    soundFX.playPop(600);
    const orderItemsSummary = cartItems
      .map(item => `• ${item.name} x${item.qty} (₹${item.priceINR * item.qty})`)
      .join('\n');

    const msg = `Hi Bhaskar! 🎀 I'd love to place an order from Scoop Storey:\n\n${orderItemsSummary}\n\nTotal: ₹${totalINR} ($${totalUSD})\n${filmOnReel ? `Please film this for my Instagram: @${userHandle || 'my_account'}\n` : ''}${waxSealNote ? 'Include custom wax-seal note: Yes\n' : ''}\nThank you! ✨`;

    const encoded = encodeURIComponent(msg);
    // Open Instagram profile
    window.open(`https://www.instagram.com/bhaskar_scoopstorey/`, '_blank');
  };

  // Simulated Instant Checkout
  const handleSimulatedCheckout = () => {
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
        totalUSD,
        filmOnReel: filmOnReel ? (userHandle || '@customer') : null,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-pink-200/60 dark:border-pink-900/40 relative">
          
          {/* Header */}
          <div className="p-5 border-b border-pink-100 dark:border-pink-900/30 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-neutral-900 dark:to-neutral-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500 text-white shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  Your Scoop Bag
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {cartItems.reduce((acc, i) => acc + i.qty, 0)} items selected
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

          {/* Free Shipping & Bonus Progress */}
          <div className="px-5 py-3 bg-pink-50/80 dark:bg-neutral-800/80 border-b border-pink-100 dark:border-pink-900/30">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-pink-500" />
                {remainingForFreeShipping > 0
                  ? `Add ₹${remainingForFreeShipping} more for Free Shipping + Mystery Charm!`
                  : '🎉 Free Shipping & Mystery Gold Charm Unlocked!'}
              </span>
              <span className="font-bold text-pink-600 dark:text-pink-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-pink-200/60 dark:bg-neutral-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-neutral-800 flex items-center justify-center text-2xl mb-3">
                  🧸
                </div>
                <h4 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-200">
                  Your scoop bag is empty
                </h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Dip the 3D scoop in our virtual machine or browse the menu to collect your happiness!
                </p>
                <a
                  href="#scoop-machine"
                  onClick={onClose}
                  className="mt-4 btn-3d-pink text-white text-xs font-bold py-2.5 px-4 rounded-xl"
                >
                  Take a 3D Scoop Now
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
                    className="w-16 h-16 rounded-xl object-cover border border-pink-200/50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-display font-bold text-xs md:text-sm text-neutral-900 dark:text-white truncate">
                      {item.name}
                    </h5>
                    <div className="text-xs font-extrabold text-pink-600 dark:text-pink-400 mt-0.5">
                      ₹{item.priceINR * item.qty}{' '}
                      <span className="text-[10px] text-neutral-400 font-normal">
                        (${ (item.priceUSD * item.qty).toFixed(2) })
                      </span>
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
            <div className="p-5 border-t border-pink-100 dark:border-pink-900/30 bg-white/95 dark:bg-neutral-900/95 space-y-4">
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
                    Film My Scoop on Instagram Reel (@bhaskar_scoopstorey)
                  </span>
                </label>

                {filmOnReel && (
                  <input
                    type="text"
                    value={userHandle}
                    onChange={(e) => setUserHandle(e.target.value)}
                    placeholder="Enter your IG @username for tag"
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

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>₹{subtotalINR} (${subtotalUSD.toFixed(2)})</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount * 100}%)</span>
                    <span>-₹{discountAmountINR} (-${discountAmountUSD})</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Shipping</span>
                  <span>{subtotalINR >= freeShippingThreshold ? 'FREE' : '₹99 ($3.50)'}</span>
                </div>
                <div className="flex justify-between font-display font-extrabold text-base text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span>Total</span>
                  <span className="text-pink-600 dark:text-pink-400">
                    ₹{totalINR} (${totalUSD})
                  </span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSimulatedCheckout}
                  disabled={isCheckingOut}
                  className="w-full btn-3d-pink text-white py-3.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isCheckingOut ? 'Processing Happiness...' : 'Proceed to Instant Checkout'}</span>
                </button>

                <button
                  onClick={handleInstagramCheckout}
                  className="w-full py-2.5 rounded-2xl border border-pink-300 dark:border-pink-800 text-neutral-800 dark:text-neutral-200 hover:bg-pink-50 dark:hover:bg-neutral-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                  <span>Order via Instagram DM @bhaskar_scoopstorey</span>
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
              Order Confirmed!
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Order ID: <strong className="text-pink-600">{orderCompleteData.orderId}</strong>
            </p>

            <div className="my-5 p-4 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/70 text-left text-xs space-y-2 border border-pink-100 dark:border-pink-900/30">
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-100">₹{orderCompleteData.totalINR} (${orderCompleteData.totalUSD})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">{orderCompleteData.date}</span>
              </div>
              {orderCompleteData.filmOnReel && (
                <div className="flex justify-between text-pink-600 dark:text-pink-400 font-semibold">
                  <span>Tagged for IG Reel:</span>
                  <span>{orderCompleteData.filmOnReel}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-6 font-body">
              Bhaskar is now hand-selecting and preparing your mystery scoop with ASMR love. We will update you via Instagram!
            </p>

            <button
              onClick={() => {
                setOrderCompleteData(null);
                onClose();
              }}
              className="w-full btn-3d-pink text-white py-3 rounded-xl font-display font-bold text-sm"
            >
              Back to Scoop Storey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
