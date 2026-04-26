import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAssetsQuery } from "../../features/assets/assets.hooks";
import { maintenanceRecordSchema } from "../../features/maintenance-records/maintenanceRecords.schema";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { useUsersQuery } from "../../features/users/users.hooks";
import { applyServerFieldErrors } from "../../lib/formErrors";

const MAINTENANCE_FIELD_MAP = {
  organization: "organizationId",
  "organization.id": "organizationId",
  asset: "assetId",
  "asset.id": "assetId",
  createdBy: "createdById",
  "createdBy.id": "createdById",
  description: "description",
  startedAt: "startedAt",
  completedAt: "completedAt",
};

export function MaintenanceRecordForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  serverError,
}) {
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
    resolver: yupResolver(maintenanceRecordSchema),
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
    applyServerFieldErrors(serverError, setError, MAINTENANCE_FIELD_MAP, setFocus);
  }, [serverError, setError, setFocus]);

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <h2>{submitLabel}</h2>
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
        Created By
        <select {...register("createdById")}>
          <option value="">No creator</option>
          {filteredUsers.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.fullName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Description
        <input {...register("description")} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </label>
      <label>
        Started At
        <input type="datetime-local" {...register("startedAt")} />
        {errors.startedAt && <span className="error">{errors.startedAt.message}</span>}
      </label>
      <label>
        Completed At
        <input type="datetime-local" {...register("completedAt")} />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
