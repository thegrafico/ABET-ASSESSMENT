var { options } = require("../mysqlConnection");
var mysql = require("mysql");
var connection = mysql.createConnection(options);
connection.connect();


/**
 * create_user get Create new user
 * @param {Object} user -> {id, name, lastname, email, phoneNumber}
 * @param {Number} profile_id id of the profile
 * @param {Array} departments_id ids of departments 
 * @return {Promise} resolve with all profiles
 */
async function create_user(user, profile_id, departments_id) {


    // add user promise
    return new Promise(function (resolve, reject) {

        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            // query
            let queryAddUser = `insert into USER (inter_ID, first_name, last_name, email, phone_number)
             values( ?, ?, ?, ?, ?);`;

            connection.query(queryAddUser, [user.id, user.name, user.lastname, user.email, user.phoneNumber], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let user_id = results.insertId;
                let querySetProfile = `insert into USER_PROFILES values(?, ?)`;

                connection.query(querySetProfile, [user_id, profile_id], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });

                    let values = [];
                    departments_id.forEach((dept_id) => {
                        if (dept_id != undefined && dept_id.length != 0 && !isNaN(dept_id)) {
                            values.push([user_id, parseInt(dept_id)])
                        }
                    });

                    if (values.length == 0){return connection.rollback(function () { reject("Not department found"); });}
                    
                    let set_dept_query = `INSERT INTO user_dep (user_ID, dep_ID) values ?;`;

                    connection.query(set_dept_query, [values], function (error, results) {

                        if (error) return connection.rollback(function () { reject(error); });

                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    reject(err);
                                });
                            }
                            resolve(true);
                        });
                    });
                });
            });
        });
    });
}

/**
 * create_course create a course record
 * @param {Object} user -> {number, name, description}
 * @param {Array} study_program_ids id of study programs
 * @return {Promise} resolve with all profiles
 */
async function create_course(course) {
    
    // add user promise
    return new Promise(function (resolve, reject) {
        connection.beginTransaction(function (err) {
            if (err) { return reject(err) }

            let insert_query = `insert into COURSE (course_number, course_name, course_description) values(?, ?, ?);`;
           

            connection.query(insert_query, [course.number, course.name, course.description], function (error, results) {

                if (error) return connection.rollback(function () { reject(error); });

                let course_id = results.insertId;

                let values = [];
                course.study_programs.forEach((id) => {
                    if (id != undefined && id.length != 0 && !isNaN(id)) {
                        values.push([course_id, parseInt(id)])
                    }
                });

                if (values.length == 0) return reject("Cannot add any study program");
    
                let insert_prog_course = `insert into PROG_COURSE (course_ID, prog_ID) values ?`;

                connection.query(insert_prog_course, [values], function (error, results) {
                    if (error) return connection.rollback(function () { reject(error); });
                
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                reject(err);
                            });
                        }
                        resolve(true);
                    });
                });
            });
        });
    });
}

module.exports.create_user = create_user;
module.exports.create_course = create_course;

