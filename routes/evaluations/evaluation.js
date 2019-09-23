
//CARLOS

var express = require('express');
var router = express.Router();
var queries = require('../../helpers/queries/evaluation_queries');
var general_queries = require('../../helpers/queries/general_queries');
// var queries = require('../helpers/queries');

let base_url = '/evaluation/'
let routes_names = ['create', 'delete', 'edit']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});

// console.log("ROUTES", parms, "FINISH")

parms["title"] = 'ABET Assessment';


/* GET home page. */
router.get('/', function(req, res, next) {
  try{

    let evaluation_table = 'EVALUATION_RUBRIC';

    //Get all perfCrit from the database (callback)
    general_queries.get_table_info(evaluation_table, function (err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAS TO REDIRECT the user or send a error message
        throw err;
      }

      //IF found results from the database
      if (results) {
        // console.log(results)
        parms.results = results;
      }

      res.render('evaluations/evaluation', parms);
    });
  }
  catch (error) {

    //TODO: send a error message to the user.
    console.log(error);
    res.render('evaluations/evaluation', parms);
  }
});

/* Create home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  try{






    res.render('evaluations/createEvaluation', parms);
  }
  catch (error) {
    //TODO: send a error message to the user.
    console.log(error);
    res.render('evaluations/createEvaluation', parms);
  }
});




/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
  res.render('evaluations/deleteEvaluation', parms);
});


/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('evaluations/editEvaluation', parms);
});

module.exports = router;
