


// using the Rest Countries API.
$(document).ready(function () {
  // Retrieve and populate the country list from Rest Countries API
  
  
 getCountryNamesAndCodes();
function getCountryNamesAndCodes() {

  $.ajax({

    url: "libs/php/getCountryData.php",

    type: "GET",

    success: function (countries) {

      let option = "";

      for (let country of countries) {

        option += '<option value="' + country[1] + '">' + country[0] + "</option>";

      }

      $("#countrySelect").append(option);

    },

  });

}


  
  

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
  $("#countrySelect").on("change",  async function () {
    // const bordersJSON  = require('./countryBorders.geo.json');

    const response =  await fetch('./libs/js/countryBorders.geo.json')
    const data = await response.json();
    // console.log('data', data)

    const coordinates = [];
    for (let i = 0; i < data.coordinates.length; i++) {
    
      for (let j = 0; j < data.coordinates[i].length; j++) {
    
        for (let k = 0; k < data.coordinates[i][j].length; k++) {
          
          console.log('actual data', data.coordinates[i][j][k])

        }


      }


    }


    // console.log('bordersJSON', bordersJSON)
   
      var selectedCountryCode= $(this).val();
      console.log("Selected country code is : " + selectedCountryCode)
         var selectedCountryName = $("#countrySelect option[value='" + selectedCountryCode +"']").text();
         console.log("Selected country name is:", selectedCountryName);



    const countryGeoData = data.features.find(i => i.properties.name === selectedCountryName)
    console.log('countryGeoData', countryGeoData)
    
       getCountryInfo(selectedCountryCode,selectedCountryName); 
        
      
  });
});

 


function getCountryInfo(countryCode,countryName) {
  $.ajax({
    url: "libs/php/countryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      Cname: countryCode,
      countryName: countryCode,
    },
    success: function(result) {
      console.log("AJAX request successful");
      console.log(result);
      
      if (result.data) {
        var lat = result.data.lat;
        var lng = result.data.lng;
        
        console.log("Latitude: " + lat);
        console.log("Longitude: " + lng);
        // getting apis

        getExchangeRate(countryCode,countryName);
        getTimezone(lat,lng);

        getWikipedia(lat,lng);
           
        



        // getExchangeRate(countryCode)

        

         


      } else { 
        console.log("Data object not found in the response.");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("AJAX request error:", textStatus, errorThrown);
      // Handle error here
    }
  });
}

  
// function getExchangeRates(countryCode, countryName) {
//   var baseCurrency = 'GBP'; // Set the base currency to British Pound

//   $.ajax({
//     url: "libs/php/exchangeRates.php", // Replace with the actual path to your PHP script
//     type: 'POST',
//     dataType: 'json',
//     data: {
//       baseCurrency: baseCurrency,
//       countryCode: countryCode, // Include countryCode as a parameter
//       countryName: countryName, // Include countryName as a parameter
//     },
//     success: function (result) {
//       console.log("AJAX request for exchange rates successful");
//       console.log(result);

//       if (result.data) {
//         // Access exchange rate data here
//         var exchangeRates = result.data.rates;
//         var currencyCode = 'GBP'; // Example: You can change this to the currency you want to display

//         if (exchangeRates.hasOwnProperty(currencyCode)) {
//           var rate = exchangeRates[currencyCode];
//           console.log(`1 ${baseCurrency} equals ${rate} ${currencyCode}`);
//           // Display the exchange rate on your webpage
//           $('#exchangeRate').html(`1 ${baseCurrency} equals ${rate} ${currencyCode}`);
//         } else {
//           console.log(`Exchange rate for ${currencyCode} not found in data.`);
//         }
//       } else {
//         console.log("Data object not found in the response.");
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.error("AJAX request for exchange rates error:", textStatus, errorThrown);
//       // Handle error here
//     }
//   });
// }

// // Example: Call getExchangeRates with countryCode and countryName
// getExchangeRates('GB', 'United Kingdom');



























///// Timezone

 function getTimezone(incoming_latitude, incoming_longitude) {
  $.ajax({
    url: "libs/php/Timezone.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: incoming_latitude,
      lng: incoming_longitude,
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name === "ok") {
        const data = result.data;

        $('#txtSunrise').html(data.sunrise);
        //$('#txtLng').html(data.longitude); 
        $('#txtSunset').html(data.sunset);
        $('#txtCountryName').html(data.countryName);
        $('#txtTime').html(data.time);
        
      }
    }, // Removed the extra comma here

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    }
  });
}





function getWikipedia(incoming_latitude, incoming_longitude) {
  $.ajax({
    url: "libs/php/Wikipedia.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: incoming_latitude,
      lng: incoming_longitude,
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name === "ok") {
        const data = result.data.geonames[0]; // Assuming you want the first result
        $('#txtSummary').html(data.summary);
        
        $('#txtTitle').html(data.title);
        $('#txtWU').html(data.wikipediaUrl);

        
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    }
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






L.easyButton("fa-clock", function (btn, map) {
  $("#modal4").modal("show");
}).addTo(map);


 // Btn-4  timezone


 L.easyButton("fa-wikipedia-w", function (btn, map) {
  $("#modal5").modal("show");
}).addTo(map);
// Btn-5   wikipedia



