var express = require('express');
var router = express.Router();
let parms ={};
var general_queries = require('../helpers/queries/general_queries');
var chooseCourseTermQuery = require('../helpers/queries/chooseCourseTermQueries');
parms.title = 'ABET Assessment';


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


var pInput_queries = require("../helpers/queries/pInput_queries");

/* GET home page. */
router.get('/:id/professorInput', function(req, res, next) {

  res.render('assessment/professorInput', { title: 'ABET Assessment' });
});


//Post guardando lo que se escribe en la pagina en la base de datos.
 router.post('/:id/professorInput', function (req, res,next) {

     // res.send(req.body);
     let data = [req.body.A, req.body.B, req.body.C, req.body.D, req.body.F,
        req.body.UW, req.body.rCourse, req.body.cReflection, req.body.cImprovement, null];
      //Esto es para ver si esta "receiving" la data
        console.log(data);

     pInput_queries.insert_into_report(data, function(err, results){
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

  let input = req["body"]["rowValue"]; // input contains an array of objects which are the inputs of the user
  let studentScores= [];
  let inputCount = 0;
  
  // console.log(input); // console.log which displays input

  // for loop creating a multidimession array
  for (let i = 0; i < (input.length/4); i++ ) {
    studentScores[i] = [];
  }

  for (let i = 0; i < (input.length/4); i++) {
    for (let j = 0; j < amountCol; j++) {
      studentScores[i][j] = input[inputCount];
      inputCount++;
    }
  }
  // console.log("Here is inArr: ", studentScores);  // console.log which display the input in a arrays of arrays
  let firstRow = studentScores[0];
  let size = 0;
  // For loop to count the size of a rows since the input is receive as Objects
  for (let s in firstRow) {
    size++;
  }

  let sum = 0;
  let avgRow = [];

  // for loops which calculates average per rows
  for(let i = 0; i < studentScores.length; i++) {
    for(let j = 0; j < size; j++) {
      // console.log("Student Score is: ", studentScores[i][j]);
      sum += parseFloat(studentScores[i][j]);
      // console.log("Sum is: ", sum);
    }
    // avgRow is an array which contains all the average rolls
    avgRow[i] = sum/parseFloat(size);
    sum = 0;
    // console.log("Avg of row", i, " : ", avgRow[i]);
  }
  console.log(avgRow);
  // console.log("Avg Row Array here: ", avgRow);

  let count = 1;
  let listOfObjects = [];
  // forEach creates a list of dictionaries
  avgRow.forEach(function(entry) {
    let singleObj = {};
    singleObj['rowID'] = count;
    singleObj['rowIn'] = studentScores[count-1];
    singleObj['rowAvg'] = entry;
    listOfObjects.push(singleObj);
    count++;
  });
  // console.log(listOfObjects); // This log displays the array of objects created. It contains all of the outputs for the tha table

  let threeMorePerc = [];
  let threeMoreCount = 0;
  let avgtreeMoreCount = 0;

  for(let i = 0; i < avgRow.length; i++) {
    if(avgRow[i] >= 3) {
      avgtreeMoreCount++;
    }
  }
  
  let avgPerc = (avgtreeMoreCount/avgRow.length)*100;

  for(let i = 0; i < size; i++) {
    for (let j = 0; j < studentScores.length; j++) {
      if(studentScores[j][i] >= 3) {
        threeMoreCount++;
      }
    }
    threeMorePerc[i] = (threeMoreCount/studentScores.length)*100;
    threeMoreCount = 0;
    // console.log("Here: ", threeMorePerc[i]);
  }
  let colAvg = 54;
  
  console.log("Here is the percentage of the avarage column: ", avgPerc);

  threeMorePerc[threeMorePerc.length] = avgPerc;

  // threeMorePerc.push(avgPerc);

  parms.colNums = amountCol;
  parms.row = listOfObjects;
  parms.avgCol = colAvg;
  parms.colPerc = threeMorePerc;

  let document = createReport(parms);

  docx.Packer.toBuffer(document).then((buffer) => {
    console.log("Created a doc");
    fs.writeFileSync("Document.docx", buffer);
  });

  res.render('resultTable', parms);

  // var input = req["body"]["rowValue"]; // input contains an array of objects which are the inputs of the user
  // var studentScores= [];
  // var inputCount = 0;

  // // console.log(input); // console.log which displays input

  // // for loop creating a multidimession array
  // for ( var i = 0; i < (input.length/4); i++ ) {
  //   studentScores[i] = [];
  // }

  // for (var i = 0; i < (input.length/4); i++) {
  //   for (var j = 0; j < 4; j++) {
  //     studentScores[i][j] = input[inputCount];
  //     inputCount++;
  //   }
  // }
  // console.log("Here is inArr: ", studentScores);  // console.log which display the input in a arrays of arrays
  // var firstRow = studentScores[0];
  // var size = 0;
  // // For loop to count the size of a rows since the input is receive as Objects
  // for (let s in firstRow) {
  //   size++;
  // }

  // var sum = 0;
  // var avgSum = 0;
  // var avgRow = [];

  // // for loops which calculates average per rows
  // for(var i = 0; i < studentScores.length; i++) {
  //   for(var j = 0; j < size; j++) {
  //     // console.log("Student Score is: ", studentScores[i][j]);
  //     sum += parseFloat(studentScores[i][j]);
  //     // console.log("Sum is: ", sum);
  //   }
  //   // avgRow is an array which contains all the average rolls
  //   avgRow[i] = sum/parseFloat(size);
  //   sum = 0;
  //   avgSum += avgRow[i];
  //   // console.log("Avg of row", i, " : ", avgRow[i]);
  // }
  // var colAvg = avgSum/(avgRow.length);
  // // console.log("Avg Row Array here: ", avgRow);

  // var count = 1;
  // var listOfObjects = [];
  // // forEach creates a list of dictonary
  // avgRow.forEach(function(entry) {
  //   var singleObj = {};
  //   singleObj['rowID'] = count;
  //   singleObj['rowIn'] = studentScores[count-1];
  //   singleObj['rowAvg'] = entry;
  //   listOfObjects.push(singleObj);
  //   count++;
  // });
  // console.log(listOfObjects); // This log displays the array of objects created. It contains all of the outputs for the tha table

  // var threeMorePerc = [];
  // var threeMoreCount = 0;

  // for(let i = 0; i < size; i++) {
  //   for (var j = 0; j < studentScores.length; j++) {
  //     if(studentScores[j][i] >= 3) {
  //       threeMoreCount++;
  //     }
  //   }
  //   threeMorePerc[i] = (threeMoreCount/studentScores.length)*100;
  //   threeMoreCount = 0;
  //   console.log("Here: ", threeMorePerc[i]);
  // }

  // parms.row = listOfObjects;
  // parms.avgCol = colAvg
  // parms.colPerc = threeMorePerc

  // res.render('resultTable', parms);

});

/* GET home page. */
router.get('/:id/tableTest', function(req, res, next) {
  try {
    queries.get_perf_criterias(1 ,function(err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAS TO REDIRECT the user or send a error message
        throw err;
      }

      //IF found results from the database
      if (results) {
        // console.log(results)
        let queryResult = results;
        amountCol = queryResult.length; // This is a test variable
        // amountCol = 4;
        parms.colNums = amountCol;
        console.log("Query Results are: ", queryResult);
      }

      res.render('tableTest', parms);
    });
  }
  catch(error) {
    console.log(error);
    res.render('tableTest', parms);
  }
});


module.exports = router;


function createReport(data) {
  // =================================================================== Document Generator ===================================================================================
  
  console.log(data);
  
  const doc = new docx.Document({
    creator: "Inter American Assessment Team",
    description: "This is a Test",
    title: "Test Document"
  });

  const inter_logo = docx.Media.addImage(doc, fs.readFileSync("./public/images/logo_inter.jpg"), 75, 75, {
    floating: {
      horizontalPosition: {
        relative: docx.HorizontalPositionRelativeFrom.LEFT_MARGIN,
        offset: 914400
      },
      verticalPosition: {
        relative: docx.VerticalPositionRelativeFrom.TOP_MARGIN,
        offset: 450000
      }
    }
  });

  // ======== Header is here ===========
  const header = new docx.Header({ // The first header
    children: [
      new docx.Paragraph({
        children: [inter_logo]
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Inter American University of Puerto Rico",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Bayamon Campus",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "{ ==== Aqui va el departmento ==== }", // <=== Department goes here
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
        spacing: {
          after: 500,
        },
      })
    ],
  });

  // ======== Header Ends here ===========

  // ======== Table Starts Here ========
  let colNum = data.colNums;           // Amount of column in table
  let rowData = data.row;
  let colPercent = data.colPerc;
  let listOfCell = [];     
  let listOfRow = [];
  let headerCells = [];
  let footerCells = [];

  const studentCell = new docx.TableCell({
    children: [
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Students",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
        spacing: {
          after: 500,
        },
      })],
    width: {
      size : 320,
      type: "AUTO",
    },
    verticalAlign: docx.VerticalAlign.CENTER,
  });

  headerCells.push(studentCell);

  for(let i = 0; i < colNum; i++) {
    let inputCell = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Criteria " + i+1,
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })],
      verticalAlign: docx.VerticalAlign.CENTER,
    });
    headerCells.push(inputCell);
  }

  let averageCell = new docx.TableCell({
    children: [
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Average",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
        spacing: {
          after: 500,
        },
      })],
    verticalAlign: docx.VerticalAlign.CENTER,
  });

  headerCells.push(averageCell);

  let headerRow = new docx.TableRow({
    children: headerCells
  });

  listOfRow.push(headerRow);

  for(let j = 0; j < rowData.length; j++) {      // This loops the amount of rows
    let indexCol = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: rowData[j].rowID,
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })],
      verticalAlign: docx.VerticalAlign.CENTER,
    });
    listOfCell.push(indexCol);

    for (let index = 0; index < colNum; index++) {      // This loops the amount of columns
      let tableCol = new docx.TableCell({
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: rowData[j].rowIn[index],
                bold: false
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: {
              after: 500,
            },
          })],
        verticalAlign: docx.VerticalAlign.CENTER,
      });
    listOfCell.push(tableCol);
    }
    let avgCol = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: rowData[j].rowAvg,
              bold: false
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })],
      verticalAlign: docx.VerticalAlign.CENTER,
    });
    listOfCell.push(avgCol);
    let row = new docx.TableRow({
      children: listOfCell
    });
    listOfCell = [];
    listOfRow.push(row);
  }

  let percDescCell = new docx.TableCell({
    children: [
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "% of srud. with 3 or more",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
        spacing: {
          after: 500,
        },
      })],
    verticalAlign: docx.VerticalAlign.CENTER,
  });

  footerCells.push(percDescCell);

  for(let i = 0; i < colPercent.length; i++) {
    let percCell = new docx.TableCell({
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: colPercent[i],
                  bold: true
                }),
              ],
              alignment: docx.AlignmentType.CENTER,
              spacing: {
                after: 500,
              },
            })],
          verticalAlign: docx.VerticalAlign.CENTER,
        });
    footerCells.push(percCell);    
  }
  let footerRow = new docx.TableRow({
    children: footerCells
  });
  
  listOfRow.push(footerRow);

  const table = new docx.Table({
    rows: listOfRow
  });
  // ======== ^^ Table Ends Here ^^ ========

  doc.addSection({
    headers: {
      default: header
    },
    children: [
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Faculty Course Assessment Report",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "{ ===== Here goes the course name ===== }",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "{ ==== Here goes the section and credit per hours ==== }",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "{ ==== Here goes term  ==== }",
            bold: true
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "{==== Here goes the professor name ====}",
          }),
        ],
        alignment: docx.AlignmentType.RIGHT,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Catalog Description:",
            bold: true,
          })
        ],
        bullet: {
          level: 0
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "{==== Here goes the class description ====}",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Course Development",
            bold: true,
          })
        ],
        bullet: {
          level: 0
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Target:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "75% of the students must get equal or more than C as final grade in this course",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Grade Distribution:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "======= A table goes here =======",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Result of the Course:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "===== The result goes in here ======",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Modifications Made to Course:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "====== Sets of Bullet point goes here ======",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Course Reflection:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "===== Professor's input goes here =====",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Proposed Action for Course Improvement:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "===== Set of bullet points goes here =====",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Course Outcome b Assessment:",
            bold: true,
          })
        ],
        bullet: {
          level: 0
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Outcome B:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "===== Outcomes Description =====",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Target:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "======= Target Information =======",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Outcome Distribution:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "===== The distribution of the outcome results goes here ======",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "Results of outcome b:",
            bold: true,
          })
        ],
        bullet: {
          level: 1
        }
      }),
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: "====== Outcome Results ======",
          }),
        ],
        alignment: docx.AlignmentType.CENTER,
      }),
    ]
  });

  doc.addSection({
    children : [table],
  });

  return doc;
}