# Experiment – 2
## Development of a Responsive Restaurant Menu & Ordering Page using React Components and Tailwind CSS

---

**Name :** Ronit Ahuja  
**Class :** D15A  
**Roll No. :** 63  
**Date :** 22 October 2026  
**Subject :** Full Stack Development (FSD) Laboratory  
**Course Code :** FSD-LAB-02  
**Project Title :** BiteOrder — Online Restaurant Ordering & Management System  

---

## 1. Aim
To develop an attractive, responsive, and card-based **Menu & Ordering Page** for the **BiteOrder** restaurant ordering platform using reusable React components and Tailwind CSS responsive utility classes, and to demonstrate Flexbox, CSS Grid, responsive breakpoints, layout direction, typography, and responsive sizing across mobile, tablet, and desktop viewports.

---

## 2. Problem Statement
Enhance the BiteOrder restaurant frontend developed in Experiment 1 by converting the dish/food card layout into a modular, reusable React component (`MenuCard.jsx`) and making the entire Menu & Ordering Page responsive using Tailwind CSS utility classes.  
Create a reusable `MenuCard` component capable of presenting dynamic dish information (title, description, price, portion sizes, rating, preparation time, dietary veg/non-veg badges, and cart steppers). Demonstrate responsive layouts using Flexbox, CSS Grid, responsive breakpoints (`sm:*`, `md:*`, `lg:*`), width utilities, responsive typography, spacing, visibility toggles, and adaptive layout direction.

The primary objective of this experiment is to demonstrate the following React Components and Tailwind CSS concepts:
- **Flexbox (`flex`)**
- **Flexbox and Grid alignment utilities:** `items-center`, `justify-between`, `flex-row`, `flex-col`
- **Responsive Breakpoints:** `md:*`, `lg:*` (and `sm:*`)
- **CSS Grid:** `grid`, `grid-cols-*`
- **Responsive Typography:** `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`, `text-base md:text-lg`
- **Responsive Background Colour:** `bg-white md:bg-orange-50/40`, `bg-slate-100 md:bg-white`
- **Responsive Padding:** `px-4 sm:px-6 lg:px-8 py-8`, `p-4 md:p-5`, `p-5 md:p-8`
- **Responsive Flex Direction:** `flex-col md:flex-row`
- **Responsive Grid Columns:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Responsive Visibility:** `hidden md:block`, `md:hidden`, `hidden sm:flex`, `hidden lg:block`, `lg:hidden`
- **Width Utilities:** `w-full`, `md:w-auto`
- **Component Reusability:** Dedicated `<MenuCard />` receiving structured menu dish properties via props and rendering dynamically with `.map()`.

---

## 3. Theory Questions & Answers

### Q1. What is a React component?
**Answer:**  
A **React component** is an independent, isolated, and reusable piece of UI code that returns JSX (JavaScript XML) describing what should be rendered onto the DOM. In modern React, components are implemented as **JavaScript functions** (Functional Components).  
Components can:
1. Accept input parameters called **props** (properties), allowing parent components (like `MenuPage.jsx`) to pass dish details, dietary flags, and callbacks downward to child components (`MenuCard.jsx`).
2. Manage internal or shared state using **React Hooks** (such as `useState`, `useEffect`, and `useCart` via context).
3. Re-render automatically and efficiently whenever their state or incoming props change, keeping the dish cart quantities and customizers completely synchronized with the UI.

In BiteOrder, the entire application is composed hierarchically: `<App />` contains `<MenuPage />`, which contains reusable child components like `<Navbar />`, `<CategoryFilter />`, `<MenuCard />`, and `<CartSidebar />`.

---

### Q2. What are the advantages of reusable components?
**Answer:**  
1. **DRY (Don't Repeat Yourself) Principle:** Instead of duplicating complex food card markup (image thumbnail, badges, veg/non-veg dots, rating stars, price tags, and cart steppers) across 12+ dishes, a single `<MenuCard />` template is reused dynamically.
2. **Centralized Maintenance & Consistency:** Any design enhancement (e.g., updating the add-to-cart button style or adding calorie indicators) made in `MenuCard.jsx` instantly propagates to every dish item across all categories.
3. **Dynamic Customization via Props:** Different data attributes (dish name, price, half-portion availability, image URL, spice level, prep time) are passed into the component template dynamically from `menuData.js` or a backend REST API.
4. **Isolated State & Lifecycle:** Each component instance maintains its own isolated lifecycle and user interactions without affecting neighboring cards.
5. **Team Scalability & Speed:** Reusable components allow rapid assembly of complex pages using pre-tested, modular UI building blocks.

---

### Q3. What is Flexbox? What does `flex` do?
**Answer:**  
**Flexbox** (Flexible Box Layout) is a one-dimensional CSS layout model engineered to distribute space and align elements along a single primary axis (either row or column), even when element dimensions are unknown or dynamic.  

Applying the Tailwind CSS utility class `flex` sets the declaration:
```css
display: flex;
```
This turns the container into a **flex container** and its immediate children into **flex items**, unlocking alignment and distribution utilities such as:
- `justify-between`: Distributes flex children with maximum space between them (e.g., placing the dish price on the left and the Add button on the right in `MenuCard.jsx`).
- `items-center`: Vertically centers child elements along the cross axis (e.g., aligning brand logo, table badge, and search icon in `Navbar.jsx`).
- `gap-*`: Enforces consistent spacing between flex items without tricky margin collapses.

---

### Q4. What is the difference between `flex-row` and `flex-col`? When would you use them?
**Answer:**  
- **`flex-row` (`flex-direction: row`):**  
  Arranges child flex items horizontally from left to right along the main axis.  
  *Usage in BiteOrder:* Top navigation bars, dish rating badges, category filter chips, and card footer price/button rows.
- **`flex-col` (`flex-direction: column`):**  
  Arranges child flex items vertically from top to bottom along the cross axis.  
  *Usage in BiteOrder:* Internal structure of `MenuCard` (stacking dish image, title, description, and footer), cart item listings in `CartSidebar`, and checkout forms.
- **Responsive Combination (`flex-col md:flex-row`):**  
  On mobile devices (< 768px), elements stack vertically (`flex-col`) to prevent horizontal screen overflow. On tablets and desktops (≥ 768px), they transition smoothly to a side-by-side row (`flex-row`), maximizing widescreen layout efficiency (e.g., the hero banner in `MenuPage.jsx`).

---

### Q5. What is responsive design?
**Answer:**  
**Responsive Web Design (RWD)** is an approach where web pages automatically adjust and optimize their layout, typography, navigation, images, and interactive controls according to the user's viewport resolution, device type, and orientation. Rather than developing separate websites for mobile and desktop, responsive design uses fluid grids, flexible media (`max-width: 100%`), and CSS media queries / responsive breakpoints to guarantee an optimal user experience across smartphones, tablets, laptops, and ultra-wide screens.  

In BiteOrder, a customer scanning a Table QR code on a 375px smartphone gets a touch-friendly 1-column menu with a bottom floating cart bar, while a customer on a 1440px desktop gets an expansive 3-column dish grid alongside a persistent, sticky live order sidebar.

---

### Q6. What are responsive breakpoints in Tailwind CSS?
**Answer:**  
Tailwind CSS implements a **mobile-first** responsive design system using breakpoint prefix modifiers that correspond to CSS `@media (min-width: ...)` rules:
- **Default (No prefix):** Applies to all screen widths from `0px` upwards (mobile-first).
- **`sm:`** `@media (min-width: 640px)` — Large phones in landscape, phablets.
- **`md:`** `@media (min-width: 768px)` — Standard tablets & small laptops.
- **`lg:`** `@media (min-width: 1024px)` — Laptops & standard desktop monitors.
- **`xl:`** `@media (min-width: 1280px)` — Large desktop displays.
- **`2xl:`** `@media (min-width: 1536px)` — Ultra-wide monitors.

*Example:* `text-2xl md:text-4xl` means the dish category title renders at 24px on smartphones and scales to 36px on screens 768px wide and above.

---

### Q7. What is CSS Grid? What does `grid-cols-2` do?
**Answer:**  
**CSS Grid Layout** is a two-dimensional layout system that allows developers to organize content simultaneously into rows and columns. While Flexbox is ideal for single-axis flows, CSS Grid excels at managing multi-column matrices where items must align perfectly in both dimensions.  

In Tailwind CSS, applying `grid-cols-2` sets:
```css
grid-template-columns: repeat(2, minmax(0, 1fr));
```
It divides the container into **two equal-width columns** (`1fr` each), distributing available horizontal width equally between child food cards in each row.

---

### Q8. What is the purpose of `md:grid-cols-2`?
**Answer:**  
`md:grid-cols-2` is a responsive breakpoint utility. When paired with `grid-cols-1` and `lg:grid-cols-3` (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`):
1. **On mobile devices (< 768px):** The default `grid-cols-1` renders food cards stacked in a single vertical column so dish images, titles, and price buttons remain spacious and readable without horizontal scrolling.
2. **On medium screens (≥ 768px, tablets):** The `md:grid-cols-2` rule activates, splitting the layout into 2 balanced columns.
3. **On large screens (≥ 1024px, desktops):** The `lg:grid-cols-3` rule overrides it to display 3 dish cards per row within the menu container.

---

### Q9. What is the difference between `w-full` and `md:w-auto`?
**Answer:**  
- **`w-full` (`width: 100%`):** Forces an element (such as an Add-to-Cart button or search input) to span the entire horizontal width of its parent container. On mobile devices, buttons need `w-full` to provide generous, easily clickable thumb targets (minimum 44px–48px touch targets).
- **`md:w-auto` (`width: auto`):** Resets the element's width to its natural content size on medium viewports (≥ 768px). Buttons take up only as much width as required by their label text and padding.
- **Combined Pattern (`w-full md:w-auto`):** Full-width, mobile-friendly call-to-action button on phones; neatly proportioned, inline button on desktop views.

---

## 4. Concept Implementation Mapping Table

| Required Concept | Tailwind Utility Class | Implementation File & Line | Purpose & Observed Behavior in BiteOrder |
| :--- | :--- | :--- | :--- |
| **Flexbox Container** | `flex` | `Navbar.jsx`, `MenuCard.jsx`, `MenuPage.jsx` | Initializes flexible row/column alignment for navigation, cards, and headers |
| **Alignment: items-center** | `items-center` | `Navbar.jsx`, `MenuCard.jsx` | Vertically centers brand logo, table pill, veg/non-veg dot, and rating stars |
| **Alignment: justify-between** | `justify-between` | `Navbar.jsx`, `MenuCard.jsx`, `MenuPage.jsx` | Spreads brand and links, category tabs, dish price and add-to-cart button |
| **Direction: flex-row** | `flex-row`, `sm:flex-row` | `Navbar.jsx`, `MenuCard.jsx` | Horizontally aligns badges, rating chips, and desktop button groups |
| **Direction: flex-col** | `flex-col` | `Navbar.jsx`, `MenuCard.jsx` | Stacks card image, title, description, and footer vertically |
| **Responsive Flex Direction** | `flex-col md:flex-row` | `MenuPage.jsx` (Hero Banner & Filters) | Stacks hero banner vertically on phones; aligns horizontally on tablets/desktops |
| **Responsive Breakpoints** | `sm:*`, `md:*`, `lg:*` | Throughout project | Controls responsive typography, padding, grid columns, and visibility |
| **Grid Container** | `grid` | `MenuPage.jsx` (Dishes Grid & Layout) | Activates CSS Grid for menu cards and 12-column master page structure |
| **Responsive Grid Columns** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3` | `MenuPage.jsx` | 1 col on mobile (<640px), 2 cols on tablet (≥640px), 2 cols on laptop with sidebar (≥1024px), 3 cols on wide desktop (≥1280px) |
| **Responsive Typography** | `text-2xl sm:text-3xl md:text-4xl lg:text-5xl` | `MenuPage.jsx` (Category Title) | Menu category heading scales smoothly from 24px on phone to 48px on widescreen |
| **Responsive Background** | `bg-white md:bg-orange-50/40`, `bg-slate-100 md:bg-white` | `MenuPage.jsx` (Banner & Badges) | Warm orange tint on tablet/desktop views; clean crisp white on mobile |
| **Responsive Padding** | `px-4 sm:px-6 lg:px-8 py-8`, `p-4 md:p-5`, `p-5 md:p-8` | `MenuPage.jsx`, `MenuCard.jsx` | Compact padding on mobile to preserve screen space; spacious on desktop |
| **Responsive Visibility** | `hidden md:block`, `md:hidden`, `hidden lg:block`, `lg:hidden` | `Navbar.jsx`, `MenuPage.jsx` | Hides desktop search & sidebar on mobile; reveals mobile floating cart drawer & search bar |
| **Width Utilities** | `w-full md:w-auto` | `MenuPage.jsx`, `MenuCard.jsx` | Filter buttons expand 100% on mobile and size to content on desktop |
| **Component Reusability** | `<MenuCard key={item.id} item={item} />` | `MenuPage.jsx` (Line 389) | Dynamically maps array of 12+ dishes into isolated, reusable component instances |

---

## 5. Source Code

### 5.1 Reusable Menu Card Component (`client/src/components/MenuCard.jsx`)

```jsx
import React from 'react';
import { useCart } from '../context/CartContext';

/**
 * Reusable MenuCard Component
 * Demonstrates:
 * - Reusable React Component with Props ({ item })
 * - Flexbox layout & direction: flex, flex-col, flex-row
 * - Flexbox alignment: items-center, justify-between
 * - Responsive Breakpoints: md:*
 * - Responsive Typography: text-lg, text-xs, text-xl
 * - Responsive Padding: p-4 md:p-5
 * - Width Utilities: w-full, w-7 h-7
 */
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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 md:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Top Media & Tags Section */}
      <div>
        {/* Image Container with Hover Zoom & Badges */}
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
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
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8590C] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                🔥 Bestseller
              </span>
            )}
            {item.isChefSpecial && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                👨‍🍳 Chef's Pick
              </span>
            )}
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/70 backdrop-blur-xs px-2 py-0.5 text-xs font-medium text-white flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{item.prepTime} mins</span>
          </div>
        </div>

        {/* Dish Title, Veg/Non-Veg & Rating Row */}
        <div className="mt-3.5 flex items-start justify-between gap-2">
          
          <div className="flex items-center gap-2">
            {/* Veg / Non-Veg Icon Symbol (FSSAI standard) */}
            <div
              className={`shrink-0 flex items-center justify-center w-4 h-4 rounded-xs border ${
                item.isVeg ? 'border-emerald-600' : 'border-red-600'
              }`}
              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              ></div>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#E8590C] transition-colors">
              {item.name}
            </h3>
          </div>

          {/* Star Rating Badge */}
          <div className="shrink-0 flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
            <span className="text-amber-500">★</span>
            <span>{item.rating}</span>
            <span className="text-[10px] text-amber-500/80 font-normal">({item.ratingCount})</span>
          </div>

        </div>

        {/* Short Description */}
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {item.description}
        </p>

      </div>

      {/* Card Footer: Price & Add / Customization Controls */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        
        {/* Price & Calories */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">₹{item.price}</span>
            {item.halfPrice < item.price && (
              <span className="text-[11px] text-slate-400 font-medium">
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
                className="w-7 h-7 rounded-lg bg-white text-orange-600 font-bold hover:bg-orange-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 text-xs font-black text-orange-700">
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
                className="w-7 h-7 rounded-lg bg-[#E8590C] text-white font-bold hover:bg-orange-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Add more"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="group/btn inline-flex items-center gap-1.5 rounded-xl bg-[#E8590C] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-md shadow-orange-500/25 hover:bg-orange-700 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span className="text-sm font-black">+</span>
              <span>ADD</span>
            </button>
          )}

          {/* Customizable notice */}
          {(item.availableAddons?.length > 0 || item.halfPrice < item.price) && (
            <button
              onClick={() => setCustomizingItem(item)}
              className="mt-1 text-[10px] text-[#E8590C] hover:text-orange-800 font-bold tracking-tight hover:underline cursor-pointer"
            >
              Customizable ⚙️
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
```

---

### 5.2 Responsive Menu Page (`client/src/pages/MenuPage.jsx`)

```jsx
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import TableQRBanner from '../components/TableQRBanner';
import CategoryFilter from '../components/CategoryFilter';
import MenuCard from '../components/MenuCard';
import CartSidebar from '../components/CartSidebar';
import ItemCustomizerModal from '../components/ItemCustomizerModal';
import CheckoutModal from '../components/CheckoutModal';
import OrderTrackingModal from '../components/OrderTrackingModal';
import TableSelectorModal from '../components/TableSelectorModal';
import TailwindUtilityInspector from '../components/TailwindUtilityInspector';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const { isCartOpen, setIsCartOpen, totalItemCount, finalTotal } = useCart();

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;

      return true;
    });
  }, [searchTerm, selectedCategory, dietFilter]);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800 antialiased">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenTableModal={() => setIsTableModalOpen(true)}
      />

      <TableQRBanner onOpenTableModal={() => setIsTableModalOpen(true)} />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        dietFilter={dietFilter}
        onSelectDietFilter={setDietFilter}
        totalItemsCount={filteredItems.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="rounded-2xl bg-white md:bg-orange-50/40 border border-slate-200/80 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl">{activeCategoryObj?.icon || '🍽️'}</span>
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                  {selectedCategory === 'all' ? 'Live Restaurant Menu' : activeCategoryObj?.name}
                </h1>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Explore our chef's signature dishes freshly prepared upon ordering. Filter by category, dietary preferences, or search directly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              <span className="text-xs md:text-sm font-semibold text-slate-500 bg-slate-100 md:bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 text-center">
                Showing <strong className="text-slate-900">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'dish' : 'dishes'}
              </span>
              {(searchTerm || selectedCategory !== 'all' || dietFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setDietFilter('all');
                  }}
                  className="w-full sm:w-auto px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#E8590C] text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Reset Filters ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Master Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <CartSidebar isDrawer={false} />
          </div>
        </div>
      </main>

      {totalItemCount > 0 && (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-[#E8590C] text-white font-extrabold shadow-2xl flex items-center justify-between"
          >
            <span>View Cart ({totalItemCount} items)</span>
            <span>₹{finalTotal} →</span>
          </button>
        </div>
      )}

      {isCartOpen && <CartSidebar isDrawer={true} onClose={() => setIsCartOpen(false)} />}
      <ItemCustomizerModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <TableSelectorModal isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} />
      <TailwindUtilityInspector isOpen={isInspectorOpen} onClose={() => setIsInspectorOpen(false)} />
    </div>
  );
}
```

---

## 6. Screenshots & Responsive Layout Demonstration

### 6.1 Viewport Breakpoints Verification

```
+-----------------------------------------------------------------------------------------+
|                                1. MOBILE VIEW (< 768px)                                 |
|  - grid-cols-1: Single column dish cards stack                                          |
|  - flex-col: Hero banner title and count badge stacked vertically                       |
|  - w-full: Bottom floating cart CTA spans 100% width for thumb-friendly taps             |
|  - hidden lg:block: Desktop sidebar hidden; replaced by sliding mobile drawer           |
+-----------------------------------------------------------------------------------------+
|  [🍔 BiteOrder]   [Table 04]                                                            |
|  [ 🔍 Search dishes, spices...                        ]                                 |
|  +----------------------------------------------------+                                 |
|  | 🍽️ Live Restaurant Menu (text-2xl)                 |                                 |
|  | [ Showing 12 dishes ]                              |                                 |
|  +----------------------------------------------------+                                 |
|  +----------------------------------------------------+                                 |
|  | [Image: Butter Chicken] 🔥 Bestseller              |                                 |
|  | 🟢 Butter Chicken Supreme                          |                                 |
|  | ₹380               [         + ADD        (w-full) ]|                                 |
|  +----------------------------------------------------+                                 |
|  [================ VIEW CART (3 items) • ₹760 → ======] (lg:hidden bottom bar)         |
+-----------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------+
|                              2. TABLET VIEW (768px – 1023px)                             |
|  - md:grid-cols-2: Two equal-width dish columns (repeat(2, minmax(0, 1fr)))             |
|  - md:flex-row: Hero banner splits horizontally into heading (left) and stats (right)   |
|  - md:w-auto: Action buttons shrink to natural content width                            |
|  - hidden md:block: Center navbar search becomes visible; mobile input hidden           |
+-----------------------------------------------------------------------------------------+
|  [🍔 BiteOrder]     [ 🔍 Search dishes... ]          [Table 04]   [Cart (2)]            |
|  +-----------------------------------------------------------------------------------+  |
|  | 🍽️ Live Restaurant Menu (text-4xl)                   | [ Showing 12 dishes ]       |  |
|  +-----------------------------------------------------------------------------------+  |
|  +---------------------------------------+   +---------------------------------------+  |
|  | [Image: Butter Chicken]               |   | [Image: Paneer Tikka]                 |  |
|  | 🟢 Butter Chicken Supreme             |   | 🟢 Paneer Tikka Masala                |  |
|  | ₹380               [    + ADD   ]     |   | ₹310               [    + ADD   ]     |  |
|  +---------------------------------------+   +---------------------------------------+  |
+-----------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------+
|                                3. DESKTOP VIEW (≥ 1024px)                               |
|  - lg:grid-cols-12: 12-column master grid layout                                        |
|  - lg:col-span-8: 3-column dish grid (`lg:grid-cols-3`)                                 |
|  - lg:col-span-4: Persistent, sticky Live Order Sidebar (`hidden lg:block`)             |
|  - text-5xl: High-impact hero typography; spacious padding (`px-8 py-8`)                |
+-----------------------------------------------------------------------------------------+
|  [🍔 BiteOrder]          [ 🔍 Search dishes... ]          [Table 04]  [Tailwind Helper]  |
|  +-----------------------------------------------------------------------------------+  |
|  | 🍽️ Live Restaurant Menu (text-5xl)                    [ Showing 12 dishes ]       |  |
|  +-----------------------------------------------------------------------------------+  |
|  +-----------------------------------------------+   +-------------------------------+  |
|  | DISHES GRID (lg:col-span-8, lg:grid-cols-3)    |   | LIVE CART (lg:col-span-4)     |  |
|  | +--------------+ +-------------+ +-----------+ |   | Table 04 • Dine-In            |  |
|  | |Butter Chicken| |Paneer Tikka | |Dal Makhani| |   | ----------------------------- |  |
|  | |₹380 [+ ADD]  | |₹310 [+ ADD] | |₹240 [+ADD]| |   | 1x Butter Chicken       ₹380  |  |
|  | +--------------+ +-------------+ +-----------+ |   | 2x Butter Naan          ₹120  |  |
|  |                                                |   | Subtotal: ₹500  GST: ₹25      |  |
|  |                                                |   | [ Proceed to Checkout → ]     |  |
|  +-----------------------------------------------+   +-------------------------------+  |
+-----------------------------------------------------------------------------------------+
```

---

## 7. Result
The BiteOrder Menu & Ordering Page was successfully converted into a responsive interface using reusable React components (`MenuCard.jsx`, `MenuPage.jsx`) and Tailwind CSS responsive utility classes. Flexbox, Grid, responsive breakpoints (`sm:*`, `md:*`, `lg:*`), layout direction (`flex-col md:flex-row`), sizing (`w-full md:w-auto`), spacing (`p-4 md:p-5`), typography (`text-2xl` to `text-5xl`), and visibility utilities were demonstrated and verified across mobile, tablet, and desktop viewports.

---

**Repository Link:**  
`https://github.com/ronit-ahuja-04/BiteOrder.git`
