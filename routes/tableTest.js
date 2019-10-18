// TODO: - Calculate row avg (DONE)
//       - Calculate column % only to those who exceeds 3 or more
//       - Calculate AVG of all AVG (DONE)
//       - Create add and remove row function
//       - By default generate 10 rows (DONE)
//       - Avg result must be one decimal point
//       - Connect to DataBase
//         - Depending the amount of Perf. Crit. is the amount of columns
//         - Submit data to database
//       -

var express = require('express');
var router = express.Router();

let parms = {}


router.post('/', function(req, res, next) {

  var studentScores = [req.body.rowValue.one, req.body.rowValue.two, req.body.rowValue.three, req.body.rowValue.four, req.body.rowValue.five, req.body.rowValue.six, req.body.rowValue.seven, req.body.rowValue.eight, req.body.rowValue.nine, req.body.rowValue.ten];

  console.log(studentScores);

  var firstRow = studentScores[0];
  var size = 0;
  for (let s in firstRow) {
    size++;
  }
  console.log(size);
  var sum = 0;
  var avgSum = 0;
  var avgRow = [];

// use let in


  for(var i = 0; i < studentScores.length; i++) {
    for(var j = 0; j < size; j++) {
      console.log(studentScores[0].length);
      console.log("Student Score is: ", studentScores[i][j]);
      sum += parseFloat(studentScores[i][j]);
      console.log("Sum is: ", sum);
    }
    avgRow[i] = sum/parseFloat(size);
    sum = 0;
    avgSum += avgRow[i];
    console.log("Avg of row", i, " : ", avgRow[i]);
  }

  var colAvg = avgSum/parseFloat(avgRow.length);

  // console.log("Test: ", studentScores[0][0]);

  parms.rowOneAvgOne = avgRow[0];
  parms.rowOneAvgTwo = avgRow[1];
  parms.rowOneAvgThree = avgRow[2];
  parms.rowOneAvgFour = avgRow[3]
  parms.rowOneAvgFive = avgRow[4]
  parms.rowOneAvgSix = avgRow[5]
  parms.rowOneAvgSeven = avgRow[6]
  parms.rowOneAvgEight = avgRow[7]
  parms.rowOneAvgNine = avgRow[8]
  parms.rowOneAvgTen = avgRow[9]
  parms.colAverage = colAvg;
  // parms.studentScoresOne = studentScores[0];
  // parms.studentScoresTwo = studentScores[1];
  // parms.studentScoresThree = studentScores[2];
  // parms.studentScoresFour = studentScores[3];

  res.render('tableTest', parms);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tableTest', parms);
});

module.exports = router;
