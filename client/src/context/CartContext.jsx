import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MENU_ITEMS } from '../data/menuData';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Table & Ordering configuration (from PRD Section 5.1 & 8.1)
  const [tableNumber, setTableNumber] = useState('12');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway' | 'online'

  // Pre-seed cart with items from Figure 8.3 & Figure 8.2 of Experiment 0 PRD:
  // Paneer Tikka (Full + Extra Cheese) = ₹290 x 1 = ₹290
  // Veg Spring Rolls = ₹180 x 2 = ₹360
  // Masala Chai = ₹50 x 2 = ₹100
  // Total items = 3, Total Subtotal = ₹750, GST 5% = ₹38, Total = ₹788
  const [cart, setCart] = useState([
    {
      cartItemId: 'item-1-Full-[extra_cheese]',
      item: MENU_ITEMS[0], // Paneer Tikka
      portion: 'Full',
      quantity: 1,
      selectedAddons: [{ id: 'extra_cheese', name: 'Extra Cheese', price: 30 }],
      specialInstructions: 'Well cooked and spicy',
      unitPrice: 290,
    },
    {
      cartItemId: 'item-2-Full-[]',
      item: MENU_ITEMS[1], // Veg Spring Rolls
      portion: 'Full',
      quantity: 2,
      selectedAddons: [],
      specialInstructions: 'Extra crispy',
      unitPrice: 180,
    },
    {
      cartItemId: 'item-11-Full-[]',
      item: MENU_ITEMS[10], // Masala Chai
      portion: 'Full',
      quantity: 2,
      selectedAddons: [],
      specialInstructions: 'Less sugar',
      unitPrice: 50,
    },
  ]);

  // Modal states
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Demonstrate useEffect: Load saved cart from localStorage on mount (side effect)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('biteorder_cart');
      const savedTable = localStorage.getItem('biteorder_table');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedTable) setTableNumber(savedTable);
    } catch (e) {
      console.warn('localStorage read skipped', e);
    }
  }, []);

  // Demonstrate useEffect: Persist cart to localStorage whenever cart or tableNumber changes
  useEffect(() => {
    try {
      localStorage.setItem('biteorder_cart', JSON.stringify(cart));
      localStorage.setItem('biteorder_table', tableNumber);
    } catch (e) {
      console.warn('localStorage write skipped', e);
    }
  }, [cart, tableNumber]);
  const addToCart = (item, portion = 'Full', selectedAddons = [], specialInstructions = '', quantity = 1) => {
    const addonIds = selectedAddons.map(a => a.id).sort().join(',');
    const cartItemId = `item-${item.id}-${portion}-[${addonIds}]`;

    const basePrice = portion === 'Half' ? item.halfPrice : item.price;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + addonsTotal;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            item,
            portion,
            quantity,
            selectedAddons,
            specialInstructions,
            unitPrice,
          },
        ];
      }
    });
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(ci => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = cartItemId => {
    setCart(prevCart => prevCart.filter(ci => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const applyCoupon = code => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'BITE10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponCode(trimmed);
      setCouponError('');
      return true;
    } else if (trimmed === 'WELCOME50') {
      const discount = Math.min(50, subtotal);
      setDiscountAmount(discount);
      setCouponCode(trimmed);
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try "BITE10" or "WELCOME50"');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setCouponError('');
  };

  // Calculations
  const totalItemCount = useMemo(() => {
    return cart.reduce((acc, ci) => acc + ci.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, ci) => acc + ci.unitPrice * ci.quantity, 0);
  }, [cart]);

  // GST 5% standard restaurant tax as defined in PRD Section 4.1 & Figure 8.3
  const gst = useMemo(() => {
    const taxable = Math.max(0, subtotal - discountAmount);
    return Math.round(taxable * 0.05);
  }, [subtotal, discountAmount]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + gst);
  }, [subtotal, discountAmount, gst]);

  // Place order handler
  const placeOrder = customerData => {
    const newOrder = {
      orderNo: `BO-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber,
      orderType,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      gst,
      total: finalTotal,
      customer: customerData,
      status: 'Pending', // Pending -> Preparing -> Ready -> Served (as per PRD Figure 10.2)
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setPlacedOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        orderType,
        setOrderType,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemCount,
        subtotal,
        gst,
        discountAmount,
        finalTotal,
        couponCode,
        couponError,
        applyCoupon,
        removeCoupon,
        customizingItem,
        setCustomizingItem,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placedOrder,
        setPlacedOrder,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
