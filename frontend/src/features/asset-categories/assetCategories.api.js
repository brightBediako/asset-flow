import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getAssetCategories() {
  if (env.useMockData) return mockApi.assetCategories.list();
  const { data } = await apiClient.get("/asset-categories");
  return data;
}
