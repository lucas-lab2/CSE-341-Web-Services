// src/controllers/trips.js
import {
  getTripById as findTripById,
  getAllTrips as findAllTrips,
} from '../models/trips.js';

/**
 * GET /api/trips
 * Returns all active trips as JSON.
 */
export async function getAllTrips(req, res) {
  try {
    const trips = await findAllTrips();
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ error: 'Failed to fetch trips' });
  }
}

/**
 * GET /api/trips/:id
 * Returns a single trip by its string id.
 */
export async function getTripById(req, res) {
  try {
    const { id } = req.params;
    const trip = await findTripById(id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
}
