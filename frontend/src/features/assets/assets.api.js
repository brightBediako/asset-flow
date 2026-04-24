import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getAssets() {
  if (env.useMockData) return mockApi.assets.list();
  const { data } = await apiClient.get("/assets");
  return data;
}

export async function getAssetById(id) {
  if (env.useMockData) return mockApi.assets.get(id);
  const { data } = await apiClient.get(`/assets/${id}`);
  return data;
}

export async function createAsset(payload) {
  if (env.useMockData) return mockApi.assets.create(payload);
  const { data } = await apiClient.post("/assets", payload);
  return data;
}

export async function updateAsset(id, payload) {
  if (env.useMockData) return mockApi.assets.update(id, payload);
  const { data } = await apiClient.put(`/assets/${id}`, payload);
  return data;
}

export async function deleteAsset(id) {
  if (env.useMockData) return mockApi.assets.remove(id);
  await apiClient.delete(`/assets/${id}`);
}
