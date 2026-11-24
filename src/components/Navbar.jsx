import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Menu, 
  X,
  ChevronLeft, 
  ChevronRight, 
  Sliders,
  Search,
  Truck,
  Heart,
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useWishlist } from '../utils/wishlistStore';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';
import MiniScoopIcon from './MiniScoopIcon';
import { CLOUD_DISCOUNTS_URL } from './admin/AdminDiscountsCMS';

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: '✨',
    title: 'Free Shipping Across India on Orders ₹499+ • Cash on Delivery Available',
    mobileTitle: 'COD Available • Free Shipping ₹499+',
    sub: 'Pan-India Delivery',
    mobileSub: 'Zero Advance'
  },
  {
    id: 2,
    icon: '📦',
    title: 'Cash on Delivery (COD) Available • Pay When Your Parcel Arrives',
    mobileTitle: 'Cash on Delivery Available',
    sub: '100% COD or UPI',
    mobileSub: 'Pay at Doorstep'
  },
  {
    id: 3,
    icon: '💬',
    title: 'Instant WhatsApp Order & Support: +91 8199922653',
    mobileTitle: 'WhatsApp Orders: +91 8199922653',
    sub: 'Fast Dispatch',
    mobileSub: '1-Tap Order',
    href: 'https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai'
  }
];

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  isDark, 
  onToggleTheme,
  onOpenAdmin,
  onSelectCategory,
  onOpenSearch,
  onOpenTracking,
  onOpenWishlist
}) {
  const { wishlistCount } = useWishlist();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [customAnnouncement, setCustomAnnouncement] = useState(() => {
    try {
      const saved = localStorage.getItem('bhaskar_announcement_cms_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Listen to live announcement updates from Admin CMS & Cloud
  useEffect(() => {
    // Fetch live announcement from cloud storage on mount
    fetch(`${CLOUD_DISCOUNTS_URL}?t=${Date.now()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.announcement) {
          setCustomAnnouncement(data.announcement);
          try {
            localStorage.setItem('bhaskar_announcement_cms_v1', JSON.stringify(data.announcement));
          } catch {}
        }
      })
      .catch(() => {});

    const handleUpdate = (e) => {
      if (e.detail) {
        setCustomAnnouncement(e.detail);
      }
    };
    window.addEventListener('scoop_announcement_updated', handleUpdate);
    return () => window.removeEventListener('scoop_announcement_updated', handleUpdate);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch?.();
        soundFX.playPop(550);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  // Close side menu on Escape key
  useEffect(() => {
    if (!sideMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSideMenuOpen(false);
        soundFX.playPop(450);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sideMenuOpen]);

  // Lock body scroll when side menu is open
  useEffect(() => {
    if (sideMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sideMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-cycle announcements on mobile every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newState = soundFX.toggleSound();
    setSoundEnabled(newState);
    if (newState) soundFX.playPop(600);
  };

  const navLinks = [
    { label: '3D Scoops', fullLabel: '3D Scoop Machine', href: '#scoop-machine', icon: '🍨' },
    { label: 'Collections', fullLabel: 'All Collections', href: '#collections', isAllCollections: true, icon: '🛍️' },
    { label: 'ASMR Reels', fullLabel: 'ASMR Packing Reels', href: '#reels', icon: '🎬' },
    { label: 'Care & FAQ', fullLabel: 'Care Guide & FAQs', href: '#faq-section', icon: '📖' },
    { label: 'Our Story', fullLabel: 'Brand Story', href: '#story', icon: '🌸' },
    { label: 'Reviews', fullLabel: 'Customer Reviews', href: '#reviews', icon: '⭐' }
  ];

  const activeAnnouncement = ANNOUNCEMENTS[announcementIndex];
  const hasCustom = customAnnouncement && customAnnouncement.enabled && customAnnouncement.text?.trim();

  const themeGradients = {
    pink: 'bg-[#B81D24] text-white',
    purple: 'bg-[#801017] text-white',
    gold: 'bg-amber-600 text-white font-black',
    black: 'bg-neutral-950 text-white'
  };

  const tickerBg = hasCustom && themeGradients[customAnnouncement.bgTheme]
    ? themeGradients[customAnnouncement.bgTheme]
    : 'bg-[#A31D24] text-white';

  const categoryNavItems = [
    { label: 'Home', isHome: true },
    { label: 'All Products', isAllCollections: true },
    { label: 'Pendants & Chains', category: 'Pendants & Chains' },
    { label: 'Wallets & Bags', category: 'Korean wallets and bags' },
    { label: 'Bracelets', category: 'Bracelets' },
    { label: '3D Mystery Scoops', href: '#scoop-machine' },
    { label: 'Kawaii Stationery', category: 'Kawaii Stationery' },
    { label: 'ASMR Reels', href: '#reels' },
    { label: 'Reviews', href: '#reviews' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 shadow-xs">
      {/* Top Ticker Announcement - Solid Crimson as in Seoulmate */}
      <div className={`${tickerBg} text-[11px] md:text-xs font-bold py-2 px-3 text-center tracking-wide overflow-hidden transition-colors duration-300`}>
        {hasCustom ? (
          <div className="flex items-center justify-center gap-2 px-2 py-0.5 text-center">
            <span className="animate-bounce shrink-0">📢</span>
            <span className="font-bold tracking-wide leading-tight truncate max-w-[92vw] sm:max-w-none">{customAnnouncement.text}</span>
          </div>
        ) : (
          <>
            {/* Mobile: auto-cycling announcement */}
            <div className="flex sm:hidden items-center justify-between w-full max-w-full px-1">
              <button
                type="button"
                onClick={() => setAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
                className="p-1 text-white/90 hover:text-white transition shrink-0"
                aria-label="Previous notice"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 min-w-0 px-1 text-center overflow-hidden">
                {activeAnnouncement.href ? (
                  <a
                    href={activeAnnouncement.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-[11px] leading-tight hover:underline max-w-full truncate"
                  >
                    <span className="shrink-0">{activeAnnouncement.icon}</span>
                    <span className="font-extrabold truncate">{activeAnnouncement.mobileTitle || activeAnnouncement.title}</span>
                    <span className="text-[10px] text-pink-200 font-medium shrink-0">• {activeAnnouncement.mobileSub || activeAnnouncement.sub}</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center gap-1 text-[11px] leading-tight max-w-full truncate">
                    <span className="shrink-0">{activeAnnouncement.icon}</span>
                    <span className="font-extrabold truncate">{activeAnnouncement.mobileTitle || activeAnnouncement.title}</span>
                    <span className="text-[10px] text-pink-200 font-medium shrink-0">• {activeAnnouncement.mobileSub || activeAnnouncement.sub}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
                className="p-1 text-white/90 hover:text-white transition shrink-0"
                aria-label="Next notice"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop: Full Horizontal Inline Notice */}
            <div className="hidden sm:flex items-center justify-center gap-3 md:gap-4 flex-wrap text-white">
              <div className="flex items-center gap-1.5">
                <span>✨</span>
                <span><strong>Notice:</strong> 10% off on prepaid orders • Free delivery on orders ₹499+</span>
              </div>
              <span className="text-white/60">•</span>
              <div className="flex items-center gap-1.5">
                <span>📦</span>
                <span>Cash on Delivery (COD) Available Across India!</span>
              </div>
              <span className="text-white/60">•</span>
              <a 
                href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-yellow-200 transition font-black"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp: +91 8199922653</span>
              </a>
            </div>
          </>
        )}
      </div>

      {/* Main Nav Container - Pure White with Subtle Border */}
      <nav className="bg-white dark:bg-[#1A1326] border-b border-[#EAE4E5] dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3">
          {/* Top Row: Brand, Search, Action Pills */}
          <div className="flex items-center justify-between gap-3 md:gap-6">
            
            {/* Logo & Brand Identity */}
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory?.(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                soundFX.playPop(500);
              }}
              className="flex items-center gap-2 group shrink-0 min-w-0"
            >
              <div className="relative shrink-0">
                <img 
                  src="/brand-avatar.jpg" 
                  alt="Tanu - Scoop Storey" 
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-[#EAE4E5] shadow-xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 text-[10px]">🌸</span>
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                  <span className="font-serif-display font-bold text-base sm:text-xl md:text-2xl text-[#1A2536] dark:text-white tracking-tight whitespace-nowrap">
                    Scoop Storey
                  </span>
                  <span className="text-[8px] sm:text-[9px] bg-[#FDF2F4] text-[#B81D24] font-bold px-1.5 py-0.5 rounded-full border border-[#F3D7DC] shrink-0">
                    KR
                  </span>
                </div>
                <span className="text-[9px] sm:text-xs font-script font-bold text-[#B81D24] tracking-wider leading-none mt-0.5 sm:mt-1 truncate">
                  • Collect Happiness Everyday •
                </span>
              </div>
            </a>

            {/* Desktop Pill Search Bar (Seoulmate Style) */}
            <button
              type="button"
              onClick={() => {
                onOpenSearch?.();
                soundFX.playPop(550);
              }}
              className="hidden md:flex items-center justify-between flex-1 max-w-sm lg:max-w-md px-4 py-2 rounded-full border border-stone-200 bg-stone-50/60 hover:bg-white text-stone-500 hover:text-stone-800 transition text-xs shadow-xs cursor-pointer"
              title="Search products (Ctrl + K)"
              aria-label="Search Store"
            >
              <div className="flex items-center gap-2 text-stone-500">
                <Search className="w-3.5 h-3.5 text-stone-400" />
                <span className="truncate">Search 18k jewelry, bags, scoops, stationery...</span>
              </div>
              <kbd className="text-[9px] bg-white border border-stone-200 px-1.5 py-0.5 rounded text-stone-400 font-mono shrink-0">⌘K</kbd>
            </button>

            {/* Right Action Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  onOpenSearch?.();
                  soundFX.playPop(550);
                }}
                className="md:hidden h-8 w-8 rounded-full border border-stone-200 bg-white text-stone-700 flex items-center justify-center hover:bg-stone-50 transition cursor-pointer shadow-xs"
                title="Search products"
                aria-label="Search Store"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* Order Tracking Pill */}
              <button
                type="button"
                onClick={() => {
                  onOpenTracking?.();
                  soundFX.playPop(500);
                }}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-[#1A2536] text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                title="Track your order"
              >
                <Truck className="w-3.5 h-3.5 text-stone-600" />
                <span>Track Order</span>
              </button>

              {/* Wishlist Pill */}
              <button
                type="button"
                onClick={() => {
                  onOpenWishlist?.();
                  soundFX.playPop(500);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-[#1A2536] text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                title="Your Wishlist"
                aria-label="Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-[#B81D24] fill-[#B81D24]' : 'text-stone-600'}`} />
                <span className="text-xs font-bold">{wishlistCount}</span>
              </button>

              {/* Cart Pill - Solid Crimson Red (Seoulmate Exact) */}
              <button
                type="button"
                onClick={() => {
                  onOpenCart();
                  soundFX.playPop(620);
                }}
                className="relative h-8 sm:h-9 px-3.5 sm:px-4 rounded-full bg-[#B81D24] hover:bg-[#9B151C] text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition shrink-0 cursor-pointer font-bold text-xs"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <span>Cart</span>
                <span className="font-extrabold ml-0.5">{cartCount}</span>
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={handleToggleSound}
                className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-stone-200 bg-white text-stone-700 items-center justify-center hover:bg-stone-50 transition cursor-pointer shadow-xs"
                title={soundEnabled ? 'Mute ASMR sound effects' : 'Enable ASMR sound effects'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#B81D24]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              {/* Side Menu Drawer Button */}
              <button
                type="button"
                onClick={() => {
                  setSideMenuOpen(true);
                  soundFX.playPop(500);
                }}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-stone-200 bg-white text-stone-800 flex items-center justify-center hover:bg-stone-50 transition shrink-0 cursor-pointer shadow-xs active:scale-95"
                aria-label="Open Store Menu"
                title="Store Options"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Seoulmate Style Horizontal Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 pt-3 mt-1 border-t border-stone-100 dark:border-stone-800 text-xs font-semibold text-[#1A2536] dark:text-[#E0D7EB]">
            {categoryNavItems.map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <a
                  key={item.label}
                  href={item.href || '#collections'}
                  onClick={(e) => {
                    soundFX.playPop(480);
                    if (item.isHome) {
                      e.preventDefault();
                      onSelectCategory?.(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (item.isAllCollections) {
                      e.preventDefault();
                      onSelectCategory?.('All Items');
                      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.category) {
                      e.preventDefault();
                      onSelectCategory?.(item.category);
                      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.href?.startsWith('#')) {
                      e.preventDefault();
                      const target = document.getElementById(item.href.slice(1));
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className={`transition-colors pb-1 cursor-pointer whitespace-nowrap ${
                    isFirst 
                      ? 'text-[#B81D24] font-bold border-b-2 border-[#B81D24]' 
                      : 'hover:text-[#B81D24] text-[#1A2536] dark:text-stone-300'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* LUXURY SIDE MENU DRAWER (Off-Canvas Menu Panel)         */}
      {/* ======================================================== */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Dark Backdrop */}
          <div 
            onClick={() => {
              setSideMenuOpen(false);
              soundFX.playPop(450);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-in Panel from Right */}
          <aside 
            className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 focus:outline-none"
            role="dialog"
            aria-label="Navigation & Store Controls"
          >
            <div className="w-full sm:w-[380px] max-w-[88vw] sm:max-w-full bg-white dark:bg-[#1A1326] shadow-2xl flex flex-col border-l-2 border-pink-200 dark:border-pink-900/60 relative animate-slide-left h-full">
              
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between bg-gradient-to-r from-pink-50/70 via-white to-pink-50/30 dark:from-[#231733] dark:to-[#1A1326]">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/brand-avatar.jpg" 
                    alt="Tanu - Scoop Storey" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 leading-none">
                      <h3 className="font-display font-extrabold text-base text-[#231733] dark:text-white">
                        Scoop Storey
                      </h3>
                      <span className="text-[9px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black px-1.5 py-0.5 rounded-full border border-pink-300 dark:border-pink-800">
                        3D
                      </span>
                    </div>
                    <span className="text-[10px] font-script font-bold text-[#B81D24] dark:text-pink-400 block mt-0.5">
                      • Collect Happiness •
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSideMenuOpen(false);
                    soundFX.playPop(450);
                  }}
                  className="w-8 h-8 rounded-full bg-pink-100/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-[#B81D24] hover:bg-pink-200 transition flex items-center justify-center cursor-pointer"
                  aria-label="Close Side Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* 1. Quick Store Controls (Theme, Wishlist, Tracking, Admin) */}
                <div className="space-y-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                    Store Settings & Tools
                  </div>

                  {/* Dark Mode Switch Card */}
                  <button
                    type="button"
                    onClick={() => {
                      onToggleTheme();
                      soundFX.playPop(580);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-200/70 dark:border-neutral-700 hover:bg-pink-100/70 dark:hover:bg-neutral-750 transition cursor-pointer text-left shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                        {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white">
                          {isDark ? 'Midnight Neon Candy' : 'Pastel Cloud Dream'}
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                          {isDark ? 'Dark theme active' : 'Light theme active'} • Tap to toggle
                        </div>
                      </div>
                    </div>
                    {/* Toggle Switch Visual */}
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isDark ? 'bg-[#B81D24]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </button>

                  {/* Saved Favorites / Wishlist Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSideMenuOpen(false);
                      onOpenWishlist?.();
                      soundFX.playPop(550);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-200/70 dark:border-neutral-700 hover:bg-pink-100/70 dark:hover:bg-neutral-750 transition cursor-pointer text-left shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/80 flex items-center justify-center text-[#B81D24] dark:text-pink-400 shrink-0">
                        <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#B81D24] dark:fill-pink-400' : ''}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white">
                          Saved Favorites
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                          {wishlistCount > 0 ? `${wishlistCount} item(s) saved in wishlist` : 'No items saved yet'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {wishlistCount > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#B81D24] text-white">
                          {wishlistCount}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </button>

                  {/* Live Order & Reel Tracking Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSideMenuOpen(false);
                      onOpenTracking?.();
                      soundFX.playPop(550);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-50/90 via-purple-50/70 to-pink-50/90 dark:bg-neutral-800/80 border border-pink-200/80 dark:border-neutral-700 hover:opacity-95 transition cursor-pointer text-left shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
                        <Truck className="w-4 h-4 text-[#B81D24] dark:text-pink-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <span>Track Your Order</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                          Live tracking & Instagram reel status
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#B81D24] dark:text-pink-400">
                      Live ➔
                    </span>
                  </button>

                  {/* Store Manager (Admin Panel) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSideMenuOpen(false);
                      onOpenAdmin?.();
                      soundFX.playPop(550);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50/50 dark:bg-neutral-800/60 border border-pink-200/60 dark:border-neutral-700/80 hover:bg-pink-100/60 transition cursor-pointer text-left shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-neutral-700 flex items-center justify-center text-pink-700 dark:text-pink-300 shrink-0">
                        <Sliders className="w-4 h-4 text-[#B81D24] dark:text-pink-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white">
                          Store Manager (Admin)
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                          Edit products, reels, prices & orders
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                {/* 2. Store Sections & Category Navigation */}
                <div className="space-y-1 pt-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1 mb-1">
                    Explore Scoop Storey
                  </div>

                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        setSideMenuOpen(false);
                        soundFX.playPop(480);
                        if (link.isAllCollections) {
                          e.preventDefault();
                          onSelectCategory?.('All Items');
                        } else if (link.category) {
                          e.preventDefault();
                          onSelectCategory?.(link.category);
                        } else if (link.href?.startsWith('#')) {
                          e.preventDefault();
                          onSelectCategory?.(null);
                          const targetId = link.href.slice(1);
                          setTimeout(() => {
                            const el = document.getElementById(targetId);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }, 100);
                        }
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 hover:bg-pink-100/70 dark:hover:bg-neutral-800 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{link.icon || '✨'}</span>
                        <span>{link.fullLabel || link.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </a>
                  ))}
                </div>

                {/* 3. Direct Contact & Social Channels */}
                <div className="pt-2 space-y-2 border-t border-pink-100 dark:border-pink-900/40">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                    Direct Contact & ASMR
                  </div>

                  <a
                    href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFX.playPop(520)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition active:scale-95"
                  >
                    <div className="flex items-center gap-2.5">
                      <WhatsAppIcon className="w-4 h-4 shrink-0" />
                      <div className="text-left">
                        <div>Order via WhatsApp</div>
                        <div className="text-[10px] text-emerald-100 font-normal">+91 8199922653 • Chat with Tanu</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <a
                    href="https://www.instagram.com/scoopstorey/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFX.playPop(520)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-sm transition hover:opacity-95 active:scale-95"
                  >
                    <div className="flex items-center gap-2.5">
                      <InstagramIcon className="w-4 h-4 shrink-0" />
                      <div className="text-left">
                        <div>Daily ASMR Packing Reels</div>
                        <div className="text-[10px] text-pink-100 font-normal">@scoopstorey • 15K+ Collectors</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>

                {/* 4. Policy Micro Notice */}
                <div className="p-3 rounded-2xl bg-pink-100/60 dark:bg-neutral-800/60 border border-pink-200 dark:border-pink-900/40 text-center text-[10px] text-[#554664] dark:text-[#D5CBE2] space-y-0.5">
                  <div className="font-extrabold text-[#B81D24] dark:text-pink-400">
                    India 🇮🇳 • Any 3 Products or Order ₹499+
                  </div>
                  <div>100% Free Express Delivery Across India</div>
                </div>

              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
