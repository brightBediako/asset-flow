import { useNavigate } from "react-router-dom";
import { useCreateMaintenanceRecordMutation } from "../../features/maintenance-records/maintenanceRecords.hooks";
import { MaintenanceRecordForm } from "./MaintenanceRecordForm";

const initialValues = {
  organizationId: "",
  assetId: "",
  createdById: "",
  description: "",
  startedAt: "",
  completedAt: "",
};

function toIsoOrNull(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function MaintenanceRecordCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateMaintenanceRecordMutation();

  async function onSubmit(values) {
    await createMutation.mutateAsync({
      organization: { id: Number(values.organizationId) },
      asset: { id: Number(values.assetId) },
      createdBy: values.createdById ? { id: Number(values.createdById) } : null,
      description: values.description.trim(),
      startedAt: toIsoOrNull(values.startedAt),
      completedAt: toIsoOrNull(values.completedAt),
    });
    navigate("/app/maintenance-records");
  }

  return (
    <>
      <MaintenanceRecordForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Maintenance Record"
      />
      {createMutation.isError && (
        <p className="error">Failed to create maintenance record: {createMutation.error.message}</p>
      )}
    </>
  );
}
