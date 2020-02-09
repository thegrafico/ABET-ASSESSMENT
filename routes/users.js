/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
var queries = require('../helpers/queries/user_queries');
var authHelper = require('../helpers/auth');

// DB conn
var { db } = require("../helpers/mysqlConnection"); //pool connection
var conn = db.mysql_pool;

var parms = {
  title: 'ABET Assessment',
  subtitle: 'Users',
  signInUrl: authHelper.getAuthUrl(),
};

/*
 GET /users
*/
router.get('/', async function (req, res) {

	//Get all user from the database (callback)
	let list_of_users = await queries.get_user_list().catch( (err) =>{
		// TODO: flash message with error
		console.log("THERE IS AN ERROR: ", err);
	});

	//IF found results from the database
	if (list_of_users != undefined && list_of_users.length > 0)
		parms.results = list_of_users;
	else
		parms.results = [];

	res.render('users/users', parms);
});

/* 
 *GET /users/createUsers (redundancia, deberia ser /user/create)
*/
router.get('/create', async function (req, res) {

	// store all profiles
	parms.profiles = [];

	// get all profiles
	let profiles  = await queries.get_all_profiles().catch((err) =>{
		console.log("There is an error: ", err);
	})

	// verify if profiles 
	if (profiles != undefined && profiles.length > 0){
		parms.profiles = profiles;
	}

	res.render('users/create', parms);
});

/*
 POST /users/create
*/
router.post('/create', async function (req, res) {
	
	// insert user using promise
	queries.insert_user(req.body);

	res.redirect('/users');
});

/*
 GET /users/:id/edit
*/
router.get('/:id/edit', function (req, res) {

  //TODO: catch error in case there is not id
  let user_id = req.params.id;

  queries.get_user_by_id(user_id, function (err, results) {
	parms.interID = results[0].inter_ID;
	parms.fName = results[0].first_name;
	parms.lName = results[0].last_name;
	parms.email = results[0].email;
	parms.pNumber = results[0].phone_number;
	parms.userID = req.params.id;
	// console.log(req.body.editButton);
	res.render('users/editUsers', parms);
  });
});

/* PUT */
router.put('/:id', function (req, res) {

  //TODO: Validate data before sending to the database
  let user_data_to_update = req.body.data;

  queries.update_user(user_data_to_update, function (err, results) {
	if (err) {
	  //TODO: catch error
	  throw err;
	}
	console.log("User update")
	res.redirect("/users");
  });
});
//==================================== REMOVE USER ROUTE =================================
/* REMOVE USER ROUTE */
router.get('/:id/remove', function (req, res) {
  console.log("REMOVE ROUTE");

  //TODO: catch error in case there is not id
  let user_id = req.params.id;

  queries.get_user_by_id(user_id, function (err, results) {
	parms.interID = results[0].inter_ID;
	parms.fName = results[0].first_name;
	parms.lName = results[0].last_name;
	parms.email = results[0].email;
	parms.pNumber = results[0].phone_number;
	parms.userID = req.params.id;
	res.render('users/deleteUsers', parms);
  });
});
/* DELETE ROUTE */
router.delete('/:id', function (req, res) {
  console.log("===================DELETED ROUTE=====================");

  //TODO: catch error in case of null
  let user_id = req.params.id;

  queries.delete_user_by_id(user_id, function (err, results) {

	//TODO: catch error
	if (err) {
	  throw err;
	}
	console.log("USER DELETED")
	console.log("===================DELETED ROUTE=====================");
	res.redirect("/users");
  });
});
//===============================================================================

module.exports = router;
