import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  login: () => null,
  register: () => null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('termquest_users');
    if (stored) setUsers(JSON.parse(stored));
    const session = localStorage.getItem('termquest_session');
    if (session) setUser(JSON.parse(session));
  }, []);

  const saveUsers = (list: User[]) => {
    setUsers(list);
    localStorage.setItem('termquest_users', JSON.stringify(list));
  };

  const login = (email: string, password: string) => {
    const stored = localStorage.getItem('termquest_users');
    const list: User[] = stored ? JSON.parse(stored) : [];
    const found = list.find(u => u.email === email);
    if (!found) return 'User not found';
    const creds = localStorage.getItem(`pw_${email}`);
    if (creds !== password) return 'Wrong password';
    setUser(found);
    localStorage.setItem('termquest_session', JSON.stringify(found));
    return null;
  };

  const register = (name: string, email: string, password: string) => {
    const stored = localStorage.getItem('termquest_users');
    const list: User[] = stored ? JSON.parse(stored) : [];
    if (list.find(u => u.email === email)) return 'Email already registered';
    const newUser: User = { id: Date.now().toString(), name, email, joinedAt: new Date().toISOString() };
    list.push(newUser);
    saveUsers(list);
    localStorage.setItem(`pw_${email}`, password);
    setUser(newUser);
    localStorage.setItem('termquest_session', JSON.stringify(newUser));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('termquest_session');
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
