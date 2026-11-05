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
  ChevronRight 
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: '✨',
    title: 'Notice: Minimum 3 Products Required to Order',
    sub: 'Single Item Not Available'
  },
  {
    id: 2,
    icon: '🚚',
    title: 'Free Delivery Across India on Orders > ₹499',
    sub: '100% Prepaid UPI'
  },
  {
    id: 3,
    icon: '💬',
    title: 'Instant WhatsApp Order: +91 8199922653',
    sub: 'Chat & UPI QR Code',
    href: 'https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai'
  }
];

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  isDark, 
  onToggleTheme 
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
    { label: '3D Scoop Machine', href: '#scoop-machine' },
    { label: 'Pendants & Chains', href: '#menu' },
    { label: 'Bracelets', href: '#menu' },
    { label: 'Self-Care & Masks', href: '#menu' },
    { label: 'Charm Studio', href: '#charm-studio' },
    { label: 'ASMR Reels', href: '#reels' },
  ];

  const activeAnnouncement = ANNOUNCEMENTS[announcementIndex];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Ticker Announcement (Clean single-line mobile carousel + desktop inline ticker) */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white text-[11px] md:text-xs font-bold py-2 px-3 text-center tracking-wide overflow-hidden shadow-sm">
        {/* Mobile: Perfectly aligned, single-line auto-cycling announcement */}
        <div className="flex sm:hidden items-center justify-between max-w-sm mx-auto">
          <button
            onClick={() => setAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
            className="p-1 text-white/80 hover:text-white transition"
            aria-label="Previous notice"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 px-1 overflow-hidden text-center">
            {activeAnnouncement.href ? (
              <a
                href={activeAnnouncement.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-[11px] leading-tight hover:underline"
              >
                <span>{activeAnnouncement.icon}</span>
                <span className="font-extrabold">{activeAnnouncement.title}</span>
                <span className="text-[10px] text-pink-200 font-medium">({activeAnnouncement.sub})</span>
              </a>
            ) : (
              <div className="inline-flex items-center justify-center gap-1.5 text-[11px] leading-tight">
                <span>{activeAnnouncement.icon}</span>
                <span className="font-extrabold">{activeAnnouncement.title}</span>
                <span className="text-[10px] text-pink-200 font-medium">• {activeAnnouncement.sub}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
            className="p-1 text-white/80 hover:text-white transition"
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
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo & Brand Identity */}
          <a 
            href="#" 
            onClick={() => soundFX.playPop(500)}
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
          >
            <div className="relative shrink-0">
              <img 
                src="/brand-avatar.jpg" 
                alt="Bhaskar Scoop Storey" 
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-pink-400 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 text-xs">✨</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-base sm:text-lg md:text-xl text-[#231733] dark:text-white tracking-tight whitespace-nowrap">
                  Scoop Storey
                </span>
                <span className="text-[9px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black px-1.5 py-0.5 rounded-full border border-pink-300 dark:border-pink-800 shrink-0">
                  3D
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-script font-bold text-[#E60067] dark:text-pink-400 tracking-wider leading-none mt-1">
                • Collect Happiness •
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => soundFX.playPop(480)}
                className="text-xs md:text-sm font-bold text-[#3B2C4C] dark:text-[#E0D7EB] hover:text-[#E60067] dark:hover:text-pink-400 transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons: Sound, Theme, WhatsApp, Instagram, Cart, Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* WhatsApp Quick Order (Desktop) */}
            <a
              href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playPop(520)}
              className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
              title="Chat with Bhaskar on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Instagram Profile Link (Desktop) */}
            <a
              href="https://www.instagram.com/bhaskar_scoopstorey/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playPop(520)}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-sm hover:opacity-95 transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@bhaskar_scoopstorey</span>
            </a>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition"
              title={soundEnabled ? 'Mute ASMR sound effects' : 'Enable ASMR sound effects'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                onToggleTheme();
                soundFX.playPop(580);
              }}
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition"
              title={isDark ? 'Switch to Pastel Cloud Dream' : 'Switch to Midnight Neon Candy'}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-700" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                onOpenCart();
                soundFX.playPop(620);
              }}
              className="relative h-9 sm:h-9.5 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-center gap-1.5 shadow-md hover:from-pink-600 hover:to-rose-700 active:scale-95 transition"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-400 text-purple-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                soundFX.playPop(450);
              }}
              className="lg:hidden w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-neutral-700 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-pink-600" /> : <Menu className="w-4 h-4 text-[#231733] dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl bg-white dark:bg-[#1A1326] border-2 border-pink-200 dark:border-pink-900 shadow-xl space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  soundFX.playPop(480);
                }}
                className="block px-3 py-2 rounded-lg font-bold text-sm text-[#231733] dark:text-neutral-100 hover:bg-pink-100/70 dark:hover:bg-neutral-800"
              >
                {link.label}
              </a>
            ))}
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
