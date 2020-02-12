var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * get_user_list - get all users
 * @return {Promise} resolve with results of database
 */
async function get_user_list() {
    return new Promise(function(resolve, reject){
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
    // TODO: validate id

    return new Promise(function(resolve, reject){

        let query_user_info= `Select * FROM USER where user_ID = ?`;

        conn.query(query_user_info, [id], function (err, results, fields) {
            if (err) 
                reject(err);
            else
                resolve(results[0] || []);
        });
    });
}

//GET user ID by email
function get_user_ID_by_email(email, callback){
    'Get user ID using the email'
    console.log("Getting user ID");

    let slq_getID = `SELECT user_ID
                    FROM USER
                    WHERE email = ?
                    LIMIT 1`;
    conn.query(slq_getID, [email], function(err, results){

        if (err) return callback(err, null);

        return callback(null, results);
    });
}

/**
 * update_user - Update user in database
 * @param {Object} data -> {interId, fName, lName, email, pNumber, userID} 
 * @return {Promise} resolve with all profiles
 */
function update_user(data) {

    // TODO need to update the profile 
    console.log(data);
    let updateUser = `update USER set inter_ID = ?, first_name= ?, 
            last_name= ?, email= ?, phone_number= ?
            where user_ID = ? `;
    
    // array with all user data, has to be in this order 
    let user_data = [data.interID, data.username, data.lastname, data.email, data.phoneNumber, parseInt(data.userID)];

    return new Promise(function(resolve, reject){
        conn.query(updateUser, user_data, function (err, results, fields) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
    
}

/**
 * get_all_profiles get all profiles from database
 * @param {Number} id -> id of the user 
 * @return {Promise} resolve with all profiles
 */
function delete_user_by_id(id) {

    return new Promise(function(resolve, reject){

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
 * get_all_profiles get all profiles from database
 * @param {Array} data -> [interId, firstName, lastName, email, phoneNumbe]
 * @return {VoidFunction} resolve with all profiles
 */

 // TODO: refactor
async function insert_user(data, profile_id) {
    console.log("CREATING USER");

    // TODO: validate data

    // add user promise
    let add_user_promise = new Promise(function(resolve, reject){
        
        // query
        let queryAddUser = `insert into USER (inter_ID, first_name, last_name, email, phone_number)  
        values( ?, ?, ?, ?, ?);`;  
        

        //Exe query
        conn.query(queryAddUser, data, function (err, results) {
            
            if (err) 
                reject(err);
            else
                resolve(results.insertId);
        });
    });
    
    // Promise 2
    let set_profile_promise = add_user_promise.then(async (userId) =>{
        try {
            return new Promise(function (resolve, reject) {
                // query
                let querySetProfile = `insert into USER_PROFILES values(?, ?)`;
                conn.query(querySetProfile, [userId, profile_id], function (error, results) {
                    if (error)
                        reject(false);
                    else
                        resolve(true);
                });
            });
        }
        catch (err) {
            console.log("There is an error adding the user: ", err);
        }
    });

    // run promise 1 and 2
    Promise.all([add_user_promise, set_profile_promise]).then(function([userId, was_added]){

        if (was_added){
            console.log("User was added with the id: ", userId);
            return true;
        }else
            console.log("Error adding the user");
        return false;
    }).catch((err) => {
        console.log(err);
        return false;
    });
}


/**
 * get_all_profiles get all profiles from database
 * @return {Promise} resolve with all profiles
 */
async function get_all_profiles(){
    return new Promise(function(resolve, reject){
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
module.exports.insert_user = insert_user;
module.exports.get_user_ID_by_email = get_user_ID_by_email;
module.exports.get_all_profiles = get_all_profiles;
