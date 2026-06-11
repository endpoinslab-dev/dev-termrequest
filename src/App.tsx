import React from 'react';
import { AuthProvider, useAuth } from './components/Auth';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-cyan-400 animate-pulse">Loading...</p>
    </div>
  );
  if (!user) return <Login />;
  return (
    <div className="min-h-screen">
      <Dashboard />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
