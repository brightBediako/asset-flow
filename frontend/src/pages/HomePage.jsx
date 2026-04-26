import { Link } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { isAuthenticated } from "../lib/auth";

export function HomePage() {
  const authenticated = isAuthenticated();
  const highlights = [
    {
      title: "Centralized Asset Tracking",
      description: "Keep equipment, vehicles, and shared resources visible across organizations.",
    },
    {
      title: "Reliable Booking Flow",
      description: "Handle approvals, status transitions, and usage windows with clear booking records.",
    },
    {
      title: "Maintenance + Audit History",
      description: "Follow maintenance lifecycle and audit activity for operational accountability.",
    },
  ];

  return (
    <>
      <PublicHeader />
      <section className="hero">
        <p className="hero-kicker">AssetFlow</p>
        <h1>Manage, share, and book assets with confidence.</h1>
        <p className="hero-subtitle">
          Coordinate assets across organizations, simplify bookings, and keep maintenance and audit history in one
          place.
        </p>
        <div className="hero-actions">
          {authenticated ? (
            <>
              <Link to="/app">Open Dashboard</Link>
              <Link to="/assets">Browse Assets</Link>
            </>
          ) : (
            <>
              <Link to="/assets">Browse Assets</Link>
              <Link to="/register">Get started</Link>
            </>
          )}
        </div>
      </section>
      <section className="home-section">
        <h2>Why teams choose AssetFlow</h2>
        <div className="home-grid">
          {highlights.map((item) => (
            <article key={item.title} className="home-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="home-section home-section-cta">
        <h2>Ready to reserve what you need?</h2>
        <p>Browse available assets and start a booking request in minutes.</p>
        <div className="hero-actions">
          <Link to="/assets">View all assets</Link>
          {authenticated ? <Link to="/app/bookings">Manage bookings</Link> : <Link to="/login">Sign in</Link>}
        </div>
      </section>
    </>
  );
}
