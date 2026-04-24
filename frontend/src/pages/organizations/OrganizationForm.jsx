import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { organizationSchema } from "../../features/organizations/organizations.schema";

export function OrganizationForm({ initialValues, onSubmit, isSubmitting, submitLabel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(organizationSchema),
    defaultValues: initialValues,
  });

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <h2>{submitLabel}</h2>
      <label>
        Organization Name
        <input {...register("name")} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
