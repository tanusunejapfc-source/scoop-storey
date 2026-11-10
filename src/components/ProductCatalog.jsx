import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { CATEGORIES, COLLECTIONS_CONFIG, DEPARTMENTS_CONFIG, categoryToSlug } from '../data/storeData';
import { DEFAULT_PRODUCTS } from '../utils/productStore';
import { getStoredCategories } from '../utils/categoryStore';
// Product inquiries on WhatsApp handled via direct chat links (no unverified orders created)
import { useWishlist } from '../utils/wishlistStore';
import WhatsAppIcon from './WhatsAppIcon';
import MiniScoopIcon from './MiniScoopIcon';

export { DEFAULT_PRODUCTS as PRODUCTS };

const renderCollectionIcon = (iconOrMeta, className = "w-4 h-4") => {
  const isScoop = 
    iconOrMeta === '🍨' ||
    iconOrMeta?.icon === '🍨' ||
    iconOrMeta?.id === 'mystery-scoops' ||
    iconOrMeta?.category === 'Mystery Scoops';

  if (isScoop) {
    return <MiniScoopIcon className={className} />;
  }
  if (typeof iconOrMeta === 'object' && iconOrMeta?.icon) {
    return iconOrMeta.icon;
  }
  return iconOrMeta;
};

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
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [categoriesList, setCategoriesList] = useState(getStoredCategories);

  // Sync categoryList with storage on external admin changes
  useEffect(() => {
    const handleCatUpdate = (e) => {
      if (e?.detail) setCategoriesList(e.detail);
      else setCategoriesList(getStoredCategories());
    };
    window.addEventListener('scoop_categories_updated', handleCatUpdate);
    return () => window.removeEventListener('scoop_categories_updated', handleCatUpdate);
  }, []);

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

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCollections = () => {
    soundFX.playPop(500);
    setActiveCollection(null);
    setSearchQuery('');

    // If currently on a collection hash, push empty hash / home so browser Back won't exit
    if (window.location.hash.startsWith('#collection-')) {
      try {
        window.history.pushState({ type: 'home' }, '', window.location.pathname);
      } catch {
        window.location.hash = '';
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build dynamic collections list, merging COLLECTIONS_CONFIG with any custom categories from categoryStore or products
  const collections = useMemo(() => {
    const configMap = new Map(COLLECTIONS_CONFIG.map(c => [c.category.toLowerCase(), c]));
    const list = [];
    const seenCategories = new Set();

    // 1. Process all categories stored in categoryStore (including user-created ones like "Stationery and bags")
    for (const catMeta of categoriesList) {
      const lower = catMeta.name.toLowerCase();
      if (!seenCategories.has(lower)) {
        seenCategories.add(lower);
        const config = configMap.get(lower);
        const items = products.filter(p => p.category && p.category.toLowerCase() === lower);
        const prices = items.map(p => p.priceINR).filter(Boolean);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 199;
        const previews = items.slice(0, 4).map(p => p.image || p.images?.[0]).filter(Boolean);

        if (config) {
          list.push({
            ...config,
            badge: catMeta.badge || config.badge,
            description: catMeta.description || config.description,
            icon: catMeta.icon || config.icon,
            itemsCount: items.length,
            minPrice,
            previews
          });
        } else {
          // Custom category created in Admin Panel!
          list.push({
            id: catMeta.id || catMeta.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: catMeta.name,
            name: catMeta.name,
            department: catMeta.department || 'lifestyle',
            icon: catMeta.icon || '🎀',
            badge: catMeta.badge || 'New Drop 🎀',
            tagline: catMeta.description ? catMeta.description.slice(0, 60) : `Cute ${catMeta.name} collection`,
            description: catMeta.description || `Explore our handpicked ${catMeta.name} curation.`,
            coverImage: items[0]?.image || items[0]?.images?.[0] || '/images/deluxe-giftbox.jpg',
            gradient: 'from-pink-500/15 via-rose-500/10 to-purple-500/20',
            borderHover: 'hover:border-pink-400',
            btnGradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
            itemsCount: items.length,
            minPrice,
            previews
          });
        }
      }
    }

    // 2. Also check any categories that exist in products but were somehow not in categoriesList
    for (const p of products) {
      if (p.category) {
        const lower = p.category.toLowerCase();
        if (!seenCategories.has(lower)) {
          seenCategories.add(lower);
          const config = configMap.get(lower);
          const items = products.filter(item => item.category && item.category.toLowerCase() === lower);
          const prices = items.map(item => item.priceINR).filter(Boolean);
          const minPrice = prices.length > 0 ? Math.min(...prices) : 199;
          const previews = items.slice(0, 4).map(item => item.image || item.images?.[0]).filter(Boolean);

          if (config) {
            list.push({
              ...config,
              itemsCount: items.length,
              minPrice,
              previews
            });
          } else {
            list.push({
              id: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: p.category,
              name: p.category,
              department: 'lifestyle',
              icon: '✨',
              badge: 'Curated 🎀',
              tagline: `Explore our ${p.category} collection`,
              description: `Handpicked selection of items curated under ${p.category}.`,
              coverImage: items[0]?.image || items[0]?.images?.[0] || '/images/deluxe-giftbox.jpg',
              gradient: 'from-pink-500/15 via-rose-500/10 to-purple-500/20',
              borderHover: 'hover:border-pink-400',
              btnGradient: 'bg-gradient-to-r from-pink-500 to-rose-500',
              itemsCount: items.length,
              minPrice,
              previews
            });
          }
        }
      }
    }

    return list;
  }, [products, categoriesList]);

  // Active collection metadata object
  const currentCollectionMeta = useMemo(() => {
    if (!activeCollection || activeCollection === 'All Items') return null;
    const found = collections.find(c => c.category?.toLowerCase() === activeCollection.toLowerCase());
    if (found) return found;

    // Check categoriesList for custom category
    const catMeta = categoriesList.find(c => c.name?.toLowerCase() === activeCollection.toLowerCase());
    return {
      name: activeCollection,
      category: activeCollection,
      icon: catMeta?.icon || '🎀',
      badge: catMeta?.badge || 'New Drop 🎀',
      tagline: `Exclusive ${activeCollection} selection`,
      description: catMeta?.description || `Explore authentic products under ${activeCollection}.`,
      coverImage: '/images/deluxe-giftbox.jpg'
    };
  }, [activeCollection, collections, categoriesList]);

  // Filtered & Sorted products for active collection view
  const activeProducts = useMemo(() => {
    let list = products;
    if (activeCollection && activeCollection !== 'All Items') {
      const targetLower = activeCollection.toLowerCase();
      list = products.filter(p => p.category && p.category.toLowerCase() === targetLower);
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

  // Filtered collections by active department
  const displayedCollections = useMemo(() => {
    if (selectedDepartment === 'all') return collections;
    return collections.filter(c => c.department === selectedDepartment);
  }, [collections, selectedDepartment]);

  // Featured Hot Picks for Home Page (diverse cross-department bestsellers)
  const hotPicks = useMemo(() => {
    const picks = [
      products.find(p => p.id === 'scoop-mini') || products[0],
      products.find(p => p.category === 'Pendants & Chains'),
      products.find(p => p.category === 'Make up') || products.find(p => p.category === 'Self-Care'),
      products.find(p => p.category === 'Bottles') || products.find(p => p.category === 'Soft Toys'),
      products.find(p => p.category === 'Key chains') || products.find(p => p.category === 'Hair Accessories'),
      products.find(p => p.category === 'Bracelets') || products.find(p => p.category === 'Korean Wallets')
    ].filter(Boolean);

    // Ensure distinct items
    return Array.from(new Set(picks));
  }, [products]);

  // Helper for department tags & styling
  const getDepartmentMeta = (deptId) => {
    switch (deptId) {
      case 'scoops':
        return {
          label: 'Scoops Studio',
          chipClass: 'bg-pink-100 text-[#E60067] dark:bg-pink-950/80 dark:text-pink-300 border-pink-200 dark:border-pink-800'
        };
      case 'jewelry':
        return {
          label: 'Korean Jewels',
          chipClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
      case 'beauty':
        return {
          label: 'Beauty & Glow',
          chipClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800'
        };
      case 'lifestyle':
        return {
          label: 'Kawaii Lifestyle',
          chipClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
      default:
        return {
          label: 'Curation',
          chipClass: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
        };
    }
  };

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

  return (
    <section id="menu" ref={catalogRef} className={`${activeCollection ? 'py-4 sm:py-8' : 'py-16 md:py-24'} px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24`}>
      {/* Policy Reminder Banner */}
      <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:from-[#261537] dark:via-[#341B49] dark:to-[#261537] border-2 border-pink-300 dark:border-pink-800/80 flex items-center justify-center gap-2 text-xs font-bold text-[#231733] dark:text-pink-100 text-center shadow-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#E60067] dark:text-pink-400" />
        <span>Order Rule: Minimum 3 Products Required to Checkout • 100% Prepaid Delivery Across India</span>
      </div>

      {/* ============================================================ */}
      {/* 1. COLLECTIONS HUB VIEW (Home Page Compact Showcase)          */}
      {/* ============================================================ */}
      {!activeCollection && (
        <div className="space-y-10 animate-fadeIn">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-extrabold tracking-wider uppercase mb-2 shadow-xs">
                <Layers className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400" />
                <span>Shop by Department & Collection • {collections.length} Curations</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
                Explore Our Collections
              </h2>
              <p className="mt-2 text-[#554664] dark:text-[#E0D7EB] font-medium max-w-2xl text-sm md:text-base leading-relaxed">
                Browse across our 4 aesthetic realms — Mystery Scoops, Korean Anti-Tarnish Jewelry, Beauty & Makeup, and Kawaii Lifestyle Collectibles.
              </p>
            </div>

            {/* Quick Browse All Toggle */}
            <button
              onClick={() => handleEnterCollection('All Items')}
              className="self-start md:self-end px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-pink-200 dark:border-pink-800 text-xs font-bold text-[#E60067] dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-neutral-700 transition flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer active:scale-95"
            >
              <span>Browse All ({products.length}) Items</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Enterprise Segmented Department Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
            {DEPARTMENTS_CONFIG.map((dept) => {
              const isDeptActive = selectedDepartment === dept.id;
              const count = dept.id === 'all'
                ? collections.length
                : collections.filter(c => c.department === dept.id).length;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => {
                    soundFX.playPop(520);
                    setSelectedDepartment(dept.id);
                  }}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-display font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 snap-start shadow-xs ${
                    isDeptActive
                      ? 'bg-[#E60067] text-white shadow-md shadow-pink-500/30 scale-[1.02]'
                      : 'bg-white dark:bg-[#1E172E] text-neutral-700 dark:text-neutral-200 border border-pink-200 dark:border-pink-900/60 hover:bg-pink-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-base">{dept.icon}</span>
                  <span>{dept.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isDeptActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-pink-100 dark:bg-pink-950/80 text-[#E60067] dark:text-pink-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* DUAL SPOTLIGHT FEATURE: Shown when "All Collections" is selected to keep homepage organized & exciting */}
          {selectedDepartment === 'all' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 pt-1">
              {/* Spotlight 1: Mystery Scoops Studio (7 cols) */}
              <div 
                onClick={() => handleEnterCollection('Mystery Scoops')}
                className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-rose-500/15 border-2 border-pink-300 dark:border-pink-800/80 p-5 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-pink-400 transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-pink-300 dark:border-pink-700 text-xs font-black text-[#E60067] dark:text-pink-300 flex items-center gap-1.5 shadow-xs">
                      <MiniScoopIcon className="w-4 h-4" />
                      <span>Featured Studio • Hand-Packed on Instagram Reels</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-[#E60067] text-white text-xs font-extrabold shadow-xs">
                      From ₹799
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors">
                    🍨 Mystery Scoops Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-[#554664] dark:text-[#E0D7EB] font-medium leading-relaxed max-w-xl">
                    Dip directly into hundreds of handcrafted Kawaii resin charms, 18K gold pendants, and VIP mystery blind boxes packed live with free surprise gifts.
                  </p>

                  {/* Quick scoop preview pills */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-neutral-800/80 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 border border-pink-200/60 dark:border-pink-900">
                      ✨ Mini Scoop (7–8 Items) • ₹799
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-neutral-800/80 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 border border-pink-200/60 dark:border-pink-900">
                      🔥 Midi Scoop (12–15 Items) • ₹1299
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-neutral-800/80 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 border border-pink-200/60 dark:border-pink-900">
                      👑 Big Scoop (20+ Items) • ₹1799
                    </span>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between gap-3 border-t border-pink-200/60 dark:border-pink-900/40 mt-4">
                  <span className="text-xs font-bold text-[#E60067] dark:text-pink-400 group-hover:underline flex items-center gap-1">
                    <span>Enter Mystery Scoops Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    Eligible for ASMR Reel filming 🎬
                  </span>
                </div>
              </div>

              {/* Spotlight 2: New Arrivals Realm (5 cols) */}
              <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-amber-500/10 border-2 border-purple-200 dark:border-purple-900/60 p-5 sm:p-7 flex flex-col justify-between shadow-md">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-purple-200 dark:border-purple-800 text-xs font-black text-purple-700 dark:text-purple-300 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>New Arrivals Realm</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-[#231733] dark:text-white">
                    Makeup, Bottles & Soft Toys
                  </h3>
                  <p className="text-xs text-[#554664] dark:text-[#E0D7EB] font-medium leading-relaxed">
                    Explore newly added aesthetic curations! Fruit lip oils, kawaii bear sippers, huggable plushies, floating keychains, and butterfly hair claws.
                  </p>

                  {/* Quick jump pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {[
                      { label: '💄 Make up', cat: 'Make up' },
                      { label: '🥤 Bottles', cat: 'Bottles' },
                      { label: '🧸 Soft Toys', cat: 'Soft Toys' },
                      { label: '🗝️ Key chains', cat: 'Key chains' },
                      { label: '🎀 Hair Accessories', cat: 'Hair Accessories' }
                    ].map((item) => (
                      <button
                        key={item.cat}
                        type="button"
                        onClick={() => handleEnterCollection(item.cat)}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-[#E60067] hover:border-[#E60067] border border-pink-200 dark:border-neutral-700 transition shadow-xs cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300 border-t border-purple-200/60 dark:border-purple-900/40 mt-4">
                  <span>Tap any pill to view its pieces</span>
                  <span>From ₹99 ✨</span>
                </div>
              </div>
            </div>
          )}

          {/* Department Banner if filtering by specific department */}
          {selectedDepartment !== 'all' && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-100/60 dark:bg-neutral-800/80 border border-pink-200 dark:border-pink-900/60">
              <span className="text-xs font-extrabold text-[#231733] dark:text-white flex items-center gap-2">
                <span>Filtering by:</span>
                <span className="px-2 py-0.5 rounded-lg bg-[#E60067] text-white">
                  {DEPARTMENTS_CONFIG.find(d => d.id === selectedDepartment)?.name}
                </span>
                <span className="text-neutral-500 font-normal">({displayedCollections.length} Curations)</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDepartment('all')}
                className="text-xs font-bold text-[#E60067] dark:text-pink-400 hover:underline cursor-pointer"
              >
                Show All {collections.length} Collections →
              </button>
            </div>
          )}

          {/* BOUTIQUE VISUAL COLLECTIONS GRID: 4 columns desktop / 2 columns mobile for compact elegance */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {displayedCollections.map((col) => {
              const deptMeta = getDepartmentMeta(col.department);
              return (
                <div
                  key={col.id}
                  onClick={() => handleEnterCollection(col.category)}
                  className="group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-200/90 dark:border-pink-900/60 hover:border-[#E60067] dark:hover:border-pink-500 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div>
                    {/* Collection Cover Image Container (4:3 aspect for compact visual density) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100/50 dark:from-[#251A38] dark:to-[#181126]">
                      <img
                        src={col.coverImage}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                        }}
                      />
                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black shadow-xs border ${deptMeta.chipClass}`}>
                          {deptMeta.label}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-extrabold text-[9px] sm:text-[10px] shadow-xs">
                          {col.itemsCount} Items
                        </span>
                      </div>

                      {/* Bottom-left: Starting Price Pill */}
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="px-2 py-0.5 rounded-lg bg-pink-600/90 backdrop-blur-md text-white font-display font-extrabold text-[10px] sm:text-xs shadow-xs">
                          From ₹{col.minPrice}
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-lg flex items-center shrink-0">
                          {renderCollectionIcon(col, 'w-4 h-4')}
                        </span>
                        <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors truncate">
                          {col.name}
                        </h3>
                      </div>

                      <p className="text-[10px] sm:text-[11px] font-bold text-pink-600 dark:text-pink-400 truncate">
                        {col.tagline}
                      </p>

                      <p className="text-[10px] text-[#554664] dark:text-[#D5CBE2] line-clamp-1 font-medium hidden sm:block">
                        {col.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button Footer */}
                  <div className="p-3 sm:p-4 pt-0">
                    <button
                      type="button"
                      className="w-full py-1.5 sm:py-2 px-2.5 rounded-xl bg-pink-50 dark:bg-neutral-800 group-hover:bg-[#E60067] text-[#E60067] dark:text-pink-300 group-hover:text-white font-display font-bold text-[10px] sm:text-xs tracking-wide transition-all flex items-center justify-center gap-1 border border-pink-200 dark:border-neutral-700 group-hover:border-[#E60067]"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Featured Hot Picks (Quick preview across departments for instant additions) */}
          <div className="pt-8 border-t border-pink-200/60 dark:border-pink-900/40">
            <div className="flex items-center justify-between gap-4 mb-5">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4.5">
              {hotPicks.map((product) => {
                const isJustAdded = addedItem === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct?.(product)}
                    className="group rounded-2xl bg-white dark:bg-[#1E172E] border border-pink-200 dark:border-pink-900/60 p-2.5 sm:p-3 shadow-xs hover:shadow-lg hover:border-pink-400 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-white/95 dark:bg-neutral-900/95 text-[9px] font-black text-[#E60067] shadow-xs truncate max-w-[85%]">
                          {product.category}
                        </span>

                        {/* Quick Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isWishlisted(product.id)
                              ? 'bg-[#E60067] text-white shadow-xs scale-105'
                              : 'bg-white/90 dark:bg-neutral-900/90 text-neutral-400 hover:text-[#E60067] shadow-xs'
                          }`}
                          title={isWishlisted(product.id) ? 'Remove from favorites' : 'Save to favorites'}
                        >
                          <Heart className={`w-3 h-3 ${isWishlisted(product.id) ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-xs text-[#231733] dark:text-white line-clamp-1 group-hover:text-[#E60067] transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-xs sm:text-sm font-display font-black text-[#E60067] dark:text-pink-400">
                          ₹{product.priceINR}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-pink-100 dark:border-neutral-800 flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterCollection(product.category);
                        }}
                        className="text-[10px] font-bold text-neutral-500 hover:text-[#E60067] transition truncate"
                      >
                        View →
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`py-1 px-2.5 rounded-xl font-display font-bold text-[11px] transition-all flex items-center gap-1 shrink-0 ${
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
                className="px-3.5 py-2 rounded-2xl bg-pink-100/80 hover:bg-pink-200 dark:bg-pink-950/80 dark:hover:bg-pink-900 text-[#E60067] dark:text-pink-300 font-display font-extrabold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                title="Return to Home & Collections"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Home</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <button 
                  onClick={handleBackToCollections}
                  className="hover:text-[#E60067] dark:hover:text-pink-400 hover:underline cursor-pointer transition-colors"
                >
                  Home
                </button>
                <span>/</span>
                <button 
                  onClick={handleBackToCollections}
                  className="hover:text-[#E60067] dark:hover:text-pink-400 hover:underline cursor-pointer transition-colors"
                >
                  Collections
                </button>
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

            {collections.map((col) => {
              const cat = col.category;
              if (cat === 'All Items') return null;
              const isSelected = activeCollection?.toLowerCase() === cat.toLowerCase();
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
                  <span className="flex items-center">{renderCollectionIcon(col, 'w-3.5 h-3.5')}</span>
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300'}`}>
                    {col.itemsCount}
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
                  <span className="flex items-center">{renderCollectionIcon(currentCollectionMeta, 'w-4 h-4')}</span>
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

          {/* Empty search results / empty collection state */}
          {activeProducts.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-pink-50/50 dark:bg-[#1E172E]/60 border border-pink-200 dark:border-pink-900/60 space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-3xl shadow-inner">
                {searchQuery ? '🔍' : (renderCollectionIcon(currentCollectionMeta, 'w-8 h-8') || '✨')}
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#231733] dark:text-white">
                {searchQuery 
                  ? `No products found matching "${searchQuery}"`
                  : `✨ ${activeCollection} Collection Arriving Soon!`}
              </h3>
              <p className="text-xs sm:text-sm text-[#554664] dark:text-[#E0D7EB] max-w-md mx-auto leading-relaxed font-medium">
                {searchQuery
                  ? 'Try searching with a different keyword or browse our full collection catalog.'
                  : `Our team is currently hand-curating pieces for ${activeCollection}. New drops will appear here shortly! You can also add products directly from the Admin Panel.`}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl btn-3d-pink text-white text-xs font-bold transition cursor-pointer"
                  >
                    Clear Search
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleBackToCollections}
                      className="px-4 py-2.5 rounded-xl btn-3d-pink text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Browse Other Collections</span>
                    </button>
                    <a
                      href="#admin"
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border-2 border-pink-200 dark:border-pink-800 text-neutral-700 dark:text-neutral-200 hover:text-[#E60067] text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      + Add Products in Admin
                    </a>
                  </>
                )}
              </div>
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
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={product.image || product.images?.[0] || '/images/deluxe-giftbox.jpg'}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                    {/* Inquire on WhatsApp Link */}
                    <a
                      href={`https://wa.me/918199922653?text=${encodeURIComponent(`Hi Scoop Storey! 🎀 Mujhe "${product.name}" ke baare me inquiry karni hai. (Prepaid Store • Min 3 items)`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Inquire on WhatsApp (+91 8199922653)</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Switcher Navigation Card */}
          <div className="pt-8 border-t border-pink-200/60 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleBackToCollections}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-pink-300 dark:border-pink-800 font-display font-extrabold text-xs sm:text-sm text-[#E60067] dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-neutral-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Home</span>
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
