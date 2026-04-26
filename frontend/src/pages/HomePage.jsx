import { Link } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

export function HomePage() {
  const authenticated = isAuthenticated();

  return (
    <section className="hero">
      <p className="hero-kicker">AssetFlow</p>
      <h1>Manage, share, and book assets with confidence.</h1>
      <p className="hero-subtitle">
        Coordinate assets across organizations, simplify bookings, and keep maintenance and audit history in one place.
      </p>
      <div className="hero-actions">
        {authenticated ? (
          <>
            <Link to="/">Open Dashboard</Link>
            <Link to="/asset-booking">Book an Asset</Link>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/login">Get started</Link>
          </>
        )}
      </div>
    </section>
  );
}
