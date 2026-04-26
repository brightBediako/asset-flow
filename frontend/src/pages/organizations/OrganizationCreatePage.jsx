import { useNavigate } from "react-router-dom";
import { useCreateOrganizationMutation } from "../../features/organizations/organizations.hooks";
import { OrganizationForm } from "./OrganizationForm";

const initialValues = {
  name: "",
};

export function OrganizationCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateOrganizationMutation();

  async function onSubmit(values) {
    await createMutation.mutateAsync({ name: values.name.trim() });
    navigate("/app/organizations");
  }

  return (
    <>
      <OrganizationForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Organization"
      />
      {createMutation.isError && (
        <p className="error">Failed to create organization: {createMutation.error.message}</p>
      )}
    </>
  );
}
