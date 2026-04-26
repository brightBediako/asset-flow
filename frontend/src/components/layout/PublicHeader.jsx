import { Link } from "react-router-dom";
import { isAuthenticated } from "../../lib/auth";

export function PublicHeader() {
  const authenticated = isAuthenticated();

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link to="/home" className="brand">
          AssetFlow
        </Link>
        <nav className="public-nav">
          <Link to="/home">Home</Link>
          <Link to="/assets">Assets</Link>
          {authenticated ? (
            <Link to="/app">Dashboard</Link>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link className="public-nav-cta" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
