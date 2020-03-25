/** 
 * Author: Raul Pichardo
 * 
 * Class Description: middleware to validate the user seccion and roles
*/
var { db } = require("../helpers/mysqlConnection"); //pool connection
conn = db.mysql_pool;

const admin = "admin";
const professor = "professor";
const director = "director";


/**
 * get_user_role get the user profile
 * @param  {String} email email of the user
 * @return {Promise} resolve with results of database
 */
async function get_user_role(email) {

    return new Promise(function (resolve, reject) {

        if (email == undefined)
            reject("invalid email");

        //Look for the email in the DB,if there is one, get the profile data 
        let query = `SELECT * FROM (SELECT * FROM USER NATURAL JOIN USER_PROFILES WHERE USER.email = ?) as NT,
        PROFILE WHERE NT.profile_ID = PROFILE.profile_ID;`;

        conn.query(query, [email.toLowerCase()], function (err, results) {
            if (err) return reject(err);

            resolve(results[0]);
        });
    });
}

/**
 * is_admin Middleware to verify is user is admin
 */
function is_admin(req, res, next) {
    let sess = req.session;
    // is user login? 
    if (sess != undefined && sess.user_email) {
        if (sess.user_profile == admin) {
            return next();
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
        if (sess.user_profile == professor || sess.user_profile == admin || sess.user_profile == director) {
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

        let haveProfile = ((sess.user_profile == professor) ||
            (sess.user_profile == admin) ||
            (sess.user_profile == director));

        // console.log("Have profile: ", haveProfile, sess.user_profile);
        if (haveProfile) {
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
