var express = require('express');
var query = require("../helpers/queries/term_queries");
var general_queries = require("../helpers/queries/general_queries");
var router = express.Router();


let base_url = '/schoolTerm/'
// let routes_names = ['create', 'delete', 'edit']

//Paramns to routes links
let parms = {"title":'ABET Assessment', "base_url":base_url  };

//================================ HOME PAGE =================================
router.get('/', function(req, res, next) {

let term_table = 'ACADEMIC_TERM';

general_queries.get_table_info(term_table, function(err, results){
  //TODO: handle error
  if (err) throw err;


  parms.results = results;
  res.render('schoolTerms/schoolTerm', parms);
  });
});

//================================ CREATE TERM  =================================


router.get('/create', function(req, res, next) {
    res.render('schoolTerms/createSchoolTerm', parms);

});

router.post('/create', function(req, res, next) {

  //TODO: verify values, null, undefined
  let data = req.body.data;

	//Insert into the DB the data from user
	query.insert_into_term([data.tname], function(err, results){

		//TODO: catch error properly
		if (err) throw err;

		res.redirect(base_url);
	});
});
//==================================== REMOVE TERM =================================
router.get('/:id/remove', function (req, res) {
  //TODO: catch error in case there is not id
  let term_id = req.params.id;
  let term_table = "ACADEMIC_TERM";
  let where_attr = "term_ID";
  let data = {"from": term_table,"where":where_attr, "id":term_id};
  general_queries.get_table_info_by_id(data, function(err, results){

    //TODO: catch erro
    if (err) throw err;
    try {
      parms.term_ID = results[0].term_ID;
      res.render('schoolTerms/deleteSchoolTerm', parms);
    } catch (error) {
      res.redirect(base_url);
    }
  });
});
/* DELETE ROUTE */
router.delete('/:id', function (req, res) {
  console.log("===================DELETED ROUTE=====================");

  //TODO: catch error in case of null
  let trm_id = req.params.id;
  let table_name = "ACADEMIC_TERM";
  let where_attr = "term_ID";

  let data = {"id":trm_id, "from":table_name,"where":where_attr };

  general_queries.delete_record_by_id(data, function (err, results) {

    //TODO: catch error
    if (err) {
      throw err;
    }
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect("back");
  });
});

//========================================== EDIT TERM =====================================

router.get('/:id/edit', function(req, res, next) {
  let table_name = "ACADEMIC_TERM";
  let id_term = req.params.id;
  let where_atr = "term_ID";

  let data = {"from":table_name, "where":where_atr, "id": id_term};
  general_queries.get_table_info_by_id(data, function(err, user_results){

    //TODO: handle this err;
      parms.term_ID = id_term;
      parms.user_results = user_results[0];

      res.render('schoolTerms/editSchoolTerm', parms);
    // });
  });
});

/* EDIT home page. */
router.put('/:id', function(req, res, next) {

  //TODO: verify values befero enter to DB
  let name = req.body.data.tname;
  let term_id = req.params.id;
  // let dept_id =  req.body.data.dept_id;

  //TIENE QUE IR EN ESTE ORDEN.
  let data = [name, term_id];

  query.update_term(data, function(err, results){

    //TODO: cath this error
    if (err) throw err;

    res.redirect(base_url);
  });
});








module.exports = router;




























// //Populate parms
// routes_names.forEach(e=>{
//   parms[e] = base_url + e;
// });
// parms["title"] = 'ABET Assessment';
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('schoolTerms/schoolTerm', parms);
// });
//
//
// /* CREATE home page. */
// router.get('/' + routes_names[0], function(req, res, next) {
//   res.render('schoolTerms/createSchoolTerm', parms);
// });
//
// /* DELETE home page. */
// router.get('/' + routes_names[1], function(req, res, next) {
//   res.render('schoolTerms/deleteSchoolTerm', parms);
// });
//
// /* EDIT home page. */
// router.get('/' + routes_names[2], function(req, res, next) {
//   res.render('schoolTerms/editSchoolTerm', parms);
// });
//
