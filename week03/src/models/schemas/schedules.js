// src/models/schemas/schedules.js
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    // Reference to the parent Trip
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    // Departure time as "HH:MM" string (e.g. "08:30")
    departureTime: {
      type: String,
      required: true,
      trim: true,
    },
    // Arrival time as "HH:MM" string
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },
    // ISO date string "YYYY-MM-DD" for the specific run date
    date: {
      type: String,
      required: true,
      trim: true,
    },
    // Month number (1–12) derived from date — stored for fast filtering
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    // Year derived from date
    year: {
      type: Number,
      required: true,
    },
    // Available seats at booking time
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
