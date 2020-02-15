/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
var queries = require('../helpers/queries/user_queries');
const { user_create_inputs } = require("../helpers/layout_template/create");

var parms = {
	title: 'ABET Assessment',
	subtitle: 'Users',
	url_create: "/users/create",
	base_url: "/users"
};

/*
	-- SHOW ALL USERS -- 
	GET /users
*/
router.get('/', async function (req, res) {

	parms.results = [];

	// the last header is for position the button
	parms.table_header = ["Inter ID", "Profile", "Name", "Last Name",
		"Email", "Phone Number","Date Created", ""
	];

	// Get all user from the database (callback)
	let list_of_users = await queries.get_user_list().catch( (err) =>{
		// TODO: flash message [ERROR]
		console.log("THERE IS AN ERROR: ", err);
	});

	let results = [];
	// IF found results from the database
	if (list_of_users != undefined && list_of_users.length > 0){
		
		list_of_users.forEach(user => {			

			// change date format 
			let date = new Date(user.date_created);
			date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
			
			results.push({
				"ID": user["user_ID"],
				"values": [
					user["inter_ID"],
					user["profile_Name"],
					user["first_name"],
					user["last_name"],
					user["email"],
					user["phone_number"],
					date,
					"" // position the buttons of remove, and edit
				]
			});
		});
		parms.results = results;
	}

	// res.status(200).send("Good");
	res.render('layout/home', parms);
});

/* 	
	-- SHOW CREATE USER --
 	GET /users/create
*/
router.get('/create', async function (req, res) {

	// store all profiles
	parms.profiles = [];
	parms.dropdown_options = [];
	parms.have_dropdown = true;
	parms.dropdown_title = "Profile";
	parms.dropdown_name = "profile_id";
	parms.title_action = "Create User";
	parms.url_form_redirect = "/users/create";
	parms.btn_title = "Create";

	// get all profiles
	let profiles  = await queries.get_all_profiles().catch((err) =>{
		console.log("There is an error: ", err);
	})

	// verify profiles
	if (profiles == undefined || profiles.length == 0){
		console.log("There is not profile created");
		
		req.flash("error", "Cannot find any profiles");
		return res.redirect(base_url);
	}

	// reset value to nothing when creating a new record
	user_create_inputs.forEach((record) =>{
		record.value = "";
	});
	parms.inputs = user_create_inputs;

	// for dynamic frontend
	profiles.forEach( (element) =>{
		parms.dropdown_options.push({
			"ID" : element.profile_ID,
			"NAME": element.profile_Name
		});
	});
	
	res.render('layout/create', parms);
});

/*
	-- CREATE USER -- 
 	POST /users/create
*/
router.post('/create', async function (req, res) {
	
	// TODO: validate req.body date, 
	let user_data = [req.body.interID, req.body.username, req.body.lastname, req.body.email, req.body.phoneNumber];

	// insert user using promise
	queries.insert_user(user_data, req.body.profile_id);

	req.flash("success", "User created");
	res.redirect('/users');
});

/*	
	--SHOW USERS EDIT--
 	GET /users/:id/edit
*/
router.get('/:id/edit', async function (req, res) {

	//TODO: Validate of null of not a number
	let user_id = req.params.id;
	// store all profiles
	parms.profiles = [];
	parms.have_dropdown = true;
	parms.dropdown_options = [];
	parms.dropdown_title = "Profile";
	parms.dropdown_name = "profile_id";
	parms.btn_title = "Submit";
	parms.title_action = "Edit User";
	parms.url_form_redirect = `/users/${user_id}?_method=PUT`;
	
	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) =>{
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined ||  user_data.length == 0){
		return res.send("ERROR GETTING THE USER INFO");
	}

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
	
	// Dynamic EJS
	parms.inputs = user_create_inputs;
	
	res.render('layout/create', parms);
});

/*
 UPDATE / users/:id
*/
router.put('/:id', function (req, res) {
	
	// TODO: Validate if user id is number and not empty
	let user_id = req.params.id;
	
	// TODO: validate req.body
	req.body.userID = user_id;
	
	console.log(req.body);

	// promise
	let update_user = queries.update_user(req.body);
	
	Promise.all(update_user).then(( [user_added, profile_updated] ) => {
		
		if(user_added && profile_updated){
			req.flash("success", "User Edited");
			res.redirect("/users");
		}else{		
			req.flash("error", "Error editing the user");
			res.redirect("/users");
		}
	}).catch((err) => {
		console.log("Error updating the user: ", err);
		req.flash("error", "Cannot edit the user");
		res.redirect("/users");
	});

});

/*
 GET users/:id:/remove 
*/
router.get('/:id/remove', async function (req, res) {
	
	// TODO: validate id, if null or not a number 
	let user_id = req.params.id;

	parms.title_action = "Remove";
	parms.title_message = "Are you sure you want to delete this User?";
	parms.form_action = `/users/${user_id}?_method=DELETE`;
	parms.btn_title = "Delete";

  	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) =>{
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined ||  user_data.length < 1){
		// TODO: flash message [ERROR]
		return res.send("ERROR GETTING THE USER INFO");
	}


	// console.log(user_data);
	let names = ["User Id", "Inter Id", "Name", "Last Name", "Email", "Phone Number"];
	let values = [
		user_id, 
		user_data.inter_ID, 
		user_data.first_name,
		user_data.last_name, 
		user_data.email,
		user_data.phone_number
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({"name": names[index], "value": values[index]})
	}

	parms.record = record;
	res.render('layout/remove', parms);
});

/* 
	REMOVE users/:id
	
*/
router.delete('/:id', function (req, res) {

 	//TODO: Validate that user_id is not null and is a number
	let user_id = req.params.id;

	// getting promise
  	let is_user_deleted = queries.delete_user_by_id(user_id);

	// run promise
	is_user_deleted.then( (yes) => {
	
		console.log("User was deleted");
		req.flash("success", "User Removed");
		res.redirect("/users");
	
	}).catch((no)=>{
	
		console.log("Error deleting the user: ", no);
		req.flash("error", "Cannot removed user");
		res.redirect("/users");
	});

});
//===============================================================================

module.exports = router;




