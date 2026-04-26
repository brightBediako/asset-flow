import { Link } from "react-router-dom";
import { PublicHeader } from "../../components/layout/PublicHeader";
import { useAssetsQuery } from "../../features/assets/assets.hooks";
import { isAuthenticated } from "../../lib/auth";

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
        {isLoading && <p>Loading assets...</p>}
        {isError && <p className="error">Failed to load assets: {error.message}</p>}

        {!isLoading && !isError && (
          <>
            {data?.length ? (
              <div className="asset-grid">
                {data.map((asset) => (
                  <article key={asset.id} className="asset-card">
                    <h3>{asset.name}</h3>
                    <p>Status: {asset.status}</p>
                    <p>Organization ID: {asset.organization?.id}</p>
                    <p>Category: {asset.category?.name ?? "-"}</p>
                    <p>{asset.description || "No description provided."}</p>
                    {authenticated ? (
                      <Link
                        to={`/app/bookings/new?organizationId=${asset.organization?.id ?? ""}&assetId=${asset.id}`}
                        className="asset-book-link"
                      >
                        Book this asset
                      </Link>
                    ) : (
                      <Link to="/login" className="asset-book-link">
                        Sign in to book
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p>No assets are currently listed.</p>
            )}
          </>
        )}
      </section>
    </>
  );
}
