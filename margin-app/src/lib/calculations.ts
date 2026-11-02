import { format, subMonths, addMonths, startOfMonth, endOfMonth, addDays, addWeeks, addYears } from 'date-fns';
import type { Transaction, Budget, Goal, RecurringPayment, Category } from '@/types';

// ─── Monetary Helpers ──────────────────────────────────────────────────────────

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatCurrency(paise: number, compact = false): string {
  const rupees = paiseToRupees(paise);
  if (compact && Math.abs(rupees) >= 100000) {
    return `₹${(rupees / 100000).toFixed(1)}L`;
  }
  if (compact && Math.abs(rupees) >= 1000) {
    return `₹${(rupees / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatCurrencyFull(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paiseToRupees(paise));
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getMonthLabel(month: string): string {
  const [year, m] = month.split('-');
  const date = new Date(parseInt(year), parseInt(m) - 1, 1);
  return format(date, 'MMMM yyyy');
}

export function dateToMonth(dateStr: string): string {
  return dateStr.substring(0, 7);
}

// ─── Transaction Calculations ─────────────────────────────────────────────────

export function getTransactionsByMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter(t => dateToMonth(t.date) === month);
}

export function getTotalIncome(transactions: Transaction[], month?: string): number {
  const filtered = month ? getTransactionsByMonth(transactions, month) : transactions;
  return filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amountPaise, 0);
}

export function getTotalExpenses(transactions: Transaction[], month?: string): number {
  const filtered = month ? getTransactionsByMonth(transactions, month) : transactions;
  return filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amountPaise, 0);
}

export function getMargin(transactions: Transaction[], month?: string): number {
  return getTotalIncome(transactions, month) - getTotalExpenses(transactions, month);
}

export function getSavingsRate(transactions: Transaction[], month?: string): number {
  const income = getTotalIncome(transactions, month);
  const margin = getMargin(transactions, month);
  if (income === 0) return 0;
  return Math.max(0, (margin / income) * 100);
}

export function getExpensesByCategory(transactions: Transaction[], month?: string): Record<Category, number> {
  const filtered = month ? getTransactionsByMonth(transactions, month) : transactions;
  const result = {} as Record<Category, number>;
  filtered.filter(t => t.type === 'expense').forEach(t => {
    result[t.category] = (result[t.category] || 0) + t.amountPaise;
  });
  return result;
}

// ─── Budget Calculations ──────────────────────────────────────────────────────

export function getBudgetUsage(budgets: Budget[], transactions: Transaction[], month: string): Array<{
  budget: Budget;
  spentPaise: number;
  percentUsed: number;
  status: 'ok' | 'warning' | 'danger' | 'over';
}> {
  const categorySpend = getExpensesByCategory(transactions, month);
  return budgets
    .filter(b => b.month === month)
    .map(budget => {
      const spentPaise = categorySpend[budget.category] || 0;
      const percentUsed = budget.limitPaise > 0 ? (spentPaise / budget.limitPaise) * 100 : 0;
      let status: 'ok' | 'warning' | 'danger' | 'over' = 'ok';
      if (percentUsed >= 100) status = 'over';
      else if (percentUsed >= 80) status = 'danger';
      else if (percentUsed >= 60) status = 'warning';
      return { budget, spentPaise, percentUsed, status };
    });
}

// ─── Goal Calculations ────────────────────────────────────────────────────────

export function getGoalProgress(goal: Goal): number {
  if (goal.targetPaise === 0) return 0;
  return Math.min(100, (goal.currentPaise / goal.targetPaise) * 100);
}

export function estimateGoalCompletion(goal: Goal): string | null {
  if (goal.currentPaise >= goal.targetPaise) return 'Achieved!';
  if (goal.contributions.length < 2) return null;
  
  const sorted = [...goal.contributions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstDate = new Date(sorted[0].date);
  const lastDate = new Date(sorted[sorted.length - 1].date);
  const daysDiff = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalContributed = sorted.reduce((sum, c) => sum + c.amountPaise, 0);
  const dailyRate = totalContributed / daysDiff;
  if (dailyRate <= 0) return null;
  
  const remaining = goal.targetPaise - goal.currentPaise;
  const daysToGo = Math.ceil(remaining / dailyRate);
  const completionDate = addDays(new Date(), daysToGo);
  return format(completionDate, 'MMM yyyy');
}

// ─── Forecast Calculations ────────────────────────────────────────────────────

export function getNextOccurrence(recurring: RecurringPayment, fromDate: Date): Date {
  const next = new Date(recurring.nextDate);
  if (next >= fromDate) return next;
  
  let current = next;
  while (current < fromDate) {
    if (recurring.frequency === 'weekly') current = addWeeks(current, 1);
    else if (recurring.frequency === 'monthly') current = addMonths(current, 1);
    else current = addYears(current, 1);
  }
  return current;
}

export function getForecastData(
  currentBalancePaise: number,
  recurringPayments: RecurringPayment[],
  days: number
): Array<{ date: string; balancePaise: number; isEstimate: boolean }> {
  const today = new Date();
  const result: Array<{ date: string; balancePaise: number; isEstimate: boolean }> = [];
  let balance = currentBalancePaise;

  for (let i = 0; i <= days; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');

    recurringPayments.filter(r => r.isActive).forEach(r => {
      const next = getNextOccurrence(r, date);
      if (format(next, 'yyyy-MM-dd') === dateStr) {
        if (r.type === 'income') balance += r.amountPaise;
        else balance -= r.amountPaise;
      }
    });

    result.push({ date: dateStr, balancePaise: balance, isEstimate: i > 0 });
  }

  return result;
}

// ─── Monthly Chart Data ───────────────────────────────────────────────────────

export function getMonthlyChartData(transactions: Transaction[], monthsBack = 6): Array<{
  month: string;
  label: string;
  incomePaise: number;
  expensesPaise: number;
  marginPaise: number;
}> {
  const today = new Date();
  return Array.from({ length: monthsBack }, (_, i) => {
    const date = subMonths(today, monthsBack - 1 - i);
    const month = format(date, 'yyyy-MM');
    const income = getTotalIncome(transactions, month);
    const expenses = getTotalExpenses(transactions, month);
    return {
      month,
      label: format(date, 'MMM'),
      incomePaise: income,
      expensesPaise: expenses,
      marginPaise: income - expenses,
    };
  });
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export function generateInsights(transactions: Transaction[], budgets: Budget[], currentMonth: string) {
  const prevMonth = format(subMonths(new Date(currentMonth + '-01'), 1), 'yyyy-MM');
  
  const insights: Array<{ id: string; title: string; description: string; type: 'positive' | 'negative' | 'neutral'; icon: string; value?: string }> = [];
  
  const currentExpenses = getExpensesByCategory(transactions, currentMonth);
  const prevExpenses = getExpensesByCategory(transactions, prevMonth);
  const currentTotal = getTotalExpenses(transactions, currentMonth);
  const prevTotal = getTotalExpenses(transactions, prevMonth);
  const currentIncome = getTotalIncome(transactions, currentMonth);
  const savingsRate = getSavingsRate(transactions, currentMonth);
  const prevSavingsRate = getSavingsRate(transactions, prevMonth);
  
  // Savings rate
  if (savingsRate > 20) {
    insights.push({ id: 'savings-good', title: 'Healthy savings rate', description: `You're saving ${savingsRate.toFixed(0)}% of your income this month — above the recommended 20%.`, type: 'positive', icon: '📈', value: `${savingsRate.toFixed(0)}%` });
  } else if (savingsRate < 10) {
    insights.push({ id: 'savings-low', title: 'Low savings rate', description: `Your savings rate is ${savingsRate.toFixed(0)}% this month. Consider reducing discretionary expenses.`, type: 'negative', icon: '⚠️', value: `${savingsRate.toFixed(0)}%` });
  }
  
  // Savings rate change
  if (prevSavingsRate > 0 && savingsRate > prevSavingsRate + 3) {
    insights.push({ id: 'savings-up', title: 'Savings rate improved', description: `Your savings rate increased from ${prevSavingsRate.toFixed(0)}% to ${savingsRate.toFixed(0)}% compared to last month.`, type: 'positive', icon: '🎯' });
  }
  
  // Total spending change
  if (prevTotal > 0 && currentTotal > prevTotal * 1.1) {
    const pct = ((currentTotal - prevTotal) / prevTotal * 100).toFixed(0);
    insights.push({ id: 'spending-up', title: 'Spending increased', description: `Your total expenses are ${pct}% higher than last month (${formatCurrency(prevTotal)} → ${formatCurrency(currentTotal)}).`, type: 'negative', icon: '📊', value: `+${pct}%` });
  }
  
  // Dining increase
  const diningCurrent = currentExpenses.dining || 0;
  const diningPrev = prevExpenses.dining || 0;
  if (diningPrev > 0 && diningCurrent > diningPrev * 1.2) {
    insights.push({ id: 'dining-up', title: 'Dining expenses rose', description: `Dining spending increased by ${((diningCurrent - diningPrev) / diningPrev * 100).toFixed(0)}% compared to last month.`, type: 'negative', icon: '🍽️', value: formatCurrency(diningCurrent) });
  }
  
  // Shopping share
  const shopping = currentExpenses.shopping || 0;
  if (currentTotal > 0 && shopping / currentTotal > 0.2) {
    insights.push({ id: 'shopping-share', title: 'Shopping is a large share', description: `Shopping represents ${(shopping / currentTotal * 100).toFixed(0)}% of your total expenses this month.`, type: 'neutral', icon: '🛍️', value: formatCurrency(shopping) });
  }
  
  // Subscriptions
  const subs = currentExpenses.subscriptions || 0;
  if (subs > 0) {
    insights.push({ id: 'subscriptions', title: 'Monthly subscriptions', description: `You're spending ${formatCurrency(subs)} on subscriptions this month. Review if all are still needed.`, type: 'neutral', icon: '🔄', value: formatCurrency(subs) });
  }
  
  // Budget warnings
  const budgetUsage = getBudgetUsage(budgets, transactions, currentMonth);
  budgetUsage.forEach(b => {
    if (b.status === 'over') {
      insights.push({ id: `budget-over-${b.budget.category}`, title: `${b.budget.category} budget exceeded`, description: `You've exceeded your ${b.budget.category} budget by ${formatCurrency(b.spentPaise - b.budget.limitPaise)}.`, type: 'negative', icon: '🚨' });
    } else if (b.status === 'danger') {
      insights.push({ id: `budget-warning-${b.budget.category}`, title: `${b.budget.category} budget at ${b.percentUsed.toFixed(0)}%`, description: `You've used ${b.percentUsed.toFixed(0)}% of your ${b.budget.category} budget.`, type: 'negative', icon: '⚠️' });
    }
  });
  
  return insights;
}

// ─── Daily Spending ───────────────────────────────────────────────────────────

export function getDailySpending(transactions: Transaction[], month: string): Array<{
  day: number;
  date: string;
  dayLabel: string;
  amountPaise: number;
  count: number;
  isPeak: boolean;
}> {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const m = parseInt(monthStr);
  const daysInMonth = new Date(year, m, 0).getDate();

  const dailyTotals: Record<number, { amountPaise: number; count: number; date: string }> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = d < 10 ? `0${d}` : `${d}`;
    dailyTotals[d] = {
      amountPaise: 0,
      count: 0,
      date: `${month}-${dStr}`,
    };
  }

  transactions
    .filter(t => t.type === 'expense' && dateToMonth(t.date) === month)
    .forEach(t => {
      const d = parseInt(t.date.split('-')[2]);
      if (dailyTotals[d]) {
        dailyTotals[d].amountPaise += t.amountPaise;
        dailyTotals[d].count += 1;
      }
    });

  let maxAmount = 0;
  Object.values(dailyTotals).forEach(v => {
    if (v.amountPaise > maxAmount) maxAmount = v.amountPaise;
  });

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const item = dailyTotals[day];
    return {
      day,
      date: item.date,
      dayLabel: `${day}`,
      amountPaise: item.amountPaise,
      count: item.count,
      isPeak: maxAmount > 0 && item.amountPaise === maxAmount,
    };
  });
}

// ─── Top Merchants ────────────────────────────────────────────────────────────

export function getTopMerchants(transactions: Transaction[], month?: string, limit = 5): Array<{
  merchant: string;
  category: Category;
  totalPaise: number;
  count: number;
  percentage: number;
}> {
  const filtered = month ? getTransactionsByMonth(transactions, month) : transactions;
  const expenseTxns = filtered.filter(t => t.type === 'expense');
  const totalExpensePaise = expenseTxns.reduce((sum, t) => sum + t.amountPaise, 0);

  const merchantMap: Record<string, { totalPaise: number; count: number; category: Category }> = {};
  expenseTxns.forEach(t => {
    const key = t.merchant.trim();
    if (!merchantMap[key]) {
      merchantMap[key] = { totalPaise: 0, count: 0, category: t.category };
    }
    merchantMap[key].totalPaise += t.amountPaise;
    merchantMap[key].count += 1;
  });

  return Object.entries(merchantMap)
    .map(([merchant, data]) => ({
      merchant,
      category: data.category,
      totalPaise: data.totalPaise,
      count: data.count,
      percentage: totalExpensePaise > 0 ? (data.totalPaise / totalExpensePaise) * 100 : 0,
    }))
    .sort((a, b) => b.totalPaise - a.totalPaise)
    .slice(0, limit);
}

