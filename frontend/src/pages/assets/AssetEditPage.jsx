import { Link, useNavigate, useParams } from "react-router-dom";
import { useAssetQuery, useUpdateAssetMutation } from "../../features/assets/assets.hooks";
import { AssetForm } from "./AssetForm";

export function AssetEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useAssetQuery(id);
  const updateMutation = useUpdateAssetMutation();

  async function onSubmit(values) {
    await updateMutation.mutateAsync({
      id,
      payload: {
        name: values.name.trim(),
        description: values.description?.trim() || null,
        status: values.status,
        imageUrl: values.imageUrl?.trim() || null,
        organization: { id: Number(values.organizationId) },
        category: values.categoryId ? { id: Number(values.categoryId) } : null,
      },
    });
    navigate("/app/assets");
  }

  if (isLoading) return <p>Loading asset...</p>;
  if (isError) return <p className="error">Failed to load asset: {error.message}</p>;

  const initialValues = {
    name: data?.name ?? "",
    description: data?.description ?? "",
    status: data?.status ?? "AVAILABLE",
    imageUrl: data?.imageUrl ?? "",
    organizationId: String(data?.organization?.id ?? ""),
    categoryId: data?.category?.id ? String(data.category.id) : "",
  };

  return (
    <>
      <p>
        <Link to="/app/assets">Back to assets</Link>
      </p>
      <AssetForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Update Asset"
      />
      {updateMutation.isError && <p className="error">Failed to update asset: {updateMutation.error.message}</p>}
    </>
  );
}
