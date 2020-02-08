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

  // // Create Dummy data
  // dummy.insert_dummy_users()
  // dummy.insert_dummy_profile()
  // dummy.insert_new_user([ null, "G00473780", "Raul", "Pichardo Avalo", "RPICHARDO3780@INTERBAYAMON.EDU", "7873776957",null] )
  // email = "RPICHARDO3780@INTERBAYAMON.EDU"; // id = 11
  // dummy.set_profile_to_user(email, 1);
  // dummy.update_user_profile(11,2);

  // Getting user information from microsoft account
  const accessToken = await authHelper.getAccessToken(req.cookies, res);

  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/signout";
  let view_route = 'home';

  // //Verify is there is user info
  // if (userName && userEmail) {
    
  //   parms.user = userName;

    res.render(view_route, parms);

  // //By default, if there is not email, the user go to the home view
  // }else{
  //   res.render(view_route, parms)
  // }
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
