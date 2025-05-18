const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { saveBooksToFile, loadBooksFromFile } = require('../utils/fileStorage');
const { title } = require('process');

router.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// 1- Add a new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    await saveBooksToFile();
    console.log(' Done:', {
      title: book.title,
      author: book.author,
      genre: book.genre
    });
    res.status(201).send(book);
  } catch (err) {
    console.error(' Error  :', err);
    res.status(400).send(err);
  }
});

// 2- Search for books by id or title
router.get('/search', async (req, res) => {
  try {
    const { id, title } = req.query;
    let query = {};
    
    if (id) query._id = id;
    if (title) query.title = new RegExp(title, 'i');
    
    const books = await Book.find(query);
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});


// 3- Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 4) i- Sort books by title
router.get('/sort/title', async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 4) ii- Sort books by publication date
router.get('/sort/date', async (req, res) => {
  try {
    const books = await Book.find().sort({ publicationDate: 1 });
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 5) i- Delete books by title
router.delete('/by-title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const book = await Book.findOneAndDelete({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    });

    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Booknot found  '
      });
    }

    await saveBooksToFile(); 
    res.json({ 
      success: true,
      message: `Delete is Done "${book.title}" (ID: ${book.bookId})`,
      deletedData: book
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: ' Delete Error ',
      error: err.message 
    });
  }
});
// 5) ii- Delete books by id
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found in database'
      });
    }

    await saveBooksToFile();
    
    const updatedBooks = await loadBooksFromFile();
    
    res.json({
      success: true,
      message: `Book "${book.title}" deleted successfully`,
      remainingBooks: updatedBooks.length
    });
    
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: err.message
    });
  }
});

(async () => {
  try {
    const data = await loadBooksFromFile();
    if (Array.isArray(data) && data.length > 0) {
      await Book.deleteMany({});
      await Book.insertMany(data);
    }
  } catch (err) {
    console.error('Error initializing data:', err);
  }
})();

module.exports = router;