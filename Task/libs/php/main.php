<?php

if (isset($_POST['country']) && isset($_POST['infoType']) && isset($_POST['username'])) {

    $country = filter_input(INPUT_POST, 'country', FILTER_SANITIZE_STRING);
    $infoType = filter_input(INPUT_POST, 'infoType', FILTER_SANITIZE_STRING);
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    
    switch ($infoType) {
        case "countryInfo":
            $apiUrl = "https://api.geonames.org/countryInfoJSON?country={$country}&username={$username}";
            break;
        case "earthquakes":
            $apiUrl = "https://api.geonames.org/earthquakesJSON?north=90&south=-90&east=180&west=-180&username={$username}";
            break;
        case "weather":
            echo json_encode(["error" => "Weather requires specific latitude and longitude. Please select another Info Type."]);
            exit;
        case "neighbours":
            $apiUrl = "https://api.geonames.org/neighboursJSON?country={$country}&username={$username}";
            break;
        case "capitalInfo":
            $apiUrl = "https://api.geonames.org/searchJSON?country={$country}&featureCode=PPLC&maxRows=1&username={$username}";
            break;
        case "timezone":
            $apiUrl = "https://api.geonames.org/timezoneJSON?country={$country}&username={$username}";
            break;
        default:
            echo json_encode(["error" => "Unsupported info type."]);
            exit;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo json_encode(["error" => curl_error($ch)]);
        curl_close($ch);
        exit;
    }
    
    if (json_decode($response) === null && json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["error" => "Received malformed response from the API."]);
        curl_close($ch);
        exit;
    }

    curl_close($ch);
    echo $response;

} else {
    echo json_encode(["error" => "Invalid or incomplete parameters."]);
}

?>
