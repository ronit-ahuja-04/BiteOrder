import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ isDrawer = false, onClose = () => {} }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    gst,
    discountAmount,
    finalTotal,
    tableNumber,
    orderType,
    setOrderType,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (success) {
      setInputCoupon('');
    }
  };

  const handleProceed = () => {
    if (cart.length === 0) return;
    if (isDrawer) onClose();
    setIsCheckoutOpen(true);
  };

  const content = (
    <div className="flex flex-col h-full bg-white">
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Your Order
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-100 text-[#E8590C]">
              Table {tableNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {cart.length} {cart.length === 1 ? 'dish' : 'dishes'} selected
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
          {isDrawer && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Order Type Toggle (Dine-in / Takeaway as in Figure 8.3) */}
      <div className="px-5 py-3 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">Order Type:</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
            <input
              type="radio"
              name="orderType"
              value="dine-in"
              checked={orderType === 'dine-in'}
              onChange={() => setOrderType('dine-in')}
              className="text-[#E8590C] focus:ring-[#E8590C]"
            />
            <span>Dine-in</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
            <input
              type="radio"
              name="orderType"
              value="takeaway"
              checked={orderType === 'takeaway'}
              onChange={() => setOrderType('takeaway')}
              className="text-[#E8590C] focus:ring-[#E8590C]"
            />
            <span>Takeaway</span>
          </label>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center text-3xl mb-3">
              🍽️
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Your plate is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Explore our chef's handpicked menu dishes and add your favorites to get started!
            </p>
          </div>
        ) : (
          cart.map((ci) => (
            <div
              key={ci.cartItemId}
              className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      ci.item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  ></span>
                  <span className="font-bold text-sm text-slate-900 truncate">
                    {ci.item.name}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                  <div>
                    Portion: <span className="font-semibold text-slate-700">{ci.portion}</span>
                  </div>
                  {ci.selectedAddons.length > 0 && (
                    <div className="text-orange-700 font-medium">
                      + {ci.selectedAddons.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {ci.specialInstructions && (
                    <div className="italic text-slate-400 line-clamp-1">
                      "{ci.specialInstructions}"
                    </div>
                  )}
                </div>

                <div className="text-xs font-black text-slate-900 mt-2">
                  ₹{ci.unitPrice * ci.quantity}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">
                    (₹{ci.unitPrice} each)
                  </span>
                </div>
              </div>

              {/* Stepper controls */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => updateQuantity(ci.cartItemId, -1)}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-black text-slate-900">
                    {ci.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(ci.cartItemId, 1)}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-r-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(ci.cartItemId)}
                  className="text-[10px] text-slate-400 hover:text-red-500 transition-colors mt-0.5"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Calculation & Checkout Footer */}
      {cart.length > 0 && (
        <div className="p-5 border-t border-slate-200 bg-white space-y-4">
          
          {/* Coupon Code Section */}
          <div>
            {couponCode ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <span className="font-bold">🏷️ Coupon "{couponCode}" applied!</span>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-900 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Coupon code (e.g. BITE10)"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#E8590C]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[11px] text-red-500 mt-1">{couponError}</p>
            )}
          </div>

          {/* Pricing Breakdown (Matches Figure 8.3 & Figure 8.2) */}
          <div className="space-y-1.5 text-xs text-slate-600 border-t border-dashed border-slate-200 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({couponCode})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                GST (5%)
                <span className="text-[10px] text-slate-400" title="Goods and Services Tax">ℹ️</span>
              </span>
              <span className="font-semibold text-slate-900">₹{gst}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Payable</span>
              <span className="text-[#E8590C]">₹{finalTotal}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full py-3.5 px-4 rounded-xl bg-[#E8590C] hover:bg-orange-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 transition-all duration-200 active:scale-98 flex items-center justify-between cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <span className="text-base font-black">₹{finalTotal} →</span>
          </button>

        </div>
      )}

    </div>
  );

  // Return either as desktop static card or mobile sliding drawer
  if (isDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
        <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden sticky top-28">
      {content}
    </div>
  );
}
