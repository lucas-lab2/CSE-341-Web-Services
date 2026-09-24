// src/controllers/bookings.js
import {
  getAllBookings as findAllBookings,
  getBookingById as findBookingById,
  createBooking as insertBooking,
} from '../models/bookings.js';

/**
 * GET /api/bookings
 * Returns all bookings with populated trip, schedule, and ticket-class data.
 */
export async function getAllBookings(req, res) {
  try {
    const bookings = await findAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

/**
 * GET /api/bookings/:id
 * Returns a single booking by MongoDB _id.
 */
export async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await findBookingById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    // CastError means the id format is invalid
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid booking id format' });
    }
    console.error('Error fetching booking:', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
}

/**
 * POST /api/bookings
 * Creates a new booking. Expects JSON body with:
 *   tripId, scheduleId, ticketClassId, passenger, numberOfSeats, totalPrice
 */
export async function createBooking(req, res) {
  try {
    const { tripId, scheduleId, ticketClassId, passenger, numberOfSeats, totalPrice } = req.body;

    // Basic validation
    if (!tripId || !scheduleId || !ticketClassId || !passenger || !numberOfSeats || totalPrice === undefined) {
      return res.status(400).json({
        error: 'tripId, scheduleId, ticketClassId, passenger, numberOfSeats, and totalPrice are required',
      });
    }

    if (!passenger.firstName || !passenger.lastName || !passenger.email) {
      return res.status(400).json({
        error: 'passenger.firstName, passenger.lastName, and passenger.email are required',
      });
    }

    const booking = await insertBooking({
      tripId,
      scheduleId,
      ticketClassId,
      passenger,
      numberOfSeats,
      totalPrice,
    });

    return res.status(201).json(booking);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid booking data', details: error.message });
    }
    if (error.message === 'Trip not found') {
      return res.status(404).json({ error: 'Trip not found' });
    }
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
}
