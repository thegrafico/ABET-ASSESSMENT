var { db, options } = require("../mysqlConnection");
var mysql = require("mysql");
const table = require("../DatabaseTables");
var connection = mysql.createConnection(options);
connection.connect();

var conn = db.mysql_pool;


/**
 * get_user_list - get all users
 * @return {Promise} resolve with results of database
 */
async function get_user_list() {
    return new Promise(function (resolve, reject) {

        let userList = `SELECT *
        FROM ${table.user} INNER JOIN ${table.user_study_program} USING (user_ID)
        INNER JOIN ${table.study_program} ON ${table.user_study_program}.prog_ID = ${table.study_program}.prog_ID
        INNER JOIN ${table.user_profiles} ON ${table.user}.user_ID = ${table.user_profiles}.user_ID
        INNER JOIN ${table.profile} ON ${table.user_profiles}.profile_ID = ${table.profile}.profile_ID
        ORDER BY last_name ASC`;

        conn.query(userList, function (err, results) {
            if (err) return reject(err);

            if (results.length == 0) return resolve(results);

            let users_id = results.map(user => user.user_ID);

            // remove duplicates
            users_id = users_id.filter(function (item, pos) {
                return users_id.indexOf(item) == pos;
            });

            // store all users
            let users = [];

            // iter all user id.
            users_id.forEach(ID => {

                // find the user with the id of the loop
                let temp_user = results.filter(e => e.user_ID == ID);

                // get all study program from the user selected
                let std = temp_user.map(e => e.prog_name);

                // remove duplicates
                std = std.filter(function (item, pos) {
                    return std.indexOf(item) == pos;
                });

                temp_user[0].prog_name = std;

                if (temp_user[0]["phone_number"] == '' || temp_user[0]["phone_number"] == undefined) {
                    temp_user[0]["phone_number"] = "Unknow";
                }

                users.push(temp_user[0]);
            });

            resolve(users);
        });
    });
}


/**
 * get_user_by_id ->  get all user information by id
 * @param {Number} id -> id of the user 
 * @return {Promise} resolve with user data
 */
function get_user_by_id(id) {

    return new Promise(function (resolve, reject) {

        // Get all user information, including department and profile
        let query_user_info = `SELECT * FROM ${table.user} NATURAL JOIN ${table.user_profiles} WHERE ${table.user}.user_ID = ?`;

        conn.query(query_user_info, [id], function (err, results) {

            if (err) { return reject(err); }

            resolve(results[0]);
        });
    });
}


/**
 * get_user_department_by_id - get all user departments
 * @param {Number} id id of the user 
 * @return {Promise} resolve with all departments
 */
module.exports.get_user_study_programs_by_id =  function get_user_study_programs_by_id(id) {

    return new Promise(function (resolve, reject) {

        // Get all user information, including department and profile
        let query_user_info = `SELECT prog_ID, is_coordinator FROM ${table.user_study_program} WHERE user_ID = ?`;

        conn.query(query_user_info, [id], function (err, results) {

            if (err) { return reject(err); }

            let study_programs = [];
            results.forEach((record) => {
                study_programs.push( {"prog_ID": record["prog_ID"], "is_coordinator":  record["is_coordinator"]} );
            });
            resolve(study_programs);
        });
    });
}

/**
 * 
 * @param {String} user email 
 * @param {*} callback 
 */
function get_user_ID_by_email(email, callback) {
    console.log("Getting user ID");

    let slq_getID = `SELECT user_ID FROM ${table.user} WHERE email = ? LIMIT 1`;
    conn.query(slq_getID, [email], function (err, results) {

        if (err) return callback(err, null);

        return callback(null, results);
    });
}


/**
 * update_user_profile by id
 * @param {Number} user_id id of the user
 * @param {Number} profile_id id of the profile  
 * @return {Promise} resolve with true
 */
function update_user_profile(user_id, profile_id) {

    return new Promise(function (resolve, reject) {
        let update_profile_query = `UPDATE ${table.user_profiles} SET profile_ID = ? WHERE user_ID = ?`;
        conn.query(update_profile_query, [profile_id, user_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/**
 * delete_user_by_id delete a user by id
 * @param {Number} id -> id of the user 
 * @return {Promise} resolve with all profiles
 */
function delete_user_by_id(id) {

    return new Promise(function (resolve, reject) {

        let deleteUser = `DELETE FROM ${table.user} WHERE user_ID = ?`;

        //Exe query
        conn.query(deleteUser, [id], function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    })
}


/**
 * set_user_profile - set the user profile
 * @param {Number} user_id id of the user
 * @param {Number} profile_id id of the profile
 * @return {Promise} resolve with true
 */
function set_user_profile(user_id, profile_id) {

    return new Promise(function (resolve, reject) {

        let querySetProfile = `INSERT INTO ${table.user_profiles} values(?, ?)`;
        conn.query(querySetProfile, [user_id, profile_id], function (error, results) {
            if (error)
                reject(false);
            else
                resolve(true);
        });
    });
}


module.exports.get_user_list = get_user_list;
module.exports.get_user_by_id = get_user_by_id;
module.exports.delete_user_by_id = delete_user_by_id;
module.exports.get_user_ID_by_email = get_user_ID_by_email;
module.exports.set_user_profile = set_user_profile;
module.exports.update_user_profile = update_user_profile;

