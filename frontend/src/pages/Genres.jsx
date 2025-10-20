import { useState, useEffect } from 'react';
import api from '../services/api';

function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch genres
  const fetchGenres = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getGenres({ order: 'name.asc' });
      setGenres(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddGenre = () => {
    setEditingGenre(null);
    setFormData({ name: '' });
    setFormError(null);
    setShowForm(true);
  };

  const handleEditGenre = (genre) => {
    setEditingGenre(genre);
    setFormData({ name: genre.name });
    setFormError(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGenre(null);
    setFormData({ name: '' });
    setFormError(null);
  };

  const handleFormChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const payload = { name: formData.name };

      if (editingGenre) {
        await api.updateGenre(editingGenre.id, payload);
      } else {
        await api.createGenre(payload);
      }

      handleCloseForm();
      fetchGenres();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGenre = async (genre) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${genre.name}"?\n\nBooks in this genre will have their genre set to NULL.`
    );

    if (!confirmed) return;

    try {
      await api.deleteGenre(genre.id);
      fetchGenres();
    } catch (err) {
      alert(`Failed to delete genre: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-dark-text">Genres</h1>
        <button className="btn-primary" onClick={handleAddGenre}>
          + Add Genre
        </button>
      </div>

      {/* PostgREST Feature Badge */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-blue-200">
          <span className="font-semibold">PostgREST Features:</span> CRUD Operations, UNIQUE Constraint, SET NULL on Delete
        </p>
        <p className="text-xs text-blue-300 mt-1 font-mono">
          GET /genres?order=name.asc
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="text-dark-text-secondary">Loading genres...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-200 font-semibold">Error loading genres</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Genres Table */}
      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-dark-text-secondary">
                    No genres found
                  </td>
                </tr>
              ) : (
                genres.map((genre) => (
                  <tr key={genre.id}>
                    <td>{genre.id}</td>
                    <td className="font-medium">{genre.name}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditGenre(genre)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGenre(genre)}
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
      )}

      {/* Genre Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-bg-secondary rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-text">
                {editingGenre ? 'Edit Genre' : 'Add New Genre'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-dark-text-secondary hover:text-dark-text text-2xl"
              >
                ×
              </button>
            </div>

            {/* PostgREST Feature Badge */}
            <div className="mx-6 mt-4 bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
              <p className="text-sm text-green-200">
                <span className="font-semibold">PostgREST Feature:</span> {editingGenre ? 'PATCH (Update)' : 'POST (Create)'}
              </p>
              <p className="text-xs text-green-300 mt-1 font-mono">
                {editingGenre
                  ? `PATCH /genres?id=eq.${editingGenre.id}`
                  : 'POST /genres'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Error Display */}
              {formError && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
                  <p className="text-red-200 font-semibold">Error</p>
                  <p className="text-red-300 text-sm">{formError}</p>
                  {formError.includes('duplicate') && (
                    <p className="text-red-300 text-xs mt-2">
                      This genre name already exists. Genre names must be unique.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Genre Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., Science Fiction"
                />
                <p className="text-xs text-dark-text-secondary mt-2">
                  Note: Genre names must be unique
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn-secondary flex-1"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : editingGenre ? 'Update Genre' : 'Create Genre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Genres;
