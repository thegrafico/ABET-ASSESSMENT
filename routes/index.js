var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var middleware = require("../middleware/validateUser");

let locals = {
	title: 'ABET Assessment'
};

/* 
 GET /login 
*/
router.get('/', function (req, res) {
	locals.title = "Login";
	res.render('login', locals);
});

/* 
 GET ADMIN HOME
*/
router.get('/admin', middleware.is_login, middleware.is_admin, async function (req, res) {
	locals.title = "Admin";
	res.render('admin/home', locals);
});


/* GET PROFESSOR HOME*/
router.get('/professor', middleware.is_login, middleware.is_admin, async function (req, res) {
	locals.title = "Professor";
	res.render('professor/home', locals);
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

	let user_information = await middleware.get_user_role(userEmail).catch((err) => {
		console.error("Error getting user information: ", err);
	});

	if (user_information == undefined) {
		req.flash("error", "Cannot find any information about this user");
		return res.redirect("/");
	}
	req.session.user_name = userName;
	req.session.user_email = userEmail;
	req.session.user_profile = user_information.profile_Name.toLowerCase();
	req.session.user_id = user_information.user_ID;

	if (user_information.profile_Name.toLowerCase().includes("admin") || user_information.user_profile == 1) {
		return res.redirect("/admin");
	}

	res.redirect("/professor");
});
module.exports = router;
