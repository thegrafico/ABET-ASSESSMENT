require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var authHelper = require('./helpers/auth');
var flash = require("connect-flash");
const middleware = require("./middleware/validateUser");
var { options, db } = require("./helpers/mysqlConnection");
const {admin, coordinator, routes} = require("./helpers/profiles");
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


// =============================== ADMIN ROUTES ===================================
// ===== Index Route =====
var indexRouter = require('./routes/index');
// ===== Evaluation Section =====
var evaluationRubric = require('./routes/evaluationRubric');
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
// ===== PROFESSOR =====
var assessmentRouter = require('./routes/professor/assessment');
// ===== COORDINATOR =====
var coordinatorRoute = require('./routes/professor/coordinator');
// ===== CourseMapping Route =====
var courseMapping = require('./routes/courseMapping');
// ===== API =====
var apiRoute = require('./routes/api');

//======================================================================================

var app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "public"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// to store sessions
app.use(session({
	key: 'sjadhkasdhkjasdhwqudhasjbqkugdabsjdkbwkaudgbjkkfvrrt192ejamnx',
	secret: 'thegrafico is a cool guy',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 7000000 } // 30 minutes ultil sessions ends
}));


// ========================== USING ROUTES ==========================
const admin_route = "/admin";
// Locals variables, or consts variables goes here. 
// create a global variable - req.locals.name = value
app.use(function (req, res, next) {

	res.locals.error = req.flash("error"); //error mesage go red
	res.locals.success = req.flash("success"); //success message go green
	res.locals.admin_route = admin_route;
	res.locals.homeURL = admin_route;
	res.locals.signOutUrl = "/authorize/signout";
	res.locals.signInUrl = authHelper.getAuthUrl();
	res.locals.filter = false;
	res.locals.filter_title = false;
	res.locals.filter_value = [];
	res.locals.breadcrumb = [];
	res.locals.feedback_message = "";
	res.locals.description_box = undefined;

	// is user admin = true, eitherway false 
	if (req.session != undefined && req.session.user_email) {

		// load header options
		res.locals.hasAdminPrivilege = (req.session.user_profile == admin || req.session.user_profile == coordinator);

		// load admin options
		if (res.locals.hasAdminPrivilege)
			res.locals.adminOptions = routes[req.session.user_profile];
		
		// profile namde
		res.locals.profileName = req.session.profileName;
		//user name
		res.locals.userName = req.session.user_name;


	}else{
		res.locals.hasAdminPrivilege = false;
		res.locals.adminOptions = [];
	}

	next();
});

// Index route & authorize
app.use('/', indexRouter);
// ===== LOGIN AND SIGN OUT =====
app.use('/authorize', authorize);
// ===== PROFESSOR =====
app.use('/professor', middleware.is_login, middleware.is_professor, assessmentRouter);
// ===== COORDINATOR =====
app.use('/professor/coordinator', middleware.is_login, middleware.hasAdminPrivilege, coordinatorRoute);
// ===== Departments Section =====
app.use(`${admin_route}/department`, middleware.is_login, middleware.is_admin, departmentRouter);
// ===== Users Section =====
app.use(`${admin_route}/users`, middleware.is_login, middleware.is_admin, usersRouter);
// ===== Study Programs Section =====
app.use(`${admin_route}/studyprograms`, middleware.is_login, middleware.is_admin, studyProgramsRouter);
// ===== Courses Section =====
app.use(`${admin_route}/courses`, middleware.is_login, middleware.is_admin, coursesRouter);
// ===== Outcomes Section =====
app.use(`${admin_route}/outcomes`, middleware.is_login, middleware.hasAdminPrivilege, outcomesRouter);
// ===== Performance Criteria Section =====
app.use(`${admin_route}/outcomes`, middleware.is_login, middleware.hasAdminPrivilege, perfCritRouter);
// ===== EVALUATION RUBRIC =====
app.use(`${admin_route}/evaluation`, middleware.is_login, middleware.hasAdminPrivilege, evaluationRubric);
// ===== School Term Section =====
app.use(`${admin_route}/term`, middleware.is_login, middleware.hasAdminPrivilege, schoolTermRouter);
// ===== CourseMapping Section =====
app.use(`${admin_route}/courseMapping`, middleware.is_login, middleware.hasAdminPrivilege, courseMapping);

/**
 * API TO GET THE DATA FROM REQUEST
 */
app.use('/api', middleware.hasProfile, apiRoute);
// ====================================================

// 404 ERROR HANDLE
app.use("*", function (req, res) {
	res.render("notFound");
});

//Run the app
app.listen(port, function () { console.log(`Server ${port} is online!`); });
