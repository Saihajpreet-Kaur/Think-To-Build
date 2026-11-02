'use client';

import { motion } from 'motion/react';
import { formatCurrency } from '@/lib/calculations';

interface FinancialOrbitProps {
  value: number;
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  progressPercent?: number;
  glowColor?: string;
  className?: string;
}

export default function FinancialOrbit({
  value,
  label = 'AVAILABLE MARGIN',
  sublabel = 'NET SURPLUS RETAINED',
  size = 280,
  strokeWidth = 6,
  progressPercent = 68,
  glowColor = '#B9F36A',
  className = '',
}: FinancialOrbitProps) {
  const radius = (size - strokeWidth * 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(progressPercent, 100)) / 100;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Rotating Polished Chrome Guide */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-[rgba(201,208,218,0.2)]"
      />

      {/* Counter-Rotating Outer Reticle Orbit */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-3 rounded-full border border-[rgba(131,184,255,0.15)]"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#83B8FF] shadow-[0_0_8px_#83B8FF]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#D9A46C]" />
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#B9F36A]" />
      </motion.div>

      {/* Radial Atmosphere Glow */}
      <div
        className="absolute inset-8 rounded-full blur-2xl opacity-25"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* SVG Circular Progress Track */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background Track - Deep Navy */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(24, 30, 42, 0.7)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Dynamic Glowing Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={glowColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor})`,
          }}
        />
      </svg>

      {/* Central Telemetry HUD Data */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#83B8FF] uppercase">
          {label}
        </span>
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-3xl font-extrabold tracking-tight text-[#F5F7F3] my-1"
          style={{ textShadow: `0 0 20px ${glowColor}40` }}
        >
          {formatCurrency(value)}
        </motion.span>
        <span className="font-mono text-[10px] text-[#B9F36A] font-semibold tracking-wider">
          {progressPercent.toFixed(0)}% RETENTION
        </span>
        {sublabel && (
          <span className="font-sans text-[10px] text-[#929BA8] mt-1 tracking-wide">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
