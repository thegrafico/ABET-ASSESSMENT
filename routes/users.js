/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
var queries = require('../helpers/queries/user_queries');
var general_queries = require("../helpers/queries/general_queries");
var department_query = require("../helpers/queries/department_queries");
var roolback_queries = require("../helpers/queries/roolback_queries");
const { user_create_inputs } = require("../helpers/layout_template/create");
var { validate_form, get_data_for_update, split_and_filter } = require("../helpers/validation");

const base_url = "/admin/users";
var locals = {
	title: 'ABET Assessment',
	subtitle: 'Users',
	url_create: "/admin/users/create",
	base_url: base_url,
	form_id: "user_data",
	api_get_url: "/api/get/user", // all api_url ends in the id
	delete_redirect: null,
	filter:true,
	filter_title: "-- Department --",
	feedback_message: "Number of users: "
};

/*
	-- SHOW ALL USERS -- 
	GET /users
*/
router.get('/', async function (req, res) {

	locals.breadcrumb = [{"name": "Users", "url": base_url}];

	locals.results = [];

	locals.delete_redirect = "/users";

	// the last header is for position the button
	locals.table_header = ["Inter ID", "Profile", "Name", "Last Name",
		"Email", "Phone Number", "Department", ""
	];

	// Get all user from the database (callback)
	let list_of_users = await queries.get_user_list().catch((err) => {
		console.log("THERE IS AN ERROR: ", err);
	});

	// Departments
	let departments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.error("ERROR GETTING DEPARTMENTS: ", err);
	});

	if (departments != undefined && departments.length > 0){

		locals.filter_value = departments.map( each => each.dep_name);
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
					user["dep_name"].join(", "),
					"" // position the buttons of remove, and edit
				]
			});
		});
		locals.results = results;
	}
	res.render('admin/layout/home', locals);
});

/* 	
	-- SHOW CREATE USER --
 	GET /users/create
*/
router.get('/create', async function (req, res) {

	locals.breadcrumb = [
		{"name": "Users", "url": base_url},
		{"name": "Create", "url": locals.url_create }
	];

	// store all profiles
	locals.profiles = [];
	locals.dropdown_options = [];
	locals.have_dropdown = true;
	locals.dropdown_title = "Profile";
	locals.dropdown_name = "profile_id";
	locals.title_action = "Create User";
	locals.url_form_redirect = locals.url_create;
	locals.btn_title = "Create";
	locals.department = [];

	// get all profiles
	let profiles = await queries.get_all_profiles().catch((err) => {
		console.log("There is an error: ", err);
	});

	// verify profiles
	if (profiles == undefined || profiles.length == 0) {
		console.log("There is not profile created");
		req.flash("error", "Cannot find any profiles");
		return res.redirect(base_url);
	}

	// get all deparments
	let departments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Cannot get deparment information: ", err);
	});

	// verify is found any department
	if (departments == undefined || departments.length == 0) {
		console.log("There is not department created");
		req.flash("error", "Please create a department before creating a user");
		return res.redirect(base_url);
	}

	departments.forEach((element) => {
		locals.department.push({
			label: element.dep_name,
			value: element.dep_ID.toString()
		});
	});

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

	locals.user_dept = [];
	locals.user_profile = -1;

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

	if (req.body.selected_values == undefined || req.body.selected_values.length < 2){
		req.flash("error", "Department Cannot be empty");
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
		"selected_values": "s"
	};

	// if the values don't mach the type 
	if (!validate_form(req.body, keys_types)) {
		req.flash("error", "Error in the information of the user");
		return res.redirect("back");
	}

	let create_user_data = {
		"id": req.body.interID,
		"name": req.body.username,
		"lastname": req.body.lastname,
		"email": req.body.email,
		"phoneNumber": req.body.phoneNumber
	}

	// get all departments 
	let departments = req.body.selected_values.split(",");

	// promise -- adding user
	roolback_queries.create_user(create_user_data, req.body.profile_id, departments).then((ok) => {
		req.flash("success", "User created");
		res.redirect(base_url);

	}).catch((err) => {

		if (err.code == "ER_DUP_ENTRY")
			req.flash("error", "There is a user with the same Inter ID");
		else
			req.flash("error", "Error Creating the User");

		res.redirect("back");
	});
});

/*	
	--SHOW USERS EDIT--
 	GET /users/:id/edit
*/
router.get('/:id/edit',  async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This user don't exits");
		return res.redirect(base_url);
	}

	// Breadcrum for web
	locals.breadcrumb = [
		{"name": "Users", "url": base_url, "active": false},
		{"name": "Edit", "url": ".", "active": true}
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
	let user_departments = await queries.get_user_department_by_id(user_id).catch((err) => {
		console.log("Error getting user department: ", err);
	});
	// assign user department if user don't have any
	if (user_departments == undefined) user_departments = [];

	// get all department from db
	let departments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
		console.log("Cannot get deparment information: ", err);
	});

	// verify departments
	if (departments == undefined || departments.length == 0) {
		console.log("There is not department created");
		req.flash("error", "Please create a department before creating a user");
		return res.redirect(base_url);
	}

	// get all profiles
	let profiles = await queries.get_all_profiles().catch((err) => {
		console.log("There is an error getting the profiles: ", err);
	});

	// verify if profiles 
	if (profiles == undefined || profiles.length == 0) {
		console.log("There is not profile created");
		req.flash("error", "Please create a profile before creating a user");
		return res.redirect(base_url);
	}

	// Insert department in frondend
	departments.forEach((element) => {
		locals.department.push({
			label: element.dep_name,
			value: element.dep_ID.toString()
		});
	});

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
	locals.user_dept = user_departments;
	locals.user_profile = user_data.profile_ID;

	res.render('admin/user/create_edit', locals);
	// res.status(200).send("OK");
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

	if (req.body.selected_values == ","){
		req.flash("error", "Department Cannot be empty");
		return res.redirect("back");
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
		"actual_profile": "n",
	};

	// if the values don't mach the type 
	if (!validate_form(req.body, keys_types)) {
		req.flash("error", "Error in the information of the user");
		return res.redirect("back");
	}

	req.body.userID = user_id;
	if (req.body.selected_values == undefined || req.body.selected_values.length == 0 || req.body.selected_values == "")
		req.body.selected_values = req.body.selected;

	let current_department = split_and_filter(req.body.selected, ",");
	let selected_department = split_and_filter(req.body.selected_values, ",");

	let departments_for_update = get_data_for_update(current_department, selected_department);
	// console.log("RESULTS: ", departments_for_update);

	let error = undefined;
	let user_was_updated = await queries.update_user(req.body).catch((err) => {
		console.log("Error updating the user: ", err);
		error = err;
	});

	if (user_was_updated == undefined || !user_was_updated) {

		if (error.code == "ER_DUP_ENTRY")
			req.flash("error", "There is a user with the same Inter ID");
		else
			req.flash("error", "Cannot update the user information");
		return res.redirect("back");
	}

	// update profile is changes
	if (req.body.profile_id != req.body.actual_profile) {
		await queries.update_user_profile(user_id, req.body.profile_id).catch((err) => {
			console.log("Error updating the user profile: ", err);
		});
	}

	// update the department if != undefined
	if (departments_for_update != undefined) {

		// remove element if there is any
		if (departments_for_update["delete"].length > 0) {

			await department_query.remove_user_department(user_id, departments_for_update["delete"]).catch((err) => {
				console.log("There is an error Updating department: ", err);
				throw err;
			});
		}

		// remove element if there is any
		if (departments_for_update["insert"].length > 0) {

			await department_query.insert_user_department(user_id, departments_for_update["insert"]).catch((err) => {
				console.log("There is an error Updating department: ", err);
				throw err;
			});
		}
	}

	req.flash("success", "User edited");
	res.redirect(base_url);
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




