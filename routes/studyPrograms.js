var express = require('express');
var query = require("../helpers/queries/studyProgramQueries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();


const base_url = '/studyPrograms/'
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});

parms["title"] = 'ABET Assessment';

//================================ HOME PAGE =================================
/* GET home page. */
router.get('/', function(req, res, next) {

  parms.results = null;
  parms.current_depID = null;

  let dep_table = 'DEPARTMENT';

  general_queries.get_table_info(dep_table, function(err, results){
    //TODO: handle error
    if (err) throw err;

    // console.log("HOME STUDY PROGRAM: ", results);

    parms.resultsDD = results;
    res.render('studyPrograms/studyPrograms', parms);
  });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  try{

    let dep_table = 'DEPARTMENT';

    //Get all perfCrit from the database (callback)
    general_queries.get_table_info(dep_table, function (err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAS TO REDIRECT the user or send a error message
        throw err;
      }

      //IF found results from the database
      if (results) {
        // console.log(results)
        parms.resultsDD = results;

        let data = {
          "from": "STUDY_PROGRAM",
          "where": "dep_ID",
          "id": req.body.dep_ID
        };

        general_queries.get_table_info_by_id(data, function (err, results) {

          console.log(data);
          console.log(results);
          parms.results = results;

          parms.current_depID = req.body.dep_ID;

          let data2 = {
            "from" : "DEPARTMENT",
            "where": "dep_ID",
            "id"   : parms.current_depID
          };

          console.log(data);

          general_queries.get_table_info_by_id(data2, function (err, results) {

            parms.current_depName = results[0].dep_name;

            res.render('studyPrograms/studyPrograms', parms);
          });
        });
      }
    });
  }
  catch (error) {

    //TODO: send a error message to the user.
    console.log(error);
    res.render('studyPrograms/studyPrograms', parms);
  }
});

//================================ CREATE STUDY PROGRAM  =================================
/* CREATE home page. */
router.get('/create', function(req, res, next) {
  let deparment_table = "DEPARTMENT";
  general_queries.get_table_info(deparment_table, function(err, resutls){

    //TODO: handle this err;
    if(err)throw err;

    parms.results = resutls;
    res.render('studyPrograms/createStudyPrograms', parms);
  });
});

router.post('/create', function(req, res, next) {

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
  let data = {"from": stud_table,"where":where_attr, "id":stud_id};
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

  let data = {"id":std_id, "from":table_name,"where":where_attr };

  general_queries.delete_record_by_id(data, function (err, results) {

    //TODO: catch error
    if (err) {
      throw err;
    }
    console.log("STUDY PROGRAM DELETED")
    console.log("===================DELETED ROUTE=====================");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect("back");
  });
});
//========================================== EDIT ROUTE =====================================
/* EDIT home page. */
router.get('/:id/edit', function(req, res, next) {
  let table_name = "STUDY_PROGRAM";
  let id_stp = req.params.id;
  let where_atr = "prog_ID";

  let data = {"from":table_name, "where":where_atr, "id": id_stp};
  general_queries.get_table_info_by_id(data, function(err, user_results){

    //TODO: handle this err;
    if(err)throw err;

    let deparment_table = "DEPARTMENT";

    general_queries.get_table_info(deparment_table, function(error, resutls){

      //TODO: handle this err;
      if(error)throw error;

      parms.prog_ID = id_stp;
      parms.dpt_results = resutls;
      parms.user_results = user_results[0];
      parms.current_deptID = user_results[0].dep_ID;

      // console.log("EDIT RESULTS: ", parms);

      let data = {
        "from": "DEPARTMENT",
        "where": "dep_ID",
        "id": parms.current_deptID
      };

      general_queries.get_table_info_by_id(data, function(err, results){

        parms.current_deptName = results[0].dep_name;

        res.render('studyPrograms/editStudyPrograms', parms);
      });
    });
  });
});

/* EDIT home page. */
router.put('/:id', function(req, res, next) {

  //TODO: verify values befero enter to DB
  let name = req.body.data.cname;
  let std_id = req.params.id;
  let dept_id =  req.body.data.dept_id;

  //TIENE QUE IR EN ESTE ORDEN.
  let data = [name, dept_id, std_id];

  query.update_study_program(data, function(err, results){

    //TODO: cath this error
    if (err) throw err;

    console.log("EDITED STUDY PROGRAM");
    res.redirect(base_url);
  });
});

//========================================== DETAILS ROUTE =====================================
/* DEtAILS home page. */
router.get('/details', function(req, res, next) {
  res.render('studyPrograms/detailStudyPrograms', parms);
});

module.exports = router;
