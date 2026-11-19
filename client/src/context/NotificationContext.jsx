import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { socket } from '../socket';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]); // newest first
  const [toasts, setToasts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [menuVersion, setMenuVersion] = useState(0); // bumps on every menu change -> pages refetch

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onNotification = (n) => {
      setNotifications((prev) => [{ ...n, read: false }, ...prev].slice(0, 30)); // store in state
      setToasts((prev) => [...prev, n]);
      setMenuVersion((v) => v + 1);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== n.id)), 6000);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('notification', onNotification);
    socket.connect();

    // cleanup: remove listeners and close the connection when the provider unmounts
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification', onNotification);
      socket.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = useCallback(() => setNotifications((p) => p.map((n) => ({ ...n, read: true }))), []);
  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, toasts, unreadCount, connected, menuVersion, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
