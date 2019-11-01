var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var conn = require("../helpers/mysqlConnection").mysql_pool; //pool connection

// Create dummy data module
var faker = require('faker');

/* GET home page. */
router.get('/', async function (req, res, next) {

  let parms = {
    title: 'ABET Assessment',
    active: {
      home: true
    }
  };

  // Create DUmmy data
  // insert_dummy_data()
  // insert_dummy_profile()

  // Getting user information from microsoft account
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  const userEmail = req.cookies.graph_user_email;
  console.log(userEmail )

  //Verify is there is user info
  if (accessToken && userName && userEmail) {
    parms.user = userName;
    parms.debug = `User: ${userName}\nEmail: ${userEmail}`;
    console.log(parms.debug)
    //TODO: user_data_profile have all the information that you need to keep working. 
    //Next step is to display the values. 

    //Compare user email in the DB, then get the data if there is any user. 
    user_data_profile = get_user_profile(userEmail).then("ERROR");
    console.log("DEBUG",user_data_profile)
    //Verify is not empty
    if (user_data_profile)
      set_profile_route_with_role(user_data_profile)
    else
      console.log("This user don't have a profile")

  }
  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/authorize/signout"
  res.render('index', parms);
});

// ================== Generate Route for using role ======================
async function set_profile_route_with_role(userData){
  // profile_Name
  console.log("setting up => ", userData)

}
// ================== VALIDATING USER ======================
async function get_user_profile(userEmail) {
  `This function return all user information if the user belong to a profile`
  if (userEmail) {
   console.log("IN FUNCTION get_user_profile", userEmail)

    //Look for the email in the DB,if there is one, get the profile data 
    let query = `SELECT * FROM
    (SELECT * FROM USER NATURAL JOIN USER_PROFILES WHERE USER.email = ?) as NT,
    PROFILE WHERE NT.profile_ID = PROFILE.profile_ID;`;

    //Run the query
    conn.query(query, [userEmail.toLowerCase()], function (error, results, fields) {

      //TODO: Catch this error properly
      if (error) throw error;

      console.log("USER PROFILE DATA => ", results)
      //Return user data
      return results;
    });
    return null;
  }else{
    console.log("Email is empty")
  }
  return null;
}
//================================ GENERATE DUMMY DAYA ====================
//FUNCTION TO GENERATE DUMMYS USERS
function insert_dummy_users() {
  let data = [];
  // inter_ID	first_name	last_name	email	phone_number	date_created

  for (let index = 0; index < 10; index++) {
    let firstname = faker.name.firstName();
    let lastname = faker.name.lastName();
    let email = faker.internet.email(); // Kassandra.Haley@erich.biz
    let number = faker.random.number({
      'min': 1000000000
    });
    let interid = 'G' + number;

    data.push([null, interid, firstname, lastname, email, number, null]);
  }

  let query = `INSERT INTO USER VALUES (?, ?, ? , ?, ?, ?, ?);`;
  data.forEach(element => {
    conn.query(query, element, function (error, results, fields) {

      //TODO: Catch this error properly
      if (error) throw error;

      console.log('Inserted!');
    });
  });
}

// GENERATE DOMMYS PROFILES
function insert_dummy_profile() {
  // profile_ID	profile_Name
  let query = `INSERT INTO PROFILE
               VALUES (?, ?);`;

  let data = [];
  let profileName = ['Profesor', 'Admin']

  profileName.forEach(e => {
    data.push([null, e]);
  });

  data.forEach(element => {
    conn.query(query, element, function (error, results, fields) {
      //TODO: Catch this error properly

      if (error) throw error;
      console.log('Inserted!');
    });
  });
}

module.exports = router;
