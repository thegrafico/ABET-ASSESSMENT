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

router.post ('/', function (req, res){
  var parms = { title: 'ABET Assessment' };

  console.log(req.body);
  var interID = req.body.interID;
  var name = req.body.name;
  var lName = req.body.lName;
  var email = req.body.email;
  var pNumber = req.body.pNumber;
  var profile_Name = req.body.profile_Name;

  db.getConnection (function (err, connection){

    let addUser = `insert into USER (inter_ID, first_name, last_name, email, phone_number)
    values( '${interID}', '${name}', '${lName}', '${email}', '${pNumber}');`

    connection.query (addUser,function (err,results,fields){

      let findUser = `Select user_ID
                      From USER
                      where inter_ID = '${interID}'`

        connection.query (findUser,function (err,results,fields){

          var userID = results[0].user_ID;

          let findProfile = `Select profile_ID
                            From PROFILE
                            WHERE profile_Name = '${profile_Name}'`;

          connection.query (findProfile,function (err,results,fields){

            var profileID = results[0].profile_ID;

            let setProfile = `insert into USER_PROFILES
                              values( ${userID}, ${profileID})`

            connection.query (setProfile,function (err,results,fields){

              let userList = `Select *
                              From PROFILE`

              connection.query (userList,function (err,results,fields){

                parms.profile = results;

                res.render('users/createUsers', parms);
              });
            });
          });
        });
      });
    connection.release();
  });
});
module.exports = router;
