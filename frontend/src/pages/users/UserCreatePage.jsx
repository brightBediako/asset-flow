import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../features/users/users.hooks";
import { UserForm } from "./UserForm";

const initialValues = {
  fullName: "",
  email: "",
  roleId: "",
  organizationId: "",
  password: "",
};

export function UserCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateUserMutation();

  async function onSubmit(values) {
    if (!values.password) {
      throw new Error("Password is required");
    }
    await createMutation.mutateAsync({
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      passwordHash: values.password,
      role: { id: Number(values.roleId) },
      organization: values.organizationId ? { id: Number(values.organizationId) } : null,
    });
    navigate("/users");
  }

  return (
    <>
      <UserForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create User"
        requirePassword
      />
      {createMutation.isError && <p className="error">Failed to create user: {createMutation.error.message}</p>}
    </>
  );
}
