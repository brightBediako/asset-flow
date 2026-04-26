import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useBookingSearchQuery, useDeleteBookingMutation } from "../../features/bookings/bookings.hooks";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { getCurrentUserId, isAdminRole } from "../../lib/auth";
import { formatDateTime } from "../../lib/format";
import { getBookingStatusTone } from "../../lib/statusTone";

const PAGE_SIZE = 20;

export function BookingsListPage() {
  const [organizationId, setOrganizationId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const isAdmin = isAdminRole();
  const currentUserId = getCurrentUserId();
  const { data, isLoading, isError, error } = useBookingSearchQuery({
    organizationId: isAdmin ? organizationId : undefined,
    userId: isAdmin ? undefined : currentUserId,
    query: searchQuery,
    page,
    size: PAGE_SIZE,
  });
  const { data: organizations = [] } = useOrganizationsQuery();
  const deleteMutation = useDeleteBookingMutation();
  const bookings = data?.content ?? [];

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
      <h2>{isAdmin ? "Bookings" : "My Bookings"}</h2>
      <p>
        <Link to="/app/asset-booking">{isAdmin ? "Create Booking" : "Book an Asset"}</Link>
      </p>
      {isAdmin && (
        <div className="table-filter-row">
          <select
            className="table-filter-select"
            value={organizationId}
            onChange={(event) => {
              setOrganizationId(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All organizations</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={String(organization.id)}>
                {organization.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <input
        className="table-filter-input"
        placeholder="Search by booking ID, user, asset, status..."
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setPage(0);
        }}
      />
      {deleteMutation.isError && <p className="error">Failed to delete booking.</p>}
      {bookings.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {isAdmin && <th>Organization ID</th>}
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
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <Link to={`/app/bookings/${booking.id}`}>{booking.id}</Link>
                </td>
                {isAdmin && <td>{booking.organization?.id}</td>}
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
        <EmptyState
          message={searchQuery.trim() ? "No bookings match your search." : "No bookings found."}
        />
      )}
      <div className="pager">
        <button onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page <= 0}>
          Previous
        </button>
        <span>
          Page {Number(data?.number ?? 0) + 1} of {Math.max(Number(data?.totalPages ?? 1), 1)}
        </span>
        <button
          onClick={() => setPage((current) => current + 1)}
          disabled={page + 1 >= Number(data?.totalPages ?? 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
