var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;

/* GET home page. */
router.get('/', function(req, res, next) {

  var parms = { title: 'ABET Assessment' };

  db.getConnection (function (err, connection){

    let userList = `Select *
                    From PROFILE`

    connection.query (userList,function (err,results,fields){

      parms.profile = results;

      res.render('users/createUsers', parms);
    })
    connection.release();
  })

});

module.exports = router;
