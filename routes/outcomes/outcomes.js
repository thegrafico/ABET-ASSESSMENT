/**
 * RAUL PICHARDO ROUT
 */

var express = require('express');
var router = express.Router();
var query = require("../../helpers/queries/department_queries");
var general_queries = require("../../helpers/queries/general_queries");


let base_url = '/outcomes/' 
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});
parms["title"] = 'ABET Assessment'; 
parms["base_url"] = base_url; 


/* GET home page. */
router.get('/', function(req, res, next) {
  let outcomes_table = "STUDENT_OUTCOME";
  //Getting the table
  general_queries.get_table_info(outcomes_table, function(err, results){
    
    console.log("OUTCOMES RESULTS: ", results);

    res.render('outcomes/outcomes', parms);
  });

});

// ============================CREATE OUTCOME=======================
/* CREATE home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('outcomes/createOutcomes', parms);
});

router.post('/' + routes_names[0], function(req, res, next) {
  console.log("CREATING AN OUTCOME");
  console.log(req.body);
  res.redirect(base_url);
});


// ============================CREATE OUTCOME=======================


/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
  res.render('outcomes/deleteOutcomes', parms);
});

/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('outcomes/editOutcomes', parms);
});

/* DETAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('outcomes/detailOutcomes', parms);
});


module.exports = router;
