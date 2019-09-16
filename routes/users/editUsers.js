var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {

  let user_id = req.params.id;

  console.log(user_id)

  var parms = { title: 'ABET Assessment' };

  parms["user_id"] = user_id

  res.render('users/editUsers', parms );
});

module.exports = router;
