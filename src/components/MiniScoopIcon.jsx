import React from 'react';

/**
 * MiniScoopIcon
 * Custom handcrafted rose-gold scoop shovel icon matching Scoop Storey's
 * signature 3D ASMR dipping shovel tool and charm haul aesthetic.
 */
export default function MiniScoopIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label="Mini Scoop"
      {...props}
    >
      <defs>
        {/* Rose gold metallic body gradient */}
        <linearGradient id="miniScoopRoseGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA6BD" />
          <stop offset="45%" stopColor="#FF337A" />
          <stop offset="80%" stopColor="#E60067" />
          <stop offset="100%" stopColor="#A80044" />
        </linearGradient>

        {/* Shovel cavity depth shading */}
        <linearGradient id="miniScoopCavity" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#831843" />
          <stop offset="60%" stopColor="#640D30" />
          <stop offset="100%" stopColor="#43061E" />
        </linearGradient>

        {/* Golden ferrule and handle accents */}
        <linearGradient id="miniScoopGold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="40%" stopColor="#FCD34D" />
          <stop offset="70%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* 1. Rose-gold & Gold Handle */}
      {/* Handle stem */}
      <line 
        x1="13.5" 
        y1="10.5" 
        x2="19.8" 
        y2="4.2" 
        stroke="url(#miniScoopGold)" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
      />

      {/* Handle center grip accent (rose gold) */}
      <line 
        x1="15.2" 
        y1="8.8" 
        x2="18.2" 
        y2="5.8" 
        stroke="#FF337A" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />

      {/* Handle pommel knob / cute pink gem */}
      <circle 
        cx="20.2" 
        cy="3.8" 
        r="2" 
        fill="#FF2E74" 
        stroke="#FFFFFF" 
        strokeWidth="0.8" 
      />

      {/* Collar ferrule connecting handle to shovel body */}
      <ellipse 
        cx="13.8" 
        cy="10.2" 
        rx="1.7" 
        ry="1" 
        transform="rotate(-45 13.8 10.2)" 
        fill="url(#miniScoopGold)" 
      />

      {/* 2. Outer Scoop Shovel Trough */}
      <path 
        d="M13.5 8.5 C9.8 10.5 6.8 12.2 3.8 14 C2.5 15.6 2.5 17.8 4.6 19.8 C6.8 21.4 10.5 21.2 14.5 16.8 C16.2 14.9 16 12.5 13.5 8.5 Z" 
        fill="url(#miniScoopRoseGold)" 
      />

      {/* 3. Deep inner cavity (trough hollow where charms rest) */}
      <path 
        d="M12.4 9.2 C9.4 11 6.8 12.6 4.6 14.3 C4.1 15.6 4.4 17.2 5.8 18.2 C8.4 19.5 11.6 18 13.9 15.2 C14.8 13.8 14.6 11.8 12.4 9.2 Z" 
        fill="url(#miniScoopCavity)" 
      />

      {/* 4. Inside Cute Charms (Golden Star & Diamond Glint) */}
      {/* 4-point golden star charm inside scoop */}
      <path 
        d="M8.8 14.2 Q8.8 15.6 10.2 15.6 Q8.8 15.6 8.8 17 Q8.8 15.6 7.4 15.6 Q8.8 15.6 8.8 14.2 Z" 
        fill="#FCD34D" 
      />
      {/* Tiny pastel pink pearl charm */}
      <circle cx="11.8" cy="13.4" r="1.1" fill="#FFA6BD" />

      {/* 5. Metallic Polished Rim Highlights */}
      {/* Upper shovel rim reflection */}
      <path 
        d="M13 8.5 C9.8 10.3 6.8 12 3.8 14" 
        stroke="#FFFFFF" 
        strokeWidth="1.1" 
        strokeLinecap="round" 
        opacity="0.9" 
      />
      {/* Front lip highlight */}
      <path 
        d="M3.8 14 C3 15.2 3 16.5 4.6 18.2" 
        stroke="#FFE4E6" 
        strokeWidth="0.8" 
        strokeLinecap="round" 
        opacity="0.8" 
      />

      {/* 6. Sparkle glint on scoop edge ✨ */}
      <path 
        d="M3.4 11.5 Q3.4 12.8 4.7 12.8 Q3.4 12.8 3.4 14.1 Q3.4 12.8 2.1 12.8 Q3.4 12.8 3.4 11.5 Z" 
        fill="#FFFFFF" 
      />
    </svg>
  );
}

