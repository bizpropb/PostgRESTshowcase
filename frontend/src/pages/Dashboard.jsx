function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Dashboard</h1>
      <div className="card">
        <p className="text-dark-text-secondary">
          Welcome to the PostgREST Showcase! This is a demonstration application showcasing PostgREST's capabilities.
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-dark-text mb-3">Features to Explore:</h2>
          <ul className="list-disc list-inside text-dark-text-secondary space-y-2">
            <li>CRUD operations on Books, Authors, and Genres</li>
            <li>Filtering, sorting, and pagination</li>
            <li>Embedding related data (joins)</li>
            <li>Views and RPC functions</li>
            <li>Bulk operations and more!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
