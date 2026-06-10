import React from 'react';
import { AuthProvider, useAuth } from './components/Auth';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const AppContent: React.FC = () => {
  const { user } = useAuth();
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
