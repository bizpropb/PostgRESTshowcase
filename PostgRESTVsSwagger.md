# PostgREST vs Manual Swagger API

**The Comparison:** PostgREST auto-generates OpenAPI/Swagger docs from your PostgreSQL schema vs manually writing/maintaining Swagger documentation for a traditional REST API.

---

## How PostgREST Works

- **Auto-Discovery**: Reads PostgreSQL schema at runtime via `information_schema` and `pg_catalog`
- **Zero Config**: Point it at a database and endpoints + OpenAPI docs appear instantly
- **Always In Sync**: Documentation regenerates on every request - impossible to drift from reality
- **Standards-Based**: Full OpenAPI/Swagger spec, works with all standard tooling

---

## PostgREST Advantages (vs Manual Swagger)

### Time & Maintenance
- ✅ **Zero documentation work** - No YAML to write, no annotations to maintain
- ✅ **Always accurate** - Docs reflect current schema, can't go stale
- ✅ **Instant updates** - Add a column? It's in the API docs immediately
- ✅ **No versioning headaches** - Schema changes = automatic doc updates

### Features Out-of-the-Box
- ✅ **Complete CRUD** - All HTTP methods generated automatically
- ✅ **Advanced querying** - Filtering (`?year=gte.2000`), sorting, pagination built-in
- ✅ **Relationships** - Embedding/joins via `?select=*,author:authors(*)`
- ✅ **Views & RPC** - Custom queries and functions exposed as endpoints
- ✅ **Type safety** - Schema enforces types, constraints documented automatically

### Schema Accuracy
- ✅ **Column types** - Exact PostgreSQL types in OpenAPI spec
- ✅ **Constraints** - NOT NULL, UNIQUE, defaults all documented
- ✅ **Foreign keys** - Relationships auto-detected and documented
- ✅ **Validation errors** - PostgreSQL constraint violations returned with error codes

### Security
- ✅ **Row-level security** - PostgreSQL RLS policies
- ✅ **Role-based access** - Database roles control permissions
- ✅ **JWT authentication** - Built-in
- ✅ **Column permissions** - GRANT statements control visibility

---

## Tradeoffs (What Manual Swagger/REST APIs Can Do That PostgREST Can't)

### Easy to fix / barely an issue

- ⚠️ **No custom descriptions in docs** → ✅ Add `COMMENT ON TABLE/COLUMN` statements
- ⚠️ **No request/response examples in Swagger spec** → ✅ Pair with external docs or Swagger Editor
- ⚠️ **Generic field names match database columns** → ✅ Use views to alias/reshape
- ⚠️ **Can't customize URL paths** (`/books` not `/api/v1/library/books`) → ✅ Use reverse proxy (Nginx) for rewrites
- ⚠️ **Returns raw database rows** → ✅ Use views or RPC functions to shape responses
- ⚠️ **All tables exposed by default** → ✅ Use separate schemas + roles to hide internal tables
- ⚠️ **PostgreSQL error messages too technical for end users** → ✅ Wrap with frontend/proxy to prettify

### Hard to fix / potential issue

- 🟠 **Complex data transformations before insert/update** - Manual APIs can transform in app code; PostgREST needs RPC functions
- 🟠 **Multi-step transactions with complex logic** - Manual APIs can orchestrate in app code; PostgREST needs RPC functions or triggers

### Unfixable Limitations / hard limits

- ❌ **Database-centric API design** - API structure must mirror database schema (can't decouple)
- ❌ **Business logic location** - Must live in database (triggers, constraints, RPC functions) vs application code
- ❌ **No file uploads** - Binary data not supported, needs separate service 

*Remmeber: PostgREST/Swagger is meant to be used in DEV only. Using it in prod opens an unwanted attack vector!*


## Comparison Table

| Feature | PostgREST | Manual REST + Swagger |
|---------|-----------|----------------------|
| **Setup Time** | Minutes | Days/Weeks |
| **Doc Maintenance** | Zero (auto-generated) | Ongoing manual updates |
| **Schema Accuracy** | Always 100% | Can drift from code |
| **CRUD Boilerplate** | None | Write every endpoint |
| **OpenAPI Spec** | Auto-generated, always current | Manual YAML or annotations |
| **Custom URL Paths** | Table names only (proxy workaround) | Full control |
| **Custom Response Shapes** | DB rows (views/RPC workaround) | Full control |
| **Business Logic Location** | Database (triggers, RPC) 🔴 | Application code |
| **Error Messages** | PostgreSQL (technical) | Custom (user-friendly) |
| **File Uploads** | Not supported 🔴 | Supported |
| **API Structure** | Mirrors database schema 🔴 | Completely flexible |
| **Data Transformation** | Limited (RPC functions) | Full app-layer control |

---

## When to Use PostgREST

### Great Choice ✅
- **Internal tools & dashboards** - Speed over polish
- **MVPs & prototypes** - Get API + docs in minutes
- **Database-centric apps** - Schema already designed well
- **PostgreSQL experts** - Leverage existing DB skills
- **Microservices** - Instant CRUD without boilerplate
- **Read-heavy apps** - Complex queries via views

### Poor Choice ❌
- **Highly customized APIs** - Need URL paths, response shapes that don't match DB
- **File upload services** - Binary data handling required
- **Complex app-layer business logic** - Multi-step workflows, external service orchestration
- **APIs decoupled from storage** - API design doesn't match database structure

---

## Conclusion

**PostgREST wins on speed and accuracy.** You get a fully-documented REST API in minutes with zero maintenance burden. The OpenAPI docs are always correct because they're generated from the source of truth: your database schema.

**Manual Swagger/REST wins on flexibility.** You control URL structure, response shapes, error messages, and business logic location. You can fully decouple API design from database design.

**The key tradeoff:** PostgREST requires your API structure to mirror your database schema. If that's acceptable, you eliminate massive amounts of boilerplate and documentation maintenance. If you need architectural decoupling, go manual.

**For this showcase**, PostgREST is perfect - it demonstrates how much power you get with **zero backend code** while maintaining type safety, auto-documentation, and database-enforced constraints.


---

# Fixes

## Improving Auto-Generated Docs

PostgREST's OpenAPI spec can be enhanced with PostgreSQL `COMMENT` statements:

```sql
COMMENT ON TABLE books IS 'Library catalog of fiction and non-fiction titles';
COMMENT ON COLUMN books.year IS 'Publication year (1800-2100)';
COMMENT ON COLUMN books.isbn IS 'ISBN-13 identifier (must be unique)';
```

These appear in the OpenAPI schema descriptions - nearly as good as hand-written docs!

---

## Error Handling

PostgREST passes PostgreSQL errors directly with standard error codes:

**UNIQUE violation:**
```json
{
  "code": "23505",
  "details": "Key (isbn)=(978-0-7475-3269-9) already exists.",
  "message": "duplicate key value violates unique constraint \"books_isbn_key\""
}
```

**NOT NULL violation:**
```json
{
  "code": "23502",
  "message": "null value in column \"title\" violates not-null constraint"
}
```

**Foreign key violation:**
```json
{
  "code": "23503",
  "message": "insert or update on table \"books\" violates foreign key constraint"
}
```

These are **developer-friendly** (precise error codes). For end-user apps, wrap with prettier messages in your frontend.

---

## Best Practices

1. **Use schemas** - Separate `api` schema from `internal` tables to control what's exposed
2. **Add COMMENT statements** - Document tables/columns for human-friendly OpenAPI docs
3. **Use views liberally** - Pre-join data, reshape responses, alias columns, hide complexity
4. **Write RPC functions** - Handle complex operations (search, analytics, multi-step logic)
5. **Enable RLS** - Row-Level Security for fine-grained access control
6. **Front with a reverse proxy** - Add URL rewrites, SSL termination (Nginx/Traefik)
7. **Version your schema** - Use migration tools (Flyway, Liquibase, sqitch)
8. **Monitor PostgreSQL** - PostgREST performance = database performance

---