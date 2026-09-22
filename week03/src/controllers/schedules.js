// src/controllers/schedules.js
import { getSchedulesByTripId } from '../models/schedules.js';

/**
 * GET /api/trips/:id/schedules
 * Returns all schedules for a trip.
 */
export async function getSchedulesForTrip(req, res) {
  try {
    const { id } = req.params;
    const schedules = await getSchedulesByTripId(id);

    if (schedules === null) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}

/**
 * GET /api/trips/:id/schedules?month=<1-12>
 * Returns schedules filtered by month number.
 */
export async function getSchedulesForTripAndMonth(req, res) {
  try {
    const { id } = req.params;
    const { month } = req.query;

    if (!month) {
      // No month query param — delegate to the unfiltered handler
      return getSchedulesForTrip(req, res);
    }

    const monthNum = parseInt(month, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'month must be a number between 1 and 12' });
    }

    const schedules = await getSchedulesByTripId(id, monthNum);

    if (schedules === null) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules by month:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}
