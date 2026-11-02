'use client';

import { ReactNode, useRef, useState } from 'react';

interface GlowPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'violet' | 'champagne' | 'lime' | 'emerald';
  interactive?: boolean;
  codeTag?: string;
  onClick?: () => void;
}

export default function GlowPanel({
  children,
  className = '',
  glowColor = 'blue',
  interactive = true,
  codeTag,
  onClick,
}: GlowPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [opacity, setOpacity] = useState(0);

  const colors = {
    blue: {
      border: 'rgba(131, 184, 255, 0.22)',
      hoverBorder: '#83B8FF',
      glow: 'rgba(131, 184, 255, 0.2)',
      tagColor: '#83B8FF',
    },
    violet: {
      border: 'rgba(167, 139, 250, 0.22)',
      hoverBorder: '#A78BFA',
      glow: 'rgba(167, 139, 250, 0.2)',
      tagColor: '#A78BFA',
    },
    champagne: {
      border: 'rgba(217, 164, 108, 0.22)',
      hoverBorder: '#D9A46C',
      glow: 'rgba(217, 164, 108, 0.2)',
      tagColor: '#D9A46C',
    },
    lime: {
      border: 'rgba(185, 243, 106, 0.22)',
      hoverBorder: '#B9F36A',
      glow: 'rgba(185, 243, 106, 0.2)',
      tagColor: '#B9F36A',
    },
    emerald: {
      border: 'rgba(131, 184, 255, 0.22)',
      hoverBorder: '#83B8FF',
      glow: 'rgba(131, 184, 255, 0.2)',
      tagColor: '#83B8FF',
    },
  }[glowColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });
    setOpacity(1);

    // 3D Perspective Tilt calculation
    const rx = ((y / rect.height) - 0.5) * -12;
    const ry = ((x / rect.width) - 0.5) * 12;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={panelRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border bg-[#101722]/85 p-6 backdrop-blur-xl transition-transform duration-200 ease-out ${
        interactive ? 'hover:shadow-2xl' : ''
      } ${className}`}
      style={{
        borderColor: opacity > 0 ? colors.hoverBorder : colors.border,
        transform: interactive
          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`
          : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Interactive Cursor Spotlight Glow */}
      {interactive && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${colors.glow}, transparent 70%)`,
          }}
        />
      )}

      {/* Cyber Corner HUD Brackets */}
      <span
        className="pointer-events-none absolute top-0 left-0 h-2.5 w-2.5 border-t-2 border-l-2 opacity-50 group-hover:opacity-100 transition-all"
        style={{ borderColor: colors.tagColor }}
      />
      <span
        className="pointer-events-none absolute top-0 right-0 h-2.5 w-2.5 border-t-2 border-r-2 opacity-50 group-hover:opacity-100 transition-all"
        style={{ borderColor: colors.tagColor }}
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 opacity-30 group-hover:opacity-100 transition-all"
        style={{ borderColor: colors.tagColor }}
      />
      <span
        className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 opacity-30 group-hover:opacity-100 transition-all"
        style={{ borderColor: colors.tagColor }}
      />

      {/* Code Tag HUD Badge */}
      {codeTag && (
        <div
          className="absolute top-2.5 right-3 font-mono text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ color: colors.tagColor }}
        >
          [ {codeTag} ]
        </div>
      )}

      {/* Panel Inner Content with 3D Pop */}
      <div className="relative z-10" style={{ transform: interactive ? 'translateZ(20px)' : 'none' }}>
        {children}
      </div>
    </div>
  );
}
