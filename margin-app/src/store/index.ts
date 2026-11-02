'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';
import type { Transaction, Budget, Goal, GoalContribution, RecurringPayment, PlannedPurchase, UserPreferences, AppState } from '@/types';
import { demoTransactions, demoBudgets, demoGoals, demoRecurring } from '@/lib/demo-data';
import { getCurrentMonth } from '@/lib/calculations';

interface StoreActions {
  // Transactions
  addTransaction: (t: Omit<Transaction, 'id' | 'isDemo'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Budgets
  addBudget: (b: Omit<Budget, 'id' | 'isDemo'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Goals
  addGoal: (g: Omit<Goal, 'id' | 'isDemo' | 'contributions' | 'currentPaise' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addGoalContribution: (goalId: string, amountPaise: number, note?: string) => void;
  withdrawGoalContribution: (goalId: string, amountPaise: number) => void;

  // Recurring Payments
  addRecurringPayment: (r: Omit<RecurringPayment, 'id' | 'isDemo'>) => void;
  updateRecurringPayment: (id: string, updates: Partial<RecurringPayment>) => void;
  deleteRecurringPayment: (id: string) => void;
  toggleRecurringPayment: (id: string) => void;

  // Planned Purchases
  addPlannedPurchase: (p: Omit<PlannedPurchase, 'id' | 'createdAt'>) => void;
  deletePlannedPurchase: (id: string) => void;

  // Preferences
  setSelectedMonth: (month: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;

  // Reset
  resetToDemo: () => void;
}

type FullStore = AppState & StoreActions;

const defaultState: AppState = {
  transactions: demoTransactions,
  budgets: demoBudgets,
  goals: demoGoals,
  recurringPayments: demoRecurring,
  plannedPurchases: [],
  preferences: {
    currency: 'INR',
    theme: 'light',
    hasSeenOnboarding: false,
  },
  selectedMonth: getCurrentMonth(),
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useStore = create<FullStore>()(
  persist(
    (set) => ({
      ...defaultState,

      // ── Transactions ────────────────────────────────────────────────────
      addTransaction: (t) => set((s) => ({
        transactions: [...s.transactions, { ...t, id: generateId(), isDemo: false }],
      })),

      updateTransaction: (id, updates) => set((s) => ({
        transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
      })),

      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter(t => t.id !== id),
      })),

      // ── Budgets ─────────────────────────────────────────────────────────
      addBudget: (b) => set((s) => ({
        budgets: [...s.budgets, { ...b, id: generateId(), isDemo: false }],
      })),

      updateBudget: (id, updates) => set((s) => ({
        budgets: s.budgets.map(b => b.id === id ? { ...b, ...updates } : b),
      })),

      deleteBudget: (id) => set((s) => ({
        budgets: s.budgets.filter(b => b.id !== id),
      })),

      // ── Goals ────────────────────────────────────────────────────────────
      addGoal: (g) => set((s) => ({
        goals: [...s.goals, {
          ...g,
          id: generateId(),
          isDemo: false,
          contributions: [],
          currentPaise: 0,
          createdAt: format(new Date(), 'yyyy-MM-dd'),
        }],
      })),

      updateGoal: (id, updates) => set((s) => ({
        goals: s.goals.map(g => g.id === id ? { ...g, ...updates } : g),
      })),

      deleteGoal: (id) => set((s) => ({
        goals: s.goals.filter(g => g.id !== id),
      })),

      addGoalContribution: (goalId, amountPaise, note) => set((s) => ({
        goals: s.goals.map(g => g.id === goalId ? {
          ...g,
          currentPaise: g.currentPaise + amountPaise,
          contributions: [...g.contributions, {
            id: generateId(),
            amountPaise,
            date: format(new Date(), 'yyyy-MM-dd'),
            note,
          }],
        } : g),
      })),

      withdrawGoalContribution: (goalId, amountPaise) => set((s) => ({
        goals: s.goals.map(g => g.id === goalId ? {
          ...g,
          currentPaise: Math.max(0, g.currentPaise - amountPaise),
        } : g),
      })),

      // ── Recurring Payments ───────────────────────────────────────────────
      addRecurringPayment: (r) => set((s) => ({
        recurringPayments: [...s.recurringPayments, { ...r, id: generateId(), isDemo: false }],
      })),

      updateRecurringPayment: (id, updates) => set((s) => ({
        recurringPayments: s.recurringPayments.map(r => r.id === id ? { ...r, ...updates } : r),
      })),

      deleteRecurringPayment: (id) => set((s) => ({
        recurringPayments: s.recurringPayments.filter(r => r.id !== id),
      })),

      toggleRecurringPayment: (id) => set((s) => ({
        recurringPayments: s.recurringPayments.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r),
      })),

      // ── Planned Purchases ────────────────────────────────────────────────
      addPlannedPurchase: (p) => set((s) => ({
        plannedPurchases: [...s.plannedPurchases, { ...p, id: generateId(), createdAt: format(new Date(), 'yyyy-MM-dd') }],
      })),

      deletePlannedPurchase: (id) => set((s) => ({
        plannedPurchases: s.plannedPurchases.filter(p => p.id !== id),
      })),

      // ── Preferences ──────────────────────────────────────────────────────
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      updatePreferences: (prefs) => set((s) => ({ preferences: { ...s.preferences, ...prefs } })),

      // ── Reset ────────────────────────────────────────────────────────────
      resetToDemo: () => set({
        ...defaultState,
        selectedMonth: getCurrentMonth(),
      }),
    }),
    {
      name: 'margin-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
