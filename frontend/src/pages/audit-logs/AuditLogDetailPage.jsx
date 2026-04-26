import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { useAuditLogQuery } from "../../features/audit-logs/auditLogs.hooks";
import { formatDateTime } from "../../lib/format";
import { getAuditActionTone } from "../../lib/statusTone";

export function AuditLogDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useAuditLogQuery(id);

  if (isLoading) return <p>Loading audit log...</p>;
  if (isError) return <p className="error">Failed to load audit log: {error.message}</p>;

  return (
    <section>
      <p>
        <Link to="/app/audit-logs">Back to audit logs</Link>
      </p>
      <h2>Audit Log #{data?.id}</h2>
      <table>
        <tbody>
          <tr>
            <th>Action</th>
            <td>
              {data?.action ? (
                <Badge tone={getAuditActionTone(data.action)}>{data.action}</Badge>
              ) : (
                "-"
              )}
            </td>
          </tr>
          <tr>
            <th>Entity Type</th>
            <td>{data?.entityType}</td>
          </tr>
          <tr>
            <th>Entity ID</th>
            <td>{data?.entityId ?? "-"}</td>
          </tr>
          <tr>
            <th>Organization ID</th>
            <td>{data?.organization?.id ?? "-"}</td>
          </tr>
          <tr>
            <th>User</th>
            <td>{data?.user?.fullName ?? "-"}</td>
          </tr>
          <tr>
            <th>Created At</th>
            <td>{formatDateTime(data?.createdAt)}</td>
          </tr>
          <tr>
            <th>Details</th>
            <td>
              <pre>{JSON.stringify(data?.details ?? {}, null, 2)}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
