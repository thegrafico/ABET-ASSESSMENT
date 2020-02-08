/**
 * RAUL PICHARDO ROUTE
 */

var express = require('express');
var router = express.Router();
var query = require("../helpers/queries/outcomes_queries");
var general_queries = require("../helpers/queries/general_queries");


const base_url = '/outcomes/';

//Paramns to routes links
let parms = {
  "title": "ABET Assessment",
  "base_url": base_url
};

// =========================================== HOME OUTCOME =====================================
/* GET home page. */
router.get('/', function (req, res, next) {

  parms.results = null;
  parms.current_progName;
  
  let outcomes_table = "STUDY_PROGRAM";
  //Getting all the entries for the dropdown
  general_queries.get_table_info(outcomes_table, function (err, results) {

    //TODO: catch this error;
    if (err) throw err;
    parms.resultsDD = results;
    // console.log("OUTCOMES RESULTS: ", results);
    res.render('outcomes/outcomes', parms);
  });
});

/* POST HOME page */
router.post('/', function(req, res, next) {
  try{
    let studyProgram_table = 'STUDY_PROGRAM';
    //Get all perfCrit from the database (callback)
    general_queries.get_table_info(studyProgram_table, function (err, results) {

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
          "from": "STUDENT_OUTCOME",
          "where": "prog_ID",
          "id": req.body.prog_ID
        };

        general_queries.get_table_info_by_id(data, function (err, results) {

          console.log(data);
          console.log("RESULTS",results);
          parms.results = results;

          parms.current_progID = req.body.prog_ID;

          let data2 = {
            "from" : "STUDY_PROGRAM",
            "where": "prog_ID",
            "id"   : parms.current_progID
          };

          console.log(data);

          general_queries.get_table_info_by_id(data2, function (err, results) {

            parms.current_progName = results[0].prog_name;
            console.log(parms.current_progName);

            res.render('outcomes/outcomes', parms);
          });
        });
      }
    });
  }
  catch (error) {

    //TODO: send a error message to the user.
    console.log(error);
    res.render('outcomes/outcomes', parms);
  }
});

// =========================================== CREATE OUTCOME =====================================
/* GET */
router.get('/create', function (req, res, next) {
  let table = "STUDY_PROGRAM";
  general_queries.get_table_info(table, function (err, results) {
    parms.results = results;
    // console.log(parms);
    res.render('outcomes/createOutcomes', parms);
  });
});
/* POST */
router.post('/create', function (req, res, next) {
  // outc_ID, outc_name, outc_description, date_created, prog_ID
  console.log("CREATING AN OUTCOME");

  //TODO: Validate the data
  let data = [req.body.data.name, req.body.data.desc, req.body.data.std_prg];

  query.insert_outcome(data, function (err, results) {

    console.log("OUTCOME CREATED");
    res.redirect(base_url);
  });
});

// =========================================== DELETE OUTCOME =====================================
/* GET */
router.get('/:id/delete', function (req, res, next) {
  //TODO: verify id
  let data = {
    "from": "STUDENT_OUTCOME",
    "where": "outc_ID",
    "id": req.params.id
  };
  general_queries.get_table_info_by_id(data, function(err, results){
    //TODO: catch error
    if (err) throw err;

    //TODO: VERIFY IS EMPTY
    parms.results = results[0];

    res.render('outcomes/deleteOutcomes', parms);
  });
});
/* DELETE */
router.delete('/:id', function (req, res, next) {

  //TODO: validate
  let data = {
    "from": "STUDENT_OUTCOME",
    "where": "outc_ID",
    "id": req.params.id
  };
  general_queries.delete_record_by_id(data, function(err, results){
    //TODO: catch error
    if (err) throw err;

    //TODO: verify resutls
    // console.log("UPDATED: ", results);

    res.redirect(base_url);
  });
});

// =========================================== EDIT OUTCOME =====================================
/* EDIT home page. */
router.get('/:id/edit', function (req, res, next) {

  //TODO: validate variables
  let data = {
    "from": "STUDENT_OUTCOME",
    "where": "outc_ID",
    "id": req.params.id
  };
  general_queries.get_table_info_by_id(data, function (err, outcome_results) {
    //TODO: catch this error
    if (err) throw err;

    let table = "STUDY_PROGRAM";

    parms.results = outcome_results[0];
    parms.current_progID = outcome_results[0].prog_ID;

    general_queries.get_table_info(table, function (err, results) {
      //TODO: catch error
      if (err) throw err;

      //outcome data
      parms.std_prog = results;

      let data = {
        "from": "STUDY_PROGRAM",
        "where": "prog_ID",
        "id": parms.current_progID
      };

      general_queries.get_table_info_by_id(data, function (err, results) {

        console.log("HERE", data, results);
        parms.current_progName = results[0].prog_name;

        console.log(parms);
        res.render('outcomes/editOutcomes', parms);
      });
    });
  });
});
/* PUT */
router.put('/:id', function (req, res, next) {

  //TODO: validate variables
  let out_id = req.params.id;
  let data = [req.body.data.name, req.body.data.desc, req.body.data.std_prg, out_id];

  console.log(data);
  // console.log(req.body);
  query.update_outcome(data, function (err, results) {
    //TODO: catch error
    if (err) throw err;

    console.log("EDITED OUTCOME");
    res.redirect(base_url);
  });
});

// ============================DETAILS OUTCOME=======================
/* DETAILS home page. */
router.get('/details', function (req, res, next) {
  res.render('outcomes/detailOutcomes', parms);
});

module.exports = router;
