<?php

if(isset($_POST['country']) && isset($_POST['infoType']) && isset($_POST['username'])) {

    $country = $_POST['country'];
    $infoType = $_POST['infoType'];
    $username = $_POST['username'];
    
    switch ($infoType) {
        case "countryInfo":
            $apiUrl = "http://api.geonames.org/countryInfoJSON?country={$country}&username={$username}";
            break;
        case "earthquakes":
            $apiUrl = "http://api.geonames.org/earthquakesJSON?north=90&south=-90&east=180&west=-180&username={$username}";
            break;
        case "weather":
            // Return the error as a JSON string so the frontend can interpret it.
            echo json_encode(["error" => "Weather requires specific latitude and longitude. Please select another Info Type."]);
            exit;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    curl_close($ch);

    // Directly output the GeoNames API response
    echo $response;
} else {
    echo json_encode(["error" => "Invalid or incomplete parameters."]);
}
?>


