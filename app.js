require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require("ejs");
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var authHelper = require('./helpers/auth');
var flash = require("connect-flash");



var  {options, db} = require("./helpers/mysqlConnection");
db = db.mysql_pool;

// connect to db
db.query('SELECT 1', function (error, results, fields) {
// TODO: Catch error if can't connect to the database
  if (error) throw error;
  console.log('Connected to the database');
});

// For sessions
var session = require("express-session")
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(options);


//==================================ROUTES====================================
// ===== Index Route =====
var indexRouter = require('./routes/index');
// ===== Evaluation Section =====
var evaluationRouter = require('./routes/evaluationRubric');
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
// ===== Program/Course/Term Selection =====
var assessmentRouter = require('./routes/assessment');
//==================================ROUTES====================================

var app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "public"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'sjadhkasdhkjasdhwqudhasjbqkugdabsjdkbwkaudgbjkkfvrrt192ejamnx',
  secret: 'thegrafico is a cool guy',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 30 minutes ultil sessions ends
}));


// ========================== USING ROUTES ==========================

// Locals variables, or consts variables goes here. 
// create a global variable - req.locals.name = value
app.use(function(req, res, next){

  res.locals.error = req.flash("error"); //error mesage go red
	res.locals.success = req.flash("success"); //success message go green

  //locals variables

  res.locals.signOutUrl = "/authorize/signout";
  res.locals.signInUrl =  authHelper.getAuthUrl();

  next();
});


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
// ===== Program/Course/Term Selection =====
app.use('/assessment', assessmentRouter);
// ====================================================

// 404 ERROR HANDLE
app.use("*", function(req, res){
  res.send("THIS PAGE DON'T EXIST");
});

//Run the app
app.listen(port, function () { console.log(`Server ${port} is online!`);});
