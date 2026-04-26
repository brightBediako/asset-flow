import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAssetCategoriesQuery } from "../../features/asset-categories/assetCategories.hooks";
import { assetSchema, assetStatusOptions } from "../../features/assets/assets.schema";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { applyServerFieldErrors } from "../../lib/formErrors";

const ASSET_FIELD_MAP = {
  name: "name",
  description: "description",
  status: "status",
  imageUrl: "imageUrl",
  organization: "organizationId",
  "organization.id": "organizationId",
  category: "categoryId",
  "category.id": "categoryId",
};

export function AssetForm({ initialValues, onSubmit, isSubmitting, submitLabel, serverError }) {
  const { data: organizations = [] } = useOrganizationsQuery();
  const { data: categories = [] } = useAssetCategoriesQuery();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(assetSchema),
    defaultValues: initialValues,
  });

  const selectedOrganizationId = useWatch({ control, name: "organizationId" });
  const filteredCategories = categories.filter(
    (category) => String(category.organization?.id) === String(selectedOrganizationId),
  );
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const imageUrlValue = useWatch({ control, name: "imageUrl" });

  useEffect(() => {
    applyServerFieldErrors(serverError, setError, ASSET_FIELD_MAP, setFocus);
  }, [serverError, setError, setFocus]);

  useEffect(() => {
    if (!selectedOrganizationId && selectedCategoryId) {
      setValue("categoryId", "");
      return;
    }

    if (!selectedCategoryId) return;
    const selectedCategoryExists = filteredCategories.some(
      (category) => String(category.id) === String(selectedCategoryId),
    );
    if (!selectedCategoryExists) {
      setValue("categoryId", "");
    }
  }, [filteredCategories, selectedCategoryId, selectedOrganizationId, setValue]);

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <h2>{submitLabel}</h2>
      <label>
        Name
        <input {...register("name")} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </label>
      <label>
        Description
        <textarea rows={3} {...register("description")} />
      </label>
      <label>
        Status
        <select {...register("status")}>
          {assetStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && <span className="error">{errors.status.message}</span>}
      </label>
      <label>
        Image URL
        <input {...register("imageUrl")} />
        {errors.imageUrl && <span className="error">{errors.imageUrl.message}</span>}
      </label>
      {imageUrlValue?.trim() && !errors.imageUrl && (
        <div>
          <p>Image Preview</p>
          <img
            src={imageUrlValue.trim()}
            alt="Asset preview"
            style={{ maxWidth: "240px", maxHeight: "180px", objectFit: "cover", borderRadius: "8px" }}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      <label>
        Organization
        <select {...register("organizationId")}>
          <option value="">Select organization</option>
          {organizations.map((organization) => (
            <option key={organization.id} value={String(organization.id)}>
              {organization.name}
            </option>
          ))}
        </select>
        {errors.organizationId && <span className="error">{errors.organizationId.message}</span>}
      </label>
      <label>
        Category
        <select {...register("categoryId")} disabled={!selectedOrganizationId}>
          <option value="">Select category</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
        {!selectedOrganizationId && <span>Select an organization first to view categories.</span>}
        {errors.categoryId && <span className="error">{errors.categoryId.message}</span>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
