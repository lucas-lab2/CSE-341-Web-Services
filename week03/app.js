// app.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import apiRouter from './src/routes/api-routes.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Swagger — load JSON lazily so swagger.js can generate it first
let swaggerDocument;
try {
  swaggerDocument = require('./swagger.json');
} catch {
  swaggerDocument = { openapi: '3.0.0', info: { title: 'Week 03 API', version: '1.0.0' }, paths: {} };
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root
app.get('/', (_req, res) => {
  res.json({
    message: 'Kizuna Rail API — Week 03',
    docs: '/api-docs',
    trains: '/api/trains',
    trips: '/api/trips',
    schedules: '/api/trips/:id/schedules',
    bookings: '/api/bookings',
    ticketClasses: '/api/ticket-classes',
    stations: '/api/stations',
  });
});

// API Routes
app.use('/api', apiRouter);

export default app;
