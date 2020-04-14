/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
var queries = require('../helpers/queries/user_queries');
var general_queries = require("../helpers/queries/general_queries");
var roolback_queries = require("../helpers/queries/roolback_queries");
const { user_create_inputs } = require("../helpers/layout_template/create");
const table = require("../helpers/DatabaseTables");
var { validate_form} = require("../helpers/validation");

const base_url = "/admin/users";
var locals = {
	title: 'ABET Assessment',
	subtitle: 'Users',
	url_create: "/admin/users/create",
	base_url: base_url,
	form_id: "user_data",
	api_get_url: "/api/get/user", // all api_url ends in the id
	delete_redirect: null,
	filter: true,
	filter_title: "-- Study Program --",
	feedback_message: "Number of users: "
};

/*
	-- SHOW ALL USERS -- 
	GET /users
*/
router.get('/', async function (req, res) {

	locals.breadcrumb = [{ "name": "Users", "url": base_url }];

	locals.title = "Users";

	locals.css_table = "user.css";

	locals.results = [];

	locals.delete_redirect = "/users";

	// the last header is for position the button
	locals.table_header = ["Inter ID", "Profile", "Name", "Last Name",
		"Email", "Phone Number", "Study Program", ""
	];

	// Get all user from the database (callback)
	let list_of_users = await queries.get_user_list().catch((err) => {
		console.log("THERE IS AN ERROR: ", err);
	});

	// Departments
	let study_programs = await general_queries.get_table_info(table.study_program).catch((err) => {
		console.error("ERROR GETTING study programs: ", err);
	});

	if (study_programs != undefined && study_programs.length > 0) {

		locals.filter_value = study_programs.map(each => each.prog_name);
	}

	let results = [];
	// IF found results from the database
	if (list_of_users != undefined && list_of_users.length > 0) {

		list_of_users.forEach(user => {

			results.push({
				"ID": user["user_ID"],
				"values": [
					user["inter_ID"],
					user["profile_Name"],
					user["first_name"],
					user["last_name"],
					user["email"],
					user["phone_number"],
					user["prog_name"].join(", "),
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('layout/home', locals);
});

/* 	
	-- SHOW CREATE USER --
 	GET /users/create
*/
router.get('/create', async function (req, res) {

	locals.breadcrumb = [
		{ "name": "Users", "url": base_url },
		{ "name": "Create", "url": locals.url_create }
	];

	locals.title = "Create User";


	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Profile";
	locals.dropdown_name = "profile_id";
	locals.title_action = "Create User";
	locals.url_form_redirect = locals.url_create;
	locals.btn_title = "Create";

	// get all profiles
	let profiles = await general_queries.get_table_info(table.profile).catch((err) => {
		console.log("There is an error: ", err);
	});

	// verify profiles
	if (profiles == undefined || profiles.length == 0) {
		console.log("There is not profile created");
		req.flash("error", "Cannot find any profiles");
		return res.redirect(base_url);
	}

	// Getting study program
	let study_programs = await general_queries.get_table_info(table.study_program).catch((err) => {
		console.error("ERROR GETTING STD PROGRAM: ", err);
	});

	// verify is found any department
	if (study_programs == undefined || study_programs.length == 0) {
		console.error("Cannot find any study program");
		req.flash("error", "Please create a Study program before creating a user");
		return res.redirect(base_url);
	}

	// Study Programs
	locals.study_program = study_programs;

	// reset value to nothing when creating a new record
	user_create_inputs.forEach((record) => {
		record.value = "";
	});
	locals.inputs = user_create_inputs;

	// for dynamic frontend
	profiles.forEach((element) => {
		locals.dropdown_options.push({
			"ID": element.profile_ID,
			"NAME": element.profile_Name
		});
	});

	locals.user_profe = [];
	locals.user_profile = 2;
	locals.std_ids = [];
	locals.is_coordinator = [];

	res.render('admin/user/create_edit', locals);
});

/*
	-- CREATE USER -- 
 	POST /users/create
*/
router.post('/create', async function (req, res) {

	if (req.body == undefined) {
		req.flash("error", "Cannot find the data to create user");
		return res.redirect("back");
	}

	let std = req.body.std;
	if (!std || Object.keys(std).length === 0) {
		req.flash("error", "Study Program Cannot be empty");
		return res.redirect("back");
	}

	// key with expected types (string, number);
	let keys_types = {
		"interID": "s",
		"username": "s",
		"lastname": "s",
		"email": "s",
		// "phoneNumber": "s",
		"profile_id": "n",
	};

	// if the values don't mach the type 
	if (!validate_form(req.body, keys_types)) {
		req.flash("error", "Error in the information you typed");
		return res.redirect("back");
	}

	let create_user_data = {
		"id": req.body.interID,
		"name": req.body.username,
		"lastname": req.body.lastname,
		"email": req.body.email,
		"phoneNumber": req.body.phoneNumber
	}

	// promise -- adding user
	roolback_queries.create_user(create_user_data, req.body.profile_id, std).then((ok) => {
		req.flash("success", "User created");
		res.redirect(base_url);

	}).catch((err) => {

		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "There is a user with the same Inter ID or same Email");
		else
			req.flash("error", "Error Creating the User");

		res.redirect("back");
	});
});

/*	
	--SHOW USERS EDIT--
 	GET /users/:id/edit
*/
router.get('/:id/edit', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This user don't exits");
		return res.redirect(base_url);
	}

	locals.title = "Edit User";

	// Breadcrum for web
	locals.breadcrumb = [
		{ "name": "Users", "url": base_url, "active": false },
		{ "name": "Edit", "url": ".", "active": true }
	];

	let user_id = req.params.id;
	locals.profiles = [];
	locals.department = [];
	locals.have_dropdown = true;
	locals.dropdown_options = [];
	locals.dropdown_title = "Profile";
	locals.dropdown_name = "profile_id";
	locals.btn_title = "Submit";
	locals.title_action = "Edit User";
	locals.url_form_redirect = `/admin/users/${user_id}?_method=PUT`;

	// get the user data
	let user_data = await queries.get_user_by_id(user_id).catch((err) => {
		console.log(err);
	});

	// verify is user data is good
	if (user_data == undefined || user_data.length == 0) {
		req.flash("error", "Cannot find this user");
		return res.redirect(base_url);
	}

	// get user study programs
	let user_std = await queries.get_user_study_programs_by_id(user_id).catch((err) => {
		console.log("Error getting user study program: ", err);
	});

	// assign user std if user don't have any
	if (user_std == undefined) user_departments = [];

	// get all department from db
	let study_programs = await general_queries.get_table_info(table.study_program).catch((err) => {
		console.log("Cannot find any study program, please create one", err);
	});

	// verify study programs
	if (study_programs == undefined || study_programs.length == 0) {
		req.flash("error", "Please create a study program before creating a user");
		return res.redirect(base_url);
	}

	locals.std_ids = user_std.map(each => each["prog_ID"]);
	locals.is_coordinator = user_std.map(each => each["is_coordinator"]);

	// get all profiles
	let profiles = await general_queries.get_table_info(table.profile).catch((err) => {
		console.log("There is an error getting the profiles: ", err);
	});

	// verify if profiles 
	if (profiles == undefined || profiles.length == 0) {
		console.log("There is not profile created");
		req.flash("error", "Please create a profile before creating a user");
		return res.redirect(base_url);
	}

	profiles.forEach((element) => {
		locals.dropdown_options.push({
			"ID": element.profile_ID,
			"NAME": element.profile_Name
		});
	});

	// // set the data user for edit
	user = [
		user_data.inter_ID,
		user_data.first_name,
		user_data.last_name,
		user_data.email,
		user_data.phone_number
	]

	let index = 0;
	user_create_inputs.forEach((record) => {
		record.value = user[index];
		index++;
	});

	// Dynamic EJS
	locals.inputs = user_create_inputs;
	locals.study_program = study_programs;
	locals.user_profile = user_data.profile_ID;

	res.render('admin/user/create_edit', locals);
});

/*
 UPDATE / users/:id
*/
router.put('/:id', async function (req, res) {

	// validate id
	if (req.body == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the user");
		return res.redirect(base_url);
	}

	let user_id = parseInt(req.params.id);

	// key with expected types (string, number);
	let keys_types = {
		"interID": "s",
		"username": "s",
		"lastname": "s",
		"email": "s",
		// "phoneNumber": "s",
		"profile_id": "n",
	};

	let std = req.body.std;
	if (!std || Object.keys(std).length === 0) {
		req.flash("error", "Study Program Cannot be empty");
		return res.redirect("back");
	}

	// if the values don't mach the type 
	if (!validate_form(req.body, keys_types)) {
		req.flash("error", "Error in the information of the user");
		return res.redirect("back");
	}

	roolback_queries.update_user(user_id, req.body).then((ok) => {
		req.flash("success", "User Updated!");
		res.redirect(base_url);
	}).catch((err) => {

		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "There is a user with the same Inter ID or same Email");
		else
			req.flash("error", "Error updating the User");

		res.redirect("back");
	});

});

/* 
	REMOVE the user by user id
	DELETE /admin/user/:id
*/
router.delete('/:id', function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the user");
		return res.redirect(base_url);
	}

	let user_id = req.params.id;

	// getting promise
	let is_user_deleted = queries.delete_user_by_id(user_id);

	// run promise
	is_user_deleted.then((yes) => {
		console.log("User was deleted");
		req.flash("success", "User Removed");
		res.redirect(base_url);
	}).catch((no) => {
		console.log("Error deleting the user: ", no);
		req.flash("error", "Cannot removed user");
		res.redirect(base_url);
	});

});
//===============================================================================

module.exports = router;




