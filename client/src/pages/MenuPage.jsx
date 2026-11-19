import React, { useState, useMemo, useEffect } from 'react';
import { API_BASE } from '../config';
import useDebounce from '../hooks/useDebounce';
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
import ApiTesterModal from '../components/ApiTesterModal';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250); // custom hook: filter after the user pauses typing
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'

  const [rawMenuItems, setRawMenuItems] = useState(MENU_ITEMS);
  const [apiStatus, setApiStatus] = useState('connecting');
  const [apiMeta, setApiMeta] = useState({ endpoint: '/api/menu', count: 12, status: 200, duration: 12 });

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isApiTesterOpen, setIsApiTesterOpen] = useState(false);

  const { isCartOpen, setIsCartOpen, totalItemCount, finalTotal } = useCart();
  const { menuVersion } = useNotifications();

  // Function to fetch dishes from Express REST API server (Experiment 4 REST API, persisted in MongoDB for Experiment 5)
  const fetchMenuFromApi = async () => {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/menu`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const duration = Math.round(performance.now() - start);
      if (data.success && Array.isArray(data.data)) {
        setRawMenuItems(data.data);
        setApiStatus('connected');
        setApiMeta({
          endpoint: '/api/menu',
          count: data.count || data.data.length,
          status: res.status,
          duration,
        });
      }
    } catch (err) {
      console.warn('Backend API connection note (using local cache):', err.message);
      setApiStatus('fallback');
      setApiMeta({
        endpoint: '/api/menu (offline fallback)',
        count: MENU_ITEMS.length,
        status: 200,
        duration: 0,
      });
    }
  };

  // Initial load + automatic refresh whenever a real-time menu notification arrives (Experiment 7)
  useEffect(() => {
    fetchMenuFromApi();
  }, [menuVersion]);

  // Filtered menu items based on Search, Category, and Dietary tags
  const filteredItems = useMemo(() => {
    return rawMenuItems.filter((item) => {
      // 1. Search Query filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Dietary filter
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'non-veg' && item.isVeg) return false;

      return true;
    });
  }, [rawMenuItems, debouncedSearch, selectedCategory, dietFilter]);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800 antialiased">
      
      {/* 1. Navbar (Fully responsive: items-center, justify-between, hidden md:block) */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenApiTester={() => setIsApiTesterOpen(true)}
      />

      {/* 2. Top QR & Table Banner (Responsive flex-col md:flex-row) */}
      <TableQRBanner onOpenTableModal={() => setIsTableModalOpen(true)} />

      {/* 3. Category & Dietary Filter Bar (Horizontal scroll on mobile, flex-row on desktop) */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        dietFilter={dietFilter}
        onSelectDietFilter={setDietFilter}
        totalItemsCount={filteredItems.length}
      />

      {/* 4. Main Content Area with Natural Responsive Layout:
          - Mobile (< 768px): 1-column layout, sidebar hidden, bottom floating cart bar
          - Tablet (768px – 1023px): 2-column menu layout, sidebar hidden
          - Laptop (1024px – 1279px): 2-column dish grid + sticky cart sidebar
          - Large Desktop (≥ 1280px): 3-column dish grid + sticky cart sidebar
      */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* REST API Live Status Banner (Experiment 4 Feature) */}
        <div className="mb-6 rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shrink-0 ${apiStatus === 'connected' ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-100' : 'bg-amber-500'}`}></div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  GET /api/menu
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {apiStatus === 'connected' ? 'Connected to Express REST API Server' : 'Local Fallback Cache'}
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  200 OK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Endpoint: <code className="text-orange-600 font-bold">{API_BASE}/menu</code> • Fetched <strong>{rawMenuItems.length} dishes</strong> ({apiMeta.duration} ms) • Express.js v5.3.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={fetchMenuFromApi}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Re-fetch from REST API"
            >
              <span>🔄</span> Refresh API
            </button>
            <button
              onClick={() => setIsApiTesterOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#E8590C] hover:bg-orange-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Open Postman & Express REST API Console"
            >
              <span>⚡</span> REST API Console
            </button>
          </div>
        </div>

        {/* Section Heading Banner (Responsive Typography & Padding) */}
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

            {/* Responsive Actions: w-full on mobile, md:w-auto on tablet/desktop */}
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

        {/* Master Responsive Grid:
            - On Mobile & Tablet (< 1024px): 12 columns collapse to 1 column. Sidebar is hidden (hidden lg:block).
            - On Desktop (≥ 1024px): 12 columns split into 8 cols (dishes) + 4 cols (sticky cart sidebar).
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Dishes Card Container */}
          <div className="lg:col-span-8">
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
                <span className="text-4xl">🔍</span>
                <h3 className="text-base font-bold text-slate-900 mt-3">No dishes match your filter</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Try clearing your search term "{searchTerm}" or resetting dietary preferences to view our entire menu.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setDietFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#E8590C] text-white text-xs font-bold hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  View All Dishes
                </button>
              </div>
            ) : (
              /* Natural Breakpoint Grid:
                 - Mobile (< 640px): grid-cols-1 (spacious, full-width cards)
                 - Small Tablet / Phablet (640px – 1023px): sm:grid-cols-2 (2 clean columns)
                 - Laptop with Sidebar (1024px – 1279px): lg:grid-cols-2 (2 columns, ~320px each)
                 - Large Desktop with Sidebar (≥ 1280px): xl:grid-cols-3 (3 columns, ~300px each)
              */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Cart Sidebar (Hidden on mobile & tablet: hidden lg:block) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <CartSidebar isDrawer={false} />
          </div>

        </div>

      </main>

      {/* 5. Mobile Floating Bottom Cart Bar (Visible on mobile & tablet: lg:hidden) */}
      {totalItemCount > 0 && (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-[#E8590C] text-white font-extrabold shadow-2xl shadow-orange-600/40 flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/25 text-xs font-bold flex items-center justify-center">
                {totalItemCount}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wide">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black">₹{finalTotal}</span>
              <span className="text-base sm:text-lg">→</span>
            </div>
          </button>
        </div>
      )}

      {/* 6. Mobile Cart Drawer (Opens when user taps cart button or floating bar) */}
      {isCartOpen && (
        <CartSidebar isDrawer={true} onClose={() => setIsCartOpen(false)} />
      )}

      {/* 7. Modals */}
      <ItemCustomizerModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
      <TailwindUtilityInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
      <ApiTesterModal
        isOpen={isApiTesterOpen}
        onClose={() => setIsApiTesterOpen(false)}
        onRefreshMenu={fetchMenuFromApi}
      />

      {/* 8. Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-slate-200 bg-white py-6 sm:py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5 sm:space-y-2">
          <p className="font-semibold text-slate-700">
            BiteOrder — Online Restaurant Ordering & Management System
          </p>
          <p className="text-slate-400">
            FSD Experiment 2: Responsive Card-based Menu & Ordering Page using React Components & Tailwind CSS
          </p>
          <p className="text-slate-400">
            Student: <strong>Ronit Ahuja</strong> | Class: <strong>D15A</strong> | Roll No: <strong>63</strong>
          </p>
        </div>
      </footer>

    </div>
  );
}
