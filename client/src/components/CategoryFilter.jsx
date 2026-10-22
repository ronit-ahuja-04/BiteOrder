import React from 'react';
import { CATEGORIES } from '../data/menuData';

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  dietFilter,
  onSelectDietFilter,
  totalItemsCount,
}) {
  return (
    <div className="py-4 sm:py-6 border-b border-slate-200/80 bg-white shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        
        {/* Top bar: Category tabs & Dietary filters with responsive flex-direction */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Category Pills (Horizontal scrollable with smooth scrollbar on touch devices) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#E8590C] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm sm:text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Dietary Filters: All, Pure Veg, Non-Veg */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 self-start md:self-auto bg-slate-100/90 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
            {/* All */}
            <button
              onClick={() => onSelectDietFilter('all')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dietFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Dishes
            </button>

            {/* Pure Veg */}
            <button
              onClick={() => onSelectDietFilter('veg')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dietFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-emerald-300 bg-emerald-400"></span>
              <span>Pure Veg</span>
            </button>

            {/* Non-Veg */}
            <button
              onClick={() => onSelectDietFilter('non-veg')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dietFilter === 'non-veg'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-red-300 bg-red-400"></span>
              <span>Non-Veg</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
