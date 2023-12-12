<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $locationID = $_POST['id'];
    $updatedLocationName = $_POST['name'];

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
    $query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
    $query->bind_param("si", $updatedLocationName, $locationID);

    if ($query->execute()) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Location updated successfully";
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Error updating Location: " . $conn->error;
    }
    mysqli_close($conn);
    echo json_encode($output);
} else {
    $output['status']['code'] = "405";
    $output['status']['name'] = "method not allowed";
    $output['status']['description'] = "Method not allowed";
    mysqli_close($conn);
    echo json_encode($output);
}
?>
