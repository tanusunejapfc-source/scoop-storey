import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFX } from '../utils/audio';

export default function Hero3DCanvas({ isDark = false }) {
  const containerRef = useRef(null);
  const [clickedCharm, setClickedCharm] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(isDark ? 0x8a70c0 : 0xffffff, isDark ? 1.4 : 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffb3d9, 2.2);
    dirLight1.position.set(5, 8, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa0e7e5, 1.8);
    dirLight2.position.set(-6, -4, 6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffdf80, 2.5, 20);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // GROUP FOR ALL CHARMS
    const charmGroup = new THREE.Group();
    scene.add(charmGroup);

    // PROCEDURAL HELPERS
    // 1. Heart Shape
    const createHeartShape = () => {
      const shape = new THREE.Shape();
      const x = 0, y = 0;
      shape.moveTo(x + 0.25, y + 0.25);
      shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
      shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
      shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
      shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
      shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
      return shape;
    };

    // 2. Star Shape
    const createStarShape = (points = 5, outerRadius = 0.6, innerRadius = 0.3) => {
      const shape = new THREE.Shape();
      const step = Math.PI / points;
      for (let i = 0; i < 2 * points; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const angle = i * step - Math.PI / 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    };

    // 3. Teddy Bear Model
    const createTeddyBearMesh = (color) => {
      const bear = new THREE.Group();
      const bearMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
      });
      // Head
      const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const head = new THREE.Mesh(headGeo, bearMat);
      bear.add(head);

      // Snout
      const snoutGeo = new THREE.SphereGeometry(0.2, 16, 16);
      snoutGeo.scale(1, 0.8, 1);
      const snoutMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const snout = new THREE.Mesh(snoutGeo, snoutMat);
      snout.position.set(0, -0.08, 0.4);
      bear.add(snout);

      // Nose
      const noseGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x332222, roughness: 0.2 });
      const nose = new THREE.Mesh(noseGeo, darkMat);
      nose.position.set(0, -0.04, 0.58);
      bear.add(nose);

      // Ears
      const earGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const earL = new THREE.Mesh(earGeo, bearMat);
      earL.position.set(-0.38, 0.38, 0.1);
      const earR = new THREE.Mesh(earGeo, bearMat);
      earR.position.set(0.38, 0.38, 0.1);
      bear.add(earL);
      bear.add(earR);

      return bear;
    };

    // 4. Rose Gold / Pastel Scoop Spoon
    const createScoopSpoon = () => {
      const spoon = new THREE.Group();
      const spoonMat = new THREE.MeshStandardMaterial({
        color: 0xFFB37C, // Rose gold
        metalness: 0.88,
        roughness: 0.2,
      });

      // Spoon Bowl
      const bowlGeo = new THREE.SphereGeometry(1.3, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
      bowlGeo.scale(1.2, 0.6, 1.4);
      const bowlMesh = new THREE.Mesh(bowlGeo, spoonMat);
      bowlMesh.rotation.x = Math.PI;
      spoon.add(bowlMesh);

      // Spoon Handle
      const handleGeo = new THREE.CylinderGeometry(0.12, 0.18, 4.5, 24);
      const handleMesh = new THREE.Mesh(handleGeo, spoonMat);
      handleMesh.position.set(0, -2.4, -0.9);
      handleMesh.rotation.x = 0.35;
      spoon.add(handleMesh);

      // Cute Heart Charm at end of handle
      const heartShape = createHeartShape();
      const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      heartGeo.center();
      heartGeo.scale(0.5, 0.5, 0.5);
      const heartMat = new THREE.MeshStandardMaterial({ color: 0xFF5D9E, roughness: 0.2, metalness: 0.3 });
      const heartCharm = new THREE.Mesh(heartGeo, heartMat);
      heartCharm.position.set(0, -4.5, -1.7);
      spoon.add(heartCharm);

      return spoon;
    };

    // Add Spoon to Scene
    const spoon = createScoopSpoon();
    spoon.position.set(2.8, -0.6, -1);
    spoon.rotation.set(-0.2, -0.6, 0.4);
    spoon.scale.set(0.85, 0.85, 0.85);
    scene.add(spoon);

    // SPAWN A GALAXY OF INTERACTIVE FLOATING CHARMS
    const charmObjects = [];
    const colors = [
      0xFF6B97, // Strawberry Pink
      0xB388FF, // Dreamy Lilac
      0xFFD166, // Butter Sunshine
      0x48CAE4, // Sky Mint
      0xFFAAA6, // Peach
      0x06D6A0, // Sweet Emerald
      0xFF85A1  // Sugar Pop
    ];

    const heartGeo = new THREE.ExtrudeGeometry(createHeartShape(), {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    heartGeo.center();
    heartGeo.scale(1.2, -1.2, 1.2); // invert for natural heart orientation

    const starGeo = new THREE.ExtrudeGeometry(createStarShape(5, 0.65, 0.32), {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06
    });
    starGeo.center();

    const pearlGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const gemGeo = new THREE.OctahedronGeometry(0.55, 1);

    // Charm types: Bear, Heart, Star, Pearl, Gem
    const charmData = [
      { type: 'bear', color: 0xFFB3C6, pos: [-3.2, 1.8, 0.5], label: 'Baby Gummy Bear' },
      { type: 'heart', color: 0xFF4D8D, pos: [-1.4, 2.5, -0.5], label: 'Faceted Ruby Heart' },
      { type: 'star', color: 0xFFD166, pos: [0.8, 2.8, 0.8], label: 'Starlight Shimmer' },
      { type: 'pearl', color: 0xF7ECE1, pos: [2.5, 2.0, -0.2], label: 'Iridescent Moon Pearl' },
      { type: 'gem', color: 0x9D4EDD, pos: [-3.8, -0.8, -0.8], label: 'Amethyst Sugar Gem' },
      { type: 'heart', color: 0xFF85A1, pos: [-2.0, -1.6, 1.2], label: 'Sweet Peach Heart' },
      { type: 'bear', color: 0x48CAE4, pos: [-0.3, -2.4, 0.4], label: 'Minty Bear Token' },
      { type: 'star', color: 0xFF9E7D, pos: [1.6, -1.8, -0.4], label: 'Sunset Sparkle Star' },
      { type: 'pearl', color: 0xFFE5EC, pos: [-1.0, 0.2, 1.6], label: 'Blush Berry Pearl' },
      { type: 'gem', color: 0x06D6A0, pos: [0.6, 0.6, 0.5], label: 'Emerald Dew Drop' },
    ];

    charmData.forEach((item, index) => {
      let mesh;
      const mat = new THREE.MeshPhysicalMaterial({
        color: item.color,
        roughness: 0.2,
        metalness: 0.15,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      });

      if (item.type === 'bear') {
        mesh = createTeddyBearMesh(item.color);
      } else if (item.type === 'heart') {
        mesh = new THREE.Mesh(heartGeo, mat);
      } else if (item.type === 'star') {
        mesh = new THREE.Mesh(starGeo, mat);
      } else if (item.type === 'pearl') {
        const pearlMat = new THREE.MeshPhysicalMaterial({
          color: item.color,
          roughness: 0.1,
          metalness: 0.4,
          sheen: 1.0,
          sheenColor: new THREE.Color(0xffb6c1)
        });
        mesh = new THREE.Mesh(pearlGeo, pearlMat);
      } else {
        mesh = new THREE.Mesh(gemGeo, mat);
      }

      mesh.position.set(...item.pos);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        id: index,
        label: item.label,
        initialPos: [...item.pos],
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01
        },
        floatOffset: Math.random() * Math.PI * 2,
        baseScale: 1,
        targetScale: 1,
        isSpinning: false,
        spinProgress: 0,
      };

      charmGroup.add(mesh);
      charmObjects.push(mesh);
    });

    // BACKGROUND SPARKLE PARTICLES
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      particleScales[i] = Math.random() * 0.6 + 0.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0xffb3ec : 0xff99c8,
      size: 0.14,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // MOUSE PARALLAX & RAYCASTING
    const mouse = new THREE.Vector2(-100, -100);
    const targetCameraRot = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let hoveredCharm = null;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.x = x;
      mouse.y = y;

      targetCameraRot.x = y * 0.15;
      targetCameraRot.y = x * 0.25;
    };

    const handleClick = (e) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(charmObjects, true);

      if (intersects.length > 0) {
        let topParent = intersects[0].object;
        while (topParent.parent && topParent.parent !== charmGroup) {
          topParent = topParent.parent;
        }

        if (topParent.userData) {
          topParent.userData.isSpinning = true;
          topParent.userData.spinProgress = 0;
          topParent.userData.targetScale = 1.45;
          soundFX.playPop(650 + Math.random() * 300);
          soundFX.playChime();
          setClickedCharm(topParent.userData.label);
          setTimeout(() => setClickedCharm(null), 2500);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

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

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera parallax lerp
      camera.rotation.x += (targetCameraRot.x - camera.rotation.x) * 0.05;
      camera.rotation.y += (targetCameraRot.y - camera.rotation.y) * 0.05;

      // Spoon floating sway
      spoon.position.y = -0.6 + Math.sin(elapsedTime * 1.5) * 0.12;
      spoon.rotation.z = 0.4 + Math.sin(elapsedTime * 1.2) * 0.05;

      // Charms floating & spinning
      charmObjects.forEach((charm) => {
        const u = charm.userData;
        charm.rotation.x += u.rotSpeed.x;
        charm.rotation.y += u.rotSpeed.y;
        charm.rotation.z += u.rotSpeed.z;

        // Gentle vertical wave
        charm.position.y = u.initialPos[1] + Math.sin(elapsedTime * 1.8 + u.floatOffset) * 0.2;
        charm.position.x = u.initialPos[0] + Math.cos(elapsedTime * 1.2 + u.floatOffset) * 0.1;

        // Rapid click 360 spin
        if (u.isSpinning) {
          u.spinProgress += 0.12;
          charm.rotation.y += 0.35;
          if (u.spinProgress >= Math.PI * 2) {
            u.isSpinning = false;
            u.targetScale = 1;
          }
        }

        // Smooth scale interpolation
        charm.scale.lerp(new THREE.Vector3(u.targetScale, u.targetScale, u.targetScale), 0.1);
      });

      // Raycast hover check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(charmObjects, true);

      if (intersects.length > 0) {
        let topParent = intersects[0].object;
        while (topParent.parent && topParent.parent !== charmGroup) {
          topParent = topParent.parent;
        }
        if (hoveredCharm !== topParent) {
          if (hoveredCharm && !hoveredCharm.userData.isSpinning) {
            hoveredCharm.userData.targetScale = 1;
          }
          hoveredCharm = topParent;
          if (hoveredCharm && !hoveredCharm.userData.isSpinning) {
            hoveredCharm.userData.targetScale = 1.25;
            soundFX.playPop(480);
          }
        }
      } else {
        if (hoveredCharm && !hoveredCharm.userData.isSpinning) {
          hoveredCharm.userData.targetScale = 1;
          hoveredCharm = null;
        }
      }

      // Sparkle rotation
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div className="relative w-full h-[550px] lg:h-[650px] overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Hint Badge */}
      <div className="absolute bottom-6 left-6 pointer-events-none z-10">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel shadow-sm text-xs font-semibold tracking-wide text-pink-600 dark:text-pink-300">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span>Interactive 3D Charms • Click or Hover to Play</span>
        </div>
      </div>

      {/* Floating Sparkle Reward Tag on click */}
      {clickedCharm && (
        <div className="absolute top-10 right-10 z-20 animate-bounce pointer-events-none">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-display text-sm px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white/50">
            <span>✨</span>
            <span>Scooped: {clickedCharm}!</span>
            <span className="bg-yellow-400 text-purple-900 text-xs px-2 py-0.5 rounded-full font-bold">+10 Happiness</span>
          </div>
        </div>
      )}
    </div>
  );
}

