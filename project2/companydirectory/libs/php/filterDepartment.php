<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    $output['status']['code'] = "405";
    $output['status']['name'] = "Method Not Allowed";
    $output['status']['description'] = "Method not allowed. Use GET method to fetch data.";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Use proper sanitation to prevent SQL injection


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

$filterLocationName = $conn->real_escape_string($_GET['locationname']);


if ($conn->connect_error) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database connection error: " . $conn->connect_error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE l.name = "'.$filterLocationName.'" ORDER BY p.lastName, p.firstName, d.name, l.name';

$result = $conn->query($query);

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "Query failed: " . $conn->error;
    $output['data'] = [];
    $conn->close();
    echo json_encode($output);
    exit;
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "OK";
$output['status']['description'] = "Success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

$conn->close();
echo json_encode($output);
?>
