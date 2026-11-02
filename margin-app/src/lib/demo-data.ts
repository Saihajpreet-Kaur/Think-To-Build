import { format, subDays, addDays, addMonths, subMonths } from 'date-fns';
import { rupeesToPaise } from '@/lib/calculations';
import type { Transaction, Budget, Goal, RecurringPayment, Category } from '@/types';

const today = new Date();
const thisMonth = format(today, 'yyyy-MM');
const lastMonth = format(subMonths(today, 1), 'yyyy-MM');
const twoMonthsAgo = format(subMonths(today, 2), 'yyyy-MM');

function d(daysOffset: number): string {
  return format(addDays(today, daysOffset), 'yyyy-MM-dd');
}

function md(month: string, day: number): string {
  return `${month}-${String(day).padStart(2, '0')}`;
}

export const demoTransactions: Transaction[] = [
  // ── This Month – Income ───────────────────────────────────────────────
  { id: 'demo-t1', type: 'income', amountPaise: rupeesToPaise(95000), category: 'salary', merchant: 'Infosys Ltd.', description: 'Monthly salary – October', date: md(thisMonth, 1), isDemo: true },
  { id: 'demo-t2', type: 'income', amountPaise: rupeesToPaise(18500), category: 'freelance', merchant: 'Toptal Client', description: 'Design contract – Q3 deliverable', date: md(thisMonth, 5), isDemo: true },
  { id: 'demo-t3', type: 'income', amountPaise: rupeesToPaise(3200), category: 'investment', merchant: 'Zerodha', description: 'Dividend – HDFC Balanced Fund', date: md(thisMonth, 8), isDemo: true },

  // ── This Month – Expenses ─────────────────────────────────────────────
  { id: 'demo-t4', type: 'expense', amountPaise: rupeesToPaise(22000), category: 'housing', merchant: 'Landlord – Anand Mehta', description: 'Monthly rent – 2BHK HSR Layout', date: md(thisMonth, 2), isDemo: true },
  { id: 'demo-t5', type: 'expense', amountPaise: rupeesToPaise(4800), category: 'food', merchant: 'BigBasket', description: 'Monthly grocery order', date: md(thisMonth, 4), isDemo: true },
  { id: 'demo-t6', type: 'expense', amountPaise: rupeesToPaise(2100), category: 'dining', merchant: 'Social – Koramangala', description: 'Team dinner', date: md(thisMonth, 6), isDemo: true },
  { id: 'demo-t7', type: 'expense', amountPaise: rupeesToPaise(1200), category: 'transport', merchant: 'Ola', description: 'Office commute', date: md(thisMonth, 7), isDemo: true },
  { id: 'demo-t8', type: 'expense', amountPaise: rupeesToPaise(899), category: 'subscriptions', merchant: 'Netflix India', description: 'Premium plan', date: md(thisMonth, 8), isDemo: true },
  { id: 'demo-t9', type: 'expense', amountPaise: rupeesToPaise(219), category: 'subscriptions', merchant: 'Spotify', description: 'Music subscription', date: md(thisMonth, 8), isDemo: true },
  { id: 'demo-t10', type: 'expense', amountPaise: rupeesToPaise(3500), category: 'shopping', merchant: 'H&M', description: 'Winter wardrobe', date: md(thisMonth, 10), isDemo: true },
  { id: 'demo-t11', type: 'expense', amountPaise: rupeesToPaise(1400), category: 'health', merchant: 'Apollo Pharmacy', description: 'Vitamins and medicines', date: md(thisMonth, 12), isDemo: true },
  { id: 'demo-t12', type: 'expense', amountPaise: rupeesToPaise(650), category: 'utilities', merchant: 'BESCOM', description: 'Electricity bill', date: md(thisMonth, 13), isDemo: true },
  { id: 'demo-t13', type: 'expense', amountPaise: rupeesToPaise(499), category: 'utilities', merchant: 'Airtel', description: 'Broadband internet', date: md(thisMonth, 14), isDemo: true },
  { id: 'demo-t14', type: 'expense', amountPaise: rupeesToPaise(2800), category: 'dining', merchant: 'Truffles', description: 'Birthday celebration dinner', date: md(thisMonth, 16), isDemo: true },
  { id: 'demo-t15', type: 'expense', amountPaise: rupeesToPaise(800), category: 'food', merchant: 'Swiggy', description: 'Groceries delivery', date: md(thisMonth, 18), isDemo: true },
  { id: 'demo-t16', type: 'expense', amountPaise: rupeesToPaise(1599), category: 'entertainment', merchant: 'BookMyShow', description: 'Movie tickets × 2', date: md(thisMonth, 20), isDemo: true },
  { id: 'demo-t17', type: 'expense', amountPaise: rupeesToPaise(5000), category: 'savings', merchant: 'Mutual Fund', description: 'SIP – Mirae Asset', date: md(thisMonth, 21), isDemo: true },
  { id: 'demo-t18', type: 'expense', amountPaise: rupeesToPaise(349), category: 'subscriptions', merchant: 'Notion', description: 'Pro plan', date: md(thisMonth, 22), isDemo: true },

  // ── Last Month ────────────────────────────────────────────────────────
  { id: 'demo-lt1', type: 'income', amountPaise: rupeesToPaise(95000), category: 'salary', merchant: 'Infosys Ltd.', description: 'Monthly salary – September', date: md(lastMonth, 1), isDemo: true },
  { id: 'demo-lt2', type: 'income', amountPaise: rupeesToPaise(12000), category: 'freelance', merchant: 'Toptal Client', description: 'UI mockups delivery', date: md(lastMonth, 10), isDemo: true },
  { id: 'demo-lt3', type: 'expense', amountPaise: rupeesToPaise(22000), category: 'housing', merchant: 'Landlord – Anand Mehta', description: 'Monthly rent', date: md(lastMonth, 2), isDemo: true },
  { id: 'demo-lt4', type: 'expense', amountPaise: rupeesToPaise(5200), category: 'food', merchant: 'BigBasket', description: 'Monthly groceries', date: md(lastMonth, 4), isDemo: true },
  { id: 'demo-lt5', type: 'expense', amountPaise: rupeesToPaise(1800), category: 'dining', merchant: 'Fatty Bao', description: 'Lunch with team', date: md(lastMonth, 8), isDemo: true },
  { id: 'demo-lt6', type: 'expense', amountPaise: rupeesToPaise(6500), category: 'shopping', merchant: 'Amazon India', description: 'Electronics – keyboard', date: md(lastMonth, 12), isDemo: true },
  { id: 'demo-lt7', type: 'expense', amountPaise: rupeesToPaise(899), category: 'subscriptions', merchant: 'Netflix India', description: 'Premium plan', date: md(lastMonth, 8), isDemo: true },
  { id: 'demo-lt8', type: 'expense', amountPaise: rupeesToPaise(219), category: 'subscriptions', merchant: 'Spotify', description: 'Music subscription', date: md(lastMonth, 8), isDemo: true },
  { id: 'demo-lt9', type: 'expense', amountPaise: rupeesToPaise(1200), category: 'transport', merchant: 'Ola', description: 'Weekend rides', date: md(lastMonth, 15), isDemo: true },
  { id: 'demo-lt10', type: 'expense', amountPaise: rupeesToPaise(5000), category: 'savings', merchant: 'Mutual Fund', description: 'SIP – Mirae Asset', date: md(lastMonth, 21), isDemo: true },
  { id: 'demo-lt11', type: 'expense', amountPaise: rupeesToPaise(2500), category: 'entertainment', merchant: 'INOX', description: 'Movie marathon', date: md(lastMonth, 25), isDemo: true },

  // ── Two Months Ago ────────────────────────────────────────────────────
  { id: 'demo-2m1', type: 'income', amountPaise: rupeesToPaise(95000), category: 'salary', merchant: 'Infosys Ltd.', description: 'Monthly salary – August', date: md(twoMonthsAgo, 1), isDemo: true },
  { id: 'demo-2m2', type: 'expense', amountPaise: rupeesToPaise(22000), category: 'housing', merchant: 'Landlord – Anand Mehta', description: 'Monthly rent', date: md(twoMonthsAgo, 2), isDemo: true },
  { id: 'demo-2m3', type: 'expense', amountPaise: rupeesToPaise(4600), category: 'food', merchant: 'BigBasket', description: 'Monthly groceries', date: md(twoMonthsAgo, 5), isDemo: true },
  { id: 'demo-2m4', type: 'expense', amountPaise: rupeesToPaise(8000), category: 'travel', merchant: 'IndiGo', description: 'Goa trip – flights', date: md(twoMonthsAgo, 10), isDemo: true },
  { id: 'demo-2m5', type: 'expense', amountPaise: rupeesToPaise(12000), category: 'travel', merchant: 'GoStays', description: 'Goa hotel – 3 nights', date: md(twoMonthsAgo, 12), isDemo: true },
  { id: 'demo-2m6', type: 'expense', amountPaise: rupeesToPaise(899), category: 'subscriptions', merchant: 'Netflix India', description: 'Premium plan', date: md(twoMonthsAgo, 8), isDemo: true },
  { id: 'demo-2m7', type: 'expense', amountPaise: rupeesToPaise(5000), category: 'savings', merchant: 'Mutual Fund', description: 'SIP – Mirae Asset', date: md(twoMonthsAgo, 21), isDemo: true },
];

export const demoBudgets: Budget[] = [
  { id: 'demo-b1', category: 'housing', limitPaise: rupeesToPaise(25000), month: thisMonth, isDemo: true },
  { id: 'demo-b2', category: 'food', limitPaise: rupeesToPaise(6000), month: thisMonth, isDemo: true },
  { id: 'demo-b3', category: 'dining', limitPaise: rupeesToPaise(4000), month: thisMonth, isDemo: true },
  { id: 'demo-b4', category: 'transport', limitPaise: rupeesToPaise(2000), month: thisMonth, isDemo: true },
  { id: 'demo-b5', category: 'subscriptions', limitPaise: rupeesToPaise(2000), month: thisMonth, isDemo: true },
  { id: 'demo-b6', category: 'shopping', limitPaise: rupeesToPaise(4000), month: thisMonth, isDemo: true },
  { id: 'demo-b7', category: 'entertainment', limitPaise: rupeesToPaise(2000), month: thisMonth, isDemo: true },
  { id: 'demo-b8', category: 'health', limitPaise: rupeesToPaise(2000), month: thisMonth, isDemo: true },
  { id: 'demo-b9', category: 'utilities', limitPaise: rupeesToPaise(1500), month: thisMonth, isDemo: true },
  { id: 'demo-b10', category: 'savings', limitPaise: rupeesToPaise(10000), month: thisMonth, isDemo: true },
  // Last month budgets
  { id: 'demo-b11', category: 'housing', limitPaise: rupeesToPaise(25000), month: lastMonth, isDemo: true },
  { id: 'demo-b12', category: 'food', limitPaise: rupeesToPaise(6000), month: lastMonth, isDemo: true },
  { id: 'demo-b13', category: 'dining', limitPaise: rupeesToPaise(3500), month: lastMonth, isDemo: true },
  { id: 'demo-b14', category: 'subscriptions', limitPaise: rupeesToPaise(2000), month: lastMonth, isDemo: true },
  { id: 'demo-b15', category: 'shopping', limitPaise: rupeesToPaise(4000), month: lastMonth, isDemo: true },
];

export const demoGoals: Goal[] = [
  {
    id: 'demo-g1',
    name: 'Emergency Fund',
    targetPaise: rupeesToPaise(300000),
    currentPaise: rupeesToPaise(185000),
    targetDate: format(addMonths(today, 8), 'yyyy-MM-dd'),
    icon: '🛡️',
    color: '#BAC8AE',
    isDemo: true,
    createdAt: format(subMonths(today, 6), 'yyyy-MM-dd'),
    contributions: [
      { id: 'c1', amountPaise: rupeesToPaise(20000), date: md(twoMonthsAgo, 25), note: 'Initial contribution' },
      { id: 'c2', amountPaise: rupeesToPaise(15000), date: md(lastMonth, 25) },
      { id: 'c3', amountPaise: rupeesToPaise(15000), date: md(thisMonth, 25) },
    ],
  },
  {
    id: 'demo-g2',
    name: 'MacBook Pro',
    targetPaise: rupeesToPaise(180000),
    currentPaise: rupeesToPaise(54000),
    targetDate: format(addMonths(today, 10), 'yyyy-MM-dd'),
    icon: '💻',
    color: '#D77B5D',
    isDemo: true,
    createdAt: format(subMonths(today, 3), 'yyyy-MM-dd'),
    contributions: [
      { id: 'c4', amountPaise: rupeesToPaise(18000), date: md(twoMonthsAgo, 28) },
      { id: 'c5', amountPaise: rupeesToPaise(18000), date: md(lastMonth, 28) },
      { id: 'c6', amountPaise: rupeesToPaise(18000), date: md(thisMonth, 28) },
    ],
  },
  {
    id: 'demo-g3',
    name: 'Europe Trip',
    targetPaise: rupeesToPaise(250000),
    currentPaise: rupeesToPaise(75000),
    targetDate: format(addMonths(today, 14), 'yyyy-MM-dd'),
    icon: '✈️',
    color: '#C4956A',
    isDemo: true,
    createdAt: format(subMonths(today, 4), 'yyyy-MM-dd'),
    contributions: [
      { id: 'c7', amountPaise: rupeesToPaise(25000), date: md(twoMonthsAgo, 20) },
      { id: 'c8', amountPaise: rupeesToPaise(25000), date: md(lastMonth, 20) },
      { id: 'c9', amountPaise: rupeesToPaise(25000), date: md(thisMonth, 20) },
    ],
  },
];

export const demoRecurring: RecurringPayment[] = [
  { id: 'demo-r1', name: 'Apartment Rent', amountPaise: rupeesToPaise(22000), category: 'housing', frequency: 'monthly', nextDate: format(addDays(today, 2), 'yyyy-MM-dd'), type: 'expense', isActive: true, isDemo: true, description: 'HSR Layout 2BHK' },
  { id: 'demo-r2', name: 'Salary', amountPaise: rupeesToPaise(95000), category: 'salary', frequency: 'monthly', nextDate: format(addMonths(today, 1), 'yyyy-MM-dd').substring(0, 7) + '-01', type: 'income', isActive: true, isDemo: true, description: 'Infosys Ltd.' },
  { id: 'demo-r3', name: 'Netflix', amountPaise: rupeesToPaise(899), category: 'subscriptions', frequency: 'monthly', nextDate: format(addDays(today, 6), 'yyyy-MM-dd'), type: 'expense', isActive: true, isDemo: true },
  { id: 'demo-r4', name: 'Spotify', amountPaise: rupeesToPaise(219), category: 'subscriptions', frequency: 'monthly', nextDate: format(addDays(today, 6), 'yyyy-MM-dd'), type: 'expense', isActive: true, isDemo: true },
  { id: 'demo-r5', name: 'Mirae Asset SIP', amountPaise: rupeesToPaise(5000), category: 'savings', frequency: 'monthly', nextDate: format(addDays(today, 19), 'yyyy-MM-dd'), type: 'expense', isActive: true, isDemo: true, description: 'Mutual Fund SIP' },
  { id: 'demo-r6', name: 'Internet – Airtel', amountPaise: rupeesToPaise(499), category: 'utilities', frequency: 'monthly', nextDate: format(addDays(today, 12), 'yyyy-MM-dd'), type: 'expense', isActive: true, isDemo: true },
  { id: 'demo-r7', name: 'Notion Pro', amountPaise: rupeesToPaise(349), category: 'subscriptions', frequency: 'monthly', nextDate: format(addDays(today, 20), 'yyyy-MM-dd'), type: 'expense', isActive: true, isDemo: true },
];
