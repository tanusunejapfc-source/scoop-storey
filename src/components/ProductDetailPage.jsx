import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Video, 
  Share2,
  Gift,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';
import { soundFX } from '../utils/audio';
// Direct inquiries on WhatsApp (orders placed strictly via Cart UPI QR)
import { lookupPincode } from '../utils/pincodeApi';
import { useWishlist } from '../utils/wishlistStore';
import WhatsAppIcon from './WhatsAppIcon';

export default function ProductDetailPage({
  product,
  onClose,
  onAddToCart
}) {
  const images = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : []);

  const colors = (product?.colors && product.colors.length > 0)
    ? product.colors
    : [{ name: 'Standard', hex: '#E5C158' }];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(() => colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'includes' | 'shipping'
  const [justAdded, setJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  // Delivery & PIN Code Estimator State
  const [pincodeInput, setPincodeInput] = useState(() => {
    try {
      const saved = localStorage.getItem('bhaskar_delivery_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.pincode || '';
      }
    } catch {}
    return '';
  });
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [pincodeError, setPincodeError] = useState('');

  const getEstimatedDeliveryRange = (daysMin = 3, daysMax = 5) => {
    const now = new Date();
    const minDate = new Date(now.getTime() + daysMin * 24 * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() + daysMax * 24 * 60 * 60 * 1000);
    const opts = { weekday: 'short', month: 'short', day: 'numeric' };
    return `${minDate.toLocaleDateString('en-IN', opts)} – ${maxDate.toLocaleDateString('en-IN', opts)}`;
  };

  const handleCheckPincode = async (overridePin) => {
    const pin = (overridePin !== undefined ? overridePin : pincodeInput).trim().replace(/\D/g, '').slice(0, 6);
    if (pin.length !== 6) {
      setPincodeError('Please enter a valid 6-digit PIN code');
      setDeliveryInfo(null);
      return;
    }
    setPincodeLoading(true);
    setPincodeError('');
    try {
      const result = await lookupPincode(pin);
      if (result.success) {
        setDeliveryInfo({
          city: result.city,
          state: result.state,
          dateRange: getEstimatedDeliveryRange(3, 5),
          pincode: pin
        });
        soundFX.playPop(580);
      } else {
        setDeliveryInfo({
          city: 'Across India',
          state: '',
          dateRange: getEstimatedDeliveryRange(3, 5),
          pincode: pin
        });
      }
    } catch {
      setDeliveryInfo({
        city: 'Across India',
        state: '',
        dateRange: getEstimatedDeliveryRange(3, 5),
        pincode: pin
      });
    } finally {
      setPincodeLoading(false);
    }
  };

  // Auto-verify if saved pincode already exists
  useEffect(() => {
    if (pincodeInput && pincodeInput.length === 6 && !deliveryInfo) {
      handleCheckPincode(pincodeInput);
    }
  }, []);

  const handleGiftHint = () => {
    soundFX.playPop(520);
    const shareUrl = window.location.href;
    const msg = `Hey! 💖 I saw this gorgeous "${product.name}" (${selectedColor?.name || 'Standard'}) on Scoop Storey and totally loved it: ${shareUrl} ✨ Would make the dreamiest gift!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Handle ESC key to close
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    soundFX.playPop(450);
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    soundFX.playPop(550);
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleSelectColor = (color) => {
    soundFX.playPop(600);
    setSelectedColor(color);
  };

  const handleAdd = () => {
    soundFX.playPop(700);
    soundFX.playSuccess();
    onAddToCart({
      ...product,
      selectedColor: selectedColor?.name || 'Standard',
      selectedColorHex: selectedColor?.hex,
      qty: quantity
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const handleShare = () => {
    soundFX.playPop(500);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentImage = images[activeImageIndex] || product.image;
  const totalPrice = product.priceINR * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn">
      {/* Modal Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-[#1E172E] rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 flex flex-col animate-scaleUp"
      >
        {/* Top Header Actions */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/95 dark:bg-[#1E172E]/95 backdrop-blur-md border-b border-pink-100 dark:border-pink-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <span>Shop</span>
            <span>/</span>
            <span className="text-[#E60067] dark:text-pink-400 font-bold">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl glass-pill hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition text-xs flex items-center gap-1.5"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && <span className="text-[11px] font-bold text-pink-600">Copied!</span>}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-pill hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 transition"
              aria-label="Close Product Page"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 md:p-8">
          
          {/* LEFT: Image Gallery (5 cols) */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Image Stage */}
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-pink-50/30 dark:from-[#251A38] dark:to-[#181126] border border-pink-200/80 dark:border-pink-900/50 flex items-center justify-center p-4 shadow-sm group">
              <img
                src={currentImage}
                alt={`${product.name} - ${activeImageIndex + 1}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                }}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badge */}
              <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-black text-[#E60067] dark:text-pink-400 shadow-sm border border-pink-200/60 dark:border-pink-800">
                {product.badge || 'Kawaii Favorite ✨'}
              </span>

              {/* Prev / Next Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-white shadow-md hover:bg-pink-100 dark:hover:bg-neutral-800 transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-white shadow-md hover:bg-pink-100 dark:hover:bg-neutral-800 transition"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Image Counter Pill */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-white">
                {activeImageIndex + 1} / {images.length}
              </div>

              {/* Reel Tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white shadow-xs">
                <Video className="w-3 h-3 text-pink-400" />
                <span>IG Reel Packing</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      soundFX.playPop(400);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all p-1 bg-white dark:bg-neutral-800 ${
                      activeImageIndex === idx
                        ? 'border-[#E60067] ring-2 ring-pink-400/40 scale-105 shadow-md'
                        : 'border-pink-200 dark:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust highlights banner */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-700">
                <ShieldCheck className="w-4 h-4 text-[#E60067] shrink-0" />
                <span>Anti-Tarnish Safe</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/60 dark:bg-neutral-800/60 border border-purple-100 dark:border-neutral-700">
                <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Free Ship &gt; ₹499</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Controls (7 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Product Title & Reviews */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating || 4.9}</span>
                  </div>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                    {product.reviewsCount || 124} Verified Unboxings
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">In Stock</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-[#E60067] dark:text-pink-400">
                  ₹{product.priceINR}
                </span>
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  (100% Prepaid UPI / QR)
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                {product.description}
              </p>

              {/* COLOR / VARIANT SELECTOR */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-pink-50/60 to-purple-50/40 dark:from-neutral-800/70 dark:to-neutral-800/30 border border-pink-200/70 dark:border-pink-900/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    Choose Color / Finish:
                  </span>
                  <span className="font-black text-[#E60067] dark:text-pink-400">
                    {selectedColor?.name || colors[0]?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {colors.map((c, i) => {
                    const isSelected = (selectedColor?.name || colors[0]?.name) === c.name;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectColor(c)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-[#E60067] bg-white dark:bg-neutral-900 shadow-md ring-2 ring-pink-400/30'
                            : 'border-pink-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 hover:border-pink-300'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0" 
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className={`text-xs font-bold ${
                          isSelected ? 'text-[#E60067] dark:text-pink-400' : 'text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {c.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUANTITY & ACTIONS */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center rounded-2xl bg-pink-100/70 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 p-1">
                    <button
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1));
                        soundFX.playPop(420);
                      }}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-white shadow-xs hover:bg-pink-50 transition"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-display font-extrabold text-sm text-neutral-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        setQuantity(quantity + 1);
                        soundFX.playPop(520);
                      }}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-white shadow-xs hover:bg-pink-50 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Primary Button */}
                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-5 rounded-2xl font-display font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'btn-3d-pink text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Bag! (₹{totalPrice})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Add to Bag • ₹{totalPrice}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Inquire on WhatsApp Link */}
                <a
                  href={`https://wa.me/918199922653?text=${encodeURIComponent(
                    `Hi Scoop Storey! 🎀 Mujhe "${product.name}" (${selectedColor?.name || 'Standard'}) ke baare me inquiry karni hai. (Prepaid Store • Min 3 items)`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-display font-bold flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800 transition active:scale-[0.99]"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>Inquire about this piece on WhatsApp (+91 8199922653)</span>
                </a>

                {/* Secondary Actions: Wishlist, Drop Gift Hint & Share */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                      isWishlisted(product.id)
                        ? 'bg-[#E60067] text-white border-[#E60067] shadow-xs'
                        : 'bg-pink-50 hover:bg-pink-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-300 border-pink-200 dark:border-neutral-700'
                    }`}
                    title={isWishlisted(product.id) ? 'Saved in favorites' : 'Save to favorites'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-white' : ''}`} />
                    <span className="truncate">{isWishlisted(product.id) ? 'Saved' : 'Wishlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGiftHint}
                    className="py-2.5 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                    title="Send a cute hint to friends or partner on WhatsApp"
                  >
                    <Gift className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="truncate">Gift Hint 🎁</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="py-2.5 px-2 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-pink-200 dark:border-neutral-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-600 truncate">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                        <span className="truncate">Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ESTIMATED DELIVERY & PIN CODE CHECKER */}
              <div className="mt-5 p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-pink-200/80 dark:border-pink-900/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <Truck className="w-4 h-4 text-[#E60067] dark:text-pink-400" />
                    <span>Check Estimated Delivery & Pincode</span>
                  </div>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold uppercase">
                    Free over ₹499
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPincodeInput(val);
                        if (val.length === 6) {
                          handleCheckPincode(val);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCheckPincode();
                        }
                      }}
                      placeholder="Enter 6-digit PIN (e.g. 110001, 400050)"
                      className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-800 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#E60067]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCheckPincode()}
                    disabled={pincodeLoading}
                    className="px-3.5 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-[#E60067] dark:text-pink-300 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {pincodeLoading ? 'Checking...' : 'Check'}
                  </button>
                </div>

                {pincodeError && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {pincodeError}
                  </p>
                )}

                {deliveryInfo && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Deliverable to {deliveryInfo.city}{deliveryInfo.state ? `, ${deliveryInfo.state}` : ''} ({deliveryInfo.pincode})</span>
                      </span>
                      <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full font-black">
                        Prepaid Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Estimated delivery by <strong className="font-bold underline">{deliveryInfo.dateRange}</strong> (Express 3–5 Days)</span>
                    </p>
                  </div>
                )}
              </div>

              {/* SPECIFICATIONS & HIGHLIGHTS TABS */}
              <div className="mt-6 pt-5 border-t border-pink-100 dark:border-pink-900/40">
                <div className="flex border-b border-pink-100 dark:border-pink-900/40 gap-2 mb-3">
                  <button
                    onClick={() => {
                      setActiveTab('specs');
                      soundFX.playPop(450);
                    }}
                    className={`pb-2 text-xs font-bold transition border-b-2 ${
                      activeTab === 'specs'
                        ? 'border-[#E60067] text-[#E60067] dark:text-pink-400'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('includes');
                      soundFX.playPop(450);
                    }}
                    className={`pb-2 text-xs font-bold transition border-b-2 ${
                      activeTab === 'includes'
                        ? 'border-[#E60067] text-[#E60067] dark:text-pink-400'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    What's Included
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('shipping');
                      soundFX.playPop(450);
                    }}
                    className={`pb-2 text-xs font-bold transition border-b-2 ${
                      activeTab === 'shipping'
                        ? 'border-[#E60067] text-[#E60067] dark:text-pink-400'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Shipping & Policies
                  </button>
                </div>

                {/* Tab 1: Specifications */}
                {activeTab === 'specs' && (
                  <div className="space-y-2 text-xs animate-fadeIn">
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      Object.entries(product.specifications).map(([k, v], i) => (
                        <div 
                          key={i} 
                          className="flex justify-between py-1.5 border-b border-pink-50 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                        >
                          <span className="font-semibold text-neutral-500 dark:text-neutral-400 w-1/3 shrink-0">{k}:</span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 text-right">{v}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-neutral-500 text-xs py-2">
                        Anti-tarnish water-resistant finish, lightweight daily wear, skin-safe.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: What's Included */}
                {activeTab === 'includes' && (
                  <div className="space-y-2 text-xs animate-fadeIn">
                    {product.includes?.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Shipping & Policies */}
                {activeTab === 'shipping' && (
                  <div className="p-3 rounded-xl bg-pink-50/70 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-700 text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300 animate-fadeIn">
                    <p>• <strong>Order Rule:</strong> Minimum 3 Products Required to place an order.</p>
                    <p>• <strong>Payment:</strong> 100% Prepaid via UPI QR Code only.</p>
                    <p>• <strong>Delivery:</strong> Free across India on orders above ₹499 (Standard delivery ₹60).</p>
                    <p>• <strong>Packaging:</strong> Packed with cute ASMR aesthetic on Instagram Reels upon request!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom mini helper */}
            <div className="pt-2 text-center text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Every parcel is hand-packed by Bhaskar with love & surprises 🎀
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
