// swagger.js — run with: npm run swagger
import swaggerJsdoc from 'swagger-jsdoc';
import { writeFileSync } from 'fs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kizuna Rail API — Week 03',
      version: '1.0.0',
      description:
        'CSE 341 Week 03 — Mongoose-backed REST API for the Kizuna Rail scenic railway booking application. ' +
        'Implements Trips, Schedules, Bookings, Ticket Classes, Stations, and Trains feature sets.',
      contact: {
        name: 'Lucas Miranda',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Train: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'shinkansen-n700' },
            name: { type: 'string', example: 'Shinkansen N700' },
            operator: { type: 'string', example: 'JR Central' },
            type: { type: 'string', example: 'High-speed' },
            maxSpeedKmh: { type: 'number', example: 300 },
            capacity: { type: 'number', example: 1323 },
            powerSource: { type: 'string', example: 'Electric' },
            bestFor: { type: 'string', example: 'Long-distance scenic routes' },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            imageAlt: { type: 'string' },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'fuji-express' },
            name: { type: 'string', example: 'Fuji Express' },
            slug: { type: 'string', example: 'fuji-express' },
            origin: { type: 'string', example: 'Tokyo' },
            destination: { type: 'string', example: 'Kawaguchiko' },
            durationMinutes: { type: 'number', example: 120 },
            distanceKm: { type: 'number', example: 100 },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            stations: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean', example: true },
          },
        },
        Schedule: {
          type: 'object',
          properties: {
            tripId: { type: 'string', description: 'ObjectId of the parent trip' },
            departureTime: { type: 'string', example: '08:30' },
            arrivalTime: { type: 'string', example: '10:30' },
            date: { type: 'string', example: '2026-07-15' },
            month: { type: 'number', example: 7 },
            year: { type: 'number', example: 2026 },
            availableSeats: { type: 'number', example: 250 },
            status: { type: 'string', enum: ['scheduled', 'cancelled', 'completed'], example: 'scheduled' },
          },
        },
        TicketClass: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'green-car' },
            name: { type: 'string', example: 'Green Car' },
            code: { type: 'string', example: 'green' },
            description: { type: 'string' },
            priceMultiplier: { type: 'number', example: 1.5 },
            availableDays: {
              type: 'array',
              items: { type: 'number' },
              example: [0, 1, 2, 3, 4, 5, 6],
            },
            amenities: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean', example: true },
          },
        },
        Station: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'tokyo' },
            name: { type: 'string', example: 'Tokyo Station' },
            nameRomaji: { type: 'string', example: 'Tōkyō-eki' },
            prefecture: { type: 'string', example: 'Tokyo' },
            latitude: { type: 'number', example: 35.6812 },
            longitude: { type: 'number', example: 139.7671 },
            amenities: { type: 'array', items: { type: 'string' } },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
            isActive: { type: 'boolean', example: true },
          },
        },
        Passenger: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            firstName: { type: 'string', example: 'Lucas' },
            lastName: { type: 'string', example: 'Miranda' },
            email: { type: 'string', format: 'email', example: 'lucas@example.com' },
            phone: { type: 'string', example: '+1-555-0100' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            tripId: { type: 'object', description: 'Populated trip (name, origin, destination)' },
            scheduleId: { type: 'object', description: 'Populated schedule (date, times)' },
            ticketClassId: { type: 'object', description: 'Populated ticket class (name, code)' },
            passenger: { $ref: '#/components/schemas/Passenger' },
            numberOfSeats: { type: 'number', example: 2 },
            totalPrice: { type: 'number', example: 24000 },
            status: { type: 'string', enum: ['confirmed', 'cancelled', 'pending'], example: 'confirmed' },
            confirmationCode: { type: 'string', example: 'A3F7B2C1' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BookingInput: {
          type: 'object',
          required: ['tripId', 'scheduleId', 'ticketClassId', 'passenger', 'numberOfSeats', 'totalPrice'],
          properties: {
            tripId: { type: 'string', example: 'fuji-express', description: 'String id of the trip' },
            scheduleId: { type: 'string', description: 'MongoDB ObjectId of the schedule' },
            ticketClassId: { type: 'string', description: 'MongoDB ObjectId of the ticket class' },
            passenger: { $ref: '#/components/schemas/Passenger' },
            numberOfSeats: { type: 'number', example: 2 },
            totalPrice: { type: 'number', example: 24000 },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'The requested resource was not found.',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { error: { type: 'string' } } },
              example: { error: 'Trip not found' },
            },
          },
        },
        BadRequest: {
          description: 'The request body or parameters are invalid.',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { error: { type: 'string' } } },
              example: { error: 'month must be a number between 1 and 12' },
            },
          },
        },
        ServerError: {
          description: 'An unexpected server error occurred.',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { error: { type: 'string' } } },
              example: { error: 'Failed to fetch trips' },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Trains', description: 'Kizuna Rail fleet information' },
      { name: 'Trips', description: 'Scenic railway trip routes' },
      { name: 'Schedules', description: 'Departure/arrival schedules per trip' },
      { name: 'Ticket Classes', description: 'Available ticket class options' },
      { name: 'Stations', description: 'Station details and information' },
      { name: 'Bookings', description: 'Passenger booking management' },
    ],
  },
  apis: ['./src/routes/api-routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);
writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('swagger.json generated successfully.');
