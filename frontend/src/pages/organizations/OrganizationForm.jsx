import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { organizationSchema } from "../../features/organizations/organizations.schema";
import { applyServerFieldErrors } from "../../lib/formErrors";

const ORGANIZATION_FIELD_MAP = {
  name: "name",
};

export function OrganizationForm({ initialValues, onSubmit, isSubmitting, submitLabel, serverError }) {
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(organizationSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    applyServerFieldErrors(serverError, setError, ORGANIZATION_FIELD_MAP, setFocus);
  }, [serverError, setError, setFocus]);

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
