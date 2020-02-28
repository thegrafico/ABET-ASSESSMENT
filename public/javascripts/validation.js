/* 
    TO VALIDATE USER:-----------------> user_data
    TO VALIDATE COURSE:---------------> course_data
    TO VALIDATE DEPARTMENT:-----------> department_data
    TO VALIDATE OUTCOME: -------------> outcome_data
    TO VALIDATE STUDY PROGRAM: -------> std_data
    TO VALIDATE TERM: ----------------> term_data
    TO VALIDATE RUBRIC: --------------> rubric_data
    TO VALIDATE CRITERIA: ------------> criteria_data
*/

// Wait for the DOM to be ready
$(document).ready(function () {

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
                digits: true,
                required: false,
                minlength: 5,
                maxLength: 11
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
        },
        messages: {
            "data[number]": {
                required: "Cannot be empty",
                minlength: "Have to be greater than 3"
            },
            "data[name]": {
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
            "description": { required: false },
        },
        messages: {
            "name": {
                required: "Cannot be empty",
                lettersonly: "Only letters"
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
            "name": {required:true, minlength: 4},
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
            "name": {required:true, minlength: 3},
            "description": {required:true, minlength: 8},

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

     /* VALIDATE TERM CREATION */
     $("#criteria_data").validate({
        // Specify validation rules
        rules: {
            "description": {required:true, minlength: 5},
            "order": {required:true, digits:true}
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
});
