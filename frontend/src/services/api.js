const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * PostgREST API Service
 * Wrapper for all API calls to the PostgREST backend
 */

class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Set up headers
    const headers = {
      'Accept': 'application/json',
      ...options.headers,
    };

    // Convert body to Blob to avoid charset being appended to Content-Type
    if (options.body) {
      headers['Content-Type'] = 'application/json';
      options.body = new Blob([options.body], { type: 'application/json' });
    }

    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Get total count from Content-Range header if available
      const contentRange = response.headers.get('Content-Range');
      let totalCount = null;
      if (contentRange) {
        const match = contentRange.match(/\/(\d+)$/);
        totalCount = match ? parseInt(match[1], 10) : null;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // DELETE returns 204 No Content (empty body), don't try to parse JSON
      if (response.status === 204) {
        return { data: null, totalCount };
      }

      const data = await response.json();
      return { data, totalCount };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ============================================
  // Books
  // ============================================

  async getBooks(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.order) queryParams.append('order', params.order);
    if (params.select) queryParams.append('select', params.select);
    if (params.title) queryParams.append('title', `ilike.*${params.title}*`);
    if (params.year) queryParams.append('year', `eq.${params.year}`);
    if (params.yearGte) queryParams.append('year', `gte.${params.yearGte}`);
    if (params.yearLte) queryParams.append('year', `lte.${params.yearLte}`);

    const headers = {};
    if (params.count) {
      headers['Prefer'] = 'count=exact';
    }

    const endpoint = `/books${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint, { headers });
  }

  async getBook(id) {
    return this.request(`/books?id=eq.${id}`);
  }

  async createBook(book) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(book),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async updateBook(id, updates) {
    return this.request(`/books?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async deleteBook(id) {
    return this.request(`/books?id=eq.${id}`, {
      method: 'DELETE'
    });
  }

  async bulkCreateBooks(books) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(books),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  // ============================================
  // Authors
  // ============================================

  async getAuthors(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.order) queryParams.append('order', params.order);
    if (params.select) queryParams.append('select', params.select);
    if (params.name) queryParams.append('name', `ilike.*${params.name}*`);

    const endpoint = `/authors${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  async getAuthor(id) {
    return this.request(`/authors?id=eq.${id}`);
  }

  async createAuthor(author) {
    return this.request('/authors', {
      method: 'POST',
      body: JSON.stringify(author),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async updateAuthor(id, updates) {
    return this.request(`/authors?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async deleteAuthor(id) {
    return this.request(`/authors?id=eq.${id}`, {
      method: 'DELETE'
    });
  }

  // ============================================
  // Genres
  // ============================================

  async getGenres(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.order) queryParams.append('order', params.order);
    if (params.select) queryParams.append('select', params.select);

    const endpoint = `/genres${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  async getGenre(id) {
    return this.request(`/genres?id=eq.${id}`);
  }

  async createGenre(genre) {
    return this.request('/genres', {
      method: 'POST',
      body: JSON.stringify(genre),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async updateGenre(id, updates) {
    return this.request(`/genres?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async deleteGenre(id) {
    return this.request(`/genres?id=eq.${id}`, {
      method: 'DELETE'
    });
  }

  // ============================================
  // Views
  // ============================================

  async getBookDetails(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.order) queryParams.append('order', params.order);

    const endpoint = `/book_details${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // ============================================
  // RPC Functions
  // ============================================

  async getTopGenres(limitCount = 5) {
    return this.request('/rpc/get_top_genres', {
      method: 'POST',
      body: JSON.stringify({ limit_count: limitCount })
    });
  }

  async searchBooks(searchTerm) {
    return this.request('/rpc/search_books', {
      method: 'POST',
      body: JSON.stringify({ search_term: searchTerm })
    });
  }

  // ============================================
  // Aggregates
  // ============================================

  async getBookCountByGenre() {
    return this.request('/books?select=genre_id,count&group_by=genre_id');
  }
}

export default new ApiService(API_URL);
