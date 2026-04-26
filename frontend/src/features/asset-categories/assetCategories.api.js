import { apiClient } from "../../lib/apiClient";

export async function getAssetCategories() {
  const { data } = await apiClient.get("/asset-categories");
  return data;
}
