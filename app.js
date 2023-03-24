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
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static('public'));



// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('404 error handler called');
  const err = new Error('Not found');
  err.status = 404;
  err.message = "Oops! Unfortunately this page doesn't exist.";
  next(err);
});

// global error handler
app.use((err, req, res, next) => {
  //set locals, only providing error in development
  console.log('global error handler called');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  res.status(err.status || 500);

  if (err.status === 404) {
    res.status(404).render('page-not-found', { err } );
  } else {
    const err = new Error('Something went wrong');
    err.message = err.message || 'Oops! Something went wrong.';
    res.status(err.status).render('error', { err } );
  }
 
  console.log(err.status);
  console.log(err.message);
  
});

module.exports = app;
