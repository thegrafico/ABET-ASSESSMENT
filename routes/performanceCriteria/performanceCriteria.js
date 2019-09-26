//Carlos

var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
// var queries = require('../../helpers/queries/performanceCriteria_queries');

let base_url = '/performanceCriteria/'
let routes_names = ['create', 'delete', 'edit', 'details']

//Paramns to routes links
let parms = {};

//Populate parms
routes_names.forEach(e=>{
  parms[e] = base_url + e;
});

parms["title"] = 'ABET Assessment';

/* GET home page. */
router.get('/', function(req, res, next) {
  try{

    let performance_table = 'PERF_CRITERIA';

    //Get all perfCrit from the database (callback)
    general_queries.get_table_info(performance_table, function (err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAS TO REDIRECT the user or send a error message
        throw err;
      }

      //IF found results from the database
      if (results) {
        // console.log(results)
        parms.results = results;
      }

      res.render('performanceCriteria/performanceCriteria', parms);
    });
  }
  catch (error) {

    //TODO: send a error message to the user.
    console.log(error);
    res.render('performanceCriteria/performanceCriteria', parms);
  }
});

/* CREATE home page. */
router.get('/' + routes_names[0], function(req, res, next) {
  try{
    let studentOut_table = 'STUDENT_OUTCOME';

    //Get all perfCrit from the database (callback)
    general_queries.get_table_info(studentOut_table, function (err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAS TO REDIRECT the user or send a error message
        throw err;
      }

      //IF found results from the database
      if (results) {
        // console.log(results)
        parms.results = results;
      }

      res.render('performanceCriteria/createPerfCrit', parms);
    });
  }
  catch (error) {
    //TODO: send a error message to the user.
    console.log(error);
    res.render('performanceCriteria/createPerfCrit', parms);
  }
});

/* CREATE POST. */
// router.post('/' + routes_names[0], function(req, res, next) {
//   try {
//
//     console.log(req.body);
//     let data = [req.body.perC_Desk, req.body.outc_ID];
//
//     //Insert all data to the database (callback)
//     queries.insert_perC(data, function (err, results) {
//
//       //TODO: redirect user to another page
//       if (err) {
//         //HERE HAVE TO REDIRECT the user or send a error message
//         throw err;
//       }
//
//       // console.log(results);
//       console.log("Rubric Created");
//       res.redirect('performanceCriteria');
//     });
//   }
//   catch (error) {
//     //TODO: send a error message to the user.
//     console.log(error);
//     res.redirect('performanceCriteria');
//   }
// });


/* DELETE home page. */
router.get('/' + routes_names[1], function(req, res, next) {
  res.render('performanceCriteria/deletePerfCrit', parms);
});


/* EDIT home page. */
router.get('/' + routes_names[2], function(req, res, next) {
  res.render('performanceCriteria/editPerfCrit', parms);
});

/* DETAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('performanceCriteria/detailPerfCrit', parms);
});

module.exports = router;
