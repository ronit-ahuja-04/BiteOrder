import React from 'react';
import { useCart } from '../context/CartContext';

export default function MenuCard({ item }) {
  const { cart, addToCart, updateQuantity, setCustomizingItem } = useCart();

  // Find if this item exists in the cart (across any portions/addons)
  const cartEntries = cart.filter((ci) => ci.item.id === item.id);
  const totalQuantityInCart = cartEntries.reduce((sum, ci) => sum + ci.quantity, 0);

  const handleAddClick = () => {
    // If item has portion choices or add-ons, open the customization modal
    if (item.availableAddons?.length > 0 || item.halfPrice !== item.price) {
      setCustomizingItem(item);
    } else {
      addToCart(item, 'Full', [], '', 1);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Top Media & Tags Section */}
      <div>
        {/* Image Container with Hover Zoom & Badges */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

          {/* Top Floating Badges: Bestseller / Chef's Special */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {item.isBestseller && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8590C] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                🔥 Bestseller
              </span>
            )}
            {item.isChefSpecial && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                👨‍🍳 Chef's Pick
              </span>
            )}
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[11px] sm:text-xs font-medium text-white flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{item.prepTime} mins</span>
          </div>
        </div>

        {/* Dish Title, Veg/Non-Veg & Rating Row */}
        <div className="mt-3 sm:mt-3.5 flex items-start justify-between gap-2">
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Veg / Non-Veg Icon Symbol (FSSAI standard) */}
            <div
              className={`shrink-0 flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs border ${
                item.isVeg ? 'border-emerald-600' : 'border-red-600'
              }`}
              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              ></div>
            </div>

            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#E8590C] transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          {/* Star Rating Badge */}
          <div className="shrink-0 flex items-center gap-1 rounded-lg bg-amber-50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-amber-700 border border-amber-200/60">
            <span className="text-amber-500">★</span>
            <span>{item.rating}</span>
            <span className="text-[10px] text-amber-500/80 font-normal hidden sm:inline">({item.ratingCount})</span>
          </div>

        </div>

        {/* Short Description */}
        <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {item.description}
        </p>

      </div>

      {/* Card Footer: Price & Add / Customization Controls */}
      <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Price & Calories */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-black text-slate-900">₹{item.price}</span>
            {item.halfPrice < item.price && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                (Half ₹{item.halfPrice})
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{item.calories}</span>
        </div>

        {/* Action Button: Stepper or Add Button */}
        <div className="flex flex-col items-end">
          {totalQuantityInCart > 0 ? (
            <div className="flex items-center rounded-xl bg-orange-50 border border-orange-200 shadow-xs p-1">
              <button
                onClick={() => {
                  if (cartEntries.length === 1) {
                    updateQuantity(cartEntries[0].cartItemId, -1);
                  } else {
                    setCustomizingItem(item);
                  }
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white text-orange-600 font-bold hover:bg-orange-100 flex items-center justify-center transition-colors cursor-pointer text-xs sm:text-sm"
                title="Decrease quantity"
              >
                -
              </button>
              <span className="px-2 sm:px-3 text-xs font-black text-orange-700">
                {totalQuantityInCart}
              </span>
              <button
                onClick={() => {
                  if (cartEntries.length === 1 && cartEntries[0].selectedAddons.length === 0 && cartEntries[0].portion === 'Full') {
                    updateQuantity(cartEntries[0].cartItemId, 1);
                  } else {
                    setCustomizingItem(item);
                  }
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#E8590C] text-white font-bold hover:bg-orange-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs text-xs sm:text-sm"
                title="Add more"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="group/btn inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#E8590C] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-md shadow-orange-500/25 hover:bg-orange-700 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span className="text-sm font-black">+</span>
              <span>ADD</span>
            </button>
          )}

          {/* Customizable notice */}
          {(item.availableAddons?.length > 0 || item.halfPrice < item.price) && (
            <button
              onClick={() => setCustomizingItem(item)}
              className="mt-1 text-[9px] sm:text-[10px] text-[#E8590C] hover:text-orange-800 font-bold tracking-tight hover:underline cursor-pointer"
            >
              Customizable ⚙️
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
