var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

/***
 * Return perfomance criterias being evaluated for an Assessment report
 * @param {Number} assessmentID -> Assessment ID
 * @returns {Promise} -> Resolves contain query results.
*/
function get_perf_criterias(assessmentID) {
	return new Promise(function (resolve, reject) {
		let findPerfCrit = `SELECT *
							FROM (
									SELECT STUDENT_OUTCOME.outc_ID, outc_name, perC_order, perC_ID, perC_Desk
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
							WHERE OutcomeResults.perC_ID = resultTwo.perC_ID;`;
		conn.query(findPerfCrit, [assessmentID], function (err, results) {
			if (err)
				reject(err || "Error retreiving performance criterias.");
			else
				resolve(results);
		});
	});
}

/***
 * Insert students evaluation results to STUDENT_PERFORMANCE table
 * @param {Array} data -> Array that contains each of the perfomance criterias score and the assessment ID
 * @returns {Promise} -> Returns true if query was able to insert the data
*/
function insertData(data) {
	return new Promise(function (resolve, reject) {
		let insertData = `INSERT INTO EVALUATION_ROW(row_ID, assessment_ID) VALUES(?, ?);`;
		conn.query(insertData, data, function (err, results) {
			if (err)
				reject(err || "Wasn't able to insert data");
			else
				resolve(true);
		});
	});
}

/**
 * Deletes all row with {x} Assessment ID from EVALUATION_ROW
 * @param {number} assessmentID -> Assessment ID which you want to eliminate.
 * @returns {Promise} -> Returns true if query was successful.
*/
function deleteRowWithAssessmentID(assessmentID) {
	return new Promise(function(resolve, reject) {
		let deleteData = `DELETE FROM EVALUATION_ROW WHERE assessment_ID = ?;`
		conn.query(deleteData, assessmentID, function(err, results) {
			if(err) reject(err || "Wasn't able to delete data.");
			else resolve(true);
		});
	});
}

/**
 * get_study_program_by_user_id - get all study program by user
 * @param {Number} id - Id of the user
 * @return {Promise} Resolve with all study programs
 */
function get_study_program_by_user_id(id) {
	return new Promise(function (resolve, reject) {

		// verify user ID
		if (id == undefined || isNaN(id)) {
			return reject("User id only can be a number");
		}

		let std_query = `SELECT USER.user_ID, STUDY_PROGRAM.prog_ID, STUDY_PROGRAM.prog_name
		FROM USER INNER JOIN USER_DEP USING (user_ID)
		INNER JOIN STUDY_PROGRAM ON STUDY_PROGRAM.dep_ID = USER_DEP.dep_ID
		WHERE USER.user_ID = ?
		ORDER BY STUDY_PROGRAM.prog_name ASC`;

		conn.query(std_query, [id], function (err, results) {
			if (err)
				reject(err);
			else
				resolve(results);
		});
	});
}

/**
 * get_department_by_user_id - get all departments by user
 * @param {Number} id - Id of the user
 * @return {Promise} Resolve with all departments
 */
function get_department_by_user_id(user_id) {
	return new Promise(function (resolve, reject) {
		if (user_id == undefined || isNaN(user_id)){
			return reject("Invalid user id");
		}

		let user_dep_query = `SELECT DEPARTMENT.dep_ID, DEPARTMENT.dep_name FROM USER INNER JOIN USER_DEP USING(user_ID)
		INNER JOIN DEPARTMENT ON USER_DEP.dep_ID = DEPARTMENT.dep_ID
		WHERE USER.user_ID = ?;`

		conn.query(user_dep_query, [user_id], function (err, results) {
			if (err)
				reject(err);
			else
				resolve(results);
		});
	});
}

module.exports.get_perf_criterias = get_perf_criterias;
module.exports.insertData = insertData;
module.exports.get_study_program_by_user_id = get_study_program_by_user_id;
module.exports.get_department_by_user_id = get_department_by_user_id;
module.exports.deleteRowWithAssessmentID = deleteRowWithAssessmentID;