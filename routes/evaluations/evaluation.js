var express = require('express');
var router = express.Router();

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
  res.render('evaluations/evaluation', parms);
});

/* Create home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('evaluations/createEvaluation', parms);
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
