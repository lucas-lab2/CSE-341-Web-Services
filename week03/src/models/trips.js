// src/models/trips.js
import Trip from './schemas/trips.js';

/**
 * Return a single trip by its string `id` field.
 * @param {string} id
 */
export async function getTripById(id) {
  return Trip.findOne({ id }).lean();
}

/**
 * Return all active trips, sorted alphabetically by name.
 */
export async function getAllTrips() {
  return Trip.find({ isActive: true }).sort({ name: 1 }).lean();
}
