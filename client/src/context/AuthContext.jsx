import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { API_BASE as API } from '../config';
const AuthContext = createContext(null);

export const getToken = () => {
  try { return localStorage.getItem('biteorder_token'); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken()); // true while validating a stored token

  // On page load, verify the stored token with GET /api/auth/me
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('biteorder_token'))
      .finally(() => setLoading(false));
  }, []);

  const authRequest = async (path, body) => {
    const res = await fetch(`${API}/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    localStorage.setItem('biteorder_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const login = (email, password) => authRequest('login', { email, password });
  const register = (name, email, password) => authRequest('register', { name, email, password });
  const logout = useCallback(() => {
    localStorage.removeItem('biteorder_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
