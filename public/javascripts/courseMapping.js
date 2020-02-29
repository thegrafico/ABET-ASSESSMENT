let courses;

$(document).ready(() => {
    $.ajax({
        url: '/courseMapping/getCourses',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            for(let i = 0; 0 < data.length; i++) {
                let row = `<tr><th scope='row'>${data[i].course_name}</th><td><input type='checkbox'></td><td><input type='checkbox'></td><td><input type='checkbox'></td><td><input type='checkbox'></td><td><input type='checkbox'></td><td><input type='checkbox'></td><td><input type='checkbox'></td></tr>`;
                $("#tableBody").append(row);
            }
        }
    });
    // TODO: Noah R. Almeda
    // - Finish Filtering system

    // $("#myInput").on("keyup", function() {
    //     var value = $(this).val().toLowerCase();
    //     $("#myList li").filter(function() {
    //       $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    //     });
    // });
});

