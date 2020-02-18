/**
 * validate_form 
 * @param {Object} body -> data to be validate
 * @param {Object} keys_types -> keys of the data to be validate with the value type  (s || n)
 * @return {Boolean} True if value are all good, otherwise false
 */

function validate_form(body, keys_types){

	// if a least one of the parameters is null or if the lenght of both parameters are different
	if (body == undefined || keys_types == undefined ||
		(Object.keys(body).length != Object.keys(keys_types).length)){
		return false;
	}

	// we have the same key for both: body and key_types
	for (let key in keys_types){
		
		// remove extra space
		body[key] = body[key].trim();

		// console.log(`Evaluating: '${body[key]}'`);

		if (keys_types[key] == "s"){
			
			if (body[key] == undefined || !isNaN(body[key]) || body[key].length == 0){
				return false
			}
		}else{
			if (body[key] == undefined || isNaN(body[key]) || body[key].length == 0 || body[key] <= 0){
				return false
			}
		}
	}

	return true;
}

module.exports.validate_form = validate_form;
