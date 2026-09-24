// src/models/bookings.js
import { randomUUID } from 'crypto';
import Booking from './schemas/bookings.js';
import Trip from './schemas/trips.js';
import Schedule from './schemas/schedules.js';
import TicketClass from './schemas/ticket-classes.js';

/**
 * Create a new booking document.
 *
 * @param {object} bookingData
 * @param {string} bookingData.tripId         - string trip id (e.g. "fuji-express")
 * @param {string} bookingData.scheduleId     - MongoDB ObjectId string of the schedule
 * @param {string} bookingData.ticketClassId  - MongoDB ObjectId string of the ticket class
 * @param {object} bookingData.passenger      - { firstName, lastName, email, phone? }
 * @param {number} bookingData.numberOfSeats
 * @param {number} bookingData.totalPrice
 */
export async function createBooking(bookingData) {
  const { tripId, scheduleId, ticketClassId, passenger, numberOfSeats, totalPrice } = bookingData;

  // Resolve string tripId → ObjectId
  const trip = await Trip.findOne({ id: tripId }).select('_id').lean();
  if (!trip) throw new Error('Trip not found');

  const booking = await Booking.create({
    tripId: trip._id,
    scheduleId,
    ticketClassId,
    passenger,
    numberOfSeats,
    totalPrice,
    confirmationCode: randomUUID().slice(0, 8).toUpperCase(),
    status: 'confirmed',
  });

  return booking;
}

/**
 * Return all bookings, populated with trip name, schedule date, and ticket class name.
 */
export async function getAllBookings() {
  return Booking.find({})
    .sort({ createdAt: -1 })
    .populate('tripId', 'name origin destination')
    .populate('scheduleId', 'date departureTime arrivalTime')
    .populate('ticketClassId', 'name code')
    .lean();
}

/**
 * Return a single booking by its MongoDB _id string.
 * @param {string} id
 */
export async function getBookingById(id) {
  return Booking.findById(id)
    .populate('tripId', 'name origin destination')
    .populate('scheduleId', 'date departureTime arrivalTime')
    .populate('ticketClassId', 'name code')
    .lean();
}
