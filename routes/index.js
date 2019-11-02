var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var dummy = require("../helpers/dummy_functions");
// var conn = require("../helpers/mysqlConnection").mysql_pool; //pool connection
// var USER_QUERIES = require("../helpers/queries/user_queries");

// Create dummy data module
var faker = require('faker');

/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log("========================INDEX ROUTE===========================")
  let parms = {
    title: 'ABET Assessment',
    active: {
      home: true
    }
  };

  // // Create Dummy data
  // dummy.insert_dummy_users()
  // dummy.insert_dummy_profile()
  // dummy.insert_new_user([ null, "G00473780", "Raul", "Pichardo Avalo", "RPICHARDO3780@INTERBAYAMON.EDU", "7873776957",null] )
  email = "RPICHARDO3780@INTERBAYAMON.EDU"; // id = 11
  // dummy.set_profile_to_user(email, 1);
  // dummy.update_user_profile(11, 2);

  // Getting user information from microsoft account
  const accessToken = await authHelper.getAccessToken(req.cookies, res) || true;
  const userName = req.cookies.graph_user_name || "Raul Pichardo Avalo";
  const userEmail = req.cookies.graph_user_email || email;

  //Verify is there is user info
  if (accessToken && userName && userEmail) {
    
    parms.user = userName;

    //Compare user email in the DB, then get the data if there is any user. 
    await dummy.get_user_profile(userEmail, function(err, result){
      if (err) throw err;

      console.log("PROFILE OF USER: ", result[0])
      
      parms.signInUrl = authHelper.getAuthUrl();
      parms.singOutUrl = "/authorize/signout"
      console.log("===================================================")

      res.render('index', parms);
    });
  }
});

module.exports = router;
