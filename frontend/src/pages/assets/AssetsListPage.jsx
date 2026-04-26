import { Link } from "react-router-dom";
import { useDeleteAssetMutation, useAssetsQuery } from "../../features/assets/assets.hooks";

export function AssetsListPage() {
  const { data, isLoading, isError, error } = useAssetsQuery();
  const deleteMutation = useDeleteAssetMutation();

  async function handleDelete(id) {
    const confirmed = globalThis.confirm("Delete this asset?");
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Loading assets...</p>;
  if (isError) return <p className="error">Failed to load assets: {error.message}</p>;

  return (
    <section>
      <h2>Assets</h2>
      <p>
        <Link to="/app/assets/new">Create Asset</Link>
      </p>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.name}</td>
                <td>{asset.status}</td>
                <td>{asset.organization?.id}</td>
                <td>{asset.category?.name ?? "-"}</td>
                <td>
                  <Link to={`/app/assets/${asset.id}/edit`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(asset.id)} disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assets found.</p>
      )}
    </section>
  );
}
