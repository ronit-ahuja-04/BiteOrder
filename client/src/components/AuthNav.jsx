import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Navbar section that changes with the login state and role
export default function AuthNav() {
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Link to="/login" className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50">Login</Link>
        <Link to="/register" className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-700">Register</Link>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link to="/profile" className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">Profile</Link>
      <Link to="/my-orders" className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">My Orders</Link>
      {isAdmin && <Link to="/admin" className="px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200">Admin Dashboard</Link>}
      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800">
        👤 {user.name.split(' ')[0]}
        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${isAdmin ? 'bg-purple-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>{user.role}</span>
      </span>
      <button onClick={() => { logout(); showToast('You have been logged out.', 'info'); navigate('/'); }} className="px-3 py-2 rounded-xl text-xs font-bold text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer">Logout</button>
    </div>
  );
}
