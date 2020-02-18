var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

/**
 * get_rubric_info ->  Get all rubric information
 * @param {Number} id -> id of the rubric 
 * @return {Promise} resolve with all rubric info
 */
function get_rubric_info(id){
  
	return new Promise(function(resolve, reject){
		
		// get all rubric data using id 
		let find_query = `SELECT * FROM ABET.EVALUATION_RUBRIC WHERE outc_ID IN 
						(SELECT outc_ID FROM ABET.STUDENT_OUTCOME WHERE prog_ID = ?);`;
		
		// exe query
		conn.query(find_query, [id], function (err, results, fields) {
			if (err)
				reject(err || "Error getting rubric info");
			else
				resolve(results);
		});
	});
}

/**
 * get_course_info ->  get all course information
 * @param {Number} id -> program id  
 * @return {Promise} resolve with all course info
 */
function get_course_info(id){

	return new Promise(function(resolve, reject){
		let find_query = `Select * FROM ABET.COURSE where
		course_ID IN (Select course_ID From ABET.PROG_COURSE WHERE PROG_ID = ?);`;

		conn.query(find_query, [id],function (err, results, fields) {
			if (err)
				reject(err || "Error getting all courses information");
			else
				resolve(results);
		});
	});

}

/**
 * insert_assessment ->  insert an assessment
 * @param {Array} data -> array  of Number with [couser_id, term_id, user_id, rubric_id]  
 * @return {Promise} resolve with true 
 */
function insert_assessment(data){

	return new Promise(function(resolve, reject){

		let find_query = `INSERT INTO ABET.ASSESSMENT (course_ID, term_ID, user_ID, rubric_ID)
		VALUES (?, ?, ?, ?)`;

		conn.query(find_query, data,function(err,results,fields){
			if (err)
				reject(err || "Error inserting assessment");
			else
				resolve(results.insertId);
		});
	});
}

module.exports.get_rubric_info = get_rubric_info;
module.exports.get_course_info = get_course_info;
module.exports.insert_assessment = insert_assessment;
