// src/models/stations.js
import Station from './schemas/stations.js';

/**
 * Return all active stations, sorted by name.
 */
export async function getAllStations() {
  return Station.find({ isActive: true }).sort({ name: 1 }).lean();
}

/**
 * Return a single station by its string `id` field.
 * @param {string} id
 */
export async function getStationById(id) {
  return Station.findOne({ id }).lean();
}
