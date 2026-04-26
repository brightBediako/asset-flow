import { apiClient } from "../../lib/apiClient";

export async function getOrganizations() {
  const { data } = await apiClient.get("/organizations");
  return data;
}

export async function getOrganizationById(id) {
  const { data } = await apiClient.get(`/organizations/${id}`);
  return data;
}

export async function createOrganization(payload) {
  const { data } = await apiClient.post("/organizations", payload);
  return data;
}

export async function updateOrganization(id, payload) {
  const { data } = await apiClient.put(`/organizations/${id}`, payload);
  return data;
}

export async function deleteOrganization(id) {
  await apiClient.delete(`/organizations/${id}`);
}
