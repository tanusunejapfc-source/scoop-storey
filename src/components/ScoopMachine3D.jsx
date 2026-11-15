import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Trophy, Gift, RotateCcw, ShoppingBag, AlertCircle, 
  Check, X, Camera, List, Volume2, VolumeX, Eye
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { disposeThreeScene } from '../utils/threeUtils';
import { SCOOP_TIERS, CHARM_LOOT_POOL, MYSTERY_SCOOP_CATEGORIES } from '../data/storeData';
import WhatsAppIcon from './WhatsAppIcon';

export default function ScoopMachine3D({ onAddToCart, isDark = false }) {
  const containerRef = useRef(null);
  const [selectedTier, setSelectedTier] = useState(SCOOP_TIERS[1]);
  const [isScooping, setIsScooping] = useState(false);
  const [scoopStatusText, setScoopStatusText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scoopResult, setScoopResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addedTierId, setAddedTierId] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [activeChartCategory, setActiveChartCategory] = useState('all');
  const [activeChartTab, setActiveChartTab] = useState('items'); // 'items' | 'photos'
  const [selectedChartPhoto, setSelectedChartPhoto] = useState(null);

  // 3D Scene Refs
  const spoonRef = useRef(null);
  const charmsInSpoonRef = useRef([]);
  const bowlCharmsRef = useRef(null);
  const scoopAnimStateRef = useRef({ active: false, startTime: 0 });
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

  // Ultra-Realistic Rose-Gold Shovel Model
  const createRealisticScoopSpoon = () => {
    const spoon = new THREE.Group();

    // 1. Physical Materials with Studio HDR Reflections
    // Liquid Mirrored Rose-Gold
    const scoopBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFAEC4,
      metalness: 0.68,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      sheen: 0.6,
      sheenColor: 0xFFD6E7,
      side: THREE.DoubleSide
    });

    // 24K Mirrored Yellow Gold (Rims, Ferrule, Rings, Crown)
    const goldTrimMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFCC33,
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95
    });

    // Ergonomic Pearlescent Blush Handle Lacquer
    const handleMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFD8E6,
      metalness: 0.25,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.8
    });

    // Faceted Sparkling Ruby Gem Pommel
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF1493,
      emissive: 0x330015,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.75,
      thickness: 0.9,
      ior: 1.6,
      clearcoat: 1.0
    });

    // 2. Continuous Curved Shovel Trough
    const uSegments = 40;
    const vSegments = 40;
    const positions = [];
    const uvs = [];
    const indices = [];

    const getPoint = (u, v) => {
      // z: -0.75 (back dome) to 0.85 (front shovel lip)
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

    // 24K Gold Turned Ferrule / Collar
    const collarGeo = new THREE.CylinderGeometry(0.13, 0.09, 0.38, 24);
    const collar = new THREE.Mesh(collarGeo, goldTrimMat);
    collar.position.y = 0.19;
    handleGroup.add(collar);

    // Turned Gold Bead
    const ringGeo = new THREE.TorusGeometry(0.12, 0.024, 12, 24);
    const lowerRing = new THREE.Mesh(ringGeo, goldTrimMat);
    lowerRing.rotation.x = Math.PI / 2;
    lowerRing.position.y = 0.38;
    handleGroup.add(lowerRing);

    // Ergonomic Contoured Grip (Hourglass palm swell)
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

    // Upper Gold Trim Ring
    const upperRing = new THREE.Mesh(ringGeo, goldTrimMat);
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = 2.25;
    handleGroup.add(upperRing);

    // 24K Gold Crown Cap
    const crownGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.22, 24);
    const crown = new THREE.Mesh(crownGeo, goldTrimMat);
    crown.position.y = 2.38;
    handleGroup.add(crown);

    // Faceted Ruby Crystal Gem Pommel
    const pommelGeo = new THREE.OctahedronGeometry(0.24, 1);
    pommelGeo.scale(1.0, 1.35, 0.85);
    const pommel = new THREE.Mesh(pommelGeo, gemMat);
    pommel.position.y = 2.68;
    handleGroup.add(pommel);

    handleGroup.position.set(0, 0.05, -0.78);
    handleGroup.rotation.x = -Math.PI / 2 + 0.38; // Elegant candy scoop handle angle
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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // PMREM RoomEnvironment for Photorealistic Metallic & Glass Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    const updateCameraFraming = (w, h) => {
      if (!camera || !renderer) return;
      camera.aspect = w / h;
      const isMobile = w < 640;
      if (isMobile) {
        camera.fov = 48;
        camera.position.set(0, 3.5, 9.6);
        camera.lookAt(0, 1.15, 0);
      } else {
        camera.fov = 36;
        camera.position.set(0, 3.4, 8.4);
        camera.lookAt(0, 1.1, 0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    updateCameraFraming(width, height);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(isDark ? 0xb0a0d0 : 0xffffff, isDark ? 1.4 : 1.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(5, 9, 6);
    scene.add(keyLight);

    const spoonLight = new THREE.PointLight(0xfff0f5, 3.5, 14);
    spoonLight.position.set(0, 5.0, 3.5);
    scene.add(spoonLight);

    const rimLight = new THREE.PointLight(0xff66cc, 2.8, 15);
    rimLight.position.set(-5, 3.5, -4);
    scene.add(rimLight);

    const goldSpot = new THREE.PointLight(0xffe680, 2.2, 12);
    goldSpot.position.set(3, 3, 3);
    scene.add(goldSpot);

    // Tiered Pedestal Base with 24K Gold Trim
    const baseGeo = new THREE.CylinderGeometry(3.3, 3.7, 0.45, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1f1733 : 0xffedf4,
      roughness: 0.35,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.22;
    scene.add(baseMesh);

    const baseRingGeo = new THREE.TorusGeometry(3.32, 0.05, 16, 48);
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xFFCC33, metalness: 0.85, roughness: 0.12 });
    const baseRing = new THREE.Mesh(baseRingGeo, goldMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.02;
    scene.add(baseRing);

    // Sculpted Luxury Crystal Glass Compote Bowl
    const bowlPoints = [
      new THREE.Vector2(1.2, 0.0),
      new THREE.Vector2(1.4, 0.08),
      new THREE.Vector2(1.25, 0.22),
      new THREE.Vector2(1.15, 0.35),
      new THREE.Vector2(1.35, 0.6),
      new THREE.Vector2(1.75, 0.95),
      new THREE.Vector2(2.15, 1.35),
      new THREE.Vector2(2.45, 1.7),
      new THREE.Vector2(2.48, 1.78)
    ];
    const bowlGeo = new THREE.LatheGeometry(bowlPoints, 48);
    bowlGeo.computeVertexNormals();

    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFF0F5,
      roughness: 0.06,
      metalness: 0.05,
      transmission: 0.90,
      ior: 1.52,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      attenuationColor: 0xFFAEC4,
      attenuationDistance: 2.0,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    scene.add(bowl);

    // 24K Gold Rim on Bowl
    const rimGeo = new THREE.TorusGeometry(2.48, 0.08, 16, 64);
    const bowlRim = new THREE.Mesh(rimGeo, goldMat);
    bowlRim.rotation.x = Math.PI / 2;
    bowlRim.position.y = 1.78;
    scene.add(bowlRim);

    // Bowl Bottom Disc
    const discGeo = new THREE.CircleGeometry(1.2, 32);
    const discMesh = new THREE.Mesh(discGeo, bowlMat);
    discMesh.rotation.x = -Math.PI / 2;
    discMesh.position.y = 0.01;
    scene.add(discMesh);

    // Charms filling the bowl
    const bowlCharmsGroup = new THREE.Group();
    scene.add(bowlCharmsGroup);
    bowlCharmsRef.current = bowlCharmsGroup;

    const beadGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const cubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const starGeo = createStarGeometry();
    const heartGeo = createHeartGeometry();
    const gemGeo = new THREE.OctahedronGeometry(0.2, 0);

    const charmColors = [0xFF6B97, 0xB388FF, 0xFFD166, 0x48CAE4, 0xFFAAA6, 0x70D6FF, 0xFFC6FF, 0xFF99C8, 0xFCF6BD, 0xD0F4DE];

    for (let i = 0; i < 180; i++) {
      const y = 0.4 + Math.random() * 1.25;
      const bowlRadiusAtY = 1.15 + ((y - 0.35) / 1.4) * (2.45 - 1.15);
      const radius = Math.random() * (bowlRadiusAtY - 0.24);
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
        roughness: 0.16,
        metalness: 0.15,
        clearcoat: 0.9,
        clearcoatRoughness: 0.05
      });

      const charm = new THREE.Mesh(geo, mat);
      charm.position.set(x, y, z);
      charm.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      charm.scale.setScalar(0.72 + Math.random() * 0.42);
      charm.userData = { baseY: y, baseRotX: charm.rotation.x, baseRotY: charm.rotation.y };
      bowlCharmsGroup.add(charm);
    }

    // Realistic Rose-Gold Scoop Shovel
    const spoon = createRealisticScoopSpoon();
    spoon.position.set(0, 2.85, 0.1);
    spoon.rotation.set(0.36, -0.2, 0.1);
    scene.add(spoon);
    spoonRef.current = spoon;

    // Mini charms inside the scoop shovel
    const spoonLootGroup = new THREE.Group();
    spoon.add(spoonLootGroup);
    charmsInSpoonRef.current = spoonLootGroup;

    const spoonLootOriginalPositions = [];
    for (let j = 0; j < 18; j++) {
      const geo = j % 4 === 0 ? heartGeo : (j % 4 === 1 ? beadGeo : (j % 4 === 2 ? starGeo : gemGeo));
      const mat = new THREE.MeshPhysicalMaterial({
        color: charmColors[j % charmColors.length],
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1.0
      });
      const c = new THREE.Mesh(geo, mat);
      const px = (Math.random() - 0.5) * 0.55;
      const py = -0.05 + Math.random() * 0.22;
      const pz = -0.3 + Math.random() * 0.75;
      c.position.set(px, py, pz);
      c.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      c.scale.set(0, 0, 0); // hidden initially
      spoonLootOriginalPositions.push({ x: px, y: py, z: pz });
      spoonLootGroup.add(c);
    }
    spoonLootGroup.userData = { initialPositions: spoonLootOriginalPositions };

    // Sparkling Ambient Stardust
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 80;
    const posArray = new Float32Array(particleCount * 3);
    for (let k = 0; k < particleCount * 3; k += 3) {
      posArray[k] = (Math.random() - 0.5) * 8.5;
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

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Parallax Damping
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

      // Bowl slow rotation
      bowl.rotation.y = time * 0.08;
      bowlCharmsGroup.rotation.y = time * 0.08;
      particles.rotation.y = time * 0.03;

      const animState = scoopAnimStateRef.current;

      if (!animState.active) {
        // IDLE STATE: Gentle breathing float & subtle tilt tracking
        if (spoonRef.current) {
          const hoverY = 2.85 + Math.sin(time * 2.2) * 0.07;
          spoonRef.current.position.y = hoverY;
          spoonRef.current.position.x = mousePosRef.current.x * 0.3;
          spoonRef.current.rotation.y = -0.2 + Math.cos(time * 1.5) * 0.06 + mousePosRef.current.x * 0.15;
          spoonRef.current.rotation.x = 0.36 + mousePosRef.current.y * 0.1;
        }
      } else {
        // ACTIVE ASMR SCOOP TIMELINE (4.2 seconds of silky smooth motion)
        const elapsed = (performance.now() - animState.startTime) / 1000;
        const spoon = spoonRef.current;

        // PHASE 1: Windup & Aim (0.0s - 0.5s)
        if (elapsed < 0.5) {
          const p = easeInOutQuad(elapsed / 0.5);
          spoon.position.set(0, THREE.MathUtils.lerp(2.85, 3.15, p), THREE.MathUtils.lerp(0.1, -0.1, p));
          spoon.rotation.set(THREE.MathUtils.lerp(0.36, 0.22, p), -0.2, 0.1);
          setScoopStatusText('✨ Positioning rose-gold scoop...');
        }
        // PHASE 2: Deep Digging Swoop into Bowl (0.5s - 1.5s)
        else if (elapsed < 1.5) {
          const t = (elapsed - 0.5) / 1.0;
          setScoopStatusText('🥄 Digging deep into charm mound...');

          // Curved 3D scooping arc
          const dipY = 3.15 - 2.45 * Math.sin(t * Math.PI * 0.85);
          const dipZ = THREE.MathUtils.lerp(-0.1, 0.55, t);
          const rotX = THREE.MathUtils.lerp(0.22, 0.82, Math.sin(t * Math.PI));

          spoon.position.set(0, dipY, dipZ);
          spoon.rotation.x = rotX;
          spoon.rotation.y = -0.2 + Math.sin(t * Math.PI) * 0.12;

          // Charms in spoon scale in
          if (charmsInSpoonRef.current && t > 0.4) {
            const scaleP = Math.min((t - 0.4) / 0.6, 1);
            charmsInSpoonRef.current.children.forEach(c => c.scale.setScalar(scaleP));
          }

          // Ripples on bowl charms near scoop
          if (bowlCharmsRef.current) {
            bowlCharmsRef.current.children.forEach((c, idx) => {
              if (c.position.y > 0.6) {
                c.position.y = c.userData.baseY + Math.sin(time * 16 + idx) * 0.02;
              }
            });
          }
        }
        // PHASE 3: Heave & Tilt-Back (1.5s - 2.4s)
        else if (elapsed < 2.4) {
          const t = (elapsed - 1.5) / 0.9;
          setScoopStatusText('💖 Heaving your overflowing lucky haul...');

          const liftY = THREE.MathUtils.lerp(0.75, 3.58, easeOutBack(t));
          const liftZ = THREE.MathUtils.lerp(0.55, 0.05, t);
          const rotX = THREE.MathUtils.lerp(0.82, 0.16, easeOutCubic(t));
          const rotZ = THREE.MathUtils.lerp(0.1, 0.22, t);

          spoon.position.set(0, liftY, liftZ);
          spoon.rotation.set(rotX, -0.2, rotZ);

          if (charmsInSpoonRef.current) {
            charmsInSpoonRef.current.children.forEach(c => c.scale.setScalar(1));
          }
        }
        // PHASE 4: Showcase & Shimmer (2.4s - 3.2s)
        else if (elapsed < 3.2) {
          const t = (elapsed - 2.4) / 0.8;
          setScoopStatusText('🌟 Inspecting your glittering treasures...');

          const pivotY = -0.2 + Math.sin(t * Math.PI * 2) * 0.24;
          const bobY = 3.58 + Math.sin(t * Math.PI * 2) * 0.05;

          spoon.position.set(0, bobY, 0.05);
          spoon.rotation.set(0.16, pivotY, 0.22);
        }
        // PHASE 5: Cascade Pour (3.2s - 3.9s)
        else if (elapsed < 3.9) {
          const t = (elapsed - 3.2) / 0.7;
          setScoopStatusText('🎁 Pouring into your mystery box...');

          // Spoon tips forward
          const pourRotX = THREE.MathUtils.lerp(0.16, 1.25, easeInOutQuad(t));
          const pourY = THREE.MathUtils.lerp(3.58, 2.95, t);

          spoon.position.set(0, pourY, 0.05);
          spoon.rotation.set(pourRotX, -0.1, 0.05);

          // Charms tumble forward out of shovel
          if (charmsInSpoonRef.current) {
            const initialPos = charmsInSpoonRef.current.userData.initialPositions || [];
            charmsInSpoonRef.current.children.forEach((c, idx) => {
              const base = initialPos[idx] || { x: 0, y: 0, z: 0 };
              c.position.z = base.z + t * 0.9;
              c.position.y = base.y - t * 0.7;
              c.scale.setScalar(Math.max(1 - t * 1.2, 0));
            });
          }
        }
        // PHASE 6: Return to Idle & Trigger Modal (3.9s - 4.2s)
        else if (elapsed < 4.2) {
          const t = (elapsed - 3.9) / 0.3;
          spoon.position.set(0, THREE.MathUtils.lerp(2.95, 2.85, t), THREE.MathUtils.lerp(0.05, 0.1, t));
          spoon.rotation.set(THREE.MathUtils.lerp(1.25, 0.36, t), -0.2, 0.1);
        } else {
          // Animation Complete
          animState.active = false;
          spoon.position.set(0, 2.85, 0.1);
          spoon.rotation.set(0.36, -0.2, 0.1);

          // Reset loot charms in spoon
          if (charmsInSpoonRef.current) {
            const initialPos = charmsInSpoonRef.current.userData.initialPositions || [];
            charmsInSpoonRef.current.children.forEach((c, idx) => {
              const base = initialPos[idx] || { x: 0, y: 0, z: 0 };
              c.position.set(base.x, base.y, base.z);
              c.scale.set(0, 0, 0);
            });
          }

          setScoopStatusText('');
          setIsScooping(false);

          // Confetti explosion
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#FF6699', '#B56BFF', '#FFD043', '#48CAE4', '#FFFFFF']
          });

          // Generate Pulled Loot
          const pulledItems = [];
          const itemCount = selectedTier.productCount || (selectedTier.scoops * 7);
          for (let m = 0; m < itemCount; m++) {
            const randItem = CHARM_LOOT_POOL[Math.floor(Math.random() * CHARM_LOOT_POOL.length)];
            pulledItems.push({
              ...randItem,
              id: `${randItem.name}-${m}-${Date.now()}`
            });
          }

          setScoopResult({
            tier: selectedTier,
            items: pulledItems,
            timestamp: new Date().toLocaleTimeString()
          });
          setShowModal(true);
        }
      }

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

  // TRIGGER 3D SCOOP ANIMATION SEQUENCE
  const handlePerformScoop = useCallback(() => {
    if (isScooping || !spoonRef.current) return;

    setIsScooping(true);
    soundFX.playPop(520);

    // Audio Timings synced to visual phases
    if (soundEnabled) {
      setTimeout(() => soundFX.playScoopSound(), 600); // Digging into charms
      setTimeout(() => {
        soundFX.playPop(980);
        soundFX.playPop(1250);
      }, 1600); // Heavy haul lift
      setTimeout(() => {
        soundFX.playChime([783.99, 987.77, 1174.66, 1567.98]);
      }, 2500); // Showcase glint
      setTimeout(() => soundFX.playSuccess(), 3300); // Cascade pour celebration
    }

    scoopAnimStateRef.current = {
      active: true,
      startTime: performance.now()
    };
  }, [isScooping, soundEnabled]);

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
      image: tier.id.includes('big') ? '/images/deluxe-giftbox.jpg' : '/images/scoop-bowl.jpg',
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
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setShowChartModal(true);
              soundFX.playPop(520);
            }}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#1E172E] border-2 border-pink-300 dark:border-pink-700 text-[#E60067] dark:text-pink-300 font-display font-extrabold text-xs sm:text-sm hover:border-[#E60067] hover:bg-pink-50 dark:hover:bg-pink-950/40 transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>Official Scoop Rewards Board (54 Items) 📋</span>
          </button>
        </div>
      </div>

      {/* 3D Interactive Stage Container */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-[#1E172E]/95 p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden">
        {/* Centered Tier Switcher with Audio Toggle */}
        <div className="mb-5 pb-4 border-b border-pink-100 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="hidden sm:block text-xs font-bold text-neutral-500">
            Interactive 3D ASMR Studio
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full max-w-xl p-1.5 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50/50 to-pink-50 dark:from-[#251A38] dark:to-[#1E172E] border border-pink-200/80 dark:border-pink-800/50 shadow-inner">
            {SCOOP_TIERS.map((tier) => {
              const isSelected = selectedTier.id === tier.id;
              const cleanName = tier.name.replace('Scoop Storey - ', '').replace("Bhaskar's Vault ", '');
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier);
                    soundFX.playPop(550);
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
            className="px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-neutral-800 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-neutral-700 flex items-center gap-1.5 hover:bg-pink-100 transition cursor-pointer"
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

        {/* 3D WebGL Canvas */}
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 dark:from-[#171024] dark:via-[#1A1326] dark:to-[#171024]">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          {/* Live Action Status Overlay */}
          {scoopStatusText && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-pink-300 dark:border-pink-800 shadow-xl text-xs sm:text-sm font-extrabold text-[#E60067] dark:text-pink-300 flex items-center gap-2 animate-bounce pointer-events-none">
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              <span>{scoopStatusText}</span>
            </div>
          )}
        </div>

        {/* Scoop Action Button & ASMR Hint */}
        <div className="mt-5 text-center max-w-md mx-auto px-2">
          <button
            disabled={isScooping}
            onClick={handlePerformScoop}
            className={`w-full py-4 px-6 rounded-2xl font-display font-extrabold text-lg md:text-xl text-white tracking-wide shadow-2xl transition-all flex items-center justify-center gap-3 ${
              selectedTier.btnClass
            } ${isScooping ? 'opacity-80 cursor-not-allowed animate-pulse' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isScooping ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Scooping Live In Real-Time...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>TAKE A SCOOP NOW! (₹{selectedTier.priceINR})</span>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold flex items-center justify-center gap-1.5">
            <span>✨ Drag or hover over the 3D stage to inspect the rose-gold scoop & crystal bowl!</span>
          </p>
        </div>
      </div>

      {/* Step 2: Choose Scoop Tier Cards */}
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
            Tap card to preview in 3D or click "Add to Bag" to order directly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SCOOP_TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            const isJustAdded = addedTierId === tier.id;
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
                  {isSelected && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E60067] text-white text-[10px] font-black uppercase tracking-wide mb-2 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Loaded in 3D Scoop Machine</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-extrabold text-base text-[#231733] dark:text-white">
                      {tier.name}
                    </h4>
                    <div className="text-right">
                      <span className="text-2xl font-display font-black text-[#E60067] dark:text-pink-400">
                        ₹{tier.priceINR}
                      </span>
                      <span className="block text-[10px] text-[#716182] dark:text-neutral-400 font-bold">
                        Free Shipping
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#554664] dark:text-[#D5CBE2] font-semibold mt-2">
                    {tier.itemsCount}
                  </p>

                  {tier.features && (
                    <ul className="mt-3 space-y-1.5 text-xs text-[#554664] dark:text-[#D5CBE2]">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E60067] dark:bg-pink-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#483A54] dark:text-[#D5CBE2] font-bold">
                    <Gift className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 shrink-0" />
                    <span>{tier.scoops}x Satisfying Deep Scoops</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-pink-100 dark:border-pink-900/40">
                  <button
                    type="button"
                    onClick={(e) => handleAddTierToBag(tier, e)}
                    className={`w-full text-xs sm:text-sm font-display font-extrabold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isJustAdded
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg scale-[1.02]'
                        : `${tier.btnClass || 'btn-3d-pink'} text-white`
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                        <span>Added to Bag! ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
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
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="min-w-0 text-left">
                      <span className="font-bold block truncate">{item.name}</span>
                      <span className="text-[10px] text-pink-600 dark:text-pink-300 font-semibold block truncate">
                        {item.category} • {item.charm}
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

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleClaimLoot}
                className="w-full btn-3d-pink py-3 px-4 rounded-xl font-display font-bold text-white text-sm md:text-base flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add Haul to Bag (₹{scoopResult.tier.priceINR})</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=918199922653&text=${encodeURIComponent(
                  `Hi Bhaskar! 🎀 Mujhe mera 3D Scoop result discuss karna hai (${scoopResult?.tier?.name} - ${scoopResult?.items?.length} charms). (Prepaid Store • Min 3 items)`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs md:text-sm flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                <span>Inquire Scoop on WhatsApp (+91 8199922653)</span>
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

            {/* View Mode Switcher: Items Grid vs Physical Board Photos */}
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
                /* Physical Board Photos */
                <div className="space-y-4">
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    These are the actual printed boards used by Scoop Storey during Instagram live scoops! Tap on any photo to inspect beads:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setSelectedChartPhoto('/images/scoop-chart-beauty-accessories.jpg')}
                      className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/60 shadow-md cursor-pointer hover:border-pink-400 transition"
                    >
                      <img 
                        src="/images/scoop-chart-beauty-accessories.jpg" 
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
                      onClick={() => setSelectedChartPhoto('/images/scoop-chart-stationery-lifestyle.jpg')}
                      className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/60 shadow-md cursor-pointer hover:border-pink-400 transition"
                    >
                      <img 
                        src="/images/scoop-chart-stationery-lifestyle.jpg" 
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
                /* Items Grid */
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
    </section>
  );
}
