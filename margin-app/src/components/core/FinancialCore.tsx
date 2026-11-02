'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { formatCurrency } from '@/lib/calculations';

interface FinancialCoreProps {
  incomePaise?: number;
  expensesPaise?: number;
  marginPaise?: number;
  savingsRate?: number;
  variant?: 'hero' | 'compact' | 'story';
  interactive?: boolean;
  onSelectRing?: (ringName: 'income' | 'expenses' | 'savings' | null) => void;
  className?: string;
}

export default function FinancialCore({
  incomePaise = 14500000,
  expensesPaise = 4780000,
  marginPaise = 9720000,
  savingsRate = 67,
  variant = 'hero',
  interactive = true,
  onSelectRing,
  className = '',
}: FinancialCoreProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeRing, setActiveRing] = useState<'income' | 'expenses' | 'savings' | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 1200;
    let height = container.clientHeight || (variant === 'hero' ? 820 : variant === 'story' ? 560 : 420);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#090B10', 0.032);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, variant === 'hero' ? 10.5 : variant === 'story' ? 12 : 9.5);

    // ── WebGL Renderer with High-Performance Tone Mapping ─────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Main 3D Space Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ── LAYER 01: DISTANT COSMIC ENVIRONMENT & PARTICLES ──────────────────────
    const distantParticleCount = 550;
    const distantGeo = new THREE.BufferGeometry();
    const distantPos = new Float32Array(distantParticleCount * 3);
    const distantColors = new Float32Array(distantParticleCount * 3);

    const cosmicColors = [
      new THREE.Color('#83B8FF'), // Ice Blue
      new THREE.Color('#A78BFA'), // Violet
      new THREE.Color('#C9D0DA'), // Chrome Silver
      new THREE.Color('#D9A46C'), // Champagne Gold
    ];

    for (let i = 0; i < distantParticleCount; i++) {
      distantPos[i * 3] = (Math.random() - 0.5) * 45;
      distantPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      distantPos[i * 3 + 2] = -5 - Math.random() * 25;

      const col = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
      distantColors[i * 3] = col.r;
      distantColors[i * 3 + 1] = col.g;
      distantColors[i * 3 + 2] = col.b;
    }

    distantGeo.setAttribute('position', new THREE.BufferAttribute(distantPos, 3));
    distantGeo.setAttribute('color', new THREE.BufferAttribute(distantColors, 3));

    const distantMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const distantPoints = new THREE.Points(distantGeo, distantMat);
    scene.add(distantPoints);

    // ── LAYER 02A: FLOATING METALLIC 3D COINS / CAPITAL TOKENS ─────────────────
    const coinsGroup = new THREE.Group();
    const coinCount = 10;
    const coins: Array<{
      mesh: THREE.Group;
      orbitRadius: number;
      speed: number;
      angle: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      baseY: number;
      wobbleSpeed: number;
    }> = [];

    const coinBodyGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.05, 32);
    const coinBodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E2E5EA'), // Platinum chrome
      metalness: 0.98,
      roughness: 0.09,
    });

    const coinRimGeo = new THREE.TorusGeometry(0.36, 0.02, 16, 32);
    const coinRimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#83B8FF'),
      emissive: new THREE.Color('#83B8FF'),
      emissiveIntensity: 1.2,
      metalness: 0.95,
      roughness: 0.1,
    });

    for (let i = 0; i < coinCount; i++) {
      const coinPivot = new THREE.Group();
      const body = new THREE.Mesh(coinBodyGeo, coinBodyMat);
      body.rotation.x = Math.PI / 2;
      coinPivot.add(body);

      const rim = new THREE.Mesh(coinRimGeo, coinRimMat);
      coinPivot.add(rim);

      const orbitRadius = 3.6 + (i * 0.45);
      const angle = (i / coinCount) * Math.PI * 2;
      const speed = (0.16 + (i % 3) * 0.08) * (i % 2 === 0 ? 1 : -1);
      const baseY = (Math.random() - 0.5) * 3.5;
      const rotSpeedX = (Math.random() - 0.5) * 1.5;
      const rotSpeedY = (Math.random() - 0.5) * 2.0;
      const rotSpeedZ = (Math.random() - 0.5) * 1.2;
      const wobbleSpeed = 1.0 + Math.random() * 1.5;

      coins.push({
        mesh: coinPivot,
        orbitRadius,
        speed,
        angle,
        rotSpeedX,
        rotSpeedY,
        rotSpeedZ,
        baseY,
        wobbleSpeed,
      });
      coinsGroup.add(coinPivot);
    }
    masterGroup.add(coinsGroup);

    // ── LAYER 02B: MIDGROUND FLOATING METALLIC SATELLITES & DATA NODES ────────
    const satelliteGroup = new THREE.Group();
    const satCount = 6;
    const satellites: Array<{ mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; yOffset: number }> = [];

    const satGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const satMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9D0DA'),
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 1.5,
    });

    for (let i = 0; i < satCount; i++) {
      const mesh = new THREE.Mesh(satGeo, satMat);
      const orbitRadius = 4.8 + (i * 0.55);
      const speed = (0.2 + Math.random() * 0.25) * (i % 2 === 0 ? 1 : -1);
      const angle = (i / satCount) * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 1.8;
      satellites.push({ mesh, orbitRadius, speed, angle, yOffset });
      satelliteGroup.add(mesh);
    }
    masterGroup.add(satelliteGroup);

    // ── LAYER 03: THE PHYSICAL CENTRAL SPHERE (LIQUID CHROME & TITANIUM) ─────
    const sphereGroup = new THREE.Group();
    masterGroup.add(sphereGroup);

    // 1. Core Sphere: Deep Liquid Navy & Reflective Chrome
    const sphereRadius = 1.75;
    const mainSphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const mainSphereMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#101826'),
      metalness: 0.92,
      roughness: 0.12,
      emissive: new THREE.Color('#08111E'),
      emissiveIntensity: 0.2,
    });
    const mainSphere = new THREE.Mesh(mainSphereGeo, mainSphereMat);
    sphereGroup.add(mainSphere);

    // 2. Swept Metallic Chrome Ribs (Apple-style precision curvature)
    const ribGroup = new THREE.Group();
    const ribCount = 3;
    for (let r = 0; r < ribCount; r++) {
      const ribGeo = new THREE.TorusGeometry(sphereRadius + 0.035, 0.045, 16, 120, Math.PI * 1.15);
      const ribMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E2E5EA'), // Platinum chrome
        metalness: 0.98,
        roughness: 0.08,
      });
      const ribMesh = new THREE.Mesh(ribGeo, ribMat);
      ribMesh.rotation.x = Math.PI / 3 + r * (Math.PI / 6);
      ribMesh.rotation.y = r * (Math.PI / 4);
      ribGroup.add(ribMesh);
    }
    sphereGroup.add(ribGroup);

    // 3. Inner Cosmic Luminous Core
    const innerLightCoreGeo = new THREE.SphereGeometry(1.25, 32, 32);
    const innerLightCoreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#83B8FF'),
    });
    const innerLightCore = new THREE.Mesh(innerLightCoreGeo, innerLightCoreMat);
    sphereGroup.add(innerLightCore);

    // 4. Subtle Specular Core Lens Flare Light at Horizon Vertex
    const flarePointGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const flarePointMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFFFFF'),
    });
    const flarePoint = new THREE.Mesh(flarePointGeo, flarePointMat);
    flarePoint.position.set(sphereRadius * 0.72, sphereRadius * 0.65, sphereRadius * 0.25);
    sphereGroup.add(flarePoint);

    // ── LAYER 03B: THREE DISTINCT METALLIC ORBITAL RINGS WITH DEPTH OCCLUSION ──
    const createOrbitalRing = (
      radius: number,
      tube: number,
      primaryColor: string,
      accentColor: string,
      roughness: number,
      metalness: number,
      inclination: [number, number, number],
      beadCount: number,
      ringId: 'income' | 'expenses' | 'savings'
    ) => {
      const ringPivot = new THREE.Group();
      ringPivot.rotation.set(...inclination);

      // Main Physical Metallic Torus
      const torusGeo = new THREE.TorusGeometry(radius, tube, 24, 180);
      const torusMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(primaryColor),
        metalness: metalness,
        roughness: roughness,
        emissive: new THREE.Color(accentColor),
        emissiveIntensity: 0.35,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.userData = { ringName: ringId };
      ringPivot.add(torusMesh);

      // Secondary Concentric Laser Track
      const laserTrackGeo = new THREE.TorusGeometry(radius + 0.12, 0.009, 16, 180);
      const laserTrackMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor),
        transparent: true,
        opacity: 0.45,
      });
      const laserTrackMesh = new THREE.Mesh(laserTrackGeo, laserTrackMat);
      ringPivot.add(laserTrackMesh);

      // Orbiting Data Spheres / Nodes
      const beadsGroup = new THREE.Group();
      const beadGeo = new THREE.SphereGeometry(0.095, 20, 20);
      const beadMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFFFF'),
        emissive: new THREE.Color(accentColor),
        emissiveIntensity: 1.8,
        metalness: 0.9,
        roughness: 0.1,
      });

      const beadAngles: number[] = [];
      for (let i = 0; i < beadCount; i++) {
        const bead = new THREE.Mesh(beadGeo, beadMat);
        const angle = (i / beadCount) * Math.PI * 2;
        beadAngles.push(angle);
        bead.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        beadsGroup.add(bead);
      }
      ringPivot.add(beadsGroup);

      masterGroup.add(ringPivot);

      return { ringPivot, torusMesh, beadsGroup, beadAngles, radius, torusMat };
    };

    // RING 01 — INCOME: Polished liquid silver with electric ice blue light (#83B8FF)
    const ringIncome = createOrbitalRing(
      2.75,
      0.042,
      '#C9D0DA',
      '#83B8FF',
      0.1,
      0.95,
      [Math.PI / 3.2, Math.PI / 5.5, 0],
      5,
      'income'
    );

    // RING 02 — EXPENSES: Dark graphite with champagne gold & copper highlights (#D9A46C)
    const ringExpenses = createOrbitalRing(
      3.55,
      0.046,
      '#2B313B',
      '#D9A46C',
      0.2,
      0.88,
      [-Math.PI / 2.8, Math.PI / 3.8, Math.PI / 6],
      4,
      'expenses'
    );

    // RING 03 — SAVINGS / MARGIN: Brushed titanium with restrained electric lime (#B9F36A)
    const ringSavings = createOrbitalRing(
      4.35,
      0.048,
      '#222B36',
      '#B9F36A',
      0.15,
      0.92,
      [Math.PI / 6, -Math.PI / 2.9, Math.PI / 4],
      7,
      'savings'
    );

    // ── LAYER 04: FOREGROUND CAMERA PARTICLES (DEPTH OF FIELD FEEL) ───────────
    const fgParticleCount = 110;
    const fgGeo = new THREE.BufferGeometry();
    const fgPos = new Float32Array(fgParticleCount * 3);
    const fgColors = new Float32Array(fgParticleCount * 3);

    for (let i = 0; i < fgParticleCount; i++) {
      fgPos[i * 3] = (Math.random() - 0.5) * 18;
      fgPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      fgPos[i * 3 + 2] = 3.5 + Math.random() * 5.5;

      const col = cosmicColors[i % cosmicColors.length];
      fgColors[i * 3] = col.r;
      fgColors[i * 3 + 1] = col.g;
      fgColors[i * 3 + 2] = col.b;
    }

    fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPos, 3));
    fgGeo.setAttribute('color', new THREE.BufferAttribute(fgColors, 3));

    const fgMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const fgPoints = new THREE.Points(fgGeo, fgMat);
    scene.add(fgPoints);

    // ── STUDIO MULTI-LIGHTING SETUP ──────────────────────────────────────────
    const keyLight = new THREE.DirectionalLight('#FFFFFF', 2.8);
    keyLight.position.set(7, 9, 8);
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight('#83B8FF', 3.4);
    blueRimLight.position.set(-8, 6, 4);
    scene.add(blueRimLight);

    const violetFillLight = new THREE.DirectionalLight('#A78BFA', 2.4);
    violetFillLight.position.set(6, -6, -6);
    scene.add(violetFillLight);

    const champagneLight = new THREE.PointLight('#D9A46C', 2.2, 16, 1.4);
    champagneLight.position.set(-4, -4, 5);
    scene.add(champagneLight);

    const ambientLight = new THREE.AmbientLight('#0E1524', 1.8);
    scene.add(ambientLight);

    // ── MOUSE PARALLAX & CONTINUOUS SCROLL INTERPOLATION ───────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let scrollY = 0;
    let targetScrollY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollY = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    if (interactive) {
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Raycaster for Ring Interaction
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects([
        ringIncome.torusMesh,
        ringExpenses.torusMesh,
        ringSavings.torusMesh,
      ]);

      if (intersects.length > 0) {
        const ringName = (intersects[0].object.userData as any).ringName;
        setActiveRing(ringName);
        onSelectRing?.(ringName);
      } else {
        setActiveRing(null);
        onSelectRing?.(null);
      }
    };

    container.addEventListener('click', onClick);

    // ── ANIMATION LOOP WITH REALISTIC MOMENTUM & DRIFT ───────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const incomeSpeed = 0.55 + Math.min(incomePaise / 25000000, 0.8);
    const expenseSpeed = -0.45 - Math.min(expensesPaise / 15000000, 0.7);
    const savingsSpeed = 0.4 + (savingsRate / 100) * 0.6;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera perspective parallax interpolation
      targetX += (mouseX * 1.6 - targetX) * 0.045;
      targetY += (mouseY * 1.1 - targetY) * 0.045;
      scrollY += (targetScrollY - scrollY) * 0.05;

      // Continuous Apple-style scroll-linked cinematic camera flight:
      const scrollAngle = scrollY * Math.PI * 1.6;
      const scrollHeight = Math.sin(scrollY * Math.PI * 2) * 1.6;
      const scrollDolly = Math.sin(scrollY * Math.PI) * 2.8;

      camera.position.x = targetX * 1.2 + Math.sin(scrollAngle) * 3.2;
      camera.position.y = 1.2 + targetY * 0.8 + scrollHeight;
      camera.position.z = (variant === 'hero' ? 10.5 : variant === 'story' ? 12 : 9.5) - scrollDolly;
      camera.lookAt(0, 0, 0);

      masterGroup.rotation.z = Math.sin(scrollY * Math.PI) * 0.12;

      // Central Sphere Slow Majestic Rotation
      sphereGroup.rotation.y = elapsed * 0.06;
      ribGroup.rotation.z = -elapsed * 0.04;

      // Animate Midground Satellites
      satellites.forEach(sat => {
        sat.angle += sat.speed * 0.015;
        sat.mesh.position.set(
          Math.cos(sat.angle) * sat.orbitRadius,
          sat.yOffset + Math.sin(sat.angle * 2) * 0.4,
          Math.sin(sat.angle) * sat.orbitRadius
        );
      });

      // Animate Floating 3D Metallic Coins
      coins.forEach(c => {
        c.angle += c.speed * 0.014;
        c.mesh.position.set(
          Math.cos(c.angle) * c.orbitRadius,
          c.baseY + Math.sin(elapsed * c.wobbleSpeed + c.angle) * 0.5,
          Math.sin(c.angle) * c.orbitRadius
        );
        c.mesh.rotation.x += c.rotSpeedX * 0.015;
        c.mesh.rotation.y += c.rotSpeedY * 0.02;
        c.mesh.rotation.z += c.rotSpeedZ * 0.01;
      });

      // Animate Ring 01: INCOME (Ice Blue)
      ringIncome.ringPivot.rotation.z += 0.0035 * incomeSpeed;
      ringIncome.ringPivot.rotation.x = Math.PI / 3.2 + Math.sin(elapsed * 0.2) * 0.05;
      ringIncome.beadAngles.forEach((angle, idx) => {
        const newAngle = angle + elapsed * 0.38 * incomeSpeed;
        const bead = ringIncome.beadsGroup.children[idx];
        if (bead) {
          bead.position.set(
            Math.cos(newAngle) * ringIncome.radius,
            Math.sin(newAngle) * ringIncome.radius,
            0
          );
        }
      });

      // Animate Ring 02: EXPENSES (Champagne / Copper)
      ringExpenses.ringPivot.rotation.y += 0.003 * expenseSpeed;
      ringExpenses.ringPivot.rotation.z = Math.PI / 6 + Math.cos(elapsed * 0.25) * 0.04;
      ringExpenses.beadAngles.forEach((angle, idx) => {
        const newAngle = angle + elapsed * 0.32 * expenseSpeed;
        const bead = ringExpenses.beadsGroup.children[idx];
        if (bead) {
          bead.position.set(
            Math.cos(newAngle) * ringExpenses.radius,
            Math.sin(newAngle) * ringExpenses.radius,
            0
          );
        }
      });

      // Animate Ring 03: SAVINGS / MARGIN (Brushed Titanium + Lime)
      ringSavings.ringPivot.rotation.x += 0.0025 * savingsSpeed;
      ringSavings.beadAngles.forEach((angle, idx) => {
        const newAngle = angle + elapsed * 0.42 * savingsSpeed;
        const bead = ringSavings.beadsGroup.children[idx];
        if (bead) {
          bead.position.set(
            Math.cos(newAngle) * ringSavings.radius,
            Math.sin(newAngle) * ringSavings.radius,
            0
          );
        }
      });

      // Gentle drift for distant & foreground cosmic particles
      distantPoints.rotation.y = elapsed * 0.012;
      fgPoints.rotation.y = -elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || (variant === 'hero' ? 820 : variant === 'story' ? 560 : 420);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (interactive) {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
      }
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      mainSphereGeo.dispose();
      mainSphereMat.dispose();
      distantGeo.dispose();
      distantMat.dispose();
      coinBodyGeo.dispose();
      coinBodyMat.dispose();
      coinRimGeo.dispose();
      coinRimMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      fgGeo.dispose();
      fgMat.dispose();
      container.innerHTML = '';
    };
  }, [incomePaise, expensesPaise, marginPaise, savingsRate, variant, interactive, onSelectRing]);

  return (
    <div
      className={`relative w-full flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        height: variant === 'hero' ? 'min(860px, 92vh)' : variant === 'story' ? '560px' : '420px',
      }}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Atmospheric Cosmic Gradient Glows */}
      <div
        className="pointer-events-none absolute -inset-20 z-0 opacity-40 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle at 45% 45%, rgba(131, 184, 255, 0.18) 0%, rgba(167, 139, 250, 0.12) 30%, rgba(217, 164, 108, 0.08) 55%, transparent 70%)',
        }}
      />

      {/* Futuristic HUD Telemetry Strip */}
      <div className="pointer-events-none absolute bottom-4 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-wider text-[#929BA8]">
        <div className="flex items-center gap-2 rounded-full border border-[rgba(201,208,218,0.18)] bg-[#090B10]/85 px-4 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#83B8FF] shadow-[0_0_8px_#83B8FF]" />
          <span className="font-semibold text-[#E2E5EA]">THE WEALTH ENGINE</span>
          <span className="text-[#83B8FF]">[SPATIAL CORE ONLINE]</span>
        </div>

        {/* Ring Controls & Legend */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveRing('income')}
            className={`pointer-events-auto flex items-center gap-1.5 rounded-full border px-3.5 py-1 transition-all ${
              activeRing === 'income'
                ? 'border-[#83B8FF] bg-[#83B8FF]/15 text-[#FFFFFF] shadow-[0_0_15px_rgba(131,184,255,0.3)]'
                : 'border-[rgba(201,208,218,0.14)] bg-[#090B10]/75 text-[#C9D0DA] hover:border-[#83B8FF]/50'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#83B8FF]" />
            <span>INFLOW (ICE BLUE)</span>
            <span className="font-bold text-[#83B8FF]">{formatCurrency(incomePaise, true)}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRing('expenses')}
            className={`pointer-events-auto flex items-center gap-1.5 rounded-full border px-3.5 py-1 transition-all ${
              activeRing === 'expenses'
                ? 'border-[#D9A46C] bg-[#D9A46C]/15 text-[#FFFFFF] shadow-[0_0_15px_rgba(217,164,108,0.3)]'
                : 'border-[rgba(201,208,218,0.14)] bg-[#090B10]/75 text-[#C9D0DA] hover:border-[#D9A46C]/50'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D9A46C]" />
            <span>OUTFLOW (CHAMPAGNE)</span>
            <span className="font-bold text-[#D9A46C]">{formatCurrency(expensesPaise, true)}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRing('savings')}
            className={`pointer-events-auto flex items-center gap-1.5 rounded-full border px-3.5 py-1 transition-all ${
              activeRing === 'savings'
                ? 'border-[#B9F36A] bg-[#B9F36A]/15 text-[#FFFFFF] shadow-[0_0_15px_rgba(185,243,106,0.3)]'
                : 'border-[rgba(201,208,218,0.14)] bg-[#090B10]/75 text-[#C9D0DA] hover:border-[#B9F36A]/50'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#B9F36A]" />
            <span>MARGIN (LIME)</span>
            <span className="font-bold text-[#B9F36A]">{formatCurrency(marginPaise, true)}</span>
          </button>
        </div>
      </div>

      {/* Top HUD Telemetry Tags */}
      <div className="pointer-events-none absolute top-4 left-6 font-mono text-[10px] text-[#929BA8]/70 tracking-widest uppercase">
        <p>[ SYS.3D // PHYSICAL.OCCLUSION.V2 ]</p>
        <p className="text-[#83B8FF]">CHROME: SPECULAR // ENVIRONMENT: DEEP SPACE</p>
      </div>

      <div className="pointer-events-none absolute top-4 right-6 text-right font-mono text-[10px] text-[#929BA8]/70 tracking-widest uppercase">
        <p>[ TELEMETRY // MARGIN: {savingsRate.toFixed(1)}% ]</p>
        <p className="text-[#A78BFA]">STUDIO LIGHTING: QUAD-SOURCE</p>
      </div>
    </div>
  );
}
