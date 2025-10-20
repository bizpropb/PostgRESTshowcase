import { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalGenres: 0,
  });
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreLimit, setGenreLimit] = useState(5);

  useEffect(() => {
    fetchDashboardData();
  }, [genreLimit]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [booksRes, authorsRes, genresRes, topGenresRes] = await Promise.all([
        api.getBooks({ limit: 1000 }), // Get all books to count
        api.getAuthors({ limit: 1000 }), // Get all authors to count
        api.getGenres({ limit: 1000 }), // Get all genres to count
        api.getTopGenres(genreLimit), // RPC call for top genres
      ]);

      setStats({
        totalBooks: booksRes.data.length,
        totalAuthors: authorsRes.data.length,
        totalGenres: genresRes.data.length,
      });

      setTopGenres(topGenresRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Dashboard</h1>

      {/* Welcome Card */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-dark-text mb-3">Welcome to Book Haven</h2>
        <p className="text-dark-text-secondary">
          This is a demonstration application showcasing PostgREST's capabilities through a simple library management system.
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-dark-text mb-2">Features Demonstrated:</h3>
          <ul className="list-disc list-inside text-dark-text-secondary space-y-1 text-sm">
            <li>CRUD operations on Books, Authors, and Genres</li>
            <li>Filtering, sorting, and pagination</li>
            <li>Embedding related data (joins)</li>
            <li>Views (pre-joined data)</li>
            <li>RPC functions (custom database functions)</li>
            <li>Database constraints (UNIQUE, CASCADE, SET NULL)</li>
            <li>Auto-generated OpenAPI documentation</li>
          </ul>
        </div>
      </div>

      {/* PostgREST Feature Badge */}
      <div className="bg-purple-900/30 border border-purple-700 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-purple-200">
          <span className="font-semibold">PostgREST Feature:</span> RPC (Remote Procedure Calls) - Custom Database Functions
        </p>
        <p className="text-xs text-purple-300 mt-1 font-mono">
          POST /rpc/get_top_genres with &#123;"limit_count": {genreLimit}&#125;
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="text-dark-text-secondary">Loading dashboard data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-200 font-semibold">Error loading dashboard</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Books */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-text-secondary mb-1">Total Books</p>
                  <p className="text-3xl font-bold text-dark-text">{stats.totalBooks}</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            {/* Total Authors */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-text-secondary mb-1">Total Authors</p>
                  <p className="text-3xl font-bold text-dark-text">{stats.totalAuthors}</p>
                </div>
                <div className="text-4xl">✍️</div>
              </div>
            </div>

            {/* Total Genres */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-text-secondary mb-1">Total Genres</p>
                  <p className="text-3xl font-bold text-dark-text">{stats.totalGenres}</p>
                </div>
                <div className="text-4xl">🏷️</div>
              </div>
            </div>
          </div>

          {/* Top Genres Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-text">Top Genres by Book Count</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-dark-text-secondary">Show:</label>
                <select
                  value={genreLimit}
                  onChange={(e) => setGenreLimit(Number(e.target.value))}
                  className="input-field text-sm"
                >
                  <option value="3">Top 3</option>
                  <option value="5">Top 5</option>
                  <option value="10">Top 10</option>
                </select>
              </div>
            </div>

            {topGenres.length === 0 ? (
              <p className="text-center py-8 text-dark-text-secondary">No data available</p>
            ) : (
              <div className="space-y-4">
                {topGenres.map((genre, index) => {
                  const maxCount = topGenres[0]?.book_count || 1;
                  const percentage = (genre.book_count / maxCount) * 100;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-dark-accent">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-dark-text">
                            {genre.genre_name}
                          </span>
                        </div>
                        <span className="text-dark-text-secondary">
                          {genre.book_count} {genre.book_count === 1 ? 'book' : 'books'}
                        </span>
                      </div>
                      <div className="w-full bg-dark-bg-tertiary rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-dark-text-secondary">
                <span className="font-semibold">How this works:</span> This chart uses a PostgreSQL function
                called <code className="bg-dark-bg-tertiary px-1 py-0.5 rounded">get_top_genres()</code> which
                aggregates book counts per genre using SQL's COUNT and GROUP BY. PostgREST exposes this function
                via the <code className="bg-dark-bg-tertiary px-1 py-0.5 rounded">/rpc/get_top_genres</code> endpoint.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <a href="/books" className="card hover:bg-dark-bg-tertiary transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">Manage Books</h3>
                <p className="text-sm text-dark-text-secondary">Add, edit, or delete books</p>
              </div>
            </a>

            <a href="/authors" className="card hover:bg-dark-bg-tertiary transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">Manage Authors</h3>
                <p className="text-sm text-dark-text-secondary">Add, edit, or delete authors</p>
              </div>
            </a>

            <a href="/genres" className="card hover:bg-dark-bg-tertiary transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-4xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">Manage Genres</h3>
                <p className="text-sm text-dark-text-secondary">Add, edit, or delete genres</p>
              </div>
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
