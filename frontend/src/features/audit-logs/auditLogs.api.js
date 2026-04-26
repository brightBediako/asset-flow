import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

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

  if (env.useMockData) {
    return mockApi.auditLogs.list(organizationId, page, size);
  }

  const { data } = await apiClient.get("/audit-logs", {
    params: { organizationId, page, size },
  });
  return data;
}

export async function getAuditLogById(id) {
  if (env.useMockData) return mockApi.auditLogs.get(id);
  const { data } = await apiClient.get(`/audit-logs/${id}`);
  return data;
}
