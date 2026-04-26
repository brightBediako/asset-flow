import { Link } from "react-router-dom";
import { useDeleteBookingMutation, useBookingsQuery } from "../../features/bookings/bookings.hooks";

export function BookingsListPage() {
  const { data, isLoading, isError, error } = useBookingsQuery();
  const deleteMutation = useDeleteBookingMutation();

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this booking?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Loading bookings...</p>;
  if (isError) return <p className="error">Failed to load bookings: {error.message}</p>;

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.organization?.id}</td>
                <td>{booking.asset?.name}</td>
                <td>{booking.user?.fullName}</td>
                <td>{booking.status}</td>
                <td>{booking.startTime}</td>
                <td>{booking.endTime}</td>
                <td>
                  <Link to={`/app/bookings/${booking.id}/edit`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(booking.id)} disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found.</p>
      )}
    </section>
  );
}
