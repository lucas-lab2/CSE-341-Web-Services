# Week 03 — Walk-through Video Script

**Video length target:** 5–8 minutes  
**Tools needed:** Screen recorder, browser open to `http://localhost:3001`

---

## Before you hit record

- [ ] `npm run swagger` in `week03/` — confirms swagger.json is up to date
- [ ] `npm run dev` in `week03/` — server is running on port 3001
- [ ] Browser tabs open: `http://localhost:3001/api-docs`, `http://localhost:3001/trains.html`, `http://localhost:3001/trips.html`
- [ ] VS Code open to `week03/` with the file explorer visible

---

## Part 1 — Project Introduction (~1 min)

**Say:**
> "Hi, I'm Lucas Miranda. This is my Week 03 walkthrough for CSE 341. This week's assignment is about adding Mongoose to the Kizuna Rail railway API and updating the front end to use client-side JavaScript to load data from the API instead of rendering everything on the server.
>
> I'm working alone, so I implemented all five feature sets: Trips, Schedules, Bookings, Ticket Classes, and Stations. The Trains feature was the instructor-provided example, and everything else follows the same pattern.
>
> Let me show the folder structure first."

**Do:** Click through the `week03/src/` folder in VS Code file explorer — show `models/schemas/`, `models/`, `controllers/`, `routes/`.

> "You can see the three-layer structure: schemas define the shape and validation rules, models wrap those in data-access functions, and controllers handle the HTTP request and response. All routes are wired up in a single `api-routes.js` file."

---

## Part 2 — Demonstrate the Feature Working Locally (~2 min)

**Say:**
> "Let me switch to the browser and open the Swagger docs."

**Do:** Open `http://localhost:3001/api-docs`.

> "Swagger shows all six resource groups: Trains, Trips, Schedules, Ticket Classes, Stations, and Bookings. Each endpoint has its request parameters and response shapes documented."

**Do:** Expand the **Trips** section → click `GET /api/trips` → click **Try it out** → **Execute**.

> "I get a 200 response — an empty array because my database isn't seeded yet, but the API is connected and responding correctly."

**Do:** Expand **Trips** again → `GET /api/trips/{id}` → Try it out → type `nonexistent` → Execute.

> "I get a 404 with the message 'Trip not found' — exactly what we'd expect."

**Do:** Expand **Schedules** → `GET /api/trips/{id}/schedules` → Try it out → fill `id` = `test`, `month` = `13` → Execute.

> "Month 13 doesn't exist, so the API returns a 400 with a clear validation message. The controller validates the month number before hitting the model."

**Do:** Open `http://localhost:3001/trains.html`.

> "This is the client-side hydration page for trains. The JavaScript uses fetch() to call the /api/trains endpoint. Since there's no data in the database yet, it shows the empty state — 'No trains found.' When the database is seeded, each train would appear as a card here without any page reload."

---

## Part 3 — Code Walk-through (~3 min)

### Schema

**Do:** Open `src/models/schemas/trips.js` in VS Code.

**Say:**
> "Here's the Trips Mongoose schema. I define each field with its type, whether it's required, and any constraints. For example, `durationMinutes` is a Number with `min: 1` — Mongoose will reject any document where this is zero or negative. The `stations` field is an array of strings for intermediate stops. The `{ timestamps: true }` option at the bottom tells Mongoose to automatically add `createdAt` and `updatedAt` fields."

### Model

**Do:** Open `src/models/trips.js`.

**Say:**
> "The model file is very simple — it imports the Mongoose model from the schema and exports two data-access functions. `getAllTrips` calls `Trip.find()` with `isActive: true` and sorts alphabetically. `getTripById` uses `findOne` on the string `id` field, not the MongoDB ObjectId. I call `.lean()` on all queries — that returns a plain JavaScript object instead of a Mongoose document, which is faster to serialize to JSON."

### Controller

**Do:** Open `src/controllers/trips.js`.

**Say:**
> "The controller handles the HTTP layer. It calls the model function, checks whether anything was returned, and sends the appropriate status code. If the model returns null, we send 404. If something unexpected throws, we catch it and send 500. The controller never talks to MongoDB directly — that separation keeps the code easy to test and maintain."

### Schedules model (special case)

**Do:** Open `src/models/schedules.js`.

**Say:**
> "The schedules model has an interesting step. Trips in the system use a string `id` field like 'fuji-express' for human readability, but Schedule documents store a reference to Trip as a MongoDB ObjectId. So `getSchedulesByTripId` first resolves the string id to the ObjectId using `Trip.findOne({ id })`, then uses that ObjectId to query schedules. If a `month` parameter is passed, it adds a `month` filter — I store the month number as a dedicated field on every schedule document specifically to make this query efficient."

---

## Part 4 — Key Technical Decision (~1 min)

**Do:** Open `src/models/schemas/bookings.js`.

**Say:**
> "The most important design decision I made this week is in the Bookings schema. Look at the `passenger` field — it stores passenger details as an **embedded sub-document** with `firstName`, `lastName`, `email`, and phone. I chose embedding over a reference to a separate Passengers collection for a specific reason: a booking is a historical record.
>
> Imagine the passenger changes their email address six months after they booked a ticket. If I had stored a reference, my booking record would suddenly show the updated email — which would be wrong for the historical receipt. By embedding a snapshot of the passenger data at the time of booking, the record is frozen and always accurate. This is the same pattern an e-commerce order uses to store a price snapshot — you don't want the order history to change if the product price changes later.
>
> This is the trade-off between embedding and referencing in MongoDB, and this was the right choice here."

---

## Closing (~15 sec)

**Say:**
> "That covers the Week 03 feature set — Mongoose schemas, model functions, MVC controllers, API routes with Swagger documentation, and client-side page hydration. Thanks for watching."

---

## After recording

1. Upload the video to YouTube or Google Drive (unlisted is fine).
2. Paste the link into `week03-reflection.md` (Question 2 — Video link).
3. Paste the link into `github-pr.md` (Walk-through Video section).
