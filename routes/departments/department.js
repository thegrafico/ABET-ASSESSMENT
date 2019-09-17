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
router.get('/:id/' + routes_names[1], function(req, res, next) {

  let findDep = `Select *
                From DEPARTMENT
                where dep_ID = ${req.params.id};`

  db.getConnection (function (err, connection){
    connection.query (findDep,function (err,results,fields){
      parms.dep_ID = results[0].dep_ID;
      parms.depName = results[0].dep_name;
      parms.depDesc = results[0].dep_description;
      parms.depDate = results[0].date_created;

      res.render('departments/deleteDepartment', parms);
    });
    connection.release();
  });
});

router.post('/:id/' + routes_names[2], function(req, res, next) {

  let deleteDep = `DELETE
                  FROM DEPARTMENT
                  WHERE dep_ID = ${req.params.id};`

  db.getConnection (function (err, connection){
    connection.query (deleteDep,function (err,results,fields){
    });
    res.redirect('/department');
    connection.release();
  });
});

/* EDIT home page. */
router.get('/:id/' + routes_names[2], function(req, res, next) {

  let findDep = `Select *
                From DEPARTMENT
                where dep_ID = ${req.params.id};`

  db.getConnection (function (err, connection){
    connection.query (findDep,function (err,results,fields){
      parms.dep_ID = results[0].dep_ID;
      parms.depName = results[0].dep_name;
      parms.depDesc = results[0].dep_description;

      res.render('departments/editDepartment', parms);
    });
    connection.release();
  });
});

router.post('/:id/' + routes_names[2], function(req, res, next) {

  let updateDep = `update DEPARTMENT
                   set dep_name= '${req.body.depName}', dep_description= '${req.body.depDesc}'
                   where dep_ID= ${req.params.id}`

  db.getConnection (function (err, connection){
    connection.query (updateDep,function (err,results,fields){
    });
    res.redirect('/department');
    connection.release();
  });
});

/* DETAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('departments/detailDepartment', parms);
});



module.exports = router;
