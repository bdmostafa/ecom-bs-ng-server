// Dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

// Import DB
const { connectDB } = require('./db/dbConnection');

// Import error middleware
const { error } = require('./middleware/error');

// Config
require('dotenv').config({
  path: './config/keys.env'
})

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// handle cors policy 
// app.use(cors());
app.use(cors({ origin:true, credentials:true }));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// Connecting DB
connectDB();

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/', indexRouter);
app.use(error);

// prevent CORS problem and catch 404 then forward to error handler
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Expose-Headers', 'Set-Cookie, x-auth-token');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
