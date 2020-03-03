var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

function insert_into_report(data, callback){
//Este query manda los numeros de cuales son las notas y
//toda los comentarios que el profesor ingrese.
  let insert_query = `INSERT INTO REPORTS
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
