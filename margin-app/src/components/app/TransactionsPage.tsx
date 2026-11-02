'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Plus, Search, Pencil, Trash2, Filter, X, ArrowUpDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/calculations';
import { CATEGORY_META, INCOME_CATEGORIES, EXPENSE_CATEGORIES, type Transaction, type Category, type TransactionType } from '@/types';
import { toast } from 'sonner';
import { z } from 'zod';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

const txnSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Select a category'),
  merchant: z.string().min(1, 'Merchant name is required'),
  description: z.string(),
  date: z.string().min(1, 'Date is required'),
});

// ─── Transaction Form ─────────────────────────────────────────────────────────
function TransactionForm({ initial, onSubmit, onClose }: {
  initial?: Partial<Transaction>;
  onSubmit: (data: Omit<Transaction, 'id' | 'isDemo'>) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<TransactionType>(initial?.type || 'expense');
  const [amount, setAmount] = useState(initial ? (initial.amountPaise! / 100).toString() : '');
  const [category, setCategory] = useState<Category>(initial?.category || 'dining');
  const [merchant, setMerchant] = useState(initial?.merchant || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [date, setDate] = useState(initial?.date || format(new Date(), 'yyyy-MM-dd'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = () => {
    const result = txnSchema.safeParse({ type, amount: parseFloat(amount), category, merchant, description, date });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach(e => { errs[e.path[0] as string] = e.message; });
      setErrors(errs);
      return;
    }
    onSubmit({
      type,
      amountPaise: Math.round(parseFloat(amount) * 100),
      category,
      merchant,
      description,
      date,
      recurringId: initial?.recurringId,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="modal-panel"
      >
        <div className="flex items-center justify-between mb-6 border-b border-[rgba(201,208,218,0.12)] pb-4">
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold">
              [ LEDGER // ENTRY ]
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#F5F7F3] mt-0.5">
              {initial?.id ? 'Edit Ledger Record' : 'Log Transaction'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3] hover:bg-[#181E29] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-xl overflow-hidden mb-5 border border-[rgba(201,208,218,0.15)] bg-[#090B10]/80 p-1">
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setType(t); setCategory(t === 'income' ? 'salary' : 'dining'); }}
              className="flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
              style={{
                background: type === t ? (t === 'income' ? '#83B8FF' : '#D9A46C') : 'transparent',
                color: type === t ? '#090B10' : '#929BA8',
                boxShadow: type === t ? (t === 'income' ? '0 0 15px rgba(131,184,255,0.4)' : '0 0 15px rgba(217,164,108,0.4)') : 'none',
              }}
            >
              {t === 'income' ? '↑ Inflow (Income)' : '↓ Outflow (Expense)'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="label">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-[#83B8FF]">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input pl-8 font-mono text-base font-bold text-[#F5F7F3]"
                placeholder="0.00"
                autoFocus
              />
            </div>
            {errors.amount && <p className="font-mono text-xs mt-1 text-[#FF5C5C]">{errors.amount}</p>}
          </div>

          {/* Merchant */}
          <div>
            <label className="label">Merchant / Source</label>
            <input
              type="text"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              className="input font-mono text-sm text-[#F5F7F3]"
              placeholder="e.g. Apple Inc, Whole Foods, Salary"
            />
            {errors.merchant && <p className="font-mono text-xs mt-1 text-[#FF5C5C]">{errors.merchant}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="input font-mono text-xs text-[#F5F7F3]"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-[#101722] text-[#F5F7F3]">
                  {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input font-mono text-sm text-[#F5F7F3]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input font-mono text-sm text-[#F5F7F3]"
              placeholder="Operational notes or telemetry tag"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-2">
          <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1">
            {initial?.id ? 'Save Changes' : 'Commit Record'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Transactions Page ────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const { t } = useTranslation();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, selectedMonth } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filtered = transactions
    .filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCat !== 'all' && t.category !== filterCat) return false;
      const q = search.toLowerCase();
      if (q && !t.merchant.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.amountPaise - a.amountPaise;
    });

  const totalExpensePaise = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amountPaise, 0);

  const handleAdd = (data: Omit<Transaction, 'id' | 'isDemo'>) => {
    addTransaction(data);
    setShowForm(false);
    toast.success('Transaction logged to ledger');
  };

  const handleUpdate = (data: Omit<Transaction, 'id' | 'isDemo'>) => {
    if (!editTxn) return;
    updateTransaction(editTxn.id, data);
    setEditTxn(null);
    toast.success('Transaction updated');
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success('Transaction removed');
  };

  // Export CSV
  const exportCSV = () => {
    const rows = [['Date', 'Type', 'Merchant', 'Category', 'Amount', 'Description']];
    filtered.forEach(t => {
      rows.push([t.date, t.type, t.merchant, CATEGORY_META[t.category].label, (t.amountPaise / 100).toFixed(2), t.description]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'margin-transactions.csv'; a.click();
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Banknotes & Kinetic Conduit Animation ── */}
      <PageFinancialHero
        variant="transactions"
        tag="FINANCIAL INFRASTRUCTURE // LEDGER"
        title={t('transactions')}
        subtitle="Chronological verified double-entry telemetry stream. Filter, audit, and inspect capital inflows and burns with zero cloud exposure."
        metricLabel={t('gross_outflow')}
        metricValue={formatCurrency(totalExpensePaise)}
        metricSub={`${filtered.length} VERIFIED EVENTS`}
        accentColor="#D9A46C"
        actionButton={
          <div className="flex items-center gap-2.5">
            <button onClick={exportCSV} className="btn btn-ghost btn-sm">
              Export CSV
            </button>
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Plus size={14} /> <span>{t('record_txn')}</span>
            </button>
          </div>
        }
      />

      {/* Filters HUD */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929BA8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 pr-4 h-9 w-52 text-xs"
            placeholder="Filter records..."
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as any)}
          className="input h-9 text-xs w-auto bg-[#101722]"
        >
          <option value="all">ALL STREAMS</option>
          <option value="income">INFLOW ONLY</option>
          <option value="expense">OUTFLOW ONLY</option>
        </select>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value as any)}
          className="input h-9 text-xs w-auto bg-[#101722]"
        >
          <option value="all">ALL CATEGORIES</option>
          {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map(c => (
            <option key={c} value={c}>{CATEGORY_META[c].label}</option>
          ))}
        </select>
        <button
          onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
          className="btn btn-ghost btn-sm"
        >
          <ArrowUpDown size={13} /> <span>Sort: {sortBy === 'date' ? 'Date' : 'Amount'}</span>
        </button>
      </div>

      {/* Transaction list */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-24 text-center font-mono">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-bold text-[#F5F7F3] mb-1">No Transactions Found</p>
            <p className="text-xs text-[#929BA8]">Try adjusting your search criteria or record a new financial event</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(201,208,218,0.08)]">
            {filtered.map((t, i) => {
              const isIncome = t.type === 'income';
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#181E29]/70 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
                    style={{
                      background: isIncome ? 'rgba(131,184,255,0.12)' : 'rgba(217,164,108,0.12)',
                      borderColor: isIncome ? 'rgba(131,184,255,0.25)' : 'rgba(217,164,108,0.25)',
                    }}
                  >
                    {CATEGORY_META[t.category]?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#F5F7F3] truncate">{t.merchant}</p>
                      {t.isDemo && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[rgba(201,208,218,0.1)] text-[#929BA8] border border-[rgba(201,208,218,0.15)]">
                          DEMO
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-[#929BA8] truncate mt-0.5">
                      {format(new Date(t.date), 'dd MMM yyyy')} · {CATEGORY_META[t.category]?.label}
                      {t.description && ` · ${t.description}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-mono text-sm font-bold"
                      style={{ color: isIncome ? '#83B8FF' : '#E2E5EA' }}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(t.amountPaise)}
                    </p>
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase font-semibold block"
                      style={{ color: isIncome ? '#83B8FF' : '#D9A46C' }}
                    >
                      {isIncome ? 'INFLOW' : 'OUTFLOW'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={() => setEditTxn(t)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#83B8FF] hover:bg-[#101722] transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#FF5C5C] hover:bg-[#201012] transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showForm && <TransactionForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />}
        {editTxn && <TransactionForm initial={editTxn} onSubmit={handleUpdate} onClose={() => setEditTxn(null)} />}
      </AnimatePresence>
    </div>
  );
}
