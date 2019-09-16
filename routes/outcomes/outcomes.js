var express = require('express');
var router = express.Router();


let base_url = '/outcomes/' 
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
  res.render('outcomes/outcomes', parms);
});

/* CREATE home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('outcomes/createOutcomes', parms);
});

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
