import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import AuthNav from './AuthNav';
import NotificationBell from './NotificationBell';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  onOpenInspector,
  onOpenTableModal,
  onOpenApiTester,
}) {
  const { tableNumber, totalItemCount, finalTotal, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#E8590C] to-orange-400 flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-orange-500/30 transform hover:rotate-6 transition-transform duration-300 cursor-pointer">
              <span className="text-xl sm:text-2xl">🍔</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  Bite<span className="text-[#E8590C]">Order</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                  Live
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Scan • Order • Enjoy
              </p>
            </div>
          </div>

          {/* Search Bar (Centered, visible on medium+ screens: md:block) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for dishes, cuisines, or spices..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] focus:bg-white transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls: Table Badge, REST API Console, Lab Helper, Cart Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Table Badge */}
            <button
              onClick={onOpenTableModal}
              className="hidden xl:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#E8590C] transition-colors group cursor-pointer"
              title="Click to switch table"
            >
              <span className="text-sm sm:text-base">🪑</span>
              <div className="text-left">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-orange-600 leading-none hidden sm:block">Dine-In</div>
                <div className="text-xs font-bold text-slate-800 leading-tight">T-{tableNumber}</div>
              </div>
            </button>

            {/* REST API Tester Console Button (Experiment 4) */}
            <button
              onClick={onOpenApiTester}
              className="hidden xl:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-all border border-emerald-200 shadow-xs cursor-pointer"
              title="Open RESTful API Console (Node.js + Express Testing)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline font-bold">API Console</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1 rounded font-mono font-bold">Exp 4</span>
            </button>

            {/* Tailwind Classes Inspector Button */}
            <button
              onClick={onOpenInspector}
              className="hidden xl:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-300 shadow-xs cursor-pointer"
              title="View Tailwind Utility Classes Experiment Breakdown"
            >
              <span className="text-sm">⚡</span>
              <span className="hidden xl:inline">Tailwind</span>
            </button>

            <NotificationBell />
            <div className="hidden xl:block"><AuthNav /></div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#E8590C] hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-900 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[11px] font-medium text-orange-100">Cart</span>
                <span className="text-xs font-extrabold">₹{finalTotal}</span>
              </div>
            </button>

            {/* Hamburger: below desktop width the extra controls move into this menu */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="xl:hidden w-10 h-10 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg transition-colors cursor-pointer"
            >
              {menuOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>

        {/* Collapsible menu (mobile / tablet) */}
        {menuOpen && (
          <div id="mobile-menu" className="xl:hidden pb-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <button onClick={() => { setMenuOpen(false); onOpenTableModal(); }} className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-[#E8590C] cursor-pointer">🪑 Table T-{tableNumber}</button>
            <button onClick={() => { setMenuOpen(false); onOpenApiTester(); }} className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 cursor-pointer">API Console</button>
            <button onClick={() => { setMenuOpen(false); onOpenInspector(); }} className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer">⚡ Tailwind</button>
            <AuthNav />
          </div>
        )}

        {/* Mobile Search Input (Visible on mobile: md:hidden) */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes or cuisines..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C] focus:bg-white transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
