import * as yup from "yup";

export const userSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Email must be valid").required("Email is required"),
  roleId: yup.string().required("Role is required"),
  organizationId: yup.string().nullable(),
  password: yup.string().min(8, "Password must be at least 8 characters"),
});
