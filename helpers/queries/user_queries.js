var { db, options } = require("../mysqlConnection");
var mysql = require("mysql");
var connection = mysql.createConnection(options);
connection.connect();

var conn = db.mysql_pool;


/**
 * get_user_list - get all users
 * @return {Promise} resolve with results of database
 */
async function get_user_list() {
    return new Promise(function (resolve, reject) {

        //         SELECT * FROM user
        // INNER JOIN (SELECT * FROM profile NATURAL JOIN user_profiles) as user_prof 
        // ON user.user_ID = user_prof.user_ID
        // INNER JOIN (SELECT * FROM department NATURAL JOIN user_dep) as dep
        // ON user.user_ID = dep.user_ID;
        let userList = `Select * From USER natural join USER_PROFILES natural join PROFILE`;

        conn.query(userList, function (err, results, fields) {
            if (err)
                reject(err || "error getting users");
            else
                resolve(results);
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
        let query_user_info = `SELECT * FROM USER NATURAL JOIN USER_PROFILES WHERE USER.user_ID = ?`;

        conn.query(query_user_info, [id], function (err, results) {
            
            if (err){ return reject(err);}
    
            resolve(results[0]);
        });
    });
}


/**
 * get_user_department_by_id - get all user departments
 * @param {Number} id id of the user 
 * @return {Promise} resolve with all departments
 */
function get_user_department_by_id(id) {

    return new Promise(function (resolve, reject) {

        // Get all user information, including department and profile
        let query_user_info = `SELECT dep_ID FROM USER_DEP WHERE user_ID = ?`;

        conn.query(query_user_info, [id], function (err, results) {
            
            if (err){ return reject(err);}
            
            let dept = [];            
            
            results.forEach((record) =>{
                dept.push(record["dep_ID"].toString());
            });

            resolve(dept);
        });
    });
}

//GET user ID by email
function get_user_ID_by_email(email, callback) {
    'Get user ID using the email'
    console.log("Getting user ID");

    let slq_getID = `SELECT user_ID
                    FROM USER
                    WHERE email = ?
                    LIMIT 1`;
    conn.query(slq_getID, [email], function (err, results) {

        if (err) return callback(err, null);

        return callback(null, results);
    });
}

/**
 * update_user - Update user in database
 * @param {Object} data -> {interID, username, lastname, email, phoneNumber, userID, "profile_id"} 
 * @return {Promise} resolve with all profiles
 */
function update_user(data) {


    return new Promise(function (resolve, reject) {
    
        let user_data = [data.interID, data.username, data.lastname, data.email, data.phoneNumber, data.userID];

        let updateUser = `UPDATE USER SET inter_ID = ?, first_name= ?, last_name= ?, email= ?, phone_number= ? WHERE user_ID = ? `;

        conn.query(updateUser, user_data, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}

/**
 * update_user_profile by id
 * @param {Number} user_id id of the user
 * @param {Number} profile_id id of the profile  
 * @return {Promise} resolve with true
 */
function update_user_profile(user_id, profile_id){
  
    return  new Promise(function (resolve, reject) {
        let update_profile_query = "UPDATE USER_PROFILES SET profile_ID = ? WHERE user_ID = ?";
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

        let deleteUser = `DELETE FROM USER WHERE user_ID = ?`;

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

        let querySetProfile = `INSERT INTO USER_PROFILES values(?, ?)`;
        conn.query(querySetProfile, [user_id, profile_id], function (error, results) {
            if (error)
                reject(false);
            else
                resolve(true);
        });
    });
}

/**
 * add_user_to_department - set the user department
 * @param {Number} user_id id of the user
 * @param {Array} dept_id array with all the dept_id
 * @return {Promise} resolve with true
 */
function set_user_to_department(user_id, dept_id) {

    return new Promise(function (resolve, reject) {

        let values = [];
        dept_id.forEach((department_id) => {
            if (department_id != undefined && department_id.length != 0) {
                values.push([user_id, department_id])
            }
        });

        let query = "INSERT INTO USER_DEP (user_ID, dep_ID) VALUES ?";
        conn.query(query, [values], function (error, results) {
            if (error)
                reject(error);
            else
                resolve(true);
        });
    });
}


/**
 * get_all_profiles get all profiles from database
 * @return {Promise} resolve with all profiles
 */
async function get_all_profiles() {
    return new Promise(function (resolve, reject) {
        let query_profile = `Select * From PROFILE`;

        //Database query
        conn.query(query_profile, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}

module.exports.get_user_list = get_user_list;
module.exports.get_user_by_id = get_user_by_id;
module.exports.update_user = update_user;
module.exports.delete_user_by_id = delete_user_by_id;
module.exports.get_user_ID_by_email = get_user_ID_by_email;
module.exports.get_all_profiles = get_all_profiles;
module.exports.set_user_to_department = set_user_to_department;
module.exports.set_user_profile = set_user_profile;
module.exports.get_user_department_by_id = get_user_department_by_id;
module.exports.update_user_profile = update_user_profile;

