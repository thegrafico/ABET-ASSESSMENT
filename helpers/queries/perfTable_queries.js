var conn = require("../mysqlConnection").mysql_pool; //pool connection

 /***
  * Return perfomance criterias being evaluated for an Assessment report
  * Parameters is the assessment ID
 */

function get_perf_criterias(assessmentID ,callback){
  let findPerfCrit = `SELECT perC_Desk
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
  try {
      conn.query(findPerfCrit,[assessmentID] ,function (err, results, fields) {

          if (err) {
              return callback(err, null)
          };
          return callback(null, results);
      });
  } catch (error) {
      // console.log("ERROR IN get_table_info_id");
      return callback(error, null);
  }
}

module.exports.get_perf_criterias = get_perf_criterias;
