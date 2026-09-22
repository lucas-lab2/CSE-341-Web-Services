// src/models/ticket-classes.js
import TicketClass from './schemas/ticket-classes.js';

/**
 * Return all active ticket classes.
 */
export async function getAllTicketClasses() {
  return TicketClass.find({ isActive: true }).sort({ priceMultiplier: 1 }).lean();
}

/**
 * Return ticket classes available on a specific day of the week.
 *
 * @param {number} day - 0 (Sunday) through 6 (Saturday)
 */
export async function getTicketClassesForDay(day) {
  const dayNum = parseInt(day, 10);
  return TicketClass.find({ isActive: true, availableDays: dayNum })
    .sort({ priceMultiplier: 1 })
    .lean();
}
