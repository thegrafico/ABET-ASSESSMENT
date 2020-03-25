const canvas = document.getElementById('myChart')
let ctx = canvas.getContext('2d');
let amountOfColumns = $('#amountOfCol').val();
let assessment_ID = $('#assessmentID').val();
let outcomeName = $('#outcomeName').val();
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


// Loads empty chart when page is load
window.onload = () => {
    createChart();
    data = getTableData();
};

$(document).ready(function () {
    if(hasInput == 'y') {
		withValues(prevScores);
    } else {
		noValues();
	}
	generateSideDisplay();
    
    console.log("prevScores: ", prevScores);
    $('#addRow').click(function () {
		for(let i = 0; i < spinnerInput; i++) {
			avgPerRow.push(0);
			addRow();
			updateIndex();
		}
	});
	
	$('#delRow').click(function () {
		delRow();
		updateIndex();
    });
    
    $('#save').click(function() {
        insertEvaluation(mapData(data, assessment_ID), assessment_ID);
    });
});

/**
 * generateRowWithVal() -> function that creates tables with previous evaluation values.
*/
function generateRowWithVal(r, data) {
    var markup = `<tr><th id='indexRow' name='index' scope='row' value='${r}'> ${r} </th>`;
	for (let i = 1; i <= amountOfColumns; i++) { 
        try {
            markup = markup.concat(`<td><input class="studInput" type='number' name='rowValue' value='${data[r-1].scores[i-1]}' oninput='createChart()' required></td>`);
        } catch(err) {
            break;
        }
	}
	markup = markup.concat(`<td class="avgRow" id="avg${r-1}"></td><td><input type='checkbox' name='record' value="${r-1}"></td></tr>`);
	$("#tableBody").append(markup);
}

/**
 * noValues() -> function that creates the table if the query result return empty, 
 *               meaning that there was no previous evaluation done to the report.
*/
function noValues() {
    generateHeaderRow();
	for (let i = 0; i <= 9; i++) {
		avgPerRow.push(0);
		addRow();
	}

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
}

/**
 * generateRow() -> function that create the template of the row
 * @param {number} -> Index to keep track of the index of the rows and data
*/
function generateRow(r) {
	var markup = `<tr><th id='indexRow' name='index' scope='row' value='${r}'> ${r} </th>`;
	for (let i = 1; i <= amountOfColumns; i++) {
		markup = markup.concat(`<td><input class="studInput" type='number' name='rowValue' value='' oninput='createChart()'></td>`);
	}
	markup = markup.concat(`<td class="avgRow" id="avg${r-1}"></td><td><input type='checkbox' name='record' value="${r-1}"></td></tr>`);
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
	$("#header").append(`<th class='headerRow'></th>`);
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
		}
    });
    data = getTableData();
}

/**
 * updateIndex() -> function that updates the index every time a row is deleted or new row is added
*/
function updateIndex() {
	$('table tbody tr').each(function(index) {
		$(this).find('th').text(index+1);
		let newId = 'avg' + index;
		$(this).find('td:nth-last-of-type(2)').attr('id', newId);
		
	});
}

/**
 * createChart() -> function that creates the graph according to the input that the user inserts
*/
function createChart() {
    // Creates labels for the x-axis of the chart
    let labels = [];
	for (let i = 0; i < performanceCriteria.length; i++) {
		performanceCriteria[i] = parseInt(performanceCriteria[i]);
		labels[i] = "PC " + performanceCriteria[i];
	}

    labels[performanceCriteria.length] = outcomeName + ' Average';
    
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
	let outcomeAVG = (outcomeAVGCount / amountRows) * 100;
	outcomeAVG = outcomeAVG.toFixed(2);

	let graphData = percTable;
	graphData.push(outcomeAVG);

	for(let i = 0; i < amountOfColumns; i++) {
		$('#pc'+ i).text(graphData[i]);
	}

	console.log("Entry Data: ", mapData(data, assessment_ID));

    let graph;
	let myChart = new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					label: '% of Student with 3 or more in ' + outcomeName,
					data: graphData,
					backgroundColor: 'rgba(58, 166, 87, 0.2)', // Need to make where now matter the amount of PC it can make amou
				},
			]
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
				}
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
function insertEvaluation(entryData, assessment_id) {
    console.log("Inserting: ", entryData);
	$.ajax({
		type: "POST",
		url: `/professor/assessment/${assessment_id}/performancetable`,
     data: {data: entryData},
		dataType: 'json',
		success: () => {
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
		console.log("Input: ", input);
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

/**
 * inputValidation() ->  function which will check users input and make sure that follows the reg exp
 * @param {Number} -> User input
 * @returns {Boolean} -> Return True if the input is valid, return false if its not
*/
function inputValidation() {

}

/**
 * generateSideDisplay() -> function that creates the side display panel.
*/
// TODO: 
// Fix labels
function generateSideDisplay() {
	for (let i = 0; i < amountOfColumns; i++) {
		let tRow = `<tr><th>Performance Criteria ${i+1}</th><td><span id="pc${i}"></span>%</td></tr>`;
		$('#outcomeResultTbody').append(tRow);
	}
}