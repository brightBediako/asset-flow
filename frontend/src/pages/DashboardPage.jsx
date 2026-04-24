import { useDashboardSummaryQuery } from "../features/dashboard/dashboard.hooks";

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardSummaryQuery();

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p className="error">Failed to load dashboard: {error.message}</p>;

  const cards = [
    { label: "Organizations", value: data?.organizations ?? 0 },
    { label: "Users", value: data?.users ?? 0 },
    { label: "Assets", value: data?.assets ?? 0 },
    { label: "Bookings", value: data?.bookings ?? 0 },
  ];

  return (
    <section>
      <h2>Dashboard</h2>
      <p>Overview of key AssetFlow entities.</p>
      <div className="dashboard-grid">
        {cards.map((card) => (
          <article key={card.label} className="summary-card">
            <h3>{card.label}</h3>
            <p className="summary-value">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
