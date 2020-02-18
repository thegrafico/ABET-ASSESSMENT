let ctx = $('#myChart');
let amountOfColumns = $('#amountOfCol').val();
let performanceCriteria = $('#perfCrit').val();
performanceCriteria = performanceCriteria.split(',');
let labels = [];
let row = 1;

for(let i = 0; i < performanceCriteria.length; i++) {
	performanceCriteria[i] = parseInt(performanceCriteria[i]);
	labels[i] = "Criteria " + performanceCriteria[i];
}

$(document).ready(function () {
	generateCols();
	generateRow(row);
	$('#addRow').click(function () {
		addRow();
	});
	// Find and remove selected table rows
	$('#delRow').click(function(){
		delRow();
	});
	$('#generateChart').click(() => {
		createChart();
	})
});

function generateRow(r) {
	var markup = "<tr><th scope='row'> " + r + " </th>";
	for(let i = 1; i <= amountOfColumns; i++) {
		markup = markup.concat("<td><input type='number' name='rowValue' min = '0' max = '4' size = '25'></td>");
	}
	markup = markup.concat("<td><input type='checkbox' name='record'></td></tr>");
	$("#tableBody").append(markup);
}

function generateCols() {
	for(let i = 1; i <= amountOfColumns; i++) {
		var col = "<th> Criteria " + performanceCriteria[i - 1] + "</th>";
		$("#header").append(col);
	}
}

function addRow() {
	++row;
	$("#tableBody").append(generateRow(row));
}

function delRow() {
	$("#tableBody").find('input[name="record"]').each(function(){
		if($(this).is(":checked")){
				$(this).parents("tr").remove();
		}
	});
}

function createChart() {
	let formData = [];
	let data = [];

	$("#performanceTable, input[type=number]").each(function(index) {
		let input = $(this); // This is the jquery object of the input, do what you will
		formData[index] = input.val();
	});

	let amountRows = ((formData.length - 1)/amountOfColumns);
	let temp = [];
	let e = 1;
	
	for(let i = 0; i < amountRows; i++) {
		for(let j = 0; j < amountOfColumns; j++) {
			temp[j] = formData[e];
			e++;
		}
		data[i] = temp;
		temp = [];
	}
	let count = 0;
	let percTable = []; 

	for(let col = 0; col < amountOfColumns; col++) {
		for(let row = 0; row < amountRows; row++) {
			if(data[row][col] >= 3) {
				count++;
			}
		}
		percTable[col] = ((count/amountRows) * 100);
		count = 0;
	}
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				data: percTable
			}]
		}
	});
}