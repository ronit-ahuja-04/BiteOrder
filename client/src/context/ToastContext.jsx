import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext({ showToast: () => {} });

const STYLES = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};
const ICONS = { success: '✅', error: '⚠️', info: 'ℹ️' };

// Global success / error / info toasts. Use anywhere with: const { showToast } = useToast();
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] space-y-2 w-[90vw] max-w-sm pointer-events-none" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`border rounded-xl shadow-lg px-4 py-3 text-sm font-semibold flex items-center gap-2 ${STYLES[t.type]}`}>
            <span>{ICONS[t.type]}</span>{t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
