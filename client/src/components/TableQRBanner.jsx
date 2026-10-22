import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function TableQRBanner({ onOpenTableModal }) {
  const { tableNumber, orderType, setOrderType } = useCart();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 via-[#E8590C] to-amber-600 text-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div className="absolute left-1/3 -top-10 w-32 h-32 rounded-full bg-amber-400/20 blur-xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Table identification & tagline */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-inner">
              📱
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight">
                  Welcome to BiteOrder
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-emerald-400 text-emerald-950 shadow-xs animate-pulse">
                  Table {tableNumber} Detected
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-orange-100 font-medium mt-0.5">
                Scan table QR, select delicious dishes, customize & order without waiting for menus.
              </p>
            </div>
          </div>

          {/* Right: Quick ordering mode buttons (Responsive Flex Wrap) */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
            <button
              onClick={() => setOrderType('dine-in')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                orderType === 'dine-in'
                  ? 'bg-white text-orange-700 shadow-md scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🍽️ Dine-in (T-{tableNumber})
            </button>

            <button
              onClick={() => setOrderType('takeaway')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                orderType === 'takeaway'
                  ? 'bg-white text-orange-700 shadow-md scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🛍️ Takeaway
            </button>

            <button
              onClick={onOpenTableModal}
              className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer"
              title="Change Table Number"
            >
              ⚙️
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-black/20 hover:bg-black/30 text-orange-100 hover:text-white text-xs transition-colors cursor-pointer"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
