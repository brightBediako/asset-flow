import { Link } from "react-router-dom";
import { useAssetsQuery } from "../../features/assets/assets.hooks";

export function AssetBookingPage() {
  const { data, isLoading, isError, error } = useAssetsQuery();

  if (isLoading) return <p>Loading assets...</p>;
  if (isError) return <p className="error">Failed to load assets: {error.message}</p>;

  return (
    <section>
      <h2>Book an Asset</h2>
      <p>Select an asset and continue to booking.</p>

      {data?.length ? (
        <div className="asset-grid">
          {data.map((asset) => (
            <article key={asset.id} className="asset-card">
              <h3>{asset.name}</h3>
              <p>Status: {asset.status}</p>
              <p>Organization ID: {asset.organization?.id}</p>
              <p>Category: {asset.category?.name ?? "-"}</p>
              <p>{asset.description || "No description provided."}</p>
              <Link
                to={`/app/bookings/new?organizationId=${asset.organization?.id ?? ""}&assetId=${asset.id}`}
                className="asset-book-link"
              >
                Book this asset
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No assets available for booking.</p>
      )}
    </section>
  );
}
