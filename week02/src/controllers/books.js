import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
} from '../models/books.js';

const getAllBooks = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookByIdFromDb(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book.' });
  }
};

export { getAllBooks, getBookById };
