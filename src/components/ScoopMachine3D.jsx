import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Gift, RotateCcw, ShoppingBag, AlertCircle } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { disposeThreeScene } from '../utils/threeUtils';
import { SCOOP_TIERS, CHARM_LOOT_POOL } from '../data/storeData';
import WhatsAppIcon from './WhatsAppIcon';

export default function ScoopMachine3D({ onAddToCart, isDark = false }) {
  const containerRef = useRef(null);
  const [selectedTier, setSelectedTier] = useState(SCOOP_TIERS[1]);
  const [isScooping, setIsScooping] = useState(false);
  const [scoopResult, setScoopResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const spoonRef = useRef(null);
  const charmsInSpoonRef = useRef([]);
  const animTimersRef = useRef([]);

  const addTimer = (id) => {
    animTimersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 3D Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const updateCameraFraming = (w, h) => {
      if (!camera || !renderer) return;
      camera.aspect = w / h;
      const isMobile = w < 640;
      if (isMobile) {
        // Mobile view: wider FOV and further camera distance
        // Bowl outer rim diameter is 4.8. At fov 48 and z 9.8, visible width is > 7.5 units!
        // Generous padding ensures bowl rim and scoop handle are NEVER cropped!
        camera.fov = 48;
        camera.position.set(0, 3.4, 9.8);
        camera.lookAt(0, 1.15, 0);
      } else {
        // Desktop view
        camera.fov = 36;
        camera.position.set(0, 3.4, 8.4);
        camera.lookAt(0, 1.1, 0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    updateCameraFraming(width, height);

    // High-Quality Studio Lighting for Gleaming Metals & Glass Bowl
    const ambient = new THREE.AmbientLight(isDark ? 0x9080b0 : 0xffffff, isDark ? 1.6 : 2.0);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
    mainLight.position.set(4, 9, 6);
    scene.add(mainLight);

    // Dedicated highlight spotlight on the rose-gold scoop shovel
    const spoonLight = new THREE.PointLight(0xfff0f5, 4.0, 14);
    spoonLight.position.set(0, 4.8, 3.2);
    scene.add(spoonLight);

    const rimLight = new THREE.PointLight(0xff66cc, 2.5, 14);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffd700, 2.0, 12);
    fillLight.position.set(3, 2, 2);
    scene.add(fillLight);

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

    // 24k Gold Rim on Bowl
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
      const y = 0.25 + Math.random() * 1.05;
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

    // --- AUTHENTIC KAWAII ROSE-GOLD CANDY SCOOP SHOVEL ---
    const createSolidScoopSpoon = () => {
      const spoon = new THREE.Group();

      // Luminous Rose-Gold / Blush Champagne Metal
      const scoopBodyMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFD8E4,        // Radiant soft rose-gold / pearl pink
        metalness: 0.85,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 0.9,
        side: THREE.DoubleSide
      });

      // 24K Polished Yellow Gold (Rolled Rim, Collar, Spacer Rings)
      const goldTrimMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04
      });

      // Ergonomic Pearlescent Pink Handle Grip
      const handleMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFC6DB,
        metalness: 0.35,
        roughness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06
      });

      // Sparkling Faceted Ruby Pink Gem Topper
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xFF1493,
        emissive: 0x440022,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.65,
        thickness: 0.8,
        clearcoat: 1.0
      });

      // 1. Shovel Trough (Contoured U-shaped metal scoop body)
      const troughShape = new THREE.Shape();
      troughShape.moveTo(-0.6, 0.4);
      troughShape.lineTo(-0.6, 0.05);
      troughShape.bezierCurveTo(-0.6, -0.48, 0, -0.5);
      troughShape.bezierCurveTo(0.6, -0.48, 0.6, 0.05);
      troughShape.lineTo(0.6, 0.4);
      troughShape.lineTo(0.55, 0.4);
      troughShape.lineTo(0.55, 0.05);
      troughShape.bezierCurveTo(0.55, -0.43, 0, -0.45);
      troughShape.bezierCurveTo(-0.55, -0.43, -0.55, 0.05);
      troughShape.lineTo(-0.55, 0.4);
      troughShape.closePath();

      const extrudeSettings = {
        depth: 1.5,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.03,
        bevelThickness: 0.03
      };
      const troughGeo = new THREE.ExtrudeGeometry(troughShape, extrudeSettings);
      troughGeo.center();
      const troughMesh = new THREE.Mesh(troughGeo, scoopBodyMat);
      spoon.add(troughMesh);

      // 2. Rolled 24k Gold Trim Piping along Left & Right Rim Edges
      const rimTubeGeo = new THREE.CylinderGeometry(0.026, 0.026, 1.5, 16);
      rimTubeGeo.rotateX(Math.PI / 2);

      const leftRim = new THREE.Mesh(rimTubeGeo, goldTrimMat);
      leftRim.position.set(-0.575, 0.4, 0);
      spoon.add(leftRim);

      const rightRim = new THREE.Mesh(rimTubeGeo, goldTrimMat);
      rightRim.position.set(0.575, 0.4, 0);
      spoon.add(rightRim);

      // 3. Rounded 24k Gold Front Shovel Lip
      const frontLipGeo = new THREE.TorusGeometry(0.56, 0.028, 12, 32, Math.PI);
      frontLipGeo.rotateZ(Math.PI);
      const frontLip = new THREE.Mesh(frontLipGeo, goldTrimMat);
      frontLip.position.set(0, 0.05, 0.75);
      spoon.add(frontLip);

      // 4. Closed Spherical Back Dome Wall
      const backWallGeo = new THREE.SphereGeometry(0.56, 24, 16, 0, Math.PI, 0, Math.PI * 0.5);
      backWallGeo.rotateX(-Math.PI / 2);
      backWallGeo.rotateZ(Math.PI);
      backWallGeo.scale(1.0, 0.9, 0.55);
      const backWall = new THREE.Mesh(backWallGeo, scoopBodyMat);
      backWall.position.set(0, 0.02, -0.75);
      spoon.add(backWall);

      // 5. Ergonomic Handle Assembly with 24k Gold Collar & Rings
      const handleGroup = new THREE.Group();

      // 24k Gold Collar Shank
      const collarGeo = new THREE.CylinderGeometry(0.15, 0.11, 0.35, 24);
      const collar = new THREE.Mesh(collarGeo, goldTrimMat);
      collar.position.y = 0.18;
      handleGroup.add(collar);

      // Lower Gold Spacer Ring
      const ringGeo = new THREE.TorusGeometry(0.13, 0.028, 12, 24);
      const lowerRing = new THREE.Mesh(ringGeo, goldTrimMat);
      lowerRing.rotation.x = Math.PI / 2;
      lowerRing.position.y = 0.42;
      handleGroup.add(lowerRing);

      // Ergonomic Pearl Pink Grip
      const gripGeo = new THREE.CylinderGeometry(0.11, 0.14, 2.0, 24);
      const grip = new THREE.Mesh(gripGeo, handleMat);
      grip.position.y = 1.45;
      handleGroup.add(grip);

      // Upper Gold Spacer Ring
      const upperRing = new THREE.Mesh(ringGeo, goldTrimMat);
      upperRing.rotation.x = Math.PI / 2;
      upperRing.position.y = 2.45;
      handleGroup.add(upperRing);

      // Gold Crown Cap
      const crownGeo = new THREE.CylinderGeometry(0.13, 0.08, 0.22, 24);
      const crown = new THREE.Mesh(crownGeo, goldTrimMat);
      crown.position.y = 2.6;
      handleGroup.add(crown);

      // Faceted Sparkling Ruby Gem Pommel
      const pommelGeo = new THREE.OctahedronGeometry(0.24, 1);
      pommelGeo.scale(1.0, 1.35, 0.85);
      const pommel = new THREE.Mesh(pommelGeo, gemMat);
      pommel.position.y = 2.92;
      handleGroup.add(pommel);

      handleGroup.position.set(0, 0.04, -0.8);
      handleGroup.rotation.x = -Math.PI / 2 + 0.32;
      spoon.add(handleGroup);

      return spoon;
    };

    const spoon = createSolidScoopSpoon();
    // Resting gracefully above the bowl, tilted so user looks into the golden scoop cavity
    spoon.position.set(0, 2.75, 0.1);
    spoon.rotation.set(0.38, -0.2, 0.1);
    scene.add(spoon);
    spoonRef.current = spoon;

    // Mini charms inside the scoop trough during scooping
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
        spoonRef.current.position.y = 2.75 + Math.sin(time * 2) * 0.08;
        spoonRef.current.rotation.y = -0.2 + Math.cos(time * 1.5) * 0.05;
      }

      particles.rotation.y = time * 0.04;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      updateCameraFraming(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      animTimersRef.current.forEach((t) => {
        clearInterval(t);
        clearTimeout(t);
      });
      animTimersRef.current = [];
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposeThreeScene(scene, renderer);
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

    const plungeInterval = addTimer(setInterval(() => {
      progress += 0.06;
      spoon.position.y = THREE.MathUtils.lerp(startY, dipY, progress);
      spoon.position.z = THREE.MathUtils.lerp(0.1, 0.4, progress);
      spoon.rotation.x = THREE.MathUtils.lerp(0.38, 0.7, progress);

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
        addTimer(setTimeout(() => {
          let liftProgress = 0;
          const liftInterval = addTimer(setInterval(() => {
            liftProgress += 0.05;
            spoon.position.y = THREE.MathUtils.lerp(dipY, 3.4, liftProgress);
            spoon.position.z = THREE.MathUtils.lerp(0.4, 0.0, liftProgress);
            spoon.rotation.x = THREE.MathUtils.lerp(0.7, 0.2, liftProgress);
            spoon.rotation.z = THREE.MathUtils.lerp(-0.15, 0.35, liftProgress);

            if (liftProgress >= 1) {
              clearInterval(liftInterval);

              // PHASE 3: Tilt & deposit haul
              addTimer(setTimeout(() => {
                let dumpProgress = 0;
                const dumpInterval = addTimer(setInterval(() => {
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

                    spoon.position.set(0, 2.75, 0.1);
                    spoon.rotation.set(0.38, -0.2, 0.1);
                    spoon.userData.isAnimating = false;

                    setScoopResult({
                      tier: selectedTier,
                      items: pulledItems,
                      timestamp: new Date().toLocaleTimeString()
                    });
                    setIsScooping(false);
                    setShowModal(true);
                  }
                }, 30));
              }, 350));
            }
          }, 30));
        }, 350));
      }
    }, 30));
  };

  const handleClaimLoot = () => {
    if (!scoopResult) return;
    soundFX.playPop(620);
    const customItem = {
      id: `custom-scoop-${Date.now()}`,
      name: `${scoopResult.tier.name} (Live Haul)`,
      price: scoopResult.tier.priceINR,
      priceINR: scoopResult.tier.priceINR,
      image: '/images/scoop-bowl.jpg',
      category: 'Mystery Scoops',
      scoopedItems: scoopResult.items,
      quantity: 1,
      isScoopTier: true
    };
    onAddToCart(customItem);
    setShowModal(false);
  };

  return (
    <section id="scoop-machine" className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Policy Alert Banner */}
      <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-300 dark:border-pink-800 flex items-center justify-center gap-2.5 text-center text-xs md:text-sm font-bold text-[#E60067] dark:text-pink-300">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#E60067]" />
        <span>
          <strong>Store Policy:</strong> Minimum 3 Products Required to Order • Single Item Order Not Available • 100% Prepaid via UPI QR / WhatsApp (+91 8199922653)
        </span>
      </div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-extrabold text-xs tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span>India's 1st Virtual 3D Mystery Scoop Experience</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-[#231733] dark:text-white">
          Dip The Rose-Gold Scoop. <br />
          <span className="shimmer-text">Collect Your Mystery Happiness.</span>
        </h2>
        <p className="mt-3 text-base md:text-lg text-[#554664] dark:text-[#E0D7EB] font-body font-medium">
          Watch the handcrafted 3D rose-gold scoop plunge into the charm bowl and reveal your personalized mystery haul!
        </p>
      </div>

      {/* 3D Interactive Stage Container (PLACED FIRST: BOWL ABOVE PRICING) */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-[#1E172E]/95 p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden">
        {/* Top Control Bar: Active Tier & Quick Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-pink-100 dark:border-pink-900/40">
          <div className="inline-flex items-center gap-2 bg-pink-50 dark:bg-pink-950/70 px-3.5 py-1.5 rounded-full border border-pink-200 dark:border-pink-800 text-xs font-bold text-[#231733] dark:text-white shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Tier: <strong>{selectedTier.name}</strong> (₹{selectedTier.priceINR})</span>
          </div>

          {/* Quick Tier Switcher Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#554664] dark:text-[#D5CBE2] mr-1 hidden sm:inline">Tier:</span>
            {SCOOP_TIERS.map((tier) => {
              const isSelected = selectedTier.id === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTier(tier);
                    soundFX.playPop(550);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#E60067] text-white shadow-md scale-105'
                      : 'bg-white dark:bg-[#281F3D] text-[#554664] dark:text-[#D5CBE2] border border-pink-200 dark:border-pink-900/60 hover:border-pink-400'
                  }`}
                >
                  {tier.name.replace('Scoop Storey - ', '').replace("Bhaskar's Vault ", '')} (₹{tier.priceINR})
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D WebGL Canvas (Generous height, uncropped responsive framing) */}
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 dark:from-[#171024] dark:via-[#1A1326] dark:to-[#171024]">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* Scoop Action Button & ASMR Hint (BELOW the Canvas, NEVER covers the bowl!) */}
        <div className="mt-5 text-center max-w-md mx-auto px-2">
          <button
            disabled={isScooping}
            onClick={handlePerformScoop}
            className={`w-full py-4 px-6 rounded-2xl font-display font-extrabold text-lg md:text-xl text-white tracking-wide shadow-2xl transition-all flex items-center justify-center gap-3 ${
              selectedTier.btnClass
            } ${isScooping ? 'opacity-70 cursor-not-allowed animate-pulse' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isScooping ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Dipping the Rose-Gold Scoop...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>TAKE A SCOOP NOW! (₹{selectedTier.priceINR})</span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold flex items-center justify-center gap-1.5">
            <span>✨ Turn up sound for tactile ASMR audio feedback!</span>
          </p>
        </div>
      </div>

      {/* Step 2: Choose Scoop Tier Cards (PLACED DIRECTLY BELOW THE BOWL STAGE) */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#E60067] dark:text-pink-400">
              Step 2: Choose Your Scoop Tier
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[#231733] dark:text-white mt-1">
              Pick Your Mystery Scoop Size
            </h3>
          </div>
          <p className="text-xs font-bold text-[#554664] dark:text-[#D5CBE2]">
            Tap any card to preview & load into 3D machine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCOOP_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => {
                  setSelectedTier(tier);
                  soundFX.playPop(550);
                }}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E60067] bg-pink-50/90 dark:bg-[#281F3D] shadow-xl scale-[1.02] ring-2 ring-pink-400/30'
                    : 'border-pink-200/80 dark:border-pink-900/40 bg-white dark:bg-[#1E172E] hover:border-pink-400 hover:shadow-md'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 right-4 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-extrabold text-base text-[#231733] dark:text-white">
                      {tier.name}
                    </h4>
                    <div className="text-right">
                      <span className="text-2xl font-display font-black text-[#E60067] dark:text-pink-400">
                        ₹{tier.priceINR}
                      </span>
                      <span className="block text-[10px] text-[#716182] dark:text-neutral-400 font-bold">
                        All-Inclusive
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold mt-2">
                    {tier.itemsCount}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#483A54] dark:text-[#D5CBE2] font-medium">
                    <Gift className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 shrink-0" />
                    <span>{tier.scoops}x Satisfying Deep Scoops</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier(tier);
                      soundFX.playPop(550);
                    }}
                    className={`text-xs font-black px-3 py-1.5 rounded-xl transition ${
                      isSelected
                        ? 'bg-[#E60067] text-white shadow-xs'
                        : 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Select Tier'}
                  </button>

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
