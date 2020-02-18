var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

 /***
  * Return perfomance criterias being evaluated for an Assessment report
  * @param {Number} assessmentID -> Assessment ID
  * @returns {Promise} -> Resolves contain query results.
 */

function get_perf_criterias(assessmentID){
	return new Promise(function(resolve, reject) {
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
	return new Promise(function(resolve, reject){
		let insertData = `INSERT INTO STUDENT_PERFORMANCE(pc_1, pc_2, pc_3, pc_4, pc_5, assessment_ID) VALUES(?, ?, ?, ?, ?, ?)`;
		conn.query(insertData,data ,function (err, results) {
            if (err)
                reject(err || "Wasn't able to insert data");
            else
            	resolve(true);
        });
	});
}

module.exports.get_perf_criterias = get_perf_criterias;
module.exports.insertData = insertData;