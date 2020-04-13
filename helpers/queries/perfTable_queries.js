
const table = require("../DatabaseTables");
var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;
let tables = require("../DatabaseTables");

/***
 * Return perfomance criterias being evaluated for an Assessment report
 * @param {Number} assessmentID -> Assessment ID
 * @returns {Promise} -> Resolves contain query results.
*/
function get_perf_criterias(assessmentID) {
	return new Promise(function (resolve, reject) {
		let findPerfCrit = `SELECT *
							FROM (
									SELECT STUDENT_OUTCOME.outc_ID, outc_name, perC_order, perC_ID, perC_Desk, STUDENT_OUTCOME.outc_description
									FROM STUDENT_OUTCOME, PERF_CRITERIA
									WHERE STUDENT_OUTCOME.outc_ID = PERF_CRITERIA.outc_ID) as OutcomeResults, (
																												SELECT perC_ID
																												FROM PERFORMANCE_RUBRIC, (
																																			SELECT rubric_ID
																																			FROM EVALUATION_RUBRIC
																																			WHERE rubric_ID = (
																																								SELECT rubric_ID
																																								FROM ASSESSMENT
																																								WHERE assessment_ID = ?
																																			)) as result
																												WHERE PERFORMANCE_RUBRIC.rubric_ID = result.rubric_ID) as resultTwo
							WHERE OutcomeResults.perC_ID = resultTwo.perC_ID
							ORDER BY perC_order;`;
		conn.query(findPerfCrit, [assessmentID], function (err, results) {
			if (err)
				reject(err || "Error retreiving performance criterias.");
			else
				resolve(results);
		});
	});
}

/**
 * deletePrevEntry() -> function that deletes all of the previous entries corresponding to a specific Assessment ID
 * @param {Number} -> Assessment ID
*/
function deletePrevEntry(assessment_ID) {
	return new Promise((resolve, reject) => {
		let deletePrevEntry = `DELETE FROM ${table.evaluation_row} WHERE ${table.evaluation_row}.assessment_ID = ?;`;

		conn.query(deletePrevEntry, assessment_ID, (err, results) => {
			if (err) { reject(err); }
			else resolve(true);
		});
	});
}

/**
 * getEvaluationByID() -> function that retrieve all entries from a specific Assessment ID
 * @param {Number} -> Assessment ID
 * @resolve {Object} -> when resolve it returns all row entries inserted from assessment ID inserted.
*/
function getEvaluationByID(assessmentID) {
	return new Promise(function (resolve, reject) {
		if (assessmentID == undefined || isNaN(assessmentID)) {
			return reject("Error with the asessment ID");
		}

		let getEvaluation = `SELECT *
		FROM  
		(SELECT ROW_PERC.row_ID, perC_ID, row_perc_score, assessment_ID 
		FROM ROW_PERC INNER JOIN EVALUATION_ROW WHERE ROW_PERC.row_ID = EVALUATION_ROW.row_ID 
		AND EVALUATION_ROW.assessment_ID = ?) as eval
		INNER JOIN (SELECT PERF_CRITERIA.perC_order, PERF_CRITERIA.perC_ID FROM PERF_CRITERIA) 
		as performance ON performance.perC_ID = eval.perC_ID;`;

		// exe query
		conn.query(getEvaluation, [assessmentID], function (err, results) {
			if (err)
				reject(err);
			else {
				resolve(results);
			}
		});
	});
}

/**
 * Deletes all row with {x} Assessment ID from EVALUATION_ROW
 * @param {number} assessmentID -> Assessment ID which you want to eliminate.
 * @returns {Promise} -> Returns true if query was successful.
*/
function deleteRowWithAssessmentID(assessmentID) {
	return new Promise(function (resolve, reject) {
		let deleteData = `DELETE FROM ${table.evaluation_row} WHERE assessment_ID = ?;`
		conn.query(deleteData, assessmentID, function (err, results) {
			if (err) reject(err || "Wasn't able to delete data.");
			else resolve(true);
		});
	});
}

/**
 * insert_professor_input - Create a new report with the course information
 * @param {Object} grades - all grades {"A", "B", "C", "D", "F", "UW"}
 * @param {Object} course_info - course information {results, modification, reflection, improvement}
 * @return {Promise} Resolve with true
 */
function insert_professor_input(id, grades, course_info) {
	return new Promise(function (resolve, reject) {

		let insert_query = `INSERT INTO REPORTS 
		(grade_A, grade_B, grade_C, grade_D, grade_F, UW, 
		course_results, course_reflection, course_actions, course_modification, result_outcome, assessment_ID)
		values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

		let data = [
			grades.A,
			grades.B,
			grades.C,
			grades.D,
			grades.F,
			grades.W,
			course_info.results,
			course_info.reflection,
			course_info.improvement,
			course_info.modification,
			course_info.result_outcome,
			id
		];

		conn.query(insert_query, data, function (err, results) {
			if (err)
				reject(err);
			else
				resolve(true);
		});
	});
}

/**
 * update_professor_input - Update report with the course information
 * @param {Object} grades - all grades {"A", "B", "C", "D", "F", "UW"}
 * @param {Object} course_info - course information {results, modification, reflection, improvement}
 * @return {Promise} Resolve with true
 */
function update_professor_input(id, grades, course_info) {
	return new Promise(function (resolve, reject) {

		let insert_query = `UPDATE REPORTS SET grade_A = ?, grade_B = ?, grade_C = ?, grade_D = ?, grade_F =?,
		UW = ?, course_results = ?, course_reflection = ?, course_actions = ?, course_modification = ?, result_outcome = ?
		WHERE assessment_ID = ?`;

		let data = [
			grades.A,
			grades.B,
			grades.C,
			grades.D,
			grades.F,
			grades.W,
			course_info.results,
			course_info.reflection,
			course_info.improvement,
			course_info.modification,
			course_info.result_outcome,
			id
		];

		conn.query(insert_query, data, function (err, results) {
			if (err)
				reject(err);
			else
				resolve(true);
		});
	});
}

/**
 * update_status -Update the status of the course
 * @param {Number} id - id of the assessment
 * @param {String} status - status of the assessment
 * @return {Promise} Resolve with true
 */
function update_status(id, status) {
	return new Promise(function (resolve, reject) {

		let update_query = `UPDATE ${tables.assessment} SET status = ? WHERE assessment_ID = ?`;

		conn.query(update_query, [status, id], function (err, results) {
			if (err)
				reject(err);
			else
				resolve(true);
		});
	});
}

/**
 * get_report_header -Get the header report of the assessment report
 * @param {Number} assessment_id - id of the assessment
 * @return {Promise} Resolve with true
 */
function get_report_header(assessment_id) {
	return new Promise(function (resolve, reject) {

		let get_query = `SELECT ASSESSMENT.name, ASSESSMENT.course_section, USER.first_name, COURSE.course_name, 
		EVALUATION_RUBRIC.rubric_name, STUDENT_OUTCOME.outc_name, STUDENT_OUTCOME.outc_description,
		STUDY_PROGRAM.prog_name, DEPARTMENT.dep_name, ACADEMIC_TERM.term_name, 
		COURSE.course_number, USER.last_name, COURSE.course_description, PERF_CRITERIA.perC_Desk, PERF_CRITERIA.perC_order
		FROM ASSESSMENT
		INNER JOIN USER USING(user_ID)
		INNER JOIN ACADEMIC_TERM USING (term_ID)
		INNER JOIN COURSE ON ASSESSMENT.course_ID = COURSE.course_ID
		INNER JOIN EVALUATION_RUBRIC ON ASSESSMENT.rubric_ID = EVALUATION_RUBRIC.rubric_ID
		INNER JOIN STUDENT_OUTCOME ON EVALUATION_RUBRIC.outc_ID = STUDENT_OUTCOME.outc_ID
		INNER JOIN STUDY_PROGRAM ON STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID
		INNER JOIN DEPARTMENT ON STUDY_PROGRAM.dep_ID = DEPARTMENT.dep_ID
        INNER JOIN PERFORMANCE_RUBRIC ON PERFORMANCE_RUBRIC.rubric_ID = EVALUATION_RUBRIC.rubric_ID
        INNER JOIN PERF_CRITERIA ON PERF_CRITERIA.perC_ID = PERFORMANCE_RUBRIC.perC_ID
		WHERE ASSESSMENT.assessment_ID = ?	
        ORDER BY PERF_CRITERIA.perC_order ASC`;

		conn.query(get_query, [assessment_id], function (err, results) {
			if (err)
				reject(err);
			else
				resolve(results);
		});
	});
}

/**
 * addGraph() => Function that insert base_64 code to GRAPH table
 * @param {Number} assessment_ID => assessment ID
 * @param {String} base_64 => base_64 code of the graph
 * @return {Promise} Resolve with true
*/
function addGraph(assessment_ID, base_64) {
	return new Promise((resolve, reject) => {
		let addGraph = `INSERT INTO ${tables.assessment_graph} (assessment_ID, base_64) VALUES (?, ?);`;

		conn.query(addGraph, [assessment_ID, base_64], (err, results) => {
			if (err)
				reject(false);
			else
				resolve(true);
		});
	});
}

/**
 * updateGraph() => Function that updates the base_64 for the assessment
 * @param {Number} assessment_ID => assessment ID
 * @param {String} base_64 => base_64 code of the graph
 * @return {Promise} Resolve with true
*/
function updateGraph(assessment_ID, base_64) {
	return new Promise((resolve, reject) => {
		let updateGraph = `UPDATE ${tables.assessment_graph} SET base_64 = ? WHERE assessment_ID = ?;`;

		conn.query(updateGraph, [base_64, assessment_ID], (err, results) => {
			if (err)
				reject(err);
			else
				resolve(true);
		});
	});
}

/**
 * getGraph() => Function that returns assessment base_64 of the graph
 * @param {Number} assessment_ID => assessment ID
 * @returns {Promise} => Returns base_64 code of the assessment ID
*/
function getGraph(assessment_ID) {
	return new Promise((resolve, reject) => {
		let getGraph = `SELECT base_64 FROM ${tables.assessment_graph} WHERE assessment_ID = ?;`;

		conn.query(getGraph, [assessment_ID], function (err, results) {
			if (err)
				reject(err);
			else {
				resolve(results);
			}
		});
	});
}

module.exports.update_status = update_status;
module.exports.get_report_header = get_report_header;
module.exports.get_perf_criterias = get_perf_criterias;
module.exports.deleteRowWithAssessmentID = deleteRowWithAssessmentID;
module.exports.insert_professor_input = insert_professor_input;
module.exports.update_professor_input = update_professor_input;
module.exports.deletePrevEntry = deletePrevEntry;
module.exports.getEvaluationByID = getEvaluationByID;
module.exports.addGraph = addGraph;
module.exports.updateGraph = updateGraph;
module.exports.getGraph = getGraph;