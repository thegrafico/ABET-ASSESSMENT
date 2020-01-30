var express = require('express');
var router = express.Router();
let parms ={};
var general_queries = require('../helpers/queries/general_queries');
var chooseCourseTermQuery = require('../helpers/queries/chooseCourseTermQueries');
parms.title = 'ABET Assessment';


//SELECT *
//FROM STUDENT_OUTCOME inner join STUDY_PROGRAM using (prog_ID) where dep_ID = 1;

/* GET home page. */
router.get('/chooseCourseTerm', function(req, res, next) {
  console.log("This is the get");
  let table = "STUDY_PROGRAM";


  general_queries.get_table_info(table,function(err, results){
  parms.program = []
  parms.term = [];
  parms.rubric = []
  parms.course = []
  //copy the name of the course programs to parms
  parms.program = results;
  table = "STUDY_PROGRAM"
    general_queries.get_table_info(table,function(err, results){
      prog_id = results[0].prog_ID
      parms.program = results
      table = "ACADEMIC_TERM";
      general_queries.get_table_info(table,function(err, results){
        //copy the result to parms.terms
          parms.term = results;

        chooseCourseTermQuery.get_rubric_info(prog_id, function(err,results){
            parms.rubric = results;

          chooseCourseTermQuery.get_course_info(prog_id, function(err,results){
              parms.course = results;
            res.render('assessment/chooseCourseTerm', parms);
          })
        })
      })
  })

  })

});

//The search post method
router.get('/chooseCourseTerm/:id', function(req, res, next) {
  let prog_id = req.params.id;

    table = "STUDY_PROGRAM"
      general_queries.get_table_info(table,function(err, results){
        var index = results.indexOf(results.find(o => o.prog_ID == prog_id))
        if (index != 0 && index != -1)
        {
          let temp = results[index]
          results[index] = results[0]
          results[0] = temp
        }
        parms.program = results
        table = "ACADEMIC_TERM";
        general_queries.get_table_info(table,function(err, results){
          //copy the result to parms.terms
            parms.term = results;

          chooseCourseTermQuery.get_rubric_info(prog_id, function(err,results){
              parms.rubric = results;

            chooseCourseTermQuery.get_course_info(prog_id, function(err,results){
                parms.course = results;
              res.render('assessment/chooseCourseTerm', parms);
            })
          })
        })
    })
});

router.post('/chooseCourseTerm', function(req, res, next){
  //splits the URL for the prog_ID and saves it
  req.body.prog_ID = req.body.prog_ID.split("/")[req.body.prog_ID.split("/").length - 1];
  //the 1 needs to be replaced with a real user id
  let data = [req.body.course_ID, req.body.term_ID, 5, req.body.rubric_ID]
  console.log("data", data);

  chooseCourseTermQuery.insert_assessment(data, function(err,results){
    console.log("here?", results);
    res.redirect('/assessment/'+ results.insertId +'/professorInput');
  })
});

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


var query = require("../helpers/queries/pInput_queries");

/* GET home page. */
router.get('/:id/professorInput', function(req, res, next) {

  res.render('assessment/professorInput', { title: 'ABET Assessment' });
});

//Creando un Id para seguir mandando los datos
//a la proxima ruta.

// router.get('/professorInput/:id',function(req,res,next){
//   res.render('test',{output: req.params.id});
// });
//
// router.post('/professorInput/next', function(req,res,next){
//     var id = req.body.id;
//   res.redirect('/professorInput/' + id);
// });


//Post de Prueba...

// router.post('/', function(req,res,next){
//   res.redirect('/chooseCourseTerm');
// });


//Post guardando lo que se escribe en la pagina en la base de datos.
 router.post('/:id/professorInput', function (req, res,next) {

     // res.send(req.body);
     let data = [req.body.A, req.body.B, req.body.C, req.body.D, req.body.F,
        req.body.UW, req.body.rCourse, req.body.cReflection, req.body.cImprovement, null];
      //Esto es para ver si esta "receiving" la data
        console.log(data);

     query.insert_into_report(data, function(err, results){
   		//TODO: catch error properly
   		if (err) throw err;
   		res.redirect(base_url);
	   });
     res.redirect('/assessment/' + req.params.id + '/tableTest');
 });


//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


router.post('/:id/tableTest', function(req, res, next) {

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
  parms.colPerc = threeMorePerc

  res.render('resultTable', parms);

});

/* GET home page. */
router.get('/:id/tableTest', function(req, res, next) {
  res.render('tableTest', parms);
});


module.exports = router;
