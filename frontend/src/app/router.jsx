import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { AssetCreatePage } from "../pages/assets/AssetCreatePage";
import { AssetEditPage } from "../pages/assets/AssetEditPage";
import { AssetsListPage } from "../pages/assets/AssetsListPage";
import { BookingCreatePage } from "../pages/bookings/BookingCreatePage";
import { BookingEditPage } from "../pages/bookings/BookingEditPage";
import { BookingsListPage } from "../pages/bookings/BookingsListPage";
import { LoginPage } from "../pages/LoginPage";
import { OrganizationCreatePage } from "../pages/organizations/OrganizationCreatePage";
import { OrganizationEditPage } from "../pages/organizations/OrganizationEditPage";
import { OrganizationsListPage } from "../pages/organizations/OrganizationsListPage";
import { UserCreatePage } from "../pages/users/UserCreatePage";
import { UserEditPage } from "../pages/users/UserEditPage";
import { UsersListPage } from "../pages/users/UsersListPage";

export const router = createBrowserRouter([
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
      { path: "assets/new", element: <AssetCreatePage /> },
      { path: "assets/:id/edit", element: <AssetEditPage /> },
      { path: "bookings", element: <BookingsListPage /> },
      { path: "bookings/new", element: <BookingCreatePage /> },
      { path: "bookings/:id/edit", element: <BookingEditPage /> },
    ],
  },
]);
