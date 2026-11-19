import React from 'react';
import { Link } from 'react-router-dom';
import AuthNav from './AuthNav';
import NotificationBell from './NotificationBell';

export default function PageShell({ title, children, wide = false }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 min-h-16 py-2 flex flex-wrap items-center justify-between gap-y-2">
          <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">Bite<span className="text-[#E8590C]">Order</span></Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <NotificationBell />
            <AuthNav />
          </div>
        </div>
      </header>
      <main className={`mx-auto px-4 py-10 ${wide ? 'max-w-6xl' : 'max-w-md'}`}>
        {title && <h1 className="text-2xl font-black text-slate-900 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
