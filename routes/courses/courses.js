var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;


let base_url = '/courses/' 
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});

// console.log(parms)

// title is the same in all of the routes
parms["title"] = 'ABET Assessment'; 

/* GET home page. */
router.get('/', function(req, res, next) {

  var parms = { title: 'ABET Assessment' };

  db.getConnection (function (err, connection){

    let courseList = `Select *
                    From COURSE natural join PROG_COURSE`

    connection.query (courseList,function (err,results,fields){

      // console.log(results);
      parms.results = results;

      res.render('courses/indexCourses', parms);

    })
    connection.release();
  })

});


/* DELETE page. */
router.get('/deleteCourses', function(req, res, next) {
  res.render('courses/deleteCourses', parms);
});


/* DetailsCourse page. */
router.get('/detailsCourses', function(req, res, next) {
  res.render('courses/detailsCourses',parms);
});

/* Edit Course page. */
router.get('/editCourses', function(req, res, next) {
  res.render('courses/editCourses', parms);
});


module.exports = router;
