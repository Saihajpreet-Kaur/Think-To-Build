'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, addWeeks, addMonths, addYears, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Plus, X, Pencil, Trash2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/calculations';
import { CATEGORY_META, EXPENSE_CATEGORIES, INCOME_CATEGORIES, type RecurringPayment, type Category } from '@/types';
import { toast } from 'sonner';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

// ─── Recurring Form ───────────────────────────────────────────────────────────
function RecurringForm({ initial, onSubmit, onClose }: {
  initial?: RecurringPayment;
  onSubmit: (data: Omit<RecurringPayment, 'id' | 'isDemo'>) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<'income' | 'expense'>(initial?.type || 'expense');
  const [name, setName] = useState(initial?.name || '');
  const [amount, setAmount] = useState(initial ? (initial.amountPaise / 100).toString() : '');
  const [category, setCategory] = useState<Category>(initial?.category || 'subscriptions');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>(initial?.frequency || 'monthly');
  const [nextDate, setNextDate] = useState(initial?.nextDate || format(addMonths(new Date(), 0), 'yyyy-MM-dd'));
  const [description, setDescription] = useState(initial?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!nextDate) errs.nextDate = 'Date is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onSubmit({
      name: name.trim(),
      amountPaise: Math.round(parseFloat(amount) * 100),
      category,
      frequency,
      nextDate,
      type,
      isActive: initial?.isActive ?? true,
      description: description || undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-panel font-mono"
      >
        <div className="flex items-center justify-between mb-6 border-b border-[rgba(201,208,218,0.12)] pb-4">
          <div>
            <span className="text-[10px] tracking-widest text-[#83B8FF] uppercase font-bold">
              [ AUTOMATION // RECURRING ]
            </span>
            <h2 className="text-xl font-bold text-[#F5F7F3] mt-0.5">{initial ? 'Modify Schedule' : 'Deploy Recurring Rule'}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3]"><X size={15} /></button>
        </div>

        <div className="flex rounded-xl overflow-hidden mb-5 border border-[rgba(201,208,218,0.15)] bg-[#090B10]/80 p-1 text-xs">
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="flex-1 py-2 font-bold uppercase tracking-wider rounded-lg transition-all"
              style={{
                background: type === t ? (t === 'income' ? '#83B8FF' : '#D9A46C') : 'transparent',
                color: type === t ? '#090B10' : '#929BA8',
              }}
            >
              {t === 'income' ? '↑ Inflow Schedule' : '↓ Outflow Schedule'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Rule Title</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input text-sm text-[#F5F7F3]" placeholder="e.g. AWS Infrastructure, Spotify, Lease" />
            {errors.name && <p className="text-xs mt-1 text-[#FF5C5C]">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#83B8FF]">₹</span>
              <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} className="input pl-8 text-base font-bold text-[#F5F7F3]" placeholder="0" />
            </div>
            {errors.amount && <p className="text-xs mt-1 text-[#FF5C5C]">{errors.amount}</p>}
          </div>
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)} className="input text-xs text-[#F5F7F3] bg-[#101722]">
              {cats.map(c => <option key={c} value={c} className="bg-[#101722]">{CATEGORY_META[c].emoji} {CATEGORY_META[c].label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Frequency Cycle</label>
            <div className="flex gap-2">
              {(['weekly', 'monthly', 'yearly'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className="flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase border"
                  style={{
                    background: frequency === f ? '#83B8FF' : '#101722',
                    color: frequency === f ? '#090B10' : '#929BA8',
                    borderColor: frequency === f ? '#83B8FF' : 'rgba(201,208,218,0.15)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Next Execution Date</label>
            <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} className="input text-sm text-[#F5F7F3]" />
          </div>
          <div>
            <label className="label">Telemetry Notes (optional)</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="input text-sm text-[#F5F7F3]" placeholder="Reference ID or billing cycle" />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-2">
          <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1">{initial ? 'Update Rule' : 'Deploy Rule'}</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────
function CalendarView({ payments }: { payments: RecurringPayment[] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();

  const getPaymentsForDay = (day: Date) => {
    return payments.filter(p => {
      const next = new Date(p.nextDate);
      return isSameDay(next, day);
    });
  };

  return (
    <div className="card p-5 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-[rgba(201,208,218,0.1)] pb-3">
        <div>
          <span className="text-[10px] tracking-widest text-[#83B8FF] uppercase font-bold">[ MATRIX ]</span>
          <h3 className="font-bold text-sm text-[#F5F7F3]">Schedule Matrix</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewDate(addMonths(viewDate, -1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3] bg-[#101722] border border-[rgba(201,208,218,0.15)]"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-xs font-bold text-[#F5F7F3] min-w-[110px] text-center uppercase">
            {format(viewDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3] bg-[#101722] border border-[rgba(201,208,218,0.15)]"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold py-1 text-[#929BA8] uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startDay }, (_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const dayPayments = getPaymentsForDay(day);
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className="relative min-h-[46px] flex flex-col items-center justify-between rounded-xl p-1.5 transition-all border"
              style={{
                background: today ? 'rgba(131,184,255,0.15)' : dayPayments.length > 0 ? 'rgba(217,164,108,0.08)' : '#090B10',
                borderColor: today ? '#83B8FF' : dayPayments.length > 0 ? 'rgba(217,164,108,0.3)' : 'rgba(201,208,218,0.08)',
              }}
            >
              <span className="text-[11px] font-bold" style={{ color: today ? '#83B8FF' : '#E2E5EA' }}>{format(day, 'd')}</span>
              <div className="flex gap-1">
                {dayPayments.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: p.type === 'income' ? '#83B8FF' : '#D9A46C',
                      boxShadow: p.type === 'income' ? '0 0 6px #83B8FF' : '0 0 6px #D9A46C',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-5 justify-center text-[10px] text-[#929BA8]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#D9A46C] shadow-[0_0_6px_#D9A46C]" /> Outflow Due
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#83B8FF] shadow-[0_0_6px_#83B8FF]" /> Inflow Due
        </div>
      </div>
    </div>
  );
}

// ─── Calendar Page ─────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { t } = useTranslation();
  const { recurringPayments, addRecurringPayment, updateRecurringPayment, deleteRecurringPayment, toggleRecurringPayment } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<RecurringPayment | null>(null);

  const totalMonthlyExpenses = recurringPayments.filter(r => r.isActive && r.type === 'expense' && r.frequency === 'monthly').reduce((s, r) => s + r.amountPaise, 0);
  const totalMonthlyIncome = recurringPayments.filter(r => r.isActive && r.type === 'income' && r.frequency === 'monthly').reduce((s, r) => s + r.amountPaise, 0);
  const netMonthlyRecurring = totalMonthlyIncome - totalMonthlyExpenses;

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Ticking Clockwork Conduit Animation ── */}
      <PageFinancialHero
        variant="calendar"
        tag="AUTOMATION INFRASTRUCTURE // CRON MATRIX"
        title={t('calendar')}
        subtitle="Cron schedules and recurring financial commitments. Monitor automated salaries, subscription leaks, and critical debt service milestones."
        metricLabel="MONTHLY RECURRING NET"
        metricValue={formatCurrency(netMonthlyRecurring)}
        metricSub={`${recurringPayments.filter(r => r.isActive).length} ACTIVE RULES`}
        accentColor="#83B8FF"
        actionButton={
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm flex items-center gap-1.5 font-mono">
            <Plus size={14} /> <span>Deploy Rule</span>
          </button>
        }
      />

      {/* Summary HUD */}
      <div className="grid grid-cols-2 gap-4 font-mono">
        <div className="card p-5 group hover:border-[#D9A46C]/40 transition-colors">
          <p className="text-label-upper mb-1">MONTHLY SCHEDULED BURN</p>
          <p className="text-2xl font-bold text-[#D9A46C]">{formatCurrency(totalMonthlyExpenses)}</p>
          <p className="text-[11px] text-[#929BA8] mt-1">Recurring outflows per month</p>
        </div>
        <div className="card p-5 group hover:border-[#83B8FF]/40 transition-colors">
          <p className="text-label-upper mb-1">MONTHLY SCHEDULED INFLOW</p>
          <p className="text-2xl font-bold text-[#83B8FF]">{formatCurrency(totalMonthlyIncome)}</p>
          <p className="text-[11px] text-[#929BA8] mt-1">Recurring inflows per month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recurring list */}
        <div>
          <p className="text-label-upper mb-3">SCHEDULED COMMITMENTS</p>
          <div className="space-y-2.5">
            {recurringPayments.length === 0 ? (
              <div className="card py-16 text-center font-mono">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-sm font-bold text-[#F5F7F3] mb-1">Zero Automated Commitments</p>
                <p className="text-xs text-[#929BA8]">Deploy subscriptions, salaries, rent or utility pipelines</p>
              </div>
            ) : recurringPayments.map(r => {
              const isIncome = r.type === 'income';
              return (
                <motion.div
                  key={r.id}
                  layout
                  className="card p-4 flex items-center gap-3.5 group hover:border-[#C9D0DA]/40 transition-colors font-mono"
                  style={{ opacity: r.isActive ? 1 : 0.5 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
                    style={{
                      background: isIncome ? 'rgba(131,184,255,0.12)' : 'rgba(217,164,108,0.12)',
                      borderColor: isIncome ? 'rgba(131,184,255,0.25)' : 'rgba(217,164,108,0.25)',
                    }}
                  >
                    {CATEGORY_META[r.category]?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#F5F7F3] truncate">{r.name}</p>
                    <p className="text-[10px] text-[#929BA8] truncate mt-0.5">
                      {format(new Date(r.nextDate), 'dd MMM yyyy')} · {r.frequency.toUpperCase()} {!r.isActive && '· [PAUSED]'}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold flex-shrink-0"
                    style={{ color: isIncome ? '#83B8FF' : '#D9A46C' }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(r.amountPaise, true)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleRecurringPayment(r.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-[#929BA8] hover:text-[#83B8FF] hover:bg-[#101722]"
                    >
                      {r.isActive ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={() => setEditItem(r)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#83B8FF] hover:bg-[#101722]"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => { deleteRecurringPayment(r.id); toast.success('Rule removed'); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#FF5C5C] hover:bg-[#201012]"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Calendar Matrix */}
        <CalendarView payments={recurringPayments} />
      </div>

      <AnimatePresence>
        {showForm && <RecurringForm onSubmit={d => { addRecurringPayment(d); setShowForm(false); toast.success('Recurring pipeline active'); }} onClose={() => setShowForm(false)} />}
        {editItem && <RecurringForm initial={editItem} onSubmit={d => { updateRecurringPayment(editItem.id, d); setEditItem(null); toast.success('Schedule updated'); }} onClose={() => setEditItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
