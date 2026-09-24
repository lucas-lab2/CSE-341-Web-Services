# Pull Request: Week 03 — Mongoose Schemas, MVC API, and Frontend Hydration

**Branch:** `week03/mongoose-api` → `main`  
**Closes:** #7 (Implement Mongoose Schemas, MVC Controllers, and API Routes — Feature Sets 1–5)

---

## Summary of Changes

This PR implements the complete Week 03 feature set for the Kizuna Rail API, migrating from the raw MongoDB driver to **Mongoose**, introducing proper schema validation, and adding client-side page hydration via `fetch()`.

### Files Added/Changed

**Infrastructure**
- `package.json` — added `mongoose` dependency
- `server.js` — updated to use Mongoose `connectToDb()`
- `app.js` — mounts API router, Swagger UI, and static file server
- `swagger.js` — generates OpenAPI 3.0 spec from JSDoc
- `src/db/connect.js` — Mongoose connection (replaces raw MongoClient)

**Schemas** (`src/models/schemas/`)
- `trains.js` — instructor-provided example (path corrected)
- `trips.js` — Trip schema with origin/destination, duration, stations array
- `schedules.js` — Schedule schema with `month` field for fast filtering
- `ticket-classes.js` — TicketClass with `availableDays` array
- `stations.js` — Station with lat/long and amenities
- `bookings.js` — Booking with embedded Passenger snapshot; collection explicitly `bookings`

**Models** (`src/models/`)
- `trains.js` — `getAllTrains`, `getTrainById`
- `trips.js` — `getAllTrips`, `getTripById`
- `schedules.js` — `getSchedulesByTripId(tripId, month?)`
- `ticket-classes.js` — `getAllTicketClasses`, `getTicketClassesForDay`
- `stations.js` — `getAllStations`, `getStationById`
- `bookings.js` — `createBooking`, `getAllBookings`, `getBookingById` (with `populate()`)

**Controllers** (`src/controllers/`)
- `trains.js` — instructor-provided (path corrected)
- `trips.js`, `schedules.js`, `ticket-classes.js`, `stations.js`, `bookings.js`

**Routes**
- `src/routes/api-routes.js` — 13 endpoints across 6 resource groups, all documented with OpenAPI 3.0 JSDoc

**Frontend**
- `public/trains.html` — fetches `/api/trains`, hydrates with `<template>` clones
- `public/trips.html` — fetches `/api/trips`, same hydration pattern

---

## Testing Steps Completed

1. ✅ `npm install` — installed successfully, no dependency conflicts
2. ✅ `npm run swagger` — `swagger.json` generated with all 13 routes
3. ✅ `npm run dev` — server starts, connects to MongoDB Atlas, listens on port 3001
4. ✅ `GET /api/trains` → 200 (empty array — DB not seeded yet, correct behaviour)
5. ✅ `GET /api/trips` → 200 (empty array)
6. ✅ `GET /api/trips/nonexistent` → 404 `{ "error": "Trip not found" }`
7. ✅ `GET /api/trips/test/schedules?month=13` → 400 `{ "error": "month must be a number between 1 and 12" }`
8. ✅ `GET /api/ticket-classes?day=7` → 400 `{ "error": "day must be a number between 0 (Sunday) and 6 (Saturday)" }`
9. ✅ `POST /api/bookings` with empty body → 400 with descriptive field list
10. ✅ `http://localhost:3001/api-docs` → Swagger UI renders with all 6 tag groups
11. ✅ `http://localhost:3001/trains.html` → page loads, shows "No trains found" (empty DB)
12. ✅ `http://localhost:3001/trips.html` → same

---

## Walk-through Video

🎥 [Watch the Week 03 demo video](https://youtu.be/faFL1D475vM)

> The video demonstrates:
> 1. The complete API working locally via Swagger UI
> 2. A walk-through of the key functions (schema, model, controller pattern)
> 3. The major architectural decision explained: **embedding the Passenger sub-document inside Booking** rather than referencing a separate Passengers collection

---

## Key Technical Decision Highlighted

**Embedded vs. referenced Passenger data in Bookings**

The Booking schema stores a full snapshot of the passenger details (name, email, phone) as an embedded sub-document rather than creating a separate `Passengers` collection and storing a reference. This is the correct approach because:
- A booking is a historical record — if the passenger's email changes later, the booking receipt must still show what was correct at the time of purchase.
- The passenger data only makes sense inside the booking; there is no use case for listing all passengers independently.
- Using an embedded document avoids an extra `populate()` call and keeps the booking record self-contained.

This pattern mirrors how e-commerce orders embed a price snapshot rather than referencing the live product price.
