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
            console.log(result.data.address.street);

            if (result.data.address) {
                const addressData = result.address;

                // Display the fetched address data in respective spans
            
                  $('#txtLng2').html(result.data.address.lng);
                    $('#txtDistance').html(result.data.address.distance);
                   $('#txtStreet').html(result.data.address.street);
                  $('#txtLat2').html(result.data.address.lat);

                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, errorThrown);
        }
    });
});
