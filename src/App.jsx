import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero3DCanvas from './components/Hero3DCanvas';
import ScoopMachine3D from './components/ScoopMachine3D';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailPage from './components/ProductDetailPage';
import AdminPanel from './components/AdminPanel';
import CharmInspector3D from './components/CharmInspector3D';
import ReelsShowcase from './components/ReelsShowcase';
import BrandStory from './components/BrandStory';
import Testimonials from './components/Testimonials';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { useStoreProducts } from './utils/productStore';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dynamic Product Store (synced with localStorage & Admin updates)
  const { 
    products, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    resetAll 
  } = useStoreProducts();

  const [cartItems, setCartItems] = useState([
    {
      id: 'scoop-mini',
      cartKey: 'scoop-mini',
      name: 'Scoop Storey - Mini Scoop',
      priceINR: 199,
      qty: 1,
      image: '/images/scoop-bowl.jpg',
      selectedColor: 'Pastel Kawaii Mix',
      selectedColorHex: '#FFAAA6'
    }
  ]);

  // Apply dark mode class to html element ONLY when toggled
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Check URL hash for direct links (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminOpen(true);
      } else if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const found = products.find(p => p.id === prodId);
        if (found) setSelectedProduct(found);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  // Cart operations with color variant support
  const handleAddToCart = (product) => {
    const colorSuffix = product.selectedColor ? `-${product.selectedColor}` : '';
    const itemKey = `${product.id}${colorSuffix}`;
    const addQuantity = product.qty || 1;

    setCartItems(prev => {
      const existing = prev.find(item => (item.cartKey || item.id) === itemKey);
      if (existing) {
        return prev.map(item =>
          (item.cartKey || item.id) === itemKey 
            ? { ...item, qty: item.qty + addQuantity } 
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
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-300">
      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* HERO SECTION WITH 3D WEBGL CHARMS */}
      <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Call to Action (6 cols) */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-pink-100/90 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-extrabold text-[11px] sm:text-xs tracking-wide uppercase shadow-xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" />
              <span className="whitespace-nowrap">India 🇮🇳 • Min 3 Items Required • 100% Prepaid</span>
            </div>

            {/* Main Title - High Contrast Dark Plum in light mode, Crisp White in dark */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[#231733] dark:text-white leading-[1.14]">
              Collect <span className="shimmer-text">Happiness</span> In Every Single Scoop.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#554664] dark:text-[#E0D7EB] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              India's first 3D interactive mystery scoop studio. Dip for Kawaii charms, Korean pendants, charm bracelets, and self-care surprises — all hand-packed on Instagram Reels!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#scoop-machine"
                className="w-full sm:w-auto btn-3d-pink px-7 py-3.5 rounded-2xl font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl text-center"
              >
                <span>Dip a 3D Scoop</span>
                <span>✨</span>
              </a>

              <a
                href="#menu"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-neutral-800/90 border-2 border-pink-300 dark:border-pink-800 text-[#231733] dark:text-white font-display font-bold text-sm sm:text-base hover:bg-pink-50 dark:hover:bg-neutral-700 transition shadow-sm text-center"
              >
                <span>Browse Products & Colors</span>
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold border-t border-pink-200/60 dark:border-pink-900/40">
              <div>
                <strong className="text-neutral-900 dark:text-white text-sm font-extrabold block">15,000+</strong>
                <span>Charms Scooped</span>
              </div>
              <div className="w-px h-7 bg-pink-200 dark:bg-pink-900" />
              <div>
                <strong className="text-neutral-900 dark:text-white text-sm font-extrabold block">100%</strong>
                <span>Prepaid India Delivery</span>
              </div>
              <div className="w-px h-7 bg-pink-200 dark:bg-pink-900" />
              <div>
                <strong className="text-neutral-900 dark:text-white text-sm font-extrabold block">4.9 ★</strong>
                <span>Instagram Community</span>
              </div>
            </div>
          </div>

          {/* Right 3D Visualizer Canvas (6 cols) */}
          <div className="lg:col-span-6 relative aspect-square max-w-[500px] mx-auto lg:max-w-none w-full">
            <Hero3DCanvas isDark={isDark} />
          </div>
        </div>
      </section>

      {/* 3D INTERACTIVE MYSTERY SCOOP MACHINE */}
      <section id="scoop-machine">
        <ScoopMachine3D onAddToCart={handleAddToCart} isDark={isDark} />
      </section>

      {/* THE SCOOP MENU (PRODUCT CATALOG) */}
      <ProductCatalog 
        products={products} 
        onAddToCart={handleAddToCart} 
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* 360° REAL-TIME 3D CHARM INSPECTOR STUDIO */}
      <div id="charm-studio">
        <CharmInspector3D isDark={isDark} />
      </div>

      {/* ASMR & INSTAGRAM REELS SHOWCASE */}
      <ReelsShowcase />

      {/* BRAND STORY & PHILOSOPHY */}
      <BrandStory />

      {/* CUSTOMER TESTIMONIALS */}
      <Testimonials />

      {/* PRODUCT DETAIL PAGE / MODAL */}
      <ProductDetailPage
        key={selectedProduct?.id || 'none'}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* STORE ADMIN PANEL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProduct={updateProduct}
        onAddProduct={addProduct}
        onDeleteProduct={deleteProduct}
        onResetDefaults={resetAll}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* FOOTER */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
    </div>
  );
}
