import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';

export default function FirebaseProtectedRoute({ children }) {
  const { user, loading } = useFirebaseAuth();
  if (loading) return <div className="p-10 text-center text-slate-500">Checking Firebase session…</div>;
  return user ? children : <Navigate to="/firebase/login" replace />;
}
