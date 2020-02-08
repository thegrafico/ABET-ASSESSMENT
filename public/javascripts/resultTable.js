var amountOfColumns = $('#amountOfCol').val();

$(document).ready(function () {
  console.log();

});


// <tr>
//   <th scope="col">Student</th>
//   <th scope="col">{Criteria 1}</th>
//   <th scope="col">{Criteria 2}</th>
//   <th scope="col">{Criteria 3}</th>
//   <th scope="col">{Criteria 4}</th>
//   <th scope="col">Criteria Row AVG</th>
//   <th scope="col"></th>
// </tr>


// var markup = "<th scope='col'>Student</th>";
// var markupTwo = "<th scope='row'>{{rowID}}</th>";
// var markupThree = "<th>% of stud. with 3 or more</th>";
//
// for(let i = 1; i <= 3; i++) {
//   markup = markup.concat("<th scope='col'> Criteria " + i + "</th>");
//   markupTwo = markupTwo.concat("<td> {{{rowIn.["+ i +"]}}} </td>");
//   markupThree = markupThree.concat("<td> {{{colPerc.["+ i +"]}}} %</td>");
// }
// markup = markup.concat("<th scope='col'>Criteria Row AVG</th><th scope='col'></th>");
// markupTwo = markupTwo.concat("<td name='rowOneAvg'>{{rowAvg}}</td>");
// markupThree = markupThree.concat("<td>{{avgCol}}</td><td></td>");
// $("#one").append(markup);
// $("#two").append(markupTwo);
// $("#third").append(markupThree);
// console.log("The amount of columns are: ", amountOfColumns);
// console.log("This is Result Table");
// console.log(markup);
// console.log(markupTwo);
// console.log(markupThree);
