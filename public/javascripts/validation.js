/* 
    -- FORM ID -- SHOULD BE ====> 
    TO VALIDATE USER:-----------------> user_data
    TO VALIDATE COURSE:---------------> course_data
    TO VALIDATE DEPARTMENT:-----------> department_data
    TO VALIDATE OUTCOME: -------------> outcome_data
    TO VALIDATE STUDY PROGRAM: -------> std_data
    TO VALIDATE TERM: ----------------> term_data
    TO VALIDATE RUBRIC: --------------> rubric_data
    TO VALIDATE CRITERIA: ------------> criteria_data
    TO VALIDATE COURSE EVALUATION: ---> course_evaluation
*/

// Wait for the DOM to be ready
$(document).ready(function () {

    console.log("Validation Loaded");

    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("#user_data").validate({

        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            "profile_id": "required",
            "interID": {
                required: true,
                minlength: 6
            },
            "username": { required: true, lettersonly: true },
            "lastname": { required: true, lettersonly: true },
            "email": {
                required: true,
                email: true
            },
            "phoneNumber": {
                required: false,
                digits: true,
                minlength: 5,
                maxlength: 11
            }
        },
        // Specify validation error messages
        messages: {
            "interID": {
                required: "Cannot be empty",
                minlength: "Have to be greater than 5"
            },
            "profile_id": "Please select a profile",
            "username": {
                required: "Cannot be empty",
                lettersonly: "Name cannot have any number or symbol"
            },
            "lastname": {
                required: "Cannot be empty",
                lettersonly: "Name cannot have any number or symbol"
            },
            "phoneNumber": "Please provide a valid number",
            "email": "Please enter a valid email address"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE COURSE CREATION */
    $("#course_data").validate({
        // Specify validation rules
        rules: {
            "data[number]": "required",
            "data[name]": "required",
            "data[description]": "required"
        },
        messages: {
            "data[number]": {
                required: "Cannot be empty",
                minlength: "Have to be greater than 3"
            },
            "data[name]": {
                required: "Cannot be empty",
                minlength: "Have to be greater than 3"
            },
            "data[description]": {
                required: "Cannot be empty",
                minlength: "Have to be greater than 3"
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE DEPARTMENT CREATION */
    $("#department_data").validate({
        // Specify validation rules
        rules: {
            "name": { required: true, lettersonly: true },
            "description": { required: true, minlength: 3 },
        },
        messages: {
            "name": {
                required: "Cannot be empty",
                lettersonly: "Only letters"
            },
            "description": {
                required: "Cannot be empty",
                minlength: "Greater than 3 characters"
            },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE OUTCOME CREATION */
    $("#outcome_data").validate({
        // Specify validation rules
        rules: {
            "std_program": "required",
            "outcome_name": "required",
            "outcome_description": "required",
        },
        messages: {
            "std_program": "Please select a study program",
            "outcome_name": "Cannot be empty",
            "outcome_description": "Cannot be empty",
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE STUDY PROGRAM CREATION */
    $("#std_data").validate({
        // Specify validation rules
        rules: {
            "department_id": "required",
            "std_name": { required: true, lettersonly: true },
        },
        messages: {
            "department_id": "Please select a department",
            "std_name": "Cannot be empty",
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE TERM CREATION */
    $("#term_data").validate({
        // Specify validation rules
        rules: {
            "name": { required: true, minlength: 4 },
        },
        messages: {
            "name": {
                required: "Cannot be empty",
                minlength: "Greater than 4"
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE TERM CREATION */
    $("#rubric_data").validate({
        // Specify validation rules
        rules: {
            "name": { required: true, minlength: 3 },
            "description": { required: true, minlength: 8 },

        },
        messages: {
            "name": {
                required: "Cannot be empty",
                minlength: "Greater than 3"
            },
            "description": {
                required: "Cannot be empty",
                minlength: "Please define more, a least 8 characters"
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATING THE ASSESSMENT*/
    $("#create_assessment").validate({

        // Specify validation rules
        rules: {

            "name": "required",
            "department_id": "required",
            "study_program": "required",
            "outcome": "required",
            "rubric": "required",
            "term": "required",
            "course": "required"
        },
        // Specify validation error messages
        messages: {

            "name": "Cannot be empty",
            "department_id": "Select a Department",
            "study_program": "Select a Study Program",
            "outcome": "Select an Outcome",
            "rubric": "Select a Rubric",
            "term": "Select a Term",
            "course": "Select a Course"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            console.log("HERE");
            form.submit();
        }
    });

    /* VALIDATE TERM CREATION */
    $("#criteria_data").validate({
        // Specify validation rules
        rules: {
            "description": { required: true, minlength: 5 },
            "order": { required: true, digits: true }
        },
        messages: {
            "order": {
                required: "Cannot be empty",
                minlength: "Only numbers are available"
            },
            "description": {
                required: "Cannot be empty",
                minlength: "Please define more, a least 5 characters"
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* 
       COURSE EVALUATION - ASSESSMENT
    */
    $("#course_evaluation").validate({

        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            "A": {
                required: true,
                digits: true,
                maxlength: 3
            },
            "B": {
                required: true,
                digits: true,
                maxlength: 3
            },
            "C": {
                required: true,
                digits: true,
                maxlength: 3
            },
            "D": {
                required: true,
                digits: true,
                maxlength: 3
            },
            "F": {
                required: true,
                digits: true,
                maxlength: 3
            },
            "W": {
                required: true,
                digits: true,
                maxlength: 3
            },
            "course[results]": "required",
            "course[modification]": "required",
            "course[reflection]": "required",
            "course[improvement]": "required",
        },
        // Specify validation error messages
        messages: {
            "A": {
                required: "Cannot be empty",
                maxlength: "Cannot be that bigger",
                digits: "Only positive numbers"
            },
            "B": {
                required: "Cannot be empty",
                maxlength: "Cannot be that bigger",
                digits: "Only positive numbers"

            },
            "C": {
                required: "Cannot be empty",
                maxlength: "Cannot be that bigger",
                digits: "Only positive numbers"
            },
            "D": {
                required: "Cannot be empty",
                maxlength: "Cannot be that bigger",
                digits: "Only positive numbers"
            },
            "F": {
                required: "Cannot be empty",
                maxlength: "Cannot be that bigger",
                digits: "Only positive numbers"
            },
            "W": {
                required: "Cannot be empty",
                maxlength: "Cannot be that bigger",
                digits: "Only positive numbers"
            },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

});
