import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import Navbar from './components/Navbar';
import CategoryIconsBar from './components/CategoryIconsBar';
import BoutiqueHero from './components/BoutiqueHero';
import ProductCatalog from './components/ProductCatalog';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SocialProofToast from './components/SocialProofToast';
import ScoopMachineSkeleton from './components/ScoopMachineSkeleton';
import { useStoreProducts } from './utils/productStore';
import { categoryToSlug, slugToCategory } from './data/storeData';
import { soundFX } from './utils/audio';
import { sendHeartbeat, trackPageView, trackAddToCart, initLivePresence, updateLivePresence } from './utils/analyticsTelemetry';

// 🚀 Performance-Optimized Lazy Loading:
// 1. Heavy 3D Three.js Scoop Machine & Canvas (~680KB total) deferred so page loads instantly
const ScoopMachine3D = lazy(() => import('./components/ScoopMachine3D'));

// 2. Modals & Drawers loaded strictly on-demand when user opens them
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal'));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal'));
const WishlistDrawer = lazy(() => import('./components/WishlistDrawer'));
const PolicyModal = lazy(() => import('./components/PolicyModal'));
const ReviewModal = lazy(() => import('./components/ReviewModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// 3. Below-the-fold content deferred
const ReelsShowcase = lazy(() => import('./components/ReelsShowcase'));
const BrandStory = lazy(() => import('./components/BrandStory'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const StoreFAQ = lazy(() => import('./components/StoreFAQ'));

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('shipping');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState(null);
  const [isDirectAdLanding, setIsDirectAdLanding] = useState(() => {
    if (typeof window === 'undefined') return false;
    const h = window.location.hash || '';
    const s = window.location.search || '';
    return h.startsWith('#product-') || h.startsWith('#collection-') || s.includes('product=') || s.includes('p=');
  });
  const historyInsertedRef = useRef(false);
  const userActivatedHistoryRef = useRef(false);
  const hasInternalNavRef = useRef(false);

  const handleOpenReviewModal = (product = null) => {
    setReviewModalProduct(product);
    setIsReviewModalOpen(true);
  };

  // Dynamic Product Store (synced with localStorage & Admin updates)
  const { 
    products, 
    updateProduct, 
    updateProductsBatch,
    addProduct, 
    deleteProduct, 
    deleteProductsBatch,
    resetAll 
  } = useStoreProducts();

  // Cart state: Starts completely EMPTY by default for all users and incognito
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('scoop_cart_items_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // Persist cart to localStorage so items added by user are retained during their visit
  useEffect(() => {
    try {
      localStorage.setItem('scoop_cart_items_v2', JSON.stringify(cartItems));
    } catch (_) {}
  }, [cartItems]);

  // Live Visitor Presence & Telemetry Heartbeat
  useEffect(() => {
    initLivePresence(cartItems, isCartOpen);
    sendHeartbeat();
    trackPageView(window.location.hash || '/');
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Sync real-time cart & checkout status to all connected merchant dashboards
  useEffect(() => {
    updateLivePresence(cartItems, isCartOpen);
  }, [cartItems, isCartOpen]);

  // Apply dark mode class to html element ONLY when toggled
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Prevent mobile browsers from restoring previous scroll offsets & ensure top load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      const hash = window.location.hash;
      if (hash === '#scoop-machine' || hash === '#menu' || hash === '#reels' || !hash || hash === '#') {
        if (hash && hash !== '#') {
          try {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          } catch {}
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        const timer = setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Handle URL hash & browser back/forward buttons (popstate & hashchange)
  useEffect(() => {
    const getCleanHomeUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        params.delete('product');
        params.delete('p');
        const qs = params.toString();
        return window.location.pathname + (qs ? `?${qs}` : '');
      } catch {
        return window.location.pathname + window.location.search;
      }
    };

    // Support query-param product landing URLs (e.g. ?product=scoop-midi&fbclid=...) by normalizing to #product-...
    let initialHash = window.location.hash || '';
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryProdId = searchParams.get('product') || searchParams.get('p');
      if (queryProdId && !initialHash.startsWith('#product-')) {
        initialHash = `#product-${queryProdId}`;
        window.history.replaceState(window.history.state, '', getCleanHomeUrl() + initialHash);
      }
    } catch {}

    const isProductLink = initialHash.startsWith('#product-');
    const isCollectionLink = initialHash.startsWith('#collection-');

    // 🛡️ History Insertion for Meta / Instagram Ads direct product & collection links
    // 1. Insert Homepage immediately as fallback on initial mount
    if (typeof window !== 'undefined' && window.history?.replaceState && window.history?.pushState) {
      const state = window.history.state;
      if ((isProductLink || isCollectionLink) && !state?.scoop_history_inserted && !historyInsertedRef.current) {
        historyInsertedRef.current = true;
        try {
          const cleanHomeUrl = getCleanHomeUrl();
          window.history.replaceState({ page: 'storefront', scoop_history_inserted: true }, '', cleanHomeUrl);
          window.history.pushState(
            { page: isProductLink ? 'product' : 'collection', scoop_history_inserted: true },
            '',
            cleanHomeUrl + initialHash
          );
        } catch (e) {
          console.warn('History insertion skipped:', e);
        }
      }
    }

    // 2. User-Activated History Commit:
    // Modern Chrome / Android WebView / Instagram IAB marks pushState done before user interaction as skippable.
    // On the user's first tap/touch/click/keydown, commit a real user-activated [Homepage] -> [Product] history entry
    // so the hardware/browser Back button takes ad visitors to our Homepage instead of kicking them back to IG/FB.
    const commitUserActivatedHistory = () => {
      if (userActivatedHistoryRef.current || hasInternalNavRef.current) return;
      const activeHash = window.location.hash || '';
      if (!activeHash.startsWith('#product-') && !activeHash.startsWith('#collection-')) return;
      userActivatedHistoryRef.current = true;

      try {
        const cleanHomeUrl = getCleanHomeUrl();
        window.history.replaceState(
          { page: 'storefront', scoop_history_inserted: true, scoop_user_activated_home: true },
          '',
          cleanHomeUrl
        );
        window.history.pushState(
          { page: activeHash.startsWith('#product-') ? 'product' : 'collection', scoop_history_inserted: true, scoop_user_activated: true },
          '',
          cleanHomeUrl + activeHash
        );
      } catch (e) {
        console.warn('User-activated history commit skipped:', e);
      }
    };

    if (isProductLink || isCollectionLink) {
      window.addEventListener('pointerdown', commitUserActivatedHistory, { once: true, passive: true });
      window.addEventListener('touchstart', commitUserActivatedHistory, { once: true, passive: true });
      window.addEventListener('click', commitUserActivatedHistory, { once: true, passive: true });
      window.addEventListener('keydown', commitUserActivatedHistory, { once: true, passive: true });
    }

    const handleNavigation = (isInitial = false) => {
      const hash = window.location.hash;

      // 1. Admin Panel
      if (hash === '#admin') {
        setIsAdminOpen(true);
      } else if (!isInitial) {
        setIsAdminOpen(false);
      }

      // 2. Product Detail Modal
      if (hash.startsWith('#product-')) {
        const rawId = hash.replace('#product-', '');
        const prodId = rawId.split('?')[0].split('&')[0];
        const found = products.find(p => p.id === prodId || String(p.id).toLowerCase() === prodId.toLowerCase());
        if (found) setSelectedProduct(found);
      } else {
        setSelectedProduct(null);
      }

      // 3. Collection Navigation
      if (hash.startsWith('#collection-')) {
        const rawCol = hash.replace('#collection-', '');
        const colId = rawCol.split('?')[0].split('&')[0];
        const foundCategory = slugToCategory(colId, products);
        if (foundCategory) {
          setActiveCollection(foundCategory);
        } else if (colId === 'all') {
          setActiveCollection('All Items');
        } else {
          setActiveCollection(null);
        }
        if (!isInitial) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } else if (hash === '#collections' || hash === '#menu' || hash === '' || hash === '#') {
        // Return smoothly to Homepage
        setActiveCollection(null);
        if (!isInitial && (hash === '' || hash === '#')) {
          setIsDirectAdLanding(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '#reels' || hash === '#scoop-machine' || hash === '#faq-section' || hash === '#story' || hash === '#reviews') {
        setActiveCollection(null);
        if (!isInitial) {
          const targetId = hash.slice(1);
          setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }
    };

    handleNavigation(true);
    const onNavChange = () => handleNavigation(false);
    window.addEventListener('hashchange', onNavChange);
    window.addEventListener('popstate', onNavChange);
    return () => {
      window.removeEventListener('hashchange', onNavChange);
      window.removeEventListener('popstate', onNavChange);
      window.removeEventListener('pointerdown', commitUserActivatedHistory);
      window.removeEventListener('touchstart', commitUserActivatedHistory);
      window.removeEventListener('click', commitUserActivatedHistory);
      window.removeEventListener('keydown', commitUserActivatedHistory);
    };
  }, [products]);

  // Update document title dynamically for category pages vs homepage
  useEffect(() => {
    if (activeCollection) {
      document.title = `${activeCollection === 'All Items' ? 'All Products' : activeCollection} • Scoop Storey 3D`;
      trackPageView(`/collection/${activeCollection}`);
    } else {
      document.title = 'Scoop Storey 3D • Collect Happiness In Every Single Scoop';
    }
  }, [activeCollection]);

  // Force reset scroll to top whenever activeCollection changes (entering a category or returning to homepage)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });

    const t1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }, 40);

    const t2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }, 120);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeCollection]);

  // Track product views for analytics telemetry
  useEffect(() => {
    if (selectedProduct) {
      trackPageView(`/product/${selectedProduct.id}`, selectedProduct.name);
    }
  }, [selectedProduct]);

  // Unified Category Navigation handler
  const handleSelectCategory = (category) => {
    hasInternalNavRef.current = true;
    setIsDirectAdLanding(false);
    setSelectedProduct(null);
    setActiveCollection(category);
    const slug = category ? categoryToSlug(category) : 'all';
    const targetHash = category ? `#collection-${slug}` : '';
    if (window.location.hash !== targetHash) {
      try {
        window.history.pushState({ type: 'collection', category }, '', window.location.pathname + window.location.search + targetHash);
      } catch {
        window.location.hash = targetHash;
      }
    }
    // Instant scroll to prevent mobile browser clamping to bottom during DOM unmount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Unified Product Detail Navigation handler (Shopify-standard dedicated page routing)
  const handleSelectProduct = (prod) => {
    if (!prod) {
      setSelectedProduct(null);
      const fallback = activeCollection ? `#collection-${categoryToSlug(activeCollection)}` : '';
      try {
        window.history.pushState(null, '', window.location.pathname + window.location.search + fallback);
      } catch {
        window.location.hash = fallback;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      return;
    }
    hasInternalNavRef.current = true;
    setIsDirectAdLanding(false);
    setSelectedProduct(prod);
    if (prod.category && !activeCollection) {
      setActiveCollection(prod.category);
    }
    const targetHash = `#product-${prod.id}`;
    if (window.location.hash !== targetHash) {
      try {
        window.history.pushState({ type: 'product', id: prod.id }, '', window.location.pathname + window.location.search + targetHash);
      } catch {
        window.location.hash = targetHash;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // Safe handler for closing ProductDetailPage:
  // If visitor arrived directly via Meta Ads / external link without internal storefront history,
  // NEVER call window.history.back() (which can exit back to Instagram/FB); route straight to Homepage.
  const handleCloseProduct = () => {
    if (!hasInternalNavRef.current || isDirectAdLanding) {
      hasInternalNavRef.current = true;
      setIsDirectAdLanding(false);
      setSelectedProduct(null);
      setActiveCollection(null);
      const cleanHomeUrl = window.location.pathname + window.location.search;
      try {
        window.history.replaceState({ page: 'storefront', scoop_home: true }, '', cleanHomeUrl);
      } catch {
        window.location.hash = '';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      return;
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      setTimeout(() => {
        if (window.location.hash.startsWith('#product-')) {
          handleSelectProduct(null);
        }
      }, 180);
    } else {
      handleSelectProduct(null);
    }
  };

  // Cart operations with color variant support
  const handleAddToCart = (product) => {
    trackAddToCart(product, product.qty || 1);
    const colorSuffix = product.selectedColor ? `-${product.selectedColor}` : '';
    const itemKey = `${product.id}${colorSuffix}`;
    const addQuantity = product.qty || 1;

    setCartItems(prev => {
      const existing = prev.find(item => (item.cartKey || item.id) === itemKey);
      if (existing) {
        return prev.map(item =>
          (item.cartKey || item.id) === itemKey 
            ? { ...item, qty: item.qty + addQuantity, image: product.image || item.image } 
            : item
        );
      }
      return [
        ...prev, 
        { 
          ...product, 
          cartKey: itemKey, 
          qty: addQuantity,
          image: product.image || (product.images?.[0] || '/images/deluxe-giftbox.webp')
        }
      ];
    });

    // Automatically open the side drawer when customer adds product to cart
    setIsCartOpen(true);
    soundFX.playSuccess();
  };

  const handleUpdateQty = (key, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(key);
      return;
    }
    setCartItems(prev =>
      prev.map(item => ((item.cartKey || item.id) === key ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveItem = (key) => {
    setCartItems(prev => prev.filter(item => (item.cartKey || item.id) !== key));
  };

  const handleClearCart = () => {
    try {
      localStorage.setItem('scoop_cart_items_v2', JSON.stringify([]));
    } catch (_) {}
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300">
      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          try {
            if (window.location.hash !== '#admin') {
              window.location.hash = '#admin';
            }
          } catch {}
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* ======================================================== */}
      {/* 3-TIER ROUTE SYSTEM: Product Page vs Collection vs Home  */}
      {/* ======================================================== */}
      {selectedProduct ? (
        /* 1. DEDICATED SEPARATE PRODUCT DETAIL PAGE VIEW (Shopify Standard Layout) */
        <main className="min-h-[85vh]">
          <Suspense fallback={
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-display font-extrabold text-sm text-[#B81D24]">Opening Cute Goodie Details... 🎀</span>
            </div>
          }>
            <ProductDetailPage
              key={selectedProduct.id}
              product={selectedProduct}
              allProducts={products}
              activeCollection={activeCollection}
              isDirectAdLanding={isDirectAdLanding}
              onSelectCollection={handleSelectCategory}
              onOpenReviewModal={handleOpenReviewModal}
              onClose={handleCloseProduct}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />
          </Suspense>
        </main>
      ) : activeCollection ? (
        /* 2. DEDICATED SEPARATE CATEGORY / COLLECTION PAGE VIEW */
        <main className="min-h-[75vh]">
          {/* If viewing Mystery Scoops category, display the 3D scoop machine prominently on this page! */}
          {activeCollection === 'Mystery Scoops' && (
            <div className="pt-2 pb-4">
              <Suspense fallback={<ScoopMachineSkeleton isHero={false} />}>
                <ScoopMachine3D onAddToCart={handleAddToCart} isDark={isDark} />
              </Suspense>
            </div>
          )}

          {/* Dedicated Category Product Grid, Header, Search & Filter Pills */}
          <ProductCatalog 
            products={products} 
            onAddToCart={handleAddToCart} 
            onSelectProduct={handleSelectProduct}
            activeCollection={activeCollection}
            onSelectCollection={handleSelectCategory}
          />
        </main>
      ) : (
        /* 3. FULL FEATURED HOMEPAGE */
        <main>
          {/* 3D INTERACTIVE VIP MYSTERY SCOOP STUDIO - FLAGSHIP HERO SECTION */}
          <div className="relative pt-1 pb-4 sm:pt-2 sm:pb-6">
            <Suspense fallback={<ScoopMachineSkeleton isHero={true} />}>
              <ScoopMachine3D isHero={true} onAddToCart={handleAddToCart} isDark={isDark} />
            </Suspense>
          </div>

          {/* STYLISH CATEGORY ICONS BAR (Story Bubbles - ONLY DISPLAYED ON HOMEPAGE!) */}
          <CategoryIconsBar
            activeCategory={null}
            onSelectCategory={handleSelectCategory}
            products={products}
          />

          {/* THE SCOOP MENU (PRODUCT COLLECTIONS HUB) - IMMEDIATELY ACCESSIBLE WITHOUT ENDLESS SCROLL */}
          <ProductCatalog 
            products={products} 
            onAddToCart={handleAddToCart} 
            onSelectProduct={handleSelectProduct}
            activeCollection={null}
            onSelectCollection={handleSelectCategory}
          />

          {/* BELOW THE FOLD CONTENT DEFERRED */}
          <Suspense fallback={<div className="min-h-[160px]" />}>
            {/* ASMR & INSTAGRAM REELS SHOWCASE */}
            <ReelsShowcase />

            {/* BRAND STORY & PHILOSOPHY */}
            <BrandStory />

            {/* CUSTOMER TESTIMONIALS */}
            <Testimonials onOpenReviewModal={handleOpenReviewModal} />

            {/* COMPREHENSIVE STORE FAQ & JEWELRY CARE HUB */}
            <StoreFAQ />
          </Suspense>
        </main>
      )}

      {/* STORE ADMIN PANEL (Dynamically loaded only when opened by store admin) */}
      {isAdminOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-pink-200 dark:border-neutral-800">
              <span className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Opening Admin Portal...</span>
            </div>
          </div>
        }>
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => {
              setIsAdminOpen(false);
              if (window.location.hash === '#admin') {
                try {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                } catch {}
              }
            }}
            products={products}
            onUpdateProduct={updateProduct}
            onUpdateProductsBatch={updateProductsBatch}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onDeleteProductsBatch={deleteProductsBatch}
            onResetDefaults={resetAll}
          />
        </Suspense>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <Suspense fallback={null}>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onAddToCart={handleAddToCart}
            catalogProducts={products}
          />
        </Suspense>
      )}

      {/* GLOBAL INSTANT SEARCH MODAL */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      )}

      {/* SELF-SERVICE ORDER TRACKING MODAL */}
      {isTrackingOpen && (
        <Suspense fallback={null}>
          <OrderTrackingModal
            isOpen={isTrackingOpen}
            onClose={() => setIsTrackingOpen(false)}
          />
        </Suspense>
      )}

      {/* WISHLIST FAVORITES DRAWER */}
      {isWishlistOpen && (
        <Suspense fallback={null}>
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            onAddToCart={handleAddToCart}
            onOpenProduct={handleSelectProduct}
          />
        </Suspense>
      )}

      {/* OFFICIAL STORE POLICY & SUPPORT MODAL */}
      {isPolicyOpen && (
        <Suspense fallback={null}>
          <PolicyModal
            isOpen={isPolicyOpen}
            onClose={() => setIsPolicyOpen(false)}
            initialTab={policyTab}
          />
        </Suspense>
      )}

      {/* CUSTOMER REVIEW SUBMISSION MODAL */}
      {isReviewModalOpen && (
        <Suspense fallback={null}>
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => {
              setIsReviewModalOpen(false);
              setReviewModalProduct(null);
            }}
            initialProduct={reviewModalProduct}
            products={products}
          />
        </Suspense>
      )}

      {/* FLOATING WHATSAPP SUPPORT WIDGET */}
      <FloatingWhatsApp />

      {/* RECENT VERIFIED PURCHASES / SOCIAL PROOF TOAST */}
      {!isCartOpen && (
        <SocialProofToast
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {/* FOOTER */}
      <Footer 
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          try {
            if (window.location.hash !== '#admin') {
              window.location.hash = '#admin';
            }
          } catch {}
        }} 
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenPolicy={(tab) => {
          setPolicyTab(tab || 'shipping');
          setIsPolicyOpen(true);
        }}
      />
    </div>
  );
}
