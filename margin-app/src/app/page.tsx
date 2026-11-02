'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  ArrowRight, Shield, Zap, TrendingUp, Wallet, Target,
  Calendar, Cpu, CheckCircle, Clock, SkipForward, ChevronDown,
  Sparkles, Layers, Activity, Lock, Orbit, PiggyBank, Coins
} from 'lucide-react';
import FinancialCore from '@/components/core/FinancialCore';
import MoneyFlowVisual from '@/components/core/MoneyFlowVisual';
import MagneticCTA from '@/components/core/MagneticCTA';
import GlowPanel from '@/components/core/GlowPanel';
import MoneyUniverseBackground from '@/components/core/MoneyUniverseBackground';
import CustomCursor from '@/components/core/CustomCursor';
import LanguageSwitcher from '@/components/core/LanguageSwitcher';
import { formatCurrency } from '@/lib/calculations';
import { useTranslation } from '@/lib/i18n';

export default function FuturisticLandingPage() {
  const { t, isRTL } = useTranslation();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.15]);
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.97]);

  // Floating Coins Parallax Transforms
  const coinY1 = useTransform(scrollYProgress, [0, 1], [0, -420]);
  const coinY2 = useTransform(scrollYProgress, [0, 1], [0, -680]);
  const coinY3 = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const coinRot1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const coinRot2 = useTransform(scrollYProgress, [0, 1], [0, -270]);

  // Interactive purchase simulator on Landing Page
  const [simAmount, setSimAmount] = useState<number>(35000);
  const [selectedScenario, setSelectedScenario] = useState<'buy' | 'wait' | 'skip'>('wait');

  // Baseline figures for demo simulation
  const monthlyIncome = 14500000;
  const currentExpenses = 4780000;
  const currentMargin = monthlyIncome - currentExpenses;
  const simPaise = simAmount * 100;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative min-h-screen bg-[#090B10] text-[#F5F7F3] selection:bg-[#83B8FF] selection:text-[#090B10] overflow-x-hidden"
    >
      {/* ── Custom Cursor with Sparkling Particle Trail ──────────────────────── */}
      <CustomCursor />

      {/* ── 3D Money Cinematic Universe Background (Three.js WebGL) ──────────── */}
      <MoneyUniverseBackground savingsRate={67} />

      {/* Floating 3D Metallic Accent Elements in HTML Space (Parallax Depth) */}
      <motion.div
        style={{ y: coinY1, rotate: coinRot1 }}
        className="pointer-events-none fixed top-[22vh] left-[3.5vw] z-20 hidden xl:flex items-center gap-2.5 rounded-2xl border border-[rgba(201,208,218,0.25)] bg-[#101722]/85 px-4 py-2.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(131,184,255,0.25)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#929BA8] to-[#FFFFFF] font-mono text-sm font-black text-[#090B10] shadow-[0_0_12px_#FFFFFF]">
          ₹
        </span>
        <div className="font-mono text-[10px]">
          <p className="text-[#83B8FF] font-bold tracking-wider">{t('gross_inflow').toUpperCase()}</p>
          <p className="text-[#E2E5EA] font-extrabold">+₹1,45,000</p>
        </div>
      </motion.div>

      <motion.div
        style={{ y: coinY2, rotate: coinRot2 }}
        className="pointer-events-none fixed top-[55vh] right-[4vw] z-20 hidden xl:flex items-center gap-2.5 rounded-2xl border border-[rgba(201,208,218,0.25)] bg-[#101722]/85 px-4 py-2.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(217,164,108,0.25)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#D9A46C] to-[#FFE6CC] font-mono text-sm font-black text-[#090B10] shadow-[0_0_12px_#D9A46C]">
          ◆
        </span>
        <div className="font-mono text-[10px]">
          <p className="text-[#D9A46C] font-bold tracking-wider">{t('gross_outflow').toUpperCase()}</p>
          <p className="text-[#E2E5EA] font-extrabold">-₹47,800</p>
        </div>
      </motion.div>

      <motion.div
        style={{ y: coinY3 }}
        className="pointer-events-none fixed top-[78vh] left-[6vw] z-20 hidden xl:flex items-center gap-2.5 rounded-2xl border border-[rgba(185,243,106,0.3)] bg-[#101722]/85 px-4 py-2.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(185,243,106,0.25)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#B9F36A] to-[#E9FFBE] font-mono text-sm font-black text-[#090B10] shadow-[0_0_12px_#B9F36A]">
          M
        </span>
        <div className="font-mono text-[10px]">
          <p className="text-[#B9F36A] font-bold tracking-wider">{t('available_margin').toUpperCase()}</p>
          <p className="text-[#E2E5EA] font-extrabold">67.0% SOVEREIGN</p>
        </div>
      </motion.div>

      {/* ── Top Navigation Bar with Language Switcher at Top Right ────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-14 py-3.5 md:py-4 border-b border-[rgba(201,208,218,0.12)] bg-[#090B10]/92 backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#101722] border border-[#83B8FF]/40 shadow-[0_0_15px_rgba(131,184,255,0.25)] transition-transform group-hover:scale-105">
            <span className="font-mono text-sm font-extrabold text-[#E2E5EA]">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-extrabold tracking-[0.2em] text-[#F5F7F3]">
              MARGIN
            </span>
            <span className="font-mono text-[8px] text-[#83B8FF] tracking-widest uppercase">
              STUDIO // OS.4
            </span>
          </div>
        </Link>

        {/* Navigation telemetry links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-wider text-[#929BA8]">
          <a href="#wealth-engine" className="hover:text-[#83B8FF] transition-colors">[ 01. {t('overview').toUpperCase()} ]</a>
          <a href="#flow" className="hover:text-[#83B8FF] transition-colors">[ 02. {t('transactions').toUpperCase()} ]</a>
          <a href="#simulator" className="hover:text-[#83B8FF] transition-colors">[ 03. {t('decision').toUpperCase()} ]</a>
          <a href="#wealth" className="hover:text-[#83B8FF] transition-colors">[ 04. {t('goals').toUpperCase()} ]</a>
        </nav>

        {/* Top Right Controls: Global Language Switcher + Enter Command */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <LanguageSwitcher />

          <Link
            href="/app"
            className="flex items-center gap-2 rounded-xl border border-[rgba(201,208,218,0.2)] bg-[#101722]/90 px-3 sm:px-4 py-2 font-mono text-xs font-bold text-[#F5F7F3] transition-all hover:border-[#83B8FF] hover:bg-[#182333] hover:shadow-[0_0_20px_rgba(131,184,255,0.35)]"
          >
            <span className="hidden sm:inline">{t('enter_command')}</span>
            <span className="sm:hidden">{t('enter_command').slice(0, 8)}</span>
            <ArrowRight size={14} className="text-[#83B8FF]" />
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION: FULL-WIDTH 3D WEALTH ENGINE (ZERO DEAD SPACE) ─────────── */}
      <section
        id="wealth-engine"
        className="relative min-h-screen w-full flex flex-col items-center justify-center pt-28 pb-12 px-4 md:px-10 text-center"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center"
        >
          {/* Animated Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(201,208,218,0.2)] bg-[#101722]/90 px-5 py-2 font-mono text-xs text-[#929BA8] mb-6 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            <span className="h-2 w-2 rounded-full bg-[#83B8FF] animate-ping" />
            <span className="text-[#F5F7F3] font-semibold tracking-wider">
              {t('spatial_core_online')}
            </span>
            <span className="text-[#4B5565]">•</span>
            <span className="text-[#C9D0DA]">{t('local_first_secure')}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-display mb-4 tracking-tight max-w-5xl"
          >
            {t('hero_title_1')}<br />
            <span className="bg-gradient-to-r from-[#FFFFFF] via-[#C9D0DA] to-[#83B8FF] bg-clip-text text-transparent">
              {t('hero_title_2')}
            </span>
          </motion.h1>

          {/* Supporting Headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-sans text-base md:text-xl text-[#929BA8] max-w-3xl mx-auto mb-8 font-light leading-relaxed"
          >
            {t('hero_sub')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-4"
          >
            <MagneticCTA href="/app">
              <span>{t('launch_studio')}</span>
              <ArrowRight size={16} />
            </MagneticCTA>

            <a
              href="#flow"
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,208,218,0.2)] bg-[#101722]/80 px-6 py-4 font-mono text-xs font-semibold tracking-wider text-[#C9D0DA] hover:border-[#83B8FF] hover:bg-[#182333] transition-all"
            >
              <span>{t('explore_arch')}</span>
              <ChevronDown size={14} className="text-[#83B8FF]" />
            </a>
          </motion.div>
        </motion.div>

        {/* ── THE SIGNATURE 3D WEALTH ENGINE CANVAS ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[1700px] mx-auto z-10"
        >
          <FinancialCore
            variant="hero"
            incomePaise={monthlyIncome}
            expensesPaise={currentExpenses}
            marginPaise={currentMargin}
            savingsRate={67}
          />
        </motion.div>

        {/* Live Telemetry Ticker Strip (Widescreen Full Span) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-10 w-full max-w-[1700px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 font-mono text-xs"
        >
          <div className="rounded-xl border border-[rgba(131,184,255,0.25)] bg-[#101722]/85 p-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="text-[10px] text-[#929BA8] block">{t('gross_inflow')}</span>
            <span className="text-xl font-bold text-[#83B8FF]">₹1,45,000</span>
            <span className="text-[10px] text-[#929BA8] block mt-0.5">Electric Ice Blue</span>
          </div>
          <div className="rounded-xl border border-[rgba(217,164,108,0.25)] bg-[#101722]/85 p-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="text-[10px] text-[#929BA8] block">{t('gross_outflow')}</span>
            <span className="text-xl font-bold text-[#D9A46C]">₹47,800</span>
            <span className="text-[10px] text-[#929BA8] block mt-0.5">Champagne Gold</span>
          </div>
          <div className="rounded-xl border border-[rgba(185,243,106,0.25)] bg-[#101722]/85 p-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="text-[10px] text-[#929BA8] block">{t('available_margin')}</span>
            <span className="text-xl font-bold text-[#B9F36A]">₹97,200</span>
            <span className="text-[10px] text-[#B9F36A] block mt-0.5">{t('retained_margin')}</span>
          </div>
          <div className="rounded-xl border border-[rgba(201,208,218,0.25)] bg-[#101722]/85 p-4 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="text-[10px] text-[#929BA8] block">{t('privacy_local')}</span>
            <span className="text-xl font-bold text-[#E2E5EA]">100% LOCAL</span>
            <span className="text-[10px] text-[#929BA8] block mt-0.5">{t('zero_cloud')}</span>
          </div>
        </motion.div>
      </section>

      {/* ── SCROLL CHAPTER 01: MONEY IN MOTION (FULL-WIDTH STREAM) ─────────────── */}
      <section id="flow" className="relative py-28 px-4 sm:px-6 md:px-14 w-full max-w-[1700px] mx-auto border-t border-[rgba(201,208,218,0.1)]">
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#83B8FF] uppercase font-bold">
            {t('chapter_01_tag')}
          </span>
          <h2 className="text-headline mt-2 mb-4">
            {t('chapter_01_title')}
          </h2>
          <p className="font-sans text-base text-[#929BA8] max-w-2xl mx-auto">
            {t('chapter_01_desc')}
          </p>
        </div>

        {/* Dynamic Animated SVG Money Flow Visual */}
        <MoneyFlowVisual
          income={monthlyIncome}
          expenses={currentExpenses}
          savings={currentMargin}
        />
      </section>

      {/* ── SCROLL CHAPTER 02: THE BIG PICTURE HUD ─────────────────────────────── */}
      <section className="relative py-28 px-4 sm:px-6 md:px-14 w-full max-w-[1700px] mx-auto border-t border-[rgba(201,208,218,0.1)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#A78BFA] uppercase font-bold">
              {t('chapter_02_tag')}
            </span>
            <h2 className="text-headline mt-2">
              {t('chapter_02_title')}
            </h2>
          </div>
          <p className="font-sans text-sm text-[#929BA8] max-w-md">
            {t('chapter_02_desc')}
          </p>
        </div>

        {/* Layered Command Cards Grid with 3D Perspective Mouse Tilt */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlowPanel codeTag="HUD.01" glowColor="champagne">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-[#D9A46C]/15 border border-[#D9A46C]/30 flex items-center justify-center text-[#D9A46C]">
                <TrendingUp size={18} />
              </div>
              <h4 className="font-mono font-bold text-base text-[#F5F7F3]">Burn Velocity</h4>
            </div>
            <p className="text-sm text-[#929BA8] mb-6 leading-relaxed">
              Real-time daily expense tracking with peak-outflow detection so you know exactly which days drain your reserves.
            </p>
            <div className="font-mono text-xs flex justify-between border-t border-[rgba(201,208,218,0.12)] pt-3 text-[#E2E5EA]">
              <span>RHYTHM: STABLE</span>
              <span className="text-[#D9A46C] font-bold">PEAK: 12TH</span>
            </div>
          </GlowPanel>

          <GlowPanel codeTag="HUD.02" glowColor="violet">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/30 flex items-center justify-center text-[#A78BFA]">
                <Cpu size={18} />
              </div>
              <h4 className="font-mono font-bold text-base text-[#F5F7F3]">Deterministic AI</h4>
            </div>
            <p className="text-sm text-[#929BA8] mb-6 leading-relaxed">
              No generative hallucinations. Pure mathematical analysis of your category variances and recurring leakage.
            </p>
            <div className="font-mono text-xs flex justify-between border-t border-[rgba(201,208,218,0.12)] pt-3 text-[#E2E5EA]">
              <span>ACCURACY: 100%</span>
              <span className="text-[#A78BFA] font-bold">RULES: ACTIVE</span>
            </div>
          </GlowPanel>

          <GlowPanel codeTag="HUD.03" glowColor="blue">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-[#83B8FF]/15 border border-[#83B8FF]/30 flex items-center justify-center text-[#83B8FF]">
                <Calendar size={18} />
              </div>
              <h4 className="font-mono font-bold text-base text-[#F5F7F3]">90-Day Trajectory</h4>
            </div>
            <p className="text-sm text-[#929BA8] mb-6 leading-relaxed">
              Simulates upcoming subscriptions, rent, and salaries to project whether your liquid balance stays positive.
            </p>
            <div className="font-mono text-xs flex justify-between border-t border-[rgba(201,208,218,0.12)] pt-3 text-[#E2E5EA]">
              <span>HORIZON: 90 DAYS</span>
              <span className="text-[#83B8FF] font-bold">&gt; ₹2.4L SAFE</span>
            </div>
          </GlowPanel>
        </div>
      </section>

      {/* ── SCROLL CHAPTER 03: THE DECISION LENS (WIDESCREEN SIMULATOR) ────────── */}
      <section id="simulator" className="relative py-28 px-4 sm:px-6 md:px-14 w-full max-w-[1700px] mx-auto border-t border-[rgba(201,208,218,0.1)]">
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#83B8FF] uppercase font-bold">
            {t('chapter_03_tag')}
          </span>
          <h2 className="text-headline mt-2 mb-4">
            {t('chapter_03_title')}
          </h2>
          <p className="font-sans text-base text-[#929BA8] max-w-2xl mx-auto">
            {t('chapter_03_desc')}
          </p>
        </div>

        {/* Live Interactive Simulator Component */}
        <div className="rounded-2xl border border-[rgba(201,208,218,0.2)] bg-[#101722]/95 p-6 md:p-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 border-b border-[rgba(201,208,218,0.12)] pb-8">
            <div>
              <span className="font-mono text-[11px] text-[#929BA8] uppercase tracking-wider block">
                SIMULATE PURCHASE COMMITMENT
              </span>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-3xl font-bold text-[#83B8FF]">₹</span>
                <input
                  type="number"
                  value={simAmount}
                  onChange={e => setSimAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="font-mono text-3xl md:text-4xl font-extrabold bg-transparent text-[#F5F7F3] border-b-2 border-[#83B8FF]/50 focus:border-[#FFFFFF] outline-none w-56"
                />
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {[15000, 35000, 75000, 150000, 300000].map(val => (
                <button
                  key={val}
                  onClick={() => setSimAmount(val)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs transition-all ${
                    simAmount === val
                      ? 'bg-[#E2E5EA] text-[#090B10] font-bold shadow-[0_0_20px_rgba(226,229,234,0.4)]'
                      : 'border border-[rgba(201,208,218,0.18)] bg-[#090B10] text-[#D9E0DB] hover:border-[#83B8FF]'
                  }`}
                >
                  ₹{(val / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Consequence Metrics */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {/* Scenario 01: Buy Outright */}
            <div
              onClick={() => setSelectedScenario('buy')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedScenario === 'buy'
                  ? 'border-[#D9A46C] bg-[#1E1916] shadow-[0_0_25px_rgba(217,164,108,0.25)]'
                  : 'border-[rgba(201,208,218,0.12)] bg-[#0C1118] hover:border-[#D9A46C]/50'
              }`}
            >
              <div className="flex items-center gap-2 text-[#D9A46C] mb-3 font-mono text-xs font-bold uppercase">
                <CheckCircle size={15} /> Scenario 01: Buy Now
              </div>
              <p className="font-mono text-2xl font-bold text-[#F5F7F3] mb-1">
                {formatCurrency(currentMargin - simPaise)}
              </p>
              <p className="font-mono text-xs text-[#929BA8]">
                Available margin reduced by -{((simPaise / currentMargin) * 100).toFixed(0)}%
              </p>
            </div>

            {/* Scenario 02: Wait & Save */}
            <div
              onClick={() => setSelectedScenario('wait')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedScenario === 'wait'
                  ? 'border-[#83B8FF] bg-[#121B2A] shadow-[0_0_25px_rgba(131,184,255,0.3)]'
                  : 'border-[rgba(201,208,218,0.12)] bg-[#0C1118] hover:border-[#83B8FF]/50'
              }`}
            >
              <div className="flex items-center gap-2 text-[#83B8FF] mb-3 font-mono text-xs font-bold uppercase">
                <Clock size={15} /> Scenario 02: Save 30 Days
              </div>
              <p className="font-mono text-2xl font-bold text-[#F5F7F3] mb-1">
                {formatCurrency(currentMargin)}
              </p>
              <p className="font-mono text-xs text-[#929BA8]">
                Zero deficit. Monthly budget cycles safely reset.
              </p>
            </div>

            {/* Scenario 03: Direct to Goal */}
            <div
              onClick={() => setSelectedScenario('skip')}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedScenario === 'skip'
                  ? 'border-[#B9F36A] bg-[#141F16] shadow-[0_0_25px_rgba(185,243,106,0.3)]'
                  : 'border-[rgba(201,208,218,0.12)] bg-[#0C1118] hover:border-[#B9F36A]/50'
              }`}
            >
              <div className="flex items-center gap-2 text-[#B9F36A] mb-3 font-mono text-xs font-bold uppercase">
                <SkipForward size={15} /> Scenario 03: Direct to Vault
              </div>
              <p className="font-mono text-2xl font-bold text-[#B9F36A] mb-1">
                +{formatCurrency(simPaise)}
              </p>
              <p className="font-mono text-xs text-[#929BA8]">
                Accelerates Emergency Vault by ~2.3 months.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <MagneticCTA href="/app">
              <span>{t('launch_studio')} →</span>
            </MagneticCTA>
          </div>
        </div>
      </section>

      {/* ── SCROLL CHAPTER 04: 3D PIGGY BANK & CAPITAL VAULTS ─────────────────── */}
      <section id="wealth" className="relative py-28 px-4 sm:px-6 md:px-14 w-full max-w-[1700px] mx-auto border-t border-[rgba(201,208,218,0.1)]">
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#A78BFA] uppercase font-bold">
            {t('chapter_04_tag')}
          </span>
          <h2 className="text-headline mt-2 mb-4">
            {t('chapter_04_title')}
          </h2>
          <p className="font-sans text-base text-[#929BA8] max-w-2xl mx-auto">
            {t('chapter_04_desc')}
          </p>
        </div>

        {/* 3 Geometric Vault Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Emergency Fortress',
              current: 35000000,
              target: 50000000,
              color: '#83B8FF',
              tag: 'VAULT.01',
              eta: 'Nov 2026',
            },
            {
              title: 'Tokyo Sabbatical',
              current: 18000000,
              target: 30000000,
              color: '#A78BFA',
              tag: 'VAULT.02',
              eta: 'Feb 2027',
            },
            {
              title: 'Angel Equity Seed',
              current: 8500000,
              target: 10000000,
              color: '#B9F36A',
              tag: 'VAULT.03',
              eta: 'Dec 2026',
            },
          ].map(vault => {
            const pct = (vault.current / vault.target) * 100;
            return (
              <GlowPanel key={vault.title} codeTag={vault.tag} glowColor="blue">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-mono font-bold text-base text-[#F5F7F3]">{vault.title}</h4>
                    <span className="font-mono text-[10px] text-[#929BA8]">TARGET ETA: {vault.eta}</span>
                  </div>
                  <span
                    className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${vault.color}20`, color: vault.color }}
                  >
                    {pct.toFixed(0)}%
                  </span>
                </div>

                {/* Level Gauge */}
                <div className="relative h-2.5 w-full rounded-full bg-[#090B10] border border-[rgba(201,208,218,0.15)] overflow-hidden mb-6">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, #83B8FF, ${vault.color})`,
                      boxShadow: `0 0 12px ${vault.color}`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                <div className="flex justify-between items-center font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#929BA8] block">FUNDED</span>
                    <span className="font-bold text-[#F5F7F3]">{formatCurrency(vault.current, true)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#929BA8] block">TARGET</span>
                    <span className="font-bold text-[#D9E0DB]">{formatCurrency(vault.target, true)}</span>
                  </div>
                </div>
              </GlowPanel>
            );
          })}
        </div>

        {/* 3D Piggy Bank Interactive Telemetry HUD Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-[rgba(131,184,255,0.25)] bg-[#101722]/85 p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(131,184,255,0.15)] flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#C9D0DA] via-[#FFFFFF] to-[#83B8FF] text-[#090B10] shadow-[0_0_30px_rgba(131,184,255,0.4)] flex-shrink-0">
              <PiggyBank size={32} />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#83B8FF] tracking-widest uppercase font-bold">
                [ 3D SOVEREIGN PIGGY VAULT // COIN INTAKE ACTIVE ]
              </span>
              <h3 className="text-2xl font-bold text-[#F5F7F3] mt-1">{t('piggy_vault_title')}</h3>
              <p className="font-mono text-xs text-[#929BA8] mt-1.5 max-w-xl leading-relaxed">
                {t('piggy_vault_desc')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 font-mono text-xs flex-shrink-0 w-full sm:w-auto justify-between">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#929BA8] block uppercase tracking-wider">{t('available_margin')}</span>
              <span className="font-bold text-[#B9F36A] text-xl">₹97,200 / MO</span>
              <span className="text-[10px] text-[#83B8FF] block mt-0.5">67% Retention Efficiency</span>
            </div>
            <Link
              href="/app"
              className="btn btn-primary btn-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>{t('goals')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FINAL CINEMATIC CTA ──────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 text-center border-t border-[rgba(201,208,218,0.12)]">
        <div className="max-w-4xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#83B8FF] uppercase font-bold block mb-4">
            [ {t('ready_command')} ]
          </span>
          <h2 className="text-headline mb-6">
            {t('hero_title_1')}<br />
            <span className="bg-gradient-to-r from-[#FFFFFF] via-[#C9D0DA] to-[#83B8FF] bg-clip-text text-transparent">
              {t('make_room')}
            </span>
          </h2>
          <p className="font-sans text-base text-[#929BA8] max-w-xl mx-auto mb-10 leading-relaxed">
            {t('privacy_desc')}
          </p>

          <MagneticCTA href="/app" className="btn-xl">
            <span>{t('enter_studio')}</span>
            <ArrowRight size={18} />
          </MagneticCTA>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="px-6 md:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[rgba(201,208,218,0.1)] bg-[#07090D] font-mono text-xs text-[#929BA8]">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-[#101722] border border-[#83B8FF]/40 flex items-center justify-center font-bold text-[#E2E5EA]">
            M
          </div>
          <span className="font-bold tracking-widest text-[#F5F7F3]">MARGIN // SPATIAL WEALTH ENGINE</span>
        </div>
        <div>
          <span>LOCAL REPOSITORY ENCRYPTED</span> • <span>REAL-TIME DETERMINISTIC ENGINE</span>
        </div>
      </footer>
    </div>
  );
}
