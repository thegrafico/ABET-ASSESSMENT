var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;


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

module.exports = router;
