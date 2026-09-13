import express from 'express';
import { getDb } from './src/db/connect.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Week 01!' });
});

app.get('/trails', async (req, res) => {
  try {
    const db = getDb();
    const trails = await db.collection('trails').find().toArray();
    res.json(trails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trails', error: error.message });
  }
});

export default app;
