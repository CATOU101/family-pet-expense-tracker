import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import type { Expense, Budget } from '../types';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getExpensesByCategory: (category: string) => Expense[];
  getExpensesByMonth: (year: number, month: number) => Expense[];
  getBudgetAlerts: () => { category: string; spent: number; limit: number; percentage: number }[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Subscribe to expenses
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      return;
    }

    const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseList: Expense[] = [];
      snapshot.forEach((doc) => {
        expenseList.push({
          id: doc.id,
          ...doc.data(),
        } as Expense);
      });
      setExpenses(expenseList.sort((a, b) => b.createdAt - a.createdAt));
    });

    return unsubscribe;
  }, [user]);

  // Subscribe to budgets
  useEffect(() => {
    if (!user) {
      setBudgets([]);
      return;
    }

    const q = query(collection(db, 'budgets'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetList: Budget[] = [];
      snapshot.forEach((doc) => {
        budgetList.push({
          id: doc.id,
          ...doc.data(),
        } as Budget);
      });
      setBudgets(budgetList);
    });

    return unsubscribe;
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      userId: user.uid,
      createdAt: Timestamp.now().toMillis(),
    });
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    await updateDoc(doc(db, 'expenses', id), expense);
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id));
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    await addDoc(collection(db, 'budgets'), {
      ...budget,
      userId: user.uid,
      createdAt: Timestamp.now().toMillis(),
    });
  };

  const deleteBudget = async (id: string) => {
    await deleteDoc(doc(db, 'budgets', id));
  };

  const getExpensesByCategory = (category: string) => {
    return expenses.filter((e) => e.category === category);
  };

  const getExpensesByMonth = (year: number, month: number) => {
    return expenses.filter((e) => {
      const date = new Date(e.date);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  };

  const getBudgetAlerts = () => {
    const now = new Date();
    return budgets
      .map((budget) => {
        const spent = expenses
          .filter(
            (e) =>
              e.category === budget.category &&
              e.subcategory === budget.subcategory &&
              new Date(e.date).getFullYear() === now.getFullYear() &&
              (budget.period === 'monthly'
                ? new Date(e.date).getMonth() === now.getMonth()
                : true)
          )
          .reduce((sum, e) => sum + e.amount, 0);

        return {
          category: `${budget.category} - ${budget.subcategory}`,
          spent,
          limit: budget.limit,
          percentage: (spent / budget.limit) * 100,
        };
      })
      .filter((alert) => alert.percentage >= 80);
  };

  const value = {
    expenses,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    addBudget,
    deleteBudget,
    getExpensesByCategory,
    getExpensesByMonth,
    getBudgetAlerts,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
