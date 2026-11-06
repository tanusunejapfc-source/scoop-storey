import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Film, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { getStoredOrders } from '../utils/orderStore';
import WhatsAppIcon from './WhatsAppIcon';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Prepaid order details received' },
  { key: 'payment', label: 'Payment Verified', desc: 'UPI QR / UTR verified' },
  { key: 'packing', label: 'Packing on IG Reel', desc: 'Custom ASMR packing video' },
  { key: 'dispatched', label: 'Dispatched / In Transit', desc: 'Handed to courier partner' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered to your doorstep' }
];

function getStepIndex(status) {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s.includes('deliver')) return 4;
  if (s.includes('dispatch') || s.includes('transit') || s.includes('shipped')) return 3;
  if (s.includes('packing') || s.includes('reel') || s.includes('film')) return 2;
  if (s.includes('verif') || s.includes('confirm') || s.includes('received') || s.includes('paid')) return 1;
  return 0;
}

export default function OrderTrackingModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const orders = getStoredOrders() || [];
      setAllOrders(orders);
      if (initialQuery) {
        setQuery(initialQuery);
        handleLookup(initialQuery, orders);
      } else if (orders.length > 0 && !matchedOrder) {
        // Pre-select latest order for quick preview
        setQuery(orders[0].orderId);
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleLookup = (searchStr = query, ordersList = allOrders) => {
    const q = (searchStr || '').trim().toLowerCase().replace(/^#/, '');
    setSearched(true);
    soundFX.playPop(520);

    if (!q) {
      setMatchedOrder(null);
      return;
    }

    // Match by exact or partial orderId, or customer phone, or customer name
    const found = ordersList.find(order => {
      const id = (order.orderId || '').toLowerCase();
      const phone = (order.customer?.phone || '').toLowerCase().replace(/\D/g, '');
      const cleanQ = q.replace(/\D/g, '');
      const name = (order.customer?.fullName || '').toLowerCase();
      const reel = (order.filmOnReel || '').toLowerCase();

      return (
        id === q ||
        id.includes(q) ||
        (cleanQ.length >= 6 && phone.includes(cleanQ)) ||
        (name.length >= 3 && name.includes(q)) ||
        (reel && reel.includes(q))
      );
    });

    setMatchedOrder(found || null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  const currentStep = matchedOrder ? getStepIndex(matchedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#1A1326] border-2 border-pink-200 dark:border-pink-900/60 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-pink-100 dark:border-pink-900/40 bg-gradient-to-r from-pink-50/70 via-rose-50/50 to-purple-50/70 dark:from-neutral-900 dark:to-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-neutral-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>Track Your Order</span>
                <span className="text-xs">🚚</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Live status, courier tracking & IG Reel packing updates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop(420);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-pink-100/70 hover:bg-pink-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Lookup Input Bar */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Search by Order ID or 10-Digit Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. SS-924110 or 9819922653"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pink-50/40 dark:bg-neutral-800/80 border-2 border-pink-200/80 dark:border-neutral-700 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#E60067]"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E60067] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition shrink-0"
              >
                Track Now
              </button>
            </div>

            {/* Quick Chips */}
            {allOrders.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-neutral-500">
                <span className="font-semibold text-neutral-400">Recent orders:</span>
                {allOrders.slice(0, 3).map((ord) => (
                  <button
                    key={ord.orderId}
                    type="button"
                    onClick={() => {
                      setQuery(ord.orderId);
                      handleLookup(ord.orderId);
                    }}
                    className="px-2 py-0.5 rounded-full bg-pink-100/70 hover:bg-pink-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-300 font-bold transition"
                  >
                    #{ord.orderId}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* When an Order is Matched */}
          {matchedOrder ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Top Overview Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50/50 to-pink-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border border-pink-200 dark:border-pink-900/50">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm sm:text-base text-neutral-900 dark:text-white">
                      Order #{matchedOrder.orderId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {matchedOrder.status || 'Order Confirmed'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400 block">Total Amount</span>
                    <span className="font-display font-black text-sm text-[#E60067] dark:text-pink-400">
                      ₹{matchedOrder.totalINR || matchedOrder.subtotalINR || 0}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block">Placed On</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-pink-500" />
                      {matchedOrder.date || 'Recent'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block">Recipient</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate block">
                      {matchedOrder.customer?.fullName || 'Collector'}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-neutral-400 block">Delivery Destination</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-pink-500 shrink-0" />
                      {matchedOrder.customer?.city || 'India'}, {matchedOrder.customer?.pincode || ''}
                    </span>
                  </div>
                </div>

                {/* IG Reel Request Tag if any */}
                {matchedOrder.filmOnReel && (
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-100/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center gap-2 text-xs text-purple-900 dark:text-purple-300 font-medium">
                    <Film className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>
                      ASMR Reel packing scheduled for <strong className="font-bold underline">{matchedOrder.filmOnReel}</strong>! 🎥
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Stepper */}
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-pink-100 dark:border-neutral-800 space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60067]" />
                  <span>Tracking Milestones</span>
                </h4>

                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-pink-100 dark:before:bg-neutral-800">
                  {STATUS_STEPS.map((step, idx) => {
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="relative flex items-start gap-3 pl-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                          isPassed
                            ? 'bg-gradient-to-tr from-[#E60067] to-purple-600 text-white shadow-xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                        } ${isCurrent ? 'ring-4 ring-pink-200 dark:ring-pink-950 scale-105' : ''}`}>
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${
                              isPassed 
                                ? 'text-neutral-900 dark:text-white' 
                                : 'text-neutral-400 dark:text-neutral-500'
                            }`}>
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-pink-100 text-[#E60067] dark:bg-pink-950 dark:text-pink-300 font-extrabold px-1.5 py-0.2 rounded-full">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in Order */}
              {matchedOrder.items && matchedOrder.items.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-pink-100 dark:border-neutral-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#E60067]" />
                    <span>Items In This Package ({matchedOrder.items.length})</span>
                  </h4>

                  <div className="divide-y divide-pink-50 dark:divide-neutral-800">
                    {matchedOrder.items.map((item, i) => (
                      <div key={i} className="py-2 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image || '/images/deluxe-giftbox.jpg'}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-pink-100 dark:border-neutral-700 shrink-0"
                            onError={(e) => { e.currentTarget.src = '/brand-avatar.jpg'; }}
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-neutral-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                              Qty: {item.qty} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-neutral-800 dark:text-neutral-200 shrink-0">
                          ₹{(item.priceINR || item.price || 0) * (item.qty || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct WhatsApp Support */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Have questions regarding your delivery or Reel recording?</span>
                </div>
                <a
                  href={`https://wa.me/918199922653?text=${encodeURIComponent(`Hi Bhaskar! Please give me a live update on my Scoop Storey order #${matchedOrder.orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Ask Bhaskar on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : searched ? (
            /* Not Found State */
            <div className="p-8 text-center space-y-3 rounded-2xl bg-pink-50/50 dark:bg-neutral-800/40 border border-pink-100 dark:border-neutral-800">
              <div className="w-12 h-12 mx-auto rounded-full bg-pink-100 dark:bg-neutral-800 text-pink-500 flex items-center justify-center text-xl">
                🔎
              </div>
              <h4 className="font-display font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                No Order Found for "{query}"
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Please double-check your 6-digit Order ID (like SS-924110) or your registered 10-digit mobile number.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/918199922653?text=${encodeURIComponent(`Hi Bhaskar! I placed an order with query "${query}". Could you please check its status?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Inquire Directly on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            /* Idle Instruction */
            <div className="p-8 text-center space-y-2 rounded-2xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
              <Package className="w-8 h-8 mx-auto text-[#E60067] mb-2 opacity-80" />
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                Enter your Order ID or registered phone number above to track live shipping.
              </p>
              <p>Dispatched orders receive automatic delivery updates and courier tracking numbers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
