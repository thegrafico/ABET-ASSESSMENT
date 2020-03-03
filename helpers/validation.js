/**
 * validate_form 
 * @param {Object} body -> data to be validate
 * @param {Object} keys_types -> keys of the data to be validate with the value type  (s || n)
 * @return {Boolean} True if value are all good, otherwise false
 */

function validate_form(body, keys_types) {

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
				if (body[key] == undefined || isNaN(body[key]) || body[key].length == 0 || body[key] <= 0) {
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
 * validate_form 
 * @param {String} str string
 * @param {String} pattern where to split the str
 * @return {Array} array of string
 */
function split_and_filter(str, pattern) {

	if (str == undefined || str.length < 2) {
		return [];
	}

	let arr_str = str.split(pattern).filter(function (el) {
		return (el != null) && (el != undefined) && (el != "") && !isNaN(el);
	});

	return arr_str.map(el => parseInt(el));
}

module.exports.validate_form = validate_form;
module.exports.get_data_for_update = get_data_for_update;
module.exports.split_and_filter = split_and_filter;


