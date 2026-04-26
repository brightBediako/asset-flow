import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useMaintenanceRecordQuery,
  useUpdateMaintenanceRecordMutation,
} from "../../features/maintenance-records/maintenanceRecords.hooks";
import { MaintenanceRecordForm } from "./MaintenanceRecordForm";

function toInputDateTime(value) {
  if (!value) return "";
  return value.slice(0, 16);
}

function toIsoOrNull(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function MaintenanceRecordEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMaintenanceRecordQuery(id);
  const updateMutation = useUpdateMaintenanceRecordMutation();

  async function onSubmit(values) {
    await updateMutation.mutateAsync({
      id,
      payload: {
        description: values.description.trim(),
        completedAt: toIsoOrNull(values.completedAt),
      },
    });
    navigate("/maintenance-records");
  }

  if (isLoading) return <p>Loading maintenance record...</p>;
  if (isError) return <p className="error">Failed to load maintenance record: {error.message}</p>;

  const initialValues = {
    organizationId: String(data?.organization?.id ?? ""),
    assetId: String(data?.asset?.id ?? ""),
    createdById: data?.createdBy?.id ? String(data.createdBy.id) : "",
    description: data?.description ?? "",
    startedAt: toInputDateTime(data?.startedAt),
    completedAt: toInputDateTime(data?.completedAt),
  };

  return (
    <>
      <p>
        <Link to="/maintenance-records">Back to maintenance records</Link>
      </p>
      <MaintenanceRecordForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Maintenance Record"
      />
      {updateMutation.isError && (
        <p className="error">Failed to update maintenance record: {updateMutation.error.message}</p>
      )}
    </>
  );
}
