<?php

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//check get
if(isset($_GET['issue']) && isset($_GET['startDate'])) {

	//TODO get list of crawlers
	// $raw_crawlers = $connection->query("SELECT * FROM crawlers");

	// //collect result
	// $crawlers = $result->fetch_all(MYSQLI_ASSOC);


    echo getNews($connection,$_GET['issue'],$_GET['startDate']);
} else {
	echo 'FAIL: invalid GET';
}

//get news from db and return json
function getNews($connection, $issue, $startDate) {

	//check issue
	if ($issue == 'home') {
		//list of home crawlers
		//TODO get this list from db
		$homeCrawlers = ['tass','interfax'];

		$sql = '';

		foreach ($homeCrawlers as $index => $crawlerName) {
			if ($index == 0) {
				$sql = "SELECT * FROM ".$crawlerName." WHERE date >= '$startDate' ";
			} else {
				$sql .= "UNION SELECT * FROM ".$crawlerName." WHERE date >= '$startDate';";
			}
		}
	}

	//preform sql
	$result = $connection->query($sql);
	
	//collect result
	$rows = $result->fetch_all(MYSQLI_ASSOC);

	//close the connection
	$connection->close();
	
	return json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

?>