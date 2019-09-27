//Carlos

var express = require('express');
var router = express.Router();
var general_queries = require('../../helpers/queries/general_queries');
var queries = require('../../helpers/queries/performanceCriteria_queries');

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
router.post('/' + routes_names[0], function(req, res, next) {
  try {

    console.log(req.body);
    let data = [req.body.perC_Desk, req.body.outc_ID];

    //Insert all data to the database (callback)
    queries.create_perC(data, function (err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAVE TO REDIRECT the user or send a error message
        throw err;
      }

      // console.log(results);
      res.redirect('/performanceCriteria');
    });
  }
  catch (error) {
    //TODO: send a error message to the user.
    console.log(error);
    res.redirect('/performanceCriteria');
  }
});


/* DELETE home page. */
router.get('/:id/' + routes_names[1], function(req, res, next) {
  try {

    let data = {
      "from": "PERF_CRITERIA",
      "where": "perC_ID",
      "id": req.params.id
    };

    //Insert all data to the database (callback)
    general_queries.get_table_info_by_id(data, function (err, results) {

      parms.perC_ID = results[0].perC_ID;
      parms.perC_Desk = results[0].perC_Desk;
      parms.perC_order = results[0].perC_order;
      parms.outc_ID = results[0].outc_ID;

      //TODO: redirect user to another page
      if (err) {
        //HERE HAVE TO REDIRECT the user or send a error message
        throw err;
      }

      // console.log(results);
      // console.log("Delete");
      res.render('performanceCriteria/deletePerfCrit', parms);
    });
  }
  catch (error) {
    //TODO: send a error message to the user.
    console.log(error);
    res.render('performanceCriteria/deletePerfCrit', parms);
  }
});

router.post('/:id/' + routes_names[1], function(req, res, next) {
  try {

    let data = {
      "from": "PERF_CRITERIA",
      "where": "perC_ID",
      "id": req.params.id
    };

    //Insert all data to the database (callback)
    general_queries.delete_record_by_id(data, function (err, results) {

      //TODO: redirect user to another page
      if (err) {
        //HERE HAVE TO REDIRECT the user or send a error message
        throw err;
      }

      // console.log(results);
      console.log("Deleted");
      res.redirect('/performanceCriteria');
    });
  }
  catch (error) {
    //TODO: send a error message to the user.
    console.log(error);
    res.redirect('/performanceCriteria');
  }
});

/* EDIT home page. */
router.get('/:id/' + routes_names[2], function(req, res, next) {
  try {

    let data = {
      "from": "PERF_CRITERIA",
      "where": "perC_ID",
      "id": req.params.id
    };

    //Insert all data to the database (callback)
    general_queries.get_table_info_by_id(data, function (err, results) {

      parms.perC_Desk = results[0].perC_Desk;
      parms.outc_ID = results[0].outc_ID;
      parms.current_outcID = results[0].outc_ID;

      let data = "STUDENT_OUTCOME";

      general_queries.get_table_info(data, function (err, results) {

        parms.outc_name = results;

        if (err) {
          //HERE HAVE TO REDIRECT the user or send a error message
          throw err;
        }

        let data = {
          "from": "STUDENT_OUTCOME",
          "where": "outc_ID",
          "id": parms.current_outcID
        };

        general_queries.get_table_info_by_id(data, function (err, results) {

          console.log(results);
          parms.current_outName = results[0].outc_name;
          if (err) {
            //HERE HAVE TO REDIRECT the user or send a error message
            throw err;
          }
        });

        res.render('performanceCriteria/editPerfCrit', parms);
      });
    });
  }
  catch (error) {
    //TODO: send a error message to the user.
    console.log(error);
    res.render('performanceCriteria/editPerfCrit', parms);
  }
});

/* DETAILS home page. */
router.get('/' + routes_names[3], function(req, res, next) {
  res.render('performanceCriteria/detailPerfCrit', parms);
});

module.exports = router;
