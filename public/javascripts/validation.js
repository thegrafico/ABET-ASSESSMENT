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
    TO VALIDATE CREATE ASSESSMENT: ---> create_assessment
*/

// Wait for the DOM to be ready
$(document).ready(function () {

    console.log("Validation Loaded");

    //  LETTERS ONLY
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    // ONLY SPACES
    jQuery.validator.addMethod("noSpace", function (value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "ID cannot have spaces");


    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("#user_data").validate({

        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            "profile_id": "required",
            "interID": { required: true, minlength: 6, maxlength: 20, noSpace: true },
            "username": { required: true, lettersonly: true, minlength: 2, maxlength: 30, },
            "lastname": { required: true, lettersonly: true, minlength: 2, maxlength: 40, },
            "email": { required: true, email: true, maxlength: 100 },
            "phoneNumber": { required: false, digits: true, minlength: 5, maxlength: 11 }
        },
        // Specify validation error messages
        messages: {
            "profile_id": "Please select a profile",
            "interID": {
                required: "Cannot be empty",
                minlength: "Have to be greater than 5",
                maxlength: "Inter ID is to big",
                noSpace: "Inter ID cannot have space"
            },
            "username": {
                required: "Cannot be empty",
                lettersonly: "Name cannot have any number or symbol",
                maxlength: "Name is to big",
                minlength: "Name is to short"
            },
            "lastname": {
                required: "Cannot be empty",
                lettersonly: "Name cannot have any number or symbol",
                maxlength: "Last name is to big",
                minlength: "Last Name is to short"
            },
            "phoneNumber": "Please provide a valid number",
            "email": {
                required: "Cannot be empty",
                maxlength: "Email is to big",
            }
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
            "data[number]": { required: true, minlength: 4, maxlength: 20 },
            "data[name]": { required: true, minlength: 2, maxlength: 50 },
            "data[description]": { required: true, minlength: 5, maxlength: 500 }
        },
        messages: {
            "data[number]": {
                required: "Cannot be empty",
                minlength: "Cannot be so short",
                maxlength: "Cannot be to big"
            },
            "data[name]": {
                required: "Cannot be empty",
                minlength: "Course Name is to short",
                maxlength: "Course Name is to big"
            },
            "data[description]": {
                required: "Cannot be empty",
                minlength: "Please enter no more than 5 characters",
                maxlength: "Please enter no more than 500 characters."
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
            "name": { required: true, lettersonly: true, maxlength: 70 },
            "description": { required: true, minlength: 3, maxlength: 300 },
        },
        messages: {
            "name": {
                required: "Cannot be empty",
                lettersonly: "Only letters",
                maxlength: "Name is to big"
            },
            "description": {
                required: "Cannot be empty",
                minlength: "Greater than 3 characters",
                maxlength: "Description is to big."
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
            "outcome_name": { required: true, minlength: 3, maxlength: 50 },
            "outcome_description": { required: true, minlength: 5, maxlength: 500 },
        },
        messages: {
            "std_program": "Please select a study program",
            "outcome_name": { required: "Cannot be empty" },
            "outcome_description": { required: "Cannot be empty" },
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
            "std_name": { required: true, lettersonly: true, minlength: 5, maxlength: 100 },
        },
        messages: {
            "department_id": "Please select a department",
            "std_name": {
                required: "Cannot be empty.",
                lettersonly: "Study Program cannot have any number.",
                minlength: "Study Program is to short",
                maxlength: "Study Program is to big"
            },
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
            "name": { required: true, minlength: 4, maxlength: 100},
        },
        messages: {
            "name": {
                required: "Cannot be empty",
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
            "name": { required: true, minlength: 2, maxlength: 50 },
            "description": { required: true, minlength: 5, maxlength: 200 },
        },
        messages: {
            "name": {
                required: "Cannot be empty",
            },
            "description": {
                required: "Cannot be empty",
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

            "name": { required: true, minlength: 3, maxlength: 35 },
            "department_id": "required",
            "study_program": "required",
            "outcome": "required",
            "rubric": "required",
            "term": "required",
            "course": "required",
            "course_section": { required: true, minlength: 3, maxlength: 20, digits: true }
        },
        // Specify validation error messages
        messages: {

            "name": {
                required: "Cannot be empty",
                minlength: "Name is to short",
                maxlength: "Name is to big"
            },
            "department_id": "Select a Department",
            "study_program": "Select a Study Program",
            "outcome": "Select an Outcome",
            "rubric": "Select a Rubric",
            "term": "Select a Term",
            "course": "Select a Course",
            "course_section": {
                required: "Cannot be empty",
                minlength: "Section is to short",
                maxlength: "Section is to big",
                digits: "Only numbers are accepted"
            },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    /* VALIDATE TERM CREATION */
    $("#criteria_data").validate({
        // Specify validation rules
        rules: {
            "description": { required: true, minlength: 5, maxlength: 400 },
            "order": { required: true, digits: true }
        },
        messages: {
            "order": {
                required: "Cannot be empty",
                minlength: "Only numbers are available"
            },
            "description": {
                required: "Cannot be empty",
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
