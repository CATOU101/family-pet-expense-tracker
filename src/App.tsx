import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const mode = new URLSearchParams(window.location.search).get('mode') || 'login';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage mode={mode as 'login' | 'signup'} />;
  }

  return (
    <ExpenseProvider>
      <Dashboard />
    </ExpenseProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
