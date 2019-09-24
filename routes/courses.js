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

  query.get_course_info(course_table, function(err, results){
    //TODO: handle error
    if (err) throw err;

    parms.results = results;
    res.render('courses/indexCourses', parms);
  });
});

//================================ CREATE STUDY PROGRAM  =================================
/* CREATE home page. */
router.get('/create', function(req, res, next) {
  let deparment_table = "STUDY_PROGRAM";
  general_queries.get_table_info(deparment_table, function(err, resutls){

    //TODO: handle this err;
    if(err)throw err;

    parms.results = resutls;
    res.render('courses/createCourses', parms);
  });
});

router.post('/create', function(req, res, next) {

  // dep_ID, dep_name, dep_description


  //TODO: verify values, null, undefined
  let data = req.body.data;

	//Insert into the DB the data from user
	query.insert_into_course([data.crnumber,data.crname, dta.crdesc, data.prog_id], function(err, results){

		//TODO: catch error properly
		if (err) throw err;

		// console.log("STUDY PROGRAMN INSERTED WITH THE ID: ", results.insertId);

		res.redirect(base_url);
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
