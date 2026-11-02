'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth spring physics for trail cursor
  const cursorX = useSpring(0, { stiffness: 600, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 30 });

  const dotX = useSpring(0, { stiffness: 1200, damping: 45 });
  const dotY = useSpring(0, { stiffness: 1200, damping: 45 });

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setMounted(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const sparkles: Sparkle[] = [];
    const colors = ['#83B8FF', '#D9A46C', '#FFFFFF', '#B9F36A'];

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Emit 2-3 sparkling particles on movement
      for (let i = 0; i < 2; i++) {
        sparkles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 + 0.3,
          size: Math.random() * 2.5 + 1.0,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button';
        setIsPointer(!!isClickable);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    // Particle Trail Render Loop
    let animId: number;
    const renderTrail = () => {
      animId = requestAnimationFrame(renderTrail);
      ctx.clearRect(0, 0, width, height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const p = sparkles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size <= 0.2) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    renderTrail();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Particle Trail Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

      {isVisible && (
        <>
          {/* Outer Liquid Chrome / Ice Blue Spring Glow Ring */}
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              scale: isPointer ? 1.8 : 1,
              borderColor: isPointer ? '#83B8FF' : 'rgba(201, 208, 218, 0.45)',
              backgroundColor: isPointer ? 'rgba(131, 184, 255, 0.14)' : 'rgba(201, 208, 218, 0.04)',
            }}
            transition={{ duration: 0.18 }}
            className="fixed h-7 w-7 rounded-full border backdrop-blur-[1.5px] shadow-[0_0_15px_rgba(131,184,255,0.25)]"
          />

          {/* Center Electric Laser Dot */}
          <motion.div
            style={{
              x: dotX,
              y: dotY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              scale: isPointer ? 1.6 : 1,
              backgroundColor: isPointer ? '#FFFFFF' : '#83B8FF',
            }}
            className="fixed h-1.5 w-1.5 rounded-full bg-[#83B8FF] shadow-[0_0_10px_#83B8FF]"
          />
        </>
      )}
    </div>
  );
}
