import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { OrganizationCreatePage } from "../pages/organizations/OrganizationCreatePage";
import { OrganizationEditPage } from "../pages/organizations/OrganizationEditPage";
import { OrganizationsListPage } from "../pages/organizations/OrganizationsListPage";

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
    ],
  },
]);
