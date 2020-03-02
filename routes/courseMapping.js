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
const base_url = '/';
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

    courses.push(transformdt(outcomes));
	res.json(courses);
});

router.post('/postCourses', async function(req, res){
    let courseMapping = [];
    courseMapping = req.body.data;

    console.log("Course Mapping POST: ", courseMapping);

    console.log("Outcome Array length: ", courseMapping[0].outcomes.length);
    console.log("Array check: ", courseMapping[0].outcomes[0]);

    // TODO: Noah R. Almeda
    // - Need to prevent duplicates
    // - Error Handling
    // - If mapping exsist, marked checked
    // - Unchecked acts as a remove

    for(let i = 0; i < courseMapping.length; i++) {
        for(let j = 0; j < courseMapping[i].outcomes.length; j++) {
            courseMappingQuery.insert_course_mapping(courseMapping[i].course_ID, courseMapping[i].outcomes[j]).then((ok) => {
                console.log("Successfully Inserted: ", courseMapping[i].course, " | " ,courseMapping[i].course_ID, " | ", courseMapping[i].outcomes[j]);
                // req.flash("success", "Course created");
                // res.redirect(base_url);
            }).catch((err) => {
                console.log("ERROR: ", err);
                req.flash("error", "Error creating the course, Contact the Admin");
                return res.redirect(base_url);
            });
        }
    }


    res.status(200).send();
});


/**
 * transformdt -> transform the data structure to a new data structure
 * @param {Array} outcomes array of element to transform
 * @returns {Array} order in ascendent
 */
function transformdt(outcomes) {    
    // getting all ids
    let ids = outcomes.map(row => row.prog_ID);

    // remove duplicates
    ids = ids.filter(function (item, pos) {
        return ids.indexOf(item) == pos;
    })

    // sort elements in ascendent order
    ids.sort(function (a, b) { return a - b });

    let temp = [];
    ids.forEach((ID) => {
        let row_outcomes = [];

        // filter only outcomes that belown to specific study program (Still we got the object)
        row_outcomes = outcomes.filter(row => row.prog_ID == ID);
        
        row_outcomes.sort((a, b) => (a.outc_name > b.outc_name) ? 1 : -1)
        
        // get only the outcomes names
        row_outcomes = row_outcomes.map(row => row.outc_ID);

        temp.push({ "prog_ID": ID, "outcomes": row_outcomes });
    });
    return temp;
}


module.exports = router;