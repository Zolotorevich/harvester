<?php

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//check get
if(isset($_GET['issue']) && isset($_GET['startDate'])) {

	//init
	$startDate = $_GET['startDate'];
	$issue = $_GET['issue'];

	//get list of crawlers
	$raw_crawlers = $connection->query("SELECT name FROM crawlers WHERE issue LIKE '$issue';");
	
	//collect result
	$crawlers = $raw_crawlers->fetch_all(MYSQLI_NUM);

	//init query
	$sql = '';

	foreach ($crawlers as $index => $crawlerName) {
		if ($index == 0) {
			$sql = "SELECT * FROM ".$crawlerName[0]." WHERE date >= '$startDate'";
		} else {
			$sql .= " UNION SELECT * FROM ".$crawlerName[0]." WHERE date >= '$startDate'";
		}
	}

	//close query
	$sql .= ";";

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