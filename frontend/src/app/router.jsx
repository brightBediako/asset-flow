import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { RoleRoute } from "../components/layout/RoleRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { AssetCreatePage } from "../pages/assets/AssetCreatePage";
import { AssetEditPage } from "../pages/assets/AssetEditPage";
import { AssetBookingPage } from "../pages/assets/AssetBookingPage";
import { AssetsListPage } from "../pages/assets/AssetsListPage";
import { PublicAssetsPage } from "../pages/assets/PublicAssetsPage";
import { AuditLogDetailPage } from "../pages/audit-logs/AuditLogDetailPage";
import { AuditLogsListPage } from "../pages/audit-logs/AuditLogsListPage";
import { BookingCreatePage } from "../pages/bookings/BookingCreatePage";
import { BookingDetailPage } from "../pages/bookings/BookingDetailPage";
import { BookingEditPage } from "../pages/bookings/BookingEditPage";
import { BookingsListPage } from "../pages/bookings/BookingsListPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { MaintenanceRecordCreatePage } from "../pages/maintenance-records/MaintenanceRecordCreatePage";
import { MaintenanceRecordEditPage } from "../pages/maintenance-records/MaintenanceRecordEditPage";
import { MaintenanceRecordsListPage } from "../pages/maintenance-records/MaintenanceRecordsListPage";
import { OrganizationCreatePage } from "../pages/organizations/OrganizationCreatePage";
import { OrganizationEditPage } from "../pages/organizations/OrganizationEditPage";
import { OrganizationsListPage } from "../pages/organizations/OrganizationsListPage";
import { UserCreatePage } from "../pages/users/UserCreatePage";
import { UserEditPage } from "../pages/users/UserEditPage";
import { UsersListPage } from "../pages/users/UsersListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/assets",
    element: <PublicAssetsPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "organizations",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <OrganizationsListPage />
          </RoleRoute>
        ),
      },
      {
        path: "organizations/new",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <OrganizationCreatePage />
          </RoleRoute>
        ),
      },
      {
        path: "organizations/:id/edit",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <OrganizationEditPage />
          </RoleRoute>
        ),
      },
      {
        path: "users",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <UsersListPage />
          </RoleRoute>
        ),
      },
      {
        path: "users/new",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <UserCreatePage />
          </RoleRoute>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <UserEditPage />
          </RoleRoute>
        ),
      },
      { path: "assets", element: <AssetsListPage /> },
      { path: "asset-booking", element: <AssetBookingPage /> },
      {
        path: "assets/new",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <AssetCreatePage />
          </RoleRoute>
        ),
      },
      {
        path: "assets/:id/edit",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <AssetEditPage />
          </RoleRoute>
        ),
      },
      { path: "bookings", element: <BookingsListPage /> },
      { path: "bookings/new", element: <BookingCreatePage /> },
      { path: "bookings/:id", element: <BookingDetailPage /> },
      { path: "bookings/:id/edit", element: <BookingEditPage /> },
      {
        path: "maintenance-records",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <MaintenanceRecordsListPage />
          </RoleRoute>
        ),
      },
      {
        path: "maintenance-records/new",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <MaintenanceRecordCreatePage />
          </RoleRoute>
        ),
      },
      {
        path: "maintenance-records/:id/edit",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <MaintenanceRecordEditPage />
          </RoleRoute>
        ),
      },
      {
        path: "audit-logs",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <AuditLogsListPage />
          </RoleRoute>
        ),
      },
      {
        path: "audit-logs/:id",
        element: (
          <RoleRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
            <AuditLogDetailPage />
          </RoleRoute>
        ),
      },
    ],
  },
]);
