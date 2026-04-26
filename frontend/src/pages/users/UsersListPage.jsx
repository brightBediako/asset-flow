import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useDeleteUserMutation, useUsersQuery } from "../../features/users/users.hooks";

export function UsersListPage() {
  const { data, isLoading, isError, error } = useUsersQuery();
  const deleteMutation = useDeleteUserMutation();

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
      {deleteMutation.isError && <p className="error">Failed to delete user.</p>}
      {data?.length ? (
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
            {data.map((user) => (
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
        <EmptyState message="No users found." />
      )}
    </section>
  );
}
