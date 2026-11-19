import React from 'react';

// Reusable loading indicator
export default function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 text-slate-500 text-sm ${className}`} role="status">
      <span className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-[#E8590C] animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}
