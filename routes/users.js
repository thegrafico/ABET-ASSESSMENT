/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
var queries = require('../helpers/queries/user_queries');
const { user_create_inputs } = require("../helpers/modals_template/create");
var authHelper = require('../helpers/auth');

// DB conn
var { db } = require("../helpers/mysqlConnection"); //pool connection
var conn = db.mysql_pool;

var parms = {
	title: 'ABET Assessment',
	subtitle: 'Users',
	url_create: "/users/create",
	base_url: "/users"
};

/*
 GET /users
*/
router.get('/', async function (req, res) {

	parms.results = [];
	parms.table_header = [
		"User ID", "Inter ID", "Profile", "Name", "Last Name",
		"Email", "Phone Number","Date Created"
	];

	// Get all user from the database (callback)
	let list_of_users = await queries.get_user_list().catch( (err) =>{
		// TODO: flash message with error
		console.log("THERE IS AN ERROR: ", err);
	});
	let results = [];
	let each_user = [];
	// IF found results from the database
	if (list_of_users != undefined && list_of_users.length > 0){
		
		list_of_users.forEach(user => {			
			each_user.push(user["user_ID"]);
			each_user.push(user["inter_ID"]);
			each_user.push(user["profile_Name"]);
			each_user.push(user["first_name"]);
			each_user.push(user["last_name"]);
			each_user.push(user["email"]);
			each_user.push(user["phone_number"]);
			each_user.push(user["date_created"]);
			results.push(each_user);
			each_user = [];
		});
		parms.results = results;
	}

	res.render('layout/home', parms);
});

/* 
 *GET /users/createUsers (redundancia, deberia ser /user/create)
*/
router.get('/create', async function (req, res) {

	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.dropdown_title = "Profile";
	parms.dropdown_name = "profile_id";
	parms.inputs = user_create_inputs;
	parms.title_action = "Create User";

	// get all profiles
	let profiles  = await queries.get_all_profiles().catch((err) =>{
		console.log("There is an error: ", err);
	})

	// verify if profiles 
	if (profiles != undefined && profiles.length > 0){
		profiles.forEach( (element) =>{
			parms.dropdown_options.push({
				"ID" : element.profile_ID,
				"NAME": element.profile_Name
			});
		});
	}
	parms.form_method = "POST";
	parms.url_form_rediret = "/users/create";
	res.render('layout/create', parms);
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

	//TODO: catch error in case there is not id, Validate, Just number
	let user_id = req.params.id;
	

	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) =>{
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined ||  user_data.length < 1){
		return res.send("ERROR GETTING THE USER INFO");
	}

	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.dropdown_title = "Profile";
	parms.dropdown_name = "profile_id";

	user = [
		user_data.inter_ID,
		user_data.first_name, 
		user_data.last_name,
		user_data.email,
		user_data.phone_number
	]

	let index = 0;

	user_create_inputs.forEach((record) =>{
		record.value = user[index];
		index++;
	});

	parms.inputs = user_create_inputs;

	parms.title_action = "Edit User";

	// get all profiles
	let profiles  = await queries.get_all_profiles().catch((err) =>{
		console.log("There is an error getting the profiles: ", err);
		throw err;
	})

	// verify if profiles 
	if (profiles != undefined && profiles.length > 0){
		profiles.forEach( (element) =>{
			parms.dropdown_options.push({
				"ID" : element.profile_ID,
				"NAME": element.profile_Name
			});
		});
	}
	parms.form_method = "post";

	parms.url_form_rediret = `/users/${user_id}`;
	// res.render('layout/create', parms);

	res.render('layout/create', parms);
});

/*
 UPDATE / users/:id
*/
router.post('/:id', function (req, res) {
	
	// TODO: Validate if user id is number and not empty
	let user_id = req.params.id;
	req.body.userID = user_id;
	
	let user_was_update = queries.update_user(req.body);
	
	// another way for working with promise
	user_was_update.then((is_user_update) => {
		console.log("User was updated");
	}).catch((err)=>{
		console.log("Error: ", err);
	})

	res.redirect("/users");
});

/*
 GET users/:id:/remove 
*/
router.get('/:id/remove', async function (req, res) {
	
	let user_id = req.params.id;
	
	// TODO: Create locals var, [for loop in front end]
	let locals = {};

  	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) =>{
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined ||  user_data.length < 1){
		return res.send("ERROR GETTING THE USER INFO");
	}

	console.log(user_data);
	// set info of the user for frontend
	parms.interID = user_data.inter_ID;
	parms.fName = user_data.first_name;
	parms.lName = user_data.last_name;
	parms.email = user_data.email;
	parms.pNumber = user_data.phone_number;
	parms.userID = req.params.id;
	res.render('users/remove', parms);

});

/* 
	REMOVE users/:id
	
*/
router.delete('/:id', function (req, res) {

 	//TODO: catch error in case of null	 
	let user_id = req.params.id;

	// getting promise
  	let is_user_deleted = queries.delete_user_by_id(user_id);

	// run promise
	is_user_deleted.then( (yes) => {
		console.log("User was deleted");
	}).catch((no)=>{
		console.log("Error deleting the user: ", no);
	});

	// TODO: flash message
	res.redirect("/users");
});
//===============================================================================

module.exports = router;




