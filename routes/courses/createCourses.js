var express = require('express');
var router = express.Router();
var db = require("../../helpers/mysqlConnection").mysql_pool;

/* GET home page. */
router.get('/', function(req, res, next) {

  var parms = { title: 'ABET Assessment' };

  db.getConnection (function (err, connection){

    let progList = `Select *
                    From STUDY_PROGRAM`

    connection.query (progList,function (err,results,fields){

      parms.studyprog = results;

      res.render('courses/createCourses', parms);
    })
    connection.release();
  })

});

router.post ('/', function (req, res){
  var parms = { title: 'ABET Assessment' };

  var courseName = req.body.courseName;
  var courseNumber = req.body.courseNumber;
  var courseDesc = req.body.courseDesc;
  var progName = req.body.prog_name;

  console.log(progName);

  db.getConnection (function (err, connection){

    let addCourse = `insert into COURSE (course_name, course_number, course_description)
    values( '${courseName}', '${courseNumber}', '${courseDesc}');`

    connection.query (addCourse,function (err,results,fields){

      let findCourse = `Select course_ID
                       From COURSE
                       where course_name = '${courseName}'`

        connection.query (findCourse,function (err,results,fields){

          var courseID = results[0].course_ID;

          let findStudyProg = `Select prog_ID
                              From STUDY_PROGRAM
                              WHERE prog_name = '${progName}'`

          console.log(progName);

          connection.query (findStudyProg,function (err,results,fields){

            console.log(progID);
            var progID = results[0].prog_ID;

            let setStudyProgram = `insert into PROG_COURSE
                              values( ${courseID}, ${progID})`

            connection.query (setStudyProgram,function (err,results,fields){

              let progList = `Select *
                              From STUDY_PROGRAM`

              connection.query (progList,function (err,results,fields){

                parms.studyprog = results;

                res.render('courses/createCourses', parms);
              })
            })
          })
        })
      })
    connection.release();
  })

});
module.exports = router;
