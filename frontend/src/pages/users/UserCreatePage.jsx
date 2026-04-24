import { useState } from "react";
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
  const [localError, setLocalError] = useState("");

  async function onSubmit(values) {
    setLocalError("");
    if (!values.password) {
      setLocalError("Password is required.");
      return;
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
      {localError && <p className="error">{localError}</p>}
      {createMutation.isError && <p className="error">Failed to create user: {createMutation.error.message}</p>}
    </>
  );
}
