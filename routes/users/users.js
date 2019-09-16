var express = require('express');
var router = express.Router();
var conn = require("../../helpers/mysqlConnection").mysql_pool;

var queries = require('../../helpers/queries');


var parms = {
  title: 'ABET Assessment'
};

/* GET home page. */
router.get('/', function (req, res, next) {
  try {
    queries.get_user_list(function(err, results){
      //TODO: redirect user to another page
      if (err) throw err;

      console.log(results);

      if (results){
        // console.log(results)
        parms.results = results;
      }
      res.render('users/users', parms);
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/', function (req, res) {
  if (req.body.deleteButton != undefined) {

    let findUser = `Select *
                    From USER
                    where user_ID = ${req.body.deleteButton}`;

    conn.query(findUser, function (err, results, fields) {
      //TODO: catch error
      // console.log(results);

      parms.userID = results[0].user_ID;
      parms.interID = results[0].inter_ID;
      parms.fName = results[0].first_name;
      parms.lName = results[0].last_name;
      parms.email = results[0].email;
      parms.pNumber = results[0].phone_number;
      parms.date = results[0].date_created;

      res.render('users/deleteUsers', parms);
    });
      
  }else if (req.body.finalDeletebutton != undefined) {

    let deleteUser = `DELETE
                      FROM USER
                      WHERE user_ID = ${req.body.finalDeletebutton};`;
                  
    conn.query(deleteUser, function (err, results, fields) {});

    res.redirect('/users');
  }else {
      res.redirect('/users');
    }
});

module.exports = router;
