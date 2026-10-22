# BiteOrder — Online Restaurant Ordering & Management System

> **Full Stack Web Development (FSD) Laboratory**  
> **Student Name:** Ronit Ahuja  
> **Class / Division:** D15A  
> **Roll No.:** 63  
> **GitHub Repository:** [https://github.com/ronit-ahuja-04/BiteOrder.git](https://github.com/ronit-ahuja-04/BiteOrder.git)  

---

## 📌 Project Overview

**BiteOrder** is an interactive, responsive online restaurant digital menu and ordering platform built using **React 19**, **Tailwind CSS v4**, and modern React Hooks. It enables restaurant diners to scan a table QR code, browse a categorized food menu (Starters, Mains, Breads, Desserts, Beverages), customize portion sizes and add-ons, add items to a persistent cart with real-time tax calculations, and track order stages (Received → Preparing → Ready → Served) with automatic lifecycle timers.

---

## 🧪 Experiments Index & Lab Reports

This repository is maintained with clean, experiment-wise Git commits and full academic laboratory reports:

| Experiment | Title | Key Technologies / Concepts | Detailed Lab Report |
|---|---|---|---|
| **Experiment 2** | **Responsive Menu & Card Design** | React Components, Tailwind CSS v4 utility classes (Typography, Colors, Spacing, Borders, Shadows, Flexbox & Grid), Responsive Viewports (Mobile, Tablet, Desktop) | [EXPERIMENT_2_REPORT.md](./EXPERIMENT_2_REPORT.md) |
| **Experiment 3** | **Interactive State Management using React Hooks** | `useState` (local inputs, modals), `useEffect` (localStorage sync, status timers), `useContext` (CartContext global state), Memoization (`useMemo`) | [EXPERIMENT_3_REPORT.md](./EXPERIMENT_3_REPORT.md) |

---

## 🪵 Git Commit History (Experiment-Wise)

The repository follows a clean, structured commit tree for lab evaluation:

```
* 63c8535 (HEAD -> main, origin/main) feat(exp-3): Development of Interactive Restaurant Ordering Application using React Hooks and State Management
* 187c5c1 feat(exp-2): Development of Responsive Restaurant Menu & Ordering Page using React Components and Tailwind CSS
* 85813ef feat: Initial setup for BiteOrder restaurant ordering system with React 19, Tailwind CSS v4, and Express API
```

### Commit Details:
1. **Initial Setup (`85813ef`)**:
   - Project directory scaffolding (`client/` with Vite + React 19 + Tailwind CSS, `server/` with Express REST API).
   - `.gitignore`, package configurations, and initial data structures.
2. **Experiment 2 (`187c5c1`)**:
   - Responsive multi-device layout (Mobile `< 768px`, Tablet `768px-1023px`, Desktop `≥ 1024px`).
   - Reusable `MenuCard` with dietary badges (Veg/Non-Veg dot indicators), ratings, price tags, and hover micro-animations.
   - Demonstration of 12 core Tailwind CSS utility classes.
   - Comprehensive `EXPERIMENT_2_REPORT.md` including theoretical Q&A, wireframes, and code listings.
3. **Experiment 3 (`63c8535`)**:
   - `CartContext.jsx` with Context API for centralized order management.
   - `useState` for search query, category filtering, dietary toggle, customization modal options, and order details.
   - `useEffect` for `localStorage` order synchronization and automated interval timers in `OrderTrackingModal`.
   - `useMemo` for derived subtotal, GST (5%), discount calculations, and filtered item arrays.
   - Comprehensive `EXPERIMENT_3_REPORT.md` including 15 theory questions, React hooks architecture, state flow diagrams, and verified test cases.

---

## 📐 Architecture & Key Components

```
client/src/
├── App.jsx                     # Root component wrapping CartProvider and MenuPage
├── context/
│   └── CartContext.jsx         # Context API (useState, useEffect, useMemo, custom useCart hook)
├── components/
│   ├── Navbar.jsx              # Brand header, Table QR badge, search bar, and cart drawer trigger
│   ├── TableQRBanner.jsx       # QR detection strip (Table #12, Dine-in mode)
│   ├── CategoryFilter.jsx      # Interactive category pills & Veg / Non-Veg toggles
│   ├── MenuCard.jsx            # Dish card with image, badges, price, and add-to-cart stepper
│   ├── ItemCustomizerModal.jsx # Size selection, add-on checkboxes, and special instructions
│   ├── CartSidebar.jsx         # Desktop sticky cart with item breakdown, coupon, and bill calculation
│   ├── CheckoutModal.jsx       # Customer details modal (Name, Mobile, Payment method selection)
│   ├── OrderTrackingModal.jsx  # Live order stepper with automated useEffect interval progression
│   └── TailwindUtilityInspector.jsx # In-app inspector for Tailwind CSS utility classes
└── data/
    └── menuData.js             # Comprehensive menu catalog with high-res Unsplash food images
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ronit-ahuja-04/BiteOrder.git
   cd BiteOrder
   ```

2. **Install Dependencies:**
   ```bash
   # Install root and client dependencies
   npm install
   npm --prefix client install
   ```

3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   # or
   npm --prefix client run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for Production:**
   ```bash
   npm --prefix client run build
   ```

---

## 📱 Responsive Breakpoints Tested

- **Mobile Viewport (< 768px):** Single-column menu grid (`grid-cols-1`), compact navbar, collapsible search, floating bottom cart checkout bar.
- **Tablet Viewport (768px – 1023px):** Two-column menu grid (`sm:grid-cols-2`), comfortable touch targets, sliding slide-over cart drawer.
- **Desktop Viewport (≥ 1024px):** Three-column menu grid (`xl:grid-cols-3`) with fixed right-hand sticky billing and checkout sidebar (`col-span-4`).

---

## 👨‍💻 Author

- **Student:** Ronit Ahuja
- **Roll Number:** 63
- **Class:** D15A
- **Department:** Computer Engineering / Full Stack Development Lab
