/**
 * make_request - Make GET a request to and url
 * @param {String} url - Url to make the reques the request 
 * @returns {Promise} resolve with the data requested, reject with error message
 */
function make_request(url) {

    return new Promise(function (resolve, reject) {

        if (url == undefined || url.length == 0){
            return reject("URL cannot be empty");
        }

        $.ajax({
            'url': url,
            type: 'GET',
            dataType: 'json',
            beforeSend: function () {
                // Show image container
                $("#loader").show();
            },
            success: (data) => {

                if (data == undefined) {
                    return reject("Cannot get the data");
                }
                resolve(data);
            }, complete: function () {
                // Hide image container
                $("#loader").hide();
            }, error: function (error) {
                reject(error)
            },
        });
    });
}