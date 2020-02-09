var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;


/**
 * get_user_list - get all users
 * @return {Promise} resolve with results of database
 */
async function get_user_list() {
    console.log("Getting List of users");

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

//GET USER DATA USING user_ID
function get_user_by_id(id, callback) {
    `Get user data using the id`

    console.log("Getting user data");

    let getUser = `Select *
              FROM USER
              where user_ID = ?`;

    conn.query(getUser, [id], function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
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

//UPDATE TABLE USER
function update_user(data, callback) {
    `Update the user table in the database`
    console.log("Getting user data")

    let updateUser = `update USER
            set inter_ID = ?, first_name= ?,
            last_name= ?, email= ?, phone_number= ?
            where user_ID = ? `;

    let user_data = [data.interID, data.fName, data.lName, data.email, data.pNumber, parseInt(data.userID)];

    conn.query(updateUser, user_data, function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}

//DELETE USER FROM DATABASE
function delete_user_by_id(id, callback) {
    `REMOVE USER BY ID`
    console.log("REMOVING user");

    let deleteUser = `DELETE
                    FROM USER
                    WHERE user_ID = ?;`;

    //Exe query
    conn.query(deleteUser, [id], function (err, results, fields) {
        if (err) {
            return callback(err, null)
        };
        // console.log(results)
        return callback(null, results);
    });
}


/**
 * get_all_profiles get all profiles from database
 * @param {Object} data -> {interId, firstName, lastName, email, phoneNumber} 
 * @return {VoidFunction} resolve with all profiles
 */
async function insert_user(data) {
    console.log("CREATING USER");

    // TODO: validate data

    // Promise 1
    let add_user_promise = new Promise(function(resolve, reject){
        
        // query
        let queryAddUser = `insert into USER (inter_ID, first_name, last_name, email, phone_number)  
        values( ?, ?, ?, ?, ?);`;  
        
        // TODO: Validation - data of the user
        let user_data = [data.interID, data.username, data.lastname, data.email, data.phoneNumber];

        //Exe query
        conn.query(queryAddUser, user_data, function (err, results) {
            
            if (err) 
                reject(err);
            else
                resolve(results.insertId);
        });
    });
    
    // Promise 2
    let set_profile_promise = add_user_promise.then((userId) =>{
        return new Promise(function(resolve, reject){
            
            // query
            let querySetProfile = `insert into USER_PROFILES values(?, ?)`;

            conn.query(querySetProfile, [userId, data.profile_id], function (error, results) {
                if (error) 
                     reject(false);
                else
                    resolve(true);
            });
        }).catch((err) => {
            console.log("There is an error adding the user: ", err);
        });
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
