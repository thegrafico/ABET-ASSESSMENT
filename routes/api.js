/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
const api_queries = require("../helpers/queries/api");
const general_queries = require("../helpers/queries/general_queries");
const courseMappingQuery = require("../helpers/queries/courseMappingQueries");

/*
	-- GET all performance criteria from rubric -- 
	GET /users
*/
router.get('/evaluationRubric/get/performances/:rubric_id', async function (req, res) {

	// validate if rubric_id is good
	if (req.params.rubric_id == undefined || isNaN(req.params.rubric_id)) {
		return res.end();
	}

	let performances = await api_queries.get_performance_from_rubric(req.params.rubric_id).catch((err) => {
		console.error(err);
	});

	// verify is user data is good
	if (performances == undefined || performances.length == 0) {
		return res.json([]);
	}

	res.json(performances);
});

/*
	-- GET all performance criteria from rubric -- 
	GET /users
*/
router.get('/get/coursesbystudyprogram/:std_id', async function (req, res) {


	// validate if rubric_id is good
	if (req.params.std_id == undefined || isNaN(req.params.std_id)) {
		return res.json({error: true, message: "Invalid Study Program ID"});
	}

	let courses = await api_queries.get_courses_by_study_program_id(req.params.std_id).catch((err) => {
		console.error(err);
    });
    
	// verify is user data is good
	if (courses == undefined || courses.length == 0) {
		return res.json({error: true, message: "Cannot find any course"});
	}

	res.json({error: false, message:"Success", data: courses});
});

/*
	-- GET all rubric by outcome id -- 
    GET /admin/api/get/rubricByOutcome/id
*/
router.get('/get/rubricByOutcome/:outcome_id', async function (req, res) {

	// validate if rubric_id is good
	if (req.params.outcome_id == undefined || isNaN(req.params.outcome_id)) {
		return res.json({error: true, message: "Invalid Study Program ID"});
	}

    let rubric_query = {"from": "EVALUATION_RUBRIC", "where": "outc_ID", "id": req.params.outcome_id};
    
    let rubrics = await general_queries.get_table_info_by_id(rubric_query).catch((err) => {
		console.error(err);
    });

	// verify is user data is good
	if (rubrics == undefined || rubrics.length == 0) {
		return res.json({error: true, message: "Cannot find any rubric"});
	}

	res.json({error: false, message:"Success", data: rubrics});
});


/**
 *  GET course_mapping data
 */
router.get('/courseMapping/get/:programId', async function (req, res) {

	// validate ID
	if (req.params.programId == undefined || isNaN(req.params.programId)) {
		return res.end();
	}

	let mapping = await courseMappingQuery.get_mapping_by_study_program(req.params.programId).catch((err) => {
		console.error("ERROR: ", err);
    });

    // getting the outcome mapping
    let outcome_course = await courseMappingQuery.get_course_mapping(req.params.programId).catch((err) =>{
        console.error("ERROR: ", err);
    });

    mapping = transformdt(mapping);
    current_mapping = current_course_mapping(outcome_course)
    outcome_course = transform_outcome_courses(outcome_course);

    // console.log(outcome_course);
    // console.log(mapping);

	res.json({mapping, outcome_course, current_mapping});
});

/**
 * transform_outcome_courses -> transform the data structure to a new data structure
 * @param {Array} outcome_course array of element to transform
 * @returns {Array} array of object
 */
function transform_outcome_courses(outcome_course) {
    let temp = [];
    outcome_course.forEach(e => {
        temp.push(`${e["outc_ID"]},${e["course_ID"]}`);
    });
    return temp;
}

function current_course_mapping(outcome_course) {
    let courses_id = outcome_course.map(e => e.course_ID);

    // remove duplicates
    courses_id = courses_id.filter(function (item, pos) {
        return courses_id.indexOf(item) == pos;
    });

    let temp = [];
    let arr = [];
    courses_id.forEach(ID => {
        temp  = [];
        for (let i = 0; i < outcome_course.length; i++) {
            if (ID == outcome_course[i]["course_ID"]){
                temp.push(outcome_course[i]["outc_ID"]);
            }
        }
        arr.push({"course_id": ID, "outcomes": temp});
    });
    return arr;
}

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

    // sort elements in ascendent order NUMBERS
    ids.sort(function (a, b) { return a - b });

    let temp = [];
    ids.forEach((ID) => {
        let row_outcomes = [];
        let courses_name = [];

        // filter only outcomes that belown to specific study program (Still we got the object)
        row_outcomes = outcomes.filter(row => row.prog_ID == ID);

        //sort by name
        row_outcomes.sort((a, b) => (a.outc_name > b.outc_name) ? 1 : -1)

        // get only the outcomes ids
        outcomes_ids = row_outcomes.map(row => row.outc_ID);

        // remove duplicates outcomes
        outcomes_ids = outcomes_ids.filter(function (item, pos) {
            return outcomes_ids.indexOf(item) == pos;
        });

        //get outcome_names
        outcomes_names = row_outcomes.map(row => [row.outc_name, row.outc_ID]);

        // Getting only the name. Como ya todo está sort, los nombres que me dan aqui estan sort.
        let names = [];
        outcomes_ids.forEach(ID => {
            let i = 0;
            while (i < outcomes_names.length) {
                if (outcomes_names[i][1] == ID) {
                    names.push(outcomes_names[i][0]);
                    break;
                }
                i++;
            }
        });

        // get only the name of the courses
        courses_name = row_outcomes.map(row => row.course_name);

        // remove duplicates outcomes
        courses_name = courses_name.filter(function (item, pos) {
            return courses_name.indexOf(item) == pos;
        });

        // get course name and id in two dimentional array
        let courses_id_name = row_outcomes.map(row => [row.course_ID, row.course_name]);

        // Getting only the name. Como ya todo está sort, los nombres que me dan aqui estan sort.
        let courses_id = [];
        courses_name.forEach(NAME => {
            let i = 0;
            while (i < courses_id_name.length) {
                if (courses_id_name[i][1] == NAME) {
                    courses_id.push(courses_id_name[i][0]);
                    break;
                }
                i++;
            }
        });

        temp.push({
            "prog_ID": ID,
            "outcomes": {"ids": outcomes_ids, "names":names },
            "courses": {"names": courses_name, "ids":courses_id},
        });
    });
    return temp;
}

module.exports = router;