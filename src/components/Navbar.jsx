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
  Sliders 
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

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
  onSelectCategory
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

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
    { label: '3D Scoops', fullLabel: '3D Scoop Machine', href: '#scoop-machine' },
    { label: 'Collections', fullLabel: 'Collections', href: '#menu', isAllCollections: true },
    { label: 'Pendants', fullLabel: 'Pendants & Chains', href: '#menu', category: 'Pendants & Chains' },
    { label: 'Bracelets', fullLabel: 'Bracelets', href: '#menu', category: 'Bracelets & Anklets' },
    { label: 'Self-Care', fullLabel: 'Self-Care & Masks', href: '#menu', category: 'Eye Masks & Self-Care' },
    { label: 'Charm Studio', fullLabel: 'Charm Studio', href: '#charm-studio' },
    { label: 'ASMR Reels', fullLabel: 'ASMR Reels', href: '#reels' },
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
            onClick={() => soundFX.playPop(500)}
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

          {/* Desktop Nav Links - Centered & Clean (Never Overlaps) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5 justify-center flex-1 min-w-0 px-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  soundFX.playPop(480);
                  if (link.isAllCollections) {
                    onSelectCategory?.(null);
                  } else if (link.category) {
                    onSelectCategory?.(link.category);
                  }
                }}
                className={`text-xs xl:text-sm font-bold text-[#3B2C4C] dark:text-[#E0D7EB] hover:text-[#E60067] dark:hover:text-pink-400 transition-colors relative group py-1.5 whitespace-nowrap items-center ${
                  link.category ? 'hidden xl:inline-flex' : 'inline-flex'
                }`}
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons (Compact, Uniform & Sleek) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Admin Panel Button (Desktop/Tablet) */}
            <button
              type="button"
              onClick={() => {
                onOpenAdmin?.();
                soundFX.playPop(550);
              }}
              className="hidden sm:inline-flex h-9 px-2.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 items-center justify-center gap-1.5 hover:bg-pink-100 dark:hover:bg-neutral-700 transition text-xs font-bold shrink-0"
              title="Store Manager: Add/Edit Products, Colors & Images"
              aria-label="Open Store Admin Panel"
            >
              <Sliders className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400" />
              <span className="text-[11px]">Admin</span>
            </button>

            {/* WhatsApp Quick Order (Desktop Icon Button) */}
            <a
              href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playPop(520)}
              className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:scale-105 transition shrink-0"
              title="Chat with Bhaskar on WhatsApp (+91 8199922653)"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>

            {/* Instagram Profile Link (Desktop Icon Button) */}
            <a
              href="https://www.instagram.com/bhaskar_scoopstorey/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playPop(520)}
              className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-sm hover:scale-105 hover:opacity-95 transition shrink-0"
              title="Follow @bhaskar_scoopstorey on Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition shrink-0"
              title={soundEnabled ? 'Mute ASMR sound effects' : 'Enable ASMR sound effects'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 dark:text-pink-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                onToggleTheme();
                soundFX.playPop(580);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition shrink-0"
              title={isDark ? 'Switch to Pastel Cloud Dream' : 'Switch to Midnight Neon Candy'}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => {
                onOpenCart();
                soundFX.playPop(620);
              }}
              className="relative h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-center gap-1.5 shadow-md hover:from-pink-600 hover:to-rose-700 active:scale-95 transition shrink-0"
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

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                soundFX.playPop(450);
              }}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" /> : <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#231733] dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl bg-white dark:bg-[#1A1326] border-2 border-pink-200 dark:border-pink-900 shadow-xl space-y-2.5 animate-fadeIn">
            {/* Quick Controls inside Menu */}
            <div className="grid grid-cols-2 gap-2 pb-1 border-b border-pink-100 dark:border-pink-900/40">
              <button
                type="button"
                onClick={handleToggleSound}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-pink-50/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 border border-pink-200/60 dark:border-neutral-700 active:scale-95 transition"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
                <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleTheme();
                  soundFX.playPop(580);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-pink-50/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 border border-pink-200/60 dark:border-neutral-700 active:scale-95 transition"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-purple-600" />}
                <span>{isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  soundFX.playPop(480);
                  if (link.isAllCollections) {
                    onSelectCategory?.(null);
                  } else if (link.category) {
                    onSelectCategory?.(link.category);
                  }
                }}
                className="block px-3 py-2 rounded-lg font-bold text-sm text-[#231733] dark:text-neutral-100 hover:bg-pink-100/70 dark:hover:bg-neutral-800"
              >
                {link.fullLabel || link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin?.();
                soundFX.playPop(550);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-[#E60067] dark:text-pink-400 bg-pink-50/60 dark:bg-neutral-800/80 flex items-center gap-2 border border-pink-200 dark:border-neutral-700"
            >
              <Sliders className="w-4 h-4" />
              <span>Store Manager (Admin Panel)</span>
            </button>

            <div className="pt-2 border-t border-pink-200/60 dark:border-pink-900/60 space-y-2">
              <a
                href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp: +91 8199922653</span>
              </a>

              <a
                href="https://www.instagram.com/bhaskar_scoopstorey/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram @bhaskar_scoopstorey</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
