'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useSpring } from 'motion/react';
import Link from 'next/link';

interface MagneticCTAProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  glow?: boolean;
}

export default function MagneticCTA({
  children,
  href,
  onClick,
  className = '',
  strength = 0.35,
  glow = true,
}: MagneticCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth springs for magnetic translation
  const x = useSpring(0, { stiffness: 250, damping: 20 });
  const y = useSpring(0, { stiffness: 250, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={`group relative inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
        glow
          ? 'bg-[#E2E5EA] text-[#090B10] shadow-[0_0_30px_rgba(226,229,234,0.25)] hover:shadow-[0_0_50px_rgba(131,184,255,0.45)] hover:bg-[#FFFFFF]'
          : 'bg-[#101722] border border-[rgba(201,208,218,0.2)] text-[#F5F7F3] hover:border-[#83B8FF] hover:bg-[#182333]'
      } ${className}`}
    >
      {/* Subtle Laser scanline */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </span>

      {/* Children content */}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return <div onClick={onClick} className="inline-block">{content}</div>;
}
