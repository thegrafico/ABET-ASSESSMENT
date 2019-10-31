// TODO: - Calculate row avg (DONE)
//       - Calculate column % only to those who exceeds 3 or more
//       - Calculate AVG of all AVG (DONE)
//       - Create add and remove row function
//       - By default generate 10 rows (DONE)
//       - Avg result must be one decimal point
//       - Connect to DataBase
//         - Depending the amount of Perf. Crit. is the amount of columns
//         - Submit data to database
//        -The numbers should be from 0 to 4 (done)
//       - Take away code to turn test to float

var express = require('express');
var router = express.Router();

let parms = {}

parms.row = [1,2,3,4,5,6,7,8,9,10];

router.post('/', function(req, res, next) {

  // studentScores contains an array of objects which are the inputs of the user
  var studentScores = req["body"]["rowValue"];

  // console.log which displays studentScores
  console.log(studentScores);

  // for (var i = 0; i < 4; i++){
  //   console.log("The object is: " + req["body"]["rowValue"][1][i]);
  // }


  var firstRow = studentScores[0];
  var size = 0;
  for (let s in firstRow) {
    size++;
  }
  var sum = 0;
  var avgSum = 0;
  var avgRow = [];

  // for loops which calculates average per rows
  for(var i = 0; i < studentScores.length; i++) {
    for(var j = 0; j < size; j++) {
      console.log("Student Score is: ", studentScores[i][j]);
      sum += parseFloat(studentScores[i][j]);
      console.log("Sum is: ", sum);
    }
    // avgRow is an array which contains all the average rolls
    avgRow[i] = sum/parseFloat(size);
    sum = 0;
    avgSum += avgRow[i];
    console.log("Avg of row", i, " : ", avgRow[i]);
  }

  // var colAvg = avgSum/parseFloat(avgRow.length);

  // console.log("Test: ", studentScores[0][0]);
  console.log("Avg Row Array here: ", avgRow);
  parms.rowAvg = avgRow;

  // This console log display array of all row averages
  // If you were to log parms.rowAvg[0] it display first element
  console.log(parms.rowAvg)

  // parms.colAverage = colAvg;
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
