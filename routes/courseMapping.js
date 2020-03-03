var express = require('express');
var router = express.Router();
var middleware = require("../middleware/validateUser");
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
    let courseOutcome = await courseMappingQuery.get_course_outcomes().catch((err) => {
        console.log("Error getting IDs: ", err);
    });

    let courses = await query.get_course_with_std_program_plain().catch((err) =>{
		console.log("Error getting the courses with std program results: ", err);
    });

    let outcomes = await courseMappingQuery.get_outcome_with_study_programs().catch((err) => {
        console.log("Error retrieving outcomes: ", err);
    });

    courses.push(sortOutcomesByCourse(courseOutcome));
    courses.push(transformdt(outcomes));
	res.json(courses);
});

router.post('/postCourses', async function(req, res){
    let courseMapping = [];
    courseMapping = req.body.data;

    console.log("Course Mapping POST: ", courseMapping);

    // TODO: Noah R. Almeda
    // - Need to prevent duplicates (Done, this is done by a database constraint)
    // - Error Handling
    // - If mapping exsist, marked checked
    // - Unchecked acts as a remove

    for(let i = 0; i < courseMapping.length; i++) {
        if(undefined !==  courseMapping[i].outcomes && courseMapping[i].outcomes.length) {
            for(let j = 0; j < courseMapping[i].outcomes.length; j++) {
                courseMappingQuery.insert_course_mapping(courseMapping[i].course_ID, courseMapping[i].outcomes[j]).then((ok) => {
                    console.log("Successfully Inserted: ", courseMapping[i].course, " | " ,courseMapping[i].course_ID, " | ", courseMapping[i].outcomes[j]);
                    // req.flash("success", "Course created");
                    // res.redirect(base_url);
                }).catch((err) => {
                    console.log("ERROR: ", err);
                    req.flash("error", "Course already already has those outcomes assigned.");
                    return res.redirect(base_url);
                });
            }
        }
        else {
            continue;
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
        
        //sort by name
        row_outcomes.sort((a, b) => (a.outc_name > b.outc_name) ? 1 : -1)
        
        // get only the outcomes ids
        row_outcomes = row_outcomes.map(row => row.outc_ID);

        temp.push({ "prog_ID": ID, "outcomes": row_outcomes });
    });
    return temp;
}

/**
 * sortOutcomesByCourse -> transform the data structure to a new data structure
 * @param {Array} outcomes array of element to transform
 * @returns {Array} order in ascendent
 */
function sortOutcomesByCourse(courseOutcome) {
    let ids = courseOutcome.map(row => row.course_ID);

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
        row_outcomes = courseOutcome.filter(row => row.course_ID == ID);
        
        // get only the outcomes names
        row_outcomes = row_outcomes.map(row => row.outc_ID);

        temp.push({ "course_ID": ID, "outcomes": row_outcomes });
    });
    return temp;
}

module.exports = router;