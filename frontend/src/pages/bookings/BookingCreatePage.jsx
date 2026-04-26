import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateBookingMutation } from "../../features/bookings/bookings.hooks";
import { BookingForm } from "./BookingForm";

function toIsoOrNull(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function BookingCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createMutation = useCreateBookingMutation();
  const initialValues = {
    organizationId: searchParams.get("organizationId") ?? "",
    assetId: searchParams.get("assetId") ?? "",
    userId: "",
    approvedById: "",
    startTime: "",
    endTime: "",
    status: "PENDING",
    checkedInAt: "",
    checkedOutAt: "",
  };

  async function onSubmit(values) {
    await createMutation.mutateAsync({
      organization: { id: Number(values.organizationId) },
      asset: { id: Number(values.assetId) },
      user: { id: Number(values.userId) },
      approvedBy: values.approvedById ? { id: Number(values.approvedById) } : null,
      startTime: toIsoOrNull(values.startTime),
      endTime: toIsoOrNull(values.endTime),
      status: values.status,
      checkedInAt: toIsoOrNull(values.checkedInAt),
      checkedOutAt: toIsoOrNull(values.checkedOutAt),
    });
    navigate("/app/bookings");
  }

  return (
    <>
      <BookingForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Booking"
      />
      {createMutation.isError && (
        <p className="error">Failed to create booking: {createMutation.error.message}</p>
      )}
    </>
  );
}
