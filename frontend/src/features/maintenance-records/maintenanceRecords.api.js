import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getMaintenanceRecords() {
  if (env.useMockData) return mockApi.maintenanceRecords.list();
  const { data } = await apiClient.get("/maintenance-records");
  return data;
}

export async function getMaintenanceRecordById(id) {
  if (env.useMockData) return mockApi.maintenanceRecords.get(id);
  const { data } = await apiClient.get(`/maintenance-records/${id}`);
  return data;
}

export async function createMaintenanceRecord(payload) {
  if (env.useMockData) return mockApi.maintenanceRecords.create(payload);
  const { data } = await apiClient.post("/maintenance-records", payload);
  return data;
}

export async function updateMaintenanceRecord(id, payload) {
  if (env.useMockData) return mockApi.maintenanceRecords.update(id, payload);
  const { data } = await apiClient.put(`/maintenance-records/${id}`, payload);
  return data;
}

export async function deleteMaintenanceRecord(id) {
  if (env.useMockData) return mockApi.maintenanceRecords.remove(id);
  await apiClient.delete(`/maintenance-records/${id}`);
}
