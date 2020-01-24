var express = require('express');
var router = express.Router();
let parms ={};
var general_queries = require('../../helpers/queries/general_queries');
var chooseCourseTermQuery = require('../../helpers/queries/chooseCourseTermQueries');
parms.title = 'ABET Assessment';


//SELECT *
//FROM STUDENT_OUTCOME inner join STUDY_PROGRAM using (prog_ID) where dep_ID = 1;

/* GET home page. */
router.get('/', function(req, res, next) {
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
            res.render('professorReport/chooseCourseTerm', parms);
          })
        })
      })
  })

  })

});

//The search post method
router.get('/:id', function(req, res, next) {
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
              res.render('professorReport/chooseCourseTerm', parms);
            })
          })
        })
    })
});

router.post('/', function(req, res, next){
  //splits the URL for the prog_ID and saves it
  req.body.prog_ID = req.body.prog_ID.split("/")[req.body.prog_ID.split("/").length - 1];
  //the 1 needs to be replaced with a real user id
  let data = [req.body.course_ID, req.body.term_ID, 5, req.body.rubric_ID]
  chooseCourseTermQuery.insert_assessment(data, function(err,results){
    console.log(results);
    res.redirect('/professorReport/'+ results.insertId +'/professorInput');
  })
});
module.exports = router;
