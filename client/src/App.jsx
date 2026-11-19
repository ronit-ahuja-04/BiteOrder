import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastStack } from './components/NotificationBell';
import ProtectedRoute from './components/ProtectedRoute';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import FirebaseProtectedRoute from './components/FirebaseProtectedRoute';
import FirebaseLoginPage from './pages/FirebaseLoginPage';
import FirebaseHubPage from './pages/FirebaseHubPage';

export default function App() {
  return (
    <ToastProvider>
    <AuthProvider>
      <NotificationProvider>
      <CartProvider>
        <FirebaseAuthProvider>
        <ToastStack />
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/firebase/login" element={<FirebaseLoginPage />} />
          <Route path="/firebase" element={<FirebaseProtectedRoute><FirebaseHubPage /></FirebaseProtectedRoute>} />
        </Routes>
        </FirebaseAuthProvider>
      </CartProvider>
      </NotificationProvider>
    </AuthProvider>
    </ToastProvider>
  );
}
