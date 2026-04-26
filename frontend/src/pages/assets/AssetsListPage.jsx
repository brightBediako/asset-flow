import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useDeleteAssetMutation, useAssetsQuery } from "../../features/assets/assets.hooks";
import { isAdminRole } from "../../lib/auth";
import { getAssetStatusTone } from "../../lib/statusTone";

export function AssetsListPage() {
  const { data, isLoading, isError, error } = useAssetsQuery();
  const deleteMutation = useDeleteAssetMutation();
  const canManageAssets = isAdminRole();

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
      {deleteMutation.isError && <p className="error">Failed to delete asset.</p>}
      {data?.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Organization ID</th>
              <th>Category</th>
              {canManageAssets && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.name}</td>
                <td>
                  <Badge tone={getAssetStatusTone(asset.status)}>{asset.status}</Badge>
                </td>
                <td>{asset.organization?.id}</td>
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
        <EmptyState message="No assets found." />
      )}
    </section>
  );
}
