var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require("hbs");

var indexRouter = require('./routes/index');
// ===== Evaluation Section =====
var evaluationRouter = require('./routes/evaluations/evaluation');
var createEvaluation = require('./routes/evaluations/createEvaluation');
var deleteEvaluation = require('./routes/evaluations/deleteEvaluation');
var editEvaluation = require('./routes/evaluations/editEvaluation');
// ===== School Term Section =====
var schoolTermRouter = require('./routes/schoolTerms/schoolTerm');
var editSchoolTerm = require('./routes/schoolTerms/editSchoolTerm');
var deleteSchoolTerm = require('./routes/schoolTerms/deleteSchoolTerm');
var createSchoolTerm = require('./routes/schoolTerms/createSchoolTerm');

var app = express();

var port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials/')

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// ===== Evaluation Section =====
app.use('/evaluation', evaluationRouter);
app.use('/createEvaluation', createEvaluation);
app.use('/deleteEvaluation', deleteEvaluation);
app.use('/editEvaluation', editEvaluation);
// ===== School Term Section =====
app.use('/schoolTerm', schoolTermRouter);
app.use('/editSchoolTerm', editSchoolTerm);
app.use('/deleteSchoolTerm', deleteSchoolTerm);
app.use('/createSchoolTerm', createSchoolTerm);

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

app.listen(port, function(){
  console.log(`Server ${port} is online!`);
});
