// src/routes/api-routes.js
import { Router } from 'express';
import { getAllTrains, getTrainById } from '../controllers/trains.js';
import { getAllTrips, getTripById } from '../controllers/trips.js';
import { getSchedulesForTripAndMonth } from '../controllers/schedules.js';
import { getAllTicketClasses, getTicketClassesForDay } from '../controllers/ticket-classes.js';
import { getAllStations, getStationById } from '../controllers/stations.js';
import { getAllBookings, getBookingById, createBooking } from '../controllers/bookings.js';

const router = Router();

// ─────────────────────────────────────────────
// TRAINS
// ─────────────────────────────────────────────

/**
 * @openapi
 * /api/trains:
 *   get:
 *     tags:
 *       - Trains
 *     summary: Get all trains
 *     description: Returns a list of all trains in the Kizuna Rail fleet.
 *     responses:
 *       200:
 *         description: A JSON array of train objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Train'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/trains', getAllTrains);

/**
 * @openapi
 * /api/trains/{id}:
 *   get:
 *     tags:
 *       - Trains
 *     summary: Get a train by ID
 *     description: Returns a single train matching the provided string id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The train's string identifier (e.g. "shinkansen-n700")
 *     responses:
 *       200:
 *         description: The matching train object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Train'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/trains/:id', getTrainById);

// ─────────────────────────────────────────────
// TRIPS
// ─────────────────────────────────────────────

/**
 * @openapi
 * /api/trips:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Get all trips
 *     description: Returns all active scenic railway trips sorted by name.
 *     responses:
 *       200:
 *         description: A JSON array of trip objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/trips', getAllTrips);

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Get a trip by ID
 *     description: Returns a single trip matching the provided string id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip's string identifier (e.g. "fuji-express")
 *     responses:
 *       200:
 *         description: The matching trip object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/trips/:id', getTripById);

// ─────────────────────────────────────────────
// SCHEDULES (nested under trips)
// ─────────────────────────────────────────────

/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Get schedules for a trip
 *     description: >
 *       Returns all schedules for the specified trip.
 *       Optionally filter by month using the `month` query parameter.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip's string identifier
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter schedules to a specific month (1 = January … 12 = December)
 *     responses:
 *       200:
 *         description: A JSON array of schedule objects for the trip.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/trips/:id/schedules', getSchedulesForTripAndMonth);

// ─────────────────────────────────────────────
// TICKET CLASSES
// ─────────────────────────────────────────────

/**
 * @openapi
 * /api/ticket-classes:
 *   get:
 *     tags:
 *       - Ticket Classes
 *     summary: Get all ticket classes
 *     description: >
 *       Returns all active ticket classes.
 *       Optionally filter by day of week using the `day` query parameter.
 *     parameters:
 *       - in: query
 *         name: day
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *         description: >
 *           Filter by day of week. 0 = Sunday, 1 = Monday, …, 6 = Saturday.
 *     responses:
 *       200:
 *         description: A JSON array of ticket class objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketClass'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/ticket-classes', getTicketClassesForDay);

// ─────────────────────────────────────────────
// STATIONS
// ─────────────────────────────────────────────

/**
 * @openapi
 * /api/stations:
 *   get:
 *     tags:
 *       - Stations
 *     summary: Get all stations
 *     description: Returns all active stations, sorted alphabetically by name.
 *     responses:
 *       200:
 *         description: A JSON array of station objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Station'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stations', getAllStations);

/**
 * @openapi
 * /api/stations/{id}:
 *   get:
 *     tags:
 *       - Stations
 *     summary: Get a station by ID
 *     description: Returns a single station matching the provided string id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The station's string identifier (e.g. "tokyo")
 *     responses:
 *       200:
 *         description: The matching station object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stations/:id', getStationById);

// ─────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get all bookings
 *     description: Returns all bookings with populated trip, schedule, and ticket-class data.
 *     responses:
 *       200:
 *         description: A JSON array of booking objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     description: Creates a new booking and returns it with a generated confirmation code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: The newly created booking.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/bookings', getAllBookings);
router.post('/bookings', createBooking);

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get a booking by ID
 *     description: Returns a single booking by its MongoDB _id with populated related data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking's MongoDB ObjectId string
 *     responses:
 *       200:
 *         description: The matching booking object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/bookings/:id', getBookingById);

export default router;
