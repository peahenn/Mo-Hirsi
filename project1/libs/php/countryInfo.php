<?php

	

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
     echo($_REQUEST['countryName']);


	// https://api.opencagedata.com/geocode/v1/json?q=uk&key=4524669a072a44b8a71ea81107053b1a&language=en&pretty=1

	// $url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'] . '&username=mohi';
	$url= 'https://api.opencagedata.com/geocode/v1/json?q= '. $_REQUEST['countryName'] . '&key=4524669a072a44b8a71ea81107053b1a&language=en';
     echo($url);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');
     
	echo json_encode($output); 

?>





