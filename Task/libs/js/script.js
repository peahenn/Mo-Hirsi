document.addEventListener("DOMContentLoaded", function() {
    const submitBtn = document.querySelector("button");
    submitBtn.addEventListener("click", getInfo);
});

function getInfo() {
    const country = document.getElementById("countrySelect").value;
    const infoType = document.getElementById("infoTypeSelect").value;
    const username = "mohi";

    $.ajax({
        url: '/Task/libs/php/main.php',
        type: 'POST',
        data: {
            country: country,
            infoType: infoType,
            username: username
        },
        dataType: 'json',
        success: function(data) {
            const outputDiv = document.getElementById("output");
            if (data.error) {
                outputDiv.innerHTML = `<p class="error">${data.error}</p>`;
            } else {
                outputDiv.innerHTML = formatDataOutput(data, infoType);
            }
        },
        error: function(error) {
            console.error("Failed to fetch data:", error);
            const outputDiv = document.getElementById("output");
            outputDiv.innerHTML = `<p class="error">An error occurred while processing the request.</p>`;
        }
    });
}

function formatDataOutput(data, infoType) {
    switch (infoType) {
        case "countryInfo":
            const countryInfo = data.geonames[0];
            return `
                <h2>${countryInfo.countryName}</h2>
                <p><strong>Capital:</strong> ${countryInfo.capital}</p>
                <p><strong>Population:</strong> ${countryInfo.population}</p>
                <p><strong>Area:</strong> ${countryInfo.areaInSqKm} km<sup>2</sup></p>
            `;
        case "neighbours":
            const neighbours = data.geonames.map(n => n.countryName).join(", ");
            return `
                <h2>Neighbouring Countries:</h2>
                <p>${neighbours}</p>
            `;
        case "capitalInfo":
            const capitalInfo = data.geonames[0];
            return `
                <h2>Capital Information:</h2>
                <p><strong>Name:</strong> ${capitalInfo.name}</p>
                <p><strong>Population:</strong> ${capitalInfo.population}</p>
            `;
        case "timezone":
            return `
                <h2>Timezone Information:</h2>
                <p><strong>Timezone:</strong> ${data.timezoneId}</p>
                <p><strong>GMT Offset:</strong> ${data.gmtOffset}</p>
            `;
        // ... handle other types similarly
        default:
            return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
}
