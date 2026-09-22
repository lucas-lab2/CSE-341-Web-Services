// src/models/schemas/trips.js
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Human-readable slug used in URLs and display
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Origin station name
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    // Destination station name
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    // Duration in minutes
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    // Distance in kilometres
    distanceKm: {
      type: Number,
      required: false,
      min: 0,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    imageAlt: {
      type: String,
      required: false,
      trim: true,
    },
    // Array of intermediate station names along the route
    stations: {
      type: [String],
      default: [],
    },
    // Reference to the Train used on this trip
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
