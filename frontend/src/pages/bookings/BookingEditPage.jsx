import { Link, useNavigate, useParams } from "react-router-dom";
import { useBookingQuery, useUpdateBookingMutation } from "../../features/bookings/bookings.hooks";
import { BookingForm } from "./BookingForm";

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
    navigate("/bookings");
  }

  if (isLoading) return <p>Loading booking...</p>;
  if (isError) return <p className="error">Failed to load booking: {error.message}</p>;

  const initialValues = {
    organizationId: String(data?.organization?.id ?? ""),
    assetId: String(data?.asset?.id ?? ""),
    userId: String(data?.user?.id ?? ""),
    approvedById: data?.approvedBy?.id ? String(data.approvedBy.id) : "",
    startTime: toInputDateTime(data?.startTime),
    endTime: toInputDateTime(data?.endTime),
    status: data?.status ?? "PENDING",
    checkedInAt: toInputDateTime(data?.checkedInAt),
    checkedOutAt: toInputDateTime(data?.checkedOutAt),
  };

  return (
    <>
      <p>
        <Link to="/bookings">Back to bookings</Link>
      </p>
      <BookingForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Booking"
      />
      {updateMutation.isError && (
        <p className="error">Failed to update booking: {updateMutation.error.message}</p>
      )}
    </>
  );
}
