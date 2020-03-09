var { db } = require("../mysqlConnection"); //pool connection
var conn = db.mysql_pool;

/***
 * Return perfomance criterias being evaluated for an Assessment report
 * @param {Object} assessment -> keys {"name", "course", "term", "rubric", "user_id"}
 * @returns {Promise} -> Resolves with true
*/
module.exports.create_assessment = (assessment) => {
    return new Promise(function (resolve, reject) {

        if (assessment == undefined){
            return reject("Invalid Parameters");
        }

        let query = `INSERT INTO ASSESSMENT (name, course_ID, term_ID, user_ID, rubric_ID)
        VALUES (?, ?, ?, ?, ?)`
        
        let values = [
            assessment.name,
            assessment.course, 
            assessment.term, 
            assessment.user_id, 
            assessment.rubric,
        ];

        // EXe query
        conn.query(query, values, function (err, results) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
}



/***
 * Return perfomance criterias being evaluated for an Assessment report
 * @param {Number} user_id -> keys {"name", "course", "term", "rubric", "user_id"}
 * @returns {Promise} -> Resolves with all assessment
*/
module.exports.get_assessment_by_user_id = (user_id) => {
    return new Promise(function (resolve, reject) {

        if (user_id == undefined || isNaN(user_id)){
            return reject("Invalid Parameters");
        }

        let query = `SELECT ASSESSMENT.name, COURSE.course_name, ACADEMIC_TERM.term_name, 
        EVALUATION_RUBRIC.rubric_name, ASSESSMENT.creation_date
        FROM ASSESSMENT INNER JOIN COURSE USING(course_ID)
        INNER JOIN ACADEMIC_TERM ON ASSESSMENT.term_ID = ACADEMIC_TERM.term_ID
        INNER JOIN EVALUATION_RUBRIC ON ASSESSMENT.rubric_ID = EVALUATION_RUBRIC.rubric_ID
        WHERE ASSESSMENT.user_ID = ?
        ORDER BY ASSESSMENT.creation_date DESC`;

        // EXe query
        conn.query(query, [user_id], function (err, results) {
            if (err)
                reject(err);
            else
                resolve(results);
        });
    });
}



