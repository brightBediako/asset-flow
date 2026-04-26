import { Link } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";

export function UnauthorizedPage() {
  return (
    <>
      <PublicHeader />
      <section className="home-section">
        <h2>Access denied</h2>
        <p>You do not have permission to view this page.</p>
        <p>
          <Link to="/app">Back to dashboard</Link>
        </p>
      </section>
    </>
  );
}
