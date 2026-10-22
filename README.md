# BiteOrder — Online Restaurant Ordering & Management System

**Student Name:** Ronit Ahuja  
**Class:** D15A  
**Roll No.:** 63  
**Subject:** Full Stack Development (FSD) Laboratory  
**Experiment:** Experiment 3 — Development of a Card-Based Menu & Ordering Page using React and Tailwind CSS  

---

## 🍽️ 1. Project Overview & Aim

**Aim:**  
To design an attractive, accessible, and responsive card-based **Menu & Ordering Page** for the **BiteOrder** Restaurant Ordering Platform using **React** and **Tailwind CSS**, and to experiment with different Tailwind CSS utility classes for styling the dish listing interface, card components, interactive customization modals, and live order cart sidebar.

**Context:**  
As planned in **Experiment 0 (Web Application Design and Planning - BiteOrder)**, traditional paper menus and manual orders are replaced by interactive digital self-ordering. Guests scan their table QR code (e.g. Table 12), browse rich categorized menus, customize dish portions and add-ons, view real-time GST calculations, and place their order directly.

---

## 🎨 2. Tailwind CSS Utility Classes Demonstrated

This experiment strictly demonstrates and experiments with the 12 core Tailwind CSS utility classes:

| # | Utility Category | Tailwind Classes Employed | Purpose & Application in BiteOrder |
|---|---|---|---|
| 1 | **Text Sizes** | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl` | Hierarchical typography: `text-2xl` for dish pricing, `text-lg` for dish titles, `text-xs` for calorie/prep labels |
| 2 | **Background Colour** | `bg-[#E8590C]`, `bg-orange-500`, `bg-white`, `bg-slate-50`, `bg-emerald-600`, `bg-red-600`, `bg-amber-50` | Primary brand call-to-actions, card surfaces, veg (emerald) & non-veg (red) badges |
| 3 | **Text Colour** | `text-slate-900`, `text-slate-600`, `text-slate-400`, `text-white`, `text-[#E8590C]`, `text-emerald-700` | High-contrast WCAG 4.5:1 compliant text for readability |
| 4 | **Font Weight** | `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-black` | Distinguishing bold dish titles and heavy pricing figures from regular body copy |
| 5 | **Text Alignment** | `text-left`, `text-center`, `text-right` | Aligning card text left, table number center, and currency totals right |
| 6 | **Padding** | `p-4`, `p-6`, `px-4`, `py-2`, `py-0.5`, `px-2.5`, `pt-4` | Inner spacing within menu cards, customizer modal dialogs, and pill buttons |
| 7 | **Margin** | `m-0`, `mt-1`, `mt-2`, `mt-4`, `mb-2`, `mx-auto`, `ml-auto` | Outer spacing separating headings from descriptions and cards from footers |
| 8 | **Width & Height** | `w-full`, `w-auto`, `w-4`, `h-4`, `w-12`, `h-12`, `h-48`, `max-w-7xl`, `min-h-screen` | Sizing dish imagery (`h-48 w-full`), icons (`w-12 h-12`), and page boundaries |
| 9 | **Borders** | `border`, `border-2`, `border-slate-200`, `border-orange-500`, `border-dashed` | Delimiting card edges, veg/non-veg indicator squares, and bill divider lines |
| 10 | **Rounded Corners** | `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` | Modern 8px to 16px corner radius on cards and circular category badges |
| 11 | **Shadows** | `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-orange-500/25` | Depth and elevation separating cards and floating drawers from the canvas |
| 12 | **Hover Effects & Transitions** | `hover:shadow-xl`, `hover:-translate-y-1`, `hover:scale-105`, `hover:bg-orange-700`, `transition-all duration-300` | Micro-animations providing tactile feedback when hovering over dishes |

---

## 📐 3. System Architecture & Component Mapping

Based on **Experiment 0 (Section 5.2, 5.3, 5.4 & Section 8)**:

- `client/src/components/Navbar.jsx`: BiteOrder branding, Table 12 chip, live dish search, order mode toggle, and cart trigger.
- `client/src/components/TableQRBanner.jsx`: Table QR recognition strip matching Figure 8.1.
- `client/src/components/CategoryFilter.jsx`: Category pills (Starters, Mains, Breads, Desserts, Beverages) and dietary toggles (Pure Veg, Non-Veg).
- `client/src/components/MenuCard.jsx`: Reusable card component displaying food photo, veg/non-veg symbol, rating, price, and "+ Add" / Customization button.
- `client/src/components/ItemCustomizerModal.jsx`: Modal matching Figure 8.1 Screen 3 (Portion radio buttons, Add-on checkboxes, special instructions, quantity stepper).
- `client/src/components/CartSidebar.jsx`: Real-time order sidebar matching Figure 8.3 & Figure 8.2 (Subtotal, GST 5%, Coupon "BITE10", and Proceed to Checkout).
- `client/src/components/CheckoutModal.jsx`: Gathers customer name, mobile, and payment method (UPI, Card, Cash).
- `client/src/components/OrderTrackingModal.jsx`: Live order status stepper (Received -> Preparing -> Ready -> Served) matching Figure 8.2 Screen 6.
- `client/src/components/TailwindUtilityInspector.jsx`: In-app laboratory modal displaying live demonstration of all 12 Tailwind utility classes and theory questions.

---

## 📚 4. Theory Questions & Reference Answers

### Q1. What is Tailwind CSS?
**Answer:**  
Tailwind CSS is an open-source, utility-first CSS framework designed for rapidly building custom user interfaces directly in markup. Unlike component-based frameworks (such as Bootstrap), Tailwind does not impose opinionated pre-built component styles. Instead, it offers low-level atomic utility classes that can be composed to build any design.

### Q2. What is utility-first CSS?
**Answer:**  
Utility-first CSS is a methodology where styles are applied through small, single-purpose classes (e.g., `flex`, `pt-4`, `text-center`, `bg-white`) directly within the HTML/JSX elements. This eliminates the overhead of creating arbitrary class names, reduces stylesheet bloat, and makes styles completely transparent inside components.

### Q3. What is a Tailwind CSS utility class?
**Answer:**  
A Tailwind CSS utility class is an atomic class mapping directly to a CSS property. For instance, `font-bold` generates `font-weight: 700;`, `p-4` generates `padding: 1rem;` (16px), and `rounded-2xl` generates `border-radius: 1rem;` (16px).

### Q4. What is the difference between padding and margin?
**Answer:**  
- **Padding (`p-*`)**: Inner space inside an element between its content and its border. Background colors and borders wrap around padding.
- **Margin (`m-*`)**: Outer space outside an element between its border and neighboring elements. It controls separation between distinct UI blocks.

### Q5. What is the purpose of borders?
**Answer:**  
Borders define visual perimeters, visually group related contents, separate cards from container backgrounds, and highlight interactive states (such as active selections or focused inputs).

### Q6. Why are rounded corners used in UI design?
**Answer:**  
Rounded corners (`border-radius`) soften sharp rectangular bounds, direct user attention inward toward card content, create an approachable, organic visual appeal, and mimic real-world touchable cards.

### Q7. What is the purpose of shadows?
**Answer:**  
Box shadows (`shadow-*`) create elevation along the Z-axis. They separate background elements from foreground interactive cards and modal dialogs, establishing clear visual depth and hierarchy.

### Q8. What are hover effects?
**Answer:**  
Hover effects (e.g., `hover:bg-orange-700`, `hover:-translate-y-1`, `hover:shadow-xl`) alter styling attributes when a user hovers a pointing device over an element. They provide instant visual confirmation that an item is interactive and clickable.

### Q9. Why is consistent styling important in a card-based listing page?
**Answer:**  
Consistent styling across all item cards standardizes the visual structure (image height, title placement, badge positions, price weight, button styling), allowing guests to scan food items quickly without cognitive friction.

---

## 🚀 5. How to Run the Project

### Prerequisites:
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation & Execution:

1. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   # or
   npm run client
   ```
   Open your browser at `http://localhost:5173`.

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Start the Backend REST API Server (Optional/Next Experiments):**
   ```bash
   npm run server
   ```
   Runs at `http://localhost:5001`.
