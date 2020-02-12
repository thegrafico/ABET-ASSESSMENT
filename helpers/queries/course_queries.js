var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

function get_course_info(data){
    return new Promise(function(resolve, reject){

        let find_query = `Select * From ?? natural join PROG_COURSE`;

        conn.query(find_query, data, function (err, results, fields) {
            if (err)
                reject(err || "Cannot get the course information");
            else
                resolve(results);
        });
    });  
}


function insert_into_course(data, callback){

    let insert_query = `insert into COURSE (course_number, course_name, course_description) values(?, ?, ?);`;
    let insert_prog_course = `insert into PROG_COURSE (course_ID, prog_ID) values(?, ?);`;
    let prog_id_index = 3;
    conn.query(insert_query, data, function (err, results) {

        let courseid = results.insertId;

        if (err) {
            return callback(err, null);
        };
        conn.query(insert_prog_course, [courseid, data[prog_id_index]], function (err, results) {
            if (err) {
            return callback(err, null);
            }
            return callback(null, results);
          });
    });
}

/**
 * update_course - Update the course information
 * @param  {Object} data {"name", "course_description", "course_number", "course_id"}
 * @return {Promise} resolve with results of database
 */
function update_course(course, std_program){

    
    // promise updating course
    let editing_course  = new Promise( function(resolve, reject){

        let update_query = `update COURSE set course_name= ?, course_description = ?, course_number = ? where course_ID = ?`;

        // Update course
        conn.query(update_query, course, function (err, results) {
            if (err)
                reject(err || "Error updating the course");
            else
                resolve(true);
        });
    });

    // Promise for update the std program
    let editing_program_course = new Promise(function(resolve, reject){
        let update_pc = `UPDATE PROG_COURSE SET prog_ID = ? WHERE course_ID= ?`;
        conn.query(update_pc, std_program, function (err, results) {
            if (err)
                reject(err || "Error updating the Program ID");
            else
                resolve(true);
        });
    });

    // run promise 1 and 2
    Promise.all([editing_course, editing_program_course]).then(function([course_was_edited, program_was_edited]){

        if (course_was_edited){
            console.log("Course was edited");
        }else
            console.log("Error updating the course");

        if (program_was_edited)
            console.log("Program was edited");
        else
            console.log("Error updating the Program course");
    }).catch((err) => {
        console.log(err);
    });
}

module.exports.get_course_info = get_course_info;
module.exports.insert_into_course = insert_into_course;
module.exports.update_course = update_course;
