import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Gift, RotateCcw, ShoppingBag, Eye, Heart, Star, Check } from 'lucide-react';
import { soundFX } from '../utils/audio';

// Mystery Scoop Tiers
export const SCOOP_TIERS = [
  {
    id: 'baby-bear',
    name: 'Baby Bear Scoop',
    subtitle: 'Cute Starter Haul',
    scoops: 1,
    itemsCount: '15-20 Charms',
    priceINR: 399,
    priceUSD: 9.99,
    badge: 'Popular for Beginners',
    color: 'from-pink-400 to-rose-400',
    btnClass: 'btn-3d-pink'
  },
  {
    id: 'starlight',
    name: 'Starlight Mystery Scoop',
    subtitle: 'Signature Fan Favorite',
    scoops: 2,
    itemsCount: '35+ Charms & Resin Minis',
    priceINR: 799,
    priceUSD: 19.99,
    badge: '★ Best Value ★',
    color: 'from-purple-400 to-indigo-500',
    btnClass: 'btn-3d-purple'
  },
  {
    id: 'royal-deluxe',
    name: 'Royal Deluxe Scoop',
    subtitle: 'Plushie & Blind Box Included',
    scoops: 3,
    itemsCount: '60+ Charms + Keychain + Blind Box',
    priceINR: 1499,
    priceUSD: 34.99,
    badge: 'Collector Edition',
    color: 'from-amber-400 to-orange-500',
    btnClass: 'btn-3d-gold'
  },
  {
    id: 'bhaskar-vault',
    name: "Bhaskar's Gold Vault Scoop",
    subtitle: 'The Ultimate ASMR Mega Scoop',
    scoops: 5,
    itemsCount: '90+ Luxury Charms + Rare Gold Charm',
    priceINR: 2199,
    priceUSD: 49.99,
    badge: '👑 Legendary VIP 👑',
    color: 'from-yellow-400 via-pink-400 to-purple-500',
    btnClass: 'btn-3d-gold'
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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 7.5);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(isDark ? 0x9080b0 : 0xffffff, 1.8);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xfff0f5, 2.2);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0xff66cc, 2.0, 15);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Decorative Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(3.2, 3.6, 0.4, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1f1a35 : 0xfff0f6,
      roughness: 0.3,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    scene.add(baseMesh);

    // Decorative Pastel Bowl
    const bowlGeo = new THREE.CylinderGeometry(2.4, 1.6, 1.6, 48, 1, true);
    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFC2D4,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.9,
      transmission: 0.3,
      thickness: 0.5,
      side: THREE.DoubleSide
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.set(0, 0.8, 0);
    scene.add(bowl);

    // Bowl Bottom Disc
    const discGeo = new THREE.CircleGeometry(1.6, 48);
    const discMesh = new THREE.Mesh(discGeo, bowlMat);
    discMesh.rotation.x = -Math.PI / 2;
    discMesh.position.y = 0.01;
    scene.add(discMesh);

    // Gold Rim on Bowl
    const rimGeo = new THREE.TorusGeometry(2.4, 0.08, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.2, metalness: 0.85 });
    const bowlRim = new THREE.Mesh(rimGeo, rimMat);
    bowlRim.rotation.x = Math.PI / 2;
    bowlRim.position.y = 1.6;
    scene.add(bowlRim);

    // Charms filling the bowl (Instanced / Multi-Mesh)
    const bowlCharmsGroup = new THREE.Group();
    scene.add(bowlCharmsGroup);

    const beadGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const cubeGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const starGeo = new THREE.OctahedronGeometry(0.2, 0);

    const charmColors = [0xFF6B97, 0xB388FF, 0xFFD166, 0x48CAE4, 0xFFAAA6, 0x70D6FF, 0xFFC6FF];

    // Create 180 mini charms inside the bowl
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.2 + (1.8 - radius) * 0.45 + (Math.random() - 0.5) * 0.35;

      const geo = i % 3 === 0 ? beadGeo : (i % 3 === 1 ? cubeGeo : starGeo);
      const mat = new THREE.MeshStandardMaterial({
        color: charmColors[i % charmColors.length],
        roughness: 0.2,
        metalness: 0.2
      });

      const charm = new THREE.Mesh(geo, mat);
      charm.position.set(x, y, z);
      charm.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      charm.scale.setScalar(0.7 + Math.random() * 0.5);
      bowlCharmsGroup.add(charm);
    }

    // 3D SCOOP SPOON
    const spoonGroup = new THREE.Group();

    // Rose Gold / Golden Metal
    const spoonMat = new THREE.MeshStandardMaterial({
      color: 0xFFB37C,
      metalness: 0.9,
      roughness: 0.2,
    });

    const spoonCupGeo = new THREE.SphereGeometry(0.9, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
    spoonCupGeo.scale(1.2, 0.55, 1.3);
    const spoonCup = new THREE.Mesh(spoonCupGeo, spoonMat);
    spoonCup.rotation.x = Math.PI;
    spoonGroup.add(spoonCup);

    // Spoon Handle
    const spoonHandleGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.2, 16);
    const spoonHandle = new THREE.Mesh(spoonHandleGeo, spoonMat);
    spoonHandle.position.set(0, -1.6, -0.6);
    spoonHandle.rotation.x = 0.4;
    spoonGroup.add(spoonHandle);

    // Initial position above the bowl
    spoonGroup.position.set(0, 3.2, 0);
    spoonGroup.rotation.set(0.4, 0, -0.3);
    scene.add(spoonGroup);
    spoonRef.current = spoonGroup;

    // Mini charms that stick to spoon during scoop
    const spoonLootGroup = new THREE.Group();
    spoonGroup.add(spoonLootGroup);
    charmsInSpoonRef.current = spoonLootGroup;

    for (let j = 0; j < 18; j++) {
      const geo = j % 2 === 0 ? beadGeo : cubeGeo;
      const mat = new THREE.MeshStandardMaterial({
        color: charmColors[j % charmColors.length],
        roughness: 0.2
      });
      const c = new THREE.Mesh(geo, mat);
      c.position.set(
        (Math.random() - 0.5) * 0.9,
        -0.15 + (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.9
      );
      c.scale.set(0, 0, 0); // hidden initially
      spoonLootGroup.add(c);
    }

    // Floating Starlight Particles around bowl
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 80;
    const posArray = new Float32Array(particleCount * 3);
    for (let k = 0; k < particleCount * 3; k += 3) {
      posArray[k] = (Math.random() - 0.5) * 8;
      posArray[k + 1] = Math.random() * 5;
      posArray[k + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0xff66cc : 0xff99bb,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);

    // Render loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle bowl idle rotation
      bowl.rotation.y = time * 0.15;
      bowlCharmsGroup.rotation.y = time * 0.15;

      // Idle spoon float if not currently scooping
      if (spoonRef.current && !spoonRef.current.userData.isAnimating) {
        spoonRef.current.position.y = 3.2 + Math.sin(time * 2) * 0.1;
        spoonRef.current.rotation.y = Math.cos(time * 1.5) * 0.1;
      }

      particles.rotation.y = time * 0.05;
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

  // TRIGGER THE 3D SCOOP SEQUENCE
  const handlePerformScoop = () => {
    if (isScooping || !spoonRef.current) return;

    setIsScooping(true);
    soundFX.playPop(520);

    const spoon = spoonRef.current;
    spoon.userData.isAnimating = true;

    // PHASE 1: Spoon plunges into bowl
    const startY = spoon.position.y;
    const dipY = 1.0;
    let progress = 0;

    const plungeInterval = setInterval(() => {
      progress += 0.06;
      spoon.position.y = THREE.MathUtils.lerp(startY, dipY, progress);
      spoon.rotation.x = THREE.MathUtils.lerp(0.4, 0.8, progress);

      if (progress >= 1) {
        clearInterval(plungeInterval);
        soundFX.playScoopSound();

        // Reveal loot charms in spoon
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
            spoon.position.y = THREE.MathUtils.lerp(dipY, 3.8, liftProgress);
            spoon.rotation.x = THREE.MathUtils.lerp(0.8, -0.2, liftProgress);
            spoon.rotation.z = THREE.MathUtils.lerp(-0.3, 0.3, liftProgress);

            if (liftProgress >= 1) {
              clearInterval(liftInterval);

              // PHASE 3: Spoon tilts and deposits haul
              setTimeout(() => {
                let dumpProgress = 0;
                const dumpInterval = setInterval(() => {
                  dumpProgress += 0.08;
                  spoon.rotation.x = THREE.MathUtils.lerp(-0.2, 0.5, dumpProgress);
                  spoon.rotation.z = THREE.MathUtils.lerp(0.3, 1.2, dumpProgress);

                  if (dumpProgress >= 1) {
                    clearInterval(dumpInterval);
                    soundFX.playSuccess();

                    // Confetti explosion!
                    confetti({
                      particleCount: 80,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FFFFFF']
                    });

                    // Generate loot items according to selected tier
                    const pulledItems = [];
                    const itemCount = selectedTier.scoops * 5;
                    for (let m = 0; m < itemCount; m++) {
                      const randItem = CHARM_LOOT_POOL[Math.floor(Math.random() * CHARM_LOOT_POOL.length)];
                      pulledItems.push({
                        ...randItem,
                        id: `${randItem.name}-${m}-${Date.now()}`
                      });
                    }

                    // Reset spoon charms
                    if (charmsInSpoonRef.current) {
                      charmsInSpoonRef.current.children.forEach(c => {
                        c.scale.set(0, 0, 0);
                      });
                    }

                    spoon.position.set(0, 3.2, 0);
                    spoon.rotation.set(0.4, 0, -0.3);
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
      priceUSD: scoopResult.tier.priceUSD,
      image: '/images/scoop-bowl.jpg',
      category: 'Mystery Scoops',
      lootDetails: scoopResult.items
    });
    setShowModal(false);
    soundFX.playPop(700);
  };

  return (
    <section id="scoop-machine" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-pink-600 dark:text-pink-300 font-medium text-xs tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>The World's First 3D Virtual Scoop Experience</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-neutral-900 dark:text-white">
          Dip The Golden Scoop. <br />
          <span className="shimmer-text">Collect Your Mystery Happiness.</span>
        </h2>
        <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-300 font-body">
          Select your desired scoop size below, then click <strong className="text-pink-600 font-semibold">SCOOP NOW!</strong> Watch our 3D rose-gold scoop plunge into the charm bowl and reveal your personalized haul with rarity scores!
        </p>
      </div>

      {/* Main 3D Stage & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Tier Selector Sidebar (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-1">
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
                    ? 'border-pink-500 bg-white dark:bg-neutral-800 shadow-xl scale-[1.02]'
                    : 'border-transparent bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800/80'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm">
                    {tier.badge}
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {tier.itemsCount}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-display font-extrabold text-pink-600 dark:text-pink-400">
                      ₹{tier.priceINR}
                    </span>
                    <span className="block text-[11px] text-neutral-400 font-medium">
                      (${tier.priceUSD})
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  <Gift className="w-3.5 h-3.5 text-pink-500" />
                  <span>{tier.scoops}x Satisfying Deep Scoops</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D WebGL Canvas Stage (Right 8 cols) */}
        <div className="lg:col-span-8 relative rounded-3xl glass-panel p-4 md:p-6 shadow-2xl border border-pink-200/50 dark:border-pink-900/30 overflow-hidden">
          {/* Top Live Stage Badge */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200 dark:border-pink-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Tier: {selectedTier.name} ({selectedTier.scoops} Scoop)</span>
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
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                ✨ Turn up sound for tactile ASMR audio feedback!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REVEAL LOOT MODAL */}
      {showModal && scoopResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-pink-300 dark:border-pink-700 relative overflow-hidden animate-scaleUp">
            {/* Header Badge */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wide uppercase shadow-md mb-2">
                <Trophy className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Scoop Complete!</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-white">
                {scoopResult.tier.name}
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                You successfully scooped <strong className="text-pink-600">{scoopResult.items.length} surprise treasures</strong>!
              </p>
            </div>

            {/* Loot List Grid */}
            <div className="my-6 max-h-60 overflow-y-auto pr-2 space-y-2">
              {scoopResult.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-pink-50/70 dark:bg-neutral-800/70 border border-pink-100 dark:border-pink-900/30 text-xs md:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.rarity === 'Legendary'
                        ? 'bg-amber-400 text-purple-950 font-black animate-pulse'
                        : item.rarity === 'Epic'
                        ? 'bg-purple-600 text-white'
                        : item.rarity === 'Rare'
                        ? 'bg-pink-500 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {item.rarity}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClaimLoot}
                className="flex-1 btn-3d-pink py-3 px-4 rounded-xl font-display font-bold text-white text-sm md:text-base flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add This Exact Haul to Bag (₹{scoopResult.tier.priceINR})</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
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

