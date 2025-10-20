function ApiDocs() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">API Documentation</h1>
      <div className="card mb-6">
        <p className="text-dark-text-secondary mb-4">
          PostgREST auto-generates OpenAPI documentation for all endpoints. You can view it in the following ways:
        </p>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">Interactive Swagger UI</h3>
            <a
              href="http://localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Open Swagger UI →
            </a>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-dark-text mb-2">Alternative: Import to Swagger Editor</h3>
            <ol className="list-decimal list-inside text-dark-text-secondary space-y-2">
              <li>Go to <a href="https://editor.swagger.io/" target="_blank" rel="noopener noreferrer" className="text-dark-accent hover:text-dark-accent-hover">editor.swagger.io</a></li>
              <li>Click "File" → "Import URL"</li>
              <li>Enter: <code className="bg-dark-bg-tertiary px-2 py-1 rounded text-sm">http://localhost:3000/</code></li>
            </ol>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-dark-text mb-4">Available Endpoints</h2>
        <div className="space-y-4 text-dark-text-secondary">
          <div>
            <h3 className="font-semibold text-dark-text">Tables (CRUD)</h3>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li><code className="text-dark-accent">/books</code> - Books management</li>
              <li><code className="text-dark-accent">/authors</code> - Authors management</li>
              <li><code className="text-dark-accent">/genres</code> - Genres management</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-dark-text">Views</h3>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li><code className="text-dark-accent">/book_details</code> - Books with joined author and genre data</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-dark-text">RPC Functions</h3>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li><code className="text-dark-accent">/rpc/get_top_genres</code> - Get genres by book count</li>
              <li><code className="text-dark-accent">/rpc/search_books</code> - Full-text search across books</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiDocs;
