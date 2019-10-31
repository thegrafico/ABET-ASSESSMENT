var conn = require("../mysqlConnection").mysql_pool; //pool connection

function insert_into_report(data, callback){

  let insert_query = `insert into REPORTS
  (grade_A, grade_B, grade_C, grade_D, grade_F, UW, evaluation_comments,
    reflexion_comments, actions_comments, assessment_ID)
    values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    conn.query(insert_query, data, function(err, results){
      if (err) {
        return callback(err, null);
      }
        return callback(null, results);
    });
}

module.exports.insert_into_report = insert_into_report;
