import { apiClient } from "../../lib/apiClient";

export async function getAssets({ organizationId } = {}) {
  const { data } = await apiClient.get("/assets", {
    params: organizationId ? { organizationId } : {},
  });
  return data;
}

export async function getAssetById(id) {
  const { data } = await apiClient.get(`/assets/${id}`);
  return data;
}

export async function createAsset(payload) {
  const { data } = await apiClient.post("/assets", payload);
  return data;
}

export async function updateAsset(id, payload) {
  const { data } = await apiClient.put(`/assets/${id}`, payload);
  return data;
}

export async function deleteAsset(id) {
  await apiClient.delete(`/assets/${id}`);
}

export async function searchAssets({ organizationId, query, page = 0, size = 20 } = {}) {
  const { data } = await apiClient.get("/assets/search", {
    params: {
      ...(organizationId ? { organizationId } : {}),
      ...(query ? { q: query } : {}),
      page,
      size,
    },
  });
  return data;
}
