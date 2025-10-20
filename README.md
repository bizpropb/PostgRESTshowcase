# PostgREST Showcase - Book Haven

A demonstration application showcasing **PostgREST's** capabilities through a simple library management system.

## What is PostgREST?

[PostgREST](https://postgrest.org) is a standalone web server that turns your PostgreSQL database directly into a RESTful API. This project demonstrates its key features in action.

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Ports 3000, 5173, and 5432 available

### Start the Application

```bash
docker-compose up
```

That's it! The application will:
1. Start PostgreSQL with schema and seed data
2. Start PostgREST API server
3. Start React frontend with hot reload

### Access

- **Frontend**: http://localhost:5173
- **PostgREST API**: http://localhost:3000 (copy/paste the json into https://editor.swagger.io for interactive UI)
- **Database**: localhost:5432

---

## Architecture

```
┌─────────────────┐
│   React Frontend│  (Port 5173)
│   (Dark Mode)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   PostgREST API │  (Port 3000)
│                 │  Auto-generates OpenAPI docs
└────────┬────────┘
         │ PostgreSQL Protocol
         ▼
┌─────────────────┐
│   PostgreSQL 16 │  (Port 5432)
│   Database      │  Schema + Seed Data
└─────────────────┘
```

**Tech Stack:**
- PostgreSQL 16 (Database)
- PostgREST 12 (API Server)
- React 18 + Vite (Frontend)
- Tailwind CSS (Dark Mode Styling)
- Docker Compose (Orchestration)

---

## PostgREST Features Demonstrated

This showcase exercises most of PostgREST's core capabilities:

| Feature | Where to See It | Example Endpoint |
|---------|----------------|------------------|
| **CRUD Operations** | Books/Authors/Genres pages | `GET /books`, `POST /books`, `PATCH /books?id=eq.1`, `DELETE /books?id=eq.1` |
| **Filtering** | Books page - search by title | `GET /books?title=ilike.*harry*` |
| **Sorting** | Books page - sort dropdown | `GET /books?order=year.desc,title.asc` |
| **Pagination** | Books page - next/prev buttons | `GET /books?limit=10&offset=20` |
| **Embedding (Joins)** | Books page - shows author & genre | `GET /books?select=*,author:authors(*),genre:genres(*)` |
| **Views** | Advanced page - View Query demo | `GET /book_details` |
| **RPC Functions** | Dashboard + Advanced page | `POST /rpc/get_top_genres`, `POST /rpc/search_books` |
| **Bulk Operations** | Advanced page - Bulk Insert demo | `POST /books` with array body |
| **Aggregates** | Advanced page - Aggregates demo | `GET /books?select=genre_id,count&group_by=genre_id` |
| **Constraints** | All CRUD pages - try duplicate ISBN | UNIQUE, CASCADE, SET NULL enforced by PostgreSQL |
| **OpenAPI Docs** | API Docs page | `GET /` (auto-generated Swagger spec) |
| **Custom Headers** | Books page - total count | `Prefer: count=exact` returns `Content-Range` |
| **CORS** | All frontend requests | Configured for browser access |

---

## Pages & Features

### 📊 Dashboard (`/`)
- Quick stats (total books, authors, genres)
- Top genres chart (powered by RPC function)
- Quick navigation links

### 📚 Books (`/books`)
- Full CRUD operations
- Search by title
- Sort by title, year, ID
- Pagination (configurable per page)
- Embedded author & genre data (joins)
- Demonstrates: filtering, sorting, pagination, embedding

### ✍️ Authors (`/authors`)
- Full CRUD operations
- Search by name
- Cascade delete (deletes author's books)
- Demonstrates: basic CRUD, CASCADE constraint

### 🏷️ Genres (`/genres`)
- Full CRUD operations
- UNIQUE constraint on name
- SET NULL on delete (books keep existing, genre becomes NULL)
- Demonstrates: UNIQUE constraint, SET NULL constraint

### ⚡ Advanced Features (`/advanced`)
- **Bulk Insert**: Insert 3 books at once
- **View Query**: Query pre-joined `book_details` view
- **RPC Search**: Call custom `search_books()` function
- **Aggregates**: Count books grouped by genre

### 📖 API Documentation (`/api-docs`)
- Links to PostgREST's auto-generated OpenAPI documentation
- Instructions for importing into Swagger Editor

---

## Database Schema

### Tables
- **authors** (id, name, bio, created_at)
- **genres** (id, name UNIQUE, created_at)
- **books** (id, title, year, author_id FK, genre_id FK, description, isbn UNIQUE, created_at)

### Relationships
- `books.author_id` → `authors.id` (ON DELETE CASCADE)
- `books.genre_id` → `genres.id` (ON DELETE SET NULL)

### Views
- **book_details**: Pre-joined books with author and genre data

### RPC Functions
- **get_top_genres(limit_count)**: Returns genres sorted by book count
- **search_books(search_term)**: Full-text search across title and description

### Seed Data
- 8 authors
- 5 genres
- 20 books (Harry Potter, Foundation, Murder on the Orient Express, etc.)

---

## Development

### Hot Reload
The frontend is bind-mounted, so changes to React code automatically reload in the browser.

### Database Changes
Modify `database/init.sql` and restart the postgres container:
```bash
docker-compose restart postgres
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

---

## API Examples

### Basic CRUD
```bash
# Get all books
curl http://localhost:3000/books

# Get books with authors and genres embedded
curl "http://localhost:3000/books?select=*,author:authors(name),genre:genres(name)"

# Create a book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"New Book","author_id":1,"genre_id":2,"year":2024}'

# Update a book
curl -X PATCH "http://localhost:3000/books?id=eq.1" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete a book
curl -X DELETE "http://localhost:3000/books?id=eq.1"
```

### Advanced Features
```bash
# Filter and sort
curl "http://localhost:3000/books?title=ilike.*harry*&year=gte.2000&order=year.desc"

# Pagination with total count
curl "http://localhost:3000/books?limit=10&offset=0" \
  -H "Prefer: count=exact"

# Query a view
curl http://localhost:3000/book_details

# Call RPC function
curl -X POST http://localhost:3000/rpc/get_top_genres \
  -H "Content-Type: application/json" \
  -d '{"limit_count":3}'

# Bulk insert
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '[{"title":"Book 1","author_id":1},{"title":"Book 2","author_id":2}]'
```

---

## Learn More

- **PostgREST Docs**: https://postgrest.org/en/stable/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **React Docs**: https://react.dev/