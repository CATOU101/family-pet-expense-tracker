import { useExpense } from '../context/ExpenseContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Reports.css';

export default function Reports() {
  const { expenses, budgets, getBudgetAlerts } = useExpense();

  // Category breakdown
  const categoryData = [
    {
      name: 'Family',
      value: expenses
        .filter((e) => e.category === 'Family')
        .reduce((sum, e) => sum + e.amount, 0),
    },
    {
      name: 'Pet',
      value: expenses
        .filter((e) => e.category === 'Pet')
        .reduce((sum, e) => sum + e.amount, 0),
    },
  ].filter((d) => d.value > 0);

  // Monthly breakdown
  const today = new Date();
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthExpenses = expenses.filter((e) => {
      const eDate = new Date(e.date);
      return eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear();
    });
    const amount = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount,
    });
  }

  // Subcategory breakdown
  const subcategoryMap: { [key: string]: number } = {};
  expenses.forEach((e) => {
    const key = `${e.category} - ${e.subcategory}`;
    subcategoryMap[key] = (subcategoryMap[key] || 0) + e.amount;
  });

  const subcategoryData = Object.entries(subcategoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const budgetAlerts = getBudgetAlerts();
  const COLORS = ['#667eea', '#f5576c', '#f093fb', '#764ba2', '#ffa502'];

  return (
    <div className="reports-container">
      <h2>Expense Reports & Analytics</h2>

      {budgetAlerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Budget Alerts</h3>
          <div className="alerts-grid">
            {budgetAlerts.map((alert) => (
              <div key={alert.category} className="alert-card">
                <h4>{alert.category}</h4>
                <div className="alert-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(alert.percentage, 100)}%`,
                      background: alert.percentage > 100 ? '#f5576c' : '#ffa502',
                    }}
                  />
                </div>
                <p>
                  ${alert.spent.toFixed(2)} / ${alert.limit.toFixed(2)} ({alert.percentage.toFixed(0)}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="charts-grid">
        {categoryData.length > 0 && (
          <div className="chart-box">
            <h3>Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="chart-box">
          <h3>Monthly Expenses (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
              <Bar dataKey="amount" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {subcategoryData.length > 0 && (
        <div className="subcategory-section">
          <h3>Expenses by Type</h3>
          <div className="subcategory-list">
            {subcategoryData.map((item, index) => (
              <div key={item.name} className="subcategory-item">
                <span className="subcategory-color" style={{ background: COLORS[index % COLORS.length] }} />
                <span className="subcategory-name">{item.name}</span>
                <span className="subcategory-amount">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="summary-stats">
        <div className="stat-card">
          <h4>Total Expenses</h4>
          <p>${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Average Expense</h4>
          <p>${expenses.length > 0 ? (expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toFixed(2) : '0.00'}</p>
        </div>
        <div className="stat-card">
          <h4>Total Expenses This Month</h4>
          <p>${monthlyData[monthlyData.length - 1].amount.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Active Budgets</h4>
          <p>{budgets.length}</p>
        </div>
      </div>
    </div>
  );
}
