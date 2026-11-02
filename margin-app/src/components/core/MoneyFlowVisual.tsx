'use client';

import { motion } from 'motion/react';
import { formatCurrency } from '@/lib/calculations';

interface MoneyFlowVisualProps {
  income?: number;
  expenses?: number;
  savings?: number;
  className?: string;
  interactive?: boolean;
}

export default function MoneyFlowVisual({
  income = 14500000,
  expenses = 4780000,
  savings = 9720000,
  className = '',
  interactive = true,
}: MoneyFlowVisualProps) {
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 33;
  const savingsRatio = income > 0 ? (savings / income) * 100 : 67;

  return (
    <div className={`relative w-full rounded-2xl border border-[rgba(201,208,218,0.14)] bg-[#101722]/85 p-6 md:p-10 backdrop-blur-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Background Subtle Chrome Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(201, 208, 218, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 208, 218, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header Telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[rgba(201,208,218,0.12)] pb-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#83B8FF] uppercase font-bold">
            [ CAPITAL FLOW ENGINE // V4.2 ]
          </span>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#F5F7F3] mt-0.5">
            Active Money Flow Stream
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="h-2 w-2 rounded-full bg-[#83B8FF] animate-ping" />
          <span className="text-[#83B8FF] font-semibold">100% TELEMETRY SYNCED</span>
        </div>
      </div>

      {/* Flow Diagram (Responsive SVG) */}
      <div className="relative z-10 w-full" style={{ height: '240px' }}>
        <svg viewBox="0 0 900 240" className="w-full h-full overflow-visible">
          <defs>
            {/* Ice Blue Stream */}
            <linearGradient id="flowIncomeStream" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#83B8FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C9D0DA" stopOpacity="0.95" />
            </linearGradient>

            {/* Champagne Gold Stream */}
            <linearGradient id="flowExpenseStream" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9D0DA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D9A46C" stopOpacity="0.95" />
            </linearGradient>

            {/* Electric Lime Stream */}
            <linearGradient id="flowSavingsStream" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9D0DA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B9F36A" stopOpacity="1" />
            </linearGradient>

            <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Main Inflow Path (Left to Junction) - Ice Blue */}
          <motion.path
            d="M 50 120 L 320 120"
            stroke="url(#flowIncomeStream)"
            strokeWidth="5"
            fill="none"
            filter="url(#flowGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* 2. Top Branch to Expenses - Champagne Gold */}
          <motion.path
            d="M 320 120 C 440 120, 520 50, 720 50"
            stroke="url(#flowExpenseStream)"
            strokeWidth="3.5"
            fill="none"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
          />

          {/* 3. Bottom Branch to Retained Margin - Electric Lime */}
          <motion.path
            d="M 320 120 C 440 120, 520 190, 720 190"
            stroke="url(#flowSavingsStream)"
            strokeWidth="6"
            fill="none"
            filter="url(#flowGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: 'easeInOut' }}
          />

          {/* Flowing Pulse Orbs */}
          <motion.circle
            r="5"
            fill="#83B8FF"
            filter="url(#flowGlow)"
            animate={{
              cx: [50, 320],
              cy: [120, 120],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <motion.circle
            r="4.5"
            fill="#D9A46C"
            filter="url(#flowGlow)"
            animate={{
              cx: [320, 440, 720],
              cy: [120, 85, 50],
            }}
            transition={{
              duration: 2.2,
              delay: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.circle
            r="5.5"
            fill="#B9F36A"
            filter="url(#flowGlow)"
            animate={{
              cx: [320, 460, 720],
              cy: [120, 155, 190],
            }}
            transition={{
              duration: 1.8,
              delay: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Core Junction Node */}
          <circle cx="320" cy="120" r="10" fill="#090B10" stroke="#C9D0DA" strokeWidth="2.5" />
          <circle cx="320" cy="120" r="4" fill="#83B8FF" className="animate-ping" />
        </svg>

        {/* Node A: Inflow (Ice Blue) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start bg-[#101722]/95 border border-[#83B8FF]/40 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(131,184,255,0.15)]">
          <span className="font-mono text-[9px] tracking-widest text-[#83B8FF] uppercase font-bold">01 // INFLOW (ICE BLUE)</span>
          <span className="font-mono text-base md:text-lg font-bold text-[#F5F7F3]">
            {formatCurrency(income, true)}
          </span>
          <span className="font-mono text-[9px] text-[#C9D0DA]/70">Gross Capital</span>
        </div>

        {/* Central Core Splitter */}
        <div className="hidden md:flex absolute left-[36%] top-1/2 -translate-y-1/2 flex-col items-center pointer-events-none">
          <span className="font-mono text-[9px] tracking-widest text-[#E2E5EA] uppercase bg-[#090B10] px-2.5 py-0.5 rounded border border-[rgba(201,208,218,0.25)]">
            LIQUID DISPATCH
          </span>
        </div>

        {/* Node B: Expenses Branch (Champagne Gold) */}
        <div className="absolute right-0 top-[10%] flex flex-col items-end bg-[#18151D]/95 border border-[#D9A46C]/40 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(217,164,108,0.15)]">
          <span className="font-mono text-[9px] tracking-widest text-[#D9A46C] uppercase font-bold">02 // OUTFLOW (CHAMPAGNE)</span>
          <span className="font-mono text-base md:text-lg font-bold text-[#D9A46C]">
            -{formatCurrency(expenses, true)}
          </span>
          <span className="font-mono text-[9px] text-[#C9D0DA]/60">{expenseRatio.toFixed(0)}% Disbursed</span>
        </div>

        {/* Node C: Retained Margin Branch (Electric Lime) */}
        <div className="absolute right-0 bottom-[10%] flex flex-col items-end bg-[#101E17]/95 border border-[#B9F36A]/50 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-[0_0_25px_rgba(185,243,106,0.2)]">
          <span className="font-mono text-[9px] tracking-widest text-[#B9F36A] uppercase font-bold">03 // RETAINED MARGIN (LIME)</span>
          <span className="font-mono text-lg md:text-xl font-extrabold text-[#B9F36A]">
            +{formatCurrency(savings, true)}
          </span>
          <span className="font-mono text-[9px] text-[#C9D0DA]/70 font-semibold">{savingsRatio.toFixed(0)}% Retained for Wealth</span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-4 border-t border-[rgba(201,208,218,0.1)] font-mono text-xs">
        <div>
          <span className="text-[10px] text-[#929BA8] block">VELOCITY</span>
          <span className="text-[#F5F7F3] font-semibold">14 Txn / Wk</span>
        </div>
        <div>
          <span className="text-[10px] text-[#929BA8] block">LEAKAGE RATE</span>
          <span className="text-[#83B8FF] font-semibold">&lt; 1.2% Controlled</span>
        </div>
        <div>
          <span className="text-[10px] text-[#929BA8] block">RUNWAY EXPANSION</span>
          <span className="text-[#B9F36A] font-semibold">+4.2 Mo / Yr</span>
        </div>
        <div>
          <span className="text-[10px] text-[#929BA8] block">CORE SYNCHRONIZATION</span>
          <span className="text-[#E2E5EA] font-semibold">99.8% Spatial Core</span>
        </div>
      </div>
    </div>
  );
}
