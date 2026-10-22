import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    tableNumber,
    orderType,
    finalTotal,
    placeOrder,
  } = useCart();

  const [name, setName] = useState('Ronit Ahuja');
  const [mobile, setMobile] = useState('9876543210');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cash'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({ name, mobile, paymentMethod });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-slate-900">Checkout & Payment</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Order Summary Strip (Figure 8.2) */}
        <div className="bg-orange-50/70 px-6 py-3 border-b border-orange-100 flex items-center justify-between text-xs text-orange-950 font-medium">
          <div>
            <span className="font-bold">Order type: </span>
            <span className="capitalize">{orderType}</span> (Table {tableNumber})
          </div>
          <div>
            <span>{cart.length} items • ETA ~15 min</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C]"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number (for SMS & WhatsApp Receipt) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-semibold text-slate-400">
                +91
              </span>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C]"
              />
            </div>
          </div>

          {/* Payment Method Selector (Figure 8.2) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Payment Method
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#E8590C] bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-[#E8590C] focus:ring-[#E8590C]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">UPI (GPay / PhonePe / Paytm)</div>
                    <div className="text-xs text-slate-400">Instant contactless payment via QR / App</div>
                  </div>
                </div>
                <span className="text-lg">⚡</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#E8590C] bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-[#E8590C] focus:ring-[#E8590C]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Credit / Debit Card</div>
                    <div className="text-xs text-slate-400">Visa, Mastercard, RuPay cards supported</div>
                  </div>
                </div>
                <span className="text-lg">💳</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#E8590C] bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="text-[#E8590C] focus:ring-[#E8590C]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Pay at Counter (Cash / POS)</div>
                    <div className="text-xs text-slate-400">Settle your bill after meal with cashier</div>
                  </div>
                </div>
                <span className="text-lg">💵</span>
              </label>
            </div>
          </div>

          {/* Amount Payable Strip */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white">
            <span className="text-sm font-medium text-slate-300">Amount Payable</span>
            <span className="text-xl font-black text-orange-400">₹{finalTotal}</span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-[#E8590C] hover:bg-orange-700 disabled:opacity-75 text-white font-extrabold text-base shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Pay ₹{finalTotal} & Place Order</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
