'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, subMonths, addMonths } from 'date-fns';
import { Plus, X, Pencil, Trash2, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store';
import { getBudgetUsage, formatCurrency, getMonthLabel } from '@/lib/calculations';
import { CATEGORY_META, EXPENSE_CATEGORIES, type Category, type Budget } from '@/types';
import { toast } from 'sonner';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

// ─── Budget Form Modal ────────────────────────────────────────────────────────
function BudgetForm({ month, initial, onSubmit, onClose, existingCategories }: {
  month: string;
  initial?: Budget;
  onSubmit: (data: { category: Category; limitPaise: number; month: string }) => void;
  onClose: () => void;
  existingCategories: Category[];
}) {
  const [category, setCategory] = useState<Category>(initial?.category || 'dining');
  const [limit, setLimit] = useState(initial ? (initial.limitPaise / 100).toString() : '');
  const [error, setError] = useState('');

  const available = EXPENSE_CATEGORIES.filter(c => !existingCategories.includes(c) || c === initial?.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) {
      setError('Please specify a positive monthly limit');
      return;
    }
    onSubmit({ category, limitPaise: Math.round(parseFloat(limit) * 100), month });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22 }}
        className="modal-panel max-w-sm"
      >
        <div className="flex items-center justify-between mb-5 border-b border-[rgba(201,208,218,0.12)] pb-3">
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold">
              [ THRESHOLD // LIMIT ]
            </span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#F5F7F3] mt-0.5">
              {initial ? 'Configure Budget' : 'Deploy Category Threshold'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#929BA8] hover:text-[#F5F7F3]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="input font-mono text-xs text-[#F5F7F3] bg-[#101722]"
              disabled={!!initial}
            >
              {available.map(c => (
                <option key={c} value={c} className="bg-[#101722] text-[#F5F7F3]">
                  {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Monthly Upper Bound (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-[#83B8FF]">₹</span>
              <input
                type="number"
                min="1"
                required
                value={limit}
                onChange={e => setLimit(e.target.value)}
                className="input pl-8 font-mono text-base font-bold text-[#F5F7F3]"
                placeholder="0"
                autoFocus
              />
            </div>
            {error && <p className="font-mono text-xs text-[#FF5C5C] mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {initial ? 'Save Limit' : 'Deploy Threshold'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Budget HUD Card ──────────────────────────────────────────────────────────
function BudgetCard({
  budget, spentPaise, percentUsed, status, onEdit, onDelete
}: {
  budget: Budget; spentPaise: number; percentUsed: number;
  status: 'ok' | 'warning' | 'danger' | 'over';
  onEdit: () => void; onDelete: () => void;
}) {
  const meta = CATEGORY_META[budget.category];
  const barColor =
    status === 'over'
      ? '#FF5C5C'
      : status === 'danger'
      ? '#D9A46C' // Champagne warning
      : status === 'warning'
      ? '#83B8FF' // Ice blue attention
      : '#B9F36A'; // Restrained Electric Lime for healthy balance

  const remaining = budget.limitPaise - spentPaise;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 group hover:border-[#C9D0DA]/40 transition-all font-mono"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-[#181E29] border border-[rgba(201,208,218,0.18)]">
            {meta.emoji}
          </div>
          <div>
            <p className="font-bold text-sm text-[#F5F7F3]">{meta.label}</p>
            <p className="text-[10px] text-[#929BA8] mt-0.5">
              {status === 'over'
                ? '🚨 DEFICIT EXCEEDED'
                : status === 'danger'
                ? '⚠️ NEAR CAPACITY'
                : remaining > 0
                ? `₹${(remaining / 100).toLocaleString('en-IN')} BUFFER`
                : 'EXHAUSTED'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#83B8FF] hover:bg-[#181E29]"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#FF5C5C] hover:bg-[#201012]"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Futuristic Progress Track */}
      <div className="relative h-2 rounded-full overflow-hidden bg-[#090B10] border border-[rgba(201,208,218,0.14)] mb-3">
        <motion.div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(percentUsed, 100)}%`,
            background: barColor,
            boxShadow: `0 0 10px ${barColor}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-bold" style={{ color: status === 'over' ? '#FF5C5C' : '#F5F7F3' }}>
          {formatCurrency(spentPaise)}
        </span>
        <span className="text-[#929BA8] text-[10px]">OF {formatCurrency(budget.limitPaise)}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: `${barColor}18`,
            color: barColor,
            border: `1px solid ${barColor}40`,
          }}
        >
          {percentUsed.toFixed(0)}%
        </span>
      </div>
    </motion.div>
  );
}

// ─── Budgets Page ─────────────────────────────────────────────────────────────
export default function BudgetsPage() {
  const { t } = useTranslation();
  const { budgets, transactions, addBudget, updateBudget, deleteBudget, selectedMonth, setSelectedMonth } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);

  const usage = getBudgetUsage(budgets, transactions, selectedMonth);
  const existingCats = budgets.filter(b => b.month === selectedMonth).map(b => b.category);

  const navigateMonth = (dir: 'prev' | 'next') => {
    const d = new Date(selectedMonth + '-01');
    setSelectedMonth(format(dir === 'prev' ? subMonths(d, 1) : addMonths(d, 1), 'yyyy-MM'));
  };

  const handleAdd = (data: { category: Category; limitPaise: number; month: string }) => {
    addBudget(data);
    setShowForm(false);
    toast.success('Deployed new category threshold');
  };

  const handleUpdate = (data: { category: Category; limitPaise: number; month: string }) => {
    if (!editBudget) return;
    updateBudget(editBudget.id, { limitPaise: data.limitPaise });
    setEditBudget(null);
    toast.success('Updated threshold parameters');
  };

  const over = usage.filter(u => u.status === 'over').length;
  const danger = usage.filter(u => u.status === 'danger').length;
  const totalLimitPaise = usage.reduce((sum, u) => sum + u.budget.limitPaise, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Shield Micro-Animation ── */}
      <PageFinancialHero
        variant="budgets"
        tag="CAPITAL PROTECTION // SHIELD"
        title={t('budgets')}
        subtitle="Active category thresholds and burn velocity fences. Prevent capital dissipation before it erodes your sovereign margin."
        metricLabel="TOTAL THRESHOLD BOUND"
        metricValue={formatCurrency(totalLimitPaise)}
        metricSub={`${usage.length} ACTIVE LIMITS ${over > 0 ? `· ${over} DEFICITS` : '· BUFFER SECURED'}`}
        accentColor="#83B8FF"
        actionButton={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#101722] border border-[rgba(201,208,218,0.18)] rounded-xl p-1 font-mono text-xs">
              <button
                onClick={() => navigateMonth('prev')}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3]"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-bold text-[#F5F7F3] min-w-[90px] text-center uppercase">
                {getMonthLabel(selectedMonth)}
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3]"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Plus size={14} /> <span>Deploy Threshold</span>
            </button>
          </div>
        }
      />

      {/* Status Alerts */}
      {(over > 0 || danger > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-start gap-3 font-mono text-xs ${
            over > 0
              ? 'border-[#FF5C5C]/40 bg-[#1A0C0E] text-[#FF5C5C]'
              : 'border-[#D9A46C]/40 bg-[#1C160F] text-[#D9A46C]'
          }`}
        >
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {over > 0 ? `${over} Category budget${over > 1 ? 's' : ''} exceeded this cycle!` : `${danger} Budget${danger > 1 ? 's' : ''} nearing capacity`}
            </p>
            <p className="text-[#929BA8] text-[11px] mt-0.5">
              Review outflows to preserve available margin for savings vaults.
            </p>
          </div>
        </motion.div>
      )}

      {/* Budget Grid */}
      {usage.length === 0 ? (
        <div className="card py-24 text-center">
          <p className="text-5xl mb-4">🛡️</p>
          <p className="font-mono text-base font-bold text-[#F5F7F3] mb-1">Zero Budgets Initialized</p>
          <p className="font-mono text-xs text-[#929BA8] mb-6">Deploy category limits to protect your financial runway.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mx-auto">
            <Plus size={14} /> Deploy First Budget
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {usage.map(u => (
            <BudgetCard
              key={u.budget.id}
              budget={u.budget}
              spentPaise={u.spentPaise}
              percentUsed={u.percentUsed}
              status={u.status}
              onEdit={() => setEditBudget(u.budget)}
              onDelete={() => {
                deleteBudget(u.budget.id);
                toast.success('Budget decommissioned');
              }}
            />
          ))}

          {/* Add Budget Ghost Card */}
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl border-2 border-dashed border-[rgba(201,208,218,0.18)] bg-[#090B10]/60 flex flex-col items-center justify-center gap-2 py-12 transition-all hover:border-[#83B8FF] hover:bg-[#101722] text-[#929BA8] hover:text-[#83B8FF] font-mono text-xs font-bold uppercase tracking-wider"
            style={{ minHeight: 160 }}
          >
            <Plus size={22} className="text-[#83B8FF]" />
            <span>Deploy New Target</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <BudgetForm
            month={selectedMonth}
            existingCategories={existingCats}
            onSubmit={handleAdd}
            onClose={() => setShowForm(false)}
          />
        )}
        {editBudget && (
          <BudgetForm
            month={selectedMonth}
            initial={editBudget}
            existingCategories={existingCats}
            onSubmit={handleUpdate}
            onClose={() => setEditBudget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
