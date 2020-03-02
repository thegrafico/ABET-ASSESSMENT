var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * insert_course_mapping ->  creates new course with outcome relation
 * @param {Number} course -> course ID
 * @param {Number} outcome -> outcome ID
 * @return {Promise} resolve with true
 */
function insert_course_mapping(course, outcome) {
    return new Promise(function (resolve, reject) {

        if (course == undefined || outcome == undefined) return reject("Empty parameters");

		// variable that defines the query
		let insert_query = `INSERT INTO OUTCOME_COURSE values(?, ?);`;

		// query to insert new a Performance Criteria
		conn.query(insert_query, [course, outcome], function (err, results, fields) {
			if (err) return reject(err);

			resolve(true);
		});
	});
}

/**
 * get_outcome_with_study_programs ->  retrieves all Outcomes with their respective Study Program IDs
 * @return {Object} -> returns object containing all Outcomes with their respective Study Program IDs
 */
function get_outcome_with_study_programs() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT outc_ID, outc_name, STUDY_PROGRAM.prog_ID
                     FROM STUDENT_OUTCOME, STUDY_PROGRAM
                     WHERE STUDENT_OUTCOME.prog_ID = STUDY_PROGRAM.prog_ID;`;
        
        conn.query(query, function(err, results) {
            if(err) return reject(err);

            resolve(results);
        });
    });
}

module.exports.insert_course_mapping = insert_course_mapping;
module.exports.get_outcome_with_study_programs = get_outcome_with_study_programs;