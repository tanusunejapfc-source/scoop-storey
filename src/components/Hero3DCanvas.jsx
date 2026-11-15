import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Wand2 } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { disposeThreeScene } from '../utils/threeUtils';

export default function Hero3DCanvas({ isDark = false }) {
  const containerRef = useRef(null);
  const [activeCharm, setActiveCharm] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const shakeTriggerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 11.5);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // LIGHTING SETUP (Studio Quality)
    const ambientLight = new THREE.AmbientLight(isDark ? 0x9370db : 0xffedf3, isDark ? 1.6 : 2.2);
    scene.add(ambientLight);

    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfff0f5, 2.8);
    keyLight.position.set(6, 9, 8);
    scene.add(keyLight);

    // Soft pastel rim light from opposite side
    const rimLight = new THREE.DirectionalLight(0xa5f3fc, 2.0);
    rimLight.position.set(-7, -4, 5);
    scene.add(rimLight);

    // Mouse-following cursor light for realistic dynamic specular reflections
    const cursorLight = new THREE.PointLight(0xffd1dc, 3.0, 18);
    cursorLight.position.set(0, 0, 6);
    scene.add(cursorLight);

    // STAGE / PEDESTAL GROUP
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 1. Mirrored Floating Vanity Platform
    const pedestalGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.35, 64);
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x241738 : 0xffffff,
      metalness: 0.25,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -2.6, 0);
    stageGroup.add(pedestal);

    // 2. 18K Gold Outer Bezel Ring for Platform
    const bezelGeo = new THREE.TorusGeometry(3.8, 0.08, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE5C158,
      metalness: 0.95,
      roughness: 0.15,
    });
    const bezel = new THREE.Mesh(bezelGeo, goldMat);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.set(0, -2.43, 0);
    stageGroup.add(bezel);

    // 3. Inner Frosted Glow Ring
    const innerRingGeo = new THREE.TorusGeometry(2.6, 0.04, 16, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xFF69B4,
      emissive: 0xFF69B4,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.set(0, -2.42, 0);
    stageGroup.add(innerRing);

    // PROCEDURAL CHARM BUILDERS
    const interactiveObjects = [];

    // Helper: Star Shape
    const createStarShape = (points = 5, outer = 0.55, inner = 0.28) => {
      const shape = new THREE.Shape();
      const step = Math.PI / points;
      for (let i = 0; i < 2 * points; i++) {
        const r = (i % 2 === 0) ? outer : inner;
        const a = i * step - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    };

    // Helper: Heart Shape
    const createHeartShape = () => {
      const s = new THREE.Shape();
      s.moveTo(0, 0.25);
      s.bezierCurveTo(0, 0.55, -0.45, 0.85, -0.75, 0.5);
      s.bezierCurveTo(-1.05, 0.15, -0.75, -0.45, 0, -1.05);
      s.bezierCurveTo(0.75, -0.45, 1.05, 0.15, 0.75, 0.5);
      s.bezierCurveTo(0.45, 0.85, 0, 0.55, 0, 0.25);
      return s;
    };

    // 1. CENTERPIECE: Luxury Mystery Vault Box with Gold Ribbon
    const createMysteryVaultBox = () => {
      const group = new THREE.Group();

      // Box Body
      const boxGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6, 4, 4, 4);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFB6C1, // Pastel Kawaii Rose
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      group.add(box);

      // Gold Ribbon Band (Horizontal)
      const ribbonHGeo = new THREE.BoxGeometry(1.64, 0.26, 1.64);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xE5C158,
        metalness: 0.95,
        roughness: 0.15
      });
      const ribbonH = new THREE.Mesh(ribbonHGeo, ribbonMat);
      group.add(ribbonH);

      // Gold Ribbon Band (Vertical)
      const ribbonVGeo = new THREE.BoxGeometry(0.26, 1.64, 1.64);
      const ribbonV = new THREE.Mesh(ribbonVGeo, ribbonMat);
      group.add(ribbonV);

      // 3D Ribbon Bow Topper on Gift Box
      const bowLoopGeo = new THREE.TorusGeometry(0.32, 0.08, 16, 32, Math.PI * 1.6);
      const bowL = new THREE.Mesh(bowLoopGeo, ribbonMat);
      bowL.position.set(-0.25, 0.95, 0);
      bowL.rotation.set(0.3, 0.2, Math.PI * 0.75);
      group.add(bowL);

      const bowR = new THREE.Mesh(bowLoopGeo, ribbonMat);
      bowR.position.set(0.25, 0.95, 0);
      bowR.rotation.set(-0.3, -0.2, -Math.PI * 0.75);
      group.add(bowR);

      // Center Bow Pearl Knot
      const knotGeo = new THREE.SphereGeometry(0.16, 20, 20);
      const knot = new THREE.Mesh(knotGeo, ribbonMat);
      knot.position.set(0, 0.88, 0);
      group.add(knot);

      group.position.set(0, -0.3, 0);
      return group;
    };

    // 2. 18K Gold Bow Pendant
    const createGoldBowPendant = () => {
      const group = new THREE.Group();
      const loopGeo = new THREE.TorusGeometry(0.34, 0.09, 16, 32);
      
      const leftWing = new THREE.Mesh(loopGeo, goldMat);
      leftWing.scale.set(1.2, 0.7, 1);
      leftWing.rotation.set(0, 0.3, 0.45);
      leftWing.position.set(-0.35, 0, 0);
      group.add(leftWing);

      const rightWing = new THREE.Mesh(loopGeo, goldMat);
      rightWing.scale.set(1.2, 0.7, 1);
      rightWing.rotation.set(0, -0.3, -0.45);
      rightWing.position.set(0.35, 0, 0);
      group.add(rightWing);

      // Center Crystal Knot
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9,
        ior: 2.1
      });
      const knotMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), gemMat);
      group.add(knotMesh);

      // Dangling ribbon tails
      const tailGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.45, 12);
      const tailL = new THREE.Mesh(tailGeo, goldMat);
      tailL.position.set(-0.16, -0.32, 0);
      tailL.rotation.z = 0.25;
      group.add(tailL);

      const tailR = new THREE.Mesh(tailGeo, goldMat);
      tailR.position.set(0.16, -0.32, 0);
      tailR.rotation.z = -0.25;
      group.add(tailR);

      return group;
    };

    // 3. Cute Jelly Gummy Bear
    const createGummyBear = (colorHex) => {
      const bear = new THREE.Group();
      const jellyMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.15,
        metalness: 0.05,
        transmission: 0.7,
        ior: 1.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), jellyMat);
      head.position.y = 0.32;
      bear.add(head);

      // Ears
      const earGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const earL = new THREE.Mesh(earGeo, jellyMat);
      earL.position.set(-0.3, 0.65, 0.05);
      bear.add(earL);

      const earR = new THREE.Mesh(earGeo, jellyMat);
      earR.position.set(0.3, 0.65, 0.05);
      bear.add(earR);

      // Snout
      const snout = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), jellyMat);
      snout.scale.set(1, 0.8, 1.2);
      snout.position.set(0, 0.26, 0.32);
      bear.add(snout);

      // Cute Little Nose
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshStandardMaterial({ color: 0x4a1525 }));
      nose.position.set(0, 0.29, 0.47);
      bear.add(nose);

      // Body
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), jellyMat);
      body.scale.set(0.9, 1.1, 0.85);
      body.position.y = -0.32;
      bear.add(body);

      // Paws
      const pawGeo = new THREE.SphereGeometry(0.15, 14, 14);
      const armL = new THREE.Mesh(pawGeo, jellyMat);
      armL.position.set(-0.42, -0.15, 0.18);
      bear.add(armL);

      const armR = new THREE.Mesh(pawGeo, jellyMat);
      armR.position.set(0.42, -0.15, 0.18);
      bear.add(armR);

      return bear;
    };

    // 4. Iridescent Pearl Bead
    const createLuminousPearl = () => {
      const pearlMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFF5F8,
        metalness: 0.35,
        roughness: 0.1,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xFFB6C1),
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
      return new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), pearlMat);
    };

    // 5. Faceted Princess Gem
    const createFacetedGem = (colorHex) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1.0,
        transmission: 0.5,
        ior: 1.7
      });
      return new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 0), mat);
    };

    // 6. Beveled Kawaii Star Charm
    const createStarCharm = (colorHex) => {
      const shape = createStarShape(5, 0.6, 0.3);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.07,
        bevelThickness: 0.07
      });
      geo.center();
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.2,
        metalness: 0.15,
        clearcoat: 0.9,
      });
      return new THREE.Mesh(geo, mat);
    };

    // 7. Sweet Puffy Heart
    const createHeartCharm = (colorHex) => {
      const shape = createHeartShape();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.24,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.09,
        bevelThickness: 0.09
      });
      geo.center();
      geo.scale(0.65, 0.65, 0.65);
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.18,
        metalness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08
      });
      return new THREE.Mesh(geo, mat);
    };

    // 8. Soap Bubble Orbs (ASMR aesthetic)
    const createSoapBubble = (radius) => {
      const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.0,
        transmission: 0.95,
        ior: 1.1,
        sheen: 1.0,
        sheenColor: new THREE.Color(0xff99bb),
        transparent: true,
        opacity: 0.65
      });
      return new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), bubbleMat);
    };

    // CHARM CATALOG DEFINITIONS & POSITIONS
    const charmsConfig = [
      {
        id: 'vault-box',
        name: 'VIP Mystery Blind Box',
        tier: 'Legendary',
        icon: '🎁',
        mesh: createMysteryVaultBox(),
        pos: [0, -0.1, 0],
        scale: 1.05,
        rotSpeed: { x: 0.002, y: 0.008, z: 0.001 },
        floatPhase: 0,
        floatAmp: 0.12
      },
      {
        id: 'gold-bow',
        name: '18K Anti-Tarnish Bow Pendant',
        tier: 'Signature Gold',
        icon: '🎀',
        mesh: createGoldBowPendant(),
        pos: [-2.4, 1.8, 1.2],
        scale: 1.15,
        rotSpeed: { x: 0.006, y: 0.012, z: 0.004 },
        floatPhase: 1.2,
        floatAmp: 0.16
      },
      {
        id: 'pink-bear',
        name: 'Strawberry Gummy Bear',
        tier: 'Kawaii Resin',
        icon: '🧸',
        mesh: createGummyBear(0xFF6B8B),
        pos: [2.3, 1.9, 0.8],
        scale: 1.0,
        rotSpeed: { x: 0.004, y: -0.01, z: 0.003 },
        floatPhase: 2.4,
        floatAmp: 0.18
      },
      {
        id: 'pearl',
        name: 'Iridescent Moon Pearl',
        tier: 'Luxe Shimmer',
        icon: '⚪',
        mesh: createLuminousPearl(),
        pos: [-2.6, -0.8, 1.4],
        scale: 1.0,
        rotSpeed: { x: 0.008, y: 0.008, z: 0.008 },
        floatPhase: 3.1,
        floatAmp: 0.14
      },
      {
        id: 'amethyst-gem',
        name: 'Amethyst Crystal Dew',
        tier: 'Faceted Sparkle',
        icon: '💎',
        mesh: createFacetedGem(0xBA68C8),
        pos: [2.5, -0.7, 1.3],
        scale: 1.05,
        rotSpeed: { x: 0.01, y: 0.012, z: -0.006 },
        floatPhase: 4.2,
        floatAmp: 0.15
      },
      {
        id: 'butter-star',
        name: 'Starlight Butter Star',
        tier: 'Pastel Joy',
        icon: '⭐',
        mesh: createStarCharm(0xFFD166),
        pos: [0, 2.5, -0.6],
        scale: 1.1,
        rotSpeed: { x: 0.005, y: -0.015, z: 0.005 },
        floatPhase: 0.8,
        floatAmp: 0.2
      },
      {
        id: 'blush-heart',
        name: 'Peach Glaze Heart',
        tier: 'Puffy Enamel',
        icon: '💖',
        mesh: createHeartCharm(0xFF4D8D),
        pos: [-1.4, 2.3, 0.6],
        scale: 1.0,
        rotSpeed: { x: -0.008, y: 0.01, z: 0.004 },
        floatPhase: 2.0,
        floatAmp: 0.16
      },
      {
        id: 'mint-bear',
        name: 'Matcha Bear Charm',
        tier: 'Kawaii Resin',
        icon: '🧸',
        mesh: createGummyBear(0x64DFDF),
        pos: [1.3, 2.2, 0.7],
        scale: 0.85,
        rotSpeed: { x: 0.005, y: 0.011, z: -0.004 },
        floatPhase: 3.5,
        floatAmp: 0.17
      },
      {
        id: 'bubble-1',
        name: 'ASMR Dew Bubble',
        tier: 'Atmosphere',
        icon: '🫧',
        mesh: createSoapBubble(0.42),
        pos: [-1.8, 0.5, 2.0],
        scale: 1.0,
        rotSpeed: { x: 0.003, y: 0.003, z: 0.003 },
        floatPhase: 1.7,
        floatAmp: 0.22
      },
      {
        id: 'bubble-2',
        name: 'Rose Quartz Bubble',
        tier: 'Atmosphere',
        icon: '🫧',
        mesh: createSoapBubble(0.32),
        pos: [1.8, 0.4, 2.2],
        scale: 1.0,
        rotSpeed: { x: -0.003, y: 0.004, z: -0.002 },
        floatPhase: 4.8,
        floatAmp: 0.2
      }
    ];

    charmsConfig.forEach((cfg) => {
      const mesh = cfg.mesh;
      mesh.position.set(...cfg.pos);
      mesh.scale.setScalar(cfg.scale);

      mesh.userData = {
        id: cfg.id,
        name: cfg.name,
        tier: cfg.tier,
        icon: cfg.icon,
        basePos: [...cfg.pos],
        baseScale: cfg.scale,
        rotSpeed: cfg.rotSpeed,
        floatPhase: cfg.floatPhase,
        floatAmp: cfg.floatAmp,
        spinAnim: 0,
        targetScale: cfg.scale,
        velocity: new THREE.Vector3(0, 0, 0)
      };

      stageGroup.add(mesh);
      interactiveObjects.push(mesh);
    });

    // MAGICAL SPARKLE PARTICLE CLOUD
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xFF69B4), // Hot pink
      new THREE.Color(0xFFD700), // Gold
      new THREE.Color(0xBA68C8), // Violet
      new THREE.Color(0x48CAE4), // Mint blue
      new THREE.Color(0xFFFFFF)  // Pure starlight
    ];

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a soft floating sphere around the charms
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.8 + 0.2;
      particlePos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const sparkleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(sparkleCloud);

    // MOUSE PARALLAX & RAYCASTING
    const mouse = new THREE.Vector2(-100, -100);
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.x = x;
      mouse.y = y;

      targetRot.y = x * 0.28;
      targetRot.x = -y * 0.18;

      cursorLight.position.x = x * 4.5;
      cursorLight.position.y = y * 3.5;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let rootMesh = intersects[0].object;
        while (rootMesh.parent && rootMesh.parent !== stageGroup) {
          rootMesh = rootMesh.parent;
        }

        if (rootMesh.userData && rootMesh.userData.id) {
          soundFX.playPop(650 + Math.random() * 250);
          soundFX.playChime([659.25, 783.99, 1046.50, 1318.51]);

          rootMesh.userData.spinAnim = Math.PI * 2;
          rootMesh.userData.targetScale = rootMesh.userData.baseScale * 1.35;

          setActiveCharm({
            name: rootMesh.userData.name,
            tier: rootMesh.userData.tier,
            icon: rootMesh.userData.icon
          });

          setTimeout(() => {
            if (rootMesh.userData) {
              rootMesh.userData.targetScale = rootMesh.userData.baseScale;
            }
          }, 350);
        }
      }
    };

    // Shake Trigger from button
    shakeTriggerRef.current = () => {
      soundFX.playPop(550);
      soundFX.playSuccess();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 900);

      interactiveObjects.forEach((obj) => {
        const u = obj.userData;
        if (!u) return;
        u.spinAnim = Math.PI * 4;
        u.velocity.set(
          (Math.random() - 0.5) * 0.6,
          0.4 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.5
        );
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth camera parallax easing
      currentRot.x += (targetRot.x - currentRot.x) * 0.05;
      currentRot.y += (targetRot.y - currentRot.y) * 0.05;
      camera.position.x = currentRot.y * 2.2;
      camera.position.y = 1.2 + currentRot.x * 1.5;
      camera.lookAt(0, 0.2, 0);

      // Rotate Pedestal stage subtly
      pedestal.rotation.y = time * 0.08;
      bezel.rotation.z = time * 0.08;
      innerRing.rotation.z = -time * 0.12;

      // Rotate sparkle cloud
      sparkleCloud.rotation.y = time * 0.04;
      sparkleCloud.rotation.x = Math.sin(time * 0.1) * 0.05;

      // Raycast hover check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      let currentHit = null;

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== stageGroup) {
          root = root.parent;
        }
        currentHit = root;
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'grab';
      }

      // Animate each charm
      interactiveObjects.forEach((obj) => {
        const u = obj.userData;
        if (!u) return;

        // 1. Natural Floating Wave
        const wave = Math.sin(time * 1.6 + u.floatPhase) * u.floatAmp;
        
        // Apply physics velocity if shaken
        if (u.velocity.lengthSq() > 0.0001) {
          obj.position.add(u.velocity);
          u.velocity.y -= 0.025; // gravity pull
          u.velocity.multiplyScalar(0.92); // air resistance
          if (obj.position.y < u.basePos[1] + wave) {
            obj.position.y = u.basePos[1] + wave;
            u.velocity.set(0, 0, 0);
          }
        } else {
          obj.position.y = THREE.MathUtils.lerp(obj.position.y, u.basePos[1] + wave, 0.08);
          obj.position.x = THREE.MathUtils.lerp(obj.position.x, u.basePos[0], 0.08);
          obj.position.z = THREE.MathUtils.lerp(obj.position.z, u.basePos[2], 0.08);
        }

        // 2. Continuous rotation
        obj.rotation.x += u.rotSpeed.x;
        obj.rotation.y += u.rotSpeed.y;
        obj.rotation.z += u.rotSpeed.z;

        // 3. Spin impulse animation on click
        if (u.spinAnim > 0) {
          const deltaSpin = Math.min(u.spinAnim, 0.35);
          obj.rotation.y += deltaSpin;
          u.spinAnim -= deltaSpin;
        }

        // 4. Hover Magnification
        const isHovered = currentHit === obj;
        const targetS = isHovered ? u.baseScale * 1.25 : u.targetScale;
        obj.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.12);
      });

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      disposeThreeScene(scene, renderer);
    };
  }, [isDark]);

  return (
    <div className="relative w-full aspect-square max-w-[540px] mx-auto select-none group">
      
      {/* LUXURY AESTHETIC SHOWCASE CARD FRAME */}
      <div className="relative w-full h-full rounded-[32px] sm:rounded-[40px] overflow-hidden p-2 sm:p-3 bg-gradient-to-br from-white/90 via-pink-50/70 to-purple-50/50 dark:from-[#1A1226]/95 dark:via-[#201533]/80 dark:to-[#160E22]/95 border-2 border-pink-200/90 dark:border-pink-900/60 shadow-[0_24px_60px_-15px_rgba(255,100,160,0.30)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300">
        
        {/* Soft Dreamy Aurora Glow Orbs Behind 3D Scene */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-pink-400/25 to-rose-300/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-tl from-purple-400/25 to-pink-300/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-200/15 dark:bg-purple-900/15 blur-3xl pointer-events-none" />

        {/* TOP STATUS BAR: Boutique Trust Pills */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between gap-2 pointer-events-none">
          {/* Live Studio Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-pink-200/80 dark:border-pink-800/80 shadow-sm text-[11px] sm:text-xs font-extrabold text-[#E60067] dark:text-pink-300">
            <span className="w-2 h-2 rounded-full bg-[#E60067] animate-ping shrink-0" />
            <span className="truncate">3D Mystery Vault • Live ASMR</span>
          </div>

          {/* 18K Anti-Tarnish Gold Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-amber-200 dark:border-amber-800/80 shadow-sm text-[11px] sm:text-xs font-extrabold text-amber-700 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>18K PVD Gold</span>
          </div>
        </div>

        {/* 3D WebGL Canvas */}
        <div ref={containerRef} className="w-full h-full rounded-[26px] sm:rounded-[32px] overflow-hidden cursor-grab active:cursor-grabbing" />

        {/* FLOATING CHARM REWARD TOAST (Shows on Click) */}
        {activeCharm && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
            <div className="bg-gradient-to-r from-[#E60067] via-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-white/60 text-xs sm:text-sm font-display font-extrabold whitespace-nowrap">
              <span>{activeCharm.icon}</span>
              <span>{activeCharm.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                {activeCharm.tier}
              </span>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION & INTERACTION BAR */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between gap-2">
          
          {/* Interactive Hint */}
          <div className="px-3 py-1.5 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-pink-200/80 dark:border-pink-800/80 text-[11px] sm:text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 shadow-sm">
            <span className="text-pink-500">✨</span>
            <span>Tap any charm to spin & inspect</span>
          </div>

          {/* Shake Magic Stage Button */}
          <button
            type="button"
            onClick={() => shakeTriggerRef.current?.()}
            className={`px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer ${isShaking ? 'animate-spin' : ''}`}
            title="Shake charms with gravity!"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Shake Stage</span>
          </button>
        </div>

      </div>

    </div>
  );
}
