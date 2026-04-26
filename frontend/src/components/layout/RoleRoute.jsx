import { Navigate } from "react-router-dom";
import { hasAnyRole } from "../../lib/auth";

export function RoleRoute({ children, allowedRoles }) {
  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
