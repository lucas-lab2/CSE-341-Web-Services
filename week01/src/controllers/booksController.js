import { getDb } from '../db/connect.js';

const getAllBooks = async (req, res) => {
  try {
    const db = getDb();
    const books = await db.collection('books').find({}).toArray();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const db = getDb();
    const book = await db.collection('books').findOne({ id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export { getAllBooks, getBookById };
