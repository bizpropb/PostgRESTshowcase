import { useState, useEffect } from 'react';
import api from '../services/api';
import BookForm from '../components/BookForm';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and sorting
  const [searchTitle, setSearchTitle] = useState('');
  const [sortBy, setSortBy] = useState('title.asc');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        select: '*,author:authors(name),genre:genres(name)',
        limit,
        offset,
        order: sortBy,
        count: true,
      };

      if (searchTitle) {
        params.title = searchTitle;
      }

      const response = await api.getBooks(params);
      setBooks(response.data);
      setTotalCount(response.totalCount || response.data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTitle, sortBy, limit, offset]);

  const handleSearch = (e) => {
    e.preventDefault();
    setOffset(0); // Reset to first page
    fetchBooks();
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  const handleNextPage = () => {
    if (offset + limit < totalCount) {
      setOffset(offset + limit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  const handleAddBook = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handleSaveBook = () => {
    setShowForm(false);
    setEditingBook(null);
    fetchBooks(); // Refresh the list
  };

  const handleDeleteBook = async (book) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await api.deleteBook(book.id);
      fetchBooks(); // Refresh the list
    } catch (err) {
      alert(`Failed to delete book: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-dark-text">Books</h1>
        <button className="btn-primary" onClick={handleAddBook}>
          + Add Book
        </button>
      </div>

      {/* PostgREST Feature Badge */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-blue-200">
          <span className="font-semibold">PostgREST Features:</span> CRUD Operations, Filtering, Sorting, Pagination, Embedding (Joins)
        </p>
        <p className="text-xs text-blue-300 mt-1 font-mono">
          GET /books?select=*,author:authors(name),genre:genres(name)&order={sortBy}&limit={limit}&offset={offset}
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Search by Title
            </label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="e.g., Harry Potter"
              className="input-field w-full"
            />
          </div>

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full"
            >
              <option value="title.asc">Title (A-Z)</option>
              <option value="title.desc">Title (Z-A)</option>
              <option value="year.desc">Year (Newest)</option>
              <option value="year.asc">Year (Oldest)</option>
              <option value="id.asc">ID (Ascending)</option>
            </select>
          </div>

          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Per Page
            </label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setOffset(0);
              }}
              className="input-field w-full"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="text-dark-text-secondary">Loading books...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-200 font-semibold">Error loading books</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Books Table */}
      {!loading && !error && (
        <>
          <div className="table-container mb-6">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>ISBN</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-dark-text-secondary">
                      No books found
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.id}</td>
                      <td className="font-medium">{book.title}</td>
                      <td>{book.author?.name || 'Unknown'}</td>
                      <td>
                        <span className="bg-dark-bg-tertiary px-2 py-1 rounded text-xs">
                          {book.genre?.name || 'None'}
                        </span>
                      </td>
                      <td>{book.year || '-'}</td>
                      <td className="text-xs text-dark-text-secondary">{book.isbn || '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-dark-text-secondary">
              Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} books
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="px-4 py-2 text-dark-text">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={offset + limit >= totalCount}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Book Form Modal */}
      {showForm && (
        <BookForm
          book={editingBook}
          onClose={handleCloseForm}
          onSave={handleSaveBook}
        />
      )}
    </div>
  );
}

export default Books;
