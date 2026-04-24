import { Link } from "react-router-dom";
import { useDeleteOrganizationMutation } from "../../features/organizations/organizations.hooks";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";

export function OrganizationsListPage() {
  const { data, isLoading, isError, error } = useOrganizationsQuery();
  const deleteMutation = useDeleteOrganizationMutation();

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this organization?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Loading organizations...</p>;
  if (isError) return <p className="error">Failed to load organizations: {error.message}</p>;

  return (
    <section>
      <h2>Organizations</h2>
      <p>
        <Link to="/organizations/new">Create Organization</Link>
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
                  <Link to={`/organizations/${organization.id}/edit`}>Edit</Link>{" "}
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
        <p>No organizations found.</p>
      )}
    </section>
  );
}
