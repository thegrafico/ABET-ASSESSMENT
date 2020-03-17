/* 
  * user_create_inputs -> inputs in the form /users/create
*/
module.exports.user_create_inputs = [
    {
        "title": "Inter ID",
        "placeHolder": "User Inter ID",
        "name": "interID",
        "value": "",
    },
    {
        "title": "Name",
        "placeHolder": "User Name",
        "name": "username",
        "value": "",
    },
    {
        "title": "Last Name",
        "placeHolder": "User Last Name",
        "name": "lastname",
        "value": "",
    },
    {
        "title": "email",
        "placeHolder": "User Email",
        "name": "email",
        "value": "",
    },
    {
        "title": "Phone Number",
        "placeHolder": "User Phone Number",
        "name": "phoneNumber",
    }
];

/* 
  * course_create_inputs -> inputs in the form /courses/create
*/
module.exports.course_create_inputs = [
    {
        "title": "Number",
        "placeHolder": "Course Number",
        "name": "data[number]",
        "value": "",
    },
    {
        "title": "Name",
        "placeHolder": "Course Name",
        "name": "data[name]",
        "value": "",
    },
];

/*
    * template for deparment create
*/
module.exports.department_create_inputs = [
    {
        "title": "Name",
        "placeHolder": "Department Name",
        "name": "name",
        "value": "",
    },
];

// create and edit outcome
module.exports.outcome_create_inputs = [
    {
        "title": "Name",
        "placeHolder": "Outcome Name",
        "name": "outcome_name",
        "value": "",
        "isRequire": true
    },
];

// create and edit study program
module.exports.study_program_create_input = [
    {
        "title": "Name",
        "placeHolder": "Program Name",
        "name": "std_name",
        "value": "",
        "isRequire": true
    }
    // {
    //     "title": "Description",
    //     "placeHolder": "Program Description",
    //     "name": "std_description",
    //     "value": "",
    //     "isRequire": false
    // }
];


// create and edit evaluation rubric
module.exports.evaluation_rubric_input = [
    {
        "title": "Name",
        "placeHolder": "Rubric Name",
        "name": "name",
        "value": "",
    },
];

/* 
    - create and edit academic term
*/

module.exports.academic_term = [
    {
        "title": "Name",
        "placeHolder": "Academic Name",
        "name": "name",
        "value": "",
        "isRequire": true
    }
];


// create and edit study program
module.exports.performance_criteria_create_input = [
    {
        "title": "Order",
        "placeHolder": "Insert the order",
        "name": "order",
        "value": "",
    }
];




