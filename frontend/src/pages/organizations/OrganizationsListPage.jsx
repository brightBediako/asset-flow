import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import {
  useDeleteOrganizationMutation,
  useOrganizationsQuery,
} from "../../features/organizations/organizations.hooks";

export function OrganizationsListPage() {
  const { data, isLoading, isError, error } = useOrganizationsQuery();
  const deleteMutation = useDeleteOrganizationMutation();

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this organization?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <LoadingState message="Loading organizations..." />;
  if (isError) return <ErrorState error={error} fallback="Failed to load organizations." />;

  return (
    <section>
      <h2>Organizations</h2>
      <p>
        <Link to="/app/organizations/new">Create Organization</Link>
      </p>
      {deleteMutation.isError && <p className="error">Failed to delete organization.</p>}
      {data?.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((organization) => (
              <tr key={organization.id}>
                <td>{organization.id}</td>
                <td>{organization.name}</td>
                <td>
                  <Link to={`/app/organizations/${organization.id}/edit`}>Edit</Link>{" "}
                  <button
                    onClick={() => handleDelete(organization.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="No organizations found." />
      )}
    </section>
  );
}
