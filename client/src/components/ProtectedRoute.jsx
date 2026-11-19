import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks a page unless logged in (and, if adminOnly, unless role === 'admin')
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center text-slate-500">Checking session…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname, reason: 'Please log in to access this page.' }} />;
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-5xl mb-3">🚫</div>
          <h1 className="text-2xl font-black text-slate-900">403 – Access Denied</h1>
          <p className="text-slate-600 mt-2 text-sm">
            This page is restricted to administrators. You are signed in as <strong>{user.name}</strong> ({user.role}).
          </p>
          <Link to="/" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-[#E8590C] text-white font-bold text-sm">Back to Menu</Link>
        </div>
      </div>
    );
  }
  return children;
}
