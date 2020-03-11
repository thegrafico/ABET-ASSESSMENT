const canvas = document.getElementById('myChart')
let ctx = canvas.getContext('2d');
let amountOfColumns = $('#amountOfCol').val();
let performanceCriteria = $('#perfCrit').val();
performanceCriteria = performanceCriteria.split(',');
let outcomeName = $('#outcomeName').val();
outcomeName = outcomeName.split(' ');
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
	// Find and remove selected table rows
	$('#delRow').click(function () {
		updateIndex();
		delRow();
	});
});


// This function creates a row with the amount of columns which depends of the amount of performance Criterias
function generateRow(r) {
	var markup = `<tr><th id='indexRow' name='index' scope='row'> ${r} </th>`;
	for (let i = 1; i <= amountOfColumns; i++) {
		markup = markup.concat(`<td><input type='number' name='rowValue' min = '0' max = '4' size = '25' oninput='createChart()' value='0'></td>`);
	}
	markup = markup.concat(`<td id="avg${r-1}">${avgPerRow[r-1]}</td><td><input type='checkbox' name='record' value="${r-1}"></td></tr>`);
	$("#tableBody").append(markup);
}

// Creates header row of the table
function generateCols() {
	for (let i = 1; i <= amountOfColumns; i++) {
		var col = "<th> Criteria " + performanceCriteria[i - 1] + "</th>";
		$("#header").append(col);
	}
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
			console.log("Before Splice: ", avgPerRow);
			avgPerRow.splice($(this).val(), 1);
			console.log("After Splice: ", avgPerRow);
		}
	});
}

// TODO:
// - Add Target line to graph
// - Update info when deleting row


function updateIndex() {
	alert("Deleted");
	// $("th.indexRow").each(function(index) {
	// 	// $(this).text(index);
	// 	console.log(`${index} : '${$(this).val()}'`);
	// });
	// $("#tableBody").find('td').each(() => {
	// 	$(this).val(data);
	// });
}

// Creates chart depending the users input
function createChart() {
	let formData = [];

	// Creates labels for the x-axis of the chart
	for (let i = 0; i < performanceCriteria.length; i++) {
		performanceCriteria[i] = parseInt(performanceCriteria[i]);
		labels[i] = "PC " + performanceCriteria[i];
	}

	labels[performanceCriteria.length] = outcomeName[0] + ' ' + outcomeName[1] + ' Average';

	$("#performanceTable, input[type=number]").each(function (index) {
		let input = $(this); 
		formData[index] = input.val();
		$(input).val(formData[index]);
	});

	let amountRows = ((formData.length - 1) / amountOfColumns);
	let temp = [];
	let e = 1;

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

	console.log("Average per Row: ", avgPerRow);
	let myChart = new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					label: '% of Student with 3 or more in ' + outcomeName[0] + ' ' + outcomeName[1],
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