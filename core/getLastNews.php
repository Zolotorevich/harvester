<?php
// DISABLE CORS
include $_SERVER['DOCUMENT_ROOT']."/core/cors.php";

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//check get
if(isset($_GET['crawler'])) {

	$crawler = $_GET['crawler'];

	//select last news link
	$sql = "SELECT lastDate, lastTitle, lastLink FROM crawlers WHERE name LIKE '$crawler'";

	//preform sql
	$result = $connection->query($sql);

	//collect result
	$rows = $result->fetch_all(MYSQLI_ASSOC);

	//close the connection
	$connection->close();

	//return reslut
	echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} else {
	echo('FAIL: no get value');
}


?>