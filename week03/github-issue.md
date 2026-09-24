# GitHub Issue: Implement Mongoose Schemas, MVC Controllers, and API Routes (Feature Sets 1–5)

**Repository:** lucas-lab2/CSE-341-Web-Services  
**Label:** `feature`, `week03`  
**Assignee:** Lucas Miranda  
**Branch:** `week03/mongoose-api`

---

## Overview

This issue covers all five Week 03 feature sets for the Kizuna Rail application. Working alone, I am implementing the full Mongoose-backed API layer and client-side hydration pages as a single cohesive unit.

**Feature sets included:**
- Feature Set 1: Trips
- Feature Set 2: Schedules
- Feature Set 3: Bookings
- Feature Set 4: Ticket Classes (optional, 4-member team — included for completeness)
- Feature Set 5: Stations (optional, 5-member team — included for completeness)

The instructor-provided Trains example files are incorporated as the canonical pattern everything else follows.

---

## Background

The existing Kizuna Rail codebase used a raw MongoDB driver and a flat data model. This issue migrates data access to **Mongoose**, introduces proper schema validation, and exposes all resources as **JSON API endpoints**. Two frontend pages (`trains.html` and `trips.html`) are updated/created to demonstrate client-side page hydration using `fetch()` and the HTML `<template>` element instead of server-rendered EJS loops.

The key design decision: **a single issue for all five feature sets** was chosen because, as a solo developer, all the files share the same architectural pattern, same dependency chain (Mongoose schemas must exist before models, models before controllers, controllers before routes), and the same pull request. Splitting into five issues for one developer would create artificial dependencies and unnecessary branch management overhead.

---

## Data Model

### Train
| Field | Type | Required | Notes |
|---|---|---|---|
| id | String | ✅ | Unique string identifier |
| name | String | ✅ | |
| operator | String | ✅ | |
| type | String | ✅ | e.g. High-speed, Regional |
| maxSpeedKmh | Number | ✅ | min: 0 |
| capacity | Number | ✅ | min: 0 |
| powerSource | String | ✅ | |
| bestFor | String | ❌ | |
| description | String | ❌ | |
| imageUrl | String | ❌ | |
| imageAlt | String | ❌ | |

### Trip
| Field | Type | Required | Notes |
|---|---|---|---|
| id | String | ✅ | Unique string identifier |
| name | String | ✅ | |
| slug | String | ✅ | Unique, URL-safe |
| origin | String | ✅ | |
| destination | String | ✅ | |
| durationMinutes | Number | ✅ | min: 1 |
| distanceKm | Number | ❌ | |
| stations | [String] | ❌ | Intermediate stop names |
| trainId | ObjectId | ❌ | Ref to Train |
| isActive | Boolean | ❌ | default: true |

### Schedule
| Field | Type | Required | Notes |
|---|---|---|---|
| tripId | ObjectId | ✅ | Ref to Trip |
| departureTime | String | ✅ | "HH:MM" |
| arrivalTime | String | ✅ | "HH:MM" |
| date | String | ✅ | "YYYY-MM-DD" |
| month | Number | ✅ | 1–12 (indexed for filtering) |
| year | Number | ✅ | |
| availableSeats | Number | ✅ | min: 0 |
| status | String | ❌ | enum: scheduled/cancelled/completed |

### TicketClass
| Field | Type | Required | Notes |
|---|---|---|---|
| id | String | ✅ | |
| name | String | ✅ | |
| code | String | ✅ | Unique |
| priceMultiplier | Number | ✅ | min: 1 |
| availableDays | [Number] | ❌ | 0=Sun…6=Sat |
| amenities | [String] | ❌ | |
| isActive | Boolean | ❌ | default: true |

### Station
| Field | Type | Required | Notes |
|---|---|---|---|
| id | String | ✅ | |
| name | String | ✅ | |
| nameRomaji | String | ❌ | |
| prefecture | String | ❌ | |
| latitude | Number | ❌ | |
| longitude | Number | ❌ | |
| amenities | [String] | ❌ | |

### Booking
| Field | Type | Required | Notes |
|---|---|---|---|
| tripId | ObjectId | ✅ | Ref to Trip |
| scheduleId | ObjectId | ✅ | Ref to Schedule |
| ticketClassId | ObjectId | ✅ | Ref to TicketClass |
| passenger | EmbeddedDoc | ✅ | firstName, lastName, email, phone? |
| numberOfSeats | Number | ✅ | min: 1 |
| totalPrice | Number | ✅ | min: 0 |
| confirmationCode | String | ✅ | Auto-generated 8-char unique code |
| status | String | ❌ | enum: confirmed/cancelled/pending |

> **Note:** The bookings collection is explicitly named `bookings` via `{ collection: 'bookings' }` to replace the legacy `confirmations` collection name.

---

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| GET | `/api/trains` | All trains | 200, 500 |
| GET | `/api/trains/:id` | One train by id | 200, 404, 500 |
| GET | `/api/trips` | All active trips | 200, 500 |
| GET | `/api/trips/:id` | One trip by id | 200, 404, 500 |
| GET | `/api/trips/:id/schedules` | All schedules for a trip | 200, 404, 500 |
| GET | `/api/trips/:id/schedules?month=N` | Schedules filtered by month | 200, 400, 404, 500 |
| GET | `/api/ticket-classes` | All ticket classes | 200, 500 |
| GET | `/api/ticket-classes?day=N` | Classes for a day of week | 200, 400, 500 |
| GET | `/api/stations` | All stations | 200, 500 |
| GET | `/api/stations/:id` | One station by id | 200, 404, 500 |
| GET | `/api/bookings` | All bookings (populated) | 200, 500 |
| POST | `/api/bookings` | Create a booking | 201, 400, 404, 500 |
| GET | `/api/bookings/:id` | One booking by MongoDB _id | 200, 400, 404, 500 |

---

## Test Plan

1. **Server starts:** Run `npm run dev` — server connects to MongoDB and listens on port 3001 without errors.
2. **Swagger UI loads:** Open `http://localhost:3001/api-docs` — all route groups appear.
3. **GET /api/trains:** Returns `200` with an array (empty if DB is empty, otherwise train objects).
4. **GET /api/trips:** Returns `200` with an array of active trips.
5. **GET /api/trips/missing-id:** Returns `404` with `{ error: "Trip not found" }`.
6. **GET /api/trips/:id/schedules?month=13:** Returns `400` with validation error message.
7. **GET /api/ticket-classes?day=7:** Returns `400` with validation error message.
8. **POST /api/bookings** with missing fields: Returns `400` with descriptive error.
9. **Frontend:** Open `http://localhost:3001/trains.html` — page shows loading state then hydrates (empty state if DB empty).
10. **Frontend:** Open `http://localhost:3001/trips.html` — same pattern.

---

## Acceptance Criteria

- [ ] All six schema files created in `src/models/schemas/`
- [ ] All six model files created in `src/models/`
- [ ] All six controller files created in `src/controllers/`
- [ ] `src/routes/api-routes.js` routes all endpoints with Swagger JSDoc
- [ ] `public/trains.html` and `public/trips.html` use fetch + template hydration
- [ ] Server starts and connects to MongoDB without errors
- [ ] Swagger UI renders all endpoints
- [ ] All test plan steps verified
