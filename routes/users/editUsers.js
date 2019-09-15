var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var parms = { title: 'ABET Assessment' };



  res.render('users/editUsers', parms );
});

module.exports = router;
