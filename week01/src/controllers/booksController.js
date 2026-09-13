import { getDb } from '../db/connect.js';

const getAllBooks = async (req, res) => {
  const db = getDb();
  const books = await db.collection('books').find({}).toArray();
  res.status(200).json(books);
};

export { getAllBooks };
