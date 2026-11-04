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
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white text-[11px] md:text-xs font-bold py-1.5 px-4 text-center tracking-wide overflow-hidden shadow-sm">
        <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <span>✨ <strong>Notice:</strong> Minimum 3 Products Required to Order</span>
          <span className="hidden md:inline">•</span>
          <span>Free Delivery Across India over ₹499</span>
          <span className="hidden md:inline">•</span>
          <span>100% Prepaid UPI / QR Only</span>
          <span>•</span>
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
      <nav className={`px-4 md:px-8 py-3.5 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-[#1A1326]/95 shadow-md backdrop-blur-xl border-b-2 border-pink-200 dark:border-pink-900' 
          : 'bg-white/90 dark:bg-[#1A1326]/90 backdrop-blur-md border-b border-pink-100 dark:border-pink-950'
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
              <span className="font-display font-extrabold text-lg md:text-xl text-[#231733] dark:text-white tracking-tight flex items-center gap-1.5">
                Scoop Storey
                <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-black px-1.5 py-0.5 rounded-md border border-pink-300 dark:border-pink-800">
                  INDIA 🇮🇳
                </span>
              </span>
              <span className="block text-[10px] md:text-xs font-script font-bold text-[#E60067] dark:text-pink-400 tracking-wider">
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@bhaskar_scoopstorey</span>
            </a>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-pink-100/70 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 transition"
              title={soundEnabled ? 'Mute ASMR sound effects' : 'Enable ASMR sound effects'}
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
              className="p-2 rounded-xl bg-pink-100/70 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700 transition"
              title={isDark ? 'Switch to Pastel Cloud Dream' : 'Switch to Midnight Neon Candy'}
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
              className="relative p-2.5 rounded-2xl btn-3d-pink text-white flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-purple-950 text-xs font-black flex items-center justify-center animate-bounce shadow-xs">
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
              className="lg:hidden p-2 rounded-xl bg-pink-100/70 dark:bg-neutral-800 text-[#231733] dark:text-neutral-200 border border-pink-200 dark:border-neutral-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
