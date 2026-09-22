// src/controllers/ticket-classes.js
import {
  getAllTicketClasses as findAllTicketClasses,
  getTicketClassesForDay as findTicketClassesForDay,
} from '../models/ticket-classes.js';

/**
 * GET /api/ticket-classes
 * Returns all active ticket classes.
 * If ?day=<0-6> is provided, filters by that day of the week.
 */
export async function getAllTicketClasses(req, res) {
  try {
    const ticketClasses = await findAllTicketClasses();
    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error('Error fetching ticket classes:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket classes' });
  }
}

/**
 * GET /api/ticket-classes?day=<0-6>
 * Returns ticket classes available on a specific day of the week.
 * Day 0 = Sunday, 6 = Saturday.
 */
export async function getTicketClassesForDay(req, res) {
  try {
    const { day } = req.query;

    if (day === undefined) {
      return getAllTicketClasses(req, res);
    }

    const dayNum = parseInt(day, 10);
    if (isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
      return res.status(400).json({ error: 'day must be a number between 0 (Sunday) and 6 (Saturday)' });
    }

    const ticketClasses = await findTicketClassesForDay(dayNum);
    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error('Error fetching ticket classes for day:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket classes' });
  }
}
