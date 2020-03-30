$(document).ready(function () {

    // form id
    let tagForm = "#course_evaluation";

    // Grades Options
    let A = "#A", B = "#B", C = "#C", D = "#D", F = "#F", W = "#W";
    let total = "#total";
    let notas = [A, B, C, D, F, W];
    let grades = undefined;

    //To sum values
    const suma = (accumulator, currentValue) => accumulator + currentValue;

    // SUM ALL VALUES
    $(`${tagForm} :input`).change(function () {
        let sum = notas.reduce(suma);
        grades = 0;
        notas.forEach(n => {
            let val = $(n).val();

            if (val == undefined || val == '') {
                val = 0;
            }

            grades += parseInt(val);
        });
        $(total).val(grades);
    });

    // Save the data
    $("#saveBtn").click(function (e) {
        $(".gradeInputs").each(function () {

            let val = $(this).val();

            if (val != "" && isNaN(val)) {
                $(this).val(0);
            }
        });
    });

    // =============================SUPER NOTE ==================================
    let tags_summernote = [
        { tag: "#results_of_course", placeholder: "Results", span: "#errorResult" },
        { tag: "#course_modification", placeholder: "Modifications", span: "#errorModification" },
        { tag: "#course_reflection", placeholder: "Reflection", span: "#errorReflection" },
        { tag: "#course_action", placeholder: "Actions", span: "#errorImprovement" },
        { tag: "#outcomeResult", placeholder: "Outcome Result", span: "#errorOutcome" },
    ];

    //  init
    tags_summernote.forEach(each => {
        $(each['tag']).summernote(return_supernote_options(each['placeholder']));
    });

    /*
        Course information Boxes
    */
    $("#finish_professor_input").click(function (e) {

        let isEmpty = false;
        tags_summernote.forEach(box => {

            if ($(box["tag"]).summernote('isEmpty')) {
        
                $(box['span']).text("*Cannot be empty");
                isEmpty = true;
            }else{
                $(box['span']).text("");
            }

        });

        if (isEmpty){
            
            $("#finishError").text("Fills with '*' are required");

            e.preventDefault(e);
        }else{
            $("#finishError").text("");
        }
    });

    // Options for boxes
    function return_supernote_options(placeholder) {
        // Options for all supernoes
        return {
            placeholder: placeholder,
            height: 150,
            minHeight: 100,             // set minimum height of editor
            maxHeight: 300,
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                // ['fontsize', ['fontsize']],
                ['para', ['ul', 'ol', 'paragraph']],
            ],
        }
    }
});