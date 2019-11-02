
var conn = require("./mysqlConnection").mysql_pool; //pool connection
var USER_QUERIES = require("./queries/user_queries");
var faker = require('faker');

// ================== VALIDATING USER ======================
async function get_user_profile(userEmail, callback) {
    `This function return all user information if the user belong to a profile`
    if (userEmail) {
        console.log("IN FUNCTION get_user_profile", userEmail)

        //Look for the email in the DB,if there is one, get the profile data 
        let query = `SELECT * FROM
        (SELECT * FROM USER NATURAL JOIN USER_PROFILES WHERE USER.email = ?) as NT,
        PROFILE WHERE NT.profile_ID = PROFILE.profile_ID;`;

        //Run the query
        conn.query(query, [userEmail.toLowerCase()], function (error, results) {

            //TODO: Catch this error properly
            if (error) throw error;

            // console.log("USER PROFILE DATA => ", results)
            //Return user data
            return callback(null, results);
        });

    }else{
        return callback("Email is empty", null)
    }
}
//================================ GENERATE DUMMY DAYA ====================
//FUNCTION TO GENERATE DUMMYS USERS
function insert_dummy_users() {
    let data = [];
    // inter_ID	first_name	last_name	email	phone_number	date_created

    for (let index = 0; index < 10; index++) {
        let firstname = faker.name.firstName();
        let lastname = faker.name.lastName();
        let email = faker.internet.email(); // Kassandra.Haley@erich.biz
        let number = faker.random.number({
        'min': 1000000000
        });
        let interid = 'G' + number;

        data.push([null, interid, firstname, lastname, email, number, null]);
    }

    let query = `INSERT INTO USER VALUES (?, ?, ? , ?, ?, ?, ?);`;
    data.forEach(element => {
        conn.query(query, element, function (error, results, fields) {

        //TODO: Catch this error properly
        if (error) throw error;

        console.log('Inserted new user!');
        });
    });
}

// GENERATE DOMMYS PROFILES
function insert_dummy_profile() {
// profile_ID	profile_Name
let query = `INSERT INTO PROFILE
                VALUES (?, ?);`;

let data = [];
let profileName = ['Profesor', 'Admin']

profileName.forEach(e => {
    data.push([null, e]);
});

data.forEach(element => {
    conn.query(query, element, function (error, results, fields) {
    //TODO: Catch this error properly

    if (error) throw error;
    console.log('Inserted new profile!');
    });
});
}

function set_profile_to_user(user_email, profile_id){
USER_QUERIES.get_user_ID_by_email(user_email, function(err, result){
    let userID = result[0].user_ID
    let sql_insert_profile = `INSERT INTO user_profiles (user_ID, profile_ID) VALUES (?, ?)`;

    conn.query(sql_insert_profile, [userID, profile_id], function(err, result){
    if (err) throw err;

    console.log(user_email, " has been assigned to a new table");
    });
});
}

function update_user_profile(userid, newProfile){
let sql_update_user_profile = `UPDATE user_profiles SET profile_ID = ? WHERE user_ID = ?`;

conn.query(sql_update_user_profile, [newProfile, userid], function(err, result){
    if (err) throw err;

    console.log("UPDATED user_profile table", result)
});
}

function insert_new_user(userdata){
// inter_ID	first_name	last_name	email	phone_number	date_created
let query = `INSERT INTO USER VALUES (?, ?, ? , ?, ?, ?, ?);`;
conn.query(query, userdata, function (error, results, fields) {
    //TODO: Catch this error properly

    if (error) throw error;
    console.log('Inserted new profile!');
});
}

module.exports.get_user_profile = get_user_profile;
module.exports.insert_dummy_users = insert_dummy_users;
module.exports.insert_dummy_profile = insert_dummy_profile;
module.exports.set_profile_to_user = set_profile_to_user;
module.exports.insert_new_user = insert_new_user;
module.exports.update_user_profile = update_user_profile;





