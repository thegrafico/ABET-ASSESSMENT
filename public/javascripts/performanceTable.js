const canvas = document.getElementById('myChart')
let ctx = canvas.getContext('2d');
let amountOfColumns = $('#amountOfCol').val();
let performanceCriteria = $('#perfCrit').val();
performanceCriteria = performanceCriteria.split(',');
let labels = [];
let row = 1;
let graph;

// Loads empty chart when page is load
window.onload = createChart();

$(document).ready(function () {
	generateCols();
	generateRow(row);
	for (let i = 0; i < 9; i++) {
		addRow();

	}
	$('#addRow').click(function () {
		addRow();

	});
	// Find and remove selected table rows
	$('#delRow').click(function () {
		delRow();
	});
});


// This function creates a row with the amount of columns which depends of the amount of performance Criterias
function generateRow(r) {
	var markup = "<tr><th scope='row'> " + r + " </th>";
	for (let i = 1; i <= amountOfColumns; i++) {
		markup = markup.concat("<td><input type='number' name='rowValue' min = '0' max = '4' size = '25' oninput='createChart()'></td>");
	}
	markup = markup.concat("<td><input type='checkbox' name='record'></td></tr>");
	$("#tableBody").append(markup);
}

// Creates header row of the table
function generateCols() {
	for (let i = 1; i <= amountOfColumns; i++) {
		var col = "<th> Criteria " + performanceCriteria[i - 1] + "</th>";
		$("#header").append(col);
	}
}
console.log(`${index}, '${$(this).val}'`)

// Creates a new row
function addRow() {
	++row;
	$("#tableBody").append(generateRow(row));
}

// Deletes selected rows
function delRow() {
	$("#tableBody").find('input[name="record"]').each(function () {
		if ($(this).is(":checked")) {
			$(this).parents("tr").remove();
		}
	});
}

// Creates chart depending the users input
function createChart() {
	let formData = [];
	let data = [];

	// Creates labels for the x-axis of the chart
	for (let i = 0; i < performanceCriteria.length; i++) {
		performanceCriteria[i] = parseInt(performanceCriteria[i]);
		labels[i] = "Criteria " + performanceCriteria[i];
	}

	$("#performanceTable, input[type=number]").each(function (index) {
		let input = $(this); // This is the jquery object of the input, do what you will
		formData[index] = input.val();
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

	for (let col = 0; col < amountOfColumns; col++) {
		for (let row = 0; row < amountRows; row++) {
			if (data[row][col] >= 3) {
				count++;
			}
		}
		percTable[col] = ((count / amountRows) * 100);
		count = 0;
	}
	let myChart = new Chart(canvas, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					label: '% of Student with 3 or more in outcome {n}',
					data: percTable,
					backgroundColor: 'rgba(58, 166, 87, 0.2)', // Need to make where now matter the amount of PC it can make amou
				},
			]
		},
		options: {
			responsive: true,
			animation: {
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