// TODO: - Calculate row avg
//       - Calculate column avg only to those who exceeds 3 or more
//       - Create add and remove row function
//       - By default generate 10 rows

var express = require('express');
var router = express.Router();

let parms = {}


router.post('/', function(req, res, next) {
  var studentScores = [];

  var studentScores = req.body.rowValue;

  // parms.rowOneAvg


  res.render('tableTest', parms);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tableTest', parms);
});

module.exports = router;
