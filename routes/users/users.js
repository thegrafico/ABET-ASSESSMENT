var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;

/* GET home page. */
router.get('/', function(req, res, next) {

  var parms = { title: 'ABET Assessment' };

  db.getConnection (function (err, connection){

    let userList = `Select *
                    From USER natural join USER_PROFILES natural join PROFILE`

    connection.query (userList,function (err,results,fields){

      // console.log(results);
      parms.results = results;

      res.render('users/users', parms);

    })
    connection.release();
  })





});

module.exports = router;
