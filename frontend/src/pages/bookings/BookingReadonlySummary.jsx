import { Badge } from "../../components/ui/Badge";
import { formatDateTime } from "../../lib/format";
import { getBookingStatusTone } from "../../lib/statusTone";

/** `compact`: omit approver and check-in/out (e.g. edit page shows those in the form). */
export function BookingReadonlySummary({ booking, hint = null, compact = false }) {
  if (!booking) return null;

  return (
    <section className="booking-edit-summary">
      <h2>Booking #{booking.id}</h2>
      <p className="booking-edit-summary-meta">
        <span>Status</span>
        <Badge tone={getBookingStatusTone(booking.status)}>{booking.status}</Badge>
      </p>
      <dl className="booking-edit-dl">
        <div>
          <dt>Organization</dt>
          <dd>{booking.organization?.name ?? booking.organization?.id ?? "-"}</dd>
        </div>
        <div>
          <dt>Asset</dt>
          <dd>{booking.asset?.name ?? "-"}</dd>
        </div>
        <div>
          <dt>Booked by</dt>
          <dd>{booking.user?.fullName ?? "-"}</dd>
        </div>
        <div>
          <dt>Start</dt>
          <dd>{formatDateTime(booking.startTime)}</dd>
        </div>
        <div>
          <dt>End</dt>
          <dd>{formatDateTime(booking.endTime)}</dd>
        </div>
        {!compact && (
          <>
            <div>
              <dt>Approved by</dt>
              <dd>{booking.approvedBy?.fullName ?? "-"}</dd>
            </div>
            <div>
              <dt>Checked in</dt>
              <dd>{booking.checkedInAt ? formatDateTime(booking.checkedInAt) : "-"}</dd>
            </div>
            <div>
              <dt>Checked out</dt>
              <dd>{booking.checkedOutAt ? formatDateTime(booking.checkedOutAt) : "-"}</dd>
            </div>
          </>
        )}
      </dl>
      {hint ? <p className="booking-edit-hint">{hint}</p> : null}
    </section>
  );
}
