var express = require('express');
var authHelper = require('../helpers/auth');
var router = express.Router();
var middleware = require("../middleware/validateUser");
var { db } = require("../helpers/mysqlConnection"); //pool connection
var conn = db.mysql_pool;
var query = require("../helpers/queries/course_queries");
let locals = {
    title: 'Course Mapping'
};

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
    // console.log(courses);
	res.json(courses);
});

module.exports = router;