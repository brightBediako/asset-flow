import { Link } from "react-router-dom";
import { PublicHeader } from "../../components/layout/PublicHeader";
import { Badge } from "../../components/ui/Badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/QueryStates";
import { useAssetsQuery } from "../../features/assets/assets.hooks";
import { isAuthenticated } from "../../lib/auth";
import { getAssetStatusTone } from "../../lib/statusTone";

function getBookingPath(asset) {
  return `/app/bookings/new?organizationId=${asset.organization?.id ?? ""}&assetId=${asset.id}`;
}

export function PublicAssetsPage() {
  const authenticated = isAuthenticated();
  const { data, isLoading, isError, error } = useAssetsQuery();

  return (
    <>
      <PublicHeader />
      <section className="home-section">
        <h2>All Assets</h2>
        <p>Explore assets and start a booking request for what you need.</p>
      </section>

      <section className="home-section">
        {isLoading && <LoadingState message="Loading assets..." />}
        {isError && <ErrorState error={error} fallback="Failed to load assets." />}

        {!isLoading && !isError && (
          <>
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
                    {authenticated ? (
                      <Link
                        to={getBookingPath(asset)}
                        className="asset-book-link"
                      >
                        Book this asset
                      </Link>
                    ) : (
                      <Link
                        to={`/login?redirect=${encodeURIComponent(getBookingPath(asset))}`}
                        className="asset-book-link"
                      >
                        Sign in to book
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState message="No assets are currently listed." />
            )}
          </>
        )}
      </section>
    </>
  );
}
