$('#buttonrun3').on('click', function() {
    $.ajax({
        url: "libs/php/findweather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat3').val(),
            lng: $('#lng3').val(),
        },
        success: function(result) {
            console.log(JSON.stringify(result));
            console.log(result.data.weatherObservation.clouds);

            if (result.data.weatherObservation) {
                const weatherData = result.weatherObservation;
                

                 // Display the fetched weather observation data in respective spans
                $('#txtLng3').html(result.data.weatherObservation.lng);
                $('#txtClouds').html(result.data.weatherObservation.clouds);
                 $('#txtTemperature').html(result.data.weatherObservation.temperature);
                $('#txtHumidity').html(result.data.weatherObservation.humidity);
                $('#txtLat3').html(result.data.weatherObservation.lat);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX error:", textStatus, errorThrown);
        }
    });
});
