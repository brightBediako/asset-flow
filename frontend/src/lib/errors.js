function normalizeDuplicateKeyMessage(message) {
  const raw = String(message || "");
  const lower = raw.toLowerCase();
  if (!lower.includes("duplicate key value violates unique constraint")) {
    return null;
  }
  if (lower.includes("(email)")) {
    return "An account with this email already exists.";
  }
  return "A record with the same unique value already exists.";
}

export function getErrorMessage(error, fallback = "Something went wrong.") {
  const backendMessage = error?.response?.data?.message;
  const duplicateMessage = normalizeDuplicateKeyMessage(backendMessage);
  if (duplicateMessage) return duplicateMessage;

  return (
    backendMessage ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
