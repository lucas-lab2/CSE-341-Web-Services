// src/models/schedules.js
import Schedule from './schemas/schedules.js';
import Trip from './schemas/trips.js';

/**
 * Return schedules for a given trip, optionally filtered by month.
 *
 * @param {string} tripId  - the string `id` of the parent trip (not the ObjectId)
 * @param {number|null} month - optional 1–12 filter
 */
export async function getSchedulesByTripId(tripId, month = null) {
  // First resolve the string trip id to its MongoDB ObjectId
  const trip = await Trip.findOne({ id: tripId }).select('_id').lean();

  if (!trip) {
    return null; // trip not found — caller will return 404
  }

  const query = { tripId: trip._id };

  if (month !== null) {
    const monthNum = parseInt(month, 10);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      query.month = monthNum;
    }
  }

  return Schedule.find(query).sort({ date: 1, departureTime: 1 }).lean();
}
