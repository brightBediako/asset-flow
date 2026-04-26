import { apiClient } from "../../lib/apiClient";

export async function getRoles() {
  const { data } = await apiClient.get("/roles");
  return data;
}
