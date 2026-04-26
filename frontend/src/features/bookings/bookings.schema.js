import * as yup from "yup";

const BOOKING_STATUS = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

export const bookingSchema = yup.object({
  organizationId: yup.string().required("Organization is required"),
  assetId: yup.string().required("Asset is required"),
  userId: yup.string().required("User is required"),
  approvedById: yup.string().nullable(),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  status: yup.string().oneOf(BOOKING_STATUS, "Invalid status").required("Status is required"),
  checkedInAt: yup.string().nullable(),
  checkedOutAt: yup.string().nullable(),
});

/** Fields editable on update (schedule and parties are fixed after create). */
export const bookingEditSchema = yup.object({
  organizationId: yup.string().optional(),
  approvedById: yup.string().nullable(),
  status: yup.string().oneOf(BOOKING_STATUS, "Invalid status").required("Status is required"),
  checkedInAt: yup.string().nullable(),
  checkedOutAt: yup.string().nullable(),
});

export const bookingStatusOptions = BOOKING_STATUS;
