import * as yup from "yup";

export const organizationSchema = yup.object({
  name: yup.string().required("Organization name is required"),
});
