/*
	ROUTE - /users
*/
var express = require('express');
var router = express.Router();
const api_queries = require("../helpers/queries/api");
const general_queries = require("../helpers/queries/general_queries");
const courseMappingQuery = require("../helpers/queries/courseMappingQueries");
const assessmentQuery = require("../helpers/queries/assessment");
const { get_user_by_id } = require("../helpers/queries/user_queries");
var { validate_evaluation_rubric } = require("../middleware/validate_outcome");
const table = require("../helpers/DatabaseTables");

// =============================== PERFORMANCES CRITERIA ==================================
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
// =============================== DEPARTMENT API ============================
/* 
	-- API TO GET ALL study program by Department ID -- 
	GET /api/department/get/studyPrograms/:dep
	TODO: send a resposes to user is data is not found
*/
router.get('/department/get/studyPrograms/:departmentId', async function (req, res) {

	// validating id 
	if (req.params.departmentId == undefined || isNaN(req.params.departmentId)) {
		return res.end();
	}

	let dept_ID = req.params.departmentId;

	let data = { "from": table.study_program, "where": "dep_ID", "id": dept_ID };

	// get std program
	let study_programs = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("ERROR: ", err);
	});

	// validate std program
	if (study_programs == undefined || study_programs.length == 0) {
		return res.end();
	}

	let record = [];

	// convert in dt
	study_programs.forEach(row => {
		record.push({ "name": row["prog_name"], "value": row["prog_ID"] });
	});

	// return
	res.json(record);
});

/*
	-- API get the department information -- 
	GET /api/get/department/:id
*/
router.get('/get/department/:id', async function (req, res) {

	// validating
	if (req.params.id == undefined || isNaN(req.params.id)) {
		return res.end();
		// return res.redirect(base_url);
	}

	let tabla_data = { "from": table.department, "where": "dep_ID", "id": req.params.id };

	let department = await general_queries.get_table_info_by_id(tabla_data).catch((err) => {
		console("ERROR: ", err);
	});

	if (department == undefined || department.length == 0) {
		res.json([]);
		return res.redirect(base_url);
	}

	// we only care about the first element
	department = department[0];

	// change date format 
	let date = new Date(department.date_created);
	date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

	let names = ["Name", "Description", "Date"];
	let values = [department.dep_name, department.dep_description, date];

	let record = [];
	for (let index = 0; index < names.length; index++)
		record.push({ "name": names[index], "value": values[index] })

	res.json(record);
});

// ============================================ OUTCOMES ======================================

/**
 * -- API -- 
 * GET THE OUTCOMES BY STUDY PROGRAM
 */
router.get("/get/outcomesByStudyProgramID/:programID", async function (req, res) {

	if (req.params.programID == undefined || isNaN(req.params.programID)) {
		return res.json([]);
	}

	let outcomes_query = { "from": table.student_outcome, "where": "prog_ID", "id": req.params.programID };
	let outcomes = await general_queries.get_table_info_by_id(outcomes_query).catch((err) => {
		console.log("Error getting performance: ", err);
	});

	if (outcomes == undefined || outcomes.length == 0) {
		return res.json([]);
	}

	let record = [];
	outcomes.forEach(element => {
		record.push({ "name": element["outc_name"], "value": element["outc_ID"] })
	});

	return res.json(record);
});

// ======================================== EVALUATION RUBRIC =======================================

/**
 * API - GET THE EVALUATION RUBRIC DATA TO REMOVE
 * GET - /api/get/evaluationRubric/:r_id
 */
router.get('/get/evaluationRubric/:r_id', validate_evaluation_rubric, async function (req, res) {

	rubric_to_remove = req.body["rubric"][0];

	let names = ["Name", "Description"];
	let values = [
		rubric_to_remove.rubric_name,
		rubric_to_remove.rubric_description,
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({ "name": names[index], "value": values[index] })
	}
	res.json(record);
});

/*
	-- GET all rubric by outcome id -- 
    GET /admin/api/get/rubricByOutcome/id
*/
router.get('/get/rubricByOutcome/:outcome_id', async function (req, res) {

	// validate if rubric_id is good
	if (req.params.outcome_id == undefined || isNaN(req.params.outcome_id)) {
		return res.json({ error: true, message: "Invalid Study Program ID" });
	}

	let rubric_query = { "from": table.evaluation_rubric, "where": "outc_ID", "id": req.params.outcome_id };

	let rubrics = await general_queries.get_table_info_by_id(rubric_query).catch((err) => {
		console.error(err);
	});

	// verify is user data is good
	if (rubrics == undefined || rubrics.length == 0) {
		return res.json({ error: true, message: "Cannot find any rubric" });
	}

	res.json({ error: false, message: "Success", data: rubrics });
});

// ================================================= USER ==================================
/**
 * API - GET user information By ID.
 * TODO: Only admin can get this data
 * GET /api/get/user/:id
 */
router.get('/get/user/:id', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the user");
		return res.redirect(base_url);
	}

	let user_id = req.params.id;

	let user_data = await get_user_by_id(user_id).catch((err) => {
		console.log("Error getting user information: ", err);
	});

	// verify is user data is good
	if (user_data == undefined || user_data.length == 0) {
		return res.json([]);
	}

	let names = ["User Id", "Inter Id", "Name", "Last Name", "Email", "Phone Number"];
	let values = [
		user_id,
		user_data.inter_ID,
		user_data.first_name,
		user_data.last_name,
		user_data.email,
		user_data.phone_number
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({ "name": names[index], "value": values[index] })
	}

	res.json(record);
});

// ================================================= STUDY PROGRAM ======================================

/* 
	-- API TO GET study program by ID-- 
	GET /api/get/studyProgram/:id
*/
router.get('/get/studyprogram/:id', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This Study program does not exits");
		return res.redirect("back");
	}

	let std_program_id = req.params.id;

	let data = { "from": table.study_program, "where": "prog_ID", "id": std_program_id };

	// get std program
	let std_program_to_remove = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("ERROR: ", err);
	})

	// validate std program
	if (std_program_to_remove == undefined || std_program_to_remove.length == 0) {
		req.flash("error", "Cannot find study program, Please create one");
		return res.redirect(base_url);
	}
	std_program_to_remove = std_program_to_remove[0];

	let date = new Date(std_program_to_remove.date_created);
	date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

	// header of inputs
	let names = ["Name", "Department", "Date created"];
	let values = [std_program_to_remove.prog_name, std_program_to_remove.dep_ID, date];

	let record = [];
	for (let index = 0; index < names.length; index++)
		record.push({ "name": names[index], "value": values[index] })

	res.json(record);
});

/* 
	-- API GET OUTCOME BY STUDY PROGRAM ID --
	GET /api/get/outcomeByStudyProgram/:std_id
*/
router.get('/get/outcomeByStudyProgram/:id', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "Cannot find the outcome");
		return res.redirect(base_url);
	}

	// id of the study program
	let study_program_id = req.params.id;
	let get_outcomes_query = { "from": table.student_outcome, "where": "prog_ID", "id": study_program_id };

	// fetching data from db
	let outcomes = await general_queries.get_table_info_by_id(get_outcomes_query).catch((err) => {
		console.log("Error getting the information: ", err);
	});

	// verify
	if (outcomes == undefined || outcomes.length == 0) {
		return res.json([]);
	}

	// send response if it's good
	res.json(outcomes);
});

// =========================================== COURSE ===============================================

/*
	-- API get course information by id --
	GET /api/get/course/:id
*/
router.get('/get/course/:id', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		return res.json([]);
	}

	let course_id = req.params.id;

	// for query
	let data = { "from": table.course, "where": "course_ID", "id": course_id, "join": "PROG_COURSE" };

	// getting course information from db
	let course = await general_queries.get_table_info_by_id_naturalJoin(data).catch((err) => {
		console.log("Error getting the course: ", err);
	});

	// validate course
	if (course == undefined || course.length == 0) {
		return res.json([]);
	}

	// we only care about the first position
	course = course[0];

	let names = ["Study Program", "Number", "Name", "description"];
	let values = [course.prog_ID, course.course_number, course.course_name, course.course_description];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({ "name": names[index], "value": values[index] })
	}
	res.json(record);
});

/**
 * -- API GET courses by study program
 * GET /api/get/coursesbystudyprogram/:std_id
 */
router.get('/get/coursesbystudyprogram/:std_id', async function (req, res) {


	// validate if rubric_id is good
	if (req.params.std_id == undefined || isNaN(req.params.std_id)) {
		return res.json({ error: true, message: "Invalid Study Program ID" });
	}

	let courses = await api_queries.get_courses_by_study_program_id(req.params.std_id).catch((err) => {
		console.error(err);
	});

	// verify is user data is good
	if (courses == undefined || courses.length == 0) {
		return res.json({ error: true, message: "Cannot find any course" });
	}

	res.json({ error: false, message: "Success", data: courses });
});

// =========================================== OUTCOME ===============================================

/**
 * -- APIT GET outcome information by id -- 
 * GET /api/get/outcome/:id
 */
router.get('/get/outcome/:id', async function (req, res) {

	if (req.params.id == undefined || isNaN(req.params.id)) {
		return res.end();
	}

	let outcome_query = {
		"from": table.student_outcome,
		"join": table.study_program,
		"using": "prog_ID",
		"where": "outc_ID",
		"id": req.params.id
	};

	// Get outcome to remove 
	let outcome_to_remove = await general_queries.get_table_info_inner_join_by_id(outcome_query).catch((err) => {
		console.log("Error: ", err);
	});

	if (outcome_to_remove == undefined || outcome_to_remove.length == 0) {
		return res.end();
	}

	outcome_to_remove = outcome_to_remove[0];

	let names = ["Name", "Description", "Study Program", "Date created"];

	// change date format 
	let date = new Date(outcome_to_remove.date_created);
	date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;

	let values = [
		outcome_to_remove.outc_name,
		outcome_to_remove.outc_description,
		outcome_to_remove.prog_name,
		date
	];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({
			"name": names[index],
			"value": values[index]
		});
	}
	res.json(record);
});


/**
 * -- API GET all performances criteria by outcome id-- 
 * GET /api/get/performancesByOutcome/:outcomeid
 */
router.get("/get/performancesByOutcome/:outcome_id", async function (req, res) {

	// Validate outcome is a number and is not undefined
	if (req.params.outcome_id == undefined || isNaN(req.params.outcome_id)) {
		return res.json([]);
	}

	// query format
	let performance_query = {
		"from": table.performance_criteria,
		"where": "outc_ID",
		"id": req.params.outcome_id
	};

	// get the data
	let outcome_performances = await general_queries.get_table_info_by_id(performance_query).catch((err) => {
		console.log("Error getting performance: ", err);
	})

	// verify the data
	if (outcome_performances == undefined || outcome_performances.length == 0) {
		return res.json([]);
	}

	// transfor the data 
	let record = [];
	outcome_performances.forEach(element => {
		record.push({ "name": element["perC_Desk"], "value": element["perC_ID"] })
	});

	// return the data 
	return res.json(record);
});

// =========================================== TERM ===============================================

/* 
	-- SHOW TERM TO DELETE --
	GET /term/:id/remove
*/
router.get('/get/schoolterm/:id', async function (req, res) {

	// validating id 
	if (req.params.id == undefined || isNaN(req.params.id)) {
		req.flash("error", "This term don't exits");
		return res.redirect(base_url);
	}

	let term_id = req.params.id;
	let data = { "from": table.academic_term, "where": "term_ID", "id": term_id };

	let term_to_remove = await general_queries.get_table_info_by_id(data).catch((err) => {
		console.log("Error getting the term: ", err);
	});

	if (term_to_remove == undefined || term_to_remove.length == 0) {
		req.flash("error", "Cannot find the term");
		return res.redirect(base_url);
	}

	term_to_remove = term_to_remove[0];

	let names = ["Name"];
	let values = [term_to_remove.term_name];

	let record = [];
	for (let index = 0; index < names.length; index++) {
		record.push({ "name": names[index], "value": values[index] })
	}

	res.json(record);
});


// ======================================== COORDINATOR DEPARTMENT =======================================
/**
 * GET Coordinator assessments results
 * GET /api/get/departmentAssessment 
*/
router.get('/get/departmentAssessment', async function (req, res) {

	// validate data
	if (req.query == undefined || req.query.data == undefined)
		return res.json({ error: true, message: "Cannot find the data sent" });

	let data = req.query.data;


	let isInvalid = (data.study_program_id == undefined || data.study_program_id == "" || isNaN(data.study_program_id)) ||
		(data.outcome_id == undefined || data.outcome_id == "" || isNaN(data.outcome_id)) ||
		(data.term_id == undefined || data.term_id == "" || isNaN(data.term_id));

	// validate data
	if (isInvalid) {
		return res.json({ error: true, message: "Invalid Data" });
	}

	let agregado = await assessmentQuery.get_agregado_by(data.outcome_id, data.term_id).catch((err) => {
		console.error("Error getting agregado: ", err);
	});

	if (agregado == undefined || agregado.length == 0) {
		return res.json({ error: true, message: "Cannot find any data" });
	}
	
	try {
		agregado = get_structure(agregado, "assessment_ID");		
	} catch (error) {
		agregado = [];
	}

	console.log(agregado);

	return res.json({ error: false, message: "Success", data: agregado });
});

/**
 * @param {Array[Object]} data - data to convert
 * @param {String} keyId - Principal ID
 * @returns {Array[Object]}  
 */
function get_structure(data, keyId) {

	let ids = get_unique(data, keyId);

	let masterArray = []; // store all assessments
	let tempAssessments = []; // store each assessment. 

	// get all data from assessment individual
	ids.forEach(_id => {

		data.forEach(each => {

			// if id of the assessment if = to the unique id im looking for
			if (each[keyId] == _id) {

				// add the assessmet to temp assessment
				tempAssessments.push(each);
			}
		});

		// add all assessment with the same id to the master array
		masterArray.push(tempAssessments);

		// reset tempAssessment
		tempAssessments = [];
	});


	masterArray.forEach( (eachAssessment, index) => {

		let masterPerformance = [];
		let tempPerformance = [];
		eachAssessment[0]["performances"] = undefined;

		let perc = get_unique(eachAssessment, "perC_ID");

		// iter through unique performance id
		perc.forEach(_pID => {

			// performance description
			let description = undefined;

			// verify all assessment looking for the performance id
			eachAssessment.forEach(each => {
				
				if (each["perC_ID"] == _pID) {

					// add performance score to an array
					tempPerformance.push(each["row_perc_score"]);

					// update description
					description = each["perC_Desk"];
				}
			});

			masterPerformance.push({ "performanceId": _pID, "scores": tempPerformance, "description": description });
			tempPerformance = [];
		});

		// add all the important data into performances key
		eachAssessment[0]["performances"] = masterPerformance;
		
		// remove these elements from the object
		delete eachAssessment[0]["perC_ID"];
		delete eachAssessment[0]["row_ID"];
		delete eachAssessment[0]["perC_Desk"];
		delete eachAssessment[0]["row_perc_score"];

		// just save the firts assessment template
		masterArray[index] = eachAssessment[0];
	});

	return masterArray;
}

/**
 * get_unique - return an array with unique values
 * @param {Array[Object]} data - data to iter through
 * @param {String} target - key value to get unique
 */
function get_unique(data, target) {

	// iter through all assessment
	let elements = data.map(each => each[target]);

	// remove duplicates perc_ID
	elements = elements.filter(function (item, pos) {
		return elements.indexOf(item) == pos;
	});

	return elements;
}

// ======================================== COURSE MAPPING =======================================
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

	// validate mapping
	if (mapping == undefined || mapping.length == 0){
		return res.json({error: true, "message": "Cannot find any mapping data"});
	}

	// getting the outcome mapping
	let outcome_course = await courseMappingQuery.get_course_mapping(req.params.programId).catch((err) => {
		console.error("ERROR: ", err);
	});

	// validate outcome
	if (outcome_course == undefined || outcome_course.length == 0){
		return res.json({error: true, "message": "missing outcome"});
	}

	mapping = transformdt(mapping);
	current_mapping = current_course_mapping(outcome_course)
	outcome_course = transform_outcome_courses(outcome_course);

	res.json({error: false, message:"success", mapping, outcome_course, current_mapping });
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
		temp = [];
		for (let i = 0; i < outcome_course.length; i++) {
			if (ID == outcome_course[i]["course_ID"]) {
				temp.push(outcome_course[i]["outc_ID"]);
			}
		}
		arr.push({ "course_id": ID, "outcomes": temp });
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
			"outcomes": { "ids": outcomes_ids, "names": names },
			"courses": { "names": courses_name, "ids": courses_id },
		});
	});
	return temp;
}


module.exports = router;