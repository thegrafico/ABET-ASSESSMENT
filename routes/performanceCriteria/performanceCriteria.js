var express = require('express');
var router = express.Router();

let base_url = '/performanceCriteria/' 
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});

parms["title"] = 'ABET Assessment'; 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('performanceCriteria/performanceCriteria', parms);
});

/* CREATE home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('performanceCriteria/createPerfCrit', parms);
});

/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
  res.render('performanceCriteria/deletePerfCrit', parms);
});


/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('performanceCriteria/editPerfCrit', parms);
});

/* DETAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('performanceCriteria/detailPerfCrit', parms);
});

module.exports = router;
