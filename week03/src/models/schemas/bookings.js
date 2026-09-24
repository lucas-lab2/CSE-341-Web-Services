// src/models/schemas/bookings.js
import mongoose from 'mongoose';

// Embedded passenger sub-document
const passengerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: false, trim: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    // Reference to the Trip being booked
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    // Reference to the Schedule slot
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    // Reference to the selected ticket class
    ticketClassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketClass',
      required: true,
    },
    // Passenger details embedded (snapshot at booking time so price/name changes don't affect record)
    passenger: {
      type: passengerSchema,
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    // Total price snapshot at booking time
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    // Unique confirmation code shown to the user
    confirmationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    // Collection is explicitly named 'bookings' (replacing the old 'confirmations' name)
    collection: 'bookings',
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
