// src/models/schemas/ticket-classes.js
import mongoose from 'mongoose';

const ticketClassSchema = new mongoose.Schema(
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
    // e.g. 'ordinary', 'green', 'gran-class'
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    priceMultiplier: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    // Days of the week this class is available (0=Sun … 6=Sat)
    availableDays: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    amenities: {
      type: [String],
      default: [],
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

const TicketClass = mongoose.model('TicketClass', ticketClassSchema);

export default TicketClass;
