
$(document).ready(function () {

    const tag_department = "#chooseDepartment";
    const tag_study_program = "#chooseStudyProgram";
    const tag_outcome = "#chooseOutcome";
    const tag_course = "#chooseCourse";
    const tag_rubric = "#chooseRubric";
    const tag_term = "#chooseTerm";
    const tags = [tag_study_program, tag_outcome, tag_course, tag_rubric];
    const default_message = ["Study Program", "Outcome", "Course", "Rubric"];

    tags.forEach(e => {
        $(e).prop("disabled", true);
    });

    // WHEN DEPARTMENT CHANGES
    $(tag_department).change(async function () {

        // hide span errors
        hide_span("#std_message");
        hide_span("#outcome_message");
        hide_span("#rubric_message");
        hide_span("#course_message");

        // department id
        let dept_id = $(this).val();

        // get study program 
        let study_programs = await make_request(`/admin/department/get/studyPrograms/${dept_id}`).catch((err) => {
            console.log("Error getting study programs: ", err);
        });

        // if cannot find any study program, show a error message
        if (study_programs == undefined || study_programs.length == 0) {
            show_span("#std_message", "*Cannot find any Study Program for this department");
            return;
        }

        // clean all options when user change from department
        for (let i = 0; i < tags.length; i++) {
            $(tags[i]).prop("disabled", true);
            clean_select(tags[i], default_message[i]);
        }

        fill_select_option(study_programs, "name", "value", tag_study_program, "Study Program");

        // Hide the message is there are study program
        hide_span("#std_message");
        $(tag_study_program).prop("disabled", false);

    });


    // WHEN THE USER CHANGE THE STUDY PROGRAM -> UPDATE STUDY PROGRAM AND COURSES
    $(tag_study_program).change(async function () {

        // clean all options when user change from department
        $(tag_outcome).prop("disabled", false);
        $(tag_course).prop("disabled", false);

        // get the study program id
        let std_id = $(this).val();

        // get all outcomes by study program
        let outcomes = await make_request(`/admin/outcomes/get/outcomes/${std_id}`).catch((err) => {
            console.log("CANNOT GET THE OUTCOMES: ", err);
        });

        // TODO: better message of description
        if (outcomes == undefined || outcomes.length == 0) {
            show_span("#std_message", `*This study Program does not have any Outcome`);
            return;
        }

        // hide span errors
        hide_span("#std_message");
        hide_span("#outcome_message");
        hide_span("#course_message");

        // fill the select option
        fill_select_option(outcomes, "name", "value", tag_outcome, "Outcome");

        // clean rubric
        clean_select(tag_rubric, "Rubric");


        // TODO: Los cursos que aparecen deberian ser los que estan en course mapping??
        let courses = await make_request(`/admin/api/get/coursesbystudyprogram/${std_id}`).catch((err) => {
            console.log("There is an error: ", err);
        });

        // TODO: better message
        if (courses["data"] == undefined || courses["data"].length == 0) {
            show_span("#course_message", `*This study program does not have any courses`);
            return;
        }

        // FILL Course
        fill_select_option(courses["data"], "course_name", "course_ID", tag_course, "Course");

    });

    // WHE USER CHANGES THE OUTCOME -> UPDATE RUBRIC
    $("#chooseOutcome").change(async function () {

        // get outcome ID
        let outc_id = $(this).val();



        // get rubric
        let rubrics = await make_request(`/admin/api/get/rubricByOutcome/${outc_id}`).catch((err) => {
            console.log("There is an error getting the rubrics: ", err);
        });

        // validate rubric
        if (rubrics == undefined || rubrics["data"] == undefined) {
            show_span("#rubric_message", `*Cannot find any Rubric for the Outcome selected`);
            return;
        }

        $(tag_rubric).prop("disabled", false);

        // hide message is rubric is found
        hide_span("#rubric_message");

        console.log(rubrics);

        // fill the select option with the rubric
        fill_select_option(rubrics["data"], "rubric_name", "rubric_ID", "#chooseRubric", "Rubric");

    });

    /**
    * fill_select_option - fillout the select option for courses
    * @param {Array} data array of objec
    * @param {String} keyName -> key name 
    * @param {String} keyValue -> key value  
    * @param {String} tagId -> tag id
    * @param {String} option_message -> Span message
    * @returns VOID
   */
    function fill_select_option(data, keyName, keyValue, tagId, option_message) {

        // "#chooseCourse" " -- Select Course -- "
        // Clean the options and add the default
        clean_select(tagId, option_message)

        // add the courses to the options
        data.forEach(element => {
            $(tagId)
                .append(`<option class="dropdown-item" value="${element[keyValue]}"> ${element[keyName]}</option>`)
        });
    }

    /**
     * clean_select - remove all element from a select option
     * @param {String} tag_id - id of the tag to clean
     * @param {String} message - message for default option
     * */
    function clean_select(tag_id, message) {
        $(tag_id)
            .empty()
            .append(`<option class="dropdown-item" disabled selected value=""> -- Select ${message} -- </option>`);
    }

    /**
     * show_span - SHOW AN HIDEN ELEMENT
     * @param {String} element - id of the elements
     * @param {String} message - Message of the span
     * @returns VOID
    */
    function show_span(element, message) {
        $(element).removeClass("invisible");
        $(element).text(message);
    }

    /**
     * hide_span - HIDE an HTML TAG
     * @param {String} element - id of the elements 
     * @returns VOID
    */
    function hide_span(element, message = "") {
        $(element).addClass("invisible");
        $(element).text(message);
    }
});