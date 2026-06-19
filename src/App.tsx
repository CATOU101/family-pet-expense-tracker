import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { isFirebaseConfigured } from './config/firebase';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import './App.css';

class AppErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unexpected app error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-page">
          <div className="error-card">
            <h1>Something went wrong</h1>
            <p>There was an unexpected error while loading the app.</p>
            <pre>{this.state.error.message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
  if (!isFirebaseConfigured) {
    return (
      <div className="config-error-page">
        <div className="config-error-card">
          <h1>Firebase configuration required</h1>
          <p>
            The app cannot start because your Firebase environment variables are missing or incomplete.
            Please set the following values in your Vercel project or local .env file:
          </p>
          <ul className="config-error-list">
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
          <p>Then rebuild and redeploy the app.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppErrorBoundary>
        <AppContent />
      </AppErrorBoundary>
    </AuthProvider>
  );
}

export default App;
