var express = require('express');
var router = express.Router();


let base_url = '/schoolTerm/' 
let routes_names = ['create', 'delete', 'edit']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});
parms["title"] = 'ABET Assessment'; 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('schoolTerms/schoolTerm', parms);
});


/* CREATE home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('schoolTerms/createSchoolTerm', parms);
});

/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
  res.render('schoolTerms/deleteSchoolTerm', parms);
});

/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('schoolTerms/editSchoolTerm', parms);
});

module.exports = router;
