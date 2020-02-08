var conn = require("../mysqlConnection").mysql_pool; //pool connection

function get_rubric_info(data,callback){


  let find_query = `SELECT * FROM ABET.EVALUATION_RUBRIC
   where outc_ID IN (SELECT outc_ID FROM ABET.STUDENT_OUTCOME where prog_ID = ?);`;


  conn.query(find_query,data,function (err, results, fields) {
    if (err){
      return callback(err, null)
    }
    return callback(null, results);

  });
}

function get_course_info(data,callback){


  let find_query = `Select * FROM ABET.COURSE where
  course_ID IN (Select course_ID From ABET.PROG_COURSE WHERE PROG_ID = ?);`;


  conn.query(find_query,data,function (err, results, fields) {
    if (err){
      return callback(err, null)
    }
    return callback(null, results);

  });
}

function insert_assessment(data,callback){

console.log(data)
let find_query = `INSERT INTO ABET.ASSESSMENT (course_ID, term_ID, user_ID, rubric_ID)
VALUES (?, ?, ?, ?)`;

conn.query(find_query,data,function(err,results,fields){
  if (err){
    return callback(err, null)
  }
  return callback(null, results);
})

}



module.exports.get_rubric_info = get_rubric_info;
module.exports.get_course_info = get_course_info;
module.exports.insert_assessment = insert_assessment;
