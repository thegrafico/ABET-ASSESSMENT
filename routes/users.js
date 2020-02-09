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
router.get('/:id/edit', async function (req, res) {

  	//TODO: catch error in case there is not id
	let user_id = req.params.id;

	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) =>{
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined ||  user_data.length < 1){
		return res.send("ERROR GETTING THE USER INFO");
	}

	// set info of the user for frontend
	parms.interID = user_data.inter_ID;
	parms.fName = user_data.first_name;
	parms.lName = user_data.last_name;
	parms.email = user_data.email;
	parms.pNumber = user_data.phone_number;
	parms.userID = req.params.id;
	
	res.render('users/editUsers', parms);
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
router.get('/:id/remove',async function (req, res) {
	console.log("REMOVE ROUTE");
	
	let user_id = req.params.id;

  	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) =>{
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined ||  user_data.length < 1){
		return res.send("ERROR GETTING THE USER INFO");
	}
	// set info of the user for frontend
	parms.interID = user_data.inter_ID;
	parms.fName = user_data.first_name;
	parms.lName = user_data.last_name;
	parms.email = user_data.email;
	parms.pNumber = user_data.phone_number;
	parms.userID = req.params.id;
	res.render('users/deleteUsers', parms);

});

/* DELETE ROUTE */
router.delete('/:id', function (req, res) {

  //TODO: catch error in case of null
  let user_id = req.params.id;

  queries.delete_user_by_id(user_id, function (err, results) {

	//TODO: catch error
	if (err) {
	  throw err;
	}
	// TODO: flash message
	res.redirect("/users");
  });
});
//===============================================================================

module.exports = router;
