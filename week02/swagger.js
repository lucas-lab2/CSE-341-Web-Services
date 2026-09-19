import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '2.0.0',
      description: 'A Books and Authors API with full CRUD operations'
    },
    servers: [
      {
        url: '/',
        description: 'Current server'
      }
    ]
  },
  apis: ['./src/routes/books.js', './src/routes/authors.js']
};

const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated.');
