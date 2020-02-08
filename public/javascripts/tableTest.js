// var amountOfColumns = $('#amountOfCol').val();
var amountOfColumns = $('#amountOfCol').val();

console.log("The amount of columns received is: ", amountOfColumns);
let row = 1;

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

  $('#submit').click(function(){
    grabAll();
  });
});

function generateRow(r) {
  var markup = "<tr><th scope='row'> " + r + " </th>";
  for(let i = 1; i <= amountOfColumns; i++) {
    markup = markup.concat("<td><input type='number' name='rowValue' min = '0' max = '4' size = '25'></td>");
    console.log(markup);
  }
  markup = markup.concat("<td><input type='checkbox' name='record'></td></tr>");
  $("#tableBody").append(markup);
}

function generateCols() {
  for(let i = 1; i <= amountOfColumns; i++) {
    var col = "<th> Criteria " + i + "</th>";
    $("#header").append(col);
  }
}

function addRow() {
  console.log("New Row");
  ++row;
  $("#tableBody").append(generateRow(row));
  console.log("Number of rows: " ,row);
}

function delRow() {
  $("#tableBody").find('input[name="record"]').each(function(){
    if($(this).is(":checked")){
        $(this).parents("tr").remove();
    }
  });
}
// This doenst work

function grabAll() {
  console.log("Pressed Submit");
  var allData = $("input[value='rowValue']").val();
  console.log(allData);
}
// var markup = "<tr><th scope='row'> " + row + " </th>";
// for(let i = 1; i <= amountOfColumns; i++) {
//   markup = markup.concat("<td><input type='number' name='rowValue' min = '0' max = '4' size = '25'></td>");
//   console.log(markup);
// }
// markup = markup.concat("</tr>");
// $("#tableBody").append(markup);
