'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  LayoutDashboard, ArrowLeftRight, Wallet, TrendingUp, Target,
  Calendar, Lightbulb, Settings, ChevronLeft, ChevronRight, Menu, X, Zap,
  Plus, Terminal
} from 'lucide-react';
import { useStore } from '@/store';
import { getTotalIncome, getTotalExpenses, getMargin, getSavingsRate, formatCurrency } from '@/lib/calculations';
import { CATEGORY_META, INCOME_CATEGORIES, EXPENSE_CATEGORIES, type Category, type TransactionType } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';
import LanguageSwitcher from '@/components/core/LanguageSwitcher';

import OverviewPage from '@/components/app/OverviewPage';
import TransactionsPage from '@/components/app/TransactionsPage';
import BudgetsPage from '@/components/app/BudgetsPage';
import ForecastPage from '@/components/app/ForecastPage';
import GoalsPage from '@/components/app/GoalsPage';
import CalendarPage from '@/components/app/CalendarPage';
import InsightsPage from '@/components/app/InsightsPage';
import SettingsPage from '@/components/app/SettingsPage';
import DecisionLens from '@/components/app/DecisionLens';

type NavItem = {
  id: string;
  label: string;
  code: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export default function AppShell() {
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const { transactions, selectedMonth, addTransaction, resetToDemo } = useStore();

  // Quick Ingest Modal Form state
  const [quickType, setQuickType] = useState<TransactionType>('expense');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickMerchant, setQuickMerchant] = useState('');
  const [quickCategory, setQuickCategory] = useState<Category>('dining');
  const [quickDate, setQuickDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [quickNotes, setQuickNotes] = useState('');

  // Financial Telemetry
  const income = getTotalIncome(transactions, selectedMonth);
  const expenses = getTotalExpenses(transactions, selectedMonth);
  const margin = getMargin(transactions, selectedMonth);
  const savingsRate = getSavingsRate(transactions, selectedMonth);

  const navItems: NavItem[] = [
    { id: 'overview', label: t('overview'), code: '01', icon: <LayoutDashboard size={17} />, component: <OverviewPage onNavigate={setActiveTab} /> },
    { id: 'transactions', label: t('transactions'), code: '02', icon: <ArrowLeftRight size={17} />, component: <TransactionsPage /> },
    { id: 'budgets', label: t('budgets'), code: '03', icon: <Wallet size={17} />, component: <BudgetsPage /> },
    { id: 'forecast', label: t('forecast'), code: '04', icon: <TrendingUp size={17} />, component: <ForecastPage /> },
    { id: 'goals', label: t('goals'), code: '05', icon: <Target size={17} />, component: <GoalsPage /> },
    { id: 'calendar', label: t('calendar'), code: '06', icon: <Calendar size={17} />, component: <CalendarPage /> },
    { id: 'insights', label: t('insights'), code: '07', icon: <Lightbulb size={17} />, component: <InsightsPage /> },
    { id: 'decision', label: t('decision'), code: '08', icon: <Zap size={17} />, component: <DecisionLens /> },
    { id: 'settings', label: t('settings'), code: '09', icon: <Settings size={17} />, component: <SettingsPage onReset={resetToDemo} /> },
  ];

  const activeItem = navItems.find(i => i.id === activeTab) || navItems[0];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(quickAmount);
    if (!amountVal || amountVal <= 0 || !quickMerchant.trim()) {
      toast.error('Enter valid amount and merchant name');
      return;
    }

    addTransaction({
      type: quickType,
      amountPaise: Math.round(amountVal * 100),
      category: quickCategory,
      merchant: quickMerchant.trim(),
      description: quickNotes.trim() || 'Quick Ingest',
      date: quickDate,
    });

    toast.success(`Ingested ${formatCurrency(amountVal * 100)} to ${quickMerchant}`);
    setQuickAmount('');
    setQuickMerchant('');
    setQuickNotes('');
    setQuickAddOpen(false);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="flex min-h-screen bg-[#090B10] text-[#F5F7F3] selection:bg-[#83B8FF] selection:text-[#090B10]"
    >
      
      {/* ── Desktop Command Sidebar ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 256 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="app-sidebar hidden md:flex border-r border-[rgba(201,208,218,0.12)] bg-[#090B10]"
        style={{ width: sidebarCollapsed ? 76 : 256, overflow: 'hidden' }}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-[rgba(201,208,218,0.12)] min-h-[76px]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-[#101722] border border-[#83B8FF]/40 shadow-[0_0_15px_rgba(131,184,255,0.2)]">
            <span className="font-mono text-xs font-black text-[#E2E5EA]">M</span>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-mono font-bold text-sm tracking-[0.2em] text-[#F5F7F3]">
                  MARGIN
                </span>
                <span className="font-mono text-[9px] text-[#83B8FF] tracking-wider uppercase">
                  FINANCIAL OS.4
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Ingest Button */}
        <div className="p-3">
          <button
            onClick={() => setQuickAddOpen(true)}
            className={`w-full flex items-center justify-center gap-2 rounded-xl border border-[rgba(201,208,218,0.2)] bg-[#101722] font-mono text-xs font-bold text-[#E2E5EA] py-2.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:bg-[#182333] hover:border-[#83B8FF] hover:shadow-[0_0_20px_rgba(131,184,255,0.25)] transition-all ${
              sidebarCollapsed ? 'px-0' : 'px-3'
            }`}
            title={sidebarCollapsed ? t('record_txn') : undefined}
          >
            <Plus size={15} className="text-[#83B8FF]" />
            {!sidebarCollapsed && <span>{t('record_txn')}</span>}
          </button>
        </div>

        {/* Nav items list */}
        <nav className="flex-1 py-2 px-3 overflow-y-auto space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item w-full text-left ${activeTab === item.id ? 'active' : ''}`}
              style={{
                padding: sidebarCollapsed ? '10px 0' : '10px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center justify-between flex-1 whitespace-nowrap gap-2"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[9px] font-mono opacity-40 font-normal">[{item.code}]</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* User Operator Status */}
        <div className="p-3 border-t border-[rgba(201,208,218,0.12)]">
          <div className="flex items-center gap-3" style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <div className="relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold bg-[#101722] border border-[rgba(201,208,218,0.2)] text-[#E2E5EA]">
              RA
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#83B8FF] shadow-[0_0_6px_#83B8FF]" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="whitespace-nowrap"
                >
                  <p className="font-mono text-xs font-semibold text-[#F5F7F3]">Rahul Arora</p>
                  <p className="font-mono text-[9px] text-[#929BA8]">SECURE OPERATOR</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute right-0 top-6 translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 z-30"
          style={{ background: '#83B8FF', color: '#090B10', boxShadow: '0 0 10px rgba(131,184,255,0.6)', border: '2px solid #090B10' }}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* ── Main Command Canvas ─────────────────────────────────────────────── */}
      <main className="app-main flex-1 flex flex-col min-h-screen overflow-hidden bg-[#090B10]">
        
        {/* Top Telemetry Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[rgba(201,208,218,0.12)] bg-[#090B10]/92 backdrop-blur-xl">
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-lg text-[#F5F7F3] hover:bg-[#101722]"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#101722] border border-[#83B8FF]/40 flex items-center justify-center font-mono text-[10px] text-[#E2E5EA] font-bold">
                M
              </div>
              <span className="font-mono font-bold text-xs tracking-widest text-[#F5F7F3]">MARGIN</span>
            </div>
          </div>

          {/* Section Breadcrumb on Desktop */}
          <div className="hidden md:flex items-center gap-3 font-mono text-xs">
            <span className="text-[#929BA8]">STUDIO //</span>
            <span className="font-bold text-[#F5F7F3] uppercase tracking-wider">{activeItem.label}</span>
          </div>

          {/* Center Telemetry Pill: LIVE MARGIN GAUGE */}
          <div className="hidden lg:flex items-center gap-2.5 rounded-full border border-[rgba(201,208,218,0.18)] bg-[#101722]/90 px-4 py-1.5 font-mono text-xs backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
            <span className="h-2 w-2 rounded-full bg-[#B9F36A] animate-pulse shadow-[0_0_8px_#B9F36A]" />
            <span className="text-[#929BA8]">{t('available_margin').toUpperCase()}:</span>
            <span className="font-bold text-[#B9F36A]">{formatCurrency(margin)}</span>
            <span className="text-[10px] text-[#83B8FF] font-semibold">({savingsRate.toFixed(0)}% RETAINED)</span>
          </div>

          {/* Right Action Controls: Language Switcher + Ingest + Home Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact />

            <button
              onClick={() => setQuickAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(201,208,218,0.2)] bg-[#101722] px-2.5 sm:px-3 py-1.5 font-mono text-xs font-semibold text-[#E2E5EA] hover:bg-[#182333] hover:border-[#83B8FF] transition-all"
            >
              <Plus size={13} className="text-[#83B8FF]" />
              <span className="hidden sm:inline">{t('record_txn')}</span>
            </button>

            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-[#929BA8] hover:text-[#83B8FF] px-2.5 py-1.5 rounded-lg hover:bg-[#101722] transition-all"
            >
              <span>← {t('universe')}</span>
            </Link>
          </div>
        </header>

        {/* View Canvas Body with pb-16 for mobile bottom navigation clearance */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {activeItem.component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 border-t border-[rgba(201,208,218,0.12)] bg-[#090B10]/95 backdrop-blur-xl">
          {navItems.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === item.id ? 'text-[#83B8FF]' : 'text-[#929BA8]'
              }`}
            >
              {item.icon}
              <span className="font-mono text-[9px] font-bold tracking-wider max-w-[60px] truncate">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2.5 text-[#929BA8] hover:text-[#83B8FF]"
          >
            <Menu size={17} />
            <span className="font-mono text-[9px] font-bold tracking-wider">{t('more')}</span>
          </button>
        </nav>
      </main>

      {/* ── Mobile Nav Drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#090B10]/80 backdrop-blur-md"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 bottom-0 z-50 w-72 flex flex-col bg-[#090B10] border-r border-[rgba(201,208,218,0.15)] ${
                isRTL ? 'right-0 border-l border-r-0' : 'left-0 border-r'
              }`}
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(201,208,218,0.12)]">
                <span className="font-mono font-bold text-sm tracking-[0.2em] text-[#F5F7F3]">MARGIN // OS.4</span>
                <button onClick={() => setMobileNavOpen(false)} className="text-[#929BA8] hover:text-[#F5F7F3]">
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 border-b border-[rgba(201,208,218,0.1)]">
                <span className="font-mono text-[10px] text-[#929BA8] block mb-1.5 uppercase">{t('language')}</span>
                <LanguageSwitcher className="w-full" />
              </div>

              <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
                    className={`nav-item w-full text-left ${activeTab === item.id ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-[rgba(201,208,218,0.12)]">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-mono text-xs text-[#83B8FF]"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span>← {t('universe')}</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── GLOBAL QUICK INGEST TRANSACTION MODAL ────────────────────────────── */}
      <AnimatePresence>
        {quickAddOpen && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setQuickAddOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="modal-panel max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5 border-b border-[rgba(201,208,218,0.15)] pb-3">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-[#83B8FF]" />
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#F5F7F3]">
                    {t('record_txn')}
                  </h3>
                </div>
                <button onClick={() => setQuickAddOpen(false)} className="text-[#929BA8] hover:text-[#F5F7F3]">
                  <X size={16} />
                </button>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setQuickType('expense')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    quickType === 'expense'
                      ? 'bg-[#D9A46C] text-[#090B10] shadow-[0_0_15px_rgba(217,164,108,0.4)]'
                      : 'border border-[rgba(201,208,218,0.12)] bg-[#101722] text-[#929BA8] hover:border-[#D9A46C]/40'
                  }`}
                >
                  ↓ {t('gross_outflow')}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickType('income')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    quickType === 'income'
                      ? 'bg-[#83B8FF] text-[#090B10] shadow-[0_0_15px_rgba(131,184,255,0.4)]'
                      : 'border border-[rgba(201,208,218,0.12)] bg-[#101722] text-[#929BA8] hover:border-[#83B8FF]/40'
                  }`}
                >
                  ↑ {t('gross_inflow')}
                </button>
              </div>

              <form onSubmit={handleQuickSubmit} className="space-y-4">
                <div>
                  <label className="label">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-[#83B8FF]">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={quickAmount}
                      onChange={e => setQuickAmount(e.target.value)}
                      placeholder="0.00"
                      className="input pl-8 font-mono text-lg font-bold text-[#F5F7F3]"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Merchant / Source Entity</label>
                  <input
                    type="text"
                    required
                    value={quickMerchant}
                    onChange={e => setQuickMerchant(e.target.value)}
                    placeholder="e.g. Apple, AWS, Salary, Swiggy"
                    className="input font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={quickCategory}
                      onChange={e => setQuickCategory(e.target.value as Category)}
                      className="input font-mono text-xs"
                    >
                      {(quickType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                        <option key={c} value={c}>
                          {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Timestamp Date</label>
                    <input
                      type="date"
                      value={quickDate}
                      onChange={e => setQuickDate(e.target.value)}
                      className="input font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(false)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Ingest Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
