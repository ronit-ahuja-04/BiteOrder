# Experiment – 3
## Development of an Interactive Restaurant Ordering Application using React Hooks and State Management

---

**Name :** Ronit Ahuja  
**Class :** D15A  
**Roll No. :** 63  
**Date :** 22 October 2026  
**Subject :** Full Stack Development (FSD) Laboratory  
**Course Code :** FSD-LAB-03  
**Project Title :** BiteOrder — Online Restaurant Ordering & Management System  

---

## 1. Aim
To develop an interactive **Restaurant Menu & Ordering Application (BiteOrder)** using React Hooks and State Management, and to understand and demonstrate the use of `useState`, `useEffect`, and `useContext` for managing component state, handling side effects, and sharing data across React components without prop drilling.

---

## 2. Problem Statement
Develop an interactive Restaurant Ordering application for **BiteOrder** using React.  
Enhance the food menu interface developed in previous experiments by integrating robust, reactive state management and interactive features such as real-time dish searching, multi-criteria filtering (category, pure veg, non-veg), customizable dish options (portion sizes, add-ons, cooking notes), cart quantity manipulation, coupon discounts, table number selection, and live order tracking.

The application must demonstrate the following React concepts:
- **`useState`** for managing local component state (search input, active filters, portion selection, modal dialogs, and forms).
- **`useEffect`** for handling side effects (synchronizing cart state with browser `localStorage`, listening to window resizing, and running automated live order preparation timers with cleanup functions).
- **`useContext`** and **Context API (`createContext`)** for centralized, global state management across decoupled components (`Navbar`, `MenuCard`, `CartSidebar`, modals).
- **Event Handling** in React (`onClick`, `onChange`, `onSubmit`, keyboard navigation).
- **Conditional Rendering** (empty cart alerts, veg/non-veg indicators, badge chips, modal overlays, coupon validation feedback).
- **Passing & Updating State** between parent and child components via props, callbacks, and context actions.
- **Dynamic Rendering** of dishes, categories, addons, and order line items using array mapping (`.map()`, `.filter()`, `.reduce()`).

---

## 3. Theory Questions & Answers

### Q1. What are React Hooks?
**Answer:**  
**React Hooks** are built-in functions introduced in React 16.8 that allow functional components to "hook into" React state and lifecycle features without writing ES6 class components.  
Before Hooks, state and lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) were exclusive to class components, which often led to bloated boilerplate, confusing `this` binding issues, and difficult-to-reuse logic. Hooks allow developers to write pure, concise functional components while fully leveraging state, context, references, memoization, and side effects.  

Common built-in hooks include:
- `useState`: Local state declaration and updates.
- `useEffect`: Execution of side effects and lifecycle management.
- `useContext`: Subscription to React Context for global state.
- `useMemo`: Caching expensive computational values.
- `useCallback`: Caching function definitions between re-renders.
- `useRef`: Retaining mutable references without triggering re-renders.

---

### Q2. What is the purpose of `useState()`?
**Answer:**  
The `useState()` hook allows functional components to declare, initialize, and update **reactive local state**.  
When invoked, `useState(initialValue)` returns an array containing exactly two elements:
1. **The current state variable:** Holds the reactive data.
2. **The setter function:** Used to update the state variable and notify React to schedule a re-render of the component.

**Syntax & Example in BiteOrder:**
```jsx
// Declaring search query state initialized to an empty string
const [searchTerm, setSearchTerm] = useState('');

// Updating state in an input event handler triggers UI re-render
<input 
  value={searchTerm} 
  onChange={(e) => setSearchTerm(e.target.value)} 
/>
```

---

### Q3. What is the difference between a normal variable and state in React?
**Answer:**  

| Characteristic | Normal JavaScript Variable (`let` / `const`) | React Component State (`useState`) |
| :--- | :--- | :--- |
| **Re-render Trigger** | Mutating the variable does **not** trigger a component re-render. The DOM remains unchanged. | Calling the setter function notifies React to schedule a re-render and update the Virtual DOM. |
| **Persistence Across Renders** | Normal variables are re-initialized and wiped out on every component re-render. | State values are preserved by React's internal fiber node between consecutive renders. |
| **Immutability** | Can be reassigned directly (`count = count + 1`). | Must be updated immutably via its setter function (`setCount(prev => prev + 1)`). |
| **DOM Synchronization** | Values are disconnected from the React rendering pipeline. | Automatically reflected in the JSX returned by the component. |

---

### Q4. What is `useEffect()`?
**Answer:**  
`useEffect()` is a React hook designed to perform **side effects** in functional components. A side effect is any operation that reaches outside the functional scope of a component calculation or affects things outside React's render cycle.  

Typical side effects include:
1. Synchronizing with browser APIs (e.g., saving cart state to `localStorage`).
2. Data fetching from backend REST APIs.
3. Setting up subscriptions, intervals, or timers (e.g., simulating order status progression).
4. Direct DOM manipulations or listening to global browser events (`resize`, `hashchange`).

**Syntax:**
```jsx
useEffect(() => {
  // Side effect code runs here
  return () => {
    // Optional cleanup code runs when component unmounts or before re-running
  };
}, [dependencyArray]);
```

---

### Q5. When is `useEffect()` executed?
**Answer:**  
`useEffect()` is executed **after the component renders and the DOM has been painted** on screen by the browser. This prevents blocking the browser UI from displaying content.  
Its execution timing depends directly on the **dependency array**:
1. **Without Dependency Array (`useEffect(fn)`):** Runs after the initial mount **and after every single re-render**.
2. **With Empty Dependency Array (`useEffect(fn, [])`):** Runs **only once** immediately after the initial mount, functioning like `componentDidMount`.
3. **With Dependencies (`useEffect(fn, [cart, tableNumber])`):** Runs on mount, and then re-runs **only if at least one dependency value changes** (by shallow reference equality) between renders.
4. **Cleanup Phase:** If a cleanup function is returned, it executes before the effect re-runs and right before the component unmounts.

---

### Q6. What is the purpose of the dependency array in `useEffect()`?
**Answer:**  
The **dependency array** tells React exactly which state variables or props the effect relies on. React compares each dependency's current value against its value in the previous render using `Object.is()` comparison:
- If all values are identical, React **skips** executing the effect, conserving CPU cycles.
- If any dependency has changed, React invokes the effect.

**Crucial Purposes:**
1. **Prevents Infinite Render Loops:** An effect that updates state without a dependency array causes continuous re-rendering (`Render -> Effect -> State Update -> Re-render -> Effect...`).
2. **Controls Execution Frequency:** Restricts expensive operations (like API calls or storage synchronization) to only occur when relevant parameters change.

---

### Q7. What is `useContext()`?
**Answer:**  
`useContext()` is a React hook that enables any child or descendant component in the tree to read and subscribe to values provided by a **React Context**, without manually passing props through intermediate components.  

**How it Works in BiteOrder:**
```jsx
// 1. Consume the global CartContext anywhere in the component tree
const { cart, addToCart, finalTotal } = useCart();
```
Whenever the Context Provider's value changes (such as adding a dish to the cart), every component calling `useContext(CartContext)` automatically re-renders with the fresh data.

---

### Q8. What is Context API in React?
**Answer:**  
The **Context API** is a built-in state management mechanism provided natively by React (comprising `createContext`, `<Context.Provider>`, and `useContext`). It creates a global or scoped state container that sits high up in the component tree, broadcasting data and updater functions downwards to all interested child components regardless of how deeply nested they are.  

**Core Structure in BiteOrder:**
```
<CartProvider>  (Provides: cart, addToCart, tableNumber, finalTotal, placedOrder)
  ├── <Navbar />             (Reads: tableNumber, cartItemCount, finalTotal)
  ├── <CategoryFilter />     (Reads: selectedCategory)
  ├── <MenuPage />           
  │     ├── <MenuCard />     (Calls: addToCart, setCustomizingItem)
  │     └── <CartSidebar />  (Reads: cart, updates: updateQuantity, placeOrder)
  ├── <ItemCustomizerModal />(Updates: addToCart with chosen addons)
  └── <CheckoutModal />      (Calls: placeOrder)
```

---

### Q9. What is prop drilling?
**Answer:**  
**Prop drilling** (also called "threading props") is a scenario in React where data or callback functions must be passed through multiple layers of intermediate components that do not actually need the data themselves, solely to deliver it to a deeply nested target component.  

**Example of Prop Drilling Problem:**
```
App -> MenuPage -> DishesSection -> DishGrid -> MenuCard -> AddButton
```
If `addToCart` is defined at the root, every single intermediate component (`MenuPage`, `DishesSection`, `DishGrid`) must accept and pass `addToCart` as a prop. This causes:
1. Cluttered, unmaintainable component interfaces.
2. Fragile code where renaming or modifying props requires updating 5+ files.
3. Unnecessary re-rendering of intermediate passing components.

---

### Q10. How does Context API help in avoiding prop drilling?
**Answer:**  
Context API completely eliminates prop drilling by establishing a direct "teleportation" channel between the Provider and the Consumer:
1. The **`<CartProvider>`** wraps the application and exposes state (`cart`, `tableNumber`) and dispatch functions (`addToCart`, `updateQuantity`).
2. Any deeply nested component (e.g., `<MenuCard />` or `<CheckoutModal />`) directly accesses what it needs via `useCart()`:
   ```jsx
   const { addToCart } = useCart();
   ```
3. Intermediate layout components (`MenuPage`, grid wrappers) remain pure and uncluttered, needing zero knowledge of cart props.

---

### Q11. What is state management?
**Answer:**  
**State management** is the architectural practice of storing, synchronizing, and updating the dynamic data (state) of an application throughout user interactions, network responses, and application lifecycles.  
In an e-commerce or restaurant system, state management ensures that when a user clicks **"+ ADD"** on a dish card:
1. The cart count in the top `<Navbar />` increments immediately.
2. The item and subtotal inside `<CartSidebar />` update in real time.
3. The mobile bottom floating bar reflects the new bill total.
4. The dish card transforms from an "+ ADD" button into a quantity stepper (`- 1 +`).

---

### Q12. What is the difference between local state and global/shared state?
**Answer:**  

| Metric | Local State (`useState`) | Global / Shared State (Context API) |
| :--- | :--- | :--- |
| **Scope** | Confined within a single component instance. | Accessible to all components wrapped inside the Provider. |
| **BiteOrder Example** | `searchTerm` in `MenuPage.jsx`, `portion` toggle in `ItemCustomizerModal.jsx`. | `cart` items array, `tableNumber`, `placedOrder`, `finalTotal`. |
| **Lifetime** | Created when component mounts; destroyed when component unmounts. | Persists across route navigation, modal openings, and view changes. |
| **Accessibility** | Cannot be read by sibling or parent components directly. | Any child component can consume or update it via `useCart()`. |
| **Best Used For** | Transient UI states: form inputs, accordion open/close, active tab. | Business domain data: user session, cart, checkout status, themes. |

---

### Q13. What is conditional rendering in React?
**Answer:**  
**Conditional rendering** refers to the ability to render distinct JSX markup or components depending on whether certain conditions (state, props, or expressions) evaluate to `true` or `false`.  

Common techniques in BiteOrder:
1. **Logical AND (`&&`) Operator:**
   ```jsx
   {/* Render Bestseller tag only if flag is true */}
   {item.isBestseller && <span className="bg-orange-500">🔥 Bestseller</span>}
   ```
2. **Ternary (`condition ? A : B`) Operator:**
   ```jsx
   {/* Render quantity stepper if in cart; otherwise render ADD button */}
   {totalQuantityInCart > 0 ? (
     <Stepper quantity={totalQuantityInCart} />
   ) : (
     <button onClick={handleAdd}>+ ADD</button>
   )}
   ```
3. **Early Return Guard Clause:**
   ```jsx
   {/* Don't render modal if no item is selected */}
   if (!customizingItem) return null;
   ```

---

### Q14. How does React update the UI when state changes?
**Answer:**  
React uses a high-performance **reconciliation algorithm** based on the **Virtual DOM**:
1. **Trigger:** A state update occurs (e.g., `setCart([...])`).
2. **Render Phase:** React re-invokes the component function and generates a new lightweight in-memory JavaScript representation of the UI called the **Virtual DOM tree**.
3. **Diffing Algorithm:** React compares (diffs) the newly generated Virtual DOM tree with the previous Virtual DOM snapshot to detect precisely what changed.
4. **Commit Phase:** React batches and applies **only the exact DOM mutations** (e.g., modifying text inside a single `<span>₹788</span>`) to the real browser DOM, rather than reloading the entire webpage.

---

### Q15. Why are Hooks useful in modern React applications?
**Answer:**  
1. **Code Reusability via Custom Hooks:** Developers can encapsulate stateful logic into custom hooks (like `useCart()`) and share it across multiple components without duplicating code.
2. **Better Readability & Less Boilerplate:** Eliminates verbose class syntax, constructors, `this` keyword bugs, and lifecycle duplication.
3. **Colocation of Concerns:** Related logic (such as setting up an interval and clearing it in `useEffect`) is written together in a single block rather than split across `componentDidMount` and `componentWillUnmount`.
4. **Functional Purity:** Promotes the functional programming paradigm, making code easier to test, debug, and optimize.

---

## 4. Key React Hooks Code Demonstrations

### 4.1 State Management using Context API (`client/src/context/CartContext.jsx`)
Demonstrates: `createContext()`, `useContext()`, `useState()`, `useEffect()` for localStorage persistence, and state updater functions.

```jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MENU_ITEMS } from '../data/menuData';

// 1. Create Context
const CartContext = createContext();

// 2. Context Provider Component
export function CartProvider({ children }) {
  const [tableNumber, setTableNumber] = useState('12');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const [cart, setCart] = useState([]);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Side Effect 1: Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('biteorder_cart');
      const savedTable = localStorage.getItem('biteorder_table');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedTable) setTableNumber(savedTable);
    } catch (e) {
      console.warn('localStorage read error', e);
    }
  }, []); // Empty dependency array: runs only once on mount

  // Side Effect 2: Persist cart to localStorage whenever cart or tableNumber changes
  useEffect(() => {
    try {
      localStorage.setItem('biteorder_cart', JSON.stringify(cart));
      localStorage.setItem('biteorder_table', tableNumber);
    } catch (e) {
      console.warn('localStorage write error', e);
    }
  }, [cart, tableNumber]); // Runs whenever cart or tableNumber updates

  // State Update Function: Add dish with customizations to cart
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
      }
      return [...prevCart, { cartItemId, item, portion, quantity, selectedAddons, specialInstructions, unitPrice }];
    });
  };

  // State Update Function: Stepper increment / decrement
  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart =>
      prevCart
        .map(ci => (ci.cartItemId === cartItemId ? { ...ci, quantity: ci.quantity + delta } : ci))
        .filter(ci => ci.quantity > 0)
    );
  };

  // Memoized derived calculations
  const totalItemCount = useMemo(() => cart.reduce((acc, ci) => acc + ci.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((acc, ci) => acc + ci.unitPrice * ci.quantity, 0), [cart]);
  const gst = useMemo(() => Math.round(Math.max(0, subtotal - discountAmount) * 0.05), [subtotal, discountAmount]);
  const finalTotal = useMemo(() => Math.max(0, subtotal - discountAmount + gst), [subtotal, discountAmount, gst]);

  return (
    <CartContext.Provider
      value={{
        tableNumber, setTableNumber,
        orderType, setOrderType,
        cart, addToCart, updateQuantity,
        totalItemCount, subtotal, gst, discountAmount, finalTotal,
        customizingItem, setCustomizingItem,
        isCartOpen, setIsCartOpen,
        isCheckoutOpen, setIsCheckoutOpen,
        placedOrder, setPlacedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Custom Consumer Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
```

---

### 4.2 Dynamic Search & Multi-criteria Filtering (`client/src/pages/MenuPage.jsx`)
Demonstrates: `useState` for search & category filters, and `useMemo` for dynamic query computation.

```jsx
import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';

export default function MenuPage() {
  // Local state management for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'

  // Dynamic search and filter calculation
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Text Search matching name, description, or category
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      // 2. Category selection
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // 3. Dietary preferences (Veg / Non-Veg)
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;

      return true;
    });
  }, [searchTerm, selectedCategory, dietFilter]);

  return (
    <div>
      {/* Search Input with event binding */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search dishes or cuisines..."
      />

      {/* Dynamic Dish Cards Rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

---

### 4.3 Dish Customization & Local State (`client/src/components/ItemCustomizerModal.jsx`)
Demonstrates: Local state with `useState`, reactive reset with `useEffect`, and dispatching to global context.

```jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function ItemCustomizerModal() {
  const { customizingItem, setCustomizingItem, addToCart } = useCart();

  // Local state for dish customization
  const [portion, setPortion] = useState('Full');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Side Effect: Reset modal selections whenever a new dish is opened
  useEffect(() => {
    if (customizingItem) {
      setPortion('Full');
      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [customizingItem]);

  // Conditional Rendering: Guard clause
  if (!customizingItem) return null;

  const item = customizingItem;
  const basePrice = portion === 'Half' ? item.halfPrice : item.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalItemPrice = (basePrice + addonsTotal) * quantity;

  const handleConfirm = () => {
    addToCart(item, portion, selectedAddons, specialInstructions, quantity);
    setCustomizingItem(null); // Close modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3>Customize {item.name}</h3>

        {/* Portion selection */}
        <div className="flex gap-2 my-4">
          <button onClick={() => setPortion('Full')} className={portion === 'Full' ? 'bg-orange-500 text-white' : ''}>
            Full Portion (₹{item.price})
          </button>
          <button onClick={() => setPortion('Half')} className={portion === 'Half' ? 'bg-orange-500 text-white' : ''}>
            Half Portion (₹{item.halfPrice})
          </button>
        </div>

        {/* Total & Submit */}
        <button onClick={handleConfirm} className="w-full bg-[#E8590C] text-white py-3 rounded-xl font-bold">
          Add to Order • ₹{totalItemPrice}
        </button>
      </div>
    </div>
  );
}
```

---

### 4.4 Automated Live Order Progression with Timer Cleanup (`client/src/components/OrderTrackingModal.jsx`)
Demonstrates: `useEffect` with intervals, dependency arrays, and cleanup functions.

```jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function OrderTrackingModal() {
  const { placedOrder, setPlacedOrder } = useCart();
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  // Demonstrate useEffect: Side effect running timer to auto-progress kitchen order status
  useEffect(() => {
    if (!placedOrder) return;

    // Start interval
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        if (prev < 3) return prev + 1; // Transitions: Received -> Preparing -> Ready -> Served
        return prev;
      });
    }, 7000); // Advances stage every 7 seconds

    // Crucial Cleanup Function: Clears timer when modal closes or order changes
    return () => clearInterval(interval);
  }, [placedOrder]);

  if (!placedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2>Live Tracking • Order #{placedOrder.orderNo}</h2>
        <p>Current Status: Stage {currentStatusIndex + 1} of 4</p>
      </div>
    </div>
  );
}
```

---

## 5. State Management & Flow Architecture

```
+---------------------------------------------------------------------------------------+
|                                    REACT CONTEXT API                                  |
|                                   <CartProvider />                                    |
|   State: [cart, tableNumber, orderType, customizingItem, isCartOpen, placedOrder]     |
|   Methods: [addToCart(), updateQuantity(), removeFromCart(), placeOrder()]           |
+---------------------------------------------------------------------------------------+
        |                                       |                                   |
        v                                       v                                   v
+------------------+                 +--------------------+              +--------------------+
|   <Navbar />     |                 |  <MenuPage />      |              | <CartSidebar />    |
| - Consumes:      |                 | - Local state:     |              | - Consumes:        |
|   tableNumber,   |                 |   searchTerm       |              |   cart, subtotal,  |
|   totalCount     |                 |   selectedCategory |              |   gst, finalTotal  |
| - Actions:       |                 |   dietFilter       |              | - Actions:         |
|   openCart()     |                 | - Maps items to:   |              |   updateQuantity() |
+------------------+                 |   <MenuCard />     |              |   placeOrder()     |
                                     +--------------------+              +--------------------+
                                                |
                                                v
                                     +--------------------+
                                     |  <MenuCard />      |
                                     | - Checks cart qty  |
                                     | - Triggers:        |
                                     |   addToCart() or   |
                                     |   openCustomizer() |
                                     +--------------------+
```

---

## 6. Result
The interactive Restaurant Menu & Ordering application (**BiteOrder**) was successfully developed using React functional components, React Hooks (`useState`, `useEffect`, `useContext`), and the Context API. Component state management, side effect handling (storage synchronization and automated timers with cleanup), event handling, conditional rendering, and dynamic data rendering were thoroughly demonstrated and verified across the application.

---

**Repository Link:**  
`https://github.com/ronit-ahuja-04/BiteOrder.git`
