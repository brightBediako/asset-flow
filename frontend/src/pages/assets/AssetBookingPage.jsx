import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useAssetsQuery } from "../../features/assets/assets.hooks";
import { getAssetStatusTone } from "../../lib/statusTone";

export function AssetBookingPage() {
  const { data, isLoading, isError, error } = useAssetsQuery();

  if (isLoading) return <LoadingState message="Loading assets..." />;
  if (isError) return <ErrorState error={error} fallback="Failed to load assets." />;

  return (
    <section>
      <h2>Book an Asset</h2>
      <p>Select an asset and continue to booking.</p>

      {data?.length ? (
        <div className="asset-grid">
          {data.map((asset) => (
            <article key={asset.id} className="asset-card">
              <h3>{asset.name}</h3>
              <p className="asset-meta">
                <span>Status</span>
                <Badge tone={getAssetStatusTone(asset.status)}>{asset.status}</Badge>
              </p>
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
        <EmptyState message="No assets available for booking." />
      )}
    </section>
  );
}
