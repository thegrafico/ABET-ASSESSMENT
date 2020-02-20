var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var middleware = require("../middleware/validateUser");
var { db } = require("../helpers/mysqlConnection"); //pool connection
var conn = db.mysql_pool;
/* 
	- CODE 
		1: Profesor
		2: Admin
		5: testing
*/
let parms = {
	title: 'ABET Assessment',
	active: {
		home: true
	}
};

/* 
 GET INDEX ROUTE
*/
router.get('/', async function (req, res) {

	// to verify is user is loggin -> sessions 
	let sess = req.session;

	//Verify is there is user info
	if (sess != undefined && sess.userEmail) {
		parms.user = sess.userName;

		//Compare user email in the DB, then get the data if there is any user. 
		user_data_profile = await middleware.get_user_role(sess.userEmail).catch((err) =>{
			console.log("You dont have a profile: ", err);
			return res.redirect("/");
		});

		// //Verify is not empty
		if (user_data_profile){
			// console.log(user_data_profile);
			req.session.user_id = user_data_profile.user_ID;
		}else
			console.log("This user don't have a profile");
	}

	res.render('index', parms);
});

/* 
 GET /login 
*/
router.get('/login', function (req, res) {
	parms.title = "Login";
	res.render('login', parms);
});

/* 
* GET AUTH ROUTER - start sessions 
*/
router.get("/auth", async function(req, res){
	
	// Getting user information from microsoft account
	const accessToken = await authHelper.getAccessToken(req.cookies, res);
	const userName = req.cookies.graph_user_name;
	const userEmail = req.cookies.graph_user_email;

	req.session.userName = userName;
	req.session.userEmail = userEmail;

	console.log(req.session.userEmail, req.session.userName);
	res.redirect("/");
});

/* 
 GET /login 
*/
router.get('/test', function (req, res) {
	parms.department = [
		{
			label: "COEN",
			value: "1"
		},
		{
			label: "MEC",
			value: "2"
		},
		{
			label: "ELEN",
			value: "3"
		}
	];
	res.render('partials/selection', parms);
});
module.exports = router;
