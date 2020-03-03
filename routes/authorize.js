var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

router.get('/', async function(req, res, next) {
  
  	// Get auth code
	const code = req.query.code;
	
	// If code is present, use it
	if (code) {
    	try {
 			await authHelper.getTokenFromCode(code, res);
      		// Redirect to home
      		res.redirect('/auth');
    	} catch (error) {
      		res.render('error', {title: 'Error', message: 'Error exchanging code for token', error: error });
    	}
  	} else {
    	// Otherwise complain
    	res.render('error', { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } });
  	}
});

/* 
	GET /authorize/signout
*/
router.get('/signout', async function(req, res, next) {
	authHelper.clearCookies(res);
	
	if (req.session != undefined){
		// destroy the session
		await req.session.destroy(function(err) {
			if (err) return res.redirect("/login");
			console.log("Sessions deleted");
		});
	}
	res.redirect("/");
});

  
module.exports = router;