'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Coins, Wallet, PiggyBank, TrendingUp, ShieldCheck,
  Calendar, Zap, Brain, Lock, Sparkles, ArrowRight,
  CircleDollarSign, Banknote, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';
import { useTranslation } from '@/lib/i18n';

export type PageHeroVariant =
  | 'overview'
  | 'transactions'
  | 'budgets'
  | 'forecast'
  | 'goals'
  | 'calendar'
  | 'decision'
  | 'insights'
  | 'settings';

interface PageFinancialHeroProps {
  variant: PageHeroVariant;
  title: string;
  subtitle: string;
  tag: string;
  metricLabel?: string;
  metricValue?: string;
  metricSub?: string;
  accentColor?: string;
  actionButton?: React.ReactNode;
}

export default function PageFinancialHero({
  variant,
  title,
  subtitle,
  tag,
  metricLabel,
  metricValue,
  metricSub,
  accentColor = '#83B8FF',
  actionButton,
}: PageFinancialHeroProps) {
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-2xl md:rounded-3xl border border-[rgba(201,208,218,0.18)] bg-[#0C1118]/90 p-5 sm:p-7 md:p-8 backdrop-blur-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(131,184,255,0.08)]"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25"
        style={{ background: accentColor }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-20"
        style={{ background: '#83B8FF' }}
      />

      {/* Dynamic Animated Money Mesh for this page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor="#83B8FF" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {variant === 'overview' && (
            <motion.path
              d="M0,50 Q250,120 500,40 T1000,70 T1500,30"
              fill="none"
              stroke={`url(#grad-${variant})`}
              strokeWidth="2"
              strokeDasharray="6 6"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            />
          )}
          {variant === 'transactions' && (
            <motion.path
              d="M0,80 C300,10 600,150 900,40 S1400,120 1800,60"
              fill="none"
              stroke={`url(#grad-${variant})`}
              strokeWidth="2.5"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -150] }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            />
          )}
          {variant === 'forecast' && (
            <motion.path
              d="M0,100 Q400,20 800,60 T1600,20"
              fill="none"
              stroke={`url(#grad-${variant})`}
              strokeWidth="3"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
          )}
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Tag + Title + Financial Description */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,208,218,0.18)] bg-[#101722]/80 px-3.5 py-1 font-mono text-[10px] text-[#929BA8] mb-3 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
              style={{ background: accentColor, color: accentColor }}
            />
            <span className="font-bold tracking-widest uppercase text-[#F5F7F3]">
              {tag}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F5F7F3] mb-2">
            {title}
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#929BA8] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Right: Unique Animated Financial Kinetic Element for this Page */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-end">
          
          {/* Custom 3D Graphic for the page */}
          <div
            className="relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#101722] border border-[rgba(201,208,218,0.2)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex-shrink-0 transition-transform duration-200"
            style={{
              transform: `rotateY(${mousePos.x * 25}deg) rotateX(${-mousePos.y * 25}deg)`,
            }}
          >
            {/* Ambient ring glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-30 animate-pulse"
              style={{ boxShadow: `inset 0 0 20px ${accentColor}` }}
            />

            {/* Page specific visual icon and micro-animation */}
            {variant === 'overview' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute h-14 w-14 rounded-full border border-dashed border-[#83B8FF]/40"
                />
                <Coins size={32} className="text-[#83B8FF]" />
                <motion.span
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#B9F36A] font-mono text-[9px] font-black text-[#090B10] shadow-[0_0_8px_#B9F36A]"
                >
                  ₹
                </motion.span>
              </div>
            )}

            {variant === 'transactions' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative text-[#D9A46C]"
                >
                  <Banknote size={34} />
                </motion.div>
                <motion.span
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#83B8FF] font-mono text-[9px] font-bold text-[#090B10] shadow-[0_0_8px_#83B8FF]"
                >
                  ↑↓
                </motion.span>
              </div>
            )}

            {variant === 'budgets' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#83B8FF]"
                >
                  <ShieldCheck size={34} />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-1 rounded-xl border border-[rgba(131,184,255,0.3)] border-t-[#83B8FF]"
                />
              </div>
            )}

            {variant === 'forecast' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#A78BFA]"
                >
                  <TrendingUp size={34} />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border border-[#A78BFA]/30 animate-ping opacity-30" />
                </div>
              </div>
            )}

            {variant === 'goals' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#B9F36A]"
                >
                  <PiggyBank size={34} />
                </motion.div>
                {/* Floating falling specie coin */}
                <motion.span
                  animate={{ y: [-15, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeIn' }}
                  className="absolute -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFFFFF] font-mono text-[8px] font-black text-[#090B10] shadow-[0_0_8px_#FFFFFF]"
                >
                  ₹
                </motion.span>
              </div>
            )}

            {variant === 'calendar' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#83B8FF]"
                >
                  <Calendar size={34} />
                </motion.div>
                <div className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-[#83B8FF] animate-ping" />
              </div>
            )}

            {variant === 'decision' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="text-[#D9A46C]"
                >
                  <Zap size={34} />
                </motion.div>
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute h-8 w-8 rounded-full border border-[#D9A46C]/40"
                />
              </div>
            )}

            {variant === 'insights' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#A78BFA]"
                >
                  <Brain size={34} />
                </motion.div>
                <div className="absolute inset-0 rounded-2xl border border-[#A78BFA]/30 animate-pulse" />
              </div>
            )}

            {variant === 'settings' && (
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[#C9D0DA]"
                >
                  <Lock size={32} />
                </motion.div>
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B9F36A] text-[#090B10] text-[8px] font-bold">
                  ✓
                </div>
              </div>
            )}
          </div>

          {/* Key Metric Counter Display */}
          {metricLabel && metricValue && (
            <div className="font-mono text-left lg:text-right">
              <span className="text-[10px] text-[#929BA8] block uppercase tracking-wider font-semibold">
                {metricLabel}
              </span>
              <span
                className="text-xl sm:text-2xl font-black block tracking-tight"
                style={{ color: accentColor }}
              >
                {metricValue}
              </span>
              {metricSub && (
                <span className="text-[10px] text-[#929BA8] block mt-0.5">
                  {metricSub}
                </span>
              )}
            </div>
          )}

          {/* Action button if provided */}
          {actionButton && (
            <div className="flex-shrink-0">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
