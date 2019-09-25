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

//================================ CREATE COURSE  =================================
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


  //TODO: verify values, null, undefined
  let data = req.body.data;

	//Insert into the DB the data from user
	query.insert_into_course([data.crnumber,data.crname, data.crdesc, data.prog_id], function(err, results){
		//TODO: catch error properly
    // console.log("HERE", prog_id);
		if (err) throw err;


		res.redirect(base_url);



	});
});

//==================================== REMOVE COURSE =================================
/* REMOVE STUDY PROGRAM ROUTE */
router.get('/:id/remove', function (req, res) {
  console.log("REMOVE ROUTE");

  //TODO: catch error in case there is not id
  let course_id = req.params.id;
  let course_table = "COURSE";
  let where_attr = "course_ID";
  let data = {"from": course_table,"where":where_attr, "id":course_id};
  general_queries.get_table_info_by_id(data, function(err, results){

    //TODO: catch erro
    if (err) throw err;
    try {
      parms.course_ID = results[0].course_ID;
      parms.course_name = results[0].course_name;
      parms.course_description = results[0].course_description;
      parms.date_created = results[0].date_created;
      res.render('courses/deleteCourses', parms);
    } catch (error) {
      res.redirect(base_url);
    }
  });
});
/* DELETE ROUTE */
router.delete('/:id', function (req, res) {
  console.log("===================DELETED ROUTE=====================");

  //TODO: catch error in case of null
  let course_id = req.params.id;
  let table_name = "COURSE";
  let where_attr = "course_ID";

  let data = {"id":course_id, "from":table_name,"where":where_attr };

  general_queries.delete_record_by_id(data, function (err, results) {

    //TODO: catch error
    if (err) {
      throw err;
    }
    console.log("===================DELETED ROUTE=====================");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect("back");
  });
});

//========================================== EDIT ROUTE =====================================
/* EDIT home page. */
router.get('/:id/edit', function(req, res, next) {
  let table_name = "COURSE";
  let id_course = req.params.id;
  let where_atr = "course_ID";

  let data = {"from":table_name, "where":where_atr, "id": id_course};
  general_queries.get_table_info_by_id(data, function(err, user_results){

    //TODO: handle this err;
    if(err)throw err;

    let prog_table = "STUDY_PROGRAM";

    general_queries.get_table_info(prog_table, function(error, resutls){

      //TODO: handle this err;
      if(error)throw error;

      parms.course_ID = id_course;
      parms.std_results = resutls;
      parms.user_results = user_results[0];


      console.log("EDIT RESULTS: ", parms);
      res.render('courses/editCourses', parms);
    });
  });
});

/* EDIT home page. */
router.put('/:id', function(req, res, next) {

  //TODO: verify values befero enter to DB
  let name = req.body.data.crname;
  let course_id = req.params.course_id;
  let prog_id =  req.body.data.prog_id;
  let course_desc = req.body.data.crdesc;
  let course_number = req.body.data.crnumber;

  //TIENE QUE IR EN ESTE ORDEN.
  let data = [name, prog_id, course_desc, course_number, course_id];

  query.update_course(data, function(err, results){

    //TODO: cath this error
    if (err) throw err;

    console.log("EDITED STUDY PROGRAM");
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
