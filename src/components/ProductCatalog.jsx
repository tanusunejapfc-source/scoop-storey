import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Video, 
  Check, 
  AlertCircle,
  Eye,
  Images,
  Palette,
  Search,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Layers,
  X,
  Heart
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CATEGORIES, COLLECTIONS_CONFIG, categoryToSlug } from '../data/storeData';
import { DEFAULT_PRODUCTS } from '../utils/productStore';
import { saveOrderToStore } from '../utils/orderStore';
import { useWishlist } from '../utils/wishlistStore';
import WhatsAppIcon from './WhatsAppIcon';

export { DEFAULT_PRODUCTS as PRODUCTS };

export default function ProductCatalog({ 
  products = [], 
  onAddToCart, 
  onSelectProduct,
  activeCollection: controlledCollection,
  onSelectCollection
}) {
  // Support both controlled and uncontrolled collection state
  const [internalCollection, setInternalCollection] = useState(null);
  const activeCollection = controlledCollection !== undefined ? controlledCollection : internalCollection;

  const setActiveCollection = (col) => {
    if (onSelectCollection) {
      onSelectCollection(col);
    } else {
      setInternalCollection(col);
    }
  };

  const [addedItem, setAddedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const catalogRef = useRef(null);

  // Scroll to catalog section when collection is selected and push history entry
  const handleEnterCollection = (categoryName) => {
    soundFX.playPop(700);
    soundFX.playChime();
    setActiveCollection(categoryName);
    setSearchQuery('');
    setSortBy('featured');

    // Push history state so browser Back button returns to Collections Hub instead of exiting website
    if (categoryName) {
      const slug = categoryToSlug(categoryName);
      const targetHash = `#collection-${slug}`;
      if (window.location.hash !== targetHash) {
        try {
          window.history.pushState({ type: 'collection', category: categoryName }, '', window.location.pathname + targetHash);
        } catch {
          window.location.hash = targetHash;
        }
      }
    } else {
      if (window.location.hash !== '#collections') {
        try {
          window.history.pushState({ type: 'collections' }, '', window.location.pathname + '#collections');
        } catch {
          window.location.hash = '#collections';
        }
      }
    }

    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleBackToCollections = () => {
    soundFX.playPop(500);
    setActiveCollection(null);
    setSearchQuery('');

    // If currently on a collection hash, push #collections so browser Back won't exit
    if (window.location.hash.startsWith('#collection-')) {
      try {
        window.history.pushState({ type: 'collections' }, '', window.location.pathname + '#collections');
      } catch {
        window.location.hash = '#collections';
      }
    }

    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Build dynamic collections list, merging COLLECTIONS_CONFIG with any custom categories added in Admin
  const collections = useMemo(() => {
    const definedCategories = new Set(COLLECTIONS_CONFIG.map(c => c.category));
    const allUniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    const configured = COLLECTIONS_CONFIG.map(config => {
      const items = products.filter(p => p.category === config.category);
      const prices = items.map(p => p.priceINR).filter(Boolean);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 199;
      const previews = items.slice(0, 4).map(p => p.image || p.images?.[0]).filter(Boolean);

      return {
        ...config,
        itemsCount: items.length,
        minPrice,
        previews
      };
    });

    // Custom categories created by store admin that are not in default config
    const custom = allUniqueCategories
      .filter(cat => !definedCategories.has(cat))
      .map(cat => {
        const items = products.filter(p => p.category === cat);
        const prices = items.map(p => p.priceINR).filter(Boolean);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 199;
        const previews = items.slice(0, 4).map(p => p.image || p.images?.[0]).filter(Boolean);

        return {
          id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: cat,
          name: cat,
          icon: '✨',
          badge: 'Exclusive Curation 🎀',
          tagline: `Explore our ${cat} collection`,
          description: `Handpicked selection of items curated under ${cat}.`,
          coverImage: items[0]?.image || '/images/deluxe-giftbox.jpg',
          gradient: 'from-pink-500/15 via-rose-500/10 to-purple-500/20',
          borderHover: 'hover:border-pink-400',
          btnGradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
          itemsCount: items.length,
          minPrice,
          previews
        };
      });

    return [...configured, ...custom];
  }, [products]);

  // Active collection metadata object
  const currentCollectionMeta = useMemo(() => {
    if (!activeCollection || activeCollection === 'All Items') return null;
    return collections.find(c => c.category === activeCollection) || {
      name: activeCollection,
      category: activeCollection,
      icon: '✨',
      badge: 'Curated Category',
      tagline: `Exclusive ${activeCollection} selection`,
      description: `Explore authentic products under ${activeCollection}.`,
      coverImage: '/images/deluxe-giftbox.jpg'
    };
  }, [activeCollection, collections]);

  // Filtered & Sorted products for active collection view
  const activeProducts = useMemo(() => {
    let list = products;
    if (activeCollection && activeCollection !== 'All Items') {
      list = products.filter(p => p.category === activeCollection);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return sorted;
  }, [products, activeCollection, searchQuery, sortBy]);

  // Featured Hot Picks for Home Page (top 4 diverse bestsellers)
  const hotPicks = useMemo(() => {
    const picks = [
      products.find(p => p.id === 'scoop-mini') || products[0],
      products.find(p => p.category === 'Pendants & Chains'),
      products.find(p => p.category === 'Bracelets') || products.find(p => p.category === 'Anklets'),
      products.find(p => p.category === 'Korean Wallets') || products.find(p => p.category === 'Eye Masks') || products.find(p => p.category === 'Self-Care')
    ].filter(Boolean);

    // Ensure distinct items
    return Array.from(new Set(picks));
  }, [products]);

  const handleQuickAdd = (product, e) => {
    e?.stopPropagation();
    soundFX.playPop(650);
    soundFX.playChime();
    const defaultColor = product.colors?.[0]?.name || 'Standard';
    onAddToCart({
      ...product,
      selectedColor: defaultColor,
      selectedColorHex: product.colors?.[0]?.hex,
      qty: 1
    });
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleDirectWhatsAppOrder = (product, e) => {
    e?.stopPropagation();
    const orderId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;

    let savedAddress = null;
    try {
      const raw = localStorage.getItem('bhaskar_delivery_address');
      if (raw) savedAddress = JSON.parse(raw);
    } catch {
      // ignore
    }

    const directOrder = {
      orderId,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'Product Direct WhatsApp',
      status: 'WhatsApp Inquiry / Order',
      paymentMethod: 'WhatsApp Direct',
      customer: savedAddress || {
        fullName: 'WhatsApp Customer',
        phone: '',
        streetAddress: 'To be provided on WhatsApp',
        city: '',
        state: 'Maharashtra',
        pincode: ''
      },
      items: [
        {
          id: product.id,
          name: product.name,
          priceINR: product.priceINR,
          qty: 1,
          image: product.image || (Array.isArray(product.images) && product.images[0]) || '/images/deluxe-giftbox.jpg',
          selectedColor: product.colors?.[0]?.name || 'Standard',
          selectedColorHex: product.colors?.[0]?.hex || '#FFB6C1'
        }
      ],
      totalItemCount: 1,
      subtotalINR: product.priceINR,
      discountAmountINR: 0,
      shippingINR: product.priceINR >= 499 ? 0 : 60,
      totalINR: product.priceINR + (product.priceINR >= 499 ? 0 : 60),
      additionalNotes: 'Direct 1-Click WhatsApp Order from Catalog'
    };

    saveOrderToStore(directOrder);
    soundFX.playSuccess();

    const msg = `Hi Scoop Storey! 🎀 Mujhe yeh product order karna hai (Order ID: ${orderId}):\n\n• ${product.name}\n• Price: ₹${product.priceINR} (Prepaid)\n${savedAddress?.fullName ? `• Name: ${savedAddress.fullName}\n• Address: ${savedAddress.streetAddress}, ${savedAddress.city} (${savedAddress.pincode})\n` : ''}\nPlease send me the UPI QR code for payment! ✨`;
    window.open(`https://wa.me/918199922653?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="menu" ref={catalogRef} className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Policy Reminder Banner */}
      <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:from-[#261537] dark:via-[#341B49] dark:to-[#261537] border-2 border-pink-300 dark:border-pink-800/80 flex items-center justify-center gap-2 text-xs font-bold text-[#231733] dark:text-pink-100 text-center shadow-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#E60067] dark:text-pink-400" />
        <span>Order Rule: Minimum 3 Products Required to Checkout • 100% Prepaid Delivery Across India</span>
      </div>

      {/* ============================================================ */}
      {/* 1. COLLECTIONS HUB VIEW (Home Page Compact Showcase)          */}
      {/* ============================================================ */}
      {!activeCollection && (
        <div className="space-y-12 animate-fadeIn">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-extrabold tracking-wider uppercase mb-2 shadow-xs">
                <Layers className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400" />
                <span>Shop by Collection</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
                Explore Our Collections
              </h2>
              <p className="mt-2 text-[#554664] dark:text-[#E0D7EB] font-medium max-w-2xl text-sm md:text-base leading-relaxed">
                Choose a category to enter its dedicated collection, view all items, customize color finishes, and add pieces to your Scoop order.
              </p>
            </div>

            {/* Quick Browse All Toggle */}
            <button
              onClick={() => handleEnterCollection('All Items')}
              className="self-start md:self-end px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 border-2 border-pink-200 dark:border-pink-800 text-xs font-bold text-[#E60067] dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-neutral-700 transition flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <span>Browse All ({products.length}) Items</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Collections Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {collections.map((col) => (
              <div
                key={col.id}
                onClick={() => handleEnterCollection(col.category)}
                className="group relative rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-200/90 dark:border-pink-900/60 hover:border-pink-400 dark:hover:border-pink-500 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
              >
                <div>
                  {/* Collection Cover Image Container (16:10 Ratio) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-b from-pink-50/70 to-pink-100/40 dark:from-[#251A38] dark:to-[#181126]">
                    <img
                      src={col.coverImage}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-[11px] font-black text-[#E60067] dark:text-pink-400 shadow-xs border border-pink-200/60 dark:border-pink-800 flex items-center gap-1">
                        <span>{col.icon}</span>
                        <span>{col.badge}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-extrabold text-[11px] shadow-xs">
                        {col.itemsCount} Items
                      </span>
                    </div>

                    {/* Bottom overlay inside image: Starting Price */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-xl bg-pink-600/90 backdrop-blur-md text-white font-display font-extrabold text-xs shadow-md">
                        From ₹{col.minPrice}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{col.icon}</span>
                        <h3 className="font-display font-extrabold text-xl text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors">
                          {col.name}
                        </h3>
                      </div>
                      <p className="text-xs font-bold text-pink-600 dark:text-pink-400">
                        {col.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-[#554664] dark:text-[#D5CBE2] leading-relaxed line-clamp-2 font-medium">
                      {col.description}
                    </p>

                    {/* Product Preview Thumbnails Strip */}
                    {col.previews && col.previews.length > 0 && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Previews:
                        </span>
                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          {col.previews.map((thumb, idx) => (
                            <img
                              key={idx}
                              src={thumb}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-[#1E172E] shadow-xs"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    className="w-full py-3 px-4 rounded-2xl bg-pink-50 dark:bg-neutral-800 group-hover:bg-[#E60067] text-[#E60067] dark:text-pink-300 group-hover:text-white font-display font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 border border-pink-200 dark:border-neutral-700 group-hover:border-[#E60067] shadow-xs group-hover:shadow-md"
                  >
                    <span>Enter {col.name}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Hot Picks (Quick preview for instant additions) */}
          <div className="pt-8 border-t border-pink-200/60 dark:border-pink-900/40">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#E60067] dark:text-pink-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span>Trending Right Now</span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#231733] dark:text-white">
                  Fan Favorite Hot Picks
                </h3>
              </div>
              <span className="text-xs text-neutral-500 font-semibold hidden sm:inline">
                Instant Add to Bag (Min 3 required)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {hotPicks.map((product) => {
                const isJustAdded = addedItem === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct?.(product)}
                    className="group rounded-2xl bg-white dark:bg-[#1E172E] border border-pink-200 dark:border-pink-900/60 p-3.5 shadow-sm hover:shadow-lg hover:border-pink-400 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-pink-50/60 dark:bg-neutral-800/60 p-2">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 dark:bg-neutral-900/95 text-[10px] font-black text-[#E60067] shadow-xs">
                          {product.category}
                        </span>

                        {/* Quick Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isWishlisted(product.id)
                              ? 'bg-[#E60067] text-white shadow-xs scale-105'
                              : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-400 hover:text-[#E60067] shadow-xs'
                          }`}
                          title={isWishlisted(product.id) ? 'Remove from favorites' : 'Save to favorites'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#231733] dark:text-white line-clamp-1 group-hover:text-[#E60067] transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-sm font-display font-black text-[#E60067] dark:text-pink-400">
                          ₹{product.priceINR}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-pink-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterCollection(product.category);
                        }}
                        className="text-[11px] font-bold text-neutral-500 hover:text-[#E60067] transition underline underline-offset-2"
                      >
                        Collection →
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`py-1.5 px-3 rounded-xl font-display font-bold text-xs transition-all flex items-center gap-1 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'btn-3d-pink text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ENTERED COLLECTION VIEW (Dedicated Category View)          */}
      {/* ============================================================ */}
      {activeCollection && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Breadcrumb & Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-200/60 dark:border-pink-900/40">
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToCollections}
                className="px-3.5 py-2 rounded-2xl bg-pink-100/80 hover:bg-pink-200 dark:bg-pink-950/80 dark:hover:bg-pink-900 text-[#E60067] dark:text-pink-300 font-display font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                title="Return to Collections Hub"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Collections</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span>Collections</span>
                <span>/</span>
                <span className="font-bold text-[#231733] dark:text-white">
                  {activeCollection === 'All Items' ? 'All Products' : activeCollection}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold ml-1">
                  {activeProducts.length} items
                </span>
              </div>
            </div>

            {/* In-Collection Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${activeCollection}...`}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-semibold focus:outline-none focus:ring-1 focus:ring-pink-400 text-neutral-700 dark:text-neutral-300"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated ★</option>
              </select>
            </div>
          </div>

          {/* Quick Collection Pills Switcher (Allows instant switching without returning) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={handleBackToCollections}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-pink-100 flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>All Collections</span>
            </button>

            {CATEGORIES.map((cat) => {
              if (cat === 'All Items') return null;
              const isSelected = activeCollection === cat;
              const count = products.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    handleEnterCollection(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#E60067] text-white border-[#E60067] shadow-sm'
                      : 'bg-white dark:bg-[#1E172E] text-[#231733] dark:text-[#E0D7EB] border-pink-200/80 dark:border-pink-900 hover:bg-pink-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Collection Header Hero Banner */}
          {currentCollectionMeta && (
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-100/70 via-purple-100/60 to-pink-50/70 dark:from-[#2A1D3D] dark:via-[#1F152F] dark:to-[#2A1D3D] border-2 border-pink-200 dark:border-pink-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-[#E60067] dark:text-pink-400 text-xs font-black shadow-xs">
                  <span>{currentCollectionMeta.icon}</span>
                  <span>{currentCollectionMeta.badge}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#231733] dark:text-white">
                  {currentCollectionMeta.name} Collection
                </h2>
                <p className="text-xs md:text-sm text-[#554664] dark:text-[#E0D7EB] font-medium leading-relaxed">
                  {currentCollectionMeta.description}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-4 rounded-2xl border border-pink-200 dark:border-neutral-800 shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase">Curated</span>
                  <span className="font-display font-black text-lg text-neutral-900 dark:text-white">
                    {activeProducts.length} Items
                  </span>
                </div>
                <div className="w-px h-8 bg-pink-200 dark:bg-neutral-700" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase">Order Rule</span>
                  <span className="font-display font-black text-xs text-pink-600 dark:text-pink-400 block">
                    Min 3 Items
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Empty search results state */}
          {activeProducts.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-pink-50/50 dark:bg-neutral-900/50 border border-pink-200 dark:border-neutral-800 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="font-display font-bold text-lg text-neutral-800 dark:text-neutral-200">
                No products found matching "{searchQuery}"
              </h3>
              <p className="text-xs text-neutral-500">
                Try searching with a different term or clear the filter.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Product Grid for Active Collection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {activeProducts.map((product) => {
              const isJustAdded = addedItem === product.id;
              const imageCount = product.images?.length || 1;
              const colorCount = product.colors?.length || 0;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct?.(product)}
                  className="group rounded-3xl bg-white dark:bg-[#1E172E] overflow-hidden border-2 border-pink-200/80 dark:border-pink-900/60 hover:shadow-2xl hover:border-pink-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-md cursor-pointer"
                >
                  <div>
                    {/* 4:5 Standard E-Commerce Ratio Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-pink-50/40 dark:from-[#251A38] dark:via-[#1E172E] dark:to-[#181126] flex items-center justify-center p-3">
                      <img
                        src={product.image || product.images?.[0] || '/images/deluxe-giftbox.jpg'}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                        }}
                        className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-500 rounded-xl"
                      />
                      
                      {/* Badge */}
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-black text-[#E60067] dark:text-pink-400 shadow-sm border border-pink-200/60 dark:border-pink-800 pointer-events-none">
                        {product.badge || 'Popular ✨'}
                      </span>

                      {/* Quick Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isWishlisted(product.id)
                            ? 'bg-[#E60067] text-white shadow-md scale-105'
                            : 'bg-white/95 dark:bg-neutral-900/95 text-neutral-400 hover:text-[#E60067] shadow-sm'
                        }`}
                        title={isWishlisted(product.id) ? 'Remove from favorites' : 'Save to favorites'}
                        aria-label="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-white' : ''}`} />
                      </button>

                      {/* Multiple Photos Pill */}
                      {imageCount > 1 && (
                        <div className="absolute top-12 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                          <Images className="w-3 h-3 text-pink-300" />
                          <span>{imageCount} Photos</span>
                        </div>
                      )}

                      {/* Pack on Reel Tag */}
                      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white shadow-xs pointer-events-none">
                        <Video className="w-3 h-3 text-pink-400" />
                        <span>Eligible for IG Reel packing</span>
                      </div>

                      {/* Quick View Hover Overlay Button */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="px-4 py-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md font-display font-bold text-xs text-[#E60067] shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Colors & Details</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-1">
                        <span className="text-[#E60067] dark:text-pink-400">
                          {product.category}
                        </span>
                        {product.rating && (
                          <span className="text-amber-500 font-extrabold flex items-center gap-0.5">
                            ★ {product.rating}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-extrabold text-base md:text-lg text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors">
                        {product.name}
                      </h3>

                      <p className="mt-1.5 text-xs text-[#554664] dark:text-[#D5CBE2] line-clamp-2 leading-relaxed font-medium">
                        {product.description}
                      </p>

                      {/* Color Swatches Preview */}
                      {colorCount > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {product.colors.slice(0, 4).map((col, idx) => (
                              <span
                                key={idx}
                                className="w-4 h-4 rounded-full border-2 border-white dark:border-[#1E172E] shadow-xs"
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                            {colorCount} Color{colorCount > 1 ? 's' : ''} Available
                          </span>
                        </div>
                      )}

                      {/* Highlights */}
                      {product.includes && product.includes.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-pink-100 dark:border-pink-900/40 space-y-1">
                          {product.includes.slice(0, 2).map((inc, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-[#483A54] dark:text-[#D5CBE2]">
                              <Check className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400 shrink-0" />
                              <span className="truncate">{inc}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div 
                    className="p-5 pt-0 space-y-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-display font-black text-[#231733] dark:text-white">
                          ₹{product.priceINR}
                        </span>
                        <span className="text-[10px] text-[#716182] dark:text-neutral-400 font-bold ml-1">
                          (Prepaid)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectProduct?.(product)}
                          className="py-2 px-3 rounded-xl bg-pink-50 dark:bg-neutral-800 hover:bg-pink-100 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-400 font-display font-bold text-xs tracking-wide transition border border-pink-200 dark:border-neutral-700 flex items-center gap-1"
                          title="Choose Colors & See Details"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          <span>Colors</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`py-2 px-3.5 rounded-xl font-display font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white shadow-lg'
                              : 'btn-3d-pink text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-white" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Direct Buy on WhatsApp Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDirectWhatsAppOrder(product, e)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Buy on WhatsApp (+91 8199922653)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Switcher Navigation Card */}
          <div className="pt-8 border-t border-pink-200/60 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleBackToCollections}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-pink-300 dark:border-pink-800 font-display font-bold text-xs sm:text-sm text-[#E60067] dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-neutral-700 transition flex items-center justify-center gap-2 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to All Collections</span>
            </button>

            <span className="text-xs text-neutral-400 font-medium">
              Scoop Storey India • Min 3 items required to order
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
