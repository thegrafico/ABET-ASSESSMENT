var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * get_course_with_std_program - Get all course with respective study program
 * @return {Promise} resolve with all profiles
 */
function get_course_with_std_program() {
    return new Promise(function(resolve, reject) {

        let find_query = `SELECT * FROM COURSE 
        INNER JOIN  PROG_COURSE on COURSE.course_ID = PROG_COURSE.course_ID
        INNER JOIN STUDY_PROGRAM on PROG_COURSE.prog_ID = STUDY_PROGRAM.prog_ID;`;

        conn.query(find_query, function (err, results, fields) {
            if (err)
                return reject(err || "Cannot get the course information");
            
            if (results.length == 0) return resolve(results);
            
            // remove repeated course -- only add the prog_name
            let courses = {};
            results.forEach((each_course) => {
                if ( !(each_course["course_ID"] in courses) ){
                    courses[each_course["course_ID"]] = each_course;
                }else{
                    courses[each_course["course_ID"]].prog_name += ', ' +  each_course["prog_name"];
                }
            });
            // console.log("Results: ", results);
            // console.log("MY RESULTS: ", courses);

            resolve(courses);
        });
    });  
}

/**
 * get_course_info - Get the course information
 * @return {Promise} resolve with all profiles
 */
function get_course_info(){
    return new Promise(function(resolve, reject){

        let find_query = `SELECT * FROM course`;

        conn.query(find_query, function (err, results, fields) {
            if (err)
                reject(err || "Cannot get the course information");
            else
                resolve(results);
        });
    });  
}

/**
 * get_study_program_for_course - Get the course study program
 * @param {Number} id id of the course
 * @return {Promise} resolve with all departments
 */
function get_study_program_for_course(id) {

    return new Promise(function (resolve, reject) {

        // Get all user information, including department and profile
        let query_user_info = `SELECT prog_ID FROM prog_course WHERE course_ID = ?`;

        conn.query(query_user_info, [id], function (err, results) {
            
            if (err){ return reject(err);}
            
            let course = [];            
            
            results.forEach((record) =>{
                course.push(record["prog_ID"].toString());
            });

            resolve(course);
        });
    });
}
/**
 * update_deparment ->  update department data
 * @param {Number} course_id id of the course
 * @param {Array} programs_id all id of the department
 * @return {Promise} resolve with true
 */
function remove_program_course(course_id, programs_id){

    return new Promise(function(resolve, reject){
        
        if (course_id == undefined || isNaN(course_id) ||  programs_id == undefined || programs_id.length == 0){
            return reject("Error in parameters");
        }
        
        let to_insert = [];
        
        programs_id.forEach((element) => {
            to_insert.push([course_id, element]);
        });

        let delete_query = `DELETE FROM prog_course WHERE (course_ID, prog_ID) IN (?)`;

        //Exe query
        conn.query(delete_query, [to_insert], function (err, results) {
            if (err)
                reject(err || "Error updating department");
            else            
                resolve(true);
        });
    });
}

/**
 * update_deparment ->  update department data
 * @param {Number} course_id id of the course
 * @param {Array} programs_id all id of the department
 * @return {Promise} resolve with true
 */
function insert_program_course(course_id, programs_id){

    return new Promise(function(resolve, reject){
        
        if (course_id == undefined || isNaN(course_id) ||  programs_id.length == 0){
            return reject("Error in parameters");
        }
        
        let to_insert = [];
        
        programs_id.forEach((element) => {
            to_insert.push([course_id, element]);
        });

        let set_dept_query = `INSERT INTO prog_course (course_ID, prog_ID) values ?;`;

        //Exe query
        conn.query(set_dept_query, [to_insert], function (err, results) {
            if (err)
                reject(err || "Error updating department");
            else            
                resolve(true);
        });
    });
}
/**
 * update_course - Update the course information
 * @param  {Object} data {"name", "description", "number", "id"}
 * @return {Promise} resolve with results of database
 */
function update_course(data){
    // promise updating course
    return new Promise( function(resolve, reject){

        let update_query = `update COURSE set course_name= ?, course_description = ?, course_number = ? where course_ID = ?`;

        // Update course
        conn.query(update_query, [data.name, data.description, data.number, data.id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}


function get_course_with_std_program_plain() {
    return new Promise(function(resolve, reject) {

        let find_query = `SELECT * FROM COURSE 
        INNER JOIN  PROG_COURSE on COURSE.course_ID = PROG_COURSE.course_ID
        INNER JOIN STUDY_PROGRAM on PROG_COURSE.prog_ID = STUDY_PROGRAM.prog_ID;`;

        conn.query(find_query, function (err, results, fields) {
            if (err)
                return reject(err || "Cannot get the course information");
            
            if (results.length == 0) return resolve(results);

            resolve(results);
        });
    });  
}

module.exports.get_course_with_std_program_plain = get_course_with_std_program_plain;
module.exports.get_course_info = get_course_info;
module.exports.remove_program_course = remove_program_course;
module.exports.update_course = update_course;
module.exports.insert_program_course = insert_program_course;
module.exports.get_study_program_for_course = get_study_program_for_course;
module.exports.get_course_with_std_program = get_course_with_std_program;
