<?php
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        include("config.php");

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

        $query = $conn->prepare('SELECT `id`, `firstName`, `lastName`, `email`, `jobTitle`, `departmentID` FROM `personnel` WHERE `id` = ?');
        $query->bind_param("i", $_POST['id']);
        $query->execute();

        if (false === $query) {
            $output['status']['code'] = "400";
            $output['status']['name'] = "executed";
            $output['status']['description'] = "query failed";
            $output['data'] = [];
            mysqli_close($conn);
            echo json_encode($output);
            exit;
        }

        $result = $query->get_result();
        $personnel = [];

        while ($row = mysqli_fetch_assoc($result)) {
            array_push($personnel, $row);
        }

        $query = 'SELECT id, name from department ORDER BY name';
        $result = $conn->query($query);

        if (!$result) {
            $output['status']['code'] = "400";
            $output['status']['name'] = "executed";
            $output['status']['description'] = "query failed";
            $output['data'] = [];
            mysqli_close($conn);
            echo json_encode($output);
            exit;
        }

        $department = [];

        while ($row = mysqli_fetch_assoc($result)) {
            array_push($department, $row);
        }

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data']['personnel'] = $personnel;
        $output['data']['department'] = $department;

        mysqli_close($conn);
        echo json_encode($output);
    } else {
        $response = array(
            'status' => array(
                'code' => 400,
                'message' => 'Personnel ID not provided'
            )
        );

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($response);
    }
} else {
    $response = array(
        'status' => array(
            'code' => 400,
            'message' => 'Invalid request method'
        )
    );

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($response);
}
?>
