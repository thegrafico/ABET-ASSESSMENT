$(document).ready(function () {
  let i = 11;
  $("#addRow").click(function () {
    console.log("New Row");
    var markup = "<tr><th scope='row'>"+ i +"</th><td><input type='number' name='rowValue' min = '0' max = '4' size = '25'></td><td><input type='number' name='rowValue' min = '0' max = '4' size = '25'></td><td><input type='number' name='rowValue' min = '0' max = '4' size = '25'></td><td><input type='number' name='rowValue' min = '0' max = '4'  size = '25' ><td><input type='checkbox' name='record'></td></td></tr>";
    $("#table").append(markup);
    i++;
  });
  // Find and remove selected table rows
  $("#delRow").click(function(){
      $("#table").find('input[name="record"]').each(function(){
          if($(this).is(":checked")){
              $(this).parents("tr").remove();
          }
      });
  });
});


// <td name='rowOneAvg'>{{rowAvg}}</td>
