$(document).ready(() => {
    let courses;
    let outcomesList;
    let courseOutcomes;
    let column = 7;

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
            console.log(data);
            courses = data.slice(0,data.length-2);
            courseOutcomes = data.slice(data.length-2, data.length-1);
            outcomesList = data[data.length-1];
            let row = '';
            console.log("Courses: ", courses);
            console.log("Outcomes: ", outcomesList);
            console.log("Course Outcomes", courseOutcomes);

            for (let i = 0; i < courses.length; i++) {
                let tempArrOutcome = [];
                let tempOutcomes = [];
                
                for(let j = 0; j <= column; j++) {
                    if(j === 0) {
                        row += '<tr id="outcomeRow' + i + '">';
                        row +=`<th>${courses[i].course_name}</th>`;
                        for(let e = 0; e < outcomesList.length; e++) {
                            if(courses[i].prog_ID == outcomesList[e].prog_ID) {
                                tempArrOutcome = outcomesList[e].outcomes;
                            }
                        }
                        for(let a = 0; a < courseOutcomes[0].length; a++) {
                            if(courses[i].course_ID == courseOutcomes[0][a].course_ID) {
                                console.log("ID Match: ", courses[i].course_ID, " | ", courses[i].course_name);
                                tempOutcomes = courseOutcomes[0][a].outcomes;
                                // console.log("Array of Outcomes: ", tempOutcomes, " |  ID: ", courses[i].course_ID, " | ", courses[i].course_name);
                            }
                        }
                    }
                    else if(j > 0) {
                        let found = false;
                        for(let e = 0; e < tempOutcomes.length; e++) {
                            if(tempArrOutcome[j-1] == tempOutcomes[e]) {
                                found = true;
                                break;
                            }
                        }
                        if(found) {
                            console.log("Checked", tempOutcomes[j-1]);
                            row += `<td><input value='${tempArrOutcome[j-1]}' type='checkbox' checked></td>`;
                            found = false;
                        } else {
                            console.log("Not Checked");
                            row += `<td><input value='${tempArrOutcome[j-1]}' type='checkbox'></td>`;
                        }
                    }
                }
                row += "</tr>";
                $("#tableBody").append(row);
                row = '';
                tempArrOutcome = [];
                tempOutcomes = [];
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
                let temp = $(this).val();
                tempArr.push(parseInt(temp));
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
            tempObj['course_ID'] = courseInfo[count].course_ID;
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
