import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function OrderTrackingModal() {
  const { placedOrder, setPlacedOrder } = useCart();
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0); // 0: Received, 1: Preparing, 2: Ready, 3: Served

  const statuses = [
    { label: 'Order received', time: placedOrder?.createdAt || '12:04 PM', desc: 'Sent directly to Kitchen Display System' },
    { label: 'Preparing', time: 'In Progress', desc: 'Chef started prep • Freshly cooked' },
    { label: 'Ready', time: 'Plated', desc: 'Packaged & plated, waiting for runner' },
    { label: 'Served', time: 'Delivered', desc: 'Delivered hot to your table' },
  ];

  // Demonstrate useEffect: auto-advance simulated kitchen progress every 7 seconds
  useEffect(() => {
    if (!placedOrder) return;
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 7000);

    return () => clearInterval(interval); // Cleanup timer on unmount
  }, [placedOrder]);

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 4000);
  };

  const handleAdvanceStatus = () => {
    setCurrentStatusIndex((prev) => (prev + 1) % statuses.length);
  };

  if (!placedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-orange-200">
                Live Order Tracking
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                Table {placedOrder.tableNumber}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-0.5">
              Order #{placedOrder.orderNo}
            </h2>
          </div>
          <button
            onClick={() => setPlacedOrder(null)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Notification Alert for Waiter Call */}
          {waiterCalled && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
              <span>🔔</span>
              <span>Floor Staff Alerted! A waiter is heading to Table {placedOrder.tableNumber}.</span>
            </div>
          )}

          {/* Vertical Status Stepper (Figure 8.2 Screen 6) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Kitchen Live Progress
              </span>
              <button
                onClick={handleAdvanceStatus}
                className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                title="Simulate kitchen state progression"
              >
                Simulate Status ↻
              </button>
            </div>

            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-3">
              {statuses.map((step, idx) => {
                const isPassed = idx < currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step.label} className="relative">
                    {/* Stepper Dot */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-amber-600' : isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">{step.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Your Items Summary */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Items in this Order ({placedOrder.items.length})
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
              {placedOrder.items.map((ci) => (
                <div key={ci.cartItemId} className="p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">
                      {ci.quantity} × {ci.item.name}
                    </span>
                    <span className="text-slate-400 ml-1">({ci.portion})</span>
                    {ci.selectedAddons.length > 0 && (
                      <div className="text-[11px] text-orange-600 font-medium">
                        + {ci.selectedAddons.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">₹{ci.unitPrice * ci.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 text-xs font-bold text-slate-700">
              <span>Total Paid via {placedOrder.customer?.paymentMethod?.toUpperCase() || 'UPI'}</span>
              <span className="text-sm font-black text-slate-900">₹{placedOrder.total}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons (Figure 8.2 Screen 6: Call Waiter & Add More Items) */}
        <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
          <button
            onClick={handleCallWaiter}
            className="py-3 px-4 rounded-xl border-2 border-slate-300 hover:border-slate-400 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🛎️</span>
            <span>Call Waiter</span>
          </button>

          <button
            onClick={() => setPlacedOrder(null)}
            className="py-3 px-4 rounded-xl bg-[#E8590C] hover:bg-orange-700 font-extrabold text-xs text-white shadow-md shadow-orange-500/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>➕</span>
            <span>Add More Items</span>
          </button>
        </div>

      </div>
    </div>
  );
}
