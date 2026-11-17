import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Heart,
  Camera,
  ThumbsUp,
  PenTool
} from 'lucide-react';
import { soundFX } from '../utils/audio';
// Direct inquiries on WhatsApp (orders placed strictly via Cart UPI QR)
import { lookupPincode } from '../utils/pincodeApi';
import { useWishlist } from '../utils/wishlistStore';
import { useReviews } from '../utils/reviewStore';
import WhatsAppIcon from './WhatsAppIcon';
import { MYSTERY_SCOOP_CATEGORIES } from '../data/storeData';

export default function ProductDetailPage({
  product,
  onClose,
  onAddToCart,
  allProducts = [],
  onSelectProduct,
  onOpenReviewModal,
  activeCollection,
  onSelectCollection
}) {
  const baseImages = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : []);

  const colors = useMemo(() => {
    return (product?.colors && product.colors.length > 0)
      ? product.colors
      : [{ name: 'Standard', hex: '#E5C158' }];
  }, [product?.colors]);

  // Build complete images array including any custom images linked to specific colors
  const images = useMemo(() => {
    const list = [...baseImages];
    if (Array.isArray(colors)) {
      for (const col of colors) {
        if (col.image && !list.includes(col.image)) {
          list.push(col.image);
        }
      }
    }
    return list.length > 0 ? list : ['/images/deluxe-giftbox.jpg'];
  }, [baseImages, colors]);

  // Helper: locate matching image index for any color variant (exact, keyword, or positional)
  const findImageIndexForColor = (color) => {
    if (!color) return 0;

    // 1. Explicitly assigned image on color object
    if (color.image) {
      const idx = images.findIndex(img => img === color.image);
      if (idx !== -1) return idx;
    }

    // 2. Keyword/Name match: check if any image URL/filename contains color name
    const colorName = color.name?.toLowerCase().trim();
    if (colorName && colorName !== 'standard') {
      const foundIdx = images.findIndex(img => {
        const lower = img.toLowerCase();
        if (lower.includes(colorName)) return true;
        const words = colorName.split(/[\s-_/]+/).filter(w => w.length > 2);
        return words.some(w => lower.includes(w));
      });
      if (foundIdx !== -1) return foundIdx;
    }

    // 3. Positional fallback (e.g. 2nd color matches 2nd photo if image count aligns)
    const colorIdx = colors.findIndex(c => c.name === color.name);
    if (colorIdx !== -1 && colorIdx < images.length) {
      return colorIdx;
    }

    return 0;
  };

  const [activeImageIndex, setActiveImageIndex] = useState(() => {
    return findImageIndexForColor(colors[0]);
  });
  const [selectedColor, setSelectedColor] = useState(() => colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'includes' | 'shipping' | 'scoopChart' | 'reviews'
  const [detailLightboxImg, setDetailLightboxImg] = useState(null);
  const [justAdded, setJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();

  // Live product reviews from reviewStore
  const { publishedReviews: allPublishedReviews, summary: productReviewSummary } = useReviews(product?.id);
  const productReviews = useMemo(() => {
    if (!product?.id) return [];
    return allPublishedReviews
      .filter(r => r.productId === product.id)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [allPublishedReviews, product?.id]);

  const activeRating = productReviewSummary.total > 0 ? productReviewSummary.average : (product?.rating || 4.9);
  const activeReviewsCount = productReviews.length > 0 ? productReviews.length : (product?.reviewsCount || 124);

  // Ultra-Smooth Touch & Finger Swipe for Image Carousel
  const [touchDelta, setTouchDelta] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0, isHorizontal: null });


  // Related products from same or complementary categories
  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(allProducts) || allProducts.length === 0) return [];
    const sameCat = allProducts.filter(p => p.id !== product.id && p.category === product.category);
    const otherCat = allProducts.filter(p => p.id !== product.id && p.category !== product.category);
    return [...sameCat, ...otherCat].slice(0, 4);
  }, [product, allProducts]);

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
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
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

  // When product changes, align selected color and gallery image
  useEffect(() => {
    if (!product) return;
    const initialColor = colors[0];
    setSelectedColor(initialColor);
    const initialIdx = findImageIndexForColor(initialColor);
    setActiveImageIndex(initialIdx);
  }, [product?.id, colors]);

  if (!product) return null;

  const handleSelectImageIndex = (idx) => {
    setActiveImageIndex(idx);
    soundFX.playPop(400);

    const targetImg = images[idx];
    if (!targetImg) return;

    // 1. Direct match with color.image
    const directColor = colors.find(c => c.image === targetImg);
    if (directColor) {
      setSelectedColor(directColor);
      return;
    }

    // 2. Keyword match
    const lower = targetImg.toLowerCase();
    const keywordColor = colors.find(c => {
      const cName = c.name?.toLowerCase().trim();
      if (!cName || cName === 'standard') return false;
      if (lower.includes(cName)) return true;
      const words = cName.split(/[\s-_/]+/).filter(w => w.length > 2);
      return words.some(w => lower.includes(w));
    });
    if (keywordColor) {
      setSelectedColor(keywordColor);
      return;
    }

    // 3. Positional fallback if no explicit images assigned to colors
    const anyHasAssigned = colors.some(c => c.image);
    if (!anyHasAssigned && idx < colors.length) {
      setSelectedColor(colors[idx]);
    }
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    soundFX.playPop(450);
    const nextIdx = (activeImageIndex - 1 + images.length) % images.length;
    handleSelectImageIndex(nextIdx);
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    soundFX.playPop(550);
    const nextIdx = (activeImageIndex + 1) % images.length;
    handleSelectImageIndex(nextIdx);
  };


  const handleTouchStart = (e) => {
    if (images.length <= 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      isHorizontal: null
    };
    setIsSwiping(true);
    setTouchDelta(0);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping || images.length <= 1) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;

    if (touchStartRef.current.isHorizontal === null) {
      if (Math.abs(diffX) >= 6 || Math.abs(diffY) >= 6) {
        touchStartRef.current.isHorizontal = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (touchStartRef.current.isHorizontal) {
      // Elastic rubber-band resistance at boundaries
      const isAtFirst = activeImageIndex === 0 && diffX > 0;
      const isAtLast = activeImageIndex === images.length - 1 && diffX < 0;

      let effectiveDelta = diffX;
      if (isAtFirst || isAtLast) {
        effectiveDelta = diffX * 0.32;
      }
      setTouchDelta(effectiveDelta);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    if (touchStartRef.current.isHorizontal) {
      const elapsed = Date.now() - touchStartRef.current.time;
      const isQuickFlick = elapsed < 260 && Math.abs(touchDelta) > 25;
      const isPastThreshold = Math.abs(touchDelta) > 45;

      if (isQuickFlick || isPastThreshold) {
        if (touchDelta < 0 && activeImageIndex < images.length - 1) {
          soundFX.playPop(550);
          handleSelectImageIndex(activeImageIndex + 1);
        } else if (touchDelta > 0 && activeImageIndex > 0) {
          soundFX.playPop(450);
          handleSelectImageIndex(activeImageIndex - 1);
        } else if (touchDelta < 0 && activeImageIndex === images.length - 1 && images.length > 1) {
          soundFX.playPop(550);
          handleSelectImageIndex(0);
        } else if (touchDelta > 0 && activeImageIndex === 0 && images.length > 1) {
          soundFX.playPop(450);
          handleSelectImageIndex(images.length - 1);
        }
      }
    }

    setTouchDelta(0);
    touchStartRef.current.isHorizontal = null;
  };

  const handleMouseDown = (e) => {
    if (images.length <= 1) return;
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      isHorizontal: true
    };
    setIsSwiping(true);
    setTouchDelta(0);
  };

  const handleMouseMove = (e) => {
    if (!isSwiping || images.length <= 1 || !touchStartRef.current.isHorizontal) return;
    const diffX = e.clientX - touchStartRef.current.x;
    const isAtFirst = activeImageIndex === 0 && diffX > 0;
    const isAtLast = activeImageIndex === images.length - 1 && diffX < 0;
    let effectiveDelta = diffX;
    if (isAtFirst || isAtLast) {
      effectiveDelta = diffX * 0.32;
    }
    setTouchDelta(effectiveDelta);
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    handleTouchEnd();
  };

  const handleSelectColor = (color) => {
    soundFX.playPop(600);
    setSelectedColor(color);
    const targetIdx = findImageIndexForColor(color);
    if (targetIdx !== -1) {
      setActiveImageIndex(targetIdx);
    }
  };

  const handleAdd = () => {
    soundFX.playPop(700);
    soundFX.playSuccess();
    const variantImage = selectedColor?.image || images[activeImageIndex] || product.image;
    onAddToCart({
      ...product,
      image: variantImage,
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
    <div className="w-full min-h-[85vh] bg-[var(--bg-page)] text-[var(--text-main)] py-4 sm:py-8 animate-fadeIn pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Top Header & Breadcrumbs Actions (Shopify Standard Layout) */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 min-w-0 flex-wrap">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-1.5 rounded-2xl bg-pink-100/90 hover:bg-pink-200 dark:bg-pink-950/80 text-[#E60067] dark:text-pink-300 font-display font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs shrink-0"
              aria-label="Back to collection"
            >
              <ChevronLeft className="w-4 h-4 text-[#E60067]" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCollection ? onSelectCollection(null) : onClose()}
              className="hover:text-[#E60067] dark:hover:text-pink-400 hover:underline cursor-pointer transition hidden sm:inline"
            >
              Home
            </button>
            <span className="hidden sm:inline">/</span>
            <button
              type="button"
              onClick={() => onSelectCollection ? onSelectCollection(product.category) : onClose()}
              className="hover:text-[#E60067] dark:hover:text-pink-400 hover:underline cursor-pointer transition truncate max-w-[150px] sm:max-w-none"
            >
              {product.category}
            </button>
            <span>/</span>
            <span className="text-[#E60067] dark:text-pink-400 font-bold truncate max-w-[180px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 hover:bg-pink-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5 text-[#E60067]" />
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`px-3 py-1.5 rounded-xl border transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isWishlisted(product.id)
                  ? 'bg-[#E60067] text-white border-[#E60067]'
                  : 'bg-white dark:bg-neutral-800 border-pink-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-pink-50'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-white text-white' : 'text-[#E60067]'}`} />
              <span className="hidden sm:inline">{isWishlisted(product.id) ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Content Body: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Image Gallery (7 cols on large desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4">
            {/* Main Image Stage (4:5 Standard E-Commerce Ratio) with Touch Swipe Support */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-pink-200/80 dark:border-pink-900/50 shadow-sm group select-none touch-pan-y cursor-grab active:cursor-grabbing"
            >
              {/* Horizontal Filmstrip of Images */}
              <div 
                className="flex h-full w-full"
                style={{
                  transform: `translateX(calc(-${activeImageIndex * 100}% + ${touchDelta}px))`,
                  transition: isSwiping ? 'none' : 'transform 0.34s cubic-bezier(0.2, 0.85, 0.25, 1)'
                }}
              >
                {images.map((img, i) => (
                  <div key={i} className="w-full h-full shrink-0 relative">
                    <img
                      src={img}
                      alt={`${product.name} - ${i + 1}`}
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                      }}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  </div>
                ))}
              </div>

              {/* Badge */}
              <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-black text-[#E60067] dark:text-pink-400 shadow-sm border border-pink-200/60 dark:border-pink-800 pointer-events-none">
                {product.badge || 'Kawaii Favorite ✨'}
              </span>

              {/* Prev / Next Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-white shadow-md hover:bg-pink-100 dark:hover:bg-neutral-800 transition z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-white shadow-md hover:bg-pink-100 dark:hover:bg-neutral-800 transition z-10 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Slide Dots Indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md pointer-events-none">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`transition-all rounded-full ${
                        i === activeImageIndex 
                          ? 'w-4 h-1.5 bg-[#E60067]' 
                          : 'w-1.5 h-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter Pill */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-white z-10 pointer-events-none">
                {activeImageIndex + 1} / {images.length}
              </div>

              {/* Reel Tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white shadow-xs z-10 pointer-events-none">
                <Video className="w-3 h-3 text-pink-400" />
                <span>IG Reel Packing</span>
              </div>
            </div>

            {/* Thumbnail Strip (Color Variants & Gallery) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2.5 px-2 scrollbar-none">
                {images.map((img, idx) => {
                  const isSelected = activeImageIndex === idx;
                  const matchedColor = colors.find(c => c.image === img);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-xl p-0.5 shrink-0 transition-all bg-white dark:bg-neutral-800 cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-[#E60067] shadow-lg shadow-pink-500/25'
                          : 'ring-1 ring-pink-200/80 dark:ring-neutral-700 opacity-75 hover:opacity-100 hover:ring-pink-400'
                      }`}
                    >
                      <div className="w-full h-full rounded-[10px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                          }}
                        />
                        {matchedColor && (
                          <span 
                            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: matchedColor.hex }}
                            title={`Color: ${matchedColor.name}`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
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
                <span>100% Free Shipping</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Controls (5 cols on large desktop, sticky buy box) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between space-y-6 lg:sticky lg:top-24 lg:self-start bg-white/70 dark:bg-[#1E172E]/70 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-pink-200/80 dark:border-pink-900/60 shadow-lg">
            <div>
              {/* Product Title & Reviews */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reviews');
                      soundFX.playPop(450);
                    }}
                    className="flex items-center gap-1 text-amber-500 font-bold hover:underline cursor-pointer"
                    title="Read customer reviews"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{typeof activeRating === 'number' ? activeRating.toFixed(1) : activeRating}</span>
                  </button>
                  <span className="text-neutral-400">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reviews');
                      soundFX.playPop(450);
                    }}
                    className="text-neutral-500 dark:text-neutral-400 font-medium hover:text-[#E60067] cursor-pointer"
                    title="Read customer reviews"
                  >
                    {activeReviewsCount} {productReviews.length > 0 ? 'Verified Reviews' : 'Verified Unboxings'}
                  </button>
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

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 p-1">
                  {colors.map((c, i) => {
                    const isSelected = (selectedColor?.name || colors[0]?.name) === c.name;
                    const colorTargetIdx = findImageIndexForColor(c);
                    const colorThumb = c.image || (colorTargetIdx !== -1 ? images[colorTargetIdx] : null);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectColor(c)}
                        className={`group relative flex items-center justify-between gap-2 px-3 py-2 rounded-xl border-2 transition-all cursor-pointer w-full text-left ${
                          isSelected
                            ? 'border-[#E60067] bg-white dark:bg-neutral-900 shadow-md ring-2 ring-pink-400/30'
                            : 'border-pink-200/90 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 hover:border-pink-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {colorThumb ? (
                            <div className="relative w-5 h-5 rounded-md overflow-hidden border border-black/15 shrink-0 bg-neutral-100">
                              <img
                                src={colorThumb}
                                alt={c.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <span 
                                className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
                                style={{ backgroundColor: c.hex }}
                              />
                            </div>
                          ) : (
                            <span 
                              className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0" 
                              style={{ backgroundColor: c.hex }}
                            />
                          )}
                          <span className={`text-xs font-bold truncate ${
                            isSelected ? 'text-[#E60067] dark:text-pink-400' : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {c.name}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUANTITY & ACTIONS */}
              <div className="mt-5 space-y-3">
                {/* Desktop In-Flow Add to Bag Button (Hidden on Mobile, where the sticky bottom bar is used) */}
                <div className="hidden sm:flex items-center gap-2.5 sm:gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center rounded-2xl bg-pink-100/70 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 p-1 shrink-0">
                    <button
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1));
                        soundFX.playPop(420);
                      }}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-white shadow-xs hover:bg-pink-50 transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 sm:w-10 text-center font-display font-extrabold text-sm text-neutral-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        setQuantity(quantity + 1);
                        soundFX.playPop(520);
                      }}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-white shadow-xs hover:bg-pink-50 transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Primary Button */}
                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-3 sm:px-5 rounded-2xl font-display font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'btn-3d-pink text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white shrink-0" />
                        <span className="truncate">Added to Bag! (₹{totalPrice})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white shrink-0" />
                        <span className="truncate">Add to Bag • ₹{totalPrice}</span>
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
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                    100% Free Delivery
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
                  {product.category === 'Mystery Scoops' && (
                    <button
                      onClick={() => {
                        setActiveTab('scoopChart');
                        soundFX.playPop(450);
                      }}
                      className={`pb-2 text-xs font-bold transition border-b-2 flex items-center gap-1 ${
                        activeTab === 'scoopChart'
                          ? 'border-[#E60067] text-[#E60067] dark:text-pink-400'
                          : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span>Scoop Items (54)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveTab('reviews');
                      soundFX.playPop(450);
                    }}
                    className={`pb-2 text-xs font-bold transition border-b-2 flex items-center gap-1 ${
                      activeTab === 'reviews'
                        ? 'border-[#E60067] text-[#E60067] dark:text-pink-400'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Reviews ({productReviews.length})</span>
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
                    <p>• <strong>Delivery:</strong> 100% Free Express Delivery across India on all prepaid orders.</p>
                    <p>• <strong>Packaging:</strong> Packed with cute ASMR aesthetic on Instagram Reels upon request!</p>
                  </div>
                )}

                {/* Tab 4: Scoop Items (54) */}
                {activeTab === 'scoopChart' && (
                  <div className="space-y-3 text-xs animate-fadeIn">
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-200 dark:border-pink-800/50 flex items-center justify-between">
                      <span className="font-bold text-[#E60067] dark:text-pink-300">
                        Official 54-Item Scoop Board
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500">
                        Swipe gallery to see board photo 📸
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {MYSTERY_SCOOP_CATEGORIES.map(cat => (
                        <div key={cat.id} className="p-3 rounded-xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-700">
                          <div className="flex items-center justify-between mb-2 font-bold text-neutral-900 dark:text-white">
                            <span className="flex items-center gap-1.5 text-xs">
                              <span>{cat.icon}</span>
                              <span>{cat.title}</span>
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 dark:bg-pink-900/60 text-[#E60067] dark:text-pink-300 font-black">
                              {cat.badge}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] text-neutral-700 dark:text-neutral-300">
                            {cat.items.map(item => (
                              <div key={item.id} className="flex items-center gap-1.5 truncate p-1 rounded-md bg-white/70 dark:bg-neutral-900/70 border border-pink-100/60 dark:border-neutral-800">
                                <span className="text-xs shrink-0">{item.icon}</span>
                                <span className="font-semibold truncate">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 5: Customer Reviews */}
                {activeTab === 'reviews' && (
                  <div className="space-y-3.5 text-xs animate-fadeIn">
                    {/* Header with average & CTA */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50/80 via-purple-50/60 to-pink-50/80 dark:from-neutral-800/90 dark:via-neutral-800/60 dark:to-neutral-800/90 border border-pink-200/80 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-display font-black text-neutral-900 dark:text-white">
                            {typeof activeRating === 'number' ? activeRating.toFixed(1) : activeRating}
                          </span>
                          <span className="text-neutral-400 font-bold text-[11px]">/ 5.0</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3.5 h-3.5 ${s <= Math.round(Number(activeRating)) ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-neutral-500 font-semibold text-[11px]">
                          ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playPop(500);
                          if (onOpenReviewModal) onOpenReviewModal(product);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Write Review</span>
                      </button>
                    </div>

                    {/* Reviews List */}
                    {productReviews.length === 0 ? (
                      <div className="text-center py-6 px-4 bg-pink-50/40 dark:bg-neutral-800/40 rounded-2xl border border-dashed border-pink-200 dark:border-neutral-700 space-y-2">
                        <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                          No reviews for this product yet!
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Be the first verified customer to share photos and receive extra charms!
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.playPop(500);
                            if (onOpenReviewModal) onOpenReviewModal(product);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-neutral-700 text-[#E60067] dark:text-pink-300 font-bold text-xs transition cursor-pointer"
                        >
                          Be the First to Review
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {productReviews.map((rev) => (
                          <div 
                            key={rev.id} 
                            className="p-3 rounded-2xl bg-white dark:bg-neutral-800/80 border border-pink-100 dark:border-neutral-700 space-y-1.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="font-bold text-neutral-900 dark:text-white text-xs">
                                  {rev.customerName}
                                </span>
                                {rev.verifiedBuyer && (
                                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>Verified</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-400 font-bold">{rev.date || 'Recently'}</span>
                            </div>

                            {rev.title && (
                              <h5 className="font-bold text-xs text-neutral-900 dark:text-white">
                                "{rev.title}"
                              </h5>
                            )}
                            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                              {rev.comment}
                            </p>

                            {/* Images */}
                            {rev.images && rev.images.length > 0 && (
                              <div className="flex items-center gap-2 pt-1">
                                {rev.images.map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setDetailLightboxImg(img)}
                                    className="w-12 h-12 rounded-lg overflow-hidden border border-pink-200 dark:border-neutral-700 cursor-pointer hover:opacity-80 transition"
                                  >
                                    <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* You May Also Love (Related Products) */}
            {relatedProducts.length > 0 && (
              <div className="pt-5 border-t border-pink-100 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E60067]" />
                    <span>You May Also Love</span>
                  </h4>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">
                    Matches with this piece ✨
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        soundFX.playPop(520);
                        if (onSelectProduct) onSelectProduct(rel);
                      }}
                      className="group p-2 rounded-2xl bg-pink-50/50 hover:bg-pink-100/70 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 border border-pink-200/60 dark:border-neutral-700 cursor-pointer transition text-left"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-neutral-900 mb-1.5 border border-pink-100 dark:border-neutral-800">
                        <img
                          src={rel.image || (rel.images?.[0]) || '/images/deluxe-giftbox.jpg'}
                          alt={rel.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="font-display font-bold text-[11px] text-neutral-800 dark:text-neutral-200 truncate leading-tight">
                        {rel.name}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-black text-xs text-[#E60067] dark:text-pink-400">
                          ₹{rel.priceINR || rel.price}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 group-hover:bg-[#E60067] group-hover:text-white group-hover:border-transparent transition">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom mini helper */}
            <div className="pt-2 text-center text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Every parcel is hand-packed by Tanu with love & surprises 🎀
            </div>
          </div>
        </div>

        {/* Mobile Sticky Quick Add to Bag Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-2.5 bg-white/95 dark:bg-[#1E172E]/95 backdrop-blur-md border-t border-pink-200 dark:border-pink-900/60 shadow-[0_-8px_20px_rgba(0,0,0,0.12)] flex items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-pink-100/70 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 p-0.5 shrink-0">
            <button
              onClick={() => {
                setQuantity(Math.max(1, quantity - 1));
                soundFX.playPop(420);
              }}
              className="w-7 h-7 rounded-lg bg-white dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-white text-xs shadow-xs"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-7 text-center font-display font-extrabold text-xs text-neutral-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => {
                setQuantity(quantity + 1);
                soundFX.playPop(520);
              }}
              className="w-7 h-7 rounded-lg bg-white dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-800 dark:text-white text-xs shadow-xs"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'btn-3d-pink text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">Added to Bag! (₹{totalPrice})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">Add to Bag • ₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DETAIL REVIEW PHOTO LIGHTBOX */}
      {detailLightboxImg && (
        <div 
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDetailLightboxImg(null)}
        >
          <div 
            className="relative max-w-lg max-h-[80vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-pink-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetailLightboxImg(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={detailLightboxImg} 
              alt="Customer unboxing photo" 
              className="w-full max-h-[75vh] object-contain bg-neutral-950" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
