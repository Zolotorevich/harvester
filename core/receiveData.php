<?php
// DISABLE CORS
include $_SERVER['DOCUMENT_ROOT']."/core/cors.php";

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

// Init
$sql = '';
$crawlerName = '';

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

//Decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);

//update crawler name
if (str_contains($decoded[0]["link"], 'www.aljazeera.com')) { $crawlerName = 'aljazeera'; }
else if(str_contains($decoded[0]["link"], 'interfax.ru')) { $crawlerName = 'interfax'; }
else if(str_contains($decoded[0]["link"], 'www.nytimes.com')) { $crawlerName = 'nytimes'; }

//check if crawler has name
if ($crawlerName == '') {
	echo "FAIL: can't find crawler name";
	die();
}

//query for news
foreach ($decoded as $key => $value) {

	$newsDate = mysqli_real_escape_string($connection, $value["date"]);
	$newsTitle = mysqli_real_escape_string($connection, $value["title"]);
	$newsLink = mysqli_real_escape_string($connection, $value["link"]);

	$sql .= "INSERT INTO ".$crawlerName." (date, title, link) VALUES ('$newsDate', '$newsTitle', '$newsLink') ON DUPLICATE KEY UPDATE id=id;";

}

//copy lastNews colum to oldLastNews
$sql .= "UPDATE lastnews SET oldLastNews = (SELECT lastNews FROM lastnews WHERE crawler = '".$crawlerName."') WHERE crawler = '".$crawlerName."';";

//update lastNews
$lastNewsLink = mysqli_real_escape_string($connection, $decoded[0]["link"]);
$sql .= "UPDATE lastnews SET lastNews = '$lastNewsLink' WHERE crawler = '".$crawlerName."';";

//preform sql
if ($connection->multi_query($sql) === TRUE) {
	echo "Records created";
} else {
	echo "FAIL: " . $sql . "<br>" . $connection->error;
}

//close the connection
$connection->close();

?>