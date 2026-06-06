import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  userId: string;
  userDetails: string;
  identityProvider: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/.auth/me');
        const data = await res.json();
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = () => {
    window.location.href = '/.auth/login/google';
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
