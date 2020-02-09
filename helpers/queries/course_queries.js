var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

function get_course_info(data, callback){

    let find_query = `Select * From ?? natural join PROG_COURSE;`;

    conn.query(find_query, data, function (err, results, fields) {
        if (err) {
            return callback(err, null);
        };
        return callback(null, results);
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


function update_course(data, callback){

    let data1 = [data.name, data.course_desc, data.course_number, data.course_id];

    let update_query = `update COURSE set course_name= ?, course_description = ?, course_number = ? where course_ID= ?`;
    console.log("Inside",data1);

    //Exe query
    conn.query(update_query, data1, function (err, results) {
        if (err) {
            return callback(err, null)
        };


        let data2 = [data.prog_id, data.course_id];
        let update_pc = `update PROG_COURSE set prog_ID= ? where course_ID= ?`;
        conn.query(update_pc, data2, function (err, results) {
            if (err) {
                return callback(err, null)
            };
            // console.log(results)
            return callback(null, results);
        });
    });
}

// function find_select_prog(data, callback){
//
//   let find_prog = `Select prog_name
//                     from PROG_COURSE natural join COURSE natural join
//                     (select prog_ID, course_ID, prog_name from PROG_COURSE natural join STUDY_PROGRAM) as STUDY
//                     where course_ID = ?;`
//                     conn.query(find_prog, data2, function (err, results) {
//                         if (err) {
//                             return callback(err, null)
//                         };
//                         // console.log(results)
//                         return callback(null, results);
//                     });
// }





module.exports.get_course_info = get_course_info;
module.exports.insert_into_course = insert_into_course;
module.exports.update_course = update_course;
