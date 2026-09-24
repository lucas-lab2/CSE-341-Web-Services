// src/models/schemas/stations.js
import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
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
    // Japanese name (romaji)
    nameRomaji: {
      type: String,
      required: false,
      trim: true,
    },
    // Prefecture / region
    prefecture: {
      type: String,
      required: false,
      trim: true,
    },
    // Geographic coordinates
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    // Amenities available at this station
    amenities: {
      type: [String],
      default: [],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model('Station', stationSchema);

export default Station;
