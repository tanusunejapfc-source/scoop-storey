import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShoppingBag, CheckCircle } from 'lucide-react';
import { soundFX } from '../utils/audio';

const RECENT_ACTIVITIES = [
  {
    name: 'Ananya S.',
    city: 'Mumbai',
    item: 'Pearl Glass Cute Mug',
    variant: 'Baby pink',
    time: '2 mins ago',
    image: '/images/deluxe-giftbox.jpg',
    reel: true
  },
  {
    name: 'Pooja K.',
    city: 'Bengaluru',
    item: 'Midi Mystery Scoop ✨',
    variant: 'Pastel Kawaii',
    time: '4 mins ago',
    image: '/images/scoop-bowl.jpg',
    reel: true
  },
  {
    name: 'Tanvi M.',
    city: 'Delhi NCR',
    item: 'Labubu Lipgloss',
    variant: 'Peach',
    time: '6 mins ago',
    image: '/images/eyemasks-skincare.jpg',
    reel: false
  },
  {
    name: 'Rhea D.',
    city: 'Pune',
    item: 'Korean Quilted Pastel Wallet',
    variant: 'Baby Pink',
    time: '8 mins ago',
    image: '/images/korean-wallets.jpg',
    reel: true
  },
  {
    name: 'Kavya R.',
    city: 'Hyderabad',
    item: 'Butterfly Charm Bracelet',
    variant: '18K Yellow Gold',
    time: '12 mins ago',
    image: '/images/charm-bracelets.jpg',
    reel: false
  },
  {
    name: 'Ishita V.',
    city: 'Jaipur',
    item: 'Mini Mystery Scoop Studio',
    variant: 'Mix Charms',
    time: '15 mins ago',
    image: '/images/scoop-bowl.jpg',
    reel: true
  }
];

export default function SocialProofToast({ onSelectProduct, products = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedSession, setIsDismissedSession] = useState(false);

  useEffect(() => {
    if (isDismissedSession) return;

    // First trigger after 7 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 7000);

    // Loop interval: show for 6 seconds, hide for 28 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
        setIsVisible(true);
      }, 28000);
    }, 34000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissedSession]);

  const activity = RECENT_ACTIVITIES[currentIdx];

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissedSession(true);
    soundFX.playPop(350);
  };

  const handleClick = () => {
    soundFX.playPop(500);
    if (onSelectProduct && products.length > 0) {
      const match = products.find(p => 
        p.name.toLowerCase().includes(activity.item.toLowerCase().split(' ')[0])
      );
      if (match) {
        onSelectProduct(match);
      }
    }
  };

  if (!isVisible || isDismissedSession) return null;

  return (
    <div 
      onClick={handleClick}
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[320px] sm:max-w-xs rounded-2xl glass-panel border border-pink-200/90 dark:border-pink-900/60 shadow-xl p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer group hover:scale-[1.02] transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
      style={{ backdropFilter: 'blur(16px)' }}
      role="status"
      aria-live="polite"
    >
      {/* Product Image / Icon */}
      <div className="relative w-12 h-12 rounded-xl bg-pink-100 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={activity.image}
          alt={activity.item}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-white">
          <CheckCircle className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold leading-tight">
          <span className="font-extrabold text-neutral-900 dark:text-white truncate">
            {activity.name}
          </span>
          <span>•</span>
          <span>{activity.city}</span>
          <span>•</span>
          <span className="text-pink-600 dark:text-pink-400 font-bold">{activity.time}</span>
        </div>

        <div className="font-display font-extrabold text-xs text-neutral-900 dark:text-white truncate mt-0.5">
          {activity.item}
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
            Variant: <strong className="text-pink-600 dark:text-pink-400">{activity.variant}</strong>
          </span>
          {activity.reel && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-md font-black bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shrink-0">
              🎬 Reel
            </span>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition shrink-0"
        title="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
