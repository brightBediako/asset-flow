import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import {
  useDeleteOrganizationMutation,
  useOrganizationSearchQuery,
} from "../../features/organizations/organizations.hooks";

const PAGE_SIZE = 20;

export function OrganizationsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error } = useOrganizationSearchQuery({
    query: searchQuery,
    page,
    size: PAGE_SIZE,
  });
  const deleteMutation = useDeleteOrganizationMutation();
  const organizations = data?.content ?? [];

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
      <input
        className="table-filter-input"
        placeholder="Search organizations by name or ID..."
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setPage(0);
        }}
      />
      {deleteMutation.isError && <p className="error">Failed to delete organization.</p>}
      {organizations.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((organization) => (
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
        <EmptyState
          message={searchQuery.trim() ? "No organizations match your search." : "No organizations found."}
        />
      )}
      <div className="pager">
        <button onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page <= 0}>
          Previous
        </button>
        <span>
          Page {Number(data?.number ?? 0) + 1} of {Math.max(Number(data?.totalPages ?? 1), 1)}
        </span>
        <button
          onClick={() => setPage((current) => current + 1)}
          disabled={page + 1 >= Number(data?.totalPages ?? 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
