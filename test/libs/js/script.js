// main.js

function getAPIInfo() {
    const apiUrl = 'libs/php/proxy.php?task=timezone&username=mohi';
    //... rest of your function
}


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const resultDiv = document.getElementById('result');
            
            // Using the hardcoded 'obj' data if needed
            const obj = {
                sunrise: "2023-08-16 06:17",
                lng: 10.2,
                countryCode: "AT",
                gmtOffset: 1,
                rawOffset: 1,
                sunset: "2023-08-16 20:29",
                timezoneId: "Europe/Vienna",
                dstOffset: 2,
                countryName: "Austria",
                time: "2023-08-16 23:25",
                lat: 47.01
            };
            
            // If you need to use or merge the hardcoded 'obj' data with the fetched 'data', you can do it here.
            // For example, if you want to use the sunset time from the 'obj' instead of the API response:
            // data.sunset = obj.sunset;

            resultDiv.innerHTML = `
                <h2>Timezone Information</h2>
                <p><strong>Timezone ID:</strong> ${data.timezoneId}</p>
                <p><strong>Country Name:</strong> ${data.countryName}</p>
                <p><strong>Sunset Time:</strong> ${data.sunset}</p>
                <p><strong>Sunrise Time:</strong> ${data.sunrise}</p>
                <p><strong>Current Time:</strong> ${data.time}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

