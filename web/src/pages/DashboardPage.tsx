function DashboardPage() {
  return (
    <main className="page dashboard-page">
      <section className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Manage your generated LinkedIn posts and extension activity.</p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Generated Posts</h3>
          <p>0</p>
        </div>

        <div className="stat-card">
          <h3>This Month</h3>
          <p>0</p>
        </div>

        <div className="stat-card">
          <h3>Plan</h3>
          <p>Free</p>
        </div>
      </section>

      <section className="content-card">
        <h2>Recent Posts</h2>
        <p>No generated posts yet.</p>
      </section>
    </main>
  );
}

export default DashboardPage;
