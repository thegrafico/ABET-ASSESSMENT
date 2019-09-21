var express = require('express');
var query = require("../helpers/queries/studyProgramQueries");
var general_queries = require("../helpers/queries/general_queries");

var router = express.Router();


let base_url = '/studyPrograms/' 
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});
parms["title"] = 'ABET Assessment'; 
parms.base_url = base_url;

//================================ HOME PAGE =================================
/* GET home page. */
router.get('/', function(req, res, next) {

  let stu_prog_table = 'STUDY_PROGRAM';

  general_queries.get_table_info(stu_prog_table, function(err, results){
    //TODO: handle error
    if (err) throw err;

    // console.log("HOME STUDY PROGRAM: ", results);

    parms.results = results;
    res.render('studyPrograms/studyPrograms', parms);
  });
});

//================================ CREATE STUDY PROGRAM  =================================
/* CREATE home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  let deparment_table = "DEPARTMENT";
  general_queries.get_table_info(deparment_table, function(err, resutls){
    
    //TODO: handle this err;
    if(err)throw err;
    
    parms.results = resutls;
    res.render('studyPrograms/createStudyPrograms', parms);
  });
});

router.post('/' + routes_names[0], function(req, res, next) {

  // dep_ID, dep_name, dep_description


  //TODO: verify values, null, undefined
  let data = req.body.data;

	//Insert into the DB the data from user
	query.insert_into_study_program([data.cname, data.dept_id], function(err, results){

		//TODO: catch error properly
		if (err) throw err;

		// console.log("STUDY PROGRAMN INSERTED WITH THE ID: ", results.insertId);

		res.redirect(base_url);
	});
});

//==================================== REMOVE STUDY PROGRAM ROUTE =================================
/* REMOVE STUDY PROGRAM ROUTE */
router.get('/:id/remove', function (req, res) {
  console.log("REMOVE ROUTE");

  //TODO: catch error in case there is not id
  let stud_id = req.params.id;
  let stud_table = "STUDY_PROGRAM";
  let where_attr = "prog_ID";
  let data = {"table_name": stud_table,"atribute":where_attr, "id":stud_id};
  general_queries.get_table_info_by_id(data, function(err, results){

    //TODO: catch erro
    if (err) throw err;
    try {
      parms.prog_ID = results[0].prog_ID;
      parms.prog_name = results[0].prog_name;
      parms.date_created = results[0].date_created;
      res.render('studyPrograms/deleteStudyPrograms', parms);
    } catch (error) {
      res.redirect(base_url);
    }
  });      
});
/* DELETE ROUTE */
router.delete('/:id', function (req, res) {
  console.log("===================DELETED ROUTE=====================");

  //TODO: catch error in case of null
  let std_id = req.params.id;
  let table_name = "STUDY_PROGRAM";
  let where_attr = "prog_ID";

  let data = {"id":std_id, "table_name":table_name,"atribute":where_attr };

  general_queries.delete_record_by_id(data, function (err, results) {

    //TODO: catch error
    if (err) {
      throw err;
    }
    console.log("STUDY PROGRAM DELETED")
    console.log("===================DELETED ROUTE=====================");
    
    res.redirect(base_url);
  });
});
//===============================================================================

/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
});

/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('studyPrograms/editStudyPrograms', parms);
});

/* DEtAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('studyPrograms/detailStudyPrograms', parms);
});

module.exports = router;
