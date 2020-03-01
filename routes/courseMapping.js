var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var middleware = require("../middleware/validateUser");
var { db } = require("../helpers/mysqlConnection"); //pool connection
var conn = db.mysql_pool;
var query = require("../helpers/queries/course_queries");
var courseMappingQuery = require("../helpers/queries/courseMappingQueries");
let locals = {
    title: 'Course Mapping'
};
let courseMapping = [];
/* 
    GET INDEX ROUTE
*/

router.get('/', async function (req, res) {
	res.render('courseMapping/home', locals);
});

router.get('/getCourses', async function (req, res) {
    let courses = await query.get_course_with_std_program_plain().catch((err) =>{
		console.log("Error getting the courses with std program results: ", err);
    });
    
    let outcomes = await courseMappingQuery.get_outcome_with_study_programs().catch((err) => {
        console.log("Error retrieving outcomes: ", err);
    });

    let data = courses;
    data.push(outcomes);

    console.log(data);
	res.json(data);
});

router.post('/postCourses', async function(req, res){
    courseMapping = req.body.data;
    console.log("Course Mapping POST: ", courseMapping);
    res.status(200).send();
});

module.exports = router;