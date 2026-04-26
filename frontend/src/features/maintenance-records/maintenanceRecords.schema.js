import * as yup from "yup";

export const maintenanceRecordSchema = yup.object({
  organizationId: yup.string().required("Organization is required"),
  assetId: yup.string().required("Asset is required"),
  createdById: yup.string().nullable(),
  description: yup.string().required("Description is required"),
  startedAt: yup.string().required("Started at is required"),
  completedAt: yup.string().nullable(),
});
