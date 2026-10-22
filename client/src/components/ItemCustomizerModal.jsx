import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function ItemCustomizerModal() {
  const { customizingItem, setCustomizingItem, addToCart } = useCart();

  const [portion, setPortion] = useState('Full');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (customizingItem) {
      setPortion('Full');
      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const item = customizingItem;
  const basePrice = portion === 'Half' ? item.halfPrice : item.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalItemPrice = unitPrice * quantity;

  const handleToggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirm = () => {
    addToCart(item, portion, selectedAddons, specialInstructions, quantity);
    setCustomizingItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomizingItem(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-slate-900">
              Customize {item.name}
            </h2>
          </div>
          <button
            onClick={() => setCustomizingItem(null)}
            className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Dish hero preview */}
          <div className="flex gap-4 items-center rounded-xl bg-orange-50/50 p-3 border border-orange-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                <h3 className="font-bold text-slate-900">{item.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
              <p className="text-sm font-extrabold text-[#E8590C] mt-1">Base Price: ₹{item.price}</p>
            </div>
          </div>

          {/* Portion Size Selector (Radio buttons from Figure 8.1) */}
          {item.halfPrice < item.price && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  1. Select Portion Size
                </span>
                <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    portion === 'Half'
                      ? 'border-[#E8590C] bg-orange-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="portion"
                      value="Half"
                      checked={portion === 'Half'}
                      onChange={() => setPortion('Half')}
                      className="text-[#E8590C] focus:ring-[#E8590C]"
                    />
                    <span className="text-sm font-semibold text-slate-800">Half Plate</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">₹{item.halfPrice}</span>
                </label>

                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    portion === 'Full'
                      ? 'border-[#E8590C] bg-orange-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="portion"
                      value="Full"
                      checked={portion === 'Full'}
                      onChange={() => setPortion('Full')}
                      className="text-[#E8590C] focus:ring-[#E8590C]"
                    />
                    <span className="text-sm font-semibold text-slate-800">Full Plate</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">₹{item.price}</span>
                </label>
              </div>
            </div>
          )}

          {/* Add-ons Checkboxes (from Figure 8.1) */}
          {item.availableAddons?.length > 0 && (
            <div className="space-y-3">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                2. Extra Add-ons
              </span>
              <div className="space-y-2">
                {item.availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-orange-400 bg-orange-50/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAddon(addon)}
                          className="rounded text-[#E8590C] focus:ring-[#E8590C] w-4 h-4"
                        />
                        <span className="text-sm font-medium text-slate-800">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions (from Figure 8.1) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              3. Special Cooking Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. no onion, extra crispy, less spicy"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C]/30 focus:border-[#E8590C]"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-slate-900">Quantity</span>
            <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="px-4 text-sm font-black text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Sticky Modal Footer */}
        <div className="border-t border-slate-200 bg-white p-4">
          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-between py-3.5 px-6 rounded-xl bg-[#E8590C] hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 transition-all cursor-pointer active:scale-98"
          >
            <span>Add to Cart ({quantity} {quantity > 1 ? 'items' : 'item'})</span>
            <span className="text-base font-black">₹{totalItemPrice}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
