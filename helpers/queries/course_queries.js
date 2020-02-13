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


// {
//     prog_id: '51',
//     crnumber: 'COEN 900',
//     crname: 'Computer Archic',
//     description: 'Yeckle'
//   }
/**
 * insert_into_course - Create a new record of the course
 * @param {Object} data -> {"prog_id", "crnumber", "crname", "course_decr" } 
 * @return {Promise} resolve with all profiles
 */
function insert_into_course(data){

   
    let create_course_promise = new Promise(function(resolve, reject){
        let insert_query = `insert into COURSE (course_number, course_name, course_description) values(?, ?, ?);`;
        
        conn.query(insert_query, [data.crnumber, data.crname, data.course_decr], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results.insertId);
            
        });
    });

    create_course_promise.then((new_course_id) => {
        
        let insert_prog_course = `insert into PROG_COURSE (course_ID, prog_ID) values(?, ?);`;

        conn.query(insert_prog_course, [new_course_id, data.prog_id], function (err, results) {
            
            if (err) throw err;

            console.log("Course Created");
        });

    }).catch((err) => {
        console.log("ERROR updating the coyrse")
    });
    
}

/**
 * update_course - Update the course information
 * @param  {Object} data {"crname", "crdescr", "crnumber", "ID", std_program}
 * @return {Promise} resolve with results of database
 */
function update_course(data){

    
    // promise updating course
    let editing_course  = new Promise( function(resolve, reject){

        let update_query = `update COURSE set course_name= ?, course_description = ?, course_number = ? where course_ID = ?`;

        // Update course
        conn.query(update_query, [data.crname, data.crdescr, data.crnumber, data.ID], function (err, results) {
            if (err)
                reject(err || "Error updating the course");
            else
                resolve(true);
        });
    });

    // Promise for update the std program
    let editing_program_course = new Promise(function(resolve, reject){
        let update_pc = `UPDATE PROG_COURSE SET prog_ID = ? WHERE course_ID= ?`;
        conn.query(update_pc, [data.std_program, data.ID], function (err, results) {
            if (err)
                reject(err || "Error updating the Program ID");
            else
                resolve(true);
        });
    });

    // run promise 1 and 2
    Promise.all([editing_course, editing_program_course]).then(function([course_was_edited, program_was_edited]){

        if (course_was_edited && program_was_edited){
            console.log("Course was edited successfully");
        }else
            console.log("Error updating the Program course");
    }).catch((err) => {
        console.log(err);
    });
}

module.exports.get_course_info = get_course_info;
module.exports.insert_into_course = insert_into_course;
module.exports.update_course = update_course;
