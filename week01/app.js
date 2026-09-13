import express from 'express';
import booksRouter from './src/routes/books.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Week 01!' });
});

app.use('/books', booksRouter);

export default app;
