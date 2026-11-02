'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { format, addDays } from 'date-fns';
import { useStore } from '@/store';
import { getForecastData, formatCurrency, getTotalIncome, getTotalExpenses } from '@/lib/calculations';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid
} from 'recharts';
import { TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Sparkles, Calendar } from 'lucide-react';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

type Range = 30 | 60 | 90;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const isEstimate = payload[0]?.payload?.isEstimate;
  return (
    <div className="bg-[#101722]/95 border border-[rgba(201,208,218,0.2)] rounded-xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl font-mono">
      <p className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider mb-1">
        {format(new Date(label), 'dd MMM yyyy')} {isEstimate ? '· [PROJECTION]' : '· [RECORDED]'}
      </p>
      <p className="text-base font-extrabold text-[#F5F7F3]">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function ForecastPage() {
  const { t } = useTranslation();
  const { transactions, recurringPayments, selectedMonth } = useStore();
  const [range, setRange] = useState<Range>(30);

  const currentBalance = getTotalIncome(transactions) - getTotalExpenses(transactions);
  const forecastData = getForecastData(currentBalance, recurringPayments, range);

  const expectedIncome = recurringPayments.filter(r => r.isActive && r.type === 'income').reduce((sum, r) => sum + r.amountPaise, 0);
  const expectedExpenses = recurringPayments.filter(r => r.isActive && r.type === 'expense').reduce((sum, r) => sum + r.amountPaise, 0);
  const projectedBalance = forecastData[forecastData.length - 1]?.balancePaise || 0;
  const minBalance = Math.min(...forecastData.map(d => d.balancePaise));

  const upcoming = recurringPayments
    .filter(r => r.isActive)
    .filter(r => {
      const nextDate = new Date(r.nextDate);
      const endDate = addDays(new Date(), range);
      return nextDate <= endDate;
    })
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());

  const chartData = forecastData.map(d => ({
    date: d.date,
    balance: d.balancePaise,
    isEstimate: d.isEstimate,
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Predictive Shimmering Horizon ── */}
      <PageFinancialHero
        variant="forecast"
        tag="PREDICTIVE ENGINE // RUNWAY TELEMETRY"
        title={t('forecast')}
        subtitle={`Deterministic liquidity curve projection across a ${range}-day horizon. Computes future floor safety margin from scheduled commitments.`}
        metricLabel={`PROJECTED RUNWAY (${range}D)`}
        metricValue={formatCurrency(projectedBalance)}
        metricSub={`LIQUIDITY FLOOR: ${formatCurrency(minBalance)}`}
        accentColor="#A78BFA"
        actionButton={
          <div className="flex bg-[#101722] rounded-xl p-1 border border-[rgba(201,208,218,0.18)] font-mono">
            {([30, 60, 90] as Range[]).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: range === r ? '#A78BFA' : 'transparent',
                  color: range === r ? '#090B10' : '#929BA8',
                  boxShadow: range === r ? '0 0 15px rgba(167,139,250,0.4)' : 'none',
                }}
              >
                {r}D
              </button>
            ))}
          </div>
        }
      />

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CURRENT CAPITAL', value: formatCurrency(currentBalance), note: 'Verified ledger balance', color: '#E2E5EA' },
          { label: `PROJECTED (${range}D)`, value: formatCurrency(projectedBalance), note: 'After recurring flows', color: '#A78BFA' },
          { label: 'SCHEDULED INFLOW', value: formatCurrency(expectedIncome), note: 'Monthly recurring', color: '#83B8FF' },
          { label: 'SCHEDULED BURN', value: formatCurrency(expectedExpenses), note: 'Monthly recurring', color: '#D9A46C' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5 group hover:border-[#A78BFA]/40 transition-all font-mono"
          >
            <p className="text-label-upper mb-2">{s.label}</p>
            <p className="text-2xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] mt-1.5 text-[#929BA8]">{s.note}</p>
          </motion.div>
        ))}
      </div>

      {/* Forecast Chart Panel - Full Width Cinematic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-[#A78BFA] uppercase font-bold">
              [ REAL-TIME TRAJECTORY ]
            </span>
            <h3 className="text-lg font-bold text-[#F5F7F3] mt-0.5">Projected Liquidity Curve</h3>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-[#929BA8]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#83B8FF] inline-block" /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#A78BFA] border-b border-dashed inline-block" /> Forecast
            </span>
          </div>
        </div>

        <div className="w-full h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(201,208,218,0.08)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={d => format(new Date(d), 'dd MMM')}
                tick={{ fontSize: 10, fill: '#929BA8', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                interval={Math.floor(range / 7)}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#929BA8', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              {minBalance < 0 && <ReferenceLine y={0} stroke="#FF5C5C" strokeDasharray="4 4" />}
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#A78BFA"
                strokeWidth={2.5}
                fill="url(#foreGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {minBalance < 0 && (
          <div className="mt-4 p-4 rounded-xl flex items-center gap-3 bg-[#1A0C0E] border border-[#FF5C5C]/35 font-mono text-xs text-[#FF5C5C]">
            <AlertTriangle size={18} className="flex-shrink-0" />
            <div>
              <p className="font-bold">DEFICIT WARNING DETECTED</p>
              <p className="text-[11px] text-[#929BA8] mt-0.5">
                Based on current burn rate and upcoming commitments, your capital buffer will drop below zero within {range} days.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Upcoming Payments Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-5 border-b border-[rgba(201,208,218,0.1)] pb-4">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-[#83B8FF] uppercase font-bold">
              [ SCHEDULED PIPELINE ]
            </span>
            <h3 className="text-lg font-bold text-[#F5F7F3] mt-0.5">Upcoming Outflows & Inflows</h3>
          </div>
          <span className="font-mono text-xs text-[#929BA8]">{upcoming.length} OBLIGATIONS PENDING</span>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-xs font-mono text-center py-12 text-[#929BA8]">No scheduled commitments within {range} days</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map(r => {
              const isIncome = r.type === 'income';
              return (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-[#101722]/80 border border-[rgba(201,208,218,0.12)] flex items-center justify-between font-mono group hover:border-[#83B8FF]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm border"
                      style={{
                        background: isIncome ? 'rgba(131,184,255,0.12)' : 'rgba(217,164,108,0.12)',
                        borderColor: isIncome ? 'rgba(131,184,255,0.25)' : 'rgba(217,164,108,0.25)',
                      }}
                    >
                      {isIncome ? '⚡' : '📅'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F5F7F3]">{r.name}</p>
                      <p className="text-[10px] text-[#929BA8] mt-0.5">{format(new Date(r.nextDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: isIncome ? '#83B8FF' : '#D9A46C' }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(r.amountPaise)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
