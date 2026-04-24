import * as yup from "yup";

const ASSET_STATUS = ["AVAILABLE", "RESERVED", "IN_USE", "UNDER_MAINTENANCE"];

export const assetSchema = yup.object({
  name: yup.string().required("Asset name is required"),
  description: yup.string().nullable(),
  status: yup.string().oneOf(ASSET_STATUS, "Invalid status").required("Status is required"),
  imageUrl: yup.string().url("Image URL must be valid").nullable(),
  organizationId: yup.string().required("Organization is required"),
  categoryId: yup.string().nullable(),
});

export const assetStatusOptions = ASSET_STATUS;
