import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useDeleteUserMutation, useUserSearchQuery } from "../../features/users/users.hooks";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";

const PAGE_SIZE = 20;

export function UsersListPage() {
  const [organizationId, setOrganizationId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error } = useUserSearchQuery({
    organizationId,
    query: searchQuery,
    page,
    size: PAGE_SIZE,
  });
  const { data: organizations = [] } = useOrganizationsQuery();
  const deleteMutation = useDeleteUserMutation();
  const users = data?.content ?? [];

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this user?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <LoadingState message="Loading users..." />;
  if (isError) return <ErrorState error={error} fallback="Failed to load users." />;

  return (
    <section>
      <h2>Users</h2>
      <p>
        <Link to="/app/users/new">Create User</Link>
      </p>
      <div className="table-filter-row">
        <select
          className="table-filter-select"
          value={organizationId}
          onChange={(event) => {
            setOrganizationId(event.target.value);
            setPage(0);
          }}
        >
          <option value="">All organizations</option>
          {organizations.map((organization) => (
            <option key={organization.id} value={String(organization.id)}>
              {organization.name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="table-filter-input"
        placeholder="Search by name, email, role, ID..."
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setPage(0);
        }}
      />
      {deleteMutation.isError && <p className="error">Failed to delete user.</p>}
      {users.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Organization ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role?.name}</td>
                <td>{user.organization?.id ?? "-"}</td>
                <td>
                  <Link to={`/app/users/${user.id}/edit`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(user.id)} disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message={searchQuery.trim() ? "No users match your search." : "No users found."} />
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
