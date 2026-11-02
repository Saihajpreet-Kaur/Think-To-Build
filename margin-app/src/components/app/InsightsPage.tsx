'use client';

import { motion } from 'motion/react';
import { useStore } from '@/store';
import { generateInsights, formatCurrency } from '@/lib/calculations';
import { Sparkles, Brain, Cpu, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

export default function InsightsPage() {
  const { t } = useTranslation();
  const { transactions, budgets, selectedMonth } = useStore();
  const insights = generateInsights(transactions, budgets, selectedMonth);

  const typeStyles = {
    positive: {
      bg: 'rgba(131, 184, 255, 0.08)',
      border: 'rgba(131, 184, 255, 0.25)',
      badge: '#83B8FF',
      badgeBg: 'rgba(131, 184, 255, 0.15)',
      glow: 'shadow-[0_0_20px_rgba(131,184,255,0.12)]',
    },
    negative: {
      bg: 'rgba(217, 164, 108, 0.08)',
      border: 'rgba(217, 164, 108, 0.25)',
      badge: '#D9A46C',
      badgeBg: 'rgba(217, 164, 108, 0.15)',
      glow: 'shadow-[0_0_20px_rgba(217,164,108,0.12)]',
    },
    neutral: {
      bg: 'rgba(167, 139, 250, 0.08)',
      border: 'rgba(167, 139, 250, 0.25)',
      badge: '#A78BFA',
      badgeBg: 'rgba(167, 139, 250, 0.15)',
      glow: 'shadow-[0_0_20px_rgba(167,139,250,0.12)]',
    },
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Neural Variance Radar Animation ── */}
      <PageFinancialHero
        variant="insights"
        tag="NEURAL TELEMETRY // DETERMINISTIC INSIGHTS"
        title={t('insights')}
        subtitle="Mathematical intelligence derived directly from verified ledger events. No hallucinations — pure deterministic variance and recurring leak detection."
        metricLabel="CALIBRATED SIGNALS"
        metricValue={`${insights.length} ACTIVE PATTERNS`}
        metricSub="DETERMINISTIC VERIFICATION ACTIVE"
        accentColor="#A78BFA"
      />

      {insights.length === 0 ? (
        <div className="card py-24 text-center font-mono">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-bold text-[#F5F7F3] mb-1">Insufficient Ledger Records</p>
          <p className="text-xs text-[#929BA8]">Record more transactions to calibrate pattern recognition</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, i) => {
            const style = typeStyles[insight.type];
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`card p-6 flex items-start gap-4 font-mono ${style.glow}`}
                style={{ background: style.bg, borderColor: style.border }}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{insight.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <p className="font-bold text-sm text-[#F5F7F3]">{insight.title}</p>
                    {insight.value && (
                      <div
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold flex-shrink-0 border"
                        style={{ background: style.badgeBg, color: style.badge, borderColor: style.border }}
                      >
                        {insight.value}
                      </div>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-[#929BA8]">{insight.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Verification Notice */}
      <div className="card p-5 font-mono text-xs text-[#929BA8] border border-[rgba(201,208,218,0.1)]">
        <p className="leading-relaxed">
          <strong className="text-[#83B8FF]">DETERMINISTIC INTEGRITY ASSURANCE:</strong> All signals and recommendations are computed using exact mathematical formulas over your local transaction history. No probabilistic guesswork, no hallucinated numbers, and zero third-party telemetry.
        </p>
      </div>
    </div>
  );
}
