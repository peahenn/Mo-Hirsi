



// using the Rest Countries API.
$(document).ready(function () {
  // Retrieve and populate the country list from Rest Countries API
  $.get("https://restcountries.com/v3.1/all", function (data) {
      var countries = data.map(function (country) {
          return country.name.common;
      });

      // Sort the countries array alphabetically
      countries.sort();

      var select = document.getElementById("countrySelect");
      countries.forEach(function (country) {
          var option = document.createElement("option");
          option.text = country;
          select.add(option);
      });
  });


  
  

  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Function to add marker for a country
  function addMarker(countryName, lat, lng) {
      var marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(countryName).openPopup();
  }

  // Handle country selection change
  $("#countrySelect").on("change", function () {

      var selectedCountry = $(this).val();

      // Make an API request to get country data
      $.get(`https://restcountries.com/v3.1/name/${selectedCountry}`, function (data) {
          var countryData = data[0];
          var latlng = countryData.latlng;
          var countryName = countryData.name.common;

          // Clear previous markers
          map.eachLayer(function (layer) {
              if (layer instanceof L.Marker) {
                  map.removeLayer(layer);
              }
          });

          // Add a marker for the selected country
          addMarker(countryName, latlng[0], latlng[1]);
      });
  });
});

 // Function to add marker for a country
function addMarker(countryName, lat, lng) {
  var marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(countryName).openPopup();

  // Add click event listener to marker
  marker.on('click', function () {
      // Trigger AJAX call to update modal with country info
      $.ajax({
          url: "libs/php/countryinfo.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: countryName,
              lang: 'en' // Provide a default language or choose one as needed
          },
          
          success: function(result) {
              if (result.status.name === "ok") {
                  $('#txtContinent').html(result.data[0].continent);
                  $('#txtCapital').html(result.data[0].capital);
                  $('#txtLanguages').html(result.data[0].languages);
                  $('#txtPopulation').html(result.data[0].population);
                  $('#txtArea').html(result.data[0].areaInSqKm);

                  // Show the modal when the country marker is clicked
                  $("#modal1").modal("show");
              }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              // Handle error here
          }
      });
  });
}





// Leaflet tileLayer
var streets = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  });

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  });
 

var basemaps = {
  "Streets": streets,
  "Satellite": satellite
};

var map = L.map("map", {
  layers: [streets]
}).setView([54.7023545, -3.2765753], 6); // Set the center to UK coordinates and zoom level 6




var layerControl = L.control.layers(basemaps).addTo(map);

var geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "city ": "Glasgow",
        "region": "north lanakshire"
      },
      "geometry": {
        "coordinates": [
          -4.255901553292944,
          55.87424672838188
        ],
        "type": "Point"
      },
      "id": 0
    }
  ]
};


















// Easy Buttons
L.easyButton("fa-circle-info", function (btn, map) {
  $("#modal1").modal("show");
}).addTo(map);
 // Btn-1





 L.easyButton("fa-wallet", function (btn, map) {
  $("#modal2").modal("show");
}).addTo(map);
 // Btn-2

 







L.easyButton("fa-cloud", function (btn, map) {
  $("#modal3").modal("show");
}).addTo(map);
// Btn-3






L.easyButton("fa-wikipedia-w", function (btn, map) {
  $("#modal4").modal("show");
}).addTo(map);
 // Btn-4 


 L.easyButton("fa-house-crack", function (btn, map) {
  $("#modal5").modal("show");
}).addTo(map);
// Btn-5




