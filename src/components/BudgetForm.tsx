import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import './BudgetForm.css';

interface BudgetFormProps {
  onClose?: () => void;
}

export default function BudgetForm({ onClose }: BudgetFormProps) {
  const { user } = useAuth();
  const { addBudget } = useExpense();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Family' as 'Family' | 'Pet',
    subcategory: 'Groceries',
    limit: '',
    period: 'monthly' as 'monthly' | 'yearly',
  });

  const subcategories = {
    Family: ['Groceries', 'Utilities', 'Entertainment', 'Medical', 'Education', 'Transportation', 'Other'],
    Pet: ['Food', 'Veterinary', 'Grooming', 'Toys', 'Accessories', 'Training', 'Other'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await addBudget({
        userId: user.uid,
        category: formData.category,
        subcategory: formData.subcategory,
        limit: parseFloat(formData.limit),
        period: formData.period,
      } as any);

      setFormData({
        category: 'Family',
        subcategory: 'Groceries',
        limit: '',
        period: 'monthly',
      });
      onClose?.();
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Failed to add budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <h2>Set Budget Limit</h2>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as 'Family' | 'Pet',
              subcategory: subcategories[e.target.value as 'Family' | 'Pet'][0],
            })
          }
        >
          <option value="Family">Family</option>
          <option value="Pet">Pet</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="subcategory">Subcategory</label>
        <select
          id="subcategory"
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
        >
          {subcategories[formData.category].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="limit">Monthly/Yearly Limit ($)</label>
        <input
          type="number"
          id="limit"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="period">Period</label>
        <select
          id="period"
          value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Setting...' : 'Set Budget'}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
