<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include("config.php");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $DepartmentName = $_POST['departmentName']; 
    $Location = $_POST['location'];

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
    
    // Check for connection errors
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    // Corrected SQL query and binding parameters
    $query = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');

    // Check if the prepare statement was successful
    if ($query === false) {
        die('Error preparing statement: ' . $conn->error);
    }

    $query->bind_param("ss", $DepartmentName, $Location);

    // Check if the bind_param was successful
    if (!$query->execute()) {
        die('Error executing statement: ' . $query->error);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Department inserted successfully";

    $query->close(); // Close the prepared statement
    mysqli_close($conn);
    echo json_encode($output);
} else {
    $output['status']['code'] = "405";
    $output['status']['name'] = "method not allowed";
    $output['status']['description'] = "Method not allowed";
    echo json_encode($output);
}
?>
