$('#buttonrun2').on('click', function() {
    $.ajax({
        url: "libs/php/nearestAddress.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat2').val(),
            lng: $('#lng2').val(),
        },
        success: function(result) {
            console.log(JSON.stringify(result));

            if (result.address) {
                const addressData = result.address;

                // Display the fetched address data in respective spans
                $('#txtAdminCode2').html(data.adminCode2);
                $('#txtAdminCode1').html(data.adminCode1);
                $('#txtLng2').html(data.lng);
                $('#txtDistance').html(data.distance);
                $('#txtStreetNumber').html(data.streetNumber);
                $('#txtMtfcc').html(data.mtfcc);
                $('#txtPlaceName').html(data.placename);
                $('#txtAdminName2').html(data.adminName2);
                $('#txtStreet').html(data.street);
                $('#txtPostalCode').html(data.postalcode);
                $('#txtCountryCode').html(data.countryCode);
                $('#txtAdminName1').html(data.adminName1);
                $('#txtLat2').html(data.lat);

                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, errorThrown);
        }
    });
});
