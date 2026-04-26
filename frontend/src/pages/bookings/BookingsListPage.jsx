import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useDeleteBookingMutation, useBookingsQuery } from "../../features/bookings/bookings.hooks";
import { getCurrentUserId, isAdminRole } from "../../lib/auth";
import { formatDateTime } from "../../lib/format";
import { getBookingStatusTone } from "../../lib/statusTone";

export function BookingsListPage() {
  const { data, isLoading, isError, error } = useBookingsQuery();
  const deleteMutation = useDeleteBookingMutation();
  const isAdmin = isAdminRole();
  const currentUserId = getCurrentUserId();

  function canManageBooking(booking) {
    if (isAdmin) return true;
    return String(booking?.user?.id) === String(currentUserId);
  }

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this booking?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <LoadingState message="Loading bookings..." />;
  if (isError) return <ErrorState error={error} fallback="Failed to load bookings." />;

  return (
    <section>
      <h2>Bookings</h2>
      <p>
        <Link to="/app/bookings/new">Create Booking</Link>
      </p>
      {deleteMutation.isError && <p className="error">Failed to delete booking.</p>}
      {data?.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Organization ID</th>
              <th>Asset</th>
              <th>User</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Checked in</th>
              <th>Checked out</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <Link to={`/app/bookings/${booking.id}`}>{booking.id}</Link>
                </td>
                <td>{booking.organization?.id}</td>
                <td>{booking.asset?.name}</td>
                <td>{booking.user?.fullName}</td>
                <td>
                  <Badge tone={getBookingStatusTone(booking.status)}>{booking.status}</Badge>
                </td>
                <td>{formatDateTime(booking.startTime)}</td>
                <td>{formatDateTime(booking.endTime)}</td>
                <td>{booking.checkedInAt ? formatDateTime(booking.checkedInAt) : "-"}</td>
                <td>{booking.checkedOutAt ? formatDateTime(booking.checkedOutAt) : "-"}</td>
                <td>
                  {canManageBooking(booking) ? (
                    <>
                      <Link to={`/app/bookings/${booking.id}/edit`}>Edit</Link>{" "}
                      <button onClick={() => handleDelete(booking.id)} disabled={deleteMutation.isPending}>
                        Delete
                      </button>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="No bookings found." />
      )}
    </section>
  );
}
