import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import { ROLES } from './constants/enums.js';
import { useAuth } from './context/AuthContext.jsx';

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
import BookAsset from './pages/app/bookings/BookAsset.jsx';
import Maintenance from './pages/app/maintenance/MaintenanceList.jsx';
import AuditLogs from './pages/app/audit/AuditLogs.jsx';
import Profile from './pages/app/Profile.jsx';

/** `/app` dashboard is admin-only; standard users are sent to booking entry */
function AppHomeRoute() {
  const { user } = useAuth();
  if (user?.role === ROLES.USER) {
    return <Navigate to="/app/book" replace />;
  }
  return (
    <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]}>
      <Dashboard />
    </ProtectedRoute>
  );
}

/** Unknown `/app/*` paths: avoid looping USER through admin-only `/app` index */
function AppCatchAllRedirect() {
  const { user } = useAuth();
  if (user?.role === ROLES.USER) {
    return <Navigate to="/app/book" replace />;
  }
  return <Navigate to="/app" replace />;
}

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

          {/* Admin dashboard at /app; USER redirected to /app/book */}
          <Route index element={<AppHomeRoute />} />
          
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

          <Route path="book" element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <BookAsset />
            </ProtectedRoute>
          } />

          {/* Fallback for /app */}
          <Route path="*" element={<AppCatchAllRedirect />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
