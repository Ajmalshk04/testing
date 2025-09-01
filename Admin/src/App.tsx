import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import Unauthorized from '@/pages/Unauthorized';
import UserManagement from '@/pages/UserManagement';
import ProductsPage from '@/pages/ProductsPage';
import InventoryManagementPage from '@/pages/InventoryManagementPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background transition-colors duration-300">
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Product Management */}
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Inventory Management */}
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute>
                  <InventoryManagementPage />
                </ProtectedRoute>
              } 
            />
            
            {/* User Management */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Orders Management */}
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Orders Management</h1>
                    <p className="text-muted-foreground">Order management features coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Categories Management */}
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Categories Management</h1>
                    <p className="text-muted-foreground">Category management features coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Reports & Analytics */}
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Advanced reporting features coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Settings */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">System configuration coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin only routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p>This is an admin-only area.</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </div>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right" 
            richColors 
            expand 
            closeButton
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
