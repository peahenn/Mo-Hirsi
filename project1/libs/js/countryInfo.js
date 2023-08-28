// Added a click event handler for the "Country Info" modal button
$("#modal1Button").click(function () {
    var selectedCountry = $("#countrySelect").val();
    
    // Made an AJAX request to fetch the country information
    $.ajax({
        url: "libs/php/countryInfo.php",
      type: "POST",
      dataType: "json",
      data: {
        country: selectedCountry,
        lang: "en" 
      },
      success: function (data) {
        // Populate the modal content with the retrieved data
        $("#continent").text(data.data[0].continent);
        $("#capital").text(data.data[0].capital);
        $("#languages").text(data.data[0].languages);
        $("#population").text(data.data[0].population);
        $("#areaInSqKm").text(data.data[0].areaInSqKm);
  
        // Show the modal
        $("#modal1").modal("show");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching country data:", errorThrown);
      }
    });
  });
  