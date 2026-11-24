import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Trophy, Gift, RotateCcw, ShoppingBag, AlertCircle, 
  Check, X, Camera, List, Volume2, VolumeX, Eye, ArrowRight, ArrowLeft
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { disposeThreeScene } from '../utils/threeUtils';
import { SCOOP_TIERS, CHARM_LOOT_POOL, MYSTERY_SCOOP_CATEGORIES } from '../data/storeData';
import WhatsAppIcon from './WhatsAppIcon';

// Helper to determine exact random item count based on scoop tier description
export const getTierCharmsCount = (tierId) => {
  if (tierId === 'mini-scoop' || tierId === 'scoop-mini') {
    // Description: "7–8 Products + Free Gifts" -> strictly 7 or 8 charms
    return Math.floor(Math.random() * 2) + 7;
  }
  if (tierId === 'midi-scoop' || tierId === 'scoop-midi') {
    // Description: "12–15 Products + Free Gifts" -> strictly 12 to 15 charms
    return Math.floor(Math.random() * 4) + 12;
  }
  if (tierId === 'big-scoop' || tierId === 'scoop-big') {
    // Description: "Over 20 Items (20+ Items)" -> strictly 20 to 24 charms
    return Math.floor(Math.random() * 5) + 20;
  }
  return 8;
};

export default function ScoopMachine3D({ onAddToCart, isDark = false, isHero = false }) {
  const containerRef = useRef(null);
  // Default to Mini Scoop (popular starter tier)
  const [selectedTier, setSelectedTier] = useState(SCOOP_TIERS[0]);
  const [isScooping, setIsScooping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scoopResult, setScoopResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addedTierId, setAddedTierId] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [activeChartCategory, setActiveChartCategory] = useState('all');
  const [activeChartTab, setActiveChartTab] = useState('items'); // 'items' | 'photos'
  const [selectedChartPhoto, setSelectedChartPhoto] = useState(null);

  // Gamified "3 Lucky Dips per Session" Rule
  const MAX_LUCKY_DIPS = 3;
  const [dipsRemaining, setDipsRemaining] = useState(() => {
    try {
      const stored = sessionStorage.getItem('bhaskar_lucky_dips_remaining_v1');
      if (stored !== null) {
        const val = parseInt(stored, 10);
        return isNaN(val) ? MAX_LUCKY_DIPS : Math.max(0, Math.min(MAX_LUCKY_DIPS, val));
      }
    } catch {}
    return MAX_LUCKY_DIPS;
  });
  const [showLimitModal, setShowLimitModal] = useState(false);

  const updateDipsRemaining = (newCount) => {
    const safeCount = Math.max(0, Math.min(MAX_LUCKY_DIPS, newCount));
    setDipsRemaining(safeCount);
    try {
      sessionStorage.setItem('bhaskar_lucky_dips_remaining_v1', String(safeCount));
    } catch {}
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showModal) setShowModal(false);
        if (showChartModal) setShowChartModal(false);
        if (showLimitModal) setShowLimitModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showChartModal, showLimitModal]);

  // 3D Scene Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const spoonRef = useRef(null);
  const charmsInSpoonRef = useRef(null);
  const plateCharmsRef = useRef(null);
  const bowlCharmsRef = useRef(null);
  const scoopAnimStateRef = useRef({ active: false, startTime: 0, duration: 5.6 });
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const plateGroupRef = useRef(null);
  const bowlGroupRef = useRef(null);
  const stageLayoutRef = useRef({ bowlTargetX: 0, plateTargetX: 6.0, plateTargetScale: 0.001 });

  // Procedural Geometries for Charms
  const createHeartGeometry = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0.12, 0.12);
    shape.bezierCurveTo(0.12, 0.12, 0.1, 0.22, 0, 0.22);
    shape.bezierCurveTo(-0.14, 0.22, -0.14, 0.08, -0.14, 0.08);
    shape.bezierCurveTo(-0.14, -0.06, -0.04, -0.14, 0.12, -0.24);
    shape.bezierCurveTo(0.28, -0.14, 0.38, -0.06, 0.38, 0.08);
    shape.bezierCurveTo(0.38, 0.08, 0.38, 0.22, 0.24, 0.22);
    shape.bezierCurveTo(0.16, 0.22, 0.12, 0.12, 0.12, 0.12);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    geo.center();
    geo.scale(0.65, 0.65, 0.65);
    return geo;
  };

  const createStarGeometry = () => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerR = 0.22;
    const innerR = 0.10;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025
    });
    geo.center();
    return geo;
  };

  // Ultra-Luxury 18K Rose Gold & Prismatic Crystal Scoop Shovel Model
  const createRealisticScoopSpoon = () => {
    const spoon = new THREE.Group();

    // 1. Physical Materials with Studio HDR Reflections - 18K Luxury Rose Gold & Imperial 24K Gold
    const scoopBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xE83E8C, // Rich vibrant luxury rose gold
      emissive: 0x660028,
      emissiveIntensity: 0.14,
      metalness: 0.72,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      sheen: 1.0,
      sheenColor: 0xFFAEC9,
      side: THREE.DoubleSide
    });

    const goldTrimMat = new THREE.MeshPhysicalMaterial({
      color: 0xF59E0B, // Genuine 24K Imperial Gold
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95
    });

    const handleMat = new THREE.MeshPhysicalMaterial({
      color: 0xCC2B62, // Deep pearlescent rose lacquer
      metalness: 0.35,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.92
    });

    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF007F, // Vivid ruby magenta crystal
      emissive: 0x880033,
      emissiveIntensity: 0.55,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.65,
      thickness: 1.2,
      ior: 1.65,
      clearcoat: 1.0
    });

    // 2. Continuous Curved Shovel Trough
    const uSegments = 40;
    const vSegments = 40;
    const positions = [];
    const uvs = [];
    const indices = [];

    const getPoint = (u, v) => {
      const z = -0.75 + v * 1.6;
      let r = 0.58;
      let backDomeZ = 0;

      if (v < 0.26) {
        const t = v / 0.26;
        const angle = (1 - t) * (Math.PI * 0.5);
        r = 0.58 * Math.cos(angle);
        backDomeZ = -0.22 * Math.sin(angle);
      }

      if (v > 0.8) {
        const ft = (v - 0.8) / 0.2;
        r = 0.58 + ft * 0.08;
      }

      const maxAngle = Math.PI * 0.62;
      const angle = (u - 0.5) * 2 * maxAngle;
      const x = Math.sin(angle) * r;
      let y = -Math.cos(angle) * r + 0.35;

      if (v > 0.75) {
        const ft = (v - 0.75) / 0.25;
        const sideDist = Math.abs(u - 0.5) * 2;
        y -= ft * 0.26 * sideDist;
      }
      return new THREE.Vector3(x, y, z + backDomeZ);
    };

    for (let iv = 0; iv <= vSegments; iv++) {
      const v = iv / vSegments;
      for (let iu = 0; iu <= uSegments; iu++) {
        const u = iu / uSegments;
        const pt = getPoint(u, v);
        positions.push(pt.x, pt.y, pt.z);
        uvs.push(u, v);
      }
    }

    for (let iv = 0; iv < vSegments; iv++) {
      for (let iu = 0; iu < uSegments; iu++) {
        const a = iv * (uSegments + 1) + iu;
        const b = (iv + 1) * (uSegments + 1) + iu;
        const c = (iv + 1) * (uSegments + 1) + (iu + 1);
        const d = iv * (uSegments + 1) + (iu + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const troughGeo = new THREE.BufferGeometry();
    troughGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    troughGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    troughGeo.setIndex(indices);
    troughGeo.computeVertexNormals();

    const troughMesh = new THREE.Mesh(troughGeo, scoopBodyMat);
    spoon.add(troughMesh);

    // 3. Continuous Rolled 24K Gold Tubular Rim Piping
    const rimPoints = [];
    for (let iv = 0; iv <= 32; iv++) {
      rimPoints.push(getPoint(0, iv / 32));
    }
    for (let iu = 1; iu <= 24; iu++) {
      rimPoints.push(getPoint(iu / 24, 1));
    }
    for (let iv = 31; iv >= 0; iv--) {
      rimPoints.push(getPoint(1, iv / 32));
    }
    const rimCurve = new THREE.CatmullRomCurve3(rimPoints);
    const rimTubeGeo = new THREE.TubeGeometry(rimCurve, 84, 0.024, 12, false);
    const rimMesh = new THREE.Mesh(rimTubeGeo, goldTrimMat);
    spoon.add(rimMesh);

    // 4. Handle Assembly with Turned Collar & Ergonomic Grip
    const handleGroup = new THREE.Group();

    const collarGeo = new THREE.CylinderGeometry(0.13, 0.09, 0.38, 24);
    const collar = new THREE.Mesh(collarGeo, goldTrimMat);
    collar.position.y = 0.19;
    handleGroup.add(collar);

    const ringGeo = new THREE.TorusGeometry(0.12, 0.024, 12, 24);
    const lowerRing = new THREE.Mesh(ringGeo, goldTrimMat);
    lowerRing.rotation.x = Math.PI / 2;
    lowerRing.position.y = 0.38;
    handleGroup.add(lowerRing);

    const gripPoints = [
      new THREE.Vector2(0.09, 0.38),
      new THREE.Vector2(0.11, 0.65),
      new THREE.Vector2(0.135, 1.15),
      new THREE.Vector2(0.14, 1.45),
      new THREE.Vector2(0.12, 1.95),
      new THREE.Vector2(0.095, 2.25)
    ];
    const gripGeo = new THREE.LatheGeometry(gripPoints, 32);
    gripGeo.computeVertexNormals();
    const grip = new THREE.Mesh(gripGeo, handleMat);
    handleGroup.add(grip);

    const upperRing = new THREE.Mesh(ringGeo, goldTrimMat);
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = 2.25;
    handleGroup.add(upperRing);

    const crownGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.22, 24);
    const crown = new THREE.Mesh(crownGeo, goldTrimMat);
    crown.position.y = 2.38;
    handleGroup.add(crown);

    const pommelGeo = new THREE.OctahedronGeometry(0.24, 1);
    pommelGeo.scale(1.0, 1.35, 0.85);
    const pommel = new THREE.Mesh(pommelGeo, gemMat);
    pommel.position.y = 2.68;
    handleGroup.add(pommel);

    handleGroup.position.set(0, 0.05, -0.78);
    handleGroup.rotation.x = -Math.PI / 2 + 0.38;
    spoon.add(handleGroup);

    return spoon;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 3D Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05; // Photographic exposure, prevents blowout
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // PMREM RoomEnvironment for Photorealistic Metallic & Glass Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    // Responsive Camera Framing (Frames both the Bowl on the Left and Plate on the Right)
    const updateCameraFraming = (w, h) => {
      if (!camera || !renderer) return;
      camera.aspect = w / h;
      const isMobile = w < 640;
      if (isMobile) {
        camera.fov = 46;
        camera.position.set(0, 3.8, 10.5);
        camera.lookAt(0, 0.95, 0);
      } else {
        camera.fov = 38;
        camera.position.set(0, 3.4, 9.2);
        camera.lookAt(0, 0.95, 0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    updateCameraFraming(width, height);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(isDark ? 0xb0a0d0 : 0xffedf4, isDark ? 0.85 : 1.05);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.85);
    keyLight.position.set(4, 8, 5.5);
    scene.add(keyLight);

    const studioSpot = new THREE.PointLight(0xffd54f, 2.0, 14);
    studioSpot.position.set(0, 4.0, 3.5);
    scene.add(studioSpot);

    // Rim / Backlight (Creates glowing 3D rim halo separating items from backdrop)
    const rimLight = new THREE.DirectionalLight(0xff4081, 1.8);
    rimLight.position.set(-4.5, 6, -5);
    scene.add(rimLight);

    // Soft Lavender Fill Light
    const fillLight = new THREE.DirectionalLight(0xddd6fe, 0.9);
    fillLight.position.set(-3.5, 2, 3);
    scene.add(fillLight);

    // Shared 24K Gold Materials
    const goldMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xF59E0B, // Genuine warm 24K imperial gold
      metalness: 0.94, 
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03
    });

    const champagneTrimMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDE68A, // Radiant champagne gold
      metalness: 0.90,
      roughness: 0.10,
      clearcoat: 1.0
    });

    // Procedural Contact Shadow Texture for realistic ground contact
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const shadowGrad = sCtx.createRadialGradient(64, 64, 12, 64, 64, 64);
    shadowGrad.addColorStop(0, isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(180, 20, 80, 0.40)');
    shadowGrad.addColorStop(0.5, isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(210, 40, 100, 0.18)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = shadowGrad;
    sCtx.fillRect(0, 0, 128, 128);
    const contactShadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const shadowPlaneGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false
    });

    // -------------------------------------------------------------
    // CHARM COMPOTE BOWL (Initially Grandly Centered: x = 0)
    // -------------------------------------------------------------
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(0, 0, 0);
    scene.add(bowlGroup);
    bowlGroupRef.current = bowlGroup;

    // Contact shadow underneath bowl
    const bowlContactShadow = new THREE.Mesh(shadowPlaneGeo, shadowMat);
    bowlContactShadow.rotation.x = -Math.PI / 2;
    bowlContactShadow.position.y = -0.34;
    bowlGroup.add(bowlContactShadow);

    const bowlLight = new THREE.PointLight(0xffe4ec, 2.0, 12);
    bowlLight.position.set(0, 4.0, 2.0);
    bowlGroup.add(bowlLight);

    // Multi-tiered Luxury Pedestal for Bowl
    // Plinth 1 (Lower Exhibition Base)
    const bowlBase1Geo = new THREE.CylinderGeometry(2.10, 2.26, 0.22, 52);
    const baseMat1 = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x220D2E : 0xFFF2F6,
      metalness: 0.28,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95
    });
    const bowlBase1 = new THREE.Mesh(bowlBase1Geo, baseMat1);
    bowlBase1.position.y = -0.20;
    bowlGroup.add(bowlBase1);

    const bowlBaseTrim1Geo = new THREE.TorusGeometry(2.18, 0.045, 16, 52);
    const bowlBaseTrim1 = new THREE.Mesh(bowlBaseTrim1Geo, goldMat);
    bowlBaseTrim1.rotation.x = Math.PI / 2;
    bowlBaseTrim1.position.y = -0.09;
    bowlGroup.add(bowlBaseTrim1);

    // Plinth 2 (Upper Rose Gold Satin Tier)
    const bowlBase2Geo = new THREE.CylinderGeometry(1.72, 1.90, 0.16, 52);
    const baseMat2 = new THREE.MeshPhysicalMaterial({
      color: 0xDE3C74, // Rose gold
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });
    const bowlBase2 = new THREE.Mesh(bowlBase2Geo, baseMat2);
    bowlBase2.position.y = -0.04;
    bowlGroup.add(bowlBase2);

    const bowlBaseTrim2Geo = new THREE.TorusGeometry(1.74, 0.04, 16, 52);
    const bowlBaseTrim2 = new THREE.Mesh(bowlBaseTrim2Geo, goldMat);
    bowlBaseTrim2.rotation.x = Math.PI / 2;
    bowlBaseTrim2.position.y = 0.04;
    bowlGroup.add(bowlBaseTrim2);

    // Under-Bowl Radiant Jewel Spotlight (Illuminates crystal with gentle warmth without bleaching charms)
    const innerBowlSpot = new THREE.PointLight(0xff2a85, 1.4, 7.0);
    innerBowlSpot.position.set(0, 0.50, 0);
    bowlGroup.add(innerBowlSpot);

    // Sculpted Luxury Lotus Compote Crystal Bowl
    // Smooth, sensual double-curved silhouette: Flared Foot -> Stem Waist with 24K Gold Ring -> Lush Rounded Belly -> Flared Ruffled Lip
    const compotePoints = [
      new THREE.Vector2(0.00, 0.00),  // Center base
      new THREE.Vector2(0.70, 0.02),  // Base flat
      new THREE.Vector2(1.15, 0.06),  // Foot curve
      new THREE.Vector2(1.30, 0.14),  // Foot outer rim
      new THREE.Vector2(1.18, 0.22),  // Foot bevel transition
      new THREE.Vector2(0.78, 0.36),  // Inward sweep to stem
      new THREE.Vector2(0.66, 0.46),  // Slim baluster waist
      new THREE.Vector2(0.76, 0.58),  // Waist swelling upward
      new THREE.Vector2(1.18, 0.76),  // Bowl basin flare
      new THREE.Vector2(1.62, 1.02),  // Lush convex belly
      new THREE.Vector2(1.92, 1.34),  // Upper belly
      new THREE.Vector2(2.10, 1.62),  // Flared neck
      new THREE.Vector2(2.22, 1.82),  // Outward lotus lip crest
      new THREE.Vector2(2.18, 1.86),  // Polished lip edge
      new THREE.Vector2(2.08, 1.82),  // Inner lip bevel
      new THREE.Vector2(1.92, 1.58),  // Inner flared neck
      new THREE.Vector2(1.58, 1.28),  // Inner belly
      new THREE.Vector2(1.22, 0.96),  // Inner lower belly
      new THREE.Vector2(0.82, 0.72),  // Inner basin base
      new THREE.Vector2(0.00, 0.68)   // Inner center bottom
    ];
    const compoteGeo = new THREE.LatheGeometry(compotePoints, 52);
    compoteGeo.computeVertexNormals();

    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF5495, // Vibrant strawberry rose quartz
      emissive: 0x660028,
      emissiveIntensity: 0.20, // Retains warm luminous jewel brilliance
      roughness: 0.04,
      metalness: 0.08,
      transmission: 0.35, // Saturated, gem-like crystal depth - never washed out!
      ior: 1.62,
      thickness: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 1.0, // Prismatic rainbow diamond sheen!
      iridescenceIOR: 1.55,
      iridescenceThicknessRange: [180, 520],
      sheen: 0.9,
      sheenColor: 0xFFB6C1, // Soft peach-pink velvet rim glow
      attenuationColor: 0xDE0068,
      attenuationDistance: 0.75,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const bowlMesh = new THREE.Mesh(compoteGeo, bowlMat);
    bowlGroup.add(bowlMesh);

    // 24K Gold Foot Rim Ring
    const bowlFootRingGeo = new THREE.TorusGeometry(1.28, 0.045, 16, 52);
    const bowlFootRing = new THREE.Mesh(bowlFootRingGeo, goldMat);
    bowlFootRing.rotation.x = Math.PI / 2;
    bowlFootRing.position.y = 0.14;
    bowlGroup.add(bowlFootRing);

    // 24K Gold Stem Waist Collar Ring
    const bowlWaistRingGeo = new THREE.TorusGeometry(0.72, 0.05, 16, 52);
    const bowlWaistRing = new THREE.Mesh(bowlWaistRingGeo, goldMat);
    bowlWaistRing.rotation.x = Math.PI / 2;
    bowlWaistRing.position.y = 0.46;
    bowlGroup.add(bowlWaistRing);

    // 24K Gold Crown Rim on Bowl
    const bowlRimGeo = new THREE.TorusGeometry(2.20, 0.065, 16, 52);
    const bowlRim = new THREE.Mesh(bowlRimGeo, goldMat);
    bowlRim.rotation.x = Math.PI / 2;
    bowlRim.position.y = 1.84;
    bowlGroup.add(bowlRim);

    // Charms filling the bowl
    const bowlCharmsGroup = new THREE.Group();
    bowlGroup.add(bowlCharmsGroup);
    bowlCharmsRef.current = bowlCharmsGroup;

    const beadGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const starGeo = createStarGeometry();
    const heartGeo = createHeartGeometry();
    const gemGeo = new THREE.OctahedronGeometry(0.18, 0);

    // Richer, deeper jewel and candy tones (contrasting vividly against pink lotus bowl)
    const charmColors = [
      0x6B1199, // Deep royal amethyst
      0x9F1239, // Deep garnet ruby
      0x0E5E4E, // Deep emerald jade
      0x1D4ED8, // Deep royal sapphire
      0xC026D3, // Deep berry magenta
      0xB45309, // Rich warm amber gold
      0xBE123C, // Deep crimson rose
      0x0F766E, // Deep peacock teal
      0x7E22CE, // Deep velvet violet
      0x4338CA, // Deep midnight indigo
      0x9D174D, // Deep plum wine
      0xD97706  // Rich honey topaz
    ];

    for (let i = 0; i < 180; i++) {
      // Basin ranges from y = 0.74 to y = 1.60
      const y = 0.74 + Math.random() * 0.86;
      const progress = (y - 0.74) / 0.86;
      const radiusAtY = 0.78 + progress * 1.02;
      const radius = Math.random() * (radiusAtY - 0.14);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      let geo;
      const typeChoice = i % 5;
      if (typeChoice === 0) geo = beadGeo;
      else if (typeChoice === 1) geo = cubeGeo;
      else if (typeChoice === 2) geo = starGeo;
      else if (typeChoice === 3) geo = heartGeo;
      else geo = gemGeo;

      const mat = new THREE.MeshPhysicalMaterial({
        color: charmColors[i % charmColors.length],
        roughness: 0.22, // Balanced roughness so lighting reveals deep color rather than white glare
        metalness: 0.16,
        clearcoat: 0.70,
        clearcoatRoughness: 0.08,
        reflectivity: 0.85
      });

      const charm = new THREE.Mesh(geo, mat);
      charm.position.set(x, y, z);
      charm.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      charm.scale.setScalar(0.72 + Math.random() * 0.36);
      charm.userData = { baseY: y };
      bowlCharmsGroup.add(charm);
    }

    // -------------------------------------------------------------
    // LUXURY PRESENTATION PLATE (Initially Hidden Off-Stage: x = 6.0, scale = 0)
    // -------------------------------------------------------------
    const plateGroup = new THREE.Group();
    plateGroup.position.set(6.0, 0, 0.15);
    plateGroup.scale.set(0.001, 0.001, 0.001);
    plateGroup.visible = false;
    scene.add(plateGroup);
    plateGroupRef.current = plateGroup;

    // Contact shadow underneath plate
    const plateContactShadow = new THREE.Mesh(shadowPlaneGeo, shadowMat);
    plateContactShadow.rotation.x = -Math.PI / 2;
    plateContactShadow.position.y = -0.12;
    plateGroup.add(plateContactShadow);

    const plateLight = new THREE.PointLight(0xfff4e6, 1.8, 12);
    plateLight.position.set(0, 4.0, 2.0);
    plateGroup.add(plateLight);

    // Plush Velvet Base Mat
    const velvetMatGeo = new THREE.CylinderGeometry(1.65, 1.72, 0.12, 48);
    const velvetMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2A1538 : 0xDE3C74,
      roughness: 0.85,
      metalness: 0.05
    });
    const velvetBase = new THREE.Mesh(velvetMatGeo, velvetMat);
    velvetBase.position.y = -0.06;
    plateGroup.add(velvetBase);

    // Luxury Italian Carrara White Marble / Porcelain Dish
    const platePoints = [
      new THREE.Vector2(0.0, 0.06),
      new THREE.Vector2(1.25, 0.06),
      new THREE.Vector2(1.44, 0.14),
      new THREE.Vector2(1.55, 0.26),
      new THREE.Vector2(1.58, 0.22),
      new THREE.Vector2(1.54, 0.02),
      new THREE.Vector2(0.0, 0.0)
    ];
    const plateGeo = new THREE.LatheGeometry(platePoints, 48);
    plateGeo.computeVertexNormals();

    const luxuryPlateMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFAFE,
      roughness: 0.10,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98
    });
    const plateMesh = new THREE.Mesh(plateGeo, luxuryPlateMat);
    plateGroup.add(plateMesh);

    // 24K Mirrored Gold Fluted Rim on Plate
    const plateRimGeo = new THREE.TorusGeometry(1.55, 0.05, 16, 48);
    const plateRim = new THREE.Mesh(plateRimGeo, goldMat);
    plateRim.rotation.x = Math.PI / 2;
    plateRim.position.y = 0.25;
    plateGroup.add(plateRim);

    // Container for Charms Poured onto the Luxury Plate
    const plateCharmsGroup = new THREE.Group();
    plateGroup.add(plateCharmsGroup);
    plateCharmsRef.current = plateCharmsGroup;

    // -------------------------------------------------------------
    // REALISTIC ROSE-GOLD SCOOP SHOVEL (Starts directly above centered bowl)
    // -------------------------------------------------------------
    const spoon = createRealisticScoopSpoon();
    spoon.position.set(0, 2.85, -0.15);
    spoon.rotation.set(0.36, -0.2, 0.1);
    scene.add(spoon);
    spoonRef.current = spoon;

    // Mini charms group sitting inside the scoop shovel during scooping
    const spoonLootGroup = new THREE.Group();
    spoon.add(spoonLootGroup);
    charmsInSpoonRef.current = spoonLootGroup;

    // Ambient Stardust Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 80;
    const posArray = new Float32Array(particleCount * 3);
    for (let k = 0; k < particleCount * 3; k += 3) {
      posArray[k] = (Math.random() - 0.5) * 9.5;
      posArray[k + 1] = Math.random() * 5.5;
      posArray[k + 2] = (Math.random() - 0.5) * 8.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0xff66cc : 0xff99bb,
      size: 0.1,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeo, pMat);
    scene.add(particles);

    // Pointer Parallax Handler
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current.targetX = x * 0.4;
      mousePosRef.current.targetY = y * 0.25;
    };
    container.addEventListener('pointermove', handlePointerMove);

    // Easing Functions
    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easeOutBack = (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    // Animation Loop with Viewport Visibility Observer (Freezes idle GPU overhead when offscreen)
    let clock = new THREE.Clock();
    let animId = null;
    let isVisible = true;
    let observer = null;

    const animate = () => {
      // If element is scrolled out of view and not actively scooping, pause the loop to conserve mobile GPU & battery
      if (!isVisible && !scoopAnimStateRef.current.active) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Parallax Damping
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

      // Smooth dynamic stage layout transitions
      if (bowlGroupRef.current) {
        bowlGroupRef.current.position.x += (stageLayoutRef.current.bowlTargetX - bowlGroupRef.current.position.x) * 0.07;
      }

      if (plateGroupRef.current) {
        plateGroupRef.current.position.x += (stageLayoutRef.current.plateTargetX - plateGroupRef.current.position.x) * 0.07;
        const curScale = plateGroupRef.current.scale.x;
        const nextScale = curScale + (stageLayoutRef.current.plateTargetScale - curScale) * 0.07;
        plateGroupRef.current.scale.setScalar(nextScale);
        plateGroupRef.current.visible = nextScale > 0.02;
      }

      // Slow ambient rotations
      bowlMesh.rotation.y = time * 0.06;
      bowlCharmsGroup.rotation.y = time * 0.06;
      particles.rotation.y = time * 0.02;

      const animState = scoopAnimStateRef.current;

      if (!animState.active) {
        // IDLE STATE: Gentle breathing float above the current bowl position
        if (spoonRef.current) {
          const curBowlX = bowlGroupRef.current ? bowlGroupRef.current.position.x : 0;
          const hoverY = 2.85 + Math.sin(time * 2.2) * 0.06;
          spoonRef.current.position.set(
            curBowlX + mousePosRef.current.x * 0.2,
            hoverY,
            -0.15
          );
          spoonRef.current.rotation.set(
            0.36 + mousePosRef.current.y * 0.1,
            -0.2 + Math.cos(time * 1.5) * 0.05 + mousePosRef.current.x * 0.15,
            0.1
          );
        }
      } else {
        // ACTIVE ASMR STEP-BY-STEP ANIMATION SEQUENCE (5.6 seconds total)
        const elapsed = (performance.now() - animState.startTime) / 1000;
        const spoon = spoonRef.current;
        const pulledItems = animState.pulledItems || [];
        const count = pulledItems.length;

        // STEP 1: Position Rose-Gold Scoop over Center Bowl (0.0s – 0.6s)
        if (elapsed < 0.6) {
          const p = easeInOutQuad(elapsed / 0.6);
          const curBowlX = bowlGroupRef.current ? bowlGroupRef.current.position.x : 0;
          spoon.position.set(curBowlX, THREE.MathUtils.lerp(2.85, 3.15, p), -0.15);
          spoon.rotation.set(THREE.MathUtils.lerp(0.36, 0.22, p), -0.2, 0.1);
        }
        // STEP 2: Deep Dig & Scoop Charms from Bowl (0.6s – 1.8s)
        else if (elapsed < 1.8) {
          const t = (elapsed - 0.6) / 1.2;

          // Curved 3D scooping arc down into the bowl
          const curBowlX = bowlGroupRef.current ? bowlGroupRef.current.position.x : 0;
          const dipY = 3.15 - 2.45 * Math.sin(t * Math.PI * 0.85);
          const dipZ = THREE.MathUtils.lerp(-0.15, 0.45, t);
          const rotX = THREE.MathUtils.lerp(0.22, 0.82, Math.sin(t * Math.PI));

          spoon.position.set(curBowlX, dipY, dipZ);
          spoon.rotation.set(rotX, -0.2 + Math.sin(t * Math.PI) * 0.12, 0.1);

          // Charms inside spoon scale in according to count
          if (charmsInSpoonRef.current && t > 0.35) {
            const scaleP = Math.min((t - 0.35) / 0.65, 1);
            charmsInSpoonRef.current.children.forEach(c => c.scale.setScalar(scaleP));
          }

          // Ripples on bowl charms
          if (bowlCharmsRef.current) {
            bowlCharmsRef.current.children.forEach((c, idx) => {
              if (c.position.y > 0.5) {
                c.position.y = c.userData.baseY + Math.sin(time * 16 + idx) * 0.02;
              }
            });
          }
        }
        // STEP 3: Empty Plate Arrives! Bowl slides left, Scoop glides across to plate (1.8s – 3.2s)
        else if (elapsed < 3.2) {
          const t = (elapsed - 1.8) / 1.4;

          // Trigger smooth stage transition: Bowl glides left, Luxury Plate slides in from right
          stageLayoutRef.current.bowlTargetX = -1.65;
          stageLayoutRef.current.plateTargetX = 1.65;
          stageLayoutRef.current.plateTargetScale = 1.0;

          // Tilt back to cradle charms
          const rotX = THREE.MathUtils.lerp(0.82, 0.15, easeOutCubic(t));
          // Lift high
          const liftY = THREE.MathUtils.lerp(0.85, 3.45, easeOutBack(Math.min(t * 1.5, 1)));
          // Glide from bowl (starting from 0) to luxury plate (1.65)
          const travelX = THREE.MathUtils.lerp(0, 1.65, easeInOutQuad(t));
          const travelZ = THREE.MathUtils.lerp(0.45, 0.15, t);

          spoon.position.set(travelX, liftY, travelZ);
          spoon.rotation.set(rotX, -0.1, 0.1);

          if (charmsInSpoonRef.current) {
            charmsInSpoonRef.current.children.forEach(c => c.scale.setScalar(1));
          }
        }
        // STEP 4: Cascade Pour onto the Luxury Empty Plate (3.2s – 4.4s)
        else if (elapsed < 4.4) {
          const t = (elapsed - 3.2) / 1.2;

          // Shovel tilts forward to dump charms
          const pourRotX = THREE.MathUtils.lerp(0.15, 1.35, easeInOutQuad(Math.min(t * 1.3, 1)));
          const pourY = THREE.MathUtils.lerp(3.45, 2.95, t);

          spoon.position.set(1.65, pourY, 0.15);
          spoon.rotation.set(pourRotX, -0.05, -0.15);

          // Charms tumble out of shovel and land on the luxury plate
          if (charmsInSpoonRef.current) {
            const spoonChildren = charmsInSpoonRef.current.children;
            spoonChildren.forEach((c, idx) => {
              const delay = (idx / count) * 0.35;
              if (t > delay) {
                const dropT = Math.min((t - delay) / 0.5, 1);
                c.scale.setScalar(Math.max(1 - dropT * 1.2, 0));
              }
            });
          }

          // Progressively reveal charms landing on the plate with ASMR bounce
          if (plateCharmsRef.current) {
            const plateChildren = plateCharmsRef.current.children;
            plateChildren.forEach((c, idx) => {
              const delay = 0.15 + (idx / count) * 0.45;
              if (t > delay) {
                const landT = Math.min((t - delay) / 0.35, 1);
                // Land with subtle bounce
                const bounce = Math.sin(landT * Math.PI) * 0.15;
                c.position.y = c.userData.targetY + bounce * (1 - landT);
                c.scale.setScalar(THREE.MathUtils.lerp(0, 1, landT));
              }
            });
          }
        }
        // STEP 5: Camera Glides to Focus on Won Charms (4.4s – 5.4s)
        else if (elapsed < 5.4) {
          const t = (elapsed - 4.4) / 1.0;

          // Scoop floats back to resting position above the bowl
          const returnP = easeInOutQuad(t);
          spoon.position.set(
            THREE.MathUtils.lerp(1.65, -1.65, returnP),
            THREE.MathUtils.lerp(2.95, 2.85, returnP),
            THREE.MathUtils.lerp(0.15, -0.15, returnP)
          );
          spoon.rotation.set(
            THREE.MathUtils.lerp(1.35, 0.36, returnP),
            -0.2,
            0.1
          );

          // Ensure all plate charms are settled
          if (plateCharmsRef.current) {
            plateCharmsRef.current.children.forEach(c => {
              c.position.y = c.userData.targetY;
              c.scale.setScalar(1);
            });
          }
        }
        // STEP 6: Complete & Reveal Won Treasures (5.4s+)
        else {
          animState.active = false;
          spoon.position.set(-1.65, 2.85, -0.15);
          spoon.rotation.set(0.36, -0.2, 0.1);

          // Clear spoon loot
          if (charmsInSpoonRef.current) {
            charmsInSpoonRef.current.children.forEach(c => c.scale.setScalar(0));
          }

          setIsScooping(false);

          // Confetti Celebration
          confetti({
            particleCount: 95,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FFFFFF']
          });

          // Show Haul Modal
          setScoopResult({
            tier: animState.tier,
            items: pulledItems,
            timestamp: new Date().toLocaleTimeString()
          });
          setShowModal(true);
        }
      }

      renderer.render(scene, camera);
    };

    // Viewport IntersectionObserver: pauses WebGL rendering when scrolled away
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (!wasVisible && isVisible && !animId) {
            clock.start();
            animate();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      updateCameraFraming(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pmremGenerator.dispose();
      roomEnv.dispose();
      envTexture.dispose();
      disposeThreeScene(scene, renderer);
    };
  }, [isDark]);

  // Reset Stage back to centered bowl and hide vanity plate
  const resetStageToCenter = useCallback(() => {
    stageLayoutRef.current.bowlTargetX = 0;
    stageLayoutRef.current.plateTargetX = 6.0;
    stageLayoutRef.current.plateTargetScale = 0.001;
    if (plateCharmsRef.current) {
      while (plateCharmsRef.current.children.length > 0) {
        const obj = plateCharmsRef.current.children[0];
        plateCharmsRef.current.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      }
    }
    if (charmsInSpoonRef.current) {
      while (charmsInSpoonRef.current.children.length > 0) {
        const obj = charmsInSpoonRef.current.children[0];
        charmsInSpoonRef.current.remove(obj);
      }
    }
    setScoopResult(null);
  }, []);

  // TRIGGER STEP-BY-STEP ASMR SCOOP ANIMATION
  const handlePerformScoop = useCallback(() => {
    if (isScooping || !spoonRef.current) return;

    if (dipsRemaining <= 0) {
      soundFX.playPop(350);
      setShowLimitModal(true);
      return;
    }

    // Decrement remaining lucky dips
    updateDipsRemaining(dipsRemaining - 1);

    // Ensure stage starts fresh from centered bowl
    if (stageLayoutRef.current.bowlTargetX !== 0) {
      stageLayoutRef.current.bowlTargetX = 0;
      stageLayoutRef.current.plateTargetX = 6.0;
      stageLayoutRef.current.plateTargetScale = 0.001;
      if (bowlGroupRef.current) bowlGroupRef.current.position.x = 0;
      if (plateGroupRef.current) {
        plateGroupRef.current.position.x = 6.0;
        plateGroupRef.current.scale.set(0.001, 0.001, 0.001);
        plateGroupRef.current.visible = false;
      }
      if (spoonRef.current) spoonRef.current.position.set(0, 2.85, -0.15);
    }

    setIsScooping(true);
    soundFX.playPop(520);

    // 1. Calculate EXACT random charms count strictly conforming to tier description:
    // Mini: 7–8 charms | Midi: 12–15 charms | Big: 20–24 charms
    const itemCount = getTierCharmsCount(selectedTier.id);

    // 2. Roll the exact pulled items from pool
    const pulledItems = [];
    for (let m = 0; m < itemCount; m++) {
      const randItem = CHARM_LOOT_POOL[Math.floor(Math.random() * CHARM_LOOT_POOL.length)];
      pulledItems.push({
        ...randItem,
        id: `${randItem.name}-${m}-${Date.now()}`
      });
    }

    // 3. Clear previous charms on the plate
    if (plateCharmsRef.current) {
      while (plateCharmsRef.current.children.length > 0) {
        const obj = plateCharmsRef.current.children[0];
        plateCharmsRef.current.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
      }
    }

    // 4. Clear and recreate matching charms inside the spoon trough
    if (charmsInSpoonRef.current) {
      while (charmsInSpoonRef.current.children.length > 0) {
        const obj = charmsInSpoonRef.current.children[0];
        charmsInSpoonRef.current.remove(obj);
      }

      const beadGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      const starGeo = createStarGeometry();
      const heartGeo = createHeartGeometry();
      const gemGeo = new THREE.OctahedronGeometry(0.18, 0);

      pulledItems.forEach((item, idx) => {
        let geo;
        const typeChoice = idx % 5;
        if (typeChoice === 0) geo = heartGeo;
        else if (typeChoice === 1) geo = beadGeo;
        else if (typeChoice === 2) geo = starGeo;
        else if (typeChoice === 3) geo = gemGeo;
        else geo = cubeGeo;

        const hexCol = item.color ? parseInt(item.color.replace('#', '0x')) : 0xFF6B97;
        const mat = new THREE.MeshPhysicalMaterial({
          color: hexCol,
          roughness: 0.12,
          metalness: 0.25,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04
        });

        // Charm in spoon
        const spoonMesh = new THREE.Mesh(geo, mat);
        spoonMesh.position.set(
          (Math.random() - 0.5) * 0.55,
          -0.05 + Math.random() * 0.22,
          -0.3 + Math.random() * 0.75
        );
        spoonMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        spoonMesh.scale.set(0, 0, 0);
        charmsInSpoonRef.current.add(spoonMesh);

        // Matching charm on luxury plate (initially hidden, revealed upon pour)
        if (plateCharmsRef.current) {
          const plateMesh = new THREE.Mesh(geo, mat);
          // Scatter across the luxury plate surface (radius < 1.1)
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 1.05;
          const targetX = Math.cos(angle) * dist;
          const targetZ = Math.sin(angle) * dist;
          const targetY = 0.14 + (idx * 0.012) % 0.12;

          plateMesh.position.set(targetX, targetY, targetZ);
          plateMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          plateMesh.scale.set(0, 0, 0);
          plateMesh.userData = { targetY };
          plateCharmsRef.current.add(plateMesh);
        }
      });
    }

    // 5. Synced ASMR Sound Effects
    if (soundEnabled) {
      setTimeout(() => soundFX.playScoopSound(), 700); // Dig into bowl
      setTimeout(() => {
        soundFX.playPop(980);
        soundFX.playPop(1250);
      }, 1900); // Lift heavy haul
      setTimeout(() => {
        // Rapid cascade bead clatter on plate
        [800, 1100, 1400, 950, 1300, 1550].forEach((f, i) => {
          setTimeout(() => soundFX.playPop(f), i * 90);
        });
      }, 3400); // Pour onto luxury plate
      setTimeout(() => soundFX.playSuccess(), 4600); // Plate inspection fanfare
      setTimeout(() => soundFX.playCashRegister(), 5400); // Haul reveal cha-ching!
    }

    scoopAnimStateRef.current = {
      active: true,
      startTime: performance.now(),
      tier: selectedTier,
      pulledItems
    };
  }, [isScooping, selectedTier, soundEnabled, dipsRemaining]);

  const handleClaimLoot = () => {
    if (!scoopResult) return;
    soundFX.playPop(620);
    const customItem = {
      id: `custom-scoop-${Date.now()}`,
      name: `${scoopResult.tier.name} (${scoopResult.items.length} Won Items)`,
      price: scoopResult.tier.priceINR,
      priceINR: scoopResult.tier.priceINR,
      image: '/images/scoop-bowl.webp',
      category: 'Mystery Scoops',
      scoopedItems: scoopResult.items,
      quantity: 1,
      isScoopTier: true
    };
    onAddToCart(customItem);
    setShowModal(false);
    // Reset lucky dips back to 3 so customer can order another scoop if desired!
    updateDipsRemaining(MAX_LUCKY_DIPS);
  };

  const handleAddTierToBag = (tier, e) => {
    if (e) e.stopPropagation();
    setSelectedTier(tier);
    soundFX.playPop(650);
    soundFX.playSuccess();

    const tierId = tier.id.startsWith('scoop-')
      ? tier.id
      : `scoop-${tier.id.replace('-scoop', '')}`;

    const cartPayload = {
      id: tierId,
      name: tier.name,
      price: tier.priceINR,
      priceINR: tier.priceINR,
      image: tier.id.includes('big') ? '/images/deluxe-giftbox.webp' : '/images/scoop-bowl.webp',
      category: 'Mystery Scoops',
      qty: 1,
      isScoopTier: true,
      badge: tier.badge,
      description: tier.subtitle || `${tier.itemsCount}. Includes extra free surprise gifts and free shipping across India.`,
      scoops: tier.scoops
    };

    onAddToCart(cartPayload);
    setAddedTierId(tier.id);
    setTimeout(() => {
      setAddedTierId(null);
    }, 1800);
  };

  // Group won items by rarity for stylish stats
  const rarityCounts = scoopResult?.items ? {
    legendary: scoopResult.items.filter(i => i.rarity === 'Legendary').length,
    epic: scoopResult.items.filter(i => i.rarity === 'Epic').length,
    rare: scoopResult.items.filter(i => i.rarity === 'Rare').length,
    common: scoopResult.items.filter(i => i.rarity === 'Common').length,
  } : null;

  return (
    <section id="scoop-machine" className={`${isHero ? 'pt-2 pb-8 sm:pt-4 sm:pb-12' : 'my-12 sm:my-16'} max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8`}>
      {/* Flagship Hero Header */}
      <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:from-pink-950/80 dark:via-purple-950/70 dark:to-pink-950/80 border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 font-extrabold text-[11px] sm:text-xs tracking-wide uppercase mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E60067] animate-ping shrink-0" />
          <span>India's 1st 3D Interactive ASMR Mystery Scoop Studio • Cash on Delivery Available</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-display font-black tracking-tight text-[#231733] dark:text-white leading-[1.12]">
          Collect <span className="shimmer-text">Happiness</span> In Every Single Scoop.
        </h1>

        {/* Live Trust Metrics Bar */}
        <div className="mt-4 flex items-center justify-center gap-2.5 sm:gap-6 text-[11px] sm:text-xs font-bold text-[#554664] dark:text-[#D5CBE2] flex-wrap">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span><strong>15,000+</strong> Lucky Charms Scooped</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span>🚚</span>
            <span><strong>100% Free</strong> Delivery Across India</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 font-black">★ 4.9</span>
            <span>Verified IG Community</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <button
            type="button"
            onClick={() => {
              setShowChartModal(true);
              soundFX.playPop(520);
            }}
            className="text-[#E60067] dark:text-pink-400 underline font-extrabold cursor-pointer hover:text-pink-600 transition"
          >
            Loot Board (54 Items) 📋
          </button>
        </div>
      </div>

      {/* 3D Interactive Stage Container */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-[#1E172E]/95 p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden">
        {/* Tier Selector & Audio Toggle */}
        <div className="mb-5 pb-4 border-b border-pink-100 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Selected: <strong className="text-[#E60067] dark:text-pink-300">{selectedTier.name}</strong> ({selectedTier.itemsCount})
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full max-w-xl p-1.5 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50/50 to-pink-50 dark:from-[#251A38] dark:to-[#1E172E] border border-pink-200/80 dark:border-pink-800/50 shadow-inner">
            {SCOOP_TIERS.map((tier) => {
              const isSelected = selectedTier.id === tier.id;
              const cleanName = tier.name.replace('Scoop Storey - ', '').replace("Bhaskar's Vault ", '').replace("Tanu's Vault ", '');
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier);
                    soundFX.playPop(550);
                    if (!isScooping) {
                      resetStageToCenter();
                    }
                  }}
                  className={`relative py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-center cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF4D8D] to-[#D8005A] text-white shadow-md shadow-pink-500/30 scale-[1.02]'
                      : 'text-[#554664] dark:text-[#D5CBE2] hover:text-[#231733] dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-display font-extrabold text-xs sm:text-sm tracking-tight whitespace-nowrap">
                    {cleanName}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-black px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-yellow-200'
                        : 'bg-pink-100 dark:bg-pink-950/60 text-[#E60067] dark:text-pink-300'
                    }`}
                  >
                    ₹{tier.priceINR}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const newState = soundFX.toggleSound();
              setSoundEnabled(newState);
              if (newState) soundFX.playPop(650);
            }}
            className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-neutral-800 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-neutral-700 flex items-center gap-1.5 hover:bg-pink-100 transition cursor-pointer shrink-0"
            title="Toggle Tactile ASMR Sounds"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-pink-600" />
                <span>ASMR Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span>Audio Muted</span>
              </>
            )}
          </button>
        </div>

        {/* 3D WebGL Canvas Stage - Studio Atmosphere */}
        <div className="relative w-full h-[400px] sm:h-[460px] md:h-[520px] rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-pink-200/90 dark:border-pink-900/60 shadow-[0_20px_50px_-15px_rgba(230,0,103,0.18)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl bg-gradient-to-br from-[#FFF5F8] via-[#FFE8F0] to-[#FED7E2] dark:from-[#200B29] dark:via-[#1A0822] dark:to-[#120519]">
          
          {/* Studio Stage Atmospheric Lighting & Vignette */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-400/25 via-pink-300/25 to-amber-200/25 dark:from-pink-800/40 dark:via-purple-900/35 dark:to-amber-900/20 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -top-14 -left-14 w-64 h-64 rounded-full bg-gradient-to-br from-pink-300/30 to-rose-200/20 dark:from-pink-950/50 dark:to-purple-950/40 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 -right-14 w-64 h-64 rounded-full bg-gradient-to-tl from-amber-300/25 to-pink-300/20 dark:from-amber-950/35 dark:to-pink-950/45 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-rose-200/40 via-pink-100/15 to-transparent dark:from-black/70 dark:to-transparent pointer-events-none" />

          {/* Boutique Trust Pills on 3D Stage */}
          <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-pink-200/90 dark:border-pink-900/60 shadow-xs text-[10px] sm:text-xs font-black text-[#E60067] dark:text-pink-300">
            <span className="w-2 h-2 rounded-full bg-[#E60067] animate-ping shrink-0" />
            <span className="truncate">Live ASMR Mystery Studio</span>
          </div>

          <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-pink-200/90 dark:border-pink-900/60 shadow-xs text-[10px] sm:text-xs font-black text-[#554664] dark:text-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span className="truncate">18K Gold & Lotus Crystal ✨</span>
          </div>

          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Prompt if loot is already resting on plate */}
          {scoopResult && !isScooping && (
            <div className="absolute bottom-3 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={resetStageToCenter}
                className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-pink-200 dark:border-neutral-700 text-[#554664] dark:text-pink-300 text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-pink-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                title="Reset Stage to Center Bowl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Bowl</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-105 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#E60067]" />
                <span>Inspect Plate Haul ({scoopResult.items.length} items)</span>
              </button>
            </div>
          )}
        </div>

        {/* Scoop Action Button with Gamified "3 Lucky Dips per Session" Rule */}
        <div className="mt-5 text-center max-w-md mx-auto px-2">
          
          {/* Lucky Dips Token Tracker */}
          <div className="mb-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 dark:bg-pink-950/70 border border-pink-300 dark:border-pink-800 text-[11px] sm:text-xs font-black uppercase tracking-wide shadow-xs">
            <span className="text-[#E60067] dark:text-pink-300">
              {dipsRemaining > 0 ? `🎲 ${dipsRemaining} / 3 Lucky Dips Left` : `🔒 0 / 3 Dips • Haul Locked In`}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((starIdx) => (
                <span
                  key={starIdx}
                  className={`text-xs transition-all ${
                    starIdx <= dipsRemaining ? 'scale-110 drop-shadow-xs' : 'opacity-25 grayscale'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <button
            disabled={isScooping}
            onClick={dipsRemaining > 0 ? handlePerformScoop : () => {
              if (scoopResult) {
                setShowModal(true);
              } else {
                setShowLimitModal(true);
              }
            }}
            className={`w-full py-4 px-6 rounded-2xl font-display font-extrabold text-lg md:text-xl text-white tracking-wide shadow-2xl transition-all flex items-center justify-center gap-3 ${
              dipsRemaining === 0 && scoopResult
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-600 hover:to-pink-700'
                : selectedTier.btnClass
            } ${isScooping ? 'opacity-85 cursor-not-allowed animate-pulse' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isScooping ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Scooping & Pouring In Progress...</span>
              </>
            ) : dipsRemaining === 0 && scoopResult ? (
              <>
                <ShoppingBag className="w-5 h-5 fill-white text-white" />
                <span>LOCK IN THIS HAUL (₹{selectedTier.priceINR})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>TAKE A SCOOP NOW! (₹{selectedTier.priceINR})</span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold flex items-center justify-center gap-1.5">
            {dipsRemaining > 0 ? (
              <span>✨ Max 3 lucky dips per session • Roll your favorites then add to bag!</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                🔒 You've used all 3 Lucky Dips! Add to bag to claim your treasures.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Step 2: Choose Scoop Tier Cards */}
      <div className="mt-8 sm:mt-10">
        <div className="flex items-center justify-between gap-3 mb-4 max-w-5xl mx-auto px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/70 border border-pink-200 dark:border-pink-800 flex items-center justify-center text-sm shadow-xs">
              🍨
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-display font-black text-[#231733] dark:text-white tracking-tight leading-tight">
                Pick Your Mystery Scoop Size
              </h3>
              <p className="text-[11px] sm:text-xs font-semibold text-[#716182] dark:text-[#D5CBE2]">
                Tap card to load in 3D or click "Add to Bag" to order directly
              </p>
            </div>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 border border-pink-200/80 dark:border-pink-900/50 text-[11px] font-bold text-[#E60067] dark:text-pink-300">
            <span>🚚 Free All-India Delivery</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-5xl mx-auto">
          {SCOOP_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            const isJustAdded = addedTierId === tier.id;
            const cleanTitle = tier.name.replace('Scoop Storey - ', '');
            const treasureText = tier.id.includes('mini') ? '7–8 Treasures' : tier.id.includes('midi') ? '12–15 Treasures' : '20+ Treasures';

            return (
              <div
                key={tier.id}
                onClick={() => {
                  setSelectedTier(tier);
                  soundFX.playPop(550);
                  if (!isScooping) {
                    resetStageToCenter();
                  }
                }}
                className={`relative p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E60067] bg-gradient-to-b from-pink-50/90 to-white dark:from-[#2A1D3B] dark:to-[#1B1429] shadow-lg ring-2 ring-pink-400/30 scale-[1.01]'
                    : 'border-pink-200/80 dark:border-pink-900/40 bg-white dark:bg-[#1E172E] hover:border-pink-400 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Badge & Price */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tier.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs">
                          {tier.badge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-black uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active in 3D</span>
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-display font-black text-[#E60067] dark:text-pink-400 leading-none">
                        ₹{tier.priceINR}
                      </span>
                    </div>
                  </div>

                  {/* Title & Micro Chips */}
                  <h4 className="font-display font-black text-sm sm:text-base text-[#231733] dark:text-white leading-tight">
                    {cleanTitle}
                  </h4>

                  <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded-lg bg-pink-100/80 dark:bg-pink-950/60 text-[#E60067] dark:text-pink-300 border border-pink-200/60 dark:border-pink-900/60">
                      🎁 {treasureText}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/60">
                      🍨 {tier.scoops}x {tier.scoops === 1 ? 'Deep Scoop' : 'Deep Scoops'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                      + Free Gifts ✨
                    </span>
                  </div>
                </div>

                {/* Compact 1-Tap Add to Bag */}
                <div className="mt-3.5 pt-2.5 border-t border-pink-100 dark:border-pink-900/40">
                  <button
                    type="button"
                    onClick={(e) => handleAddTierToBag(tier, e)}
                    className={`w-full text-xs font-display font-extrabold py-2.5 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                      isJustAdded
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        : `${tier.btnClass || 'btn-3d-pink'} text-white`
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        <span>Added to Bag! ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                        <span>Add to Bag • ₹{tier.priceINR}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LUXURY HAUL REVEAL MODAL */}
      {showModal && scoopResult && (
        <div 
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1A1326] rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl border-2 border-pink-400 dark:border-pink-600 relative overflow-hidden animate-scaleUp"
          >
            {/* Top Navigation Bar: Back & Close Buttons */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-pink-100 dark:border-pink-900/40">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  soundFX.playPop(520);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-[#E60067] dark:text-pink-300 border border-pink-200 dark:border-pink-900/50 transition cursor-pointer shadow-xs active:scale-95"
                title="Go back to 3D Scoop Studio"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  soundFX.playPop(520);
                }}
                className="p-1.5 rounded-full bg-pink-100/90 hover:bg-pink-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#554664] hover:text-[#E60067] dark:text-neutral-300 transition cursor-pointer shadow-xs active:scale-95"
                aria-label="Close window"
                title="Close window"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Top Badges */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold tracking-wide uppercase shadow-md mb-2">
                <Trophy className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Poured Onto Luxury Plate!</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white">
                {scoopResult.tier.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#554664] dark:text-[#D5CBE2] font-semibold mt-1">
                You scooped <strong className="text-[#E60067] font-extrabold">{scoopResult.items.length} surprise treasures</strong> matching your scoop size!
              </p>

              {/* Rarity breakdown pills */}
              {rarityCounts && (
                <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
                  {rarityCounts.legendary > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[10px] font-black shadow-xs">
                      ✨ {rarityCounts.legendary} Legendary
                    </span>
                  )}
                  {rarityCounts.epic > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black shadow-xs">
                      💜 {rarityCounts.epic} Epic
                    </span>
                  )}
                  {rarityCounts.rare > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-black shadow-xs">
                      💎 {rarityCounts.rare} Rare
                    </span>
                  )}
                  {rarityCounts.common > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold">
                      🌸 {rarityCounts.common} Common
                    </span>
                  )}
                </div>
              )}

              {/* Gamified Lucky Dip Counter Indicator */}
              <div className={`mt-3.5 p-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                dipsRemaining === 0
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                  : 'bg-pink-50 dark:bg-neutral-800/80 border-pink-200 dark:border-neutral-700 text-[#E60067] dark:text-pink-300'
              }`}>
                <div className="flex items-center gap-1.5 text-left">
                  <span className="text-sm">{dipsRemaining === 0 ? '🔒' : '🎲'}</span>
                  <span>
                    {dipsRemaining === 0
                      ? 'Final Lucky Dip Locked In! Add to bag to claim.'
                      : `${dipsRemaining} Lucky Dip${dipsRemaining > 1 ? 's' : ''} Remaining! Re-dip or lock in this haul?`}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3].map((starIdx) => (
                    <span
                      key={starIdx}
                      className={`text-xs ${starIdx <= dipsRemaining ? 'opacity-100 scale-105' : 'opacity-25 grayscale'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Won Items List */}
            <div className="my-5 max-h-60 overflow-y-auto pr-2 space-y-2">
              {scoopResult.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/80 dark:bg-neutral-800/80 border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-semibold text-[#231733] dark:text-neutral-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 shadow-xs border border-white dark:border-neutral-700"
                      style={{ backgroundColor: `${item.color || '#E60067'}30` }}
                    >
                      {item.icon || '✨'}
                    </div>
                    <div className="min-w-0 text-left">
                      <span className="font-bold block truncate">{item.name}</span>
                      <span className="text-[10px] text-pink-600 dark:text-pink-300 font-semibold block truncate">
                        Charm Bead: {item.charm} • {item.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
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

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleClaimLoot}
                className="w-full btn-3d-pink py-3 px-4 rounded-xl font-display font-bold text-white text-sm md:text-base flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add This Exact Haul to Bag (₹{scoopResult.tier.priceINR})</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 rounded-xl bg-pink-100 dark:bg-pink-950/60 hover:bg-pink-200 text-[#E60067] dark:text-pink-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {dipsRemaining > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetStageToCenter();
                      setTimeout(() => handlePerformScoop(), 250);
                    }}
                    className="py-2.5 rounded-xl bg-pink-50 dark:bg-neutral-800 hover:bg-pink-100 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-300 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-pink-200 dark:border-neutral-700 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Dip ({dipsRemaining} Left)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-neutral-700 cursor-not-allowed opacity-60"
                    title="All 3 lucky dips used. Lock in your won treasures by adding to bag!"
                  >
                    <span>🔒 0 Dips Left</span>
                  </button>
                )}

                <a
                  href={`https://api.whatsapp.com/send?phone=918199922653&text=${encodeURIComponent(
                    `Hi Tanu! 🎀 Maine Scoop Storey 3D Scoop se ${scoopResult.items.length} items scoop kiye hain (${scoopResult.tier.name} - ₹${scoopResult.tier.priceINR})! Mera order confirm karna hai.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  soundFX.playPop(520);
                }}
                className="w-full mt-1 py-2 rounded-xl border border-pink-200/90 dark:border-neutral-700 hover:bg-pink-50 dark:hover:bg-neutral-800 text-xs font-bold text-[#716182] hover:text-[#E60067] dark:text-neutral-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Close & Return to Scoop Machine</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCOOP REWARDS CHART MODAL */}
      {showChartModal && (
        <div 
          onClick={() => setShowChartModal(false)}
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1A1326] rounded-3xl max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-pink-400 dark:border-pink-700 relative max-h-[92vh] flex flex-col animate-scaleUp text-[#231733] dark:text-white"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 pb-4 border-b border-pink-100 dark:border-pink-900/40 shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-[#E60067] dark:text-pink-300 text-[11px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                  <span>Scoop Storey • Official Charm Chart</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-[#231733] dark:text-white">
                  54 Mystery Scoop Treasures ✨
                </h3>
                <p className="text-xs sm:text-sm text-[#554664] dark:text-[#D5CBE2] font-medium mt-0.5">
                  Each bead or charm scooped from the bowl corresponds to one of these verified items!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowChartModal(false)}
                className="p-1.5 rounded-xl hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-400 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center justify-between gap-2 py-3 border-b border-pink-100 dark:border-pink-900/40 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-pink-50 dark:bg-neutral-800/80 border border-pink-200/80 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => {
                    setActiveChartTab('items');
                    soundFX.playPop(500);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeChartTab === 'items'
                      ? 'bg-[#E60067] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Items Grid (54)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveChartTab('photos');
                    soundFX.playPop(500);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeChartTab === 'photos'
                      ? 'bg-[#E60067] text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Physical Board Photos 📸</span>
                </button>
              </div>

              {activeChartTab === 'items' && (
                <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All 54' },
                    { id: 'beauty-essentials', label: '💄 Beauty (15)' },
                    { id: 'accessories-fun', label: '💍 Accessories (15)' },
                    { id: 'stationery-diaries', label: '📔 Stationery (13)' },
                    { id: 'lifestyle-more', label: '🧸 Lifestyle (11)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveChartCategory(tab.id);
                        soundFX.playPop(520);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                        activeChartCategory === tab.id
                          ? 'bg-pink-100 dark:bg-pink-900/60 text-[#E60067] dark:text-pink-300 ring-1 ring-[#E60067]'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {activeChartTab === 'photos' ? (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    These are the actual printed boards used by Scoop Storey during Instagram live scoops! Tap on any photo to inspect beads:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setSelectedChartPhoto('/images/scoop-chart-beauty-accessories.webp')}
                      className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/60 shadow-md cursor-pointer hover:border-pink-400 transition"
                    >
                      <img 
                        src="/images/scoop-chart-beauty-accessories.webp" 
                        alt="Beauty Essentials & Accessories Chart" 
                        className="w-full h-80 object-cover object-top group-hover:scale-102 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 text-white">
                        <div>
                          <span className="font-bold text-sm block">Beauty Essentials & Accessories</span>
                          <span className="text-[11px] text-pink-200">Tap to zoom and inspect beads</span>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setSelectedChartPhoto('/images/scoop-chart-stationery-lifestyle.webp')}
                      className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/60 shadow-md cursor-pointer hover:border-pink-400 transition"
                    >
                      <img 
                        src="/images/scoop-chart-stationery-lifestyle.webp" 
                        alt="Stationery & Lifestyle Chart" 
                        className="w-full h-80 object-cover object-top group-hover:scale-102 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 text-white">
                        <div>
                          <span className="font-bold text-sm block">Stationery & Diaries • Lifestyle & More</span>
                          <span className="text-[11px] text-pink-200">Tap to zoom and inspect beads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {MYSTERY_SCOOP_CATEGORIES
                    .filter(cat => activeChartCategory === 'all' || cat.id === activeChartCategory)
                    .map(cat => (
                      <div key={cat.id} className="space-y-3">
                        <div className="flex items-center justify-between pb-1.5 border-b border-pink-100 dark:border-pink-900/40">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cat.icon}</span>
                            <div>
                              <h4 className="font-display font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                                {cat.title}
                              </h4>
                              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                {cat.description}
                              </span>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-[#E60067] dark:text-pink-300 text-xs font-black">
                            {cat.badge}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {cat.items.map(item => (
                            <div
                              key={item.id}
                              className="p-3 rounded-2xl bg-pink-50/50 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-700/80 hover:border-pink-300 dark:hover:border-pink-800 transition flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div 
                                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-xs border border-white dark:border-neutral-700"
                                  style={{ backgroundColor: `${item.color}25` }}
                                >
                                  {item.icon}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-display font-bold text-xs sm:text-sm text-neutral-900 dark:text-white block truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate">
                                    Bead: {item.charm}
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                                  item.rarity === 'Legendary'
                                    ? 'bg-amber-400 text-purple-950'
                                    : item.rarity === 'Epic'
                                    ? 'bg-purple-600 text-white'
                                    : item.rarity === 'Rare'
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                }`}
                              >
                                {item.rarity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[11px] text-neutral-500 font-medium">
                100% Free Express Shipping across India on all Mystery Scoops! 🎀
              </span>
              <button
                type="button"
                onClick={() => setShowChartModal(false)}
                className="px-5 py-2 rounded-xl btn-3d-pink text-white font-display font-bold text-xs shadow-md cursor-pointer"
              >
                Got It! ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN ZOOM FOR BOARD PHOTO */}
      {selectedChartPhoto && (
        <div 
          onClick={() => setSelectedChartPhoto(null)}
          className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setSelectedChartPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedChartPhoto} 
            alt="Physical Board Fullscreen" 
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* 3 LUCKY DIPS LIMIT REACHED MODAL */}
      {showLimitModal && (
        <div 
          onClick={() => setShowLimitModal(false)}
          className="fixed inset-0 z-70 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border-2 border-pink-300 dark:border-pink-800 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950 border-2 border-pink-300 dark:border-pink-700 flex items-center justify-center text-3xl shadow-md">
              🔒
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-extrabold text-[#231733] dark:text-white">
                All 3 Lucky Dips Used!
              </h3>
              <p className="text-xs text-[#554664] dark:text-[#D5CBE2] leading-relaxed">
                You've rolled your <strong>3 allowed lucky dips</strong> for this session! To keep mystery scoops fair and exciting, lock in your won treasures or add them to your bag.
              </p>
            </div>

            {scoopResult ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-800/60 border border-pink-200 dark:border-neutral-700 text-xs">
                <span className="font-extrabold text-[#E60067] dark:text-pink-300 block mb-0.5">
                  ✨ Your Won Haul Waiting on Plate:
                </span>
                <span className="font-bold text-neutral-700 dark:text-neutral-200">
                  {scoopResult.tier.name} • {scoopResult.items.length} Won Charms & Pendants
                </span>
              </div>
            ) : null}

            <div className="space-y-2 pt-1">
              {scoopResult ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowLimitModal(false);
                    handleClaimLoot();
                  }}
                  className="w-full btn-3d-pink py-3 px-4 rounded-xl font-display font-bold text-white text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Lock In This Haul & Add to Bag</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowLimitModal(false);
                    updateDipsRemaining(MAX_LUCKY_DIPS);
                  }}
                  className="w-full btn-3d-pink py-3 px-4 rounded-xl font-display font-bold text-white text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                  <span>Start Fresh (3 Dips)</span>
                </button>
              )}

              {scoopResult && (
                <button
                  type="button"
                  onClick={() => {
                    setShowLimitModal(false);
                    setShowModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-pink-100 dark:bg-neutral-800 text-[#E60067] dark:text-pink-300 font-bold text-xs hover:bg-pink-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Current Won Haul</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="w-full py-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 cursor-pointer"
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
