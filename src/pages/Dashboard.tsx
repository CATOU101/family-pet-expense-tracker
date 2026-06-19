import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import Reports from '../components/Reports';
import './Dashboard.css';

type Tab = 'overview' | 'expenses' | 'budgets' | 'reports';

export default function Dashboard() {
  const { expenses } = useExpense();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const today = new Date();
  const monthExpenses = expenses.filter((e) => {
    const eDate = new Date(e.date);
    return eDate.getMonth() === today.getMonth() && eDate.getFullYear() === today.getFullYear();
  });

  const familyExpenses = expenses.filter((e) => e.category === 'Family');
  const petExpenses = expenses.filter((e) => e.category === 'Pet');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const familyTotal = familyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const petTotal = petExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button onClick={() => setShowExpenseForm(true)} className="btn-primary">
              + Add Expense
            </button>
            <button onClick={() => setShowBudgetForm(true)} className="btn-secondary">
              + Set Budget
            </button>
          </div>
        </div>

        {showExpenseForm && (
          <div className="modal-overlay" onClick={() => setShowExpenseForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowExpenseForm(false)}>
                ✕
              </button>
              <ExpenseForm onClose={() => setShowExpenseForm(false)} />
            </div>
          </div>
        )}

        {showBudgetForm && (
          <div className="modal-overlay" onClick={() => setShowBudgetForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowBudgetForm(false)}>
                ✕
              </button>
              <BudgetForm onClose={() => setShowBudgetForm(false)} />
            </div>
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
          <button
            className={`tab-btn ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            Budgets
          </button>
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>Total Expenses</h3>
                  <p>${totalExpenses.toFixed(2)}</p>
                  <span className="stat-label">{expenses.length} transactions</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>This Month</h3>
                  <p>${monthTotal.toFixed(2)}</p>
                  <span className="stat-label">{monthExpenses.length} expenses</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👨‍👩‍👧‍👦</div>
                <div className="stat-info">
                  <h3>Family Expenses</h3>
                  <p>${familyTotal.toFixed(2)}</p>
                  <span className="stat-label">{familyExpenses.length} transactions</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🐾</div>
                <div className="stat-info">
                  <h3>Pet Expenses</h3>
                  <p>${petTotal.toFixed(2)}</p>
                  <span className="stat-label">{petExpenses.length} transactions</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && <ExpenseList expenses={expenses} />}
          {activeTab === 'budgets' && <BudgetList />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </div>
    </>
  );
}
