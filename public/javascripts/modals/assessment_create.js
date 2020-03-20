
$(document).ready(function () {

    const tag_name = "#assessment_name";
    const tag_department = "#chooseDepartment";
    const tag_study_program = "#chooseStudyProgram";
    const tag_outcome = "#chooseOutcome";
    const tag_course = "#chooseCourse";
    const tag_rubric = "#chooseRubric";
    const tag_term = "#chooseTerm";
    const tags = [tag_study_program, tag_outcome, tag_course, tag_rubric];
    const default_message = ["Study Program", "Outcome", "Course", "Rubric"];

    /**
     * WHEN USER WANT TO RECOVER AN COMPLETED ASSESSMENT
    */

    $(".recoverBtn").click(function () {
        // show the mdodal
        $("#delete_title").text("Recover Assessment");
        $('#deleteModal').modal('toggle');


        // get the id of the assessment
        let assessment_id = $(this).find('input:first').attr('value');
        let assessment_name = $(this).find('input:nth-child(2)').attr('value');

        $("#modal-text").text(`Are you sure you want to recover Assessment with the name: ${assessment_name}?`);
        $("#remove_submit").text(`Recover Assessment`);

        // change the action of form
        $("#formDelete").attr("action", `/professor/assessment/changeStatus/${assessment_id}?_method=PUT`);

    });

    /**
     * BTN CREATE ASSESSMENT EVENT
    */
    $("#create-assessment").click(function () {

        // Change the tittle
        $("#modalTitle").text("Create Assessment");
        $("#submitBtn").text("Create Assessment");

        // show the mdodal
        $('#createModal').modal('toggle');

        // change the action of form
        $("#create_assessment").attr("action", `/professor/assessment/create`);

    });

    /**
    * MODAL FOR EDIT
    * WHEN USER CLICK EDIT BUTTON
    */
    $(".editBtn").click(async function () {

        // show loading icon
        $("#loader-modal").show();

        // Change the title and button text
        $("#modalTitle").text("Edit Assessment information");
        $("#submitBtn").text("Edit Assessment Information");

        // show the mdodal
        $('#createModal').modal('toggle');

        // Get all information from assessment to edit
        let assessment_id = $(this).find('input:first').attr('value');
        let assessment_name = $(this).find('input:nth-child(2)').attr('value');
        let dept = $(this).find('input:nth-child(3)').attr('value');
        let std = $(this).find('input:nth-child(4)').attr('value');
        let outc = $(this).find('input:nth-child(5)').attr('value');
        let course = $(this).find('input:nth-child(6)').attr('value');
        let rubric = $(this).find('input:nth-child(7)').attr('value');
        let term = $(this).find('input:nth-child(8)').attr('value');

        // Change the name
        $(tag_name).val(assessment_name);
        // Change the term
        $(tag_term).val(term);
        // Change the department
        $(tag_department).val(dept);


        // Update the department and setup the value
        await update_departmet(dept).catch((err) => {
            console.log(error);
        });

        // disable all options - after set department
        for (let i = 0; i < tags.length; i++) {
            $(tags[i]).prop("disabled", false);
        }


        // Change study program, and update all study program
        $(tag_study_program).val(std);
        await update_study_program(std).catch((err) => {
            console.log(error);
        });

        // select outcome, and update all outcomes
        $(tag_outcome).val(outc);
        await update_outcome(outc).catch((err) => {
            console.log(err);
        });

        // Select course and rubric
        $(tag_course).val(course);
        $(tag_rubric).val(rubric);

        // hide loading icon
        $("#loader-modal").hide();

        // Change the action of the form to update
        $("#create_assessment").attr("action", `/professor/assessment/${assessment_id}?_method=PUT`);
    });

    // ===============================CREATE MODAL=====================================
    // CLEAN MODAL WHEN OPEN
    $("#createModal").on('hidden.bs.modal', function () {

        // clean all options when user change from department
        for (let i = 0; i < tags.length; i++) {
            $(tags[i]).prop("disabled", true);
            clean_select(tags[i], default_message[i]);
        }

        // Clean department
        $(tag_department).val(function () {
            return this.defaultValue;
        });

        // reset name
        $(tag_name).val(function () {
            return this.defaultValue;
        });

        // reset term
        $(tag_term).val(function () {
            return this.defaultValue;
        });

    });

    tags.forEach(e => {
        $(e).prop("disabled", true);
    });

    // WHEN DEPARTMENT CHANGES
    $(tag_department).change(async function () {
        // department id
        let dept_id = $(this).val();

        $("#loader-modal").show();
        await update_departmet(dept_id).then((ok) => {
            console.log(ok);
            $("#loader-modal").hide();
        }).catch((err) => {
            console.log(err);
            $("#loader-modal").hide();
        });
    });


    // WHEN THE USER CHANGE THE STUDY PROGRAM -> UPDATE STUDY PROGRAM AND COURSES
    $(tag_study_program).change(async function () {
        // get the study program id
        let std_id = $(this).val();

        $("#loader-modal").show();
        await update_study_program(std_id).then((ok) => {
            console.log(ok);
            $("#loader-modal").hide();
        }).catch((err) => {
            console.log(err);
            $("#loader-modal").hide();
        });

    });

    // WHE USER CHANGES THE OUTCOME -> UPDATE RUBRIC
    $(tag_outcome).change(async function () {

        // get outcome ID
        let outc_id = $(this).val();

        // Disable and clean the rubric select
        $(tag_rubric).prop("disabled", true);
        clean_select(tag_rubric, "Rubric");

        $("#loader-modal").show();
        await update_outcome(outc_id).then((ok) => {
            console.log(ok);
            $("#loader-modal").hide();
        }).catch((err) => {
            console.log(err);
            $("#loader-modal").hide();
        });
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


    /**
     * Update department by id
     * @param {Number} dept_id id of the department
     * @returns {Promise} with true
     */
    async function update_departmet(dept_id) {

        return new Promise(async (resolve, reject) => {

            // hide span errors
            hide_span("#std_message");
            hide_span("#outcome_message");
            hide_span("#rubric_message");
            hide_span("#course_message");


            // get study program 
            let study_programs = await make_request(`/admin/department/get/studyPrograms/${dept_id}`).catch((err) => {
                console.log("Error getting study programs: ", err);
            });

            // if cannot find any study program, show a error message
            if (study_programs == undefined || study_programs.length == 0) {
                show_span("#std_message", "*Cannot find any Study Program for this department");
                return reject("Cannot find any Study Program for this department");
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

            resolve(true);
        });
    }
    /**
     * update_study_program by id
     * @param {Number} std_id id of the study program
     * @returns {Promise} with true
     */
    async function update_study_program(std_id) {
        return new Promise(async function (resolve, reject) {

            // clean all options when user change from department
            $(tag_outcome).prop("disabled", false);
            $(tag_course).prop("disabled", false);


            // get all outcomes by study program
            let outcomes = await make_request(`/admin/outcomes/get/outcomes/${std_id}`).catch((err) => {
                console.log("CANNOT GET THE OUTCOMES: ", err);
            });

            if (outcomes == undefined || outcomes.length == 0) {
                show_span("#std_message", `*This study Program does not have any Outcome`);
                return reject("Cannot find any outcome");
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

            if (courses["data"] == undefined || courses["data"].length == 0) {
                show_span("#course_message", `*This study program does not have any courses`);
                return reject("Cannot find any course");
            }

            // FILL Course
            fill_select_option(courses["data"], "course_name", "course_ID", tag_course, "Course");

            resolve(true);
        });
    }


    /**
     * Update outcome by id
     * @param {Number} outc_id id
     * @returns {Promise} with true
     */
    async function update_outcome(outc_id) {
        return new Promise(async function (resolve, reject) {

            // get rubric
            let rubrics = await make_request(`/admin/api/get/rubricByOutcome/${outc_id}`).catch((err) => {
                console.log("There is an error getting the rubrics: ", err);
            });

            // validate rubric
            if (rubrics == undefined || rubrics["data"] == undefined) {
                show_span("#rubric_message", `*Cannot find any Rubric for the Outcome selected`);
                return reject("Cannot find the outcome");
            }

            $(tag_rubric).prop("disabled", false);

            // hide message is rubric is found
            hide_span("#rubric_message");

            // console.log(rubrics);

            // fill the select option with the rubric
            fill_select_option(rubrics["data"], "rubric_name", "rubric_ID", "#chooseRubric", "Rubric");

            resolve(true);
        });
    };
});