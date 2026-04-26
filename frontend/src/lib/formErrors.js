function toMessage(value) {
  if (value == null) return "Invalid value.";
  return String(value);
}

/**
 * Applies backend validation details to react-hook-form field errors.
 * Expects Spring payload shape: { details: { field: "message" } }.
 */
export function applyServerFieldErrors(error, setError, fieldMap = {}, setFocus) {
  const details = error?.response?.data?.details;
  if (!details || typeof details !== "object") return false;

  let applied = false;
  let firstField = null;
  Object.entries(details).forEach(([rawField, rawMessage]) => {
    const mappedField = fieldMap[rawField] ?? rawField;
    if (!mappedField) return;
    if (!firstField) firstField = mappedField;
    setError(mappedField, { type: "server", message: toMessage(rawMessage) });
    applied = true;
  });

  if (applied && firstField && typeof setFocus === "function") {
    setFocus(firstField);
  }

  return applied;
}
