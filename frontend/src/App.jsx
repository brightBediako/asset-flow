import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import { ROLES } from './constants/enums.js';

// Public Pages
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import PublicAssets from './pages/public/PublicAssets.jsx';
import Unauthorized from './pages/public/Unauthorized.jsx';

// App Layout & Modules
import AppLayout from './components/layout/AppLayout.jsx';
import Dashboard from './pages/app/Dashboard.jsx';
import Organizations from './pages/app/organizations/OrganizationList.jsx';
import Users from './pages/app/users/UserList.jsx';
import Assets from './pages/app/assets/AssetList.jsx';
import Categories from './pages/app/categories/CategoryList.jsx';
import Bookings from './pages/app/bookings/BookingList.jsx';
import MyBookings from './pages/app/bookings/MyBookings.jsx';
import Maintenance from './pages/app/maintenance/MaintenanceList.jsx';
import AuditLogs from './pages/app/audit/AuditLogs.jsx';
import Profile from './pages/app/Profile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/assets" element={<PublicAssets />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected App Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          {/* Shared Routes */}
          <Route path="profile" element={<Profile />} />

          {/* Admin Specific Routes */}
          <Route index element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="organizations" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <Organizations />
            </ProtectedRoute>
          } />
          
          <Route path="users" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]}>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="assets" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]}>
              <Assets />
            </ProtectedRoute>
          } />

          <Route path="categories" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <Categories />
            </ProtectedRoute>
          } />
          
          <Route path="all-bookings" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]}>
              <Bookings />
            </ProtectedRoute>
          } />

          <Route path="maintenance" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]}>
              <Maintenance />
            </ProtectedRoute>
          } />

          <Route path="audit-logs" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <AuditLogs />
            </ProtectedRoute>
          } />

          {/* User Specific Routes */}
          <Route path="my-bookings" element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <MyBookings />
            </ProtectedRoute>
          } />

          {/* Fallback for /app */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
