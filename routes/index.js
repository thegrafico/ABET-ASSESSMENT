var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var dummy = require("../helpers/dummy_functions");

//1 => profesor, 2 => admin route
var profile_route = {1: "professor", 2: "admin"};
let parms = {
  title: 'ABET Assessment',
  active: {
    home: true
  }
};

/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log("========================INDEX ROUTE===========================")


  // // Create Dummy data
  // dummy.insert_dummy_users()
  // dummy.insert_dummy_profile()
  // dummy.insert_new_user([ null, "G00473780", "Raul", "Pichardo Avalo", "RPICHARDO3780@INTERBAYAMON.EDU", "7873776957",null] )
  // email = "RPICHARDO3780@INTERBAYAMON.EDU"; // id = 11
  // dummy.set_profile_to_user(email, 1);
  dummy.update_user_profile(11, 1);

  // Getting user information from microsoft account
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  const userEmail = req.cookies.graph_user_email;

  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/signout";
  let view_route = 'home';

  //Verify is there is user info
  if (accessToken && userName && userEmail) {
    
    parms.user = userName;

    //Compare user email in the DB, then get the data if there is any user. 
    await dummy.get_user_profile(userEmail, function(err, result){
      if (err) throw err;

      console.log("PROFILE OF USER: ", result[0])
      let user_info = result[0];
      
      if (user_info && user_info.profile_ID){
        res.redirect(profile_route[user_info.profile_ID])
      }else{
        res.render(view_route, parms);
      }
      console.log("===================================================")
    });

  //By default, if there is not email, the user go to the home view
  }else{
    res.render(view_route, parms)
  }
});

router.get("/admin", function(req, res){
  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/signout";
  res.render("index", parms)
});


// TODO: hay que cambiar el render al view del profesor
router.get("/professor", function(req, res){
  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/signout";
  res.render("home", parms)
});

/* GET /authorize/signout */
router.get('/signout', function(req, res, next) {
  authHelper.clearCookies(res);

  console.log("USER SESSION WAS DELETED");
  // Redirect to home
  res.redirect('/');
});

module.exports = router;
