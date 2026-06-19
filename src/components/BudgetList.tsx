import { useExpense } from '../context/ExpenseContext';
import './BudgetList.css';

export default function BudgetList() {
  const { budgets, deleteBudget, expenses } = useExpense();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget');
      }
    }
  };

  const getBudgetSpent = (budget: typeof budgets[0]) => {
    const now = new Date();
    return expenses
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
  };

  if (budgets.length === 0) {
    return <div className="empty-state">No budgets yet. Set one to track spending!</div>;
  }

  return (
    <div className="budget-list">
      <h2>Your Budgets</h2>
      <div className="budget-items">
        {budgets.map((budget) => {
          const spent = getBudgetSpent(budget);
          const percentage = (spent / budget.limit) * 100;
          const isExceeded = percentage > 100;

          return (
            <div key={budget.id} className={`budget-item ${isExceeded ? 'exceeded' : ''}`}>
              <div className="budget-info">
                <h3>{budget.category} - {budget.subcategory}</h3>
                <p className="period">
                  {budget.period === 'monthly' ? 'Monthly' : 'Yearly'} Budget
                </p>
              </div>
              <div className="budget-progress">
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      background: percentage > 100 ? '#f5576c' : percentage > 80 ? '#ffa502' : '#667eea',
                    }}
                  />
                </div>
                <div className="budget-amounts">
                  <span className="spent">${spent.toFixed(2)}</span>
                  <span className="limit">/ ${budget.limit.toFixed(2)}</span>
                  <span className={`percentage ${isExceeded ? 'exceeded' : ''}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(budget.id)}
                className="delete-btn"
                title="Delete budget"
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
