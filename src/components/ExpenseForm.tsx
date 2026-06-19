import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import './ExpenseForm.css';

interface ExpenseFormProps {
  onClose?: () => void;
}

export default function ExpenseForm({ onClose }: ExpenseFormProps) {
  const { user } = useAuth();
  const { addExpense } = useExpense();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Family' as 'Family' | 'Pet',
    subcategory: 'Food',
    date: new Date().toISOString().split('T')[0],
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
      await addExpense({
        userId: user.uid,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        subcategory: formData.subcategory,
        date: formData.date,
      } as any);

      setFormData({
        description: '',
        amount: '',
        category: 'Family',
        subcategory: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
      onClose?.();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add New Expense</h2>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Weekly grocery shopping"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>

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
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Adding...' : 'Add Expense'}
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
