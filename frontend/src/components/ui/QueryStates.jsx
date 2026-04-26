import { getErrorMessage } from "../../lib/errors";

export function LoadingState({ message = "Loading..." }) {
  return <p className="state-message">{message}</p>;
}

export function ErrorState({ error, fallback = "Failed to load data." }) {
  return <p className="error state-message">{getErrorMessage(error, fallback)}</p>;
}

export function EmptyState({ message = "No results found." }) {
  return <p className="state-message">{message}</p>;
}
