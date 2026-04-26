import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAssetsQuery } from "../../features/assets/assets.hooks";
import {
  bookingEditSchema,
  bookingSchema,
  bookingStatusOptions,
} from "../../features/bookings/bookings.schema";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { useUsersQuery } from "../../features/users/users.hooks";
import { applyServerFieldErrors } from "../../lib/formErrors";

const BOOKING_FIELD_MAP = {
  organization: "organizationId",
  "organization.id": "organizationId",
  asset: "assetId",
  "asset.id": "assetId",
  user: "userId",
  "user.id": "userId",
  approvedBy: "approvedById",
  "approvedBy.id": "approvedById",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  checkedInAt: "checkedInAt",
  checkedOutAt: "checkedOutAt",
};

export function BookingForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  variant = "create",
  serverError,
}) {
  const isEdit = variant === "edit";
  const { data: organizations = [] } = useOrganizationsQuery();
  const { data: assets = [] } = useAssetsQuery();
  const { data: users = [] } = useUsersQuery();

  const {
    register,
    handleSubmit,
    control,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isEdit ? bookingEditSchema : bookingSchema),
    defaultValues: initialValues,
  });

  const selectedOrganizationId = useWatch({ control, name: "organizationId" });
  const filteredAssets = assets.filter(
    (asset) => String(asset.organization?.id) === String(selectedOrganizationId),
  );
  const filteredUsers = users.filter(
    (user) => String(user.organization?.id) === String(selectedOrganizationId),
  );

  useEffect(() => {
    applyServerFieldErrors(serverError, setError, BOOKING_FIELD_MAP, setFocus);
  }, [serverError, setError, setFocus]);

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <h2>{submitLabel}</h2>
      {isEdit && <input type="hidden" {...register("organizationId")} />}
      {!isEdit && (
        <>
          <label>
            Organization
            <select {...register("organizationId")}>
              <option value="">Select organization</option>
              {organizations.map((organization) => (
                <option key={organization.id} value={String(organization.id)}>
                  {organization.name}
                </option>
              ))}
            </select>
            {errors.organizationId && <span className="error">{errors.organizationId.message}</span>}
          </label>
          <label>
            Asset
            <select {...register("assetId")}>
              <option value="">Select asset</option>
              {filteredAssets.map((asset) => (
                <option key={asset.id} value={String(asset.id)}>
                  {asset.name}
                </option>
              ))}
            </select>
            {errors.assetId && <span className="error">{errors.assetId.message}</span>}
          </label>
          <label>
            User
            <select {...register("userId")}>
              <option value="">Select user</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.fullName}
                </option>
              ))}
            </select>
            {errors.userId && <span className="error">{errors.userId.message}</span>}
          </label>
        </>
      )}
      <label>
        Approved By
        <select {...register("approvedById")}>
          <option value="">No approver</option>
          {filteredUsers.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.fullName}
            </option>
          ))}
        </select>
      </label>
      {!isEdit && (
        <>
          <label>
            Start Time
            <input type="datetime-local" {...register("startTime")} />
            {errors.startTime && <span className="error">{errors.startTime.message}</span>}
          </label>
          <label>
            End Time
            <input type="datetime-local" {...register("endTime")} />
            {errors.endTime && <span className="error">{errors.endTime.message}</span>}
          </label>
        </>
      )}
      <label>
        Status
        <select {...register("status")}>
          {bookingStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && <span className="error">{errors.status.message}</span>}
      </label>
      <label>
        Checked In At
        <input type="datetime-local" {...register("checkedInAt")} />
      </label>
      <label>
        Checked Out At
        <input type="datetime-local" {...register("checkedOutAt")} />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
