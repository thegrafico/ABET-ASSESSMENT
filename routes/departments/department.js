var express = require('express');
var router = express.Router();



let base_url = '/department/' 
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
  res.render('departments/department',parms);
});

/* create Department home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('departments/createDepartment', parms);
});

/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
  res.render('departments/deleteDepartment', parms);
});

/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('departments/editDepartment', parms);
});

/* DETAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('departments/detailDepartment', parms);
});



module.exports = router;
