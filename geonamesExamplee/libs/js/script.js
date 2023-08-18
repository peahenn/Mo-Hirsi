$('#buttonrun1').on('click', function() {

    $.ajax({
        url: "libs/php/timezone.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: $('#selLatitude').val(),
            longitude: $('#selLongitude').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                    
                    $('#txtSunrise').html(result['data'][0]['sunrise']);
                    $('#txtLongitude').html(result['data'][0]['longitude']);
                    $('#txtCountryCode').html(result['data'][0]['countryCode']);
                    $('#txtGmtOffset').html(result['data'][0]['gmtOffset']);
                    $('#txtRawOffset').html(result['data'][0]['rawOffset']);
                    $('#txtSunset').html(result['data'][0]['sunset']);
                    $('#txtTimeZone').html(result['data'][0]['timezoneId']);
                    $('#txtCountryName').html(result['data'][0]['countryName']);
                    $('#txtTime').html(result['data'][0]['time']);
                    $('#txtLatitude').html(result['data'][0]['time']);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                
                console.error("AJAX error:", textStatus, errorThrown);
            }
        });
    
        
    
});
