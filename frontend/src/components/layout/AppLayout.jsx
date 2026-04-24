import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../../lib/auth";

export function AppLayout() {
  const navigate = useNavigate();
  const auth = getAuth();

  function onLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <h1>AssetFlow</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/organizations">Organizations</Link>
          <Link to="/users">Users</Link>
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
