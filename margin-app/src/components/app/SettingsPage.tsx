'use client';

import { motion } from 'motion/react';
import { RotateCcw, Shield, Database, Cpu, Terminal, Sparkles, Globe } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/calculations';
import { toast } from 'sonner';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import LanguageSwitcher from '@/components/core/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';

export default function SettingsPage({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();
  const { transactions, budgets, goals, recurringPayments, plannedPurchases, preferences } = useStore();

  const handleReset = () => {
    if (confirm('This will reset all data back to demo values. Are you sure?')) {
      onReset();
      toast.success('Demo environment re-initialized');
    }
  };

  const dataStats = [
    { label: 'Transactions', count: transactions.length, demo: transactions.filter(t => t.isDemo).length },
    { label: 'Budgets', count: budgets.length, demo: budgets.filter(b => b.isDemo).length },
    { label: 'Vaults', count: goals.length, demo: goals.filter(g => g.isDemo).length },
    { label: 'Schedules', count: recurringPayments.length, demo: recurringPayments.filter(r => r.isDemo).length },
    { label: 'Simulations', count: plannedPurchases.length, demo: 0 },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Encrypted Biometric Ring Animation ── */}
      <PageFinancialHero
        variant="settings"
        tag="SYSTEM CONFIG // STORAGE & CONTROL"
        title={t('settings')}
        subtitle="Zero-knowledge local storage protocols, multilingual Indian localization engine, and environment parameters."
        metricLabel="SOVEREIGN REPOSITORY"
        metricValue="100% LOCAL"
        metricSub="ZERO CLOUD EXPOSURE"
        accentColor="#C9D0DA"
      />

      {/* Language Configuration Card */}
      <div className="card p-6 font-mono">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#83B8FF]/15 border border-[#83B8FF]/30 text-[#83B8FF]">
              <Globe size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-[#F5F7F3]">Indian Languages Localization Engine</p>
              <p className="text-xs text-[#929BA8]">13 supported official regional languages (Punjabi first priority)</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Data Summary Grid */}
      <div className="card p-6 font-mono">
        <p className="text-label-upper mb-4">LOCAL REPOSITORY METRICS</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {dataStats.map(s => (
            <div key={s.label} className="p-4 rounded-xl bg-[#090B10]/80 border border-[rgba(201,208,218,0.1)] text-center">
              <p className="text-3xl font-bold text-[#F5F7F3]">{s.count}</p>
              <p className="text-xs text-[#929BA8] mt-1 uppercase">{s.label}</p>
              {s.demo > 0 && <p className="text-[10px] text-[#83B8FF] mt-0.5">{s.demo} DEMO</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Local-First Architecture */}
      <div className="card p-6 font-mono">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(131,184,255,0.12)] border border-[rgba(131,184,255,0.25)]">
            <Shield size={18} className="text-[#83B8FF]" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#F5F7F3]">Zero-Knowledge Local Storage</p>
            <p className="text-xs text-[#929BA8]">All financial data remains encrypted inside browser LocalStorage</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#929BA8] pt-2">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090B10]/60 border border-[rgba(201,208,218,0.08)]">
            <span className="text-[#83B8FF]">✓</span> Complete client-side sovereignty (no external cloud)
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090B10]/60 border border-[rgba(201,208,218,0.08)]">
            <span className="text-[#83B8FF]">✓</span> Instant offline readiness and persistence
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090B10]/60 border border-[rgba(201,208,218,0.08)]">
            <span className="text-[#83B8FF]">✓</span> Zero telemetry tracking or cookie trackers
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090B10]/60 border border-[rgba(201,208,218,0.08)]">
            <span className="text-[#83B8FF]">✓</span> Instant one-click wipe or restoration
          </div>
        </div>
      </div>

      {/* Data Management Action */}
      <div className="card p-6 font-mono">
        <p className="text-label-upper mb-2">FACTORY RESET</p>
        <p className="text-xs text-[#929BA8] mb-4">
          Revert all transactions, budgets, goals, and commitments back to clean initial demo parameters.
        </p>
        <button
          onClick={handleReset}
          className="btn btn-ghost text-xs text-[#FF5C5C] hover:border-[#FF5C5C]/50 hover:bg-[#201012]"
        >
          <RotateCcw size={14} /> Re-Initialize Demo Data
        </button>
      </div>
    </div>
  );
}
