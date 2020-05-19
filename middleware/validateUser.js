/** 
 * Author: Raul Pichardo
 * 
 * Class Description: middleware to validate the user seccion and roles
*/
var { db } = require("../helpers/mysqlConnection"); //pool connection
const { admin, profilesWithPrivilege, allProfiles } = require("../helpers/profiles");
const table = require("../helpers/DatabaseTables");
conn = db.mysql_pool;

/**
 * get_user_role get the user profile
 * @param  {String} email email of the user
 * @return {Promise} resolve with results of database
 */
function get_user_role(email) {
    
    return new Promise(function (resolve, reject) {

        if (email == undefined) return reject("invalid email");
        //Look for the email in the DB,if there is one, get the profile data 
        // let query = `SELECT * FROM (SELECT * FROM ${table.user} NATURAL JOIN ${table.user_profiles} WHERE ${table.user}.email = ?) as NT,
        // ${table.profile} WHERE NT.profile_ID = ${table.profile}.profile_ID;`;

        let get_role_query = `
        SELECT * FROM (SELECT * FROM ${table.user} NATURAL JOIN ${table.user_profiles} 
        WHERE ${table.user}.email = ?) as NT 
        INNER JOIN ${table.user_study_program} ON NT.user_ID = ${table.user_study_program}.user_ID
        INNER JOIN ${table.study_program} ON ${table.user_study_program}.prog_ID = ${table.study_program}.prog_ID
        INNER JOIN ${table.profile} ON NT.profile_ID = ${table.profile}.profile_ID`;

        conn.query(get_role_query, [email.toLowerCase()], function (err, results) {
            if (err) return reject(err);

            resolve(results);
        });
    });
}


// SELECT STUDY_PROGRAM.prog_name, USER_STUDY_PROGRAM.is_coordinator FROM
// USER INNER JOIN USER_STUDY_PROGRAM ON USER.user_ID = USER_STUDY_PROGRAM.user_ID
// INNER JOIN STUDY_PROGRAM ON USER_STUDY_PROGRAM.prog_ID = STUDY_PROGRAM.prog_ID
// WHERE USER.user_ID = 5 AND USER_STUDY_PROGRAM.is_coordinator = 1;


/**
 * is_admin Middleware to verify is user is admin
 */
function is_admin(req, res, next) {
    let sess = req.session;

    // is user login? 
    if (sess != undefined && sess.user_email) {

        if (sess.user_profile == admin) {
            return next();
        } else {
            if (allProfiles.includes(sess.user_profile)) {
                req.flash("error", "You don't have privileges");
                return res.redirect("/professor");
            }
        }
    }
    req.flash("error", "You don't have admin privilege");
    res.redirect("back");
}

/**
 * is_admin Middleware to verify is user is admin
 */
function hasAdminPrivilege(req, res, next) {
    let sess = req.session;

    // is user login? 
    if (sess != undefined && sess.user_email) {

        // verify if have admin privilege
        if (profilesWithPrivilege.includes(sess.user_profile)) {
            return next();
        } else {
            if (allProfiles.includes(sess.user_profile)) {
                req.flash("error", "You don't have privileges");
                return res.redirect("/professor");
            }
        }
    }
    req.flash("error", "You don't have admin privilege");
    res.redirect("back");
}

/**
 * is_professor middleware to verify is user is professor
 */
function is_professor(req, res, next) {
    let sess = req.session;
    // is user login? 
    if (sess != undefined && sess.user_email) {

        // if the user has a profile
        if (allProfiles.includes(sess.user_profile)) {
            return next();

        }
    }

    req.flash("error", "You don't have professor privilege");
    res.redirect("back");
}

/**
 * is_login - verify is the user is loggin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function is_login(req, res, next) {
    let sess = req.session;

    if (sess != undefined && sess.user_email) {
        next();
    } else {
        req.flash("error", "Need to login")
        res.redirect("/");
    }
}

/**
 * hasProfile - verify if the user has a least one profile
 */
function hasProfile(req, res, next) {
    let sess = req.session;

    if (sess != undefined && sess.user_email) {

        // console.log("Have profile: ", haveProfile, sess.user_profile);
        if (allProfiles.includes(sess.user_profile)) {
            next();
        } else {
            req.flash("error", "We don't have any record with your information.");
            res.redirect("/");
        }
    } else {
        req.flash("error", "Need to login")
        res.redirect("/");
    }
}

// Returns 
module.exports.get_user_role = get_user_role;
module.exports.is_login = is_login;
module.exports.is_admin = is_admin;
module.exports.is_professor = is_professor;
module.exports.hasProfile = hasProfile;
module.exports.hasAdminPrivilege = hasAdminPrivilege;
