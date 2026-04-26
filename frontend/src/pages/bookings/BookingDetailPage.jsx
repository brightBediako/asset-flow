import { Link, useParams } from "react-router-dom";
import { useBookingQuery } from "../../features/bookings/bookings.hooks";
import { getCurrentUserId, isAdminRole } from "../../lib/auth";
import { BookingReadonlySummary } from "./BookingReadonlySummary";

export function BookingDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useBookingQuery(id);
  const isAdmin = isAdminRole();
  const currentUserId = getCurrentUserId();

  function canManageBooking(booking) {
    if (isAdmin) return true;
    return String(booking?.user?.id) === String(currentUserId);
  }

  if (isLoading) return <p>Loading booking...</p>;
  if (isError) return <p className="error">Failed to load booking: {error.message}</p>;

  return (
    <>
      <p>
        <Link to="/app/bookings">Back to bookings</Link>
      </p>
      <BookingReadonlySummary booking={data} compact={false} />
      {canManageBooking(data) ? (
        <p>
          <Link to={`/app/bookings/${data.id}/edit`}>Edit booking</Link>
        </p>
      ) : null}
    </>
  );
}
