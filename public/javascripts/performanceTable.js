const canvas = document.getElementById('myChart');
let ctx = canvas.getContext('2d');
let amountOfColumns = $('#amountOfCol').val();
let assessment_ID = $('#assessmentID').val();
let outcomeName = $('#outcomeName').val();
let perC_Desk = $('#perC_Desk').val();
perC_Desk = perC_Desk.split(',');
let row = 1;
let avgPerRow = [];
let amountRows;
let data;
let hasInput = $('#hasValue').val();
let prevScores = $('#prevScores').val();
prevScores = JSON.parse(prevScores);
let perfID = $('#perfID').val();
perfID = perfID.split(',');
let performanceCriteria = $('#perfCrit').val();
performanceCriteria = performanceCriteria.split(',');
let allPerc;
let labels = [];
let graph;
let amountStud;
let target = 75;
let outcomeAVG;
let graphData;


// Loads empty chart when page is load
window.onload = () => {
    createChart();
    data = getTableData();
};

$(document).ready(() => {
	console.log("Perf Description: ", perC_Desk);

    if(hasInput == 'y') {
		withValues(prevScores);
    } else {
		$('#studModal').modal('show');
		$('#enterStudent').click((e) => {
			if($('#amountOfStudent').val() == "" || isNaN($('#amountOfStudent').val())) {
				// VALIDATION
				$('#feedback span.message').text("Empty Input.");
				$('#feedback').show();
				setInterval(() => {
					$('#feedback').hide(2000, () => {
						$('#feedback span.message').text("");
					});
				}, 3000);
			} 
			else if($('#amountOfStudent').val() <= 0 || $('#amountOfStudent').val() > 200) {
				// VALIDATION
				$('#feedback span.message').text("Input is not with range of 1 to 200.");
				$('#feedback').show();
				setInterval(() => {
					$('#feedback').hide(2000, () => {
						$('#feedback span.message').text("");
					});
				}, 3000);
			}
			else {
				amountStud = $('#amountOfStudent').val();
				$('#studModal').modal('hide');
				noValues();
			}
		});
	}
    
    $('#addRow').click(() => {
		for (let i = 0; i < $('#numofRows').val(); i++) {
			avgPerRow.push(0);
			addRow();
			updateIndex();
		}
	});
	
	$('#delRow').click(() => {
		delRow();
		updateIndex();
		$('#selected').prop('checked', false);
    });
    
    $('#save').click(() => {
		console.log("Save was Pressed");
		insertEvaluation(mapData(data, assessment_ID), assessment_ID, 's');
	});

	$('#next').click((e) => {
		let validate = false;

		data.forEach((element) => {
			for(let i = 0; i < element.length; i++) {
				if(element[i] == null || element[i] == '' || element[i] == undefined) 
					validate = true;
				else if(element[i] < 0 || element[i] > 4)
					validate = true;
			}
		});

		if(data[0] == undefined) {
			// VALIDATION
			alertMessage('Empty Inmput.');
			e.preventDefault();
		} else {
			if(validate) {
				// VALIDATION
				alertMessage('Make sure that the table is full completely and that all inputs are in range of 0 to 4.');
				validateTable();
				e.preventDefault();
			} else {
				insertEvaluation(mapData(data, assessment_ID), assessment_ID, 'n');
			}
		}
	});

	$('#clearAll').click(() => {
		clearTableData();
	});
	
	selectAll();
});





/**
 * noValues() -> function that creates the table if the query result return empty, 
 *               meaning that there was no previous evaluation done to the report.
*/
function noValues() {
    generateHeaderRow();
	for (let i = 0; i < amountStud; i++) {
		avgPerRow.push(0);
		addRow();
	}
	generateFooterRow();
	createTableInfo();
}

/**
 * withValues() -> function that creates table with previous values if existing.
 * @param {Object} -> Object containing previous scores.
*/
function withValues(data) {
    generateHeaderRow();
	for (let i = 0; i < data.length; i++) {
		avgPerRow.push(0);
		addRowWithValue(data)
	}
	generateFooterRow();
	createTableInfo();
}

/**
 * generateRow() -> function that create the template of the row
 * @param {number} -> Index to keep track of the index of the rows and data
*/
function generateRow(r) {
	var markup = `<tr><th class='indexRow' name='index' scope='row' value='${r}' align="middle">
							<label class="contain"><span class="indexNumber">${r}</span>
								<input type="checkbox" name="record" id="selected"/>
								<span class="checkmark" value="${r-1}"></span>
							</label>
						</th>`;
	for (let i = 1; i <= amountOfColumns; i++) {
		markup = markup.concat(`<td align="middle"><input class="studInput" type='number' name='rowValue' value='' oninput='createChart()' align="middle"></td>`);
	}
	markup = markup.concat(`<td class="avgRow" id="avg${r-1}" align="middle"></td></tr>`);
	$("#tableBody").append(markup);
}




/**
 * generateRowWithVal() -> function that creates tables with previous evaluation values.
*/
function generateRowWithVal(r, data) {
	var markup = `<tr><th class='indexRow' name='index' scope='row' value='${r}' align="middle">
							<label class="contain"><span class="indexNumber">${r}</span>
								<input type="checkbox" name="record" id="selected"/>
								<span class="checkmark" value="${r-1}"></span>
							</label>
						</th>`;
						// name="record"
	for (let i = 1; i <= amountOfColumns; i++) { 
        try {
			if(data[r-1].scores[i-1] == null) 
				data[r-1].scores[i-1] = '';

            markup = markup.concat(`<td align="middle"><input class="studInput" type='number' name='rowValue' value='${data[r-1].scores[i-1]}' oninput='createChart()' align="middle"></td>`);
        } catch(err) {
            break;
        }
	}
	markup = markup.concat(`<td class="avgRow" id="avg${r-1}" align="middle"></td></tr>`);
	$("#tableBody").append(markup);
}

/**
 * generateHeaderRow() -> function that creates the header row for the table
*/
function generateHeaderRow() {
	for (let i = 1; i <= amountOfColumns; i++) {
		var col = "<th class='headerRow'> PC " + performanceCriteria[i - 1] + "</th>";
		$("#header").append(col);
	}
	$("#header").append(`<th class='headerRow'>${outcomeName}</th>`);
}

function generateFooterRow() {
	for (let i = 1; i <= amountOfColumns; i++) {
		var col = `<th class='footerRow'><span id="pc${i-1}"></span></th>`;
		$("#footer").append(col);
	}
	$("#footer").append(`<th class='footerRow'><span id="footerSpan"></span></th>`);
}

/**
 * addRow() -> function that adds a new row
*/
function addRow() {
	$("#tableBody").append(generateRow(row));
	row++;
}

/**
 * addRowWithValue() -> Creates rows with previous values.
 * @param {Object} -> Object containing previous scores.
*/
function addRowWithValue(data) {
    $("#tableBody").append(generateRowWithVal(row, data));
	row++;
}

/**
 * delRow() -> function that deletes selected row
*/
function delRow() {
	$("#tableBody").find('input[name="record"]').each(function () {
		if ($(this).is(":checked")) {
            $(this).parents("tr").remove();
			avgPerRow.splice($(this).val(), 1);
			console.log("This: ", $(this).val());
		}
    });
    data = getTableData();
}

/**
 * updateIndex() -> function that updates the index every time a row is deleted or new row is added
*/
function updateIndex() {
	$('#table tbody tr').each(function(index) {
		$(this).find('th .indexNumber').text(index+1);
		let newId = 'avg' + index;
		$(this).find('td:nth-last-of-type(1)').attr('id', newId);
	});
}

/**
 * createChart() -> function that creates the graph according to the input that the user inserts
*/
function createChart() {
    // Creates labels for the x-axis of the chart
	for (let i = 0; i < performanceCriteria.length; i++) {
		performanceCriteria[i] = parseInt(performanceCriteria[i]);
		labels[i] = "PC " + performanceCriteria[i];
	}

    labels[performanceCriteria.length] = outcomeName + ' Avg';
    
    data = getTableData();
    
	let count = 0;
	let percTable = [];
	let rowSum = 0;

	for (let col = 0; col < amountOfColumns; col++) {
		for (let row = 0; row < amountRows; row++) {
			if (data[row][col] >= 3) {
				count++;
			}
		}		
		percTable[col] = ((count / amountRows) * 100);
		percTable[col] = percTable[col].toFixed(2);
		count = 0;
	}
	
	for(let row = 0; row < amountRows; row++) {
		for(let inner = 0; inner < amountOfColumns; inner++) {
			rowSum += parseInt(data[row][inner]);
		}
		if (isNaN(rowSum)) {
			avgPerRow[row] = 0;
		} else
			avgPerRow[row] = rowSum/amountOfColumns;

		$('#avg' + row).text(avgPerRow[row]);
		rowSum = 0;
	}

	let outcomeAVGCount = 0; 
	for(let i = 0; i < avgPerRow.length; i++) {
		if(avgPerRow[i] >= 3) {
			outcomeAVGCount++;
		}
	}
	outcomeAVG = (outcomeAVGCount / amountRows) * 100;
	outcomeAVG = outcomeAVG.toFixed(2);

	graphData = percTable;
	graphData.push(outcomeAVG);

	let myChart = new Chart(canvas, {
		type: 'bar',
		data: {
			datasets: [
				{
					label: '% of Student with 3 or more in ' + outcomeName,
					data: graphData,
					backgroundColor: 'rgba(58, 166, 87, 0.2)'
				}
			], 
			labels: labels
		},
		showTooltips: false,
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						max: 100
					}
				}]
			},
			responsive: true,
			animation: {
				duration: 1,
				onComplete: () => {
					graph = myChart.toBase64Image();

					for(let i = 0; i < amountOfColumns; i++) {
						$('#pc'+ i).text(graphData[i] + " %");
						$('#perf'+ i).text(graphData[i] + " %");
					}

					$('#footerSpan').text(outcomeAVG + "%");
					$('#outResults').text(outcomeAVG + "%");
				}
			},
			annotation: {
				annotations: [{
					type: 'line',
					mode: 'horizontal',
					scaleID: 'y-axis-0',
					value: target,
					borderColor: 'rgb(235, 64, 52)',
					borderWidth: 4,
					label: {
						enabled: true,
						content: 'Target'
					}
				}]
			}
		}
	});

	$(document).ready(function () {
		$('input[name="graph"]').val(graph);
	});
}

/**
 * insertEvaluation() -> function that formats the data to then insert to database
 * @param {Array} -> Array of arrays containing the scores per row
 * @param {Number} -> Assessment ID of the current report
*/
function insertEvaluation(entryData, assessment_id, buttonPressed) {
	console.log("Saving this DATA: ", entryData);
	let hasGraph = $('#hasGraph').val();
	let isNext = buttonPressed;
	console.log("Is Next: ", isNext);

	$.ajax({
		type: "POST",
		url: `/professor/assessment/${assessment_id}/performancetable`,
     	data:{
			 	data: entryData,
				graph: graph,
				hasGraph: hasGraph,
				ifNext: isNext
			},
		dataType: 'json',
		success: (request) => {
			console.log("Req: ", request);
			if(request.message == 'success') {
				$('#success span').text('Successfully added data.');
				$('#success').show();
				setInterval(() => {
					$('#success').hide(3000, () => {
						$('#success span').text("");
					});
				}, 3000);
			}
			else if(request.error == true) {
				alertMessage('Data was not saved!');
			}

			console.log("On success: ", typeof(request.isNext));

			if(request.isNext == 'n') {
				window.location.href = `/professor/assessment/${assessment_id}/professorInput`;
			} else if(request.isNext == 's') {
				window.location.href = `/professor`;
			}
					
		}
	});
}

/**
 * mapData() -> function that is going to map the data with it's corresponding scores and ID's.
 * @param {Array} rowData -> Multidimensional array containing all of the scores.
 * @param {Number} assessmentID -> Current Assessment ID.
 * @returns {Object} -> Returns an object with all of the data mapped.
*/
function mapData(rowData, assessmentID) {
    let mappedData = [];
	let index = 0;
	
	rowData.forEach(element => {
		let tempObject = {};
		tempObject['assessment_ID'] = assessmentID;
		tempObject['perfC'] = perfID;
		tempObject['scores'] = element;
		mappedData.push(tempObject);
		index++;
	});
    index = 0;
	
	mappedData.forEach((entry) => {
		for (let i = 0; i < entry.scores.length; i++) {
			if(entry.scores[i] == null) {
				entry.scores[i] = -1;
			}
		}
	});

	console.log("Mapped Data: ", mappedData);
    return mappedData;
}

/**
 * getTableData() -> Function that gathers all of the table data.
 * @returns {Array} -> Return and multidimmensional array of the data sorted by rows.
*/
function getTableData() {
    let rowData = [];
    let tableData = [];

    $(".performanceTable, input[type=number]").each(function (index) {
        let input = $(this);
        if(input.val() == '') {
			rowData.push(null);
        } else {
            rowData.push(input.val());
		}
        $(input).val(input.val());
    });
    amountRows = ((rowData.length) / amountOfColumns);
	let temp = [];
	let e = 0;

	for (let i = 0; i < amountRows; i++) {
		for (let j = 0; j < amountOfColumns; j++) {
			temp[j] = rowData[e];
			e++;
		}
		tableData[i] = temp;
		temp = [];
    }
	
    return tableData;
}

function clearTableData() {
	$(".performanceTable, input[type=number]").each(function (index) {
		console.table("Data before clear", data);
		$(this).val('');
		console.table("Data after clear", data);

	});
	for(let i = 0; i < amountRows; i++) {
		$('#avg' + i).text('');
	}
	data = getTableData();
}

function selectAll() {
	$('#selectAll').click(function(){
		$('input:checkbox').not(this).prop('checked', this.checked);
	});
}

function validateTable() {
	$(".performanceTable, input[type=number]").each(function(i) {
		let input = $(this);
        if(input.val() == '') {
			input.css({
				"border" : "2px solid red"
			});
			setInterval(() => {
				input.css("border", "");
			}, 3500);
		} 
		else if(!(input.val() >= 0 && input.val() <= 4)) {
			input.css("border", "2px solid red");
			setInterval(() => {
				input.css("border", "");
			}, 3500);
		} 
	});
}

function alertMessage(message) {
	$('#alertDiv span').text(message);
	$('#alertDiv').show();
	setInterval(() => {
		$('#alertDiv').hide(() => {
			$('#alertDiv span').text("");
		});
	}, 3000);
}


function createTableInfo() {
	for(let i = 0; i < amountOfColumns; i++) {
		$('#tableInfo tbody').append(`<tr><th scope="row">PC ${performanceCriteria[i]}</th><td colspan="5" id="perf${i}"></td></tr>`);
		$('#outcomeInfo tbody').append(`<tr><th scope="row">PC ${performanceCriteria[i]}</th><td colspan="5">${perC_Desk[i]}</td></tr>`);
	}
	$('#tableInfo tbody').append(`<tr><th scope="row">${outcomeName} Average</th><td colspan="5" id="outResults"></td></tr>`);
}

