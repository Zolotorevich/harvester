<?php

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//check get
if(isset($_GET['issue']) && isset($_GET['startDate'])) {

	

	//init
	$startDate = $_GET['startDate'];
	$issue = $_GET['issue'];

	$sql = "SELECT * FROM $issue WHERE date >= '$startDate';";
	
	//preform sql
	$result = $connection->query($sql);

	//collect result
	$rows = $result->fetch_all(MYSQLI_ASSOC);

	//close the connection
	$connection->close();

	

	//return reslut
	echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} else {
	echo 'FAIL: invalid GET';
}

?>