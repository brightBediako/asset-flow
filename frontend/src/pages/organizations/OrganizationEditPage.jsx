import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useOrganizationQuery,
  useUpdateOrganizationMutation,
} from "../../features/organizations/organizations.hooks";
import { OrganizationForm } from "./OrganizationForm";

export function OrganizationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOrganizationQuery(id);
  const updateMutation = useUpdateOrganizationMutation();

  async function onSubmit(values) {
    await updateMutation.mutateAsync({
      id,
      payload: { name: values.name.trim() },
    });
    navigate("/organizations");
  }

  if (isLoading) return <p>Loading organization...</p>;
  if (isError) return <p className="error">Failed to load organization: {error.message}</p>;

  return (
    <>
      <p>
        <Link to="/organizations">Back to organizations</Link>
      </p>
      <OrganizationForm
        initialValues={{ name: data?.name ?? "" }}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Organization"
      />
      {updateMutation.isError && (
        <p className="error">Failed to update organization: {updateMutation.error.message}</p>
      )}
    </>
  );
}
