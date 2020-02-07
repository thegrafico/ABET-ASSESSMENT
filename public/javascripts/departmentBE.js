console.log("Department Page");

$('#create-modal').on('shown.bs.modal', function () {
    $('#createButton').trigger('focus');
});

// console.log("Delete BEFORE Click Value: ", document.getElementById("deleteClick").value);

// $('#deleteButton').click(function() {

//     // document.getElementById("deleteClick").value = 1;
//     // console.log("Delete ON Click Value: ", document.getElementById("deleteClick").value);
// });

$('#delete-modal').on('shown.bs.modal', function () {
    $('#deleteButton').trigger('focus');
});

$('.collapser').on('click', '.collapser-control', function(e) {
    e.preventDefault();
    $(this)
        .next('.accordion-panel')
        .not(':animated')
        .slideToggle();
});