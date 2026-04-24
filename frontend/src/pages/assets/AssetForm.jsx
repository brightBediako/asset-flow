import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { useAssetCategoriesQuery } from "../../features/asset-categories/assetCategories.hooks";
import { assetSchema, assetStatusOptions } from "../../features/assets/assets.schema";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";

export function AssetForm({ initialValues, onSubmit, isSubmitting, submitLabel }) {
  const { data: organizations = [] } = useOrganizationsQuery();
  const { data: categories = [] } = useAssetCategoriesQuery();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(assetSchema),
    defaultValues: initialValues,
  });

  const selectedOrganizationId = useWatch({ control, name: "organizationId" });
  const filteredCategories = categories.filter(
    (category) => String(category.organization?.id) === String(selectedOrganizationId),
  );

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
        <input {...register("description")} />
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
        <select {...register("categoryId")}>
          <option value="">No category</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
