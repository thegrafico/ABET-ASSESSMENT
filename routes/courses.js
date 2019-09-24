var express = require('express');
var query = require("../helpers/queries/course_queries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();


let base_url = '/courses/'
let parms = {"title":'ABET Assessment', "base_url":base_url  };

//================================ HOME PAGE =================================
/* GET home page. */
router.get('/', function(req, res, next) {

  let course_table = 'COURSE';

  course_queries.get_course_info(course_table, function(err, results){
    //TODO: handle error
    if (err) throw err;

    parms.results = results;
    res.render('courses/indexCourses', parms);
  });
});







module.exports = router;

// //Paramns to routes links
// let parms = {};
//
// //Populate parms
// routes_names.forEach(e=>{
//   parms[e] = base_url + e;
// });
//
// // console.log(parms)
//
// // title is the same in all of the routes
// parms["title"] = 'ABET Assessment';
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//
//   var parms = { title: 'ABET Assessment' };
//
//   db.getConnection (function (err, connection){
//
//     let courseList = `Select *
//                     From COURSE natural join PROG_COURSE`
//
//     connection.query (courseList,function (err,results,fields){
//
//       // console.log(results);
//       parms.results = results;
//
//       res.render('courses/indexCourses', parms);
//
//     })
//     connection.release();
//   })
//
// });
//
//
// /* DELETE page. */
// router.get('/deleteCourses', function(req, res, next) {
//   res.render('courses/deleteCourses', parms);
// });
//
//
// /* DetailsCourse page. */
// router.get('/detailsCourses', function(req, res, next) {
//   res.render('courses/detailsCourses',parms);
// });
//
// /* Edit Course page. */
// router.get('/editCourses', function(req, res, next) {
//   res.render('courses/editCourses', parms);
// });
//
//
// module.exports = router;
