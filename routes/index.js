var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

  let parms = { title: 'ABET Assessment', active: { home: true } };


  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
    parms.debug = `User: ${userName}\nAccess Token: ${accessToken}`;

    console.log(parms.debug)
  }

  parms.signInUrl = authHelper.getAuthUrl();
  parms.singOutUrl = "/authorize/signout"
  res.render('index', parms);
});

module.exports = router;
