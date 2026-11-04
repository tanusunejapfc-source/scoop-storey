import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Rotate3d, Palette, ShieldCheck, Heart } from 'lucide-react';
import { soundFX } from '../utils/audio';

const CHARM_MODELS = [
  { id: 'bear', name: 'Signature Kawaii Bear', category: 'Handcrafted Resin', description: 'Hand-cast with eco-friendly Japanese resin and finished with a micro-gloss coat.' },
  { id: 'heart', name: 'Faceted Aurora Heart', category: 'Gemstone Acrylic', description: 'Multi-faceted cut with iridescent internal foil that glints in ambient light.' },
  { id: 'star', name: 'Starlight Dreamer Star', category: 'Puffy Charm', description: 'Classic 5-point puffy star with rounded edges and pastel pigment infusion.' },
  { id: 'pearl', name: 'Sweetwater Moon Pearl', category: 'High-Sheen Mineral', description: 'Coated with pearlescent mica shimmer for a silky, light-catching glow.' }
];

const COLOR_PALETTES = [
  { name: 'Strawberry Glaze', hex: 0xFF6B97, css: 'bg-[#FF6B97]' },
  { name: 'Lavender Mist', hex: 0xB388FF, css: 'bg-[#B388FF]' },
  { name: 'Butter Sunshine', hex: 0xFFD166, css: 'bg-[#FFD166]' },
  { name: 'Mint Sherbet', hex: 0x48CAE4, css: 'bg-[#48CAE4]' },
  { name: 'Golden Vault', hex: 0xFFD700, css: 'bg-[#FFD700]' }
];

export default function CharmInspector3D({ isDark = false }) {
  const containerRef = useRef(null);
  const [selectedCharm, setSelectedCharm] = useState(CHARM_MODELS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]);
  const charmMeshRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(amb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(selectedColor.hex, 3.0, 10);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const createModel = (type, col) => {
      const group = new THREE.Group();
      const mat = new THREE.MeshPhysicalMaterial({
        color: col,
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      });

      if (type === 'bear') {
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), mat);
        group.add(head);

        const snoutMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), snoutMat);
        snout.scale.set(1, 0.8, 1);
        snout.position.set(0, -0.12, 0.65);
        group.add(snout);

        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
        nose.position.set(0, -0.06, 0.95);
        group.add(nose);

        const earGeo = new THREE.SphereGeometry(0.32, 16, 16);
        const earL = new THREE.Mesh(earGeo, mat);
        earL.position.set(-0.6, 0.6, 0.15);
        const earR = new THREE.Mesh(earGeo, mat);
        earR.position.set(0.6, 0.6, 0.15);
        group.add(earL);
        group.add(earR);
      } else if (type === 'heart') {
        const shape = new THREE.Shape();
        shape.moveTo(0.25, 0.25);
        shape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
        shape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
        shape.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 1.0);
        shape.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
        shape.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
        shape.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);

        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.4,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.12,
          bevelThickness: 0.12
        });
        geo.center();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.z = Math.PI;
        group.add(mesh);
      } else if (type === 'star') {
        const shape = new THREE.Shape();
        const pts = 5;
        const step = Math.PI / pts;
        for (let i = 0; i < 2 * pts; i++) {
          const r = i % 2 === 0 ? 1.0 : 0.5;
          const angle = i * step - Math.PI / 2;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.35,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.1,
          bevelThickness: 0.1
        });
        geo.center();
        group.add(new THREE.Mesh(geo, mat));
      } else {
        const pearlMat = new THREE.MeshPhysicalMaterial({
          color: col,
          roughness: 0.1,
          metalness: 0.3,
          sheen: 1.0,
          sheenColor: new THREE.Color(0xffffff)
        });
        const geo = new THREE.SphereGeometry(0.9, 32, 32);
        group.add(new THREE.Mesh(geo, pearlMat));
      }

      return group;
    };

    const currentMesh = createModel(selectedCharm.id, selectedColor.hex);
    scene.add(currentMesh);
    charmMeshRef.current = currentMesh;

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !charmMeshRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      charmMeshRef.current.rotation.y += deltaX * 0.01;
      charmMeshRef.current.rotation.x += deltaY * 0.01;

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDraggingRef.current || !charmMeshRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

      charmMeshRef.current.rotation.y += deltaX * 0.01;
      charmMeshRef.current.rotation.x += deltaY * 0.01;

      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (charmMeshRef.current && !isDraggingRef.current) {
        charmMeshRef.current.rotation.y += 0.008;
      }
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
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedCharm, selectedColor, isDark]);

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-[#1A1326] rounded-3xl p-6 md:p-10 border-2 border-pink-200 dark:border-pink-900/60 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls & Details (Left 6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-[#E60067] dark:text-pink-300 text-xs font-black tracking-wider uppercase mb-2 border border-pink-200 dark:border-pink-800">
                <Rotate3d className="w-3.5 h-3.5" />
                <span>360° Real-time Charm Studio</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#231733] dark:text-white">
                Inspect Every Facet & Curve
              </h2>
              <p className="mt-2 text-sm md:text-base text-[#554664] dark:text-[#E0D7EB] font-medium">
                Rotate with your mouse or finger to view the microscopic shine and craftsmanship that goes into Bhaskar Scoop Storey pieces.
              </p>
            </div>

            {/* Select Model */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#3B2C4C] dark:text-[#E0D7EB] block mb-2">
                Choose Charm Specimen
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {CHARM_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedCharm(m);
                      soundFX.playPop(520);
                    }}
                    className={`p-3 rounded-xl text-left border-2 transition-all ${selectedCharm.id === m.id
                      ? 'border-[#E60067] bg-pink-50/70 dark:bg-[#281F3D] shadow-md ring-2 ring-pink-400/30'
                      : 'border-pink-200/70 dark:border-neutral-800 bg-white dark:bg-[#1E172E] hover:border-pink-400'
                      }`}
                  >
                    <div className="text-xs font-display font-extrabold text-[#231733] dark:text-white">
                      {m.name}
                    </div>
                    <div className="text-[10px] text-[#E60067] dark:text-pink-400 font-bold mt-0.5">
                      {m.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Color Glaze */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#3B2C4C] dark:text-[#E0D7EB] block mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Custom Glaze Pigment: {selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {COLOR_PALETTES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c);
                      soundFX.playPop(620);
                    }}
                    className={`w-9 h-9 rounded-full ${c.css} transition-transform ${selectedColor.name === c.name
                      ? 'scale-125 ring-4 ring-pink-400/60 shadow-lg'
                      : 'hover:scale-110 opacity-85'
                      }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Spec Card */}
            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-[#1E172E] border border-pink-200 dark:border-pink-900/40 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-[#554664] dark:text-[#D5CBE2] font-medium">
                <span className="font-extrabold text-[#231733] dark:text-neutral-100 block mb-0.5">
                  100% Non-Toxic High-Impact Craft Resin
                </span>
                {selectedCharm.description}
              </div>
            </div>
          </div>

          {/* 3D Viewer Container (Right 6 cols) */}
          <div className="lg:col-span-6 relative h-[380px] md:h-[420px] rounded-2xl bg-pink-50/40 dark:bg-[#140D20] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing border-2 border-pink-200 dark:border-pink-900/40 shadow-inner">
            <div ref={containerRef} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-[#231733] dark:text-neutral-200 pointer-events-none flex items-center gap-1.5 border border-pink-200 dark:border-pink-800">
              <span>🖱️ Drag to rotate in 3D space</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
