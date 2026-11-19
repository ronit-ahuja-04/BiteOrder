import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const STYLE = {
  created: { icon: '🆕', color: 'text-emerald-700', bg: 'bg-emerald-50', label: 'New' },
  updated: { icon: '✏️', color: 'text-blue-700', bg: 'bg-blue-50', label: 'Updated' },
  deleted: { icon: '🗑️', color: 'text-red-700', bg: 'bg-red-50', label: 'Removed' },
};

const timeAgo = (iso) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.round(s / 60)} min ago`;
};

// Bell icon with unread badge + dropdown list of received notifications
export default function NotificationBell() {
  const { notifications, unreadCount, connected, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (!open) markAllRead(); // opening the list marks everything as read (badge clears on next render)
    setOpen(!open);
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label="Notifications"
        className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center cursor-pointer"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span id="bell-count" className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
        <span className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`} title={connected ? 'Live' : 'Offline'} />
      </button>

      {open && (
        <div id="bell-dropdown" className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm">Notifications</span>
            <button onClick={clearAll} className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer">Clear all</button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && <li className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet</li>}
            {notifications.map((n) => {
              const s = STYLE[n.type] || STYLE.updated;
              return (
                <li key={n.id} className="px-4 py-3 border-b border-slate-100 last:border-0 flex gap-3">
                  <span className={`w-9 h-9 shrink-0 rounded-lg ${s.bg} flex items-center justify-center`}>{s.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 leading-snug">{n.message}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5"><span className={`font-bold ${s.color}`}>{s.label}</span> · by {n.by} · {timeAgo(n.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// Pop-up toasts shown for a few seconds when a notification arrives
export function ToastStack() {
  const { toasts } = useNotifications();
  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2 w-80 max-w-[90vw] pointer-events-none">
      {toasts.map((t) => {
        const s = STYLE[t.type] || STYLE.updated;
        return (
          <div key={t.id} className={`toast ${s.bg} border border-slate-200 rounded-xl shadow-lg px-4 py-3 flex gap-3 items-start`}>
            <span className="text-xl">{s.icon}</span>
            <div>
              <p className={`text-xs font-black uppercase ${s.color}`}>{s.label} – live update</p>
              <p className="text-sm text-slate-800">{t.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
