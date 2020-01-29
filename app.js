require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require("hbs");
const session = require("express-session");
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');


//pool connection
var db = require("./helpers/mysqlConnection").mysql_pool;
// Verify connection to db
db.query('SELECT 1', function (error, results, fields) {
//   //TODO: Catch error if can't connect to the database
  if (error) throw error;
  console.log('Connected to the database');
});

//==================================ROUTES====================================
// ===== Evaluation Section =====
var evaluationRouter = require('./routes/evaluation');
// ===== School Term Section =====
var schoolTermRouter = require('./routes/schoolTerm');
// ===== Departments Section =====
var departmentRouter = require('./routes/department');
// ===== Study Programs Section =====
var studyProgramsRouter = require('./routes/studyPrograms');
// ===== Users Section =====
var usersRouter = require('./routes/users');
// ===== Outcomes Section =====
var outcomesRouter = require('./routes/outcomes');
// ===== Courses Section =====
var coursesRouter = require('./routes/courses');
// ===== Performance Criteria Section =====
var perfCritRouter = require('./routes/performanceCriteria');
// ====== AUTHORIZE ROUTE ====
var authorize = require('./routes/authorize');
// ====== Table Test Route ======
var tableTest = require('./routes/tableTest');
// ===== Program/Course/Term Selection =====
var chooseCourseTermRouter = require('./routes/professorReport/chooseCourseTerm');
// ===== Professor Input Section =====
var profInputRouter = require('./routes/professorReport/professorInput');
//=====Outcome Selection=====
var chooseOutcomes = require('./routes/professorReport/chooseOutcomes');
//==================================ROUTES====================================

var app = express();
const port = process.env.PORT || 3000;

// ======================SETUP=======================*/ 
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'Rnwdasdlqwuhdajsdhlawue123814312kdlaksdjnuqwlehj3n1i',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials/')
app.set('view engine', 'hbs');
app.use(methodOverride("_method"));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ========================== USING ROUTES ==========================
// Index route & authorize
app.use('/', indexRouter);
app.use('/authorize', authorize);
// ===== Evaluation Section =====
app.use('/evaluation', evaluationRouter);
// ===== School Term Section =====
app.use('/schoolTerm', schoolTermRouter);
// ===== Departments Section =====
app.use('/department', departmentRouter);
// ===== Study Programs Section =====
app.use('/studyPrograms', studyProgramsRouter);
// ===== Users Section =====
app.use('/users', usersRouter);
// ===== Outcomes Section =====
app.use('/outcomes', outcomesRouter);
// ===== Courses Section =====
app.use('/courses', coursesRouter);
// ===== Performance Criteria Section =====
app.use('/performanceCriteria', perfCritRouter);
// ===== Table Test =====
app.use('/tableTest', tableTest);
//===== Program/Course/Term Selection =====
app.use('/chooseCourseTerm', chooseCourseTermRouter);
//===== Professor Input Section =====
app.use('/professorInput', profInputRouter);
//=====Outcome Selection=====
app.use('/chooseOutcomes', chooseOutcomes);
// ====================================================


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Run the app
app.listen(port, function () { console.log(`Server ${port} is online!`);});
