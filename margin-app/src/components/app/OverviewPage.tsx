'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowRight, Zap, Activity } from 'lucide-react';
import { useStore } from '@/store';
import {
  getTotalIncome, getTotalExpenses, getMargin, getSavingsRate,
  getMonthlyChartData, getExpensesByCategory, formatCurrency, getMonthLabel,
  getDailySpending, getTopMerchants
} from '@/lib/calculations';
import { CATEGORY_META } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import FinancialOrbit from '@/components/core/FinancialOrbit';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

// ─── Stat HUD Card ────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, trend, trendUp, accentColor = '#83B8FF', delay
}: {
  label: string; value: string; sub?: string; trend?: string; trendUp?: boolean;
  accentColor?: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className="card p-5 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#929BA8] uppercase">
          {label}
        </span>
        <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ background: accentColor, color: accentColor }} />
      </div>

      <p className="font-mono text-2xl md:text-3xl font-extrabold tracking-tight text-[#F5F7F3] mb-1">
        {value}
      </p>

      {sub && <p className="font-mono text-[11px] text-[#929BA8]">{sub}</p>}

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[rgba(201,208,218,0.12)]">
          {trendUp ? <TrendingUp size={12} className="text-[#83B8FF]" /> : <TrendingDown size={12} className="text-[#D9A46C]" />}
          <span className="font-mono text-[11px] font-semibold" style={{ color: trendUp ? '#83B8FF' : '#D9A46C' }}>
            {trend}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Custom Dark Glass Tooltip ───────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[rgba(201,208,218,0.25)] bg-[#101722]/95 p-3.5 shadow-2xl backdrop-blur-xl font-mono">
      <p className="text-[10px] font-bold text-[#929BA8] uppercase tracking-widest mb-2 border-b border-[rgba(201,208,218,0.1)] pb-1">
        [ {label} ]
      </p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-[#D9E0DB]">{entry.name}:</span>
          </div>
          <span className="font-bold text-[#F5F7F3]">
            ₹{(entry.value / 100).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
}

function DailySpendingTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-[rgba(201,208,218,0.25)] bg-[#101722]/95 p-3 shadow-2xl backdrop-blur-xl font-mono">
      <p className="text-[10px] font-bold text-[#929BA8] uppercase tracking-wider mb-1">{d.date}</p>
      <p className="text-sm font-bold text-[#F5F7F3] mb-0.5">₹{(d.amountPaise / 100).toLocaleString('en-IN')}</p>
      <p className="text-[10px] text-[#83B8FF]">{d.count} transaction{d.count === 1 ? '' : 's'}</p>
    </div>
  );
}

// ─── Overview Page ─────────────────────────────────────────────────────────────
export default function OverviewPage({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { t } = useTranslation();
  const { transactions, budgets, recurringPayments, selectedMonth, setSelectedMonth } = useStore();
  const [countedValues, setCountedValues] = useState({ income: 0, expenses: 0, margin: 0 });

  const income = getTotalIncome(transactions, selectedMonth);
  const expenses = getTotalExpenses(transactions, selectedMonth);
  const margin = getMargin(transactions, selectedMonth);
  const savingsRate = getSavingsRate(transactions, selectedMonth);
  const monthlyData = getMonthlyChartData(transactions, 6);
  const categorySpend = getExpensesByCategory(transactions, selectedMonth);
  const dailyData = getDailySpending(transactions, selectedMonth);
  const topMerchants = getTopMerchants(transactions, selectedMonth, 4);
  const peakDay = dailyData.find(d => d.isPeak && d.amountPaise > 0);
  const activeDaysCount = dailyData.filter(d => d.amountPaise > 0).length;

  const prevMonth = format(subMonths(new Date(selectedMonth + '-01'), 1), 'yyyy-MM');
  const prevIncome = getTotalIncome(transactions, prevMonth);
  const prevExpenses = getTotalExpenses(transactions, prevMonth);

  // Smooth Count-up animation
  useEffect(() => {
    let startTime: number;
    const duration = 800;
    const targets = { income, expenses, margin };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setCountedValues({
        income: Math.round(targets.income * ease),
        expenses: Math.round(targets.expenses * ease),
        margin: Math.round(targets.margin * ease),
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [selectedMonth, income, expenses, margin]);

  // Recent transactions
  const recentTxns = [...transactions]
    .filter(t => t.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Category donut palette (Cosmic palette: ice blue, violet, champagne, chrome, lime)
  const donutColors = ['#83B8FF', '#A78BFA', '#D9A46C', '#C9D0DA', '#B9F36A'];
  const pieData = Object.entries(categorySpend)
    .filter(([_, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cat, value], i) => ({
      name: CATEGORY_META[cat as keyof typeof CATEGORY_META]?.label || cat,
      value,
      color: donutColors[i % donutColors.length],
    }));

  // Upcoming recurring payments
  const upcoming = recurringPayments
    .filter(r => r.isActive && r.type === 'expense')
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
    .slice(0, 3);

  const navigateMonth = (dir: 'prev' | 'next') => {
    const current = new Date(selectedMonth + '-01');
    const newDate = dir === 'prev' ? subMonths(current, 1) : addMonths(current, 1);
    setSelectedMonth(format(newDate, 'yyyy-MM'));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-[1700px] mx-auto space-y-8">
      
      {/* ── Page Financial Hero with Animated Specie & Cash Stream Telemetry ── */}
      <PageFinancialHero
        variant="overview"
        tag="FINANCIAL COMMAND // OS.4"
        title={t('overview')}
        subtitle="Real-time mathematical capital engine. Monitor instantaneous inflow, outflow, retained margin, and cash velocity."
        metricLabel={t('available_margin')}
        metricValue={formatCurrency(countedValues.margin)}
        metricSub={`${savingsRate.toFixed(0)}% ${t('retained_margin')}`}
        accentColor="#83B8FF"
        actionButton={
          <div className="flex items-center gap-2 bg-[#101722] border border-[rgba(201,208,218,0.18)] rounded-xl p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3] hover:bg-[#182333] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-xs font-bold text-[#F5F7F3] min-w-[100px] text-center uppercase tracking-wider">
              {getMonthLabel(selectedMonth)}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3] hover:bg-[#182333] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        }
      />

      {/* ── MAIN VISUAL ANCHOR: THE WEALTH ENGINE ORBITAL HERO ───────────────── */}
      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Left: Huge Orbit Gauge Visual Anchor */}
        <div className="lg:col-span-5 card p-8 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#101722] to-[#0A0D14]">
          <div className="absolute top-4 left-5 font-mono text-[9px] text-[#83B8FF] tracking-widest uppercase font-bold">
            [ CORE VISUAL ANCHOR // ORBIT ]
          </div>
          <FinancialOrbit
            value={countedValues.margin}
            progressPercent={savingsRate}
            glowColor={savingsRate > 30 ? '#B9F36A' : '#83B8FF'}
            size={270}
          />
        </div>

        {/* Right: Key Financial Telemetry Strip */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          <StatCard
            label="Gross Inflow (Ice Blue)"
            value={formatCurrency(countedValues.income)}
            trend={prevIncome > 0 ? `${((income - prevIncome) / prevIncome * 100).toFixed(0)}% vs last month` : undefined}
            trendUp={income >= prevIncome}
            accentColor="#83B8FF"
            delay={0.05}
          />
          <StatCard
            label="Gross Outflow (Champagne)"
            value={formatCurrency(countedValues.expenses)}
            trend={prevExpenses > 0 ? `${((expenses - prevExpenses) / prevExpenses * 100).toFixed(0)}% vs last month` : undefined}
            trendUp={expenses <= prevExpenses}
            accentColor="#D9A46C"
            delay={0.1}
          />
          <StatCard
            label="Retained Margin (Lime)"
            value={formatCurrency(countedValues.margin)}
            sub="Available capital for freedom & investment"
            accentColor="#B9F36A"
            delay={0.15}
          />
          <StatCard
            label="Retention Rate"
            value={`${savingsRate.toFixed(0)}%`}
            sub={savingsRate > 20 ? 'Optimal: Above 20% target' : 'Constrained: Below 20% target'}
            trend={savingsRate > 20 ? 'Trajectory: Healthy' : 'Action Recommended'}
            trendUp={savingsRate > 20}
            accentColor="#E2E5EA"
            delay={0.2}
          />
        </div>
      </div>

      {/* ── CHARTS ROW: CASH FLOW AREA & BREAKDOWN ──────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 6-Month Cash Flow Holographic Chart (Ice Blue & Champagne) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold">
                [ 01 // CASH FLOW TRAJECTORY ]
              </p>
              <h3 className="font-bold text-base text-[#F5F7F3] mt-0.5">
                6-Month Inflow vs Outflow
              </h3>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#83B8FF] shadow-[0_0_8px_#83B8FF]" />
                <span className="text-[#929BA8]">Inflow (Ice Blue)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9A46C] shadow-[0_0_8px_#D9A46C]" />
                <span className="text-[#929BA8]">Outflow (Champagne)</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="neonIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#83B8FF" stopOpacity="0.4" />
                  <stop offset="95%" stopColor="#83B8FF" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="neonExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D9A46C" stopOpacity="0.35" />
                  <stop offset="95%" stopColor="#D9A46C" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#929BA8', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#929BA8', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="incomePaise" name="Inflow" stroke="#83B8FF" strokeWidth={2.5} fill="url(#neonIncomeGrad)" />
              <Area type="monotone" dataKey="expensesPaise" name="Outflow" stroke="#D9A46C" strokeWidth={2.5} fill="url(#neonExpenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Donut Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="card p-6 flex flex-col justify-between"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#A78BFA] uppercase font-bold">
              [ 02 // ALLOCATION ]
            </p>
            <h3 className="font-bold text-base text-[#F5F7F3] mt-0.5 mb-4">
              Category Distribution
            </h3>
          </div>

          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#090B10" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 12,
                    borderRadius: 10,
                    background: '#101722',
                    border: '1px solid rgba(201,208,218,0.25)',
                    color: '#F5F7F3',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center font-mono text-xs text-[#929BA8]">
              No expenses this cycle
            </div>
          )}

          <div className="space-y-1.5 mt-2 font-mono text-xs">
            {pieData.slice(0, 3).map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-[#929BA8]">{d.name}</span>
                </div>
                <span className="font-bold text-[#F5F7F3]">{formatCurrency(d.value, true)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── DAILY RHYTHM & TOP SPEND OUTLETS ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Spending Velocity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold">
                [ 03 // VELOCITY RHYTHM ]
              </p>
              <h3 className="font-bold text-base text-[#F5F7F3] mt-0.5">
                Daily Outflow Rhythm
              </h3>
            </div>
            {peakDay && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg font-mono text-xs border border-[#D9A46C]/40 bg-[#1D1815] text-[#D9A46C]">
                <span className="font-bold">PEAK SPEND:</span> {formatCurrency(peakDay.amountPaise, true)} on Day {peakDay.day}
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={dailyData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="dayLabel" tick={{ fontSize: 10, fill: '#929BA8', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#929BA8', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<DailySpendingTooltip />} />
              <Bar dataKey="amountPaise" radius={[3, 3, 0, 0]}>
                {dailyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isPeak ? '#D9A46C' : entry.amountPaise > 0 ? '#83B8FF' : 'rgba(201,208,218,0.08)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(201,208,218,0.12)] font-mono text-[11px] text-[#929BA8]">
            <span>Active Days: <strong className="text-[#F5F7F3]">{activeDaysCount}</strong> / {dailyData.length}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#83B8FF]" /> Standard</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#D9A46C]" /> Peak Burn</span>
            </div>
          </div>
        </motion.div>

        {/* Top Spend Outlets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#A78BFA] uppercase font-bold">
                [ 04 // OUTLETS ]
              </p>
              <h3 className="font-bold text-base text-[#F5F7F3] mt-0.5">
                Largest Merchants
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#83B8FF]">SHARE</span>
          </div>

          {topMerchants.length > 0 ? (
            <div className="space-y-4">
              {topMerchants.map(m => (
                <div key={m.merchant}>
                  <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                    <span className="font-semibold text-[#F5F7F3]">{m.merchant}</span>
                    <span className="font-bold text-[#D9A46C]">{formatCurrency(m.totalPaise, true)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-[#090B10] border border-[rgba(201,208,218,0.15)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D9A46C] to-[#83B8FF]"
                      style={{ width: `${Math.min(m.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 font-mono text-[10px] text-[#929BA8]">
                    <span>{m.count} payment{m.count > 1 ? 's' : ''}</span>
                    <span>{m.percentage.toFixed(0)}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center font-mono text-xs text-[#929BA8]">
              No transactions recorded
            </div>
          )}
        </motion.div>
      </div>

      {/* ── RECENT TELEMETRY FEED & DECISION LENS ───────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Latest Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5 border-b border-[rgba(201,208,218,0.12)] pb-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold">
                [ 05 // LOG STREAM ]
              </p>
              <h3 className="font-bold text-base text-[#F5F7F3] mt-0.5">
                Recent Inflow & Outflow Activity
              </h3>
            </div>
            <button
              onClick={() => onNavigate?.('transactions')}
              className="font-mono text-xs font-semibold flex items-center gap-1 text-[#83B8FF] hover:text-[#FFFFFF] transition-colors"
            >
              All Records <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-2 font-mono">
            {recentTxns.length === 0 ? (
              <p className="text-sm py-8 text-center text-[#929BA8]">No transactions logged this month</p>
            ) : recentTxns.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[rgba(201,208,218,0.1)] bg-[#101722] hover:border-[rgba(201,208,218,0.3)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border"
                    style={{
                      background: t.type === 'income' ? 'rgba(131,184,255,0.12)' : 'rgba(217,164,108,0.12)',
                      borderColor: t.type === 'income' ? 'rgba(131,184,255,0.3)' : 'rgba(217,164,108,0.3)',
                    }}
                  >
                    {CATEGORY_META[t.category]?.emoji}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F5F7F3]">{t.merchant}</p>
                    <p className="text-[10px] text-[#929BA8]">
                      {format(new Date(t.date), 'dd MMM')} · {CATEGORY_META[t.category]?.label}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: t.type === 'income' ? '#83B8FF' : '#D9A46C' }}
                >
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amountPaise, true)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Decision Lens CTA */}
        <div className="space-y-5">
          {/* Upcoming Commitments */}
          <div className="card p-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#929BA8] uppercase font-bold mb-3">
              [ UPCOMING COMMITMENTS ]
            </p>
            <div className="space-y-2 font-mono text-xs">
              {upcoming.map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-[rgba(201,208,218,0.1)]">
                  <div>
                    <p className="font-semibold text-[#F5F7F3]">{r.name}</p>
                    <p className="text-[10px] text-[#929BA8]">{format(new Date(r.nextDate), 'dd MMM')}</p>
                  </div>
                  <span className="font-bold text-[#D9A46C]">
                    -{formatCurrency(r.amountPaise, true)}
                  </span>
                </div>
              ))}
              {upcoming.length === 0 && (
                <p className="text-xs text-center py-3 text-[#929BA8]">No upcoming commitments</p>
              )}
            </div>
          </div>

          {/* Decision Lens Holographic Launcher */}
          <div
            onClick={() => onNavigate?.('decision')}
            className="rounded-2xl p-6 border border-[rgba(201,208,218,0.25)] bg-gradient-to-br from-[#101722] to-[#141B26] cursor-pointer hover:border-[#83B8FF] hover:shadow-[0_0_30px_rgba(131,184,255,0.2)] transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#83B8FF]/15 text-[#83B8FF]">
                <Zap size={18} />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold tracking-widest text-[#83B8FF] uppercase">
                  SIMULATION ENGINE
                </span>
                <p className="font-bold text-sm text-[#F5F7F3]">The Decision Lens</p>
              </div>
            </div>
            <p className="font-mono text-xs text-[#929BA8] leading-relaxed mb-4">
              Simulate any purchase before committing. Measure its exact impact on your available margin and goals.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#83B8FF]">
              <span>LAUNCH SIMULATOR</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
