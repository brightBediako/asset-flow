import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useBookingQuery, useUpdateBookingMutation } from "../../features/bookings/bookings.hooks";
import { getCurrentUserId, isAdminRole } from "../../lib/auth";
import { BookingForm } from "./BookingForm";
import { BookingReadonlySummary } from "./BookingReadonlySummary";

function toInputDateTime(value) {
  if (!value) return "";
  return value.slice(0, 16);
}

function toIsoOrNull(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function BookingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useBookingQuery(id);
  const updateMutation = useUpdateBookingMutation();
  const isAdmin = isAdminRole();
  const currentUserId = getCurrentUserId();

  function canManageBooking(booking) {
    if (isAdmin) return true;
    return String(booking?.user?.id) === String(currentUserId);
  }

  async function onSubmit(values) {
    await updateMutation.mutateAsync({
      id,
      payload: {
        status: values.status,
        approvedBy: values.approvedById ? { id: Number(values.approvedById) } : null,
        checkedInAt: toIsoOrNull(values.checkedInAt),
        checkedOutAt: toIsoOrNull(values.checkedOutAt),
      },
    });
    navigate("/app/bookings");
  }

  if (isLoading) return <p>Loading booking...</p>;
  if (isError) return <p className="error">Failed to load booking: {error.message}</p>;
  if (!canManageBooking(data)) return <Navigate to="/unauthorized" replace />;

  const initialValues = {
    organizationId: String(data?.organization?.id ?? ""),
    approvedById: data?.approvedBy?.id ? String(data.approvedBy.id) : "",
    status: data?.status ?? "PENDING",
    checkedInAt: toInputDateTime(data?.checkedInAt),
    checkedOutAt: toInputDateTime(data?.checkedOutAt),
  };

  return (
    <>
      <p>
        <Link to="/app/bookings">Back to bookings</Link>
      </p>

      <BookingReadonlySummary
        booking={data}
        compact
        hint="Schedule and assignment cannot be changed here. Update status, approver, or check-in times below."
      />

      <BookingForm
        variant="edit"
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Booking"
        serverError={updateMutation.error}
      />
      {updateMutation.isError && (
        <p className="error">Failed to update booking: {updateMutation.error.message}</p>
      )}
    </>
  );
}
