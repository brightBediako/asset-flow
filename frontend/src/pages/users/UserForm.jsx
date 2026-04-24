import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { useRolesQuery } from "../../features/roles/roles.hooks";
import { userSchema } from "../../features/users/users.schema";

export function UserForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  requirePassword = false,
}) {
  const { data: organizations = [] } = useOrganizationsQuery();
  const { data: roles = [] } = useRolesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialValues,
  });

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <h2>{submitLabel}</h2>
      <label>
        Full Name
        <input {...register("fullName")} />
        {errors.fullName && <span className="error">{errors.fullName.message}</span>}
      </label>
      <label>
        Email
        <input type="email" {...register("email")} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>
      <label>
        Role
        <select {...register("roleId")}>
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role.id} value={String(role.id)}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.roleId && <span className="error">{errors.roleId.message}</span>}
      </label>
      <label>
        Organization
        <select {...register("organizationId")}>
          <option value="">No organization</option>
          {organizations.map((organization) => (
            <option key={organization.id} value={String(organization.id)}>
              {organization.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Password {requirePassword ? "" : "(optional)"}
        <input type="password" {...register("password")} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
