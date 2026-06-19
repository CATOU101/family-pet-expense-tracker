import type { Expense } from '../types';
import { useExpense } from '../context/ExpenseContext';
import './ExpenseList.css';

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const { deleteExpense } = useExpense();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (expenses.length === 0) {
    return <div className="empty-state">No expenses yet. Add one to get started!</div>;
  }

  return (
    <div className="expense-list">
      <h2>Recent Expenses</h2>
      <div className="expense-items">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <div className="expense-header">
                <h3>{expense.description}</h3>
                <span className={`category-badge ${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
              </div>
              <p className="expense-subcategory">{expense.subcategory}</p>
              <p className="expense-date">{formatDate(expense.date)}</p>
            </div>
            <div className="expense-actions">
              <div className="amount">${expense.amount.toFixed(2)}</div>
              <button
                onClick={() => handleDelete(expense.id)}
                className="delete-btn"
                title="Delete expense"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
