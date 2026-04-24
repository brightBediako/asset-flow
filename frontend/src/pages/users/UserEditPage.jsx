import { Link, useNavigate, useParams } from "react-router-dom";
import { useUpdateUserMutation, useUserQuery } from "../../features/users/users.hooks";
import { UserForm } from "./UserForm";

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useUserQuery(id);
  const updateMutation = useUpdateUserMutation();

  async function onSubmit(values) {
    const payload = {
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      role: { id: Number(values.roleId) },
      organization: values.organizationId ? { id: Number(values.organizationId) } : null,
    };
    if (values.password) {
      payload.passwordHash = values.password;
    }
    await updateMutation.mutateAsync({ id, payload });
    navigate("/users");
  }

  if (isLoading) return <p>Loading user...</p>;
  if (isError) return <p className="error">Failed to load user: {error.message}</p>;

  const initialValues = {
    fullName: data?.fullName ?? "",
    email: data?.email ?? "",
    roleId: String(data?.role?.id ?? ""),
    organizationId: data?.organization?.id ? String(data.organization.id) : "",
    password: "",
  };

  return (
    <>
      <p>
        <Link to="/users">Back to users</Link>
      </p>
      <UserForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update User"
      />
      {updateMutation.isError && <p className="error">Failed to update user: {updateMutation.error.message}</p>}
    </>
  );
}
