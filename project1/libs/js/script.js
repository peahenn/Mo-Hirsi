const streetMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

const satelliteHybridMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

const satelliteMap = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    ext: "png",
  }
);

const hybridMap = L.layerGroup([satelliteHybridMap, satelliteMap]);
const overlays = L.markerClusterGroup();

const baseMaps = {
  "<strong style='font-size: 16px'>Streets</strong>": streetMap,
  "<strong style='font-size: 16px'>Satellite</strong>": satelliteMap,
  "<strong style='font-size: 16px'>Hybrid</strong>": hybridMap,
};

const overlayMaps = {
  'Markers <hr style=\'margin:0.5em 0\'><i class="fas fa-square" style="color:black"></i>&nbsp;&nbsp;Cities<br><i class="fas fa-square" style="color: red"></i>&nbsp;&nbsp;Hotels<br><i class="fas fa-square" style="color: purple"></i>&nbsp;&nbsp;Airports<br>':
    overlays,
};

const map = L.map("map", {
  center: [51.505, -0.09],
  zoom: 4,
  minZoom: 2,
  zoomControl: true,
  layers: [streetMap, overlays],
});

L.control.layers(baseMaps, overlayMaps).addTo(map);
// Get started on getting the country codes ASAP
let countryLookup = getCountryNamesAndCodes();
function getCountryNamesAndCodes() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "libs/php/getCountryData.php",

      type: "GET",

      success: function (countries) {
        let options = countries.map((country) => {
          return $("<option/>").attr("value", country[1]).text(country[0]);
        });

        resolve(
          countries.reduce((result, country) => {
            result[country[1]] = country[0];
            return result;
          }, {})
        );

        // let option = "";

        // for (let country of countries) {

        //   option += '<option value="' + country[1] + '">' + country[0] + "</option>";

        // }

        $(document).ready(function () {
          $("#countrySelect").append(
            "<option default> Select Country</option>"
          );

          $("#countrySelect").append(options);
        });
      },
    });
  });
}

function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords;

        const userMarker = L.marker([latitude, longitude]).addTo(map);

        userMarker.bindPopup("You are here!").openPopup();

        map.setView([latitude, longitude], 10);
      },
      function (error) {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    alert("Geolocation is not available in this browser.");
  }
}
// using the Rest Countries API.
$(document).ready(function () {
  getUserLocation();

  let countryBorder;
  // Function to add marker for a country
  function addMarker(countryName, lat, lng) {
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(countryName).openPopup();
  }


    // Highlight country borders based on user's location
function highlightCountryBorders(lat, lng) {
  countryInfoFromLatLong(lat, lng).then(([countryCode]) => {
    selectCountry(countryCode);
  });
}

// Get user's location and highlight country borders
getUserLocation().then((userLocation) => {
  const { latitude, longitude } = userLocation.coords;
  highlightCountryBorders(latitude, longitude);
});



function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;

          const userMarker = L.marker([latitude, longitude]).addTo(map);

          userMarker.bindPopup("You are here!").openPopup();

          map.setView([latitude, longitude], 10);

          // Automatically open the relevant modal
          const countryCode = highlightCountryBorders(latitude, longitude);
          openModalForCountry(countryCode);

          resolve(position);
        },
        function (error) {
          console.error("Error getting user location:", error);
          reject(error);
        }
      );
    } else {
      alert("Geolocation is not available in this browser.");
      reject("Geolocation not available");
    }
  });
}

// Function to open the modal for a given country code
function openModalForCountry(countryCode) {
  // Replace with logic to open the modal for the given country code
  // You may need to add an ID or class to your modals for easier selection.
  // Example:
  // $("#modalFor" + countryCode).modal("show");
}
























  $("#countrySelect").on("change", function (event) {
    let selectedCountryCode = event.target.value;

    outlineOfCountry(event.target.value)
      .then((result) => {
        const inputCoordinates = result.coordinates;
        const type = result.type;

        const coordinates = [];
        inputCoordinates.map((c) => {
          coordinates.push(...c);
        });
        return { coordinates, type };
      })
      .then(({ coordinates, type }) => {
        function setCountryBorder() {
          const defaultStyle = {
            weight: 3,
            opacity: 0.3,
            color: "red",
            fillOpacity: 0.3,
          };

          if (type === "MultiPolygon") {
            countryBorder = L.geoJson({
              type: "Polygon",
              coordinates: coordinates,
            })
              .setStyle(defaultStyle)
              .addTo(map);
          } else {
            countryBorder = L.geoJson({
              type: "Polygon",
              coordinates: [coordinates],
            })
              .setStyle(defaultStyle)
              .addTo(map);
          }

          map.fitBounds(countryBorder.getBounds());
        }

        if (countryBorder === undefined) {
          setCountryBorder();
        } else {
          map.removeLayer(countryBorder);
          setCountryBorder();
        }

        if (coordinates) {
          countryLookup.then((lookup) => {
            getCountryInfo(selectedCountryCode, lookup[selectedCountryCode]);
          });
        }
      });
  });
});

async function outlineOfCountry(countryCode) {
  const response = await fetch("./libs/js/countryBorders.geo.json");
  const data = await response.json();

  let feature = data.features.find((feature) => {
    return feature?.properties?.iso_a2 === countryCode;
  });

  return feature.geometry;
}

function getCountryInfo(countryCode, countryName) {
  $.ajax({
    url: "libs/php/countryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      Cname: countryCode,
      countryName: countryCode,
    },
    success: function (result) {
      console.log("AJAX request successful");
      console.log(result);

      if (result.data) {
        var lat = result.data.lat;
        var lng = result.data.lng;

        console.log("Latitude: " + lat);
        console.log("Longitude: " + lng);
        // getting apis

        //getExchangeRates(countryCode,countryName);
        getTimezone(lat, lng);
        getWeather(lat, lng);

        getWikipedia(lat, lng);
        getAirports(countryCode);

        getGeonamesCountryInfo(countryCode).then((isoAlpha3) => {
          getExchangeRates(countryCode, countryCode, isoAlpha3);
        });
      } else {
        console.log("Data object not found in the response.");
      }
    },
    error: function (error) {
      console.log("AJAX request error:", error);
      // Handle error here
    },
  });
}

function getExchangeRates(countryCode, countryName, targetCurrencyName) {
  var baseCurrency = "GBP"; // Set the base currency to British Pound

  $.ajax({
    url: "libs/php/exchangeRates.php", // Replace with the actual path to your PHP script
    type: "POST",
    dataType: "json",
    data: {
      //baseCurrency: baseCurrency,
      countryCode: countryCode, // Include countryCode as a parameter
      countryName: countryName, // Include countryName as a parameter
    },
    success: function (result) {
      console.log("AJAX request for exchange rates successful");
      console.log(result);

      if (result.data) {
        // Access exchange rate data here
        var exchangeRates = result.data.rates;
        var currencyCode = "GBP"; // Example: You can change this to the currency you want to display

        if (exchangeRates.hasOwnProperty(currencyCode)) {
          var rate = exchangeRates[currencyCode];
          var dest = exchangeRates[targetCurrencyName];

          // usd = gbp / 0.8
          // cad = usd * 1.3

          let usd = 1 / rate;
          let tar = usd * dest;

          let exchange = `1.00 ${currencyCode} equals ${tar.toFixed(
            2
          )} ${targetCurrencyName}`;
          console.log(exchange);
          // Display the exchange rate on your webpage
          $(".txtCountry").text(countryLookup[countryName]);
          $("#txtExchange").text(exchange);
          $("#txtCurrCode").text(currencyCode);
          $("#txtCurrName").text(targetCurrencyName);
        } else {
          console.log(`Exchange rate for ${currencyCode} not found in data.`);
        }
      } else {
        console.log("Data object not found in the response.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(
        "AJAX request for exchange rates error:",
        textStatus,
        errorThrown
      );
      // Handle error here
    },
  });
}

///// Weather
function getWeather(lat, lng) {
  return new Promise((resolve, reject) => {
    let url = "libs/php/weather.php";
    $.ajax({
      url: url,
      method: "POST",
      // contentType: 'application/json',
      data: {
        lat: lat,
        lng: lng,
      },

      dataType: "json",
      success: resolve,
      error: reject,
    });
  }).then((response) => {
    let data = response.data.current;
    console.log("weather", data);

    $("#txtClouds").text((+data.clouds).toFixed(0) + "%");
    $("#txtDT").text(new Date(data.dt * 1000));
    //$('#txtCC').text();
    // Convert Kelvin to Celcius
    let celcius = +data.temp - 273.15;
    let fahrenheit = (celcius * 9) / 5 + 32;
    $("#txtTemperature").text(
      celcius.toFixed(1) + "°C" + " (" + fahrenheit.toFixed(1) + " F)"
    );
    $("#txtHumidity").text((+data.humidity).toFixed(0) + "%");
  });
}

///// Timezone

function getTimezone(incoming_latitude, incoming_longitude) {
  $.ajax({
    url: "libs/php/Timezone.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: incoming_latitude,
      lng: incoming_longitude,
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name === "ok") {
        const data = result.data;

        $("#txtSunrise").text(data.sunrise);
        //$('#txtLng').html(data.longitude);
        $("#txtSunset").text(data.sunset);
        $("#txtCountryName").html(data.countryName);
        $("#txtTime").html(data.time);
      }
    }, // Removed the extra comma here

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}


function getAirports(countryCode) {
  $.ajax({
    url: "libs/php/airportInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      
    }, // Removed the extra comma here

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}















function getWikipedia(incoming_latitude, incoming_longitude) {
  $.ajax({
    url: "libs/php/Wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: incoming_latitude,
      lng: incoming_longitude,
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name === "ok") {
        const data = result.data.geonames[0]; // Assuming you want the first result
        $("#txtSummary").html(data?.summary ?? "");

        $("#txtTitle").html(data?.title ?? "");
        let url = data?.wikipediaUrl ?? "";
        // Workaround to handle not-quite-valid URL
        // If it doesn't have a protocol and it doesn't begin with //
        // then prefix it with //
        if (url.substr(0, 2) !== "//" && url.indexOf(":") < 0) url = "//" + url;
        
        // Create a link element with target="_blank"
        let link = $("<a/>").attr("href", url).attr("target", "_blank").text(url);
        
        // Append the link to the element with id "txtWU"
        $("#txtWU").empty().append(link);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}


























map.on("click", (event) => {
  console.log("map click", event);
  countryInfoFromLatLong(event.latlng.lat, event.latlng.lng).then(
    ([countryCode, info]) => {
      console.log("country info", countryCode);
      selectCountry(countryCode);
    }
  );
});

var geojsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        "city ": "Glasgow",
        region: "north lanakshire",
      },
      geometry: {
        coordinates: [-4.255901553292944, 55.87424672838188],
        type: "Point",
      },
      id: 0,
    },
  ],
};

function countryInfoFromLatLong(lat, lng) {
  let url =
    "https://nominatim.openstreetmap.org/reverse" +
    "?lat=" +
    encodeURIComponent(+lat) +
    "&lon=" +
    encodeURIComponent(+lng) +
    "&format=json";

  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: resolve,
      error: reject,
    });
  }).then((addressInfo) => {
    return [addressInfo.address?.country_code?.toUpperCase(), addressInfo];
  });
}

function selectCountry(countryCode) {
  $("#countrySelect").val(countryCode).trigger("change");
}

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

function getGeonamesCountryInfo(countryCode) {
  let url =
    "http://api.geonames.org/countryInfoJSON" +
    "?country=" +
    encodeURIComponent(countryCode) +
    "&username=mohi";
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: resolve,
      error: reject,
    });
  })
    .then((response) => {
      // $('#txtClouds').text('cl');
      // $('#txtDT').text('dt');
      // $('#txtCC').text('cc');
      // $('#txtTemperature').text('temp');
      // $('#txtHumidity').text('hum');
      // 'continent', 'capital', 'languages', 'geonameId',
      // 'south', 'isoAlpha3', 'north', 'fipsCode', 'population',
      // 'east', 'isoNumeric', 'areaInSqKm', 'countryCode', 'west',
      // 'countryName', 'postalCodeFormat', 'continentName', 'currencyCode
      let data = response.geonames[0];
      $("#txtArea").text(((+data?.areaInSqKm).toFixed(0) ?? "") + " km²");
      $("#txtPopulation").text(data?.population ?? "");
      $("#txtLanguages").text(data?.languages ?? "");
      $("#txtCapital").text(data?.capital ?? "");
      $("#txtContinent").text(data?.continent);
      return data.currencyCode;
    })
    .catch((err) => {
      console.log("geonames country info error", err);
    });
}
