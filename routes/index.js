var express = require('express');
var router = express.Router();

const getBookModel = require('../models').Book;

/* GET home page. */
/* router.get('/', async ( req, res, next ) => {
  //res.render('index', { title: 'Express' });
  try {
    const books = await getBookModel.findAll();
    console.log(books);
    res.json(books); 
  } catch(err) {
    res.json({ error: err.message || err.toString() });
  }

}); */

module.exports = router;
