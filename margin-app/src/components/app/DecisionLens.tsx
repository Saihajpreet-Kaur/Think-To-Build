'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight, CheckCircle, Clock, SkipForward, Plus, Layers, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import {
  getTotalIncome, getTotalExpenses, getMargin, getExpensesByCategory,
  formatCurrency
} from '@/lib/calculations';
import { CATEGORY_META, EXPENSE_CATEGORIES, type Category } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import PageFinancialHero from '@/components/core/PageFinancialHero';
import { useTranslation } from '@/lib/i18n';

type Scenario = 'buy_now' | 'wait' | 'skip';

export default function DecisionLens() {
  const { t } = useTranslation();
  const { transactions, budgets, goals, plannedPurchases, selectedMonth, addTransaction, addPlannedPurchase } = useStore();

  const [purchaseName, setPurchaseName] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseCategory, setPurchaseCategory] = useState<Category>('shopping');
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || '');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('wait');
  const [showResult, setShowResult] = useState(false);
  const [emiMonths, setEmiMonths] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const income = getTotalIncome(transactions, selectedMonth);
  const expenses = getTotalExpenses(transactions, selectedMonth);
  const currentMargin = getMargin(transactions, selectedMonth);
  const categorySpend = getExpensesByCategory(transactions, selectedMonth);

  const amountPaise = Math.round(parseFloat(purchaseAmount || '0') * 100);
  const monthlyEmiPaise = Math.round(amountPaise / emiMonths);
  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  // Budget impact
  const relevantBudget = budgets.find(b => b.category === purchaseCategory && b.month === selectedMonth);
  const currentCatSpend = categorySpend[purchaseCategory] || 0;
  const newCatSpend = currentCatSpend + (emiMonths === 1 ? amountPaise : monthlyEmiPaise);
  const budgetPct = relevantBudget ? (newCatSpend / relevantBudget.limitPaise * 100) : null;

  // Goal delay estimate
  const goalImpact = selectedGoal ? (() => {
    if (selectedGoal.contributions.length < 2) return '1-2 months buffer';
    const recentContribs = selectedGoal.contributions.slice(-3);
    const avgMonthly = recentContribs.reduce((s, c) => s + c.amountPaise, 0) / recentContribs.length;
    if (avgMonthly <= 0) return 'Buffer reduction';
    const extraMonths = Math.ceil(amountPaise / avgMonthly);
    return extraMonths > 0 ? `+${extraMonths} mo delay` : 'Negligible';
  })() : null;

  const marginAfter = currentMargin - (emiMonths === 1 ? amountPaise : monthlyEmiPaise);

  const scenarios = [
    {
      id: 'buy_now' as Scenario,
      title: 'Buy Outright',
      subtitle: emiMonths > 1 ? `${emiMonths} Monthly Installments` : 'Immediate capital deduction',
      icon: <CheckCircle size={18} />,
      color: '#D9A46C',
      balanceAfter: marginAfter,
      goalDelay: goalImpact || 'Negligible impact',
      budgetImpact: budgetPct !== null ? `${budgetPct.toFixed(0)}% of ${CATEGORY_META[purchaseCategory]?.label} threshold` : 'No budget configured',
    },
    {
      id: 'wait' as Scenario,
      title: 'Save 30 Days',
      subtitle: 'Absorb in next monthly allocation',
      icon: <Clock size={18} />,
      color: '#83B8FF',
      balanceAfter: currentMargin,
      goalDelay: 'Zero timeline disruption',
      budgetImpact: 'Zero budget penalty this month',
    },
    {
      id: 'skip' as Scenario,
      title: 'Direct to Vault',
      subtitle: 'Transfer capital to long-term wealth',
      icon: <SkipForward size={18} />,
      color: '#B9F36A',
      balanceAfter: currentMargin,
      goalDelay: selectedGoal ? `+${formatCurrency(amountPaise, true)} to ${selectedGoal.name}` : `+${formatCurrency(amountPaise, true)} preserved`,
      budgetImpact: 'Margin completely preserved',
    },
  ];

  const handleAnalyse = () => {
    const errs: Record<string, string> = {};
    if (!purchaseName.trim()) errs.name = 'Purchase designation is required';
    const amt = parseFloat(purchaseAmount);
    if (!amt || amt <= 0) errs.amount = 'Enter a valid positive number';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setShowResult(true);
  };

  const handleSaveAsTransaction = () => {
    if (!purchaseName.trim() || amountPaise <= 0) return;
    addTransaction({
      type: 'expense',
      amountPaise: emiMonths === 1 ? amountPaise : monthlyEmiPaise,
      category: purchaseCategory,
      merchant: purchaseName.trim(),
      description: emiMonths > 1 ? `Installment 1/${emiMonths} (Simulated via Decision Lens)` : 'Simulated via Decision Lens',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
    toast.success(`Executed ${formatCurrency(emiMonths === 1 ? amountPaise : monthlyEmiPaise)} expense`);
  };

  const handleSavePlan = () => {
    if (!purchaseName.trim() || amountPaise <= 0) return;
    addPlannedPurchase({
      name: purchaseName.trim(),
      amountPaise,
      category: purchaseCategory,
      scenario: selectedScenario,
      notes: `${emiMonths > 1 ? `${emiMonths} Mo EMI · ` : ''}Scenario: ${selectedScenario}`,
    });
    toast.success(`Saved "${purchaseName}" to planned vault`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto space-y-6 font-mono">
      
      {/* ── Page Financial Hero with Consequence Beam Simulation Animation ── */}
      <PageFinancialHero
        variant="decision"
        tag="DECISION ENGINE // SIMULATOR"
        title={t('decision')}
        subtitle="Before you spend, simulate the reality. Test how an impulse purchase alters your margin, delays your savings targets, and shifts your runway."
        metricLabel={t('available_margin')}
        metricValue={formatCurrency(currentMargin)}
        metricSub="BASELINE CAPITAL BUFFER"
        accentColor="#D9A46C"
      />

      {/* Financial Snapshot */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <span className="text-[10px] text-[#929BA8] uppercase block">INFLOW</span>
          <span className="text-lg font-bold text-[#83B8FF]">{formatCurrency(income, true)}</span>
          <span className="text-[10px] text-[#929BA8] block">Monthly</span>
        </div>
        <div className="card p-4 text-center">
          <span className="text-[10px] text-[#929BA8] uppercase block">OUTFLOW</span>
          <span className="text-lg font-bold text-[#D9A46C]">{formatCurrency(expenses, true)}</span>
          <span className="text-[10px] text-[#929BA8] block">Burn</span>
        </div>
        <div className="card p-4 text-center border-[#B9F36A]/30 bg-[#101722]">
          <span className="text-[10px] text-[#B9F36A] uppercase block font-bold">AVAILABLE MARGIN</span>
          <span className="text-lg font-extrabold text-[#B9F36A]">{formatCurrency(currentMargin, true)}</span>
          <span className="text-[10px] text-[#B9F36A] block">Free Capital</span>
        </div>
      </div>

      {/* Purchase Simulation Form */}
      <div className="card p-6 md:p-8">
        <span className="text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold block mb-4">
          [ 01 // SPECIFY PROPOSED CAPITAL OUTFLOW ]
        </span>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[10px] text-[#929BA8]">PRESETS:</span>
          {[
            { name: 'MacBook Pro', amount: '185000', cat: 'shopping' },
            { name: 'Flight Tickets', amount: '28000', cat: 'travel' },
            { name: 'Aeron Chair', amount: '65000', cat: 'shopping' },
            { name: 'Fine Dining Event', amount: '8500', cat: 'dining' },
          ].map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPurchaseName(p.name);
                setPurchaseAmount(p.amount);
                setPurchaseCategory(p.cat as Category);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-[rgba(201,208,218,0.18)] bg-[#090B10] text-[#D9E0DB] hover:border-[#83B8FF] hover:text-[#83B8FF] transition-colors"
            >
              {p.name} (₹{parseInt(p.amount)/1000}k)
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="label">Item / Service Designation</label>
            <input
              value={purchaseName}
              onChange={e => setPurchaseName(e.target.value)}
              className="input text-xs"
              placeholder="e.g. Sony FX3 Camera, Trip to Bali"
            />
            {errors.name && <p className="text-xs text-[#FF5C5C] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#83B8FF]">₹</span>
              <input
                type="number"
                min="1"
                value={purchaseAmount}
                onChange={e => setPurchaseAmount(e.target.value)}
                className="input pl-8 text-xs font-bold"
                placeholder="0"
              />
            </div>
            {errors.amount && <p className="text-xs text-[#FF5C5C] mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="label">Category</label>
            <select
              value={purchaseCategory}
              onChange={e => setPurchaseCategory(e.target.value as Category)}
              className="input text-xs bg-[#101722]"
            >
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c} className="bg-[#101722]">{CATEGORY_META[c].emoji} {CATEGORY_META[c].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Financing Structure</label>
            <select
              value={emiMonths}
              onChange={e => setEmiMonths(parseInt(e.target.value))}
              className="input text-xs bg-[#101722]"
            >
              <option value={1}>Full Upfront Payment (1 Month)</option>
              <option value={3}>3-Month Installment Plan (₹{Math.round(amountPaise / 300).toLocaleString('en-IN')}/mo)</option>
              <option value={6}>6-Month Installment Plan (₹{Math.round(amountPaise / 600).toLocaleString('en-IN')}/mo)</option>
              <option value={12}>12-Month Installment Plan (₹{Math.round(amountPaise / 1200).toLocaleString('en-IN')}/mo)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyse}
          className="btn btn-primary w-full py-3.5 flex items-center justify-center gap-2"
        >
          <Zap size={15} />
          <span>RUN SIMULATION MATRIX</span>
        </button>
      </div>

      {/* Simulation Results Matrix */}
      <AnimatePresence>
        {showResult && amountPaise > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Visual Impact Bar */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold">
                  [ MARGIN CAPACITY IMPACT ]
                </span>
                <span className="text-xs text-[#929BA8]">
                  {emiMonths > 1 ? `Simulating ${emiMonths} Mo EMI: ${formatCurrency(monthlyEmiPaise)}/mo` : 'Upfront Outflow'}
                </span>
              </div>

              <div className="relative h-4 rounded-full overflow-hidden bg-[#090B10] border border-[rgba(201,208,218,0.2)] mb-3">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-[#83B8FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(income > 0 ? (expenses / income) * 100 : 0, 100)}%` }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-[#D9A46C]/80"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      income > 0 ? ((expenses + (emiMonths === 1 ? amountPaise : monthlyEmiPaise)) / income) * 100 : 0,
                      100
                    )}%`
                  }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                />
              </div>

              <div className="flex justify-between text-xs text-[#929BA8]">
                <span>Current Burn: {income > 0 ? ((expenses / income) * 100).toFixed(0) : 0}%</span>
                <span className="text-[#D9A46C]">
                  Burn After Purchase: {income > 0 ? (((expenses + (emiMonths === 1 ? amountPaise : monthlyEmiPaise)) / income) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>

            {/* Three Scenarios */}
            <div className="grid md:grid-cols-3 gap-5">
              {scenarios.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    selectedScenario === s.id
                      ? 'border-[#83B8FF] bg-[#101722] shadow-[0_0_30px_rgba(131,184,255,0.2)]'
                      : 'border-[rgba(201,208,218,0.15)] bg-[#090B10] hover:border-[#83B8FF]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{ background: `${s.color}20`, color: s.color, borderColor: `${s.color}40` }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#F5F7F3]">{s.title}</h4>
                      <p className="text-[10px] text-[#929BA8]">{s.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[rgba(201,208,218,0.1)] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#929BA8]">Margin After:</span>
                      <span className="font-bold" style={{ color: s.balanceAfter < 0 ? '#FF5C5C' : '#F5F7F3' }}>
                        {formatCurrency(s.balanceAfter)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#929BA8]">Vault Impact:</span>
                      <span className="text-[#B9F36A] font-semibold">{s.goalDelay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#929BA8]">Budget Status:</span>
                      <span className="text-[#83B8FF] font-semibold">{s.budgetImpact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleSaveAsTransaction}
                className="btn btn-primary flex-1 py-3"
              >
                <Plus size={15} />
                <span>Execute as Transaction</span>
              </button>
              <button
                onClick={handleSavePlan}
                className="btn btn-ghost flex-1 py-3"
              >
                <Layers size={15} />
                <span>Save to Planned Vault</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Planned Purchases List */}
      {plannedPurchases.length > 0 && (
        <div className="card p-6">
          <p className="text-[10px] tracking-[0.2em] text-[#83B8FF] uppercase font-bold mb-4">
            [ SIMULATED COMMITMENTS VAULT ]
          </p>
          <div className="space-y-2 text-xs">
            {plannedPurchases.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[rgba(201,208,218,0.12)] bg-[#101722]"
              >
                <div>
                  <p className="font-bold text-[#F5F7F3]">{p.name}</p>
                  <p className="text-[10px] text-[#929BA8]">{p.notes || p.scenario}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#83B8FF]">{formatCurrency(p.amountPaise)}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#83B8FF]/15 text-[#83B8FF] border border-[#83B8FF]/30">
                    {p.scenario}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
