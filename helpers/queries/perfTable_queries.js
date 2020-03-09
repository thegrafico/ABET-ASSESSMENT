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
                      FROM PERF_CRITERIA, (SELECT perC_ID
                                           FROM PERFORMANCE_RUBRIC,(SELECT rubric_ID
                                                                    FROM EVALUATION_RUBRIC
                                                                    WHERE rubric_ID = (
                                                                        SELECT rubric_ID
																	    FROM ASSESSMENT
																	    WHERE assessment_ID = ?
                                                                    )
                                                                  ) as result
                                           WHERE PERFORMANCE_RUBRIC.rubric_ID = result.rubric_ID
                                           ) as resultTwo
					  WHERE PERF_CRITERIA.perC_ID = resultTwo.perC_ID`;
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
		let insertData = `INSERT INTO STUDENT_PERFORMANCE(pc_1, pc_2, pc_3, pc_4, pc_5, assessment_ID) VALUES(?, ?, ?, ?, ?, ?)`;
		conn.query(insertData, data, function (err, results) {
			if (err)
				reject(err || "Wasn't able to insert data");
			else
				resolve(true);
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

