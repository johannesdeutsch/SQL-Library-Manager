const express = require('express');
const router = express.Router();

const { Book } = require('../models');

//Handler function
function asyncHandler(callback) {
  return async(req, res, next) => {
    try {
      await callback(req, res, next) 
    } catch(error) {
      next(error);
    }
  }
}



/* GET home page. */
router.get('/', asyncHandler (async ( req, res, next ) => {
  res.redirect('/books/');
}));   

//shows the full list of books
router.get('/books', asyncHandler (async (req, res) => {
  const booklist = await Book.findAll();
  res.render('index', { booklist, pagetitle: "Books", pageheader: "Books"});
  console.log(booklist);
}));

// shows the create new book form
router.get('/books/new', (req, res) => {
  res.render('new-book', { pagetitle: "New Book", pageheader: "New Book" });
}); 

// posts a new book to the data base
router.post('/books/new', asyncHandler (async (req, res) => {
  const newBook = await Book.create(req.body);
  res.redirect('/books/' + newBook.id);
}));

//shows book detail form
router.get('/books/:id', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  res.render('update-book', { book, pageheader: "Update Book", pagetitle: book.title})
}));

//updates books info in the database
router.post('/books/:id', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books/' + book.id);
}));

//delets a book
router.post('/books/:id/delete', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

module.exports = router;
