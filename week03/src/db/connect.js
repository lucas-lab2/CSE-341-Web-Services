// src/db/connect.js
import mongoose from 'mongoose';

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  await mongoose.connect(connectionString, {
    dbName: process.env.MONGODB_DB_NAME || 'cse341-week03',
  });

  console.log('Connected to MongoDB via Mongoose.');
};

export { connectToDb };
