var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var parms = { title: 'ABET Assessment' };

  var userID = req.body.deleteButton;

  console.log(req.body);


  res.render('users/deleteUsers', parms );
});

module.exports = router;
