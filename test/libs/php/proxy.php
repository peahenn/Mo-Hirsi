<?php
$task = isset($_GET['task']) ? $_GET['task'] : '';
$username = isset($_GET['username']) ? $_GET['username'] : 'default_username'; 
var_dump($task, $username);
exit(); 

$url = '';

if ($task === 'timezone') {
    $url = 'http://api.geonames.org/timezoneJSON?lat=47.01&lng=10.2&username=mohi';
}

$response = file_get_contents($url);
header('Content-Type: application/json');
echo $response;
?>

