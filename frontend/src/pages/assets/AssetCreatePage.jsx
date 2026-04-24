import { useNavigate } from "react-router-dom";
import { useCreateAssetMutation } from "../../features/assets/assets.hooks";
import { AssetForm } from "./AssetForm";

const initialValues = {
  name: "",
  description: "",
  status: "AVAILABLE",
  imageUrl: "",
  organizationId: "",
  categoryId: "",
};

export function AssetCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateAssetMutation();

  async function onSubmit(values) {
    await createMutation.mutateAsync({
      name: values.name.trim(),
      description: values.description?.trim() || null,
      status: values.status,
      imageUrl: values.imageUrl?.trim() || null,
      organization: { id: Number(values.organizationId) },
      category: values.categoryId ? { id: Number(values.categoryId) } : null,
    });
    navigate("/assets");
  }

  return (
    <>
      <AssetForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Asset"
      />
      {createMutation.isError && <p className="error">Failed to create asset: {createMutation.error.message}</p>}
    </>
  );
}
