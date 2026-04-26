import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import {
  useDeleteMaintenanceRecordMutation,
  useMaintenanceRecordsQuery,
} from "../../features/maintenance-records/maintenanceRecords.hooks";
import { formatDateTime } from "../../lib/format";

export function MaintenanceRecordsListPage() {
  const { data, isLoading, isError, error } = useMaintenanceRecordsQuery();
  const deleteMutation = useDeleteMaintenanceRecordMutation();

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this maintenance record?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <LoadingState message="Loading maintenance records..." />;
  if (isError) return <ErrorState error={error} fallback="Failed to load maintenance records." />;

  return (
    <section>
      <h2>Maintenance Records</h2>
      <p>
        <Link to="/app/maintenance-records/new">Create Maintenance Record</Link>
      </p>
      {deleteMutation.isError && <p className="error">Failed to delete maintenance record.</p>}
      {data?.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Organization ID</th>
              <th>Asset</th>
              <th>Created By</th>
              <th>Description</th>
              <th>Started At</th>
              <th>Completed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.organization?.id}</td>
                <td>{record.asset?.name}</td>
                <td>{record.createdBy?.fullName ?? "-"}</td>
                <td>{record.description}</td>
                <td>{formatDateTime(record.startedAt)}</td>
                <td>{record.completedAt ? formatDateTime(record.completedAt) : "-"}</td>
                <td>
                  <Link to={`/app/maintenance-records/${record.id}/edit`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(record.id)} disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="No maintenance records found." />
      )}
    </section>
  );
}
