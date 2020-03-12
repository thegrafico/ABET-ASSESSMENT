const canvas = document.getElementById('myChart')
let ctx = canvas.getContext('2d');
let amountOfColumns = $('#amountOfCol').val();
let assessment_ID = $('#assessmentID').val();
let performanceCriteria = $('#perfCrit').val();
performanceCriteria = performanceCriteria.split(',');
let outcomeName = $('#outcomeName').val();
let labels = [];
let row = 1;
let graph;
let avgPerRow = [];
let data = [];

// Loads empty chart when page is load
window.onload = createChart();

$(document).ready(function () {
	generateCols();
	for (let i = 0; i <= 9; i++) {
		avgPerRow.push(0);
		addRow();
	}
	$('#addRow').click(function () {
		avgPerRow.push(0);
		addRow();
	});
	
	$('#delRow').click(function () {
		delRow();
		updateIndex();
	});

	$('#saveBtn').click(function() {
		insertEvaluation(data, assessment_ID);
	});
});


// This function creates a row with the amount of columns which depends of the amount of performance Criterias
function generateRow(r) {
	var markup = `<tr><th id='indexRow' name='index' scope='row' value='${r}'> ${r} </th>`;
	for (let i = 1; i <= amountOfColumns; i++) {
		markup = markup.concat(`<td><input type='number' name='rowValue' min = '0.0' max = '4.0' size = '25' oninput='createChart()' value='0'></td>`);
	}
	markup = markup.concat(`<td class="avgRow" id="avg${r-1}"></td><td><input type='checkbox' name='record' value="${r-1}"></td></tr>`);
	$("#tableBody").append(markup);
}

// Creates header row of the table
function generateCols() {
	for (let i = 1; i <= amountOfColumns; i++) {
		var col = "<th> PC " + performanceCriteria[i - 1] + "</th>";
		$("#header").append(col);
	}
	$("#header").append(`<th>${outcomeName}</th>`);
}

// Creates a new row
function addRow() {
	$("#tableBody").append(generateRow(row));
	row++;
}

// Deletes selected rows
function delRow() {
	$("#tableBody").find('input[name="record"]').each(function () {
		if ($(this).is(":checked")) {
			$(this).parents("tr").remove();
			avgPerRow.splice($(this).val(), 1);
		}
	});
}

// TODO:
// - Add Target line to graph
// - Update info when deleting row


function updateIndex() {
	$('table tbody tr').each(function(index) {
		console.log(index);
		$(this).find('th').text(index+1);
		let newId = 'avg' + index;
		$(this).find('td:nth-last-of-type(2)').attr('id', newId);
		
	});
	// $("#tableBody").find('td').each(() => {
	// 	$(this).val(data);
	// });
	//$(this).prev('li').prop('id', 'newId');
	//:nth-last-of-type(1)
}

// Creates chart depending the users input
function createChart() {
	let formData = [];

	// Creates labels for the x-axis of the chart
	for (let i = 0; i < performanceCriteria.length; i++) {
		performanceCriteria[i] = parseInt(performanceCriteria[i]);
		labels[i] = "PC " + performanceCriteria[i];
	}

	labels[performanceCriteria.length] = outcomeName + ' Average';

	$("#performanceTable, input[type=number]").each(function (index) {
		let input = $(this); 
		formData[index] = input.val();
		$(input).val(formData[index]);
	});

	let amountRows = ((formData.length) / amountOfColumns);
	let temp = [];
	let e = 0;

	for (let i = 0; i < amountRows; i++) {
		for (let j = 0; j < amountOfColumns; j++) {
			temp[j] = formData[e];
			e++;
		}
		data[i] = temp;
		temp = [];
	}
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

	let graphData = percTable;
	graphData.push(outcomeAVG);

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



function insertEvaluation(rowData, assessmetID) {
	let entryData = [];
	let index = 1;
	rowData.forEach(element => {
		let tempObject = {};
		tempObject['row_ID'] = index;
		tempObject['assessment_ID'] = assessmetID;
		tempObject['rowEvaluation'] = element;
		entryData.push(tempObject);
		index++;
	});
	index = 0;

	$.ajax({
		type: "POST",
		url: '/professor/assessment/insertData',
		data: entryData,
		success: () => {
			alert("Post");
		}
	});
}