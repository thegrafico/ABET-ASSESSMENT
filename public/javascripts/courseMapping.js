$(document).ready(() => {
    let courses;
    let column = 7;
    let headerRow = "";

    for(let i = 0; i <= column; i++) {
        if(i === 0) {
            $("#header").append("<th>Course</th>");
        }
        else if(i > 0) {
            $("#header").append("<th scope='col'>" + "Outcome" + i + "</th>");
        }
    }
    
    let results = $.ajax({
        url: '/courseMapping/getCourses',
        async: false,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            courses = data.slice(0,data.length-1);
            let outcomes = data[data.length-1];
            let row = '';

            console.log("Courses: ", courses);
            console.log("Outcomes: ", outcomes);

            for (let i = 0; i < courses.length; i++) {
                for(let j = 0; j <= column; j++) {
                    if(j === 0) {
                        row += '<tr id="outcomeRow' + i + '">';
                        row +=`<th>${courses[i].course_name}</th>`;
                    }
                    else if(j > 0) {
                        row += `<td><input value='${courses[i].course_name + "+" + j}' type='checkbox'></td>`;
                    }
                }
                row += "</tr>";
                $("#tableBody").append(row);
                row = '';
            }
        }
    });

    let courseInfo = results.responseJSON;
    let arr = [];
    
    $('#clickme').click(function () {
        arr = [];
        let tempArr = [];
        let count = 0;

        for(let i = 0; i < column; i++) {
            $(`#outcomeRow${i} input:checkbox:checked`).each(function () {
                let temp = $(this).val().split('+');
                tempArr.push(parseInt(temp[1]));
            });
            arr.push(tempArr);
            tempArr = [];
        }

        console.log(arr);

        let courseMapInfo = [];
        count = 0;

        arr.forEach((entry) => {
            let tempObj = {};
            tempObj['course'] = courseInfo[count].course_name;
            tempObj['prog_ID'] = courseInfo[count].prog_ID;
            tempObj['outcomes'] = entry;
            courseMapInfo.push(tempObj);
            count++;
        });
        console.log(courseMapInfo);
        $.ajax({
            type: "POST",
            url: '/courseMapping/postCourses',
            data: {
                data: courseMapInfo
            },
            dataType: 'json'
          });
    });
});
