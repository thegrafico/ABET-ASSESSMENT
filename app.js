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
var editEvaluation   = require('./routes/evaluations/editEvaluation');

// ===== School Term Section =====
var schoolTermRouter = require('./routes/schoolTerms/schoolTerm');
var editSchoolTerm   = require('./routes/schoolTerms/editSchoolTerm');
var deleteSchoolTerm = require('./routes/schoolTerms/deleteSchoolTerm');
var createSchoolTerm = require('./routes/schoolTerms/createSchoolTerm');

// ===== Departments Section =====
var departmentRouter = require('./routes/departments/department');
var createDepartment = require('./routes/departments/createDepartment');
var deleteDepartment = require('./routes/departments/deleteDepartment');
var detailDepartment = require('./routes/departments/detailDepartment');
var editDepartment   = require('./routes/departments/editDepartment');

// ===== Study Programs Section =====
var studyProgramsRouter = require('./routes/studyPrograms/studyPrograms');
var createStudyPrograms = require('./routes/studyPrograms/createStudyPrograms');
var deleteStudyPrograms = require('./routes/studyPrograms/deleteStudyPrograms');
var detailStudyPrograms = require('./routes/studyPrograms/detailStudyPrograms');
var editStudyPrograms   = require('./routes/studyPrograms/editStudyPrograms');

// ===== Users Section =====
var usersRouter = require('./routes/users/users');
var createUsers = require('./routes/users/createUsers');
var deleteUsers = require('./routes/users/deleteUsers');
var editUsers   = require('./routes/users/editUsers');

// ===== Outcomes Section =====
var outcomesRouter = require('./routes/outcomes/outcomes');
var createOutcomes = require('./routes/outcomes/createOutcomes');
var deleteOutcomes = require('./routes/outcomes/deleteOutcomes');
var detailOutcomes = require('./routes/outcomes/detailOutcomes');
var editOutcomes   = require('./routes/outcomes/editOutcomes');

// ===== Courses Section =====
var coursesRouter  = require('./routes/courses/courses');
var createCourses  = require('./routes/courses/createCourses');
var deleteCourses  = require('./routes/courses/deleteCourses');
var detailsCourses = require('./routes/courses/detailsCourses');
var editCourses    = require('./routes/courses/editCourses');

// ===== Performance Criteria Section =====
// var perfCritRouter = require('./routes/performanceCriteria/performanceCriteria');
// var createPerfCrit = require('./routes/performanceCriteria/createPerfCrit');
// var deletePerfCrit = require('./routes/performanceCriteria/deletePerfCrit');
// var detailPerfCrit = require('./routes/performanceCriteria/detailPerfCrit');
// var editPerfCrit   = require('./routes/performanceCriteria/editPerfCrit');

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

// ===== Departments Section =====
app.use('/department', departmentRouter);
app.use('/createDepartment', createDepartment);
app.use('/deleteDepartment', deleteDepartment);
app.use('/detailDepartment', detailDepartment);
app.use('/editDepartment', editDepartment);

// ===== Study Programs Section =====
app.use('/studyPrograms', studyProgramsRouter);
app.use('/createStudyPrograms', createStudyPrograms);
app.use('/deleteStudyPrograms', deleteStudyPrograms);
app.use('/detailStudyPrograms', detailStudyPrograms);
app.use('/editStudyPrograms', editStudyPrograms);

// ===== Users Section =====
app.use('/users', usersRouter);
app.use('/createUsers', createUsers);
app.use('/deleteUsers', deleteUsers);
app.use('/editUsers', editUsers);

// ===== Outcomes Section =====
app.use('/outcomes', outcomesRouter);
app.use('/createOutcomes', createOutcomes);
app.use('/deleteOutcomes', deleteOutcomes);
app.use('/detailOutcomes', detailOutcomes);
app.use('/editOutcomes', editOutcomes);

// ===== Courses Section =====
app.use('/courses', coursesRouter);
app.use('/createCourses',createCourses);
app.use('/deleteCourses', deleteCourses);
app.use('/detailsCourses', detailsCourses);
app.use('/editCourses', editCourses);

// ===== Performance Criteria Section =====
// app.use('/performanceCriteria', perfCritRouter);
// app.use('/createPerfCrit', createPerfCrit);
// app.use('/deletePerfCrit', deletePerfCrit);
// app.use('/detailPerfCrit', detailPerfCrit);
// app.use('/editPerfCrit', editPerfCrit);

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
