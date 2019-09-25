var conn = require("../mysqlConnection").mysql_pool; //pool connection

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

    let insert_query = `insert into COURSE (course_name, course_number, course_description) values(?, ?, ?);`;
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


module.exports.get_course_info = get_course_info;
module.exports.insert_into_course = insert_into_course;