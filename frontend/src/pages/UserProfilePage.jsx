import { Link } from "react-router-dom";
import { getAuth } from "../lib/auth";

export function UserProfilePage() {
  const auth = getAuth();

  return (
    <section>
      <h2>User Profile</h2>
      <p>Welcome back, {auth?.fullName || auth?.email}.</p>
      <p>Use the actions below to manage your asset bookings.</p>
      <div className="profile-actions">
        <Link to="/app/asset-booking">Book an asset</Link>
        <Link to="/app/bookings">View my bookings</Link>
      </div>
    </section>
  );
}
