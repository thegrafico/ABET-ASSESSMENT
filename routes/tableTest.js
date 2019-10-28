// TODO: - Calculate row avg (DONE)
//       - Calculate column % only to those who exceeds 3 or more (DONE)
//       - Calculate AVG of all AVG (DONE)
//       - Create add and remove row function (DONE)
//       - By default generate 10 rows (DONE)
//       - Avg result must be one decimal point
//       - Connect to DataBase
//         - Depending the amount of Perf. Crit. is the amount of columns (NEXT)
//         - Submit data to database
//       - The numbers should be from 0 to 4 (DONE)
//       - Take away code to turn test to float
//       - Change addRow to jQuery (DONE)
//       - Create a page the show the table filled with all the avgs (DONE)
//
// BUG: - Can't input decimal scores
//      -
//      -

var express = require('express');
var router = express.Router();

let parms = {}

router.post('/', function(req, res, next) {

  var input = req["body"]["rowValue"]; // input contains an array of objects which are the inputs of the user
  var studentScores= [];
  var inputCount = 0;

  // console.log(input); // console.log which displays input

  // for loop creating a multidimession array
  for ( var i = 0; i < (input.length/4); i++ ) {
    studentScores[i] = [];
  }

  for (var i = 0; i < (input.length/4); i++) {
    for (var j = 0; j < 4; j++) {
      studentScores[i][j] = input[inputCount];
      inputCount++;
    }
  }
  console.log("Here is inArr: ", studentScores);  // console.log which display the input in a arrays of arrays
  var firstRow = studentScores[0];
  var size = 0;
  // For loop to count the size of a rows since the input is receive as Objects
  for (let s in firstRow) {
    size++;
  }

  var sum = 0;
  var avgSum = 0;
  var avgRow = [];

  // for loops which calculates average per rows
  for(var i = 0; i < studentScores.length; i++) {
    for(var j = 0; j < size; j++) {
      // console.log("Student Score is: ", studentScores[i][j]);
      sum += parseFloat(studentScores[i][j]);
      // console.log("Sum is: ", sum);
    }
    // avgRow is an array which contains all the average rolls
    avgRow[i] = sum/parseFloat(size);
    sum = 0;
    avgSum += avgRow[i];
    // console.log("Avg of row", i, " : ", avgRow[i]);
  }
  var colAvg = avgSum/(avgRow.length);
  // console.log("Avg Row Array here: ", avgRow);

  var count = 1;
  var listOfObjects = [];
  // forEach creates a list of dictonary
  avgRow.forEach(function(entry) {
    var singleObj = {};
    singleObj['rowID'] = count;
    singleObj['rowIn'] = studentScores[count-1];
    singleObj['rowAvg'] = entry;
    listOfObjects.push(singleObj);
    count++;
  });
  console.log(listOfObjects); // This log displays the array of objects created. It contains all of the outputs for the tha table

  var threeMorePerc = [];
  var threeMoreCount = 0;

  for(let i = 0; i < size; i++) {
    for (var j = 0; j < studentScores.length; j++) {
      if(studentScores[j][i] >= 3) {
        threeMoreCount++;
      }
    }
    threeMorePerc[i] = (threeMoreCount/studentScores.length)*100;
    threeMoreCount = 0;
    console.log("Here: ", threeMorePerc[i]);
  }

  parms.row = listOfObjects;
  parms.avgCol = colAvg
  parms.colPerc = threeMorePerc;

  res.render('resultTable', parms);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tableTest', parms);
});

module.exports = router;
