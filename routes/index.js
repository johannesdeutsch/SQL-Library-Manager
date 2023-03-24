const express = require('express');
const router = express.Router();

const getBookModel = require('../models').Book;

//Handler function
function asyncHandler(callback) {
  return async(req, res, next) => {
    try {
      await callback(req, res, next) 
    } catch(error) {
      res.status(500).send(error);
    }
  }
}



/* GET home page. */
router.get('/', asyncHandler (async ( req, res, next ) => {
  //res.render('index', { title: 'Express' });
  res.redirect('/books');
  try {
    const books = await getBookModel.findAll();
    console.log(books);
    res.json(books); 
  } catch(err) {
    res.json({ error: err.message || err.toString() });
    console.log(err);
  }
}));   

//shows the full list of books
router.get('/books', asyncHandler (async (req, res) => {
  const booklist = await Book.findAll();
  res.render('/index', { booklist });
  console.log(booklist);
}));

// shows the create new book form
router.get('/books/new', (req, res) => {
  res.render('/new-book', { book });
}); 

// posts a new book to the data base
router.post('/books/new', asyncHandler (async (req, res) => {
  const newBook = await Book.create(req.body);
  res.redirect('/books' + book.id);
}));

//shows book detail form
router.get('/books/:id', asyncHandler (async (req, res) => {
  const bookdetailform = await Book.findByPk(req.params.id);
  res.render('/update-book', { bookdetailform })
}));

//updates books info in the database
router.post('/books/:id', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
}));

//delets a book
router.post('/books/:id/delete', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

module.exports = router;
