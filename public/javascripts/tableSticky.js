$(document).ready(function () {

    // TABLE STICKY HEADER
    $('#table').floatThead({
        position: 'fixed',
        scrollContainer: true
    });

    $('#table').trigger('reflow');
})