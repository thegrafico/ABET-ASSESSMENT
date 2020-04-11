$(document).ready(function () {
    var CURRENT_MAPPING = undefined;
    let pair = undefined;

    let dept_val = $("#departments").val();
    if (dept_val == undefined || dept_val.length == 0) {
        $("#tableDiv").append(`<h3 style="text-align: center;">Please, Select a Department and Study Program</h3>`);
    }

    // Department was change
    $("#departments").change(async function () {

        // Get the department ID
        let dept_id = $(this).val();

        // disable study program
        $('#study_program').prop("disabled", true);

        //clean the body
        $("#filter").empty();
        $("#tableDiv").empty();
        $(".thead-dark").empty();
        $("#clickme").addClass("invisible");


        // Clean Study Program
        $('#study_program').empty().append(` <option selected disabled value=""> -- Study Program --</option>`);
        $("#tableDiv").empty().append(`<h3 style="text-align: center;">Please, Select a Study Program</h3>`);

        // get the data from the request
        let study_programs = await make_request(`/api/department/get/studyPrograms/${dept_id}`).catch((err) => {
            console.log(err);
        });

        // if cannot get the study programs, Show a message to the user
        if (study_programs == undefined || study_programs.length == 0) {
            $("#tableDiv").empty().append(`<h3 style="text-align: center;">
                Cannot find Any Study Program, Contact The Admin</h3>`);
            return;
        }

        // enable the study programs options
        $('#study_program').prop("disabled", false);

        // fill out the selection option
        study_programs.forEach(element => {
            $('#study_program').append(`<option value='${element.value}'>${element.name}</option>`);
        });
    });

    // When Study program changes
    $("#study_program").change(async function () {

        let std_id = $(this).val();
        
        if (std_id == undefined || std_id == "-1"){
            return;
        }

        let mapping_data = await make_request(`/api/courseMapping/get/${std_id}`).catch((err) => {
            console.log("Error getting the mapping: ", err);
        });

        if (mapping_data == undefined || mapping_data.mapping == undefined || mapping_data.mapping.length == 0) {
            modal_message(false, "We couldn't find any outcome for this study program");
            return;
        }

        // update the previus val
        CURRENT_MAPPING = mapping_data.current_mapping;

        // create table
        let mapping = mapping_data.mapping[0];

        // create the header table
        create_header(mapping);

        //create the body of table
        create_body(mapping, mapping_data.outcome_course);
    });

    $("#clickme").click(function () {

        let selected = [];
        $('.rowCheckBox input:checked').each(function () {
            pair = $(this).val().trim().split(",");
            selected.push(pair);
        });

        let all_courses = selected.map(e => e[1]);

        // remove duplicates outcomes
        all_courses = all_courses.filter(function (item, pos) {
            return all_courses.indexOf(item) == pos;
        });

        let temp = [];
        let arr = [];
        all_courses.forEach(ID => {
            for (let i = 0; i < selected.length; i++) {
                if (selected[i][1] == ID) {
                    temp.push(selected[i][0]);
                }
            }
            arr.push({ "course_id": ID, "outcomes": temp, "isNew": true });
            temp = [];
        });
        CURRENT_MAPPING.sort((a, b) => (a.course_id > b.course_id) ? 1 : -1);
        arr.sort((a, b) => (a.course_id > b.course_id) ? 1 : -1);

        // COMPARING BOTH DT - TO UPDATE OR ELIMINATE THE CHECKBOX SELECTED
        let update_data = [];
        let found = false;
        CURRENT_MAPPING.forEach(past => {
            found = false;
            arr.forEach(present => {
                let to_update = undefined;

                // verify is both have the same course_id selected
                if (past.course_id == present.course_id) {
                    present.isNew = false;
                    to_update = get_data_for_update(past["outcomes"], present["outcomes"]);
                    update_data.push({ "course_id": past.course_id, "update": to_update });
                    found = true;
                }
            });

            if (!found) {
                to_update = get_data_for_update(past["outcomes"], []);
                update_data.push({ "course_id": past.course_id, "update": to_update });
            }
        });

        // for new values to add, new course to evaluate
        let new_values = arr.filter(e => e.isNew);

        new_values.forEach(e => {
            to_update = get_data_for_update([], e["outcomes"]);
            update_data.push({ "course_id": e.course_id, "update": to_update });
        });

        $.ajax({
            type: "POST",
            url: '/admin/courseMapping/addMapping',
            data: {
                data: update_data
            },
            dataType: 'json',
            success: function (response) {

                if (response != undefined && response.status == 200) {

                    let msgTitle;
                    let msgBody;
                    if (response.wasUpdated) {
                        msgTitle = "Success";
                        msgBody = "";

                        if (response["deleted"].length > 0) {
                            create_list("#removedElements", "Removed: ", response["deleted"]);
                        } else {
                            clean_list("#removedElements");
                        }

                        if (response["added"].length > 0) {
                            create_list("#addedElements", "Added:", response["added"]);
                        } else {
                            clean_list("#addedElements");
                        }

                    } else {
                        msgTitle = "Feedback";
                        msgBody = "You did not change any value!";
                        clean_list("#removedElements");
                        clean_list("#addedElements");
                    }

                    modal_message_for_mapping(msgTitle, msgBody, response.wasUpdated);
                }
            },
            error: function () {
                modal_message(false, "Sorry, Something went wrong.");
            }
        });
    });

});

/**
 * @param {Bool} success - if the message is a success or an error 
 * @param {String} message - message for the modal
 */
function modal_message(success, message) {

    if (success) {
        $("#feedbackTitle").text("Success").css({ "color": "green" });
    } else {
        $("#feedbackTitle").text("Sorry").css({ "color": "red" });
    }
    $("#feedbackBody").text(message);
    $('#feedbackContainer').modal('toggle');
}

/**
 * @param {String} title - Tittle 
 * @param {String} message - message for the modal
 */
function modal_message_for_mapping(title, message, isSuccess = true) {
    
    if (isSuccess){
        $("#modalTitle").css({"color": "green"});
    }else{
        $("#modalTitle").css({"color": "black"});
    }

    $("#modalTitle").text(title);
    $("#modalMessage").text(message)
    $('#view_performances').modal('toggle');
}


function create_list(tag, title, elements) {
    $(tag).empty().append(`<h4>${title}</h4>`);
    $(tag).append("<ul>");
    elements.forEach(row => {
        let outcomes = row["outcome"].join(", ");
        $(tag).append(`<li><strong> ${row["course"]}:</strong> ${outcomes} </li>`);
    });

    $(tag).append("</ul>");
}

function clean_list(tag) {
    $(tag).empty();
}

/**
 * validate_form 
 * @param {Array} current current department the user have
 * @param {Array} selected_for_update actual department the user should have
 * @return {Object} Object of array for "delete" and "insert"
 */
function get_data_for_update(current, selected_for_update) {

    // if (current == undefined  || selected_for_update == undefined || selected_for_update.length == 0){
    // 	return undefined;
    // }

    for (let i = 0; i < current.length; i++) {
        for (let j = 0; j < selected_for_update.length; j++) {
            if (current[i] == selected_for_update[j]) {
                current.splice(i, 1);
                selected_for_update.splice(j, 1);
                i--;
                j--;
            }
        }
    }
    return { "delete": current || [], "insert": selected_for_update || [] }
}

/**
 * Ceate_header -> create the header for the table
 * @param {Object} mapping -> all data for outcome 
 */
function create_body(mapping, current_selected) {


    // console.log("CURRENT: ", current_selected);
    //clean the body
    $("#filter").empty();
    if (mapping == undefined || mapping["outcomes"].length == 0) {
        return;
    }
    let courses = mapping["courses"];
    let outcomes = mapping["outcomes"];

    //clean the body
    // $("#filter").empty();

    // Create a loop to iter for the courses names
    for (let i = 0; i < courses["names"].length; i++) {
        let str = "";

        // COURSE NAME
        str += `<tr class='rowCheckBox'> <th> ${courses["names"][i]}</th>`;

        // iter through the checkbox
        for (let j = 0; j < outcomes["names"].length; j++) {
            // CHECKBOX
            str += `
            <td style="text-align: center; padding: 1%;" scope="col">
                <input type="checkbox" value="${outcomes["ids"][j]},${courses["ids"][i]}"
                    style="top: .8rem; width: 1.25rem; height: 1.25rem;">
            </td>`;
        }
        // end
        str += "</tr";
        $("#filter").append(str);
    }

    //  check the values with the value specified
    if (current_selected != undefined && current_selected.length > 0) {
        current_selected.forEach(e => {
            $(`input[value='${e}']`).attr("checked", "checked");
        });
    }
}

/**
 * Ceate_header -> create the header for the table
 * @param {Object} mapping -> all data for outcome 
 */
function create_header(mapping) {
    $("#tableDiv").empty();
    $(".thead-dark").empty();

    if (mapping == undefined || mapping["outcomes"] == undefined || mapping["outcomes"].length == 0) {
        $("#tableDiv").append(`<h3 style="text-align: center;">THERE IS NOT OUTCOME FOR THIS STUDY PROGRAM</h3>`);
        $("#clickme").addClass("invisible");
        return;
    }
    $("#clickme").removeClass("invisible");

    let outcomes = mapping["outcomes"];

    $(".thead-dark").append("<tr>");
    $(".thead-dark").append(`<th style="text-align: center;" scope="col">COURSES</th>`);
    outcomes["names"].forEach(element => {
        $(".thead-dark").append(`<th style="text-align: center;" scope="col">${element}</th>`)
    });
    $(".thead-dark").append("</tr>");
    $("#tableDiv").empty()
}