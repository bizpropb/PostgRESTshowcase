import { useState, useEffect } from 'react';
import api from '../services/api';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Search
  const [searchName, setSearchName] = useState('');

  // Fetch authors
  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        order: 'name.asc',
      };

      if (searchName) {
        params.name = searchName;
      }

      const response = await api.getAuthors(params);
      setAuthors(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [searchName]);

  const handleAddAuthor = () => {
    setEditingAuthor(null);
    setFormData({ name: '', bio: '' });
    setFormError(null);
    setShowForm(true);
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setFormData({ name: author.name, bio: author.bio || '' });
    setFormError(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAuthor(null);
    setFormData({ name: '', bio: '' });
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const payload = {
        name: formData.name,
        bio: formData.bio || null,
      };

      if (editingAuthor) {
        await api.updateAuthor(editingAuthor.id, payload);
      } else {
        await api.createAuthor(payload);
      }

      handleCloseForm();
      fetchAuthors();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAuthor = async (author) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${author.name}"?\n\nThis will also delete all books by this author!`
    );

    if (!confirmed) return;

    try {
      await api.deleteAuthor(author.id);
      fetchAuthors();
    } catch (err) {
      alert(`Failed to delete author: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-dark-text">Authors</h1>
        <button className="btn-primary" onClick={handleAddAuthor}>
          + Add Author
        </button>
      </div>

      {/* PostgREST Feature Badge */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-blue-200">
          <span className="font-semibold">PostgREST Features:</span> CRUD Operations, Filtering, Cascade Delete
        </p>
        <p className="text-xs text-blue-300 mt-1 font-mono">
          GET /authors?order=name.asc
        </p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">
          Search by Name
        </label>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="e.g., Rowling"
          className="input-field w-full max-w-md"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="text-dark-text-secondary">Loading authors...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-200 font-semibold">Error loading authors</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Authors Table */}
      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-dark-text-secondary">
                    No authors found
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author.id}>
                    <td>{author.id}</td>
                    <td className="font-medium">{author.name}</td>
                    <td className="text-sm text-dark-text-secondary max-w-md">
                      {author.bio || '-'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAuthor(author)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAuthor(author)}
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

      {/* Author Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-bg-secondary rounded-lg shadow-xl max-w-2xl w-full">
            {/* Header */}
            <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-text">
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
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
                <span className="font-semibold">PostgREST Feature:</span> {editingAuthor ? 'PATCH (Update)' : 'POST (Create)'}
              </p>
              <p className="text-xs text-green-300 mt-1 font-mono">
                {editingAuthor
                  ? `PATCH /authors?id=eq.${editingAuthor.id}`
                  : 'POST /authors'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Error Display */}
              {formError && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 mb-6">
                  <p className="text-red-200 font-semibold">Error</p>
                  <p className="text-red-300 text-sm">{formError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Name (Required) */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="input-field w-full"
                    placeholder="e.g., J.K. Rowling"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    rows="4"
                    className="input-field w-full"
                    placeholder="Brief biography of the author..."
                  />
                </div>
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
                  {formLoading ? 'Saving...' : editingAuthor ? 'Update Author' : 'Create Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Authors;
