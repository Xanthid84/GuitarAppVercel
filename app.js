require('dotenv').config();
console.log("Database Host:", process.env.HOST);
console.log("Database Port:", process.env.PORT);
console.log("Database User:", process.env.ADMIN_USERNAME);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var guitarsRouter = require('./routes/guitars');
var populateRouter = require('./routes/populate');

var db = require("./models");
db.sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully.");
    db.sequelize.sync({ force: false });
  })
  .catch(err => {
    console.error("Database connection failed:", err);
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/guitars', guitarsRouter);
app.use('/populate', populateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
