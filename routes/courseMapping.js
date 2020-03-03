var express = require('express');
var router = express.Router();
var middleware = require("../middleware/validateUser");
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
/* 
    -- ROUTE -- POST COURSES
*/
router.post('/postCourses', async function (req, res) {
    courseMapping = req.body.data;
    console.log("Course Mapping POST: ", courseMapping);
    res.status(200).send();
});

/* 
    --API-- GET COURSES
*/
router.get('/getCourses', async function (req, res) {
    let courses = await query.get_course_with_std_program_plain().catch((err) => {
        console.log("Error getting the courses with std program results: ", err);
    });

    let outcomes = await courseMappingQuery.get_outcome_with_study_programs().catch((err) => {
        console.log("Error retrieving outcomes: ", err);
    });

    let data = courses;
    data.push(outcomes);

    transformdt(outcomes);
    res.json(data);
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
        
        //sort by name
        row_outcomes.sort((a, b) => (a.outc_name > b.outc_name) ? 1 : -1)
        
        // get only the outcomes ids
        row_outcomes = row_outcomes.map(row => row.outc_ID);

        temp.push({ "prog_ID": ID, "outcomes": row_outcomes });
    });

    return temp;
}

module.exports = router;