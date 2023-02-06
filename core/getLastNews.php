<?php
// DISABLE CORS
include $_SERVER['DOCUMENT_ROOT']."/core/cors.php";

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//check get
if(isset($_GET['crawler'])) {

	$crawler = $_GET['crawler'];

	//select last news link
	$sql = "SELECT * FROM lastnews WHERE crawler LIKE '$crawler'";

	//preform sql
	$result = $connection->query($sql);

	//check result
	if ($result->num_rows > 0) {

		//send data
		while ($row = $result->fetch_assoc()) {
			echo($row['lastNews']);
		}

	} else {

		//send error
		echo('FAIL: no last news for '.$crawler);

	}

	//close connection
	$connection->close();

} else {
	echo('FAIL: no get value');
}


?>