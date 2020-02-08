var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var dummy = require("../helpers/dummy_functions");
var middleware = require("../middleware/validateUser");
var conn = require("../helpers/mysqlConnection").mysql_pool; //pool connection


/* 
  - CODE 
    1: Profesor
    2: Admin
    5: testing
*/
var profile_route = {1: "professorReport/chooseCourseTerm", 2: "index", 5: "profiles/editProfiles"};
let parms = {
  title: 'ABET Assessment',
  active: {
    home: true
  }
};

/* GET home page. */
router.get('/', async function (req, res) {
  console.log("========================INDEX ROUTE===========================")

  // Getting user information from microsoft account
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  const userEmail = req.cookies.graph_user_email;
  // console.log("DEBUG:", accessToken,userName, userEmail )

  //Verify is there is user info
  if (accessToken && userName && userEmail) {
    parms.user = userName;

    //TODO: user_data_profile have all the information that you need to keep working. 
    //Next step is to display the values. 

    //Compare user email in the DB, then get the data if there is any user. 
    user_data_profile = get_user_profile(userEmail)

    //Verify is not empty
    if (user_data_profile)
      console.log(user_data_profile)
    else
      console.log("This user don't have a profile")

  }
  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/authorize/signout"
  res.render('index', parms);

});

router.get("/auth", middleware.get_user_role, async function(req, res){

  console.log("COOKIES OF THE USER: ", req.session.x)

  res.redirect("/");
});

router.get("/login", function(req, res){
  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/signout";
  res.render("home", parms);
});

/* GET /authorize/signout */
router.get('/signout', function(req, res, next) {
  authHelper.clearCookies(res);

  console.log("USER SESSION WAS DELETED");

  // Redirect to home
  res.redirect('/');
});

module.exports = router;
