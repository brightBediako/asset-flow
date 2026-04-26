import { Navigate } from "react-router-dom";
import { isAdminRole } from "../lib/auth";
import { DashboardPage } from "./DashboardPage";

export function AppHomePage() {
  if (isAdminRole()) {
    return <DashboardPage />;
  }
  return <Navigate to="/app/profile" replace />;
}
