import { useState } from 'react';
import api from '../services/api';

function Advanced() {
  // Bulk Insert State
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkError, setBulkError] = useState(null);

  // View Query State
  const [viewLoading, setViewLoading] = useState(false);
  const [viewResult, setViewResult] = useState(null);
  const [viewError, setViewError] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Aggregates State
  const [aggregatesLoading, setAggregatesLoading] = useState(false);
  const [aggregatesResult, setAggregatesResult] = useState(null);
  const [aggregatesError, setAggregatesError] = useState(null);

  // Bulk Insert Handler
  const handleBulkInsert = async () => {
    setBulkLoading(true);
    setBulkResult(null);
    setBulkError(null);

    const sampleBooks = [
      {
        title: 'Bulk Book 1',
        year: 2024,
        author_id: 1,
        genre_id: 1,
        description: 'This book was inserted via bulk operation',
      },
      {
        title: 'Bulk Book 2',
        year: 2024,
        author_id: 2,
        genre_id: 2,
        description: 'This is another bulk-inserted book',
      },
      {
        title: 'Bulk Book 3',
        year: 2024,
        author_id: 3,
        genre_id: 3,
        description: 'Third book in the bulk insert demo',
      },
    ];

    try {
      const response = await api.bulkCreateBooks(sampleBooks);
      setBulkResult(response.data);
    } catch (err) {
      setBulkError(err.message);
    } finally {
      setBulkLoading(false);
    }
  };

  // View Query Handler
  const handleViewQuery = async () => {
    setViewLoading(true);
    setViewResult(null);
    setViewError(null);

    try {
      const response = await api.getBookDetails({ limit: 5 });
      setViewResult(response.data);
    } catch (err) {
      setViewError(err.message);
    } finally {
      setViewLoading(false);
    }
  };

  // Search Handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearchLoading(true);
    setSearchResult(null);
    setSearchError(null);

    try {
      const response = await api.searchBooks(searchTerm);
      setSearchResult(response.data);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Aggregates Handler
  const handleAggregates = async () => {
    setAggregatesLoading(true);
    setAggregatesResult(null);
    setAggregatesError(null);

    try {
      const response = await api.getBookCountByGenre();
      setAggregatesResult(response.data);
    } catch (err) {
      setAggregatesError(err.message);
    } finally {
      setAggregatesLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Advanced Features</h1>

      <div className="card mb-6">
        <p className="text-dark-text-secondary">
          This page demonstrates advanced PostgREST capabilities beyond basic CRUD operations.
        </p>
      </div>

      {/* Bulk Insert */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">1. Bulk Insert</h2>
            <p className="text-sm text-dark-text-secondary">
              Insert multiple records in a single API call by sending an array of objects.
            </p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 rounded px-3 py-1">
            <p className="text-xs text-orange-200 font-mono">POST /books</p>
          </div>
        </div>

        <div className="bg-dark-bg-tertiary rounded p-4 mb-4">
          <p className="text-xs text-dark-text-secondary mb-2">Request body:</p>
          <pre className="text-xs text-dark-text overflow-x-auto">
{`[
  { "title": "Book 1", "year": 2024, ... },
  { "title": "Book 2", "year": 2024, ... },
  { "title": "Book 3", "year": 2024, ... }
]`}
          </pre>
        </div>

        <button
          onClick={handleBulkInsert}
          disabled={bulkLoading}
          className="btn-primary mb-4"
        >
          {bulkLoading ? 'Inserting...' : 'Insert 3 Books at Once'}
        </button>

        {bulkError && (
          <div className="bg-red-900/30 border border-red-700 rounded px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">{bulkError}</p>
          </div>
        )}

        {bulkResult && (
          <div className="bg-green-900/30 border border-green-700 rounded px-4 py-3">
            <p className="text-green-200 font-semibold mb-2">
              ✓ Successfully inserted {bulkResult.length} books!
            </p>
            <p className="text-xs text-green-300">
              Titles: {bulkResult.map((b) => b.title).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* View Query */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">2. View Query</h2>
            <p className="text-sm text-dark-text-secondary">
              Query pre-joined data from a database view that combines books, authors, and genres.
            </p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 rounded px-3 py-1">
            <p className="text-xs text-orange-200 font-mono">GET /book_details</p>
          </div>
        </div>

        <div className="bg-dark-bg-tertiary rounded p-4 mb-4">
          <p className="text-xs text-dark-text-secondary mb-2">View definition:</p>
          <pre className="text-xs text-dark-text overflow-x-auto">
{`CREATE VIEW book_details AS
SELECT b.*, a.name as author_name, g.name as genre_name
FROM books b
LEFT JOIN authors a ON b.author_id = a.id
LEFT JOIN genres g ON b.genre_id = g.id;`}
          </pre>
        </div>

        <button
          onClick={handleViewQuery}
          disabled={viewLoading}
          className="btn-primary mb-4"
        >
          {viewLoading ? 'Loading...' : 'Query book_details View (First 5)'}
        </button>

        {viewError && (
          <div className="bg-red-900/30 border border-red-700 rounded px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">{viewError}</p>
          </div>
        )}

        {viewResult && viewResult.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author Name</th>
                  <th>Genre Name</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {viewResult.map((book) => (
                  <tr key={book.id}>
                    <td className="font-medium">{book.title}</td>
                    <td>{book.author_name || '-'}</td>
                    <td>{book.genre_name || '-'}</td>
                    <td>{book.year || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RPC Search */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">3. RPC Search Function</h2>
            <p className="text-sm text-dark-text-secondary">
              Call a custom PostgreSQL function to search books by title or description.
            </p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 rounded px-3 py-1">
            <p className="text-xs text-orange-200 font-mono">POST /rpc/search_books</p>
          </div>
        </div>

        <div className="bg-dark-bg-tertiary rounded p-4 mb-4">
          <p className="text-xs text-dark-text-secondary mb-2">Function definition:</p>
          <pre className="text-xs text-dark-text overflow-x-auto">
{`CREATE FUNCTION search_books(search_term TEXT)
RETURNS SETOF books AS $$
  SELECT * FROM books
  WHERE title ILIKE '%' || search_term || '%'
     OR description ILIKE '%' || search_term || '%';
$$ LANGUAGE SQL;`}
          </pre>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., wizard, detective, space"
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={searchLoading || !searchTerm}
              className="btn-primary"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searchError && (
          <div className="bg-red-900/30 border border-red-700 rounded px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">{searchError}</p>
          </div>
        )}

        {searchResult && (
          <div className="bg-blue-900/30 border border-blue-700 rounded px-4 py-3">
            <p className="text-blue-200 font-semibold mb-2">
              Found {searchResult.length} book(s) matching "{searchTerm}"
            </p>
            {searchResult.length > 0 && (
              <ul className="text-sm text-blue-300 list-disc list-inside">
                {searchResult.map((book) => (
                  <li key={book.id}>{book.title} ({book.year || 'N/A'})</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Aggregates */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">4. Aggregates & Grouping</h2>
            <p className="text-sm text-dark-text-secondary">
              Use PostgREST's aggregation features to count books grouped by genre.
            </p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 rounded px-3 py-1">
            <p className="text-xs text-orange-200 font-mono">GET /books?select=...</p>
          </div>
        </div>

        <div className="bg-dark-bg-tertiary rounded p-4 mb-4">
          <p className="text-xs text-dark-text-secondary mb-2">Query parameters:</p>
          <pre className="text-xs text-dark-text overflow-x-auto">
{`?select=genre_id,count
&group_by=genre_id`}
          </pre>
        </div>

        <button
          onClick={handleAggregates}
          disabled={aggregatesLoading}
          className="btn-primary mb-4"
        >
          {aggregatesLoading ? 'Loading...' : 'Get Book Count by Genre'}
        </button>

        {aggregatesError && (
          <div className="bg-red-900/30 border border-red-700 rounded px-4 py-3 mb-4">
            <p className="text-red-200 text-sm">{aggregatesError}</p>
          </div>
        )}

        {aggregatesResult && aggregatesResult.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Genre ID</th>
                  <th>Book Count</th>
                </tr>
              </thead>
              <tbody>
                {aggregatesResult.map((item, index) => (
                  <tr key={index}>
                    <td>{item.genre_id || 'NULL'}</td>
                    <td className="font-semibold">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700">
        <h2 className="text-xl font-semibold text-dark-text mb-3">🎉 PostgREST Feature Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-text-secondary">
          <div>
            <p className="font-semibold text-dark-text mb-2">Demonstrated Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bulk operations (array inserts)</li>
              <li>Views (pre-joined data)</li>
              <li>RPC functions (custom logic)</li>
              <li>Aggregates (COUNT, GROUP BY)</li>
              <li>Full-text search (ILIKE)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-dark-text mb-2">Additional Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>CRUD operations (all pages)</li>
              <li>Filtering & sorting (Books page)</li>
              <li>Pagination (Books page)</li>
              <li>Embedding/joins (Books page)</li>
              <li>Constraints (UNIQUE, CASCADE, SET NULL)</li>
              <li>Auto-generated OpenAPI docs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advanced;
