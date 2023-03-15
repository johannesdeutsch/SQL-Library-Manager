var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

// async IIFE
(async () => {
  await sequelize.sync({ force: true });
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static('public'));


//app.get('/', (req, res) => {
//  res.status(500).send({err: 'something blew up'});
//})


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  res.locals.error = err;
  res.status(404);
  err.message = "Oops! Unfortunately this page doesn't exist.";
  res.render('page-not-found', { err });
  next(err);
});

// global error handler
app.use((err, req, res, next) => {
  //set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  //res.status(err.status || 500);


  if (err.status === false) {
    err.status(500);
  } else {
    err.status;
  }

  if (err.message === false) {
    err.message = "Sorry, it seems that there's an internal server error."
  } else {
    err.message;
  } 
  console.log(err.status);
  console.log(err.message);
  res.render('error', { err } );
  
});

module.exports = app;
