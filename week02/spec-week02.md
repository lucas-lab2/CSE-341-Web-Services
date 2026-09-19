# Books API Week 02 Spec - Version 2

---

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and
the API supports all CRUD operations for books. Every book route must be documented and
testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required (ISO 8601 format, e.g. `2021-08-17`)

Books use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book identifies its author with an `authorId` field. The value of `authorId` must match
the custom `id` of an existing author document. Create and update requests are rejected with
`400` if the `authorId` does not match an existing author.

### Routes

#### GET /books
- Success: `200` — array of book objects
- Error: `500` — unexpected server/database error

#### GET /books/:id
- Success: `200` — matching book object
- `404` — no book with that id
- `500` — unexpected server/database error

#### POST /books
Request body: `{ "id": "b4", "authorId": "a1", "title": "...", "publicationDate": "2026-01-15" }`
- Success: `201` — newly created book object
- `400` — missing required field, id already exists, or authorId not found
- `500` — unexpected server/database error

#### PUT /books/:id
Request body: `{ "authorId": "a2", "title": "...", "publicationDate": "2026-02-20" }`
- Success: `200` — updated book object
- `400` — missing required field or authorId not found
- `404` — book not found
- `500` — unexpected server/database error

#### DELETE /books/:id
- Success: `204` — no response body
- `404` — book not found
- `500` — unexpected server/database error

### Version 2 Notes
- Validate all required fields before calling MongoDB
- Do not expose raw MongoDB errors to the client
- `authorId` stores a reference id, not the full author document

---

## Feature 2: Author CRUD Operations

### Goal

Create a new `authors` collection and implement full CRUD for authors. Every author route must
be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors use custom string ids instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /authors
- Success: `200` — array of author objects
- `500` — unexpected server/database error

#### GET /authors/:id
- Success: `200` — matching author object
- `404` — no author with that id
- `500` — unexpected server/database error

#### POST /authors
Request body: `{ "id": "a4", "name": "Example Author", "birthYear": 1980 }`
- Success: `201` — newly created author object
- `400` — missing required field or id already exists
- `500` — unexpected server/database error

#### PUT /authors/:id
Request body: `{ "name": "Updated Author Name", "birthYear": 1981 }`
- Success: `200` — updated author object
- `400` — missing required field
- `404` — author not found
- `500` — unexpected server/database error

#### DELETE /authors/:id
- Success: `204` — no response body
- `404` — author not found
- `409` — author still has books referencing them (cannot delete)
- `500` — unexpected server/database error

### Version 2 Notes
- Validate all required fields before calling MongoDB
- Do not expose raw MongoDB errors to the client
- Before deleting an author, check `books` collection for documents with matching `authorId`
- Return `409 Conflict` if books still reference the author
