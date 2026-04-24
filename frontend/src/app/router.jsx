import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
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
    ],
  },
]);
