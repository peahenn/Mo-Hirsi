<?php
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $output['status']['code'] = "405";
    $output['status']['name'] = "Method Not Allowed";
    $output['status']['description'] = "Method not allowed. Use POST method to delete data.";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

if (!isset($_POST['id'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Department ID not provided";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$check_query = mysqli_query($conn, 'SELECT id, firstName, lastName, email from personnel where departmentID = '.$_POST['id']);
if (mysqli_num_rows($check_query)) {
	$output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Personnel Data still includes this Department";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
} else {
	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	$query->bind_param("i", $_POST['id']);
	$query->execute();
	
	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Query failed";    
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
	
	$output['status']['code'] = "200";
	$output['status']['name'] = "OK";
	$output['status']['description'] = "Department deleted successfully";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);
	echo json_encode($output);
}
?>
