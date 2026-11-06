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

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: '✨',
    title: 'Notice: Minimum 3 Products Required to Order',
    mobileTitle: 'Min 3 Products Required to Order',
    sub: 'Single Item Not Available',
    mobileSub: '100% Prepaid'
  },
  {
    id: 2,
    icon: '🚚',
    title: 'Free Delivery Across India on Orders > ₹499',
    mobileTitle: 'Free Delivery on Orders > ₹499',
    sub: '100% Prepaid UPI',
    mobileSub: 'Prepaid Only'
  },
  {
    id: 3,
    icon: '💬',
    title: 'Instant WhatsApp Order: +91 8199922653',
    mobileTitle: 'WhatsApp Orders: +91 8199922653',
    sub: 'Chat & UPI QR Code',
    mobileSub: 'Prepaid QR',
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
    { label: 'Charm Studio', fullLabel: '3D Charm Studio', href: '#charm-studio', icon: '✨' },
    { label: 'ASMR Reels', fullLabel: 'ASMR Packing Reels', href: '#reels', icon: '🎬' },
    { label: 'Care & FAQ', fullLabel: 'Care Guide & FAQs', href: '#faq-section', icon: '📖' },
    { label: 'Our Story', fullLabel: 'Brand Story', href: '#story', icon: '🌸' },
    { label: 'Reviews', fullLabel: 'Customer Reviews', href: '#reviews', icon: '⭐' }
  ];

  const activeAnnouncement = ANNOUNCEMENTS[announcementIndex];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Ticker Announcement */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white text-[11px] md:text-xs font-bold py-2 px-3 text-center tracking-wide overflow-hidden shadow-sm">
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
        <div className="hidden sm:flex items-center justify-center gap-3 md:gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span>✨</span>
            <span><strong>Notice:</strong> Minimum 3 Products Required to Order</span>
          </div>
          <span className="text-pink-300">•</span>
          <div className="flex items-center gap-1.5">
            <span>🚚</span>
            <span>Free Delivery Across India over ₹499 (100% Prepaid)</span>
          </div>
          <span className="text-pink-300">•</span>
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
      </div>

      {/* Main Glass Nav */}
      <nav className={`px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-[#1A1326]/95 shadow-md backdrop-blur-xl border-b-2 border-pink-200 dark:border-pink-900' 
          : 'bg-white/90 dark:bg-[#1A1326]/90 backdrop-blur-md border-b border-pink-100 dark:border-pink-950'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 xl:gap-8">
          
          {/* Logo & Brand Identity */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory?.(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              soundFX.playPop(500);
            }}
            className="flex items-center gap-1.5 sm:gap-3 group shrink-0 min-w-0"
          >
            <div className="relative shrink-0">
              <img 
                src="/brand-avatar.jpg" 
                alt="Bhaskar Scoop Storey" 
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-pink-400 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 text-[10px] sm:text-xs">✨</span>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-display font-black text-sm sm:text-lg md:text-xl text-[#231733] dark:text-white tracking-tight whitespace-nowrap">
                  Scoop Storey
                </span>
                <span className="text-[8px] sm:text-[9px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black px-1.5 py-0.5 rounded-full border border-pink-300 dark:border-pink-800 shrink-0">
                  3D
                </span>
              </div>
              <span className="text-[9px] sm:text-xs font-script font-bold text-[#E60067] dark:text-pink-400 tracking-wider leading-none mt-0.5 sm:mt-1 truncate">
                • Collect Happiness •
              </span>
            </div>
          </a>

          {/* Desktop Nav Links - Centered & Clean */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5 justify-center flex-1 min-w-0 px-2">
            {navLinks.slice(0, 5).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
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
                    }, 50);
                  }
                }}
                className="inline-flex items-center text-xs sm:text-sm font-bold text-[#3B2C4C] dark:text-[#E0D7EB] hover:text-[#E60067] dark:hover:text-pink-400 transition-colors relative group py-1.5 whitespace-nowrap"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons: STRICTLY Logo, Search, Sound, Cart + Side Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. Search Icon Button */}
            <button
              type="button"
              onClick={() => {
                onOpenSearch?.();
                soundFX.playPop(550);
              }}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-2.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center gap-1.5 hover:bg-pink-100 dark:hover:bg-neutral-700 transition text-xs font-bold shrink-0 cursor-pointer shadow-xs active:scale-95"
              title="Search products (Ctrl + K)"
              aria-label="Search Store"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E60067] dark:text-pink-400" />
              <span className="hidden md:inline text-[11px] text-neutral-600 dark:text-neutral-300">Search</span>
              <kbd className="hidden xl:inline text-[9px] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-1 py-0.5 rounded text-neutral-400 font-mono">⌘K</kbd>
            </button>

            {/* 2. Sound Icon Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition shrink-0 cursor-pointer shadow-xs active:scale-95"
              title={soundEnabled ? 'Mute ASMR sound effects' : 'Enable ASMR sound effects'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E60067] dark:text-pink-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
              )}
            </button>

            {/* 3. Cart Icon Button */}
            <button
              type="button"
              onClick={() => {
                onOpenCart();
                soundFX.playPop(620);
              }}
              className="relative h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-center gap-1.5 shadow-md hover:from-pink-600 hover:to-rose-700 active:scale-95 transition shrink-0 cursor-pointer"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline font-bold text-xs">Bag</span>
              {cartCount > 0 && (
                <span className="min-w-[16px] sm:min-w-[18px] h-4 sm:h-[18px] px-1 rounded-full bg-yellow-400 text-purple-950 text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 4. Side Menu Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setSideMenuOpen(true);
                soundFX.playPop(500);
              }}
              className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-pink-50/90 dark:bg-neutral-800 text-[#231733] dark:text-neutral-100 border-2 border-pink-300 dark:border-pink-800 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition shrink-0 cursor-pointer shadow-xs active:scale-95"
              aria-label="Open Side Menu"
              title="Menu & Store Options"
            >
              <Menu className="w-4 h-4 text-[#E60067] dark:text-pink-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E60067] ring-2 ring-white dark:ring-neutral-900" />
              )}
            </button>
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
            className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 focus:outline-none"
            role="dialog"
            aria-label="Navigation & Store Controls"
          >
            <div className="w-[320px] sm:w-[380px] max-w-full bg-white dark:bg-[#1A1326] shadow-2xl flex flex-col border-l-2 border-pink-200 dark:border-pink-900/60 relative animate-slide-left h-full">
              
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between bg-gradient-to-r from-pink-50/70 via-white to-pink-50/30 dark:from-[#231733] dark:to-[#1A1326]">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/brand-avatar.jpg" 
                    alt="Bhaskar Scoop Storey" 
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
                    <span className="text-[10px] font-script font-bold text-[#E60067] dark:text-pink-400 block mt-0.5">
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
                  className="w-8 h-8 rounded-full bg-pink-100/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-[#E60067] hover:bg-pink-200 transition flex items-center justify-center cursor-pointer"
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
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isDark ? 'bg-[#E60067]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
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
                      <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/80 flex items-center justify-center text-[#E60067] dark:text-pink-400 shrink-0">
                        <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#E60067] dark:fill-pink-400' : ''}`} />
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
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E60067] text-white">
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
                        <Truck className="w-4 h-4 text-[#E60067] dark:text-pink-400" />
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
                    <span className="text-xs font-black text-[#E60067] dark:text-pink-400">
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
                        <Sliders className="w-4 h-4 text-[#E60067] dark:text-pink-400" />
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
                        <div className="text-[10px] text-emerald-100 font-normal">+91 8199922653 • Chat with Bhaskar</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>

                  <a
                    href="https://www.instagram.com/bhaskar_scoopstorey/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFX.playPop(520)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-sm transition hover:opacity-95 active:scale-95"
                  >
                    <div className="flex items-center gap-2.5">
                      <InstagramIcon className="w-4 h-4 shrink-0" />
                      <div className="text-left">
                        <div>Daily ASMR Packing Reels</div>
                        <div className="text-[10px] text-pink-100 font-normal">@bhaskar_scoopstorey • 15K+ Collectors</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </a>
                </div>

                {/* 4. Policy Micro Notice */}
                <div className="p-3 rounded-2xl bg-pink-100/60 dark:bg-neutral-800/60 border border-pink-200 dark:border-pink-900/40 text-center text-[10px] text-[#554664] dark:text-[#D5CBE2] space-y-0.5">
                  <div className="font-extrabold text-[#E60067] dark:text-pink-400">
                    India 🇮🇳 • Minimum 3 Products Required
                  </div>
                  <div>100% Prepaid Delivery • Single Item Not Available</div>
                </div>

              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
