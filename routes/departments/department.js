var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;

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

  db.getConnection (function (err, connection){

    let courseList = `Select *
                      From DEPARTMENT`

    connection.query (courseList,function (err,results,fields){

      // console.log(results);
      parms.results = results;

      res.render('departments/department', parms);

    })
    connection.release();
  })
});

/* create Department home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  res.render('departments/createDepartment', parms);
});

router.post('/' + routes_names[0], function(req, res, next) {
  var depName = req.body.depName;
  var depDesc = req.body.depDesc;

  console.log(req.body.depName);

  db.getConnection (function (err, connection){

    let addDep = `insert into DEPARTMENT (dep_name, dep_description)
    values( '${depName}', '${depDesc}');`

    connection.query (addDep,function (err,results,fields){
    res.render('departments/createDepartment', parms);
    });
    connection.release();
  });
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
