import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getRoles() {
  if (env.useMockData) return mockApi.roles.list();
  const { data } = await apiClient.get("/roles");
  return data;
}
