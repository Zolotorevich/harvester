<?php

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//check get
if(isset($_GET['issue']) && isset($_GET['startDate'])) {

	//init
	$startDate = $_GET['startDate'];
	$issue = $_GET['issue'];

	$newDATE = new DateTime($startDate);
	$newDATE = date_add($newDATE, new DateInterval('PT04H00S'));
	$mysqldate = $newDATE->format('Y-m-d H:i:s');

	if($issue == 'economy' || $issue == 'politics') {
		$sql = "SELECT * FROM news WHERE category = '$issue' AND date >= '$mysqldate';";
	} else {
		$sql = "SELECT * FROM news WHERE category != 'economy' AND category != 'politics' AND date >= '$mysqldate';";
	}
	
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