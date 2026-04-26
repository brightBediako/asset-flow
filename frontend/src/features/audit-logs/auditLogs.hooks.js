import { useQuery } from "@tanstack/react-query";
import { getAuditLogById, getAuditLogs } from "./auditLogs.api";

export function useAuditLogsQuery(params) {
  return useQuery({
    queryKey: ["audit-logs", params.organizationId, params.page, params.size],
    queryFn: () => getAuditLogs(params),
    enabled: Boolean(params.organizationId),
  });
}

export function useAuditLogQuery(id) {
  return useQuery({
    queryKey: ["audit-logs", "detail", id],
    queryFn: () => getAuditLogById(id),
    enabled: Boolean(id),
  });
}
