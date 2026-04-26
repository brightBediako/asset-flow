import { apiClient } from "../../lib/apiClient";

export async function getAuditLogs({ organizationId, page = 0, size = 20 }) {
  if (!organizationId) {
    return {
      content: [],
      number: 0,
      size,
      totalElements: 0,
      totalPages: 0,
    };
  }

  const { data } = await apiClient.get("/audit-logs", {
    params: { organizationId, page, size },
  });
  return data;
}

export async function getAuditLogById(id) {
  const { data } = await apiClient.get(`/audit-logs/${id}`);
  return data;
}
