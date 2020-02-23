var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * get_course_info - Get the course information
 * @return {Promise} resolve with all profiles
 */
function get_course_info(){
    return new Promise(function(resolve, reject){

        let find_query = `SELECT * FROM course 
        INNER JOIN  prog_course on course.course_ID = prog_course.course_ID
        INNER JOIN study_program on prog_course.prog_ID = study_program.prog_ID;`;

        conn.query(find_query, function (err, results, fields) {
            if (err)
                reject(err || "Cannot get the course information");
            else
                resolve(results);
        });
    });  
}

/**
 * insert_into_course - Create a new record of the course
 * @param {Object} data -> {"prog_id", "number", "name", "description" } 
 * @return {Promise} resolve with all profiles
 */
function insert_into_course(data){
    return new Promise(function(resolve, reject){
        let insert_query = `insert into COURSE (course_number, course_name, course_description) values(?, ?, ?);`;
        
        conn.query(insert_query, [data.number, data.name, data.description], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results.insertId);        
        });
    });
}

/**
 * insert_program_course - set the course study program
 * @param {Number} course_id of the new course 
 * @param {Number} program_id of the study program
 * @return {Promise} resolve with all profiles
 */
function insert_program_course(course_id, program_id){

    return new Promise(function(resolve, reject){
        let insert_prog_course = `insert into PROG_COURSE (course_ID, prog_ID) values(?, ?);`;

        conn.query(insert_prog_course, [course_id, program_id], function (err, results) {
            
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });

}
/**
 * update_course - Update the course information
 * @param  {Object} data {"name", "description", "number", "id", "program_id"}
 * @return {Promise} resolve with results of database
 */
function update_course(data){

    
    // promise updating course
    let editing_course  = new Promise( function(resolve, reject){

        let update_query = `update COURSE set course_name= ?, course_description = ?, course_number = ? where course_ID = ?`;

        // Update course
        conn.query(update_query, [data.name, data.description, data.number, data.id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });

    // Promise for update the std program
    let editing_program_course = new Promise(function(resolve, reject){
        let update_pc = `UPDATE PROG_COURSE SET prog_ID = ? WHERE course_ID= ?`;
        conn.query(update_pc, [data.prog_id, data.id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });

    // run promise 1 and 2
    Promise.all([editing_course, editing_program_course]).then(function([course_was_edited, program_was_edited]){
        console.log("Course was edited successfully");
    }).catch((err) => {
        console.log("THERE IS AN ERROR: ", err);
    });
}

module.exports.get_course_info = get_course_info;
module.exports.insert_into_course = insert_into_course;
module.exports.update_course = update_course;
module.exports.insert_program_course = insert_program_course;
