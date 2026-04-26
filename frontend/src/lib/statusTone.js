function normalize(value) {
  return String(value ?? "").trim().toUpperCase();
}

export function getAssetStatusTone(status) {
  switch (normalize(status)) {
    case "AVAILABLE":
      return "success";
    case "RESERVED":
      return "warning";
    case "IN_USE":
      return "info";
    case "UNDER_MAINTENANCE":
      return "danger";
    default:
      return "neutral";
  }
}

export function getBookingStatusTone(status) {
  switch (normalize(status)) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "COMPLETED":
      return "info";
    default:
      return "neutral";
  }
}

export function getAuditActionTone(action) {
  switch (normalize(action)) {
    case "CREATE":
    case "INSERT":
      return "success";
    case "UPDATE":
    case "EDIT":
      return "info";
    case "DELETE":
    case "REMOVE":
      return "danger";
    case "LOGIN":
    case "LOGOUT":
      return "neutral";
    default:
      return "neutral";
  }
}
