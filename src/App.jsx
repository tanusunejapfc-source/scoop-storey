import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import CategoryIconsBar from './components/CategoryIconsBar';
import GlobalSearchModal from './components/GlobalSearchModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistDrawer from './components/WishlistDrawer';
import BoutiqueHero from './components/BoutiqueHero';
import ScoopMachine3D from './components/ScoopMachine3D';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailPage from './components/ProductDetailPage';
import ReelsShowcase from './components/ReelsShowcase';
import BrandStory from './components/BrandStory';
import Testimonials from './components/Testimonials';
import StoreFAQ from './components/StoreFAQ';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SocialProofToast from './components/SocialProofToast';
import PolicyModal from './components/PolicyModal';
import ReviewModal from './components/ReviewModal';
import { useStoreProducts } from './utils/productStore';
import { categoryToSlug, slugToCategory } from './data/storeData';
import { soundFX } from './utils/audio';
import { sendHeartbeat, trackPageView, trackAddToCart, initLivePresence, updateLivePresence } from './utils/analyticsTelemetry';

// Lazy-load heavy AdminPanel (315KB+ source) so normal customers never download it on page visit
const AdminPanel = lazy(() => import('./components/AdminPanel'));

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

  // True Real-Time Supabase Presence & Live Visitor Telemetry Heartbeat
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
        const prodId = hash.replace('#product-', '');
        const found = products.find(p => p.id === prodId);
        if (found) setSelectedProduct(found);
      } else {
        setSelectedProduct(null);
      }

      // 3. Collection Navigation
      if (hash.startsWith('#collection-')) {
        const colId = hash.replace('#collection-', '');
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

  // Track product views for analytics telemetry
  useEffect(() => {
    if (selectedProduct) {
      trackPageView(`/product/${selectedProduct.id}`, selectedProduct.name);
    }
  }, [selectedProduct]);

  // Unified Category Navigation handler
  const handleSelectCategory = (category) => {
    setActiveCollection(category);
    const slug = category ? categoryToSlug(category) : 'all';
    const targetHash = category ? `#collection-${slug}` : '';
    if (window.location.hash !== targetHash) {
      try {
        window.history.pushState({ type: 'collection', category }, '', window.location.pathname + targetHash);
      } catch {
        window.location.hash = targetHash;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          image: product.image || (product.images?.[0] || '/images/deluxe-giftbox.jpg')
        }
      ];
    });
    setIsCartOpen(true);
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

      {/* STYLISH CATEGORY ICONS BAR (Story Bubbles / Quick Category Selector) */}
      <CategoryIconsBar
        activeCategory={activeCollection}
        onSelectCategory={handleSelectCategory}
      />

      {/* ======================================================== */}
      {/* CONDITIONAL ROUTE: Dedicated Category Page vs Homepage   */}
      {/* ======================================================== */}
      {activeCollection ? (
        /* DEDICATED SEPARATE CATEGORY PAGE VIEW */
        <main className="min-h-[70vh]">
          {/* If viewing Mystery Scoops category, display the 3D scoop machine prominently on this page! */}
          {activeCollection === 'Mystery Scoops' && (
            <div className="pt-2 pb-4">
              <ScoopMachine3D onAddToCart={handleAddToCart} isDark={isDark} />
            </div>
          )}

          {/* Dedicated Category Product Grid, Header, Search & Filter Pills */}
          <ProductCatalog 
            products={products} 
            onAddToCart={handleAddToCart} 
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              if (prod) {
                try {
                  window.history.pushState({ type: 'product', id: prod.id }, '', window.location.pathname + `#product-${prod.id}`);
                } catch {
                  window.location.hash = `#product-${prod.id}`;
                }
              }
            }}
            activeCollection={activeCollection}
            onSelectCollection={handleSelectCategory}
          />
        </main>
      ) : (
        /* FULL FEATURED HOMEPAGE */
        <main>
          {/* BOUTIQUE HERO SECTION (Fast, Stylish & Responsive) */}
          <BoutiqueHero 
            onSelectCategory={handleSelectCategory}
            isDark={isDark}
          />

          {/* THE SCOOP MENU (PRODUCT COLLECTIONS HUB) - IMMEDIATELY ACCESSIBLE WITHOUT ENDLESS SCROLL */}
          <ProductCatalog 
            products={products} 
            onAddToCart={handleAddToCart} 
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              if (prod) {
                try {
                  window.history.pushState({ type: 'product', id: prod.id }, '', window.location.pathname + `#product-${prod.id}`);
                } catch {
                  window.location.hash = `#product-${prod.id}`;
                }
              }
            }}
            activeCollection={null}
            onSelectCollection={handleSelectCategory}
          />

          {/* 3D INTERACTIVE VIP MYSTERY SCOOP STUDIO */}
          <div className="relative py-2 md:py-6">
            <ScoopMachine3D onAddToCart={handleAddToCart} isDark={isDark} />
          </div>

          {/* ASMR & INSTAGRAM REELS SHOWCASE */}
          <ReelsShowcase />

          {/* BRAND STORY & PHILOSOPHY */}
          <BrandStory />

          {/* CUSTOMER TESTIMONIALS */}
          <Testimonials onOpenReviewModal={handleOpenReviewModal} />

          {/* COMPREHENSIVE STORE FAQ & JEWELRY CARE HUB */}
          <StoreFAQ />
        </main>
      )}

      {/* PRODUCT DETAIL PAGE / MODAL */}
      {selectedProduct && (
        <ProductDetailPage
          key={selectedProduct.id}
          product={selectedProduct}
          onOpenReviewModal={handleOpenReviewModal}
          onClose={() => {
            setSelectedProduct(null);
            if (window.location.hash.startsWith('#product-')) {
              const fallback = activeCollection ? `#collection-${categoryToSlug(activeCollection)}` : '';
              try {
                window.history.pushState(null, '', window.location.pathname + fallback);
              } catch {
                window.location.hash = fallback;
              }
            }
          }}
          onAddToCart={handleAddToCart}
          allProducts={products}
          onSelectProduct={(prod) => {
            setSelectedProduct(prod);
            if (prod) {
              try {
                window.history.pushState({ type: 'product', id: prod.id }, '', window.location.pathname + `#product-${prod.id}`);
              } catch {
                window.location.hash = `#product-${prod.id}`;
              }
            }
          }}
        />
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

      {/* GLOBAL INSTANT SEARCH MODAL */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onAddToCart={handleAddToCart}
      />

      {/* SELF-SERVICE ORDER TRACKING MODAL */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* WISHLIST FAVORITES DRAWER */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* OFFICIAL STORE POLICY & SUPPORT MODAL */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        initialTab={policyTab}
      />

      {/* CUSTOMER REVIEW SUBMISSION MODAL */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewModalProduct(null);
        }}
        initialProduct={reviewModalProduct}
        products={products}
      />

      {/* FLOATING WHATSAPP SUPPORT WIDGET */}
      <FloatingWhatsApp />

      {/* RECENT VERIFIED PURCHASES / SOCIAL PROOF TOAST */}
      <SocialProofToast
        products={products}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

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
