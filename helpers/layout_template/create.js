/* 
  * user_create_inputs -> inputs in the form /users/create
*/ 
module.exports.user_create_inputs = [
    {
        "title": "Inter ID",
        "placeHolder":"User Inter ID",
        "name": "interID",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Name",
        "placeHolder":"User Name",
        "name": "username",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Last Name",
        "placeHolder":"User Last Name",
        "name": "lastname",
        "value": "",
        "isRequire": true
    },
    {
        "title": "email",
        "placeHolder":"User Email",
        "name": "email",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Phone Number",
        "placeHolder":"User Phone Number",
        "name": "phoneNumber",
        "isRequire": false
    }
];

/* 
  * course_create_inputs -> inputs in the form /courses/create
*/ 
module.exports.course_create_inputs = [
    {
        "title": "Number",
        "placeHolder":"Course Number",
        "name": "data[crnumber]",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Name",
        "placeHolder":"Course Name",
        "name": "data[crname]",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Description",
        "placeHolder":"Course Description",
        "name": "data[description]",
        "value": "",
        "isRequire": true
    },
];

/*
    * template for deparment create
*/
module.exports.department_create_inputs = [
    {
        "title": "Name",
        "placeHolder": "Department Name",
        "name": "depName",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Description",
        "placeHolder": "Department Description",
        "name": "depDesc",
        "value": "",
        "isRequire": true
    }
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
    {
        "title": "Description",
        "placeHolder": "Outcome Description",
        "name": "outcome_description",
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
    },
    {
        "title": "Description",
        "placeHolder": "Program Description",
        "name": "std_description",
        "value": "",
        "isRequire": false
    }
];


// create and edit evaluation rubric
module.exports.evaluation_rubric_input = [
    {
        "title": "Name",
        "placeHolder": "Rubric Name",
        "name": "name",
        "value": "",
        "isRequire": true
    },
    {
        "title": "Description",
        "placeHolder": "Rubric Description",
        "name": "description",
        "value": "",
        "isRequire": true
    }
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





