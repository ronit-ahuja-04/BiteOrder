import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function TableSelectorModal({ isOpen, onClose }) {
  const { tableNumber, setTableNumber } = useCart();
  const [selected, setSelected] = useState(tableNumber);

  if (!isOpen) return null;

  const tables = [
    { num: '01', status: 'Free' },
    { num: '02', status: 'Occupied' },
    { num: '03', status: 'Occupied' },
    { num: '04', status: 'Ready to serve' },
    { num: '05', status: 'Free' },
    { num: '06', status: 'Occupied' },
    { num: '07', status: 'Needs help' },
    { num: '08', status: 'Occupied' },
    { num: '09', status: 'Occupied' },
    { num: '10', status: 'Free' },
    { num: '11', status: 'Free' },
    { num: '12', status: 'Occupied (Current)' },
    { num: '13', status: 'Occupied' },
    { num: '14', status: 'Free' },
    { num: '15', status: 'Ready to serve' },
    { num: '16', status: 'Free' },
  ];

  const handleSave = () => {
    setTableNumber(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Select Restaurant Table</h2>
            <p className="text-xs text-slate-500">QR Code Simulation • BiteOrder Floor Plan</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100 p-2.5 rounded-xl">
            <span>Currently seated at: <strong className="text-orange-600">Table {tableNumber}</strong></span>
            <span>Floor: Ground Dine-in</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
            {tables.map((t) => {
              const isCurrent = selected === t.num;
              return (
                <button
                  key={t.num}
                  onClick={() => setSelected(t.num)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[#E8590C] bg-orange-500 text-white font-black shadow-md scale-105'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <div className="text-sm font-bold">T{t.num}</div>
                  <div className={`text-[10px] mt-0.5 ${isCurrent ? 'text-orange-100' : 'text-slate-400'}`}>
                    {t.num === tableNumber ? 'Active' : t.status.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#E8590C] hover:bg-orange-700 text-white shadow-xs cursor-pointer"
          >
            Switch to Table {selected}
          </button>
        </div>

      </div>
    </div>
  );
}
