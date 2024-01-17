<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $updatedLocationName = $_POST['name'];

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
    $query = $conn->prepare('INSERT INTO location (name) VALUES (?)');
    $query->bind_param("s", $updatedLocationName);

    if ($query->execute()) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Personnel updated successfully";
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Error updating personnel: " . $conn->error;
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
