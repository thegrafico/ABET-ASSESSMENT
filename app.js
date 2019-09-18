require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require("hbs");
var methodOverride = require("method-override");
var bodyParser = require('body-parser'); //recuperar datos a traves de URL
var indexRouter = require('./routes/index');
var db = require("./helpers/mysqlConnection").mysql_pool; //pool connection

// Verify connection to db
db.query('SELECT 1', function (error, results, fields) {
  if (error) throw error;
  console.log('Connected to the database');
});

//==================================ROUTES====================================
// ===== Evaluation Section =====
var evaluationRouter = require('./routes/evaluations/evaluation');
// ===== School Term Section =====
var schoolTermRouter = require('./routes/schoolTerms/schoolTerm');
// ===== Departments Section =====
var departmentRouter = require('./routes/departments/department');
// ===== Study Programs Section =====
var studyProgramsRouter = require('./routes/studyPrograms/studyPrograms');
// ===== Users Section =====
var usersRouter = require('./routes/users/users');
// ===== Outcomes Section =====
var outcomesRouter = require('./routes/outcomes/outcomes');
// ===== Courses Section =====
var coursesRouter = require('./routes/courses/courses');
// ===== Performance Criteria Section =====
var perfCritRouter = require('./routes/performanceCriteria/performanceCriteria');
<<<<<<< HEAD
var createPerfCrit = require('./routes/performanceCriteria/createPerfCrit');
var deletePerfCrit = require('./routes/performanceCriteria/deletePerfCrit');
var detailPerfCrit = require('./routes/performanceCriteria/detailPerfCrit');
var editPerfCrit = require('./routes/performanceCriteria/editPerfCrit');

// ===== Profiles Section =====
// var profilesRouter = require('./routes/profiles/profiles');
// var createProfile  = require('./routes/profiles/createProfiles');
// var deleteProfile  = require('./routes/profiles/deleteProfiles');
// var editProfile  = require('./routes/profiles/editProfiles');

var authorize = require('./routes/authorize');

=======
// ====== AUTHORIZE ROUTE ====
var authorize = require('./routes/authorize');
//==================================ROUTES====================================
>>>>>>> ed5e428681685db88f3612a93d0df4e2fb963c21
var app = express();

const port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials/')

app.set('view engine', 'hbs');

app.use(methodOverride("_method"));

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
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
// app.use('/createUsers', createUsers);
// ===== Outcomes Section =====
app.use('/outcomes', outcomesRouter);
// ===== Courses Section =====
app.use('/courses', coursesRouter);
// ===== Performance Criteria Section =====
app.use('/performanceCriteria', perfCritRouter);
// ====================================================



// ===== Profile Section =====
// app.use('/profiles', profilesRouter);
// app.use('/createProfile', createProfile);
// app.use('/deleteProfile', deleteProfile);
// app.use('/editProfile', editProfile);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, function () {
  console.log(`Server ${port} is online!`);
});
