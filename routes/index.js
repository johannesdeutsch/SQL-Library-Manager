const express = require('express');
const router = express.Router();

const { Book } = require('../models');
const { Op } = require("sequelize");

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
  const booklist = await Book.findAll(req.body);
  res.render('index', { data: booklist, pagetitle: "Books", pageheader: "Books"});
  console.log(booklist);
}));

//searches for a specific book
router.get('/books/search', asyncHandler (async (req, res) => {
  //  try {
      let term  = req.query.term;
      const searchbooks = await Book.findAll({ where: { [Op.or] : [{title: {[Op.like]: `%${term}%`}}, {author: {[Op.like]: `%${term}%`}}, {genre: {[Op.like]: `%${term}%`}}, {year: {[Op.like]: `%${term}%`}}]}});
      res.render('index', {data: searchbooks, query: term, pagetitle: "Books", pageheader: "Books"});
      //console.log(searchbooks); 
      //if (!searchbooks) {
        //res.status(404).render('page-not-found', { err, pagetitle: err.status, pageheader: 'Page Not Found'});
      //}
   // } catch (error) {
     // res.status(404).render('page-not-found', { err, pagetitle: err.status, pageheader: 'Page Not Found'});
   // }
}));


// shows the create new book form
router.get('/books/new', (req, res) => {
  res.render('new-book', { pagetitle: "New Book", pageheader: "New Book" });
}); 

// posts a new book to the data base
router.post('/books/new', asyncHandler (async (req, res) => {
  let book;
  try {
  book = await Book.create(req.body);
  res.redirect('/');
  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("form-error", { book, errors: error.errors, pagetitle: "New Book", pageheader: "New Book"})
    } else {
      throw error;
    }
  }
}));

//shows book detail form
router.get('/books/:id', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book);
  res.render('update-book', { data: book, pageheader: "Update Book", pagetitle: book.title})
}));

//updates books info in the database
router.post('/books/:id', asyncHandler (async (req, res) => {
  let book;
  try { 
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body)
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { data: book, errors: error.errors} )
    } else {
      throw error;
    }
  }
  console.log(req.body);
}));

//delets a book
router.post('/books/:id/delete', asyncHandler (async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

module.exports = router;
