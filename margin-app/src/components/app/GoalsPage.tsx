'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addMonths, differenceInDays } from 'date-fns';
import { Plus, X, Pencil, Trash2, Plus as PlusIcon, Minus, Target, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency, getGoalProgress, estimateGoalCompletion } from '@/lib/calculations';
import { type Goal } from '@/types';
import { toast } from 'sonner';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

// ─── Goal Form ────────────────────────────────────────────────────────────────
function GoalForm({ initial, onSubmit, onClose }: {
  initial?: Goal;
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [target, setTarget] = useState(initial ? (initial.targetPaise / 100).toString() : '');
  const [targetDate, setTargetDate] = useState(initial?.targetDate || '');
  const [icon, setIcon] = useState(initial?.icon || '🎯');
  const [color, setColor] = useState(initial?.color || '#83B8FF');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ICONS = ['🎯', '🏠', '💻', '✈️', '🚗', '💍', '📚', '🛡️', '🏦', '🌟', '🎸', '🏋️'];
  const COLORS = ['#83B8FF', '#A78BFA', '#D9A46C', '#B9F36A', '#C9D0DA', '#E2E5EA'];

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Vault name is required';
    if (!target || parseFloat(target) <= 0) errs.target = 'Enter a valid target amount';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ name: name.trim(), targetPaise: Math.round(parseFloat(target) * 100), targetDate: targetDate || undefined, icon, color });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-panel"
      >
        <div className="flex items-center justify-between mb-6 border-b border-[rgba(201,208,218,0.12)] pb-4">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-[#83B8FF] uppercase font-bold">
              [ VAULT // TARGET ]
            </span>
            <h2 className="text-xl font-bold text-[#F5F7F3] mt-0.5">{initial ? 'Reconfigure Vault' : 'Initialize Savings Vault'}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[#929BA8] hover:text-[#F5F7F3]"><X size={15} /></button>
        </div>

        <div className="space-y-4">
          {/* Icon picker */}
          <div>
            <label className="label">Vault Glyph</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all border"
                  style={{
                    background: icon === i ? 'rgba(131,184,255,0.2)' : '#090B10',
                    borderColor: icon === i ? '#83B8FF' : 'rgba(201,208,218,0.15)',
                    transform: icon === i ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label">Vault Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input font-mono text-sm text-[#F5F7F3]" placeholder="e.g. Runway Reserve, Real Estate, MacBook Studio" />
            {errors.name && <p className="font-mono text-xs mt-1 text-[#FF5C5C]">{errors.name}</p>}
          </div>

          {/* Target */}
          <div>
            <label className="label">Target Target (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-[#83B8FF]">₹</span>
              <input type="number" min="1" value={target} onChange={e => setTarget(e.target.value)} className="input pl-8 font-mono text-base font-bold text-[#F5F7F3]" placeholder="0" />
            </div>
            {errors.target && <p className="font-mono text-xs mt-1 text-[#FF5C5C]">{errors.target}</p>}
          </div>

          {/* Target date */}
          <div>
            <label className="label">Target Completion (optional)</label>
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="input font-mono text-sm text-[#F5F7F3]" />
          </div>

          {/* Color */}
          <div>
            <label className="label">Telemetry Hue</label>
            <div className="flex gap-2.5">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{ background: c, outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-2">
          <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1">{initial ? 'Save Parameters' : 'Deploy Vault'}</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Contribution Modal ────────────────────────────────────────────────────────
function ContributeModal({ goal, onContribute, onWithdraw, onClose }: {
  goal: Goal;
  onContribute: (amount: number, note?: string) => void;
  onWithdraw: (amount: number) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'add' | 'withdraw'>('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) { setError('Enter a valid amount'); return; }
    if (tab === 'withdraw' && n * 100 > goal.currentPaise) { setError('Cannot withdraw more than current balance'); return; }
    if (tab === 'add') onContribute(Math.round(n * 100), note || undefined);
    else onWithdraw(Math.round(n * 100));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="modal-panel max-w-sm"
      >
        <div className="flex items-center justify-between mb-5 border-b border-[rgba(201,208,218,0.12)] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{goal.icon}</span>
            <div>
              <p className="font-bold text-sm text-[#F5F7F3]">{goal.name}</p>
              <p className="font-mono text-[10px] text-[#929BA8]">BALANCE: {formatCurrency(goal.currentPaise)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#929BA8] hover:text-[#F5F7F3]"><X size={16} /></button>
        </div>

        <div className="flex rounded-xl overflow-hidden mb-5 border border-[rgba(201,208,218,0.15)] bg-[#090B10]/80 p-1 font-mono text-xs">
          {(['add', 'withdraw'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 font-bold uppercase tracking-wider rounded-lg transition-all"
              style={{
                background: tab === t ? '#83B8FF' : 'transparent',
                color: tab === t ? '#090B10' : '#929BA8',
              }}
            >
              {t === 'add' ? '+ Allocate Margin' : '− Liquidate'}
            </button>
          ))}
        </div>

        <div className="space-y-3 font-mono">
          <div>
            <label className="label">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#83B8FF]">₹</span>
              <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} className="input pl-8 font-mono text-base font-bold text-[#F5F7F3]" placeholder="0" autoFocus />
            </div>
            {error && <p className="text-xs mt-1 text-[#FF5C5C]">{error}</p>}
          </div>
          {tab === 'add' && (
            <div>
              <label className="label">Allocation Note (optional)</label>
              <input value={note} onChange={e => setNote(e.target.value)} className="input text-xs text-[#F5F7F3]" placeholder="e.g. Monthly surplus rebalance" />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5 pt-2">
          <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1">{tab === 'add' ? 'Commit Capital' : 'Withdraw'}</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────
function GoalCard({ goal, onEdit, onDelete, onContribute, onWithdraw }: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onContribute: (amount: number, note?: string) => void;
  onWithdraw: (amount: number) => void;
}) {
  const [showContribute, setShowContribute] = useState(false);
  const progress = getGoalProgress(goal);
  const estimated = estimateGoalCompletion(goal);
  const remaining = goal.targetPaise - goal.currentPaise;
  const daysLeft = goal.targetDate ? differenceInDays(new Date(goal.targetDate), new Date()) : null;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 group hover:-translate-y-1 transition-all font-mono"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border"
              style={{ background: `${goal.color}15`, borderColor: `${goal.color}35` }}
            >
              {goal.icon}
            </div>
            <div>
              <p className="font-bold text-base text-[#F5F7F3]">{goal.name}</p>
              {goal.targetDate && (
                <p className="text-[10px] mt-0.5 text-[#929BA8]">
                  {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} DAYS HORIZON` : 'TARGET OVERDUE') : format(new Date(goal.targetDate), 'MMM yyyy')}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#83B8FF] hover:bg-[#181E29]"><Pencil size={12} /></button>
            <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#929BA8] hover:text-[#FF5C5C] hover:bg-[#201012]"><Trash2 size={12} /></button>
          </div>
        </div>

        {/* Futuristic Progress Track */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#929BA8] text-[10px] tracking-wider uppercase font-semibold">RESERVE ACCUMULATION</span>
            <span className="font-bold" style={{ color: goal.color }}>{progress.toFixed(0)}%</span>
          </div>
          <div className="relative h-2 rounded-full overflow-hidden bg-[#090B10] border border-[rgba(201,208,218,0.12)]">
            <motion.div
              className="h-full rounded-full transition-all duration-700"
              style={{ background: goal.color, boxShadow: `0 0 10px ${goal.color}` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-[#F5F7F3]">{formatCurrency(goal.currentPaise)}</p>
            <p className="text-[10px] text-[#929BA8]">TARGET: {formatCurrency(goal.targetPaise)}</p>
          </div>
          {remaining > 0 ? (
            <div className="text-right">
              <p className="text-xs font-semibold text-[#D9A46C]">{formatCurrency(remaining)}</p>
              <p className="text-[10px] text-[#929BA8]">REMAINING BUFFER</p>
            </div>
          ) : (
            <span className="text-xs font-bold text-[#B9F36A]">✓ ACHIEVED</span>
          )}
        </div>

        {estimated && (
          <p className="text-[10px] mb-4 text-[#929BA8]">
            ETA ESTIMATE: <span className="text-[#F5F7F3] font-bold">{estimated}</span>
          </p>
        )}

        <button
          onClick={() => setShowContribute(true)}
          className="w-full btn btn-ghost btn-sm"
          style={{ borderColor: `${goal.color}40`, color: goal.color }}
        >
          <PlusIcon size={13} /> Allocate / Liquidate
        </button>
      </motion.div>

      <AnimatePresence>
        {showContribute && (
          <ContributeModal
            goal={goal}
            onContribute={(amount, note) => { onContribute(amount, note); setShowContribute(false); }}
            onWithdraw={(amount) => { onWithdraw(amount); setShowContribute(false); }}
            onClose={() => setShowContribute(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Goals Page ───────────────────────────────────────────────────────────────
export default function GoalsPage() {
  const { t } = useTranslation();
  const { goals, addGoal, updateGoal, deleteGoal, addGoalContribution, withdrawGoalContribution } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentPaise, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetPaise, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto space-y-6">
      
      {/* ── Page Financial Hero with Sovereign Piggy Bank & Falling Coins ── */}
      <PageFinancialHero
        variant="goals"
        tag="CAPITAL VAULTS // RESERVES & PIGGY ENGINE"
        title={t('goals')}
        subtitle="Independent capital accumulation silos. Watch specie coins accumulate in your 3D Piggy Bank as retained margin turns into lasting freedom."
        metricLabel="TOTAL CAPITAL STORED"
        metricValue={formatCurrency(totalSaved)}
        metricSub={`${totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}% OF AGGREGATE TARGET`}
        accentColor="#B9F36A"
        actionButton={
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm flex items-center gap-1.5 font-mono">
            <Plus size={14} /> <span>Deploy New Vault</span>
          </button>
        }
      />

      {/* Summary HUD */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 font-mono"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-label-upper mb-1">TOTAL CAPITAL LOCKED</p>
              <p className="text-2xl font-bold text-[#F5F7F3]">{formatCurrency(totalSaved)}</p>
            </div>
            <div>
              <p className="text-label-upper mb-1">AGGREGATE MILESTONE</p>
              <p className="text-2xl font-bold text-[#F5F7F3]">{formatCurrency(totalTarget)}</p>
            </div>
            <div>
              <p className="text-label-upper mb-1">PROGRESS</p>
              <p className="text-2xl font-bold text-[#B9F36A]">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
          <div className="mt-5 relative h-2.5 rounded-full overflow-hidden bg-[#090B10] border border-[rgba(201,208,218,0.12)]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #83B8FF, #B9F36A)' }}
              initial={{ width: 0 }}
              animate={{ width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}

      {goals.length === 0 ? (
        <div className="card py-24 text-center font-mono">
          <p className="text-5xl mb-4">🎯</p>
          <p className="font-bold text-[#F5F7F3] mb-1">No Active Vaults</p>
          <p className="text-xs text-[#929BA8] mb-6">Allocate your financial margin into dedicated wealth vaults.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mx-auto">
            <Plus size={14} /> Deploy First Vault
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => setEditGoal(goal)}
              onDelete={() => { deleteGoal(goal.id); toast.success('Vault decommissioned'); }}
              onContribute={(amount, note) => { addGoalContribution(goal.id, amount, note); toast.success(`Allocated ${formatCurrency(amount)} to ${goal.name}`); }}
              onWithdraw={(amount) => { withdrawGoalContribution(goal.id, amount); toast.success('Capital withdrawn'); }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <GoalForm
            onSubmit={data => { addGoal(data); setShowForm(false); toast.success('Vault deployed!'); }}
            onClose={() => setShowForm(false)}
          />
        )}
        {editGoal && (
          <GoalForm
            initial={editGoal}
            onSubmit={data => { updateGoal(editGoal.id, data); setEditGoal(null); toast.success('Vault reconfigured'); }}
            onClose={() => setEditGoal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
