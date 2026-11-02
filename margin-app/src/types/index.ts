// All monetary values stored in paise (1/100 of rupee) as integers

export type TransactionType = 'income' | 'expense';

export type Category =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'other_income'
  | 'housing'
  | 'food'
  | 'transport'
  | 'health'
  | 'shopping'
  | 'entertainment'
  | 'education'
  | 'utilities'
  | 'subscriptions'
  | 'dining'
  | 'travel'
  | 'personal'
  | 'savings'
  | 'other_expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amountPaise: number; // stored as integer paise
  category: Category;
  merchant: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  isDemo: boolean;
  recurringId?: string;
}

export interface Budget {
  id: string;
  category: Category;
  limitPaise: number;
  month: string; // YYYY-MM
  isDemo: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetPaise: number;
  currentPaise: number;
  targetDate?: string; // ISO date string
  icon: string;
  color: string;
  contributions: GoalContribution[];
  isDemo: boolean;
  createdAt: string;
}

export interface GoalContribution {
  id: string;
  amountPaise: number;
  date: string;
  note?: string;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amountPaise: number;
  category: Category;
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextDate: string; // ISO date string
  type: 'income' | 'expense';
  isActive: boolean;
  isDemo: boolean;
  description?: string;
}

export interface PlannedPurchase {
  id: string;
  name: string;
  amountPaise: number;
  category: Category;
  scenario: 'buy_now' | 'wait' | 'skip';
  createdAt: string;
  notes?: string;
}

export interface UserPreferences {
  currency: 'INR';
  theme: 'light';
  hasSeenOnboarding: boolean;
}

export interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurringPayments: RecurringPayment[];
  plannedPurchases: PlannedPurchase[];
  preferences: UserPreferences;
  selectedMonth: string; // YYYY-MM
}

// Category metadata
export const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string; type: 'income' | 'expense' | 'both' }> = {
  salary: { label: 'Salary', emoji: '💼', color: '#BAC8AE', type: 'income' },
  freelance: { label: 'Freelance', emoji: '🖥️', color: '#A8C5B8', type: 'income' },
  investment: { label: 'Investment', emoji: '📈', color: '#8FAF9F', type: 'income' },
  other_income: { label: 'Other Income', emoji: '💰', color: '#7A9F8C', type: 'income' },
  housing: { label: 'Housing', emoji: '🏠', color: '#D77B5D', type: 'expense' },
  food: { label: 'Groceries', emoji: '🛒', color: '#C4956A', type: 'expense' },
  transport: { label: 'Transport', emoji: '🚗', color: '#B8A082', type: 'expense' },
  health: { label: 'Health', emoji: '💊', color: '#9B8E7A', type: 'expense' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: '#8B7355', type: 'expense' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: '#7A6848', type: 'expense' },
  education: { label: 'Education', emoji: '📚', color: '#6B5D3F', type: 'expense' },
  utilities: { label: 'Utilities', emoji: '⚡', color: '#D4A574', type: 'expense' },
  subscriptions: { label: 'Subscriptions', emoji: '🔄', color: '#C49A6C', type: 'expense' },
  dining: { label: 'Dining', emoji: '🍽️', color: '#B48B5E', type: 'expense' },
  travel: { label: 'Travel', emoji: '✈️', color: '#A47C50', type: 'expense' },
  personal: { label: 'Personal', emoji: '🧴', color: '#947050', type: 'expense' },
  savings: { label: 'Savings', emoji: '🏦', color: '#BAC8AE', type: 'expense' },
  other_expense: { label: 'Other', emoji: '📋', color: '#8B8B8B', type: 'expense' },
};

export const INCOME_CATEGORIES: Category[] = ['salary', 'freelance', 'investment', 'other_income'];
export const EXPENSE_CATEGORIES: Category[] = [
  'housing', 'food', 'transport', 'health', 'shopping', 'entertainment',
  'education', 'utilities', 'subscriptions', 'dining', 'travel', 'personal', 'savings', 'other_expense'
];
