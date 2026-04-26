import * as yup from "yup";

const ASSET_STATUS = ["AVAILABLE", "RESERVED", "IN_USE", "UNDER_MAINTENANCE"];
const emptyToNull = (value, originalValue) => (originalValue === "" ? null : value);

export const assetSchema = yup.object({
  name: yup.string().required("Asset name is required"),
  description: yup.string().transform(emptyToNull).nullable(),
  status: yup.string().oneOf(ASSET_STATUS, "Invalid status").required("Status is required"),
  imageUrl: yup.string().transform(emptyToNull).url("Image URL must be valid").nullable(),
  organizationId: yup.string().required("Organization is required"),
  categoryId: yup.string().transform(emptyToNull).required("Category is required"),
});

export const assetStatusOptions = ASSET_STATUS;
