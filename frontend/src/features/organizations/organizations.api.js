import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getOrganizations() {
  if (env.useMockData) return mockApi.organizations.list();
  const { data } = await apiClient.get("/organizations");
  return data;
}

export async function getOrganizationById(id) {
  if (env.useMockData) return mockApi.organizations.get(id);
  const { data } = await apiClient.get(`/organizations/${id}`);
  return data;
}

export async function createOrganization(payload) {
  if (env.useMockData) return mockApi.organizations.create(payload);
  const { data } = await apiClient.post("/organizations", payload);
  return data;
}

export async function updateOrganization(id, payload) {
  if (env.useMockData) return mockApi.organizations.update(id, payload);
  const { data } = await apiClient.put(`/organizations/${id}`, payload);
  return data;
}

export async function deleteOrganization(id) {
  if (env.useMockData) return mockApi.organizations.remove(id);
  await apiClient.delete(`/organizations/${id}`);
}
