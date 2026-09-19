import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import booksRouter from './src/routes/books.js';
import authorsRouter from './src/routes/authors.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({ message: 'Books and Authors API - Week 02' });
});

app.use('/books', booksRouter);
app.use('/authors', authorsRouter);

export default app;
