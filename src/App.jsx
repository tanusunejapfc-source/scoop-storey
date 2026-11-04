import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero3DCanvas from './components/Hero3DCanvas';
import ScoopMachine3D from './components/ScoopMachine3D';
import ProductCatalog from './components/ProductCatalog';
import CharmInspector3D from './components/CharmInspector3D';
import ReelsShowcase from './components/ReelsShowcase';
import BrandStory from './components/BrandStory';
import Testimonials from './components/Testimonials';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Heart, 
  Award, 
  Smile, 
  CheckCircle2, 
  Play 
} from 'lucide-react';
import InstagramIcon from './components/InstagramIcon';
import { soundFX } from './utils/audio';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'The Starlight Mystery Scoop Bowl',
      priceINR: 799,
      priceUSD: 19.99,
      qty: 1,
      image: '/images/scoop-bowl.jpg'
    }
  ]);

  // Apply dark mode attribute
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-400">
      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* HERO SECTION WITH 3D WEBGL CHARMS */}
      <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Call to Action (6 cols) */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel shadow-sm text-pink-600 dark:text-pink-300 font-bold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span>Official 3D Store • @bhaskar_scoopstorey</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
              Collect <span className="shimmer-text">Happiness</span> In Every Single Scoop.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-body max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Step into the world of handcrafted Kawaii mystery scoops, faceted acrylic jewels, and satisfying ASMR unboxings. Every order is packed live with love and shipped straight to you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#scoop-machine"
                onClick={() => soundFX.playPop(600)}
                className="w-full sm:w-auto btn-3d-pink text-white font-display font-bold text-base px-7 py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl"
              >
                <Sparkles className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>Take a 3D Scoop Now</span>
              </a>

              <a
                href="#menu"
                onClick={() => soundFX.playPop(480)}
                className="w-full sm:w-auto glass-panel hover:bg-pink-100/50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-display font-bold text-base px-6 py-4 rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag className="w-5 h-5 text-pink-500" />
                <span>Explore The Menu</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-pink-200/50 dark:border-pink-900/30 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="font-display font-bold text-xl md:text-2xl text-pink-600 dark:text-pink-400">
                  124+
                </div>
                <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Instagram Posts
                </div>
              </div>

              <div>
                <div className="font-display font-bold text-xl md:text-2xl text-purple-600 dark:text-purple-400">
                  100%
                </div>
                <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Hand-Curated Love
                </div>
              </div>

              <div>
                <div className="font-display font-bold text-xl md:text-2xl text-amber-500">
                  4.9★
                </div>
                <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  Collector Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive 3D WebGL Canvas (6 cols) */}
          <div className="lg:col-span-6 relative">
            <Hero3DCanvas isDark={isDark} />
          </div>
        </div>

        {/* Ambient Pastel Glows in Background */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      </section>

      {/* SIGNATURE 3D FEATURE: THE 3D VIRTUAL SCOOP MACHINE */}
      <ScoopMachine3D onAddToCart={handleAddToCart} isDark={isDark} />

      {/* THE SCOOP MENU (PRODUCT CATALOG) */}
      <ProductCatalog onAddToCart={handleAddToCart} />

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
      <Footer />
    </div>
  );
}
