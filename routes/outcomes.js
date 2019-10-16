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
  let outcomes_table = "STUDENT_OUTCOME";
  //Getting the table
  general_queries.get_table_info(outcomes_table, function (err, results) {

    //TODO: catch this error;
    if (err) throw err;
    parms.results = results;
    // console.log("OUTCOMES RESULTS: ", results);
    res.render('outcomes/outcomes', parms);
  });
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

    general_queries.get_table_info(table, function (err, results) {
      //TODO: catch error
      if (err) throw err;

      //outcome data
      parms.std_prog = results;

      console.log(parms);
      res.render('outcomes/editOutcomes', parms);
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
