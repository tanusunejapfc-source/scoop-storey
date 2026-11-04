import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Gift, RotateCcw, ShoppingBag, Eye, Heart, Star, Check, AlertCircle } from 'lucide-react';
import { soundFX } from '../utils/audio';
import WhatsAppIcon from './WhatsAppIcon';

// Mystery Scoop Tiers (Directly synced with official Scoop Storey Canva & Tally options)
export const SCOOP_TIERS = [
  {
    id: 'mini-scoop',
    name: 'Scoop Storey - Mini',
    subtitle: 'Cute Starter Haul',
    scoops: 1,
    itemsCount: '15-20 Handpicked Charms',
    priceINR: 199,
    badge: 'Popular Starter 🎀',
    color: 'from-pink-400 to-rose-400',
    btnClass: 'btn-3d-pink',
    tallyLink: 'https://tally.so/r/PRjXG0'
  },
  {
    id: 'midi-scoop',
    name: 'Scoop Storey - Midi',
    subtitle: 'Fan Favorite Haul',
    scoops: 2,
    itemsCount: '30+ Charms & Resin Minis',
    priceINR: 349,
    badge: '★ Best Value ★',
    color: 'from-purple-400 to-indigo-500',
    btnClass: 'btn-3d-purple',
    tallyLink: 'https://tally.so/r/o96ljX'
  },
  {
    id: 'big-scoop',
    name: 'Scoop Storey - Big',
    subtitle: 'Includes Keychain & Extras',
    scoops: 3,
    itemsCount: '50+ Charms + Keychain + Blind Surprise',
    priceINR: 499,
    badge: 'Collector Choice ✨',
    color: 'from-amber-400 to-orange-500',
    btnClass: 'btn-3d-gold',
    tallyLink: 'https://tally.so/r/7Xl4Qz'
  },
  {
    id: 'vault-mega-scoop',
    name: "Bhaskar's Vault Mega Scoop",
    subtitle: 'The Ultimate ASMR Haul',
    scoops: 5,
    itemsCount: '80+ Luxury Charms + Rare Gold Charm',
    priceINR: 899,
    badge: '👑 VIP Mega Scoop 👑',
    color: 'from-yellow-400 via-pink-400 to-purple-500',
    btnClass: 'btn-3d-gold',
    tallyLink: 'https://tally.so/r/7Xl4Qz'
  }
];

// Charm item pool for loot generation
const CHARM_LOOT_POOL = [
  { name: 'Kawaii Gummy Bear Charm', rarity: 'Common', icon: '🧸', color: '#FF94C2' },
  { name: 'Faceted Aurora Heart Gem', rarity: 'Rare', icon: '💖', color: '#FF4D8D' },
  { name: 'Shimmering Starlight Bead', rarity: 'Common', icon: '⭐', color: '#FFD166' },
  { name: 'Iridescent Sweetwater Pearl', rarity: 'Rare', icon: '🦪', color: '#E0AAFF' },
  { name: 'Mini Sanrio-Style Resin Donut', rarity: 'Rare', icon: '🍩', color: '#FFAAA6' },
  { name: 'Crystal Candy Flower Token', rarity: 'Common', icon: '🌸', color: '#A0E7E5' },
  { name: 'Glitter Heart Slider Charm', rarity: 'Rare', icon: '✨', color: '#C77DFF' },
  { name: 'Hand-Poured Holographic Bear', rarity: 'Epic', icon: '🌈', color: '#70D6FF' },
  { name: 'Pastel Butterfly Hair Pin', rarity: 'Epic', icon: '🦋', color: '#FF99C8' },
  { name: 'Bhaskar Gold Vault Bear Token', rarity: 'Legendary', icon: '👑', color: '#FFD700' },
  { name: 'Mystery Keychain Hardware Kit', rarity: 'Epic', icon: '🗝️', color: '#F3C98B' },
  { name: 'Collector Scented Wax Melt Charm', rarity: 'Rare', icon: '🕯️', color: '#D8B4F8' }
];

export default function ScoopMachine3D({ onAddToCart, isDark = false }) {
  const containerRef = useRef(null);
  const [selectedTier, setSelectedTier] = useState(SCOOP_TIERS[1]);
  const [isScooping, setIsScooping] = useState(false);
  const [scoopResult, setScoopResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const spoonRef = useRef(null);
  const charmsInSpoonRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 3D Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 7.8);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Dynamic High-Quality Lighting
    const ambient = new THREE.AmbientLight(isDark ? 0x9080b0 : 0xffffff, isDark ? 1.6 : 2.0);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
    mainLight.position.set(4, 9, 6);
    scene.add(mainLight);

    const spoonLight = new THREE.PointLight(0xffeedd, 3.5, 15);
    spoonLight.position.set(0, 5, 3.5);
    scene.add(spoonLight);

    const rimLight = new THREE.PointLight(0xff66cc, 2.2, 15);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Decorative Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(3.3, 3.7, 0.45, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1f1733 : 0xffedf4,
      roughness: 0.35,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.22;
    scene.add(baseMesh);

    // Decorative Pastel Bowl (Cylinder taper from 2.4 top to 1.5 bottom)
    const bowlGeo = new THREE.CylinderGeometry(2.4, 1.5, 1.6, 48, 1, true);
    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFAEC4,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.4,
      thickness: 0.8,
      side: THREE.DoubleSide
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.set(0, 0.8, 0);
    scene.add(bowl);

    // Bowl Bottom Disc
    const discGeo = new THREE.CircleGeometry(1.5, 48);
    const discMesh = new THREE.Mesh(discGeo, bowlMat);
    discMesh.rotation.x = -Math.PI / 2;
    discMesh.position.y = 0.01;
    scene.add(discMesh);

    // Gold Rim on Bowl
    const rimGeo = new THREE.TorusGeometry(2.4, 0.09, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.2, metalness: 0.9 });
    const bowlRim = new THREE.Mesh(rimGeo, rimMat);
    bowlRim.rotation.x = Math.PI / 2;
    bowlRim.position.y = 1.6;
    scene.add(bowlRim);

    // Charms filling the bowl (STRICTLY CONSTRAINED INSIDE BOWL)
    const bowlCharmsGroup = new THREE.Group();
    scene.add(bowlCharmsGroup);

    const beadGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const cubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const starGeo = new THREE.OctahedronGeometry(0.2, 0);

    const charmColors = [0xFF6B97, 0xB388FF, 0xFFD166, 0x48CAE4, 0xFFAAA6, 0x70D6FF, 0xFFC6FF];

    for (let i = 0; i < 160; i++) {
      // Height between y = 0.2 and 1.3
      const y = 0.25 + Math.random() * 1.05;
      // Exact inner radius at height y (bowl tapers from 1.5 to 2.4 over height 1.6)
      const maxRadiusAtY = 1.45 + (y / 1.6) * (2.35 - 1.45) - 0.25;
      const radius = Math.random() * maxRadiusAtY;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const geo = i % 3 === 0 ? beadGeo : (i % 3 === 1 ? cubeGeo : starGeo);
      const mat = new THREE.MeshStandardMaterial({
        color: charmColors[i % charmColors.length],
        roughness: 0.2,
        metalness: 0.25
      });

      const charm = new THREE.Mesh(geo, mat);
      charm.position.set(x, y, z);
      charm.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      charm.scale.setScalar(0.75 + Math.random() * 0.45);
      bowlCharmsGroup.add(charm);
    }

    // --- GENUINE 3D SOLID SCOOP SHOVEL SPOON ---
    const createSolidScoopSpoon = () => {
      const spoon = new THREE.Group();

      // Shiny Rose-Gold / Champagne Gold Metal Material
      const spoonMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFA07A,      // Warm Rose Gold
        emissive: 0x331405,   // Warm ambient glow
        metalness: 0.9,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide
      });

      const goldAccentMat = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        metalness: 0.95,
        roughness: 0.15
      });

      // 1. Scoop Trough (Extruded U-shape with physical thickness & bevel)
      const uShape = new THREE.Shape();
      uShape.moveTo(-0.65, 0.45);
      uShape.lineTo(-0.65, 0);
      uShape.bezierCurveTo(-0.65, -0.55, 0.65, -0.55, 0.65, 0);
      uShape.lineTo(0.65, 0.45);
      uShape.lineTo(0.55, 0.45);
      uShape.lineTo(0.55, 0);
      uShape.bezierCurveTo(0.55, -0.45, -0.55, -0.45, -0.55, 0);
      uShape.lineTo(-0.55, 0.45);
      uShape.closePath();

      const extrudeSettings = {
        depth: 1.6,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.06,
        bevelThickness: 0.06
      };
      const troughGeo = new THREE.ExtrudeGeometry(uShape, extrudeSettings);
      troughGeo.center();
      const troughMesh = new THREE.Mesh(troughGeo, spoonMat);
      spoon.add(troughMesh);

      // 2. Rounded Front Shovel Lip
      const frontCapGeo = new THREE.SphereGeometry(0.58, 24, 16, 0, Math.PI, 0, Math.PI * 0.5);
      frontCapGeo.rotateZ(-Math.PI / 2);
      frontCapGeo.scale(0.95, 0.75, 0.85);
      const frontCap = new THREE.Mesh(frontCapGeo, spoonMat);
      frontCap.position.set(0, -0.1, 0.8);
      spoon.add(frontCap);

      // 3. Back Closed Wall
      const backWallGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.1, 24, 1, false, 0, Math.PI);
      backWallGeo.rotateX(Math.PI / 2);
      backWallGeo.rotateZ(Math.PI);
      const backWall = new THREE.Mesh(backWallGeo, spoonMat);
      backWall.position.set(0, -0.05, -0.8);
      spoon.add(backWall);

      // 4. Ergonomic Rose-Gold Handle with Decorative Gold Rings
      const handleGroup = new THREE.Group();
      const handleGeo = new THREE.CylinderGeometry(0.09, 0.14, 2.6, 24);
      const handleMesh = new THREE.Mesh(handleGeo, spoonMat);
      handleMesh.position.set(0, 1.3, 0);
      handleGroup.add(handleMesh);

      const ringGeo = new THREE.TorusGeometry(0.13, 0.03, 12, 24);
      const ring1 = new THREE.Mesh(ringGeo, goldAccentMat);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 0.8;
      handleGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, goldAccentMat);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = 1.7;
      handleGroup.add(ring2);

      // Cute Pink Heart Pommel at top of handle
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0.15, 0.15);
      heartShape.bezierCurveTo(0.15, 0.15, 0.1, 0, 0, 0);
      heartShape.bezierCurveTo(-0.2, 0, -0.2, 0.25, -0.2, 0.25);
      heartShape.bezierCurveTo(-0.2, 0.4, -0.05, 0.55, 0.15, 0.7);
      heartShape.bezierCurveTo(0.35, 0.55, 0.5, 0.4, 0.5, 0.25);
      heartShape.bezierCurveTo(0.5, 0.25, 0.5, 0, 0.3, 0);
      heartShape.bezierCurveTo(0.2, 0, 0.15, 0.15, 0.15, 0.15);

      const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04
      });
      heartGeo.center();
      heartGeo.scale(0.55, -0.55, 0.55);
      const heartMat = new THREE.MeshStandardMaterial({ color: 0xFF3385, roughness: 0.2, metalness: 0.3 });
      const pommel = new THREE.Mesh(heartGeo, heartMat);
      pommel.position.set(0, 2.75, 0);
      handleGroup.add(pommel);

      handleGroup.position.set(0, 0.05, -0.85);
      handleGroup.rotation.x = -Math.PI / 2 + 0.35; // tilted comfortably upward
      spoon.add(handleGroup);

      return spoon;
    };

    const spoon = createSolidScoopSpoon();
    // Position resting gracefully above the bowl, angled for camera view
    spoon.position.set(0, 2.7, 0.1);
    spoon.rotation.set(0.35, 0.15, -0.15);
    scene.add(spoon);
    spoonRef.current = spoon;

    // Mini charms that appear inside the scoop trough during scooping
    const spoonLootGroup = new THREE.Group();
    spoon.add(spoonLootGroup);
    charmsInSpoonRef.current = spoonLootGroup;

    for (let j = 0; j < 16; j++) {
      const geo = j % 2 === 0 ? beadGeo : cubeGeo;
      const mat = new THREE.MeshStandardMaterial({
        color: charmColors[j % charmColors.length],
        roughness: 0.2,
        metalness: 0.2
      });
      const c = new THREE.Mesh(geo, mat);
      c.position.set(
        (Math.random() - 0.5) * 0.7,
        0.05 + (Math.random() - 0.5) * 0.15,
        -0.4 + Math.random() * 0.8
      );
      c.scale.set(0, 0, 0); // hidden initially
      spoonLootGroup.add(c);
    }

    // Sparkle Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 70;
    const posArray = new Float32Array(particleCount * 3);
    for (let k = 0; k < particleCount * 3; k += 3) {
      posArray[k] = (Math.random() - 0.5) * 8;
      posArray[k + 1] = Math.random() * 5;
      posArray[k + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0xff66cc : 0xff88aa,
      size: 0.09,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      bowl.rotation.y = time * 0.12;
      bowlCharmsGroup.rotation.y = time * 0.12;

      // Idle floating sway when not animating
      if (spoonRef.current && !spoonRef.current.userData.isAnimating) {
        spoonRef.current.position.y = 2.7 + Math.sin(time * 2) * 0.1;
        spoonRef.current.rotation.y = 0.15 + Math.cos(time * 1.5) * 0.08;
      }

      particles.rotation.y = time * 0.04;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  // TRIGGER 3D SCOOP ANIMATION SEQUENCE
  const handlePerformScoop = () => {
    if (isScooping || !spoonRef.current) return;

    setIsScooping(true);
    soundFX.playPop(520);

    const spoon = spoonRef.current;
    spoon.userData.isAnimating = true;

    // PHASE 1: Spoon plunges into bowl
    const startY = spoon.position.y;
    const dipY = 0.9;
    let progress = 0;

    const plungeInterval = setInterval(() => {
      progress += 0.06;
      spoon.position.y = THREE.MathUtils.lerp(startY, dipY, progress);
      spoon.position.z = THREE.MathUtils.lerp(0.1, 0.4, progress);
      spoon.rotation.x = THREE.MathUtils.lerp(0.35, 0.7, progress);

      if (progress >= 1) {
        clearInterval(plungeInterval);
        soundFX.playScoopSound();

        // Reveal loot charms inside the spoon
        if (charmsInSpoonRef.current) {
          charmsInSpoonRef.current.children.forEach(c => {
            c.scale.set(1, 1, 1);
          });
        }

        // PHASE 2: Spoon lifts up overflowing with charms
        setTimeout(() => {
          let liftProgress = 0;
          const liftInterval = setInterval(() => {
            liftProgress += 0.05;
            spoon.position.y = THREE.MathUtils.lerp(dipY, 3.4, liftProgress);
            spoon.position.z = THREE.MathUtils.lerp(0.4, 0.0, liftProgress);
            spoon.rotation.x = THREE.MathUtils.lerp(0.7, 0.2, liftProgress);
            spoon.rotation.z = THREE.MathUtils.lerp(-0.15, 0.35, liftProgress);

            if (liftProgress >= 1) {
              clearInterval(liftInterval);

              // PHASE 3: Tilt & deposit haul
              setTimeout(() => {
                let dumpProgress = 0;
                const dumpInterval = setInterval(() => {
                  dumpProgress += 0.08;
                  spoon.rotation.x = THREE.MathUtils.lerp(0.2, 0.8, dumpProgress);
                  spoon.rotation.z = THREE.MathUtils.lerp(0.35, 1.2, dumpProgress);

                  if (dumpProgress >= 1) {
                    clearInterval(dumpInterval);
                    soundFX.playSuccess();

                    confetti({
                      particleCount: 80,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FFFFFF']
                    });

                    const pulledItems = [];
                    const itemCount = selectedTier.scoops * 6;
                    for (let m = 0; m < itemCount; m++) {
                      const randItem = CHARM_LOOT_POOL[Math.floor(Math.random() * CHARM_LOOT_POOL.length)];
                      pulledItems.push({
                        ...randItem,
                        id: `${randItem.name}-${m}-${Date.now()}`
                      });
                    }

                    if (charmsInSpoonRef.current) {
                      charmsInSpoonRef.current.children.forEach(c => {
                        c.scale.set(0, 0, 0);
                      });
                    }

                    spoon.position.set(0, 2.7, 0.1);
                    spoon.rotation.set(0.35, 0.15, -0.15);
                    spoon.userData.isAnimating = false;

                    setScoopResult({
                      tier: selectedTier,
                      items: pulledItems,
                      timestamp: new Date().toLocaleTimeString()
                    });
                    setIsScooping(false);
                    setShowModal(true);
                  }
                }, 30);
              }, 400);
            }
          }, 30);
        }, 500);
      }
    }, 25);
  };

  const handleClaimLoot = () => {
    if (!scoopResult) return;
    onAddToCart({
      id: `custom-scoop-${Date.now()}`,
      name: `${scoopResult.tier.name} (Custom 3D Haul)`,
      subtitle: `${scoopResult.items.length} Curated Charms`,
      priceINR: scoopResult.tier.priceINR,
      image: '/images/scoop-bowl.jpg',
      category: 'Mystery Scoops',
      lootDetails: scoopResult.items
    });
    setShowModal(false);
    soundFX.playPop(700);
  };

  return (
    <section id="scoop-machine" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Policy Notice Box */}
      <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border-2 border-pink-300 dark:border-pink-800 flex items-center justify-center gap-2.5 text-xs font-bold text-[#231733] dark:text-[#E0D7EB] text-center">
        <AlertCircle className="w-4 h-4 text-[#E60067] shrink-0" />
        <span>
          <strong>Store Policy:</strong> Minimum 3 Products Required to Order • Single Item Order Not Available • 100% Prepaid via UPI QR / WhatsApp (+91 8199922653)
        </span>
      </div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-extrabold text-xs tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span>India's 1st Virtual 3D Mystery Scoop Experience</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-[#231733] dark:text-white">
          Dip The Golden Scoop. <br />
          <span className="shimmer-text">Collect Your Mystery Happiness.</span>
        </h2>
        <p className="mt-4 text-base md:text-lg text-[#554664] dark:text-[#E0D7EB] font-body font-medium">
          Choose from official Scoop Storey sizes below, then click <strong className="text-[#E60067] font-bold">SCOOP NOW!</strong> Watch the 3D rose-gold scoop plunge into the charm bowl and reveal your personalized haul!
        </p>
      </div>

      {/* Main 3D Stage & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Tier Selector Sidebar (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#3B2C4C] dark:text-[#E0D7EB] px-1">
            Step 1: Choose Your Scoop Tier
          </div>

          {SCOOP_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => {
                  setSelectedTier(tier);
                  soundFX.playPop(550);
                }}
                className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-[#E60067] bg-pink-50/70 dark:bg-[#281F3D] shadow-xl scale-[1.02] ring-2 ring-pink-400/30'
                    : 'border-pink-200/80 dark:border-pink-900/40 bg-white dark:bg-[#1E172E] hover:border-pink-400 shadow-sm'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm">
                    {tier.badge}
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-[#231733] dark:text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold mt-0.5">
                      {tier.itemsCount}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-display font-black text-[#E60067] dark:text-pink-400">
                      ₹{tier.priceINR}
                    </span>
                    <span className="block text-[10px] text-[#716182] dark:text-neutral-400 font-bold">
                      All-Inclusive
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#483A54] dark:text-[#D5CBE2] font-medium">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Gift className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                    <span>{tier.scoops}x Satisfying Deep Scoops</span>
                  </span>
                  <a
                    href={`https://wa.me/918199922653?text=${encodeURIComponent(`Hi! Mujhe ${tier.name} Rs ${tier.priceINR} wala order karna hai - Only Prepaid`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 hover:underline"
                  >
                    <WhatsAppIcon className="w-3 h-3 text-emerald-600" />
                    <span>Buy on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D WebGL Canvas Stage (Right 8 cols) */}
        <div className="lg:col-span-8 relative rounded-3xl bg-white/90 dark:bg-[#1E172E]/90 p-4 md:p-6 shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden">
          {/* Top Live Stage Badge */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/95 dark:bg-[#1A1326]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-300 dark:border-pink-800 text-xs font-bold text-[#231733] dark:text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Tier: {selectedTier.name} (₹{selectedTier.priceINR})</span>
          </div>

          {/* 3D Canvas Container */}
          <div className="relative w-full h-[400px] md:h-[480px]">
            <div ref={containerRef} className="w-full h-full" />

            {/* In-canvas Scoop Action Button */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-sm text-center">
              <button
                disabled={isScooping}
                onClick={handlePerformScoop}
                className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-lg md:text-xl text-white tracking-wide shadow-2xl transition-all flex items-center justify-center gap-3 ${
                  selectedTier.btnClass
                } ${isScooping ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}`}
              >
                {isScooping ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    <span>Dipping the Golden Scoop...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                    <span>TAKE A SCOOP NOW!</span>
                  </>
                )}
              </button>
              <p className="mt-2 text-xs text-[#554664] dark:text-[#D5CBE2] font-bold">
                ✨ Turn up sound for tactile ASMR audio feedback!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REVEAL LOOT MODAL */}
      {showModal && scoopResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1326] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-pink-400 dark:border-pink-700 relative overflow-hidden animate-scaleUp">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold tracking-wide uppercase shadow-md mb-2">
                <Trophy className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Scoop Complete!</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[#231733] dark:text-white">
                {scoopResult.tier.name}
              </h3>
              <p className="text-xs md:text-sm text-[#554664] dark:text-[#D5CBE2] font-semibold mt-1">
                You scooped <strong className="text-[#E60067] font-bold">{scoopResult.items.length} surprise treasures</strong>!
              </p>
            </div>

            <div className="my-6 max-h-56 overflow-y-auto pr-2 space-y-2">
              {scoopResult.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800/80 border border-pink-200 dark:border-pink-900/40 text-xs md:text-sm font-semibold text-[#231733] dark:text-neutral-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.rarity === 'Legendary'
                        ? 'bg-amber-400 text-purple-950 animate-pulse'
                        : item.rarity === 'Epic'
                        ? 'bg-purple-600 text-white'
                        : item.rarity === 'Rare'
                        ? 'bg-pink-600 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {item.rarity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleClaimLoot}
                className="w-full btn-3d-pink py-3 px-4 rounded-xl font-display font-bold text-white text-sm md:text-base flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add Haul to Bag (₹{scoopResult.tier.priceINR})</span>
              </button>

              <a
                href={`https://wa.me/918199922653?text=${encodeURIComponent(`Hi Bhaskar! 🎀 Mujhe ${scoopResult.tier.name} (Rs ${scoopResult.tier.priceINR}) order karna hai with ${scoopResult.items.length} charms. Please send QR code for payment - Only Prepaid.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Direct Order on WhatsApp (+91 8199922653)</span>
              </a>

              <button
                onClick={() => setShowModal(false)}
                className="py-2 text-xs text-[#554664] hover:text-[#231733] dark:text-neutral-400 dark:hover:text-neutral-200 font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
