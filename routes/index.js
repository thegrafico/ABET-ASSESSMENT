var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var middleware = require("../middleware/validateUser");
const { admin, professor, coordinator } = require("../helpers/profiles");

let locals = {
	title: 'ABET Assessment'
};

/* 
 GET /login 
*/
router.get('/', function (req, res) {

	let sess = req.session;

	if (sess != undefined && sess.user_email) {

		if (sess.user_profile == admin) {
			return res.redirect("/admin");
		} else if ((sess.user_profile == coordinator) || (sess.user_profile == professor)) {
			return res.redirect("/professor");
		}
	}

	locals.title = "Login";
	res.render('login', locals);
});

/* 
 GET ADMIN HOME
*/
router.get('/admin', middleware.is_login, middleware.hasAdminPrivilege, async function (req, res) {
	locals.title = "Admin";
	res.render('admin/home', locals);
});

/* 
* GET AUTH ROUTER - start sessions 
*/
router.get("/auth", async function (req, res) {

	// Getting user information from microsoft account
	const accessToken = await authHelper.getAccessToken(req.cookies, res);
	const userName = req.cookies.graph_user_name;
	const userEmail = req.cookies.graph_user_email;

	if (userEmail == undefined) {
		req.flash("error", "Cannot find the user email");
		return res.redirect("/");
	}

	// get the user role
	let user_information = await middleware.get_user_role(userEmail).catch((err) => {
		console.error("Error getting user information: ", err);
	});

	if (user_information == undefined || user_information.length == 0) {
		req.flash("error", "Cannot find any information about this user");
		return res.redirect("/");
	}

	// user information
	user_data = user_information[0];

	// programs for coordinator
	let coordinator_programs = get_std_coordinator(user_information);

	if (coordinator_programs.length > 0 && user_data.profile_Name.toLowerCase() != admin.toLowerCase()) {
		req.session.user_profile = coordinator
	} else {
		req.session.user_profile = user_data.profile_Name.toLowerCase();
	}

	req.session.study_programs_coordinator = coordinator_programs;
	req.session.user_name = userName;
	req.session.user_email = userEmail;
	req.session.user_id = user_data.user_ID;

	if (user_data.profile_Name.toLowerCase().includes(admin) || user_data.user_profile == 1) {
		return res.redirect("/admin");
	}

	res.redirect("/professor");
});

/**
 * get_std_coordinator - get all coordinator study programs
 * @param {Object} user_information - user role information
 * @returns {Array} ids of study programs
*/
function get_std_coordinator(user_information) {

	// filter only coordinator
	let filtered_std = user_information.filter(each => each["is_coordinator"] == 1);	

	// if not coordinator
	if (filtered_std.length == 0) return [];
	
	let programs = [];

	filtered_std.forEach(each => {
		programs.push({prog_name: each["prog_name"], prog_ID: each["prog_ID"]});
	});

	return programs;
}

module.exports = router;
