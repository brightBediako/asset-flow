import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useAssetSearchQuery, useDeleteAssetMutation } from "../../features/assets/assets.hooks";
import { useOrganizationsQuery } from "../../features/organizations/organizations.hooks";
import { isAdminRole } from "../../lib/auth";
import { getAssetStatusTone } from "../../lib/statusTone";

const PAGE_SIZE = 20;

export function AssetsListPage() {
  const [organizationId, setOrganizationId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const canManageAssets = isAdminRole();
  const { data, isLoading, isError, error } = useAssetSearchQuery({
    organizationId: canManageAssets ? organizationId : undefined,
    query: searchQuery,
    page,
    size: PAGE_SIZE,
  });
  const { data: organizations = [] } = useOrganizationsQuery({ enabled: canManageAssets });
  const deleteMutation = useDeleteAssetMutation();
  const assets = data?.content ?? [];

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this asset?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <LoadingState message="Loading assets..." />;
  if (isError) return <ErrorState error={error} fallback="Failed to load assets." />;

  return (
    <section>
      <h2>Assets</h2>
      {canManageAssets && (
        <p>
          <Link to="/app/assets/new">Create Asset</Link>
        </p>
      )}
      {canManageAssets && (
        <div className="table-filter-row">
          <select
            className="table-filter-select"
            value={organizationId}
            onChange={(event) => {
              setOrganizationId(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All organizations</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={String(organization.id)}>
                {organization.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <input
        className="table-filter-input"
        placeholder="Search by name, status, category, org..."
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setPage(0);
        }}
      />
      {deleteMutation.isError && <p className="error">Failed to delete asset.</p>}
      {assets.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              {canManageAssets && <th>Organization ID</th>}
              <th>Category</th>
              {canManageAssets && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.name}</td>
                <td>
                  <Badge tone={getAssetStatusTone(asset.status)}>{asset.status}</Badge>
                </td>
                {canManageAssets && <td>{asset.organization?.id}</td>}
                <td>{asset.category?.name ?? "-"}</td>
                {canManageAssets && (
                  <td>
                    <Link to={`/app/assets/${asset.id}/edit`}>Edit</Link>{" "}
                    <button onClick={() => handleDelete(asset.id)} disabled={deleteMutation.isPending}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState
          message={searchQuery.trim() ? "No assets match your search." : "No assets found."}
        />
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
    </section>
  );
}
