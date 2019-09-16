var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;

/* GET home page. */
router.get('/', function (req, res, next) {

  var parms = {
    title: 'ABET Assessment'
  };

  db.getConnection(function (err, connection) {

    let userList = `Select *
                    From USER natural join USER_PROFILES natural join PROFILE`

    connection.query(userList, function (err, results, fields) {

      // console.log(results);
      parms.results = results;

      res.render('users/users', parms);

    })
    connection.release();
  })

  router.post('/', function (req, res) {
    var parms = {
      title: 'ABET Assessment'
    };

    if (req.body.deleteButton != undefined) {

      db.getConnection(function (err, connection) {

        let findUser = `Select *
                        From USER
                        where user_ID = ${req.body.deleteButton}`;

        connection.query(findUser, function (err, results, fields) {

          console.log(results);

          parms.userID = results[0].user_ID;
          parms.interID = results[0].inter_ID;
          parms.fName = results[0].first_name;
          parms.lName = results[0].last_name;
          parms.email = results[0].email;
          parms.pNumber = results[0].phone_number;
          parms.date = results[0].date_created;

          res.render('users/deleteUsers', parms);
        })
        connection.release();
      })
    } else if (req.body.finalDeletebutton != undefined) {

      db.getConnection(function (err, connection) {

        let deleteUser = `DELETE
                          FROM USER
                          WHERE user_ID = ${req.body.finalDeletebutton};`;

        connection.query(deleteUser, function (err, results, fields) {})

        connection.release();
        res.redirect('/users');
      })
    } else {
      res.redirect('/users');
    }
  })
});

module.exports = router;
