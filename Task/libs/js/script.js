$('#buttonrun1').on('click', function() {
    $.ajax({
        url: "libs/php/timezone.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat').val(),
            lng: $('#lng').val(),
        },
        success: function(result) {
            console.log(JSON.stringify(result));

            if (result.status.name === "ok") {
                const data = result.data;

                $('#txtSunrise').html(data.sunrise);
                $('#txtLng').html(data.lng);
                $('#txtCountryCode').html(data.countryCode);
                $('#txtSunset').html(data.sunset);
                $('#txtTimeZone').html(data.timezoneId);
                $('#txtCountryName').html(data.countryName);
                $('#txtLat').html(data.lat);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, errorThrown);
        }
    });
});
