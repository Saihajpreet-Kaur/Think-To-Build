'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MoneyUniverseBackgroundProps {
  className?: string;
  savingsRate?: number;
}

export default function MoneyUniverseBackground({
  className = '',
  savingsRate = 67,
}: MoneyUniverseBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // ── Three.js Scene Setup ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#090B10', 0.022);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Master universe group
    const universe = new THREE.Group();
    scene.add(universe);

    // ── STUDIO MULTI-LIGHTING SETUP ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight('#101826', 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFFFFF', 3.2);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight('#83B8FF', 3.8);
    blueRimLight.position.set(-10, 8, -2);
    scene.add(blueRimLight);

    const champagneLight = new THREE.PointLight('#D9A46C', 2.8, 25, 1.2);
    champagneLight.position.set(4, -6, 6);
    scene.add(champagneLight);

    const emeraldGlint = new THREE.PointLight('#50E3C2', 2.0, 20, 1.5);
    emeraldGlint.position.set(-6, -4, 4);
    scene.add(emeraldGlint);

    // ── 1. PROCEDURAL TEXTURES (Banknotes & Coin Glyphs) ───────────────────────
    const createCoinTexture = (symbol: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // Radial metallic rim
      const grad = ctx.createRadialGradient(128, 128, 60, 128, 128, 126);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, color);
      grad.addColorStop(0.7, '#18202E');
      grad.addColorStop(0.95, color);
      grad.addColorStop(1, '#090B10');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      // Micro technical border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(128, 128, 114, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(128, 128, 106, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Currency Symbol
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.font = 'bold 110px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 128, 134);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const createBanknoteTexture = (denom: string, primaryColor: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // Deep metallic background with subtle gradient
      const bg = ctx.createLinearGradient(0, 0, 512, 256);
      bg.addColorStop(0, '#0D1420');
      bg.addColorStop(0.5, '#152233');
      bg.addColorStop(1, '#0A0F17');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 256);

      // Holographic foil stripe
      const foil = ctx.createLinearGradient(80, 0, 130, 256);
      foil.addColorStop(0, 'rgba(131, 184, 255, 0.4)');
      foil.addColorStop(0.5, 'rgba(217, 164, 108, 0.5)');
      foil.addColorStop(1, 'rgba(185, 243, 106, 0.4)');
      ctx.fillStyle = foil;
      ctx.fillRect(75, 0, 50, 256);

      // Delicate Guilloche Security Borders
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(12, 12, 488, 232);
      ctx.strokeStyle = 'rgba(201, 208, 218, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, 472, 216);

      // Currency Watermark & Typography
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(denom, 35, 60);

      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = primaryColor;
      ctx.fillText('MARGIN RESERVE NOTE', 150, 60);

      ctx.fillStyle = 'rgba(201, 208, 218, 0.7)';
      ctx.font = '14px monospace';
      ctx.fillText('SYSTEM CODE // LOCAL-FIRST SPECIE', 150, 85);
      ctx.fillText('ENCRYPTED TELEMETRY VERIFIED', 150, 105);

      // Center Geometric Seal
      ctx.beginPath();
      ctx.arc(380, 140, 48, 0, Math.PI * 2);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 42px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('M', 380, 154);

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const symbols = ['₹', '$', '€', 'M', '◆'];
    const coinMaterials = [
      new THREE.MeshStandardMaterial({
        map: createCoinTexture('₹', '#83B8FF'),
        metalness: 0.96,
        roughness: 0.12,
        bumpScale: 0.05,
      }),
      new THREE.MeshStandardMaterial({
        map: createCoinTexture('$', '#D9A46C'),
        metalness: 0.98,
        roughness: 0.1,
      }),
      new THREE.MeshStandardMaterial({
        map: createCoinTexture('M', '#E2E5EA'),
        metalness: 0.95,
        roughness: 0.15,
      }),
      new THREE.MeshStandardMaterial({
        map: createCoinTexture('◆', '#B9F36A'),
        metalness: 0.94,
        roughness: 0.14,
      }),
    ];

    const noteTextures = [
      createBanknoteTexture('₹10,000', '#83B8FF'),
      createBanknoteTexture('₹50,000', '#D9A46C'),
      createBanknoteTexture('₹1,00,000', '#B9F36A'),
      createBanknoteTexture('M 500', '#A78BFA'),
    ];

    // ── 2. 3D FLOATING COINS SYSTEM (SCATTER & MOUSE-REACTIVE) ─────────────────
    const coinsGroup = new THREE.Group();
    universe.add(coinsGroup);

    interface FloatingCoin {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      velocity: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      wobbleOffset: number;
      depth: number;
    }

    const coinCount = 36;
    const coins: FloatingCoin[] = [];
    const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 36);

    for (let i = 0; i < coinCount; i++) {
      const mat = coinMaterials[i % coinMaterials.length];
      const mesh = new THREE.Mesh(coinGeo, mat);

      // Distribute widely across screen and depths
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 28;
      const z = -12 + Math.random() * 16; // from deep background to near camera

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const basePos = mesh.position.clone();
      const velocity = new THREE.Vector3();
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.025,
        (Math.random() - 0.5) * 0.035,
        (Math.random() - 0.5) * 0.02
      );

      coinsGroup.add(mesh);
      coins.push({
        mesh,
        basePos,
        velocity,
        rotSpeed,
        wobbleOffset: Math.random() * Math.PI * 2,
        depth: z,
      });
    }

    // ── 3. 3D FLOATING BANKNOTES / CURRENCY NOTES (FLUTTERING PAPER) ───────────
    const notesGroup = new THREE.Group();
    universe.add(notesGroup);

    interface FloatingNote {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      flutterSpeed: number;
      offset: number;
    }

    const noteCount = 16;
    const notes: FloatingNote[] = [];
    // Slightly curved plane for aerodynamic banknote flutter
    const noteGeo = new THREE.PlaneGeometry(2.4, 1.2, 12, 6);

    for (let i = 0; i < noteCount; i++) {
      const tex = noteTextures[i % noteTextures.length];
      const noteMat = new THREE.MeshStandardMaterial({
        map: tex,
        metalness: 0.65,
        roughness: 0.35,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
      });

      const mesh = new THREE.Mesh(noteGeo, noteMat);
      const x = (Math.random() - 0.5) * 34;
      const y = (Math.random() - 0.5) * 24;
      const z = -10 + Math.random() * 14;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      notesGroup.add(mesh);
      notes.push({
        mesh,
        basePos: mesh.position.clone(),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        flutterSpeed: 1.2 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2,
      });
    }

    // ── 4. GLOWING MONEY STREAM SPATIAL TUNNEL (LASER SPLINES) ────────────────
    const streamCurves: THREE.CatmullRomCurve3[] = [];
    const streamMeshes: THREE.Mesh[] = [];

    for (let s = 0; s < 3; s++) {
      const points: THREE.Vector3[] = [];
      const segmentCount = 8;
      for (let p = 0; p < segmentCount; p++) {
        const t = p / segmentCount;
        points.push(
          new THREE.Vector3(
            Math.sin(t * Math.PI * 2 + s * 2) * (5 + s * 2),
            (t - 0.5) * 30,
            Math.cos(t * Math.PI * 2 + s * 2) * (4 + s) - 2
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      streamCurves.push(curve);

      const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.035, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: s === 0 ? '#83B8FF' : s === 1 ? '#D9A46C' : '#B9F36A',
        transparent: true,
        opacity: 0.4,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      universe.add(tubeMesh);
      streamMeshes.push(tubeMesh);
    }

    // ── 5. THE 3D PIGGY BANK / WEALTH CAPSULE (CHAPTER 04 TARGET) ──────────────
    // A bespoke Apple-level chrome titanium piggy bank that collects falling coins
    const piggyGroup = new THREE.Group();
    piggyGroup.position.set(4.5, -18, -2); // Starts below, scrolls into view
    universe.add(piggyGroup);

    // Body: Polished Titanium Egg/Sphere
    const piggyBodyGeo = new THREE.SphereGeometry(1.65, 48, 48);
    const piggyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9D0DA'), // Liquid chrome
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.0,
    });
    const piggyBody = new THREE.Mesh(piggyBodyGeo, piggyMat);
    piggyBody.scale.set(1.25, 1.0, 1.05);
    piggyGroup.add(piggyBody);

    // Snout
    const snoutGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.35, 32);
    const snoutMesh = new THREE.Mesh(snoutGeo, piggyMat);
    snoutMesh.rotation.z = -Math.PI / 2;
    snoutMesh.position.set(1.9, 0, 0);
    piggyGroup.add(snoutMesh);

    // Snout Nostrils (Ice blue glow)
    for (let n = -1; n <= 1; n += 2) {
      const nostrilGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
      const nostrilMat = new THREE.MeshBasicMaterial({ color: '#83B8FF' });
      const nostril = new THREE.Mesh(nostrilGeo, nostrilMat);
      nostril.rotation.z = -Math.PI / 2;
      nostril.position.set(2.06, 0, n * 0.16);
      piggyGroup.add(nostril);
    }

    // Cute Titanium Ears
    for (let e = -1; e <= 1; e += 2) {
      const earGeo = new THREE.ConeGeometry(0.35, 0.7, 24);
      const earMesh = new THREE.Mesh(earGeo, piggyMat);
      earMesh.position.set(0.6, 1.35, e * 0.75);
      earMesh.rotation.z = -Math.PI / 6;
      earMesh.rotation.x = (e * Math.PI) / 6;
      piggyGroup.add(earMesh);
    }

    // Sleek Quad Footing Pillars
    for (let fx of [-0.7, 0.7]) {
      for (let fz of [-0.65, 0.65]) {
        const footGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.5, 24);
        const footMesh = new THREE.Mesh(footGeo, piggyMat);
        footMesh.position.set(fx, -1.2, fz);
        piggyGroup.add(footMesh);
      }
    }

    // Top Coin Slot (Recessed metallic slot with golden interior light)
    const slotRimGeo = new THREE.BoxGeometry(0.95, 0.08, 0.22);
    const slotRimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D9A46C'),
      metalness: 0.95,
      roughness: 0.15,
      emissive: new THREE.Color('#D9A46C'),
      emissiveIntensity: 0.4,
    });
    const slotRim = new THREE.Mesh(slotRimGeo, slotRimMat);
    slotRim.position.set(0, 1.62, 0);
    piggyGroup.add(slotRim);

    const slotHoleGeo = new THREE.BoxGeometry(0.75, 0.12, 0.08);
    const slotHoleMat = new THREE.MeshBasicMaterial({ color: '#000000' });
    const slotHole = new THREE.Mesh(slotHoleGeo, slotHoleMat);
    slotHole.position.set(0, 1.64, 0);
    piggyGroup.add(slotHole);

    // Glowing Holographic Belly Gauge (Fills up with savings level)
    const bellyGaugeGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.04, 32);
    const bellyGaugeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#B9F36A'), // Electric Lime fill
      transparent: true,
      opacity: 0.75,
    });
    const bellyGauge = new THREE.Mesh(bellyGaugeGeo, bellyGaugeMat);
    bellyGauge.rotation.x = Math.PI / 2;
    bellyGauge.position.set(0, -0.2, 1.08);
    piggyGroup.add(bellyGauge);

    // Dedicated Falling Coins Arc (Dropping right into Piggy Bank Slot!)
    const fallingCoinsCount = 8;
    const fallingCoins: Array<{ mesh: THREE.Mesh; progress: number; speed: number }> = [];

    for (let f = 0; f < fallingCoinsCount; f++) {
      const fGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24);
      const fMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D9A46C'), // Champagne Gold Coin
        metalness: 0.98,
        roughness: 0.1,
        emissive: new THREE.Color('#D9A46C'),
        emissiveIntensity: 0.5,
      });
      const fMesh = new THREE.Mesh(fGeo, fMat);
      piggyGroup.add(fMesh);
      fallingCoins.push({
        mesh: fMesh,
        progress: f / fallingCoinsCount,
        speed: 0.008 + (f % 3) * 0.003,
      });
    }

    // ── 6. METALLIC COSMIC DUST & PARTICLES ───────────────────────────────────
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 45;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      dustPos[i * 3 + 2] = -15 + Math.random() * 25;

      const c = new THREE.Color(
        i % 3 === 0 ? '#83B8FF' : i % 3 === 1 ? '#D9A46C' : '#E2E5EA'
      );
      dustColors[i * 3] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    universe.add(dustPoints);

    // ── MOUSE REACTIVITY & SCROLL KINEMATICS ──────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let scrollY = 0;
    let targetScrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollY = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── ANIMATION LOOP WITH PHYSICS AND SCATTER ──────────────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Mouse Parallax on Camera
      camera.position.x = mouseX * 2.2;
      camera.position.y = mouseY * 1.5 - scrollY * 12.0; // Camera journeys downwards as user scrolls
      camera.lookAt(0, -scrollY * 12.0, 0);

      // Distant dust slow drift
      dustPoints.rotation.y = elapsed * 0.02;

      // ── Animate Floating Coins with Cursor Scatter & Scroll Fly-Through ──────
      coins.forEach((c) => {
        // Continuous slow tumble
        c.mesh.rotation.x += c.rotSpeed.x;
        c.mesh.rotation.y += c.rotSpeed.y;
        c.mesh.rotation.z += c.rotSpeed.z;

        // Gentle low-gravity wobble
        const floatY = Math.sin(elapsed * 1.2 + c.wobbleOffset) * 0.4;

        // Cursor Proximity Scatter Physics:
        // Calculate 2D screen distance from mouse
        const coinScreenX = (c.mesh.position.x / 18) * 1.5;
        const coinScreenY = (c.mesh.position.y / 14) * 1.5;
        const dx = coinScreenX - mouseX;
        const dy = coinScreenY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.65) {
          const force = (0.65 - dist) * 0.8;
          c.velocity.x += dx * force;
          c.velocity.y += dy * force;
          c.mesh.rotation.x += force * 0.3;
          c.mesh.rotation.y += force * 0.3;
        }

        // Apply friction and spring back to basePos
        c.velocity.multiplyScalar(0.92);
        c.mesh.position.x += c.velocity.x;
        c.mesh.position.y += c.velocity.y;

        // Base scroll motion: Coins fly past the camera as you scroll
        const scrollOffset = scrollY * 18;
        c.mesh.position.y = c.basePos.y + floatY - scrollOffset * 0.6;
        c.mesh.position.x = c.basePos.x + Math.sin(elapsed * 0.5 + c.wobbleOffset) * 0.2;
      });

      // ── Animate Currency Notes (Undulating Wave Paper Flutter) ───────────────
      notes.forEach((n, idx) => {
        n.mesh.rotation.x += n.rotSpeed.x;
        n.mesh.rotation.y += n.rotSpeed.y;
        n.mesh.rotation.z = Math.sin(elapsed * n.flutterSpeed + n.offset) * 0.25;

        // Wave deformation across vertices
        const pos = n.mesh.geometry.attributes.position;
        for (let v = 0; v < pos.count; v++) {
          const vx = pos.getX(v);
          const waveZ = Math.sin(vx * 2.5 + elapsed * 3.0 + n.offset) * 0.12;
          pos.setZ(v, waveZ);
        }
        pos.needsUpdate = true;

        // Dynamic position drifting
        n.mesh.position.y = n.basePos.y + Math.sin(elapsed * 0.8 + n.offset) * 0.5 - scrollY * 14.0;
      });

      // ── Animate Piggy Bank & Falling Coins Arc in Chapter 04 ──────────────────
      // Target position in Chapter 04 (scrollY ~ 0.6 to 1.0)
      const piggyTargetY = -12.5;
      piggyGroup.position.y = piggyTargetY;
      piggyGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.15 - 0.25;
      piggyGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.08;

      // Animate Falling Coins dropping straight into the Piggy Bank slot
      fallingCoins.forEach((fc) => {
        fc.progress = (fc.progress + fc.speed) % 1.0;
        // Arc trajectory: from upper left (x: -1.8, y: 3.5, z: 0.8) curving down into slot (x: 0, y: 1.62, z: 0)
        const p = fc.progress;
        const arcX = (1 - p) * -1.8 + p * 0;
        const arcY = 1.62 + Math.sin((1 - p) * Math.PI * 0.5) * 2.5;
        const arcZ = (1 - p) * 0.9 + p * 0;

        fc.mesh.position.set(arcX, arcY, arcZ);
        fc.mesh.rotation.x = p * Math.PI * 4;
        fc.mesh.rotation.y = p * Math.PI * 2;
        fc.mesh.scale.setScalar(p > 0.92 ? (1 - p) / 0.08 : 1); // Disappears as it enters slot!
      });

      // Pulsing belly gauge fill level
      bellyGauge.scale.set(1 + Math.sin(elapsed * 2) * 0.05, 1 + Math.sin(elapsed * 2) * 0.05, 1);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      coinGeo.dispose();
      coinMaterials.forEach(m => m.dispose());
      noteGeo.dispose();
      piggyBodyGeo.dispose();
      piggyMat.dispose();
      container.innerHTML = '';
    };
  }, [savingsRate]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
    />
  );
}
