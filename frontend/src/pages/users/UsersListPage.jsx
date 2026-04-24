import { Link } from "react-router-dom";
import { useDeleteUserMutation, useUsersQuery } from "../../features/users/users.hooks";

export function UsersListPage() {
  const { data, isLoading, isError, error } = useUsersQuery();
  const deleteMutation = useDeleteUserMutation();

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this user?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p className="error">Failed to load users: {error.message}</p>;

  return (
    <section>
      <h2>Users</h2>
      <p>
        <Link to="/users/new">Create User</Link>
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
                  <Link to={`/users/${user.id}/edit`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(user.id)} disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </section>
  );
}
