import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Sparkles, 
  Menu, 
  X,
  Heart
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  isDark, 
  onToggleTheme 
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Ticker Announcement (India Only, Min 3 Products, WhatsApp) */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white text-[11px] md:text-xs font-semibold py-1.5 px-4 text-center tracking-wide overflow-hidden shadow-sm">
        <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <span>✨ <strong>Rule:</strong> Minimum 3 Products Required to Order</span>
          <span className="hidden md:inline">•</span>
          <span>Free Delivery Across India over ₹499</span>
          <span className="hidden md:inline">•</span>
          <span>Prepaid UPI / QR Only</span>
          <span>•</span>
          <a 
            href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-yellow-200 transition font-bold"
          >
            <WhatsAppIcon className="w-3 h-3" />
            <span>WhatsApp: +91 8199922653</span>
          </a>
        </div>
      </div>

      {/* Main Glass Nav */}
      <nav className={`px-4 md:px-8 py-3.5 transition-all duration-300 ${
        scrolled 
          ? 'glass-panel shadow-lg backdrop-blur-xl border-b border-pink-200/50 dark:border-pink-900/30' 
          : 'bg-white/40 dark:bg-neutral-950/40 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <a 
            href="#" 
            onClick={() => soundFX.playPop(500)}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img 
                src="/brand-avatar.jpg" 
                alt="Bhaskar Scoop Storey" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-pink-400 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 text-xs">✨</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg md:text-xl text-neutral-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Scoop Storey
                <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 font-extrabold px-1.5 py-0.5 rounded-md border border-pink-300 dark:border-pink-800">
                  INDIA 🇮🇳
                </span>
              </span>
              <span className="block text-[10px] md:text-xs font-script font-bold text-pink-500 tracking-wider">
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
                className="text-xs md:text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons: Sound, Theme, WhatsApp, Instagram, Cart */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* WhatsApp Quick Order */}
            <a
              href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playPop(520)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              title="Chat with Bhaskar on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Instagram Profile Link */}
            <a
              href="https://www.instagram.com/bhaskar_scoopstorey/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playPop(520)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium text-xs shadow-md hover:opacity-95 transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@bhaskar_scoopstorey</span>
            </a>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl glass-pill hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition"
              title={soundEnabled ? 'Mute ASMR sound effects' : 'Enable ASMR sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-pink-500" />
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
              className="p-2 rounded-xl glass-pill hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition"
              title={isDark ? 'Switch to Pastel Cloud Dream' : 'Switch to Midnight Neon Candy'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                onOpenCart();
                soundFX.playPop(620);
              }}
              className="relative p-2.5 rounded-2xl btn-3d-pink text-white flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-purple-900 text-xs font-black flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                soundFX.playPop(450);
              }}
              className="lg:hidden p-2 rounded-xl glass-pill text-neutral-800 dark:text-neutral-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  soundFX.playPop(480);
                }}
                className="block px-3 py-2 rounded-lg font-semibold text-sm text-neutral-800 dark:text-neutral-200 hover:bg-pink-100/50 dark:hover:bg-neutral-800"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-pink-200/50 dark:border-pink-900/50 space-y-2">
              <a
                href="https://wa.me/918199922653?text=Hi%20Scoop%20Storey%2C%20mujhe%20order%20place%20karna%20hai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp: +91 8199922653</span>
              </a>

              <a
                href="https://www.instagram.com/bhaskar_scoopstorey/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-medium text-xs"
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
