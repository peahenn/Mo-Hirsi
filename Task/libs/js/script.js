document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the submit button
    const submitBtn = document.querySelector("button");
    submitBtn.addEventListener("click", getInfo);
});

function getInfo() {
    const country = document.getElementById("countrySelect").value;
    const infoType = document.getElementById("infoTypeSelect").value;
    const username = "mohi";  // Use your GeoNames username

    $.ajax({
        url: '/Task/libs/php/p.php',
        type: 'POST',  // Using POST as we established
        data: {
            country: country,
            infoType: infoType,
            username: username
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.error("Failed to fetch data:", error);
        }
    });
}
