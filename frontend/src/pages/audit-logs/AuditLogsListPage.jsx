import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useAuditLogsQuery } from "../../features/audit-logs/auditLogs.hooks";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { formatDateTime } from "../../lib/format";
import { getAuditActionTone } from "../../lib/statusTone";

const PAGE_SIZE = 20;

export function AuditLogsListPage() {
  const [organizationId, setOrganizationId] = useState("");
  const [page, setPage] = useState(0);
  const { data: organizations = [] } = useOrganizationsQuery();
  const { data, isLoading, isError, error } = useAuditLogsQuery({
    organizationId,
    page,
    size: PAGE_SIZE,
  });

  const logs = data?.content ?? [];

  return (
    <section>
      <h2>Audit Logs</h2>
      <label>
        Organization{" "}
        <select
          value={organizationId}
          onChange={(event) => {
            setOrganizationId(event.target.value);
            setPage(0);
          }}
        >
          <option value="">Select organization</option>
          {organizations.map((organization) => (
            <option key={organization.id} value={String(organization.id)}>
              {organization.name}
            </option>
          ))}
        </select>
      </label>

      {!organizationId && <EmptyState message="Select an organization to load audit logs." />}
      {organizationId && isLoading && <LoadingState message="Loading audit logs..." />}
      {organizationId && isError && <ErrorState error={error} fallback="Failed to load audit logs." />}

      {organizationId && !isLoading && !isError && (
        <>
          {logs.length ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>User</th>
                  <th>Created At</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>
                      <Badge tone={getAuditActionTone(log.action)}>{log.action}</Badge>
                    </td>
                    <td>{log.entityType}</td>
                    <td>{log.entityId ?? "-"}</td>
                    <td>{log.user?.fullName ?? "-"}</td>
                    <td>{formatDateTime(log.createdAt)}</td>
                    <td>
                      <Link to={`/app/audit-logs/${log.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState message="No audit logs found for this organization." />
          )}

          <div className="pager">
            <button onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page <= 0}>
              Previous
            </button>
            <span>
              Page {Number(data?.number ?? 0) + 1} of {Math.max(Number(data?.totalPages ?? 1), 1)}
            </span>
            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={page + 1 >= Number(data?.totalPages ?? 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
