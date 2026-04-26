import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { AssetCreatePage } from "../pages/assets/AssetCreatePage";
import { AssetEditPage } from "../pages/assets/AssetEditPage";
import { AssetBookingPage } from "../pages/assets/AssetBookingPage";
import { AssetsListPage } from "../pages/assets/AssetsListPage";
import { AuditLogDetailPage } from "../pages/audit-logs/AuditLogDetailPage";
import { AuditLogsListPage } from "../pages/audit-logs/AuditLogsListPage";
import { BookingCreatePage } from "../pages/bookings/BookingCreatePage";
import { BookingEditPage } from "../pages/bookings/BookingEditPage";
import { BookingsListPage } from "../pages/bookings/BookingsListPage";
import { LoginPage } from "../pages/LoginPage";
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
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "organizations", element: <OrganizationsListPage /> },
      { path: "organizations/new", element: <OrganizationCreatePage /> },
      { path: "organizations/:id/edit", element: <OrganizationEditPage /> },
      { path: "users", element: <UsersListPage /> },
      { path: "users/new", element: <UserCreatePage /> },
      { path: "users/:id/edit", element: <UserEditPage /> },
      { path: "assets", element: <AssetsListPage /> },
      { path: "asset-booking", element: <AssetBookingPage /> },
      { path: "assets/new", element: <AssetCreatePage /> },
      { path: "assets/:id/edit", element: <AssetEditPage /> },
      { path: "bookings", element: <BookingsListPage /> },
      { path: "bookings/new", element: <BookingCreatePage /> },
      { path: "bookings/:id/edit", element: <BookingEditPage /> },
      { path: "maintenance-records", element: <MaintenanceRecordsListPage /> },
      { path: "maintenance-records/new", element: <MaintenanceRecordCreatePage /> },
      { path: "maintenance-records/:id/edit", element: <MaintenanceRecordEditPage /> },
      { path: "audit-logs", element: <AuditLogsListPage /> },
      { path: "audit-logs/:id", element: <AuditLogDetailPage /> },
    ],
  },
]);
