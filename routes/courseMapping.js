var express = require('express');
var router = express.Router();
var general_queries = require("../helpers/queries/general_queries");
var courseMappingQuery = require("../helpers/queries/courseMappingQueries");


const base_url = '/admin/courseMapping';
let locals = {
    title: 'Course Mapping',
    base_url: base_url
};

/* 
    GET INDEX ROUTE
*/
router.get('/', async function (req, res) {

    locals.breadcrumb = [
		{ "name": "Course Mapping", "url": "."},
	];
    
    locals.selected_program = 0;
    if (req.query.progID != undefined)
        locals.selected_program = parseInt(req.query.progID);

    let mapping = await courseMappingQuery.get_mapping().catch((err) => {
        console.error("ERROR: ", err);
    });

    let departments = await general_queries.get_table_info("DEPARTMENT").catch((err) => {
        console.error("ERROR GETTING DEPARTMENTS: ", err);
    });

    if (departments == undefined || departments.length == 0){
        req.flash("error", "Cannot find Any Department");
        return res.redirect("back")
    }

    locals.departments = departments;
    
    let study_programs = await general_queries.get_table_info("STUDY_PROGRAM").catch((err) => {
        console.error("ERROR: ", err);
    });


    locals.study_programs = [];
    if (study_programs != undefined || study_programs.length > 0) {
        locals.study_programs = study_programs;
    }

    locals.mapping = transformdt(mapping);

    // console.log(locals.mapping);
    // console.log(locals.mapping[0].outcomes);
    // console.log(locals.mapping[0].courses);

    res.render('admin/courseMapping/home', locals);
});

router.post('/addMapping', async function (req, res) {

    if (req.body == undefined || req.body.data == undefined) {
        return res.end();
    }
    let data = req.body.data;

    if (data.length == 0) {
        return res.end();
    }

    let was_update = false;
    data.forEach(async row => {
        if (row.update != undefined && row.update.insert != undefined && row.update.insert.length > 0) {
            was_update = true;
            await courseMappingQuery.insert_mapping(row.course_id, row["update"]["insert"]).catch((err) => {
                console.error("THERE IS AN ERROR INSERTING MAPPING: ", err);
            });

            console.log("MAPPING ADDED SOME VALUES");
        }

        if (row.update != undefined && row.update.delete != undefined && row.update.delete.length > 0) {
            was_update = true;
            await courseMappingQuery.remove_mapping(row.course_id, row["update"]["delete"]).catch((err) => {
                console.error("THERE IS AN ERROR INSERTING MAPPING: ", err);
            });

            console.log("MAPPING REMOVED SOME VALUES");
        }
    });

    if (was_update){
        res.end('{"success" : "Updated Successfully", "status" : 200, "wasUpdated": true}');
    }else{
        res.end('{"success" : "Data keep the same", "status" : 200, "wasUpdated": false}');
    }
});


/**
 * transformdt -> transform the data structure to a new data structure
 * @param {Array} outcomes array of element to transform
 * @returns {Array} order in ascendent
 */
function transformdt(outcomes) {
    // getting all ids
    let ids = outcomes.map(row => row.prog_ID);


    // remove duplicates
    ids = ids.filter(function (item, pos) {
        return ids.indexOf(item) == pos;
    })

    // sort elements in ascendent order
    ids.sort(function (a, b) { return a - b });

    let temp = [];
    ids.forEach((ID) => {
        let row_outcomes = [];
        let courses_name = [];
        // filter only outcomes that belown to specific study program (Still we got the object)
        row_outcomes = outcomes.filter(row => row.prog_ID == ID);

        //sort by name
        row_outcomes.sort((a, b) => (a.outc_name > b.outc_name) ? 1 : -1)

        // get only the outcomes ids
        outcomes_ids = row_outcomes.map(row => row.outc_ID);

        // remove duplicates outcomes
        outcomes_ids = outcomes_ids.filter(function (item, pos) {
            return outcomes_ids.indexOf(item) == pos;
        });

        //get outcome_names
        outcomes_names = row_outcomes.map(row => [row.outc_name, row.outc_ID]);

        // Getting only the name. Como ya todo está sort, los nombres que me dan aqui estan sort.
        let names = [];
        outcomes_ids.forEach(ID => {
            let i = 0;
            while (i < outcomes_names.length) {
                if (outcomes_names[i][1] == ID) {
                    names.push(outcomes_names[i][0]);
                    break;
                }
                i++;
            }
        });

        // get only the name of the courses
        courses_name = row_outcomes.map(row => row.course_name);

        // remove duplicates outcomes
        courses_name = courses_name.filter(function (item, pos) {
            return courses_name.indexOf(item) == pos;
        });

        // get course name and id in two dimentional array
        let courses_id_name = row_outcomes.map(row => [row.course_ID, row.course_name]);

        // Getting only the name. Como ya todo está sort, los nombres que me dan aqui estan sort.
        let courses_id = [];
        courses_name.forEach(NAME => {
            let i = 0;
            while (i < courses_id_name.length) {
                if (courses_id_name[i][1] == NAME) {
                    courses_id.push(courses_id_name[i][0]);
                    break;
                }
                i++;
            }
        });

        temp.push({
            "prog_ID": ID,
            "outcomes": { "id": outcomes_ids, "names": names },
            "courses": { "names": courses_name, "ids": courses_id },
        });
    });
    return temp;
}
module.exports = router;