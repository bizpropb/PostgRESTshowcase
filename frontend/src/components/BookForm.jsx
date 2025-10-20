import { useState, useEffect } from 'react';
import api from '../services/api';

function BookForm({ book, onClose, onSave }) {
  const isEditing = !!book;

  const [formData, setFormData] = useState({
    title: '',
    year: '',
    author_id: '',
    genre_id: '',
    description: '',
    isbn: '',
  });

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load authors and genres on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [authorsRes, genresRes] = await Promise.all([
          api.getAuthors({ order: 'name.asc' }),
          api.getGenres({ order: 'name.asc' }),
        ]);
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        setError('Failed to load authors/genres');
      }
    };

    fetchDropdownData();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        year: book.year || '',
        author_id: book.author_id || '',
        genre_id: book.genre_id || '',
        description: book.description || '',
        isbn: book.isbn || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert empty strings to null for optional fields
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year, 10) : null,
        author_id: formData.author_id ? parseInt(formData.author_id, 10) : null,
        genre_id: formData.genre_id ? parseInt(formData.genre_id, 10) : null,
        description: formData.description || null,
        isbn: formData.isbn || null,
      };

      if (isEditing) {
        await api.updateBook(book.id, payload);
      } else {
        await api.createBook(payload);
      }

      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-bg-secondary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-dark-bg-secondary z-10">
          <h2 className="text-2xl font-bold text-dark-text">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="text-dark-text-secondary hover:text-dark-text text-2xl"
          >
            ×
          </button>
        </div>

        {/* PostgREST Feature Badge */}
        <div className="mx-6 mt-4 bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
          <p className="text-sm text-green-200">
            <span className="font-semibold">PostgREST Feature:</span> {isEditing ? 'PATCH (Update)' : 'POST (Create)'}
          </p>
          <p className="text-xs text-green-300 mt-1 font-mono">
            {isEditing
              ? `PATCH /books?id=eq.${book.id}`
              : 'POST /books'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
              <p className="text-red-200 font-semibold">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Title (Required) */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field w-full"
                placeholder="e.g., The Great Gatsby"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g., 2024"
                min="1000"
                max="2100"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Author
              </label>
              <select
                name="author_id"
                value={formData.author_id}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">-- Select Author --</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Genre
              </label>
              <select
                name="genre_id"
                value={formData.genre_id}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="">-- Select Genre --</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g., 978-0-123456-78-9"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-field w-full"
                placeholder="Brief description of the book..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Book' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;
