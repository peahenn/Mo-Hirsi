let exchangeRates = null;

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



const map = L.map("map", {
  center: [51.505, -0.09],
  zoom: 4,
  minZoom: 2,
  zoomControl: true,
  layers: [streetMap, overlays],
});

var airports = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#FF5733',
    color: '#000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);

var cities = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#0000FF',
    color: '#00FFFF',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);



var hotels = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#800080',
    color: '#000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);






var airportIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-plane',
  iconColor: 'black',
  markerColor: 'red',
  shape: 'square'
});


var cityIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-city',
  iconColor: 'black',
  markerColor: 'white',
  shape: 'square'
});



var hotelIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-hotel',
  iconColor: 'black',
  markerColor: 'white',
  shape: 'square'
});




const overlayMaps = {
  "airports": airports,
  "cities": cities,
  "hotels": hotels,
  // overlays,
};










L.control.layers(baseMaps, overlayMaps).addTo(map);
// Get started on getting the country codes ASAP
let countryLookup = getCountryNamesAndCodes();
let countries = null;
function getCountryNamesAndCodes() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "libs/php/getCountryData.php",

      type: "GET",

      success: function (result) {
        countries = result;
        let options = countries.map((country) => {
          return $("<option/>").attr("value", country[1]).text(country[0]);
        });

        resolve(
          countries.reduce((result, country) => {
            result[country[1]] = country[0];
            return result;
          }, {})
        );



        $(document).ready(async function () {
          // populate country select at top
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

          // Automatically select the country in the dropdown
          $("#countrySelect").val(countryCode).trigger("change");

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





















  globalCountryCode = null;

  // country select onchange event
  $("#countrySelect").on("change", function (event) {
    let selectedCountryCode = event.target.value;
    globalCountryCode = selectedCountryCode;

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

  // Check if feature is defined before accessing its geometry property
  if (feature && feature.geometry) {
    return feature.geometry;
  } else {
    // Handle the case where the feature is not found or does not have geometry
    console.error(`Country with code ${countryCode} not found or has no geometry.`);
    // You can throw an error or return a default geometry if needed
    throw new Error(`Country with code ${countryCode} not found or has no geometry.`);
  }
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
        getCities(countryCode);
        getHotels(countryCode);

        getGeonamesCountryInfo(countryCode).then((isoAlpha3) => {
          console.log('isoalpha3: ', isoAlpha3);
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


async function countryCodeToCurrencyCode(countryCode) {
  let isoalpha3 = await getGeonamesCountryInfo(countryCode);
  return isoalpha3;
}
var txtSourceAmount = 1;
$("#txtSourceAmount").on("change", async function(){
  let targetCurrencyCode = document.getElementById("targetCurrencySelect").value;
  let sourceCountryCode = globalCountryCode;
  let sourceCurrencyCode = await countryCodeToCurrencyCode(sourceCountryCode);
   console.log(sourceCountryCode);
   console.log("============");
  var sourceCurrencyUSDRate = exchangeRates[sourceCurrencyCode];
  if (!sourceCurrencyUSDRate) {
    throw new Error(`currency ${sourceCurrencyCode} not found`)
  }
  txtSourceAmount = $('#txtSourceAmount').val();
  var amountSourceCurrency = 1; // later comes from form
  var sourceInUSD = amountSourceCurrency / sourceCurrencyUSDRate;
  var targetRate = exchangeRates[targetCurrencyCode];
  if (targetRate) {
    var targetAmount = txtSourceAmount * sourceInUSD * targetRate;

    console.log(`${amountSourceCurrency} ${sourceCurrencyCode} is equal to ${targetAmount.toFixed(2)} ${targetCurrencyCode}`);
  
    // source country name
    countryLookup.then(result => { $("#txtCountry").text(result[sourceCountryCode]) })
    $("#txtSourceCurrency").text(sourceCurrencyCode);
    // $("#txtTargetCurrency").text(targetCurrency);
    $("#txtExchange").text(`${txtSourceAmount} ${sourceCurrencyCode} is equal to ${targetAmount.toFixed(2)} ${targetCurrencyCode}`);
  } else {
    throw new Error(`currency ${targetRate} not found`)
  }
})
// modal currency select onchange event
$("#targetCurrencySelect").on("change", async function (event) {
  let targetCurrencyCode = event.target.value;
  let sourceCountryCode = globalCountryCode;
  let sourceCurrencyCode = await countryCodeToCurrencyCode(sourceCountryCode);
  // let targetCurrencyCode = await countryCodeToCurrencyCode(targetCountryCode);

  var sourceCurrencyUSDRate = exchangeRates[sourceCurrencyCode];
  if (!sourceCurrencyUSDRate) {
    throw new Error(`currency ${sourceCurrencyCode} not found`)
  }
  var amountSourceCurrency = 1; // later comes from form
  var sourceInUSD = amountSourceCurrency / sourceCurrencyUSDRate;
  var targetRate = exchangeRates[targetCurrencyCode];
  if (!targetRate) {
    throw new Error(`can't get rate for ${targetCurrencyCode}`);
  }
  var targetAmount = txtSourceAmount * sourceInUSD * targetRate;

  console.log(`${amountSourceCurrency} ${sourceCurrencyCode} is equal to ${targetAmount.toFixed(2)} ${targetCurrencyCode}`);

  // source country name
  countryLookup.then(result => { $("#txtCountry").text(result[sourceCountryCode]) })
  $("#txtSourceCurrency").text(sourceCurrencyCode);
  // $("#txtTargetCurrency").text(targetCurrency);
  $("#txtExchange").text(`${txtSourceAmount} ${sourceCurrencyCode} is equal to ${targetAmount.toFixed(2)} ${targetCurrencyCode}`);


})

// let exchangeRates = null;
function getExchangeRates(sourceCountryCode, sourceCountryName, sourceCurrency) {
  var baseCurrency = "GBP"; // Set the base currency to British Pound

  $.ajax({
    url: "libs/php/exchangeRates.php", // Replace with the actual path to your PHP script
    type: "POST",
    dataType: "json",
    data: {
      //baseCurrency: baseCurrency,
      countryCode: sourceCountryCode, // Include countryCode as a parameter
      countryName: sourceCountryName, // Include countryName as a parameter
    },
    success: function (result) {
      console.log("AJAX request for exchange rates successful");
      console.log(result);
      console.log(sourceCountryCode, sourceCountryName, sourceCurrency)


      if (result.data) {
        // Access exchange rate data here
        exchangeRates = result.data.rates;

        // populate targetCurrencySelect
        console.log($("#targetCurrencySelect"));
        $("#targetCurrencySelect").append(
          "<option default> Select Country</option>"
        );
        console.log(countries);

        let options2 = [];
        console.log(exchangeRates);
        let currencyCodes = Object.keys(exchangeRates);
        for (let code of currencyCodes) {
          options2.push($("<option/>").attr("value", code).text(`${code}`));
        }

        // let options2 = countries.map(async (country) => {
        //   let countryCode = country[1];
        //   let currencyCode = await countryCodeToCurrencyCode(countryCode);

        //   return $("<option/>").attr("value", country[1]).text(country[0]);
        // })
        $("#targetCurrencySelect").append(options2);


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
    // console.log("weather", data);

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
      // console.log(JSON.stringify(result));

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
      // console.log(JSON.stringify(result));


      if (result.status.code == 200) {
        //  console.log("airportsData");
        //   console.log(result.data);


        result.data.forEach(function (item) {
          console.log(item.lat);
          L.marker([item.lat, item.lng], { icon: airportIcon })
            .bindTooltip(item.name, { direction: 'top', sticky: true })
            .addTo(airports);

        })

      } else {

        showToast("Error retrieving airport data", 4000, false);

      }

    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}


//get cities

function getCities(countryCode) {

  $.ajax({
    url: "libs/php/getCities.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      console.log(JSON.stringify(result));


      if (result.status.code == 200) {
        console.log("citiesData");
        console.log(result.data);


        result.data.forEach(function (item) {
          console.log(item.lat);
          L.marker([item.lat, item.lng], { icon: cityIcon })
            .bindTooltip(item.name, { direction: 'top', sticky: true })
            .addTo(cities);

        })

      } else {

        showToast("Error retrieving airport data", 4000, false);

      }

    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}



//get hotels

function getHotels(countryCode) {

  $.ajax({
    url: "libs/php/getHotels.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      console.log(JSON.stringify(result));


      if (result.status.code == 200) {
        //  console.log("hotelsData");
        //   console.log(result.data);


        result.data.forEach(function (item) {
          console.log(item.lat);
          L.marker([item.lat, item.lng], { icon: hotelIcon })
            .bindTooltip(item.name, { direction: 'top', sticky: true })
            .addTo(hotels);

        })

      } else {

        showToast("Error retrieving airport data", 4000, false);

      }

    },

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
L.easyButton("fa-circle-info fa-xl", function (btn, map) {
  $("#modal1").modal("show");
}).addTo(map);
// Btn-1

L.easyButton("fa-wallet fa-xl", function (btn, map) {
  $("#modal2").modal("show");
}).addTo(map);
// Btn-2

L.easyButton("fa-cloud fa-xl", function (btn, map) {
  $("#modal3").modal("show");
}).addTo(map);
// Btn-3

L.easyButton("fa-clock fa-xl", function (btn, map) {
  $("#modal4").modal("show");
}).addTo(map);

// Btn-4  timezone

L.easyButton("fa-w fa-xl", function (btn, map) {
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
