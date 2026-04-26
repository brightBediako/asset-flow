import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getAuth, isAdminRole } from "../../lib/auth";

export function AppLayout() {
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = isAdminRole();

  function onLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <h1>AssetFlow</h1>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/app">Dashboard</Link>
          {isAdmin && <Link to="/app/organizations">Organizations</Link>}
          {isAdmin && <Link to="/app/users">Users</Link>}
          <Link to="/app/assets">Assets</Link>
          <Link to="/app/asset-booking">Book Assets</Link>
          <Link to="/app/bookings">Bookings</Link>
          {isAdmin && <Link to="/app/maintenance-records">Maintenance</Link>}
          {isAdmin && <Link to="/app/audit-logs">Audit Logs</Link>}
        </nav>
        <div className="topbar-right">
          <span>{auth?.email}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
