/**
 * validate_form 
 * @param {Object} body -> data to be validate
 * @param {Object} keys_types -> keys of the data to be validate with the value type  (s || n)
 * @return {Boolean} True if value are all good, otherwise false
 */

module.exports.validate_form = function validate_form(body, keys_types) {

	try {

		// we have the same key for both: body and key_types
		for (let key in keys_types) {
			// console.log("Evaluating: ", key);
			// remove extra space
			body[key] = body[key].trim();

			// console.log(`Evaluating: '${body[key]}'`);

			if (keys_types[key] == "s") {

				if (body[key] == undefined || body[key] == "" || body[key].length < 2) {
					console.log("Error with the parameter: ", body[key], "With the key: ", key);
					return false
				}
			} else {
				if (body[key] == undefined || isNaN(body[key]) || body[key].length == 0 || body[key] < 0) {
					console.log("Error with the parameter: ", body[key], "With the key: ", key);
					return false
				}
			}
		}
		return true;
	} catch (error) {
		console.log("Error in the code: ", error);
		return false;
	}
}

/**
 * validate_form 
 * @param {Array} current current department the user have
 * @param {Array} selected_for_update actual department the user should have
 * @return {Object} Object of array for "delete" and "insert"
 */
module.exports.get_data_for_update = function get_data_for_update(current, selected_for_update) {

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
 * validate_form 
 * @param {String} str string
 * @param {String} pattern where to split the str
 * @return {Array} array of string
 */
module.exports.split_and_filter = function split_and_filter(str, pattern) {

	if (str == undefined || str.length < 2) {
		return [];
	}

	let arr_str = str.split(pattern).filter(function (el) {
		return (el != null) && (el != undefined) && (el != "") && !isNaN(el);
	});

	return arr_str.map(el => parseInt(el));
}


/**
 * get_performance_criteria_results - get the calculation values from a performance criteria 
 * @param {Array[Object]} pc performance criteria array of object
 * @return {Array} array of results
 */
module.exports.get_performance_criteria_results = function get_performance_criteria_results(pc) {

	if (pc == undefined || pc.length == 0) {
		console.log("Performance Criteria does not have any value");
		return undefined;
	}

	const student_tam = pc.length, acceptedVal = 3;
	let pec_len = pc[0]["perfC"].length; // len of row of performance criteria 
	let results = [], outcomeRowAVG = [];
	let sum, outAvg, outResult;
	const sum_row_outcome = (accumulator, currentValue) => accumulator + currentValue;

	// Calulate the performance criteria column value
	for (let i = 0; i < pec_len; i++) {
		sum = 0, outAvg = 0;

		// sum each column of score 
		pc.map(each => {
			// if the value if grater or equal than the accepted value
			if (each["scores"][i] >= acceptedVal) sum++;
		});

		// get percent of student with 3 or more (Only one decimal place)
		sum = ((sum / student_tam) * 100).toFixed(2);

		results.push(sum);
	}

	// Calculate the performance criteria row value
	pc.map(each => {
		// sum each row value by value
		outAvg = parseFloat((each["scores"].reduce(sum_row_outcome)) / pec_len).toFixed(2);
		outcomeRowAVG.push(outAvg);
	});

	// Calculate the outcome final avg result
	sum = 0;
	outcomeRowAVG.map(each => {
		if (each >= acceptedVal) sum++;
	});
	outResult = (sum / student_tam * 100).toFixed(2);
	results.push(outResult);
		
	// console.log("OUTCOME AVG: ", outcomeRowAVG);
	// console.log("PERFORMANCE RESULT: ", results);
	// console.log("Result of outcome: ", outResult);
	return {outcomeRowAVG, results};
}

/**
 * getNumbersOfRows - get the numer of row to crete
 * @param {Array[Object]} performances 
 * @returns {Array[Number]} - Array with the index of element to create the row
 */
module.exports.getNumbersOfRows = function getNumbersOfRows(performances){
	let index = []; 

	if (performances == undefined || performances.length == 0){
		return 0;
	}

	const len_expected = performances[0]["perfC"].length;

	performances.forEach((element, i) => {

		// console.log(`${len_expected} == ${element["scores"].length}`);
		let flag = false;
		if (len_expected == element["scores"].length){

			for (let j = 0; j < len_expected; j++) {
				
				const e = element["scores"][j];
				
				if (e == '' || isNaN(e)){
					flag = true;
					break;
				}
			}
			if (!flag){
				index.push(i);
			}
		}
	});

	return index;
}




