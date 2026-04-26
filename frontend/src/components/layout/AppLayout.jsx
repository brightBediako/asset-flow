import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getAuth, isAdminRole, hasAnyRole } from "../../lib/auth";

export function AppLayout() {
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = isAdminRole();
  const isUser = hasAnyRole(["USER"]);

  function onLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <h1 className="topbar-brand">AssetFlow</h1>
        <nav className="topbar-nav">
          <Link to="/home">Home</Link>
          {isAdmin && <Link to="/app">Dashboard</Link>}
          {isUser && <Link to="/app/profile">Profile</Link>}
          {isAdmin && <Link to="/app/organizations">Organizations</Link>}
          {isAdmin && <Link to="/app/users">Users</Link>}
          <Link to="/app/assets">Assets</Link>
          <Link to="/app/asset-booking">Book Assets</Link>
          <Link to="/app/bookings">{isUser ? "My Bookings" : "Bookings"}</Link>
          {isAdmin && <Link to="/app/maintenance-records">Maintenance</Link>}
          {isAdmin && <Link to="/app/audit-logs">Audit Logs</Link>}
        </nav>
        <div className="topbar-right">
          <span className="topbar-email">{auth?.email}</span>
          <button className="btn-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
