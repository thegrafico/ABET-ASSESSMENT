var express = require('express');
var router = express.Router();

let base_url = '/courses/' 
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});

// console.log(parms)

// title is the same in all of the routes
parms["title"] = 'ABET Assessment'; 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('courses/indexCourses', parms);
});


/* GET createCourse page. */
router.get('/create', function(req, res, next) {
  res.render('courses/createCourses', parms);
});


/* GET delete page. */
router.get('/deleteCourses', function(req, res, next) {
  res.render('courses/deleteCourses', parms);
});


/* GET DetailsCourse page. */
router.get('/detailsCourses', function(req, res, next) {
  res.render('courses/detailsCourses',parms);
});

/* Edit Course page. */
router.get('/editCourses', function(req, res, next) {
  res.render('courses/editCourses', parms);
});


module.exports = router;
