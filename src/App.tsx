import React from 'react';
import { AuthProvider, useAuth } from './components/Auth';
import Dashboard from './components/Dashboard';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">TermQuest</h1>
        <p className="text-gray-400 mb-6">Sign in to access your dashboard</p>
        <button
          onClick={login}
          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }
  if (!user) return <LoginScreen />;
  return (
    <div className="min-h-screen">
      <Dashboard />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
