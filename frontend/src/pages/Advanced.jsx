function Advanced() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Advanced Features</h1>
      <div className="card">
        <p className="text-dark-text-secondary">
          Advanced PostgREST features demo coming soon...
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-dark-text mb-3">Features to Demo:</h2>
          <ul className="list-disc list-inside text-dark-text-secondary space-y-2">
            <li>Bulk operations (insert multiple records)</li>
            <li>Upsert functionality</li>
            <li>Views (book_details)</li>
            <li>RPC calls (search_books, get_top_genres)</li>
            <li>Aggregates and grouping</li>
            <li>Custom headers (count=exact)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Advanced;
