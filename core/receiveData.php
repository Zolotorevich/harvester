<?php
// DISABLE CORS
include $_SERVER['DOCUMENT_ROOT']."/core/cors.php";

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

//Decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);

//INPUT JSON: [crawler.name, [newsArray]]
$crawlerName = mysqli_real_escape_string($connection, $decoded[0]["carwler"]);

//query for news
foreach ($decoded[1] as $key => $value) {

	$newsLink = mysqli_real_escape_string($connection, $value["link"]);
	$newsTitle = mysqli_real_escape_string($connection, $value["title"]);
	$newsPreview = mysqli_real_escape_string($connection, $value["preview"]);

	$sql .= "INSERT INTO news (category, title, url, preview) VALUES ('$crawlerName', '$newsTitle', '$newsLink','$newsPreview') ON DUPLICATE KEY UPDATE category='$crawlerName';";

}

//preform sql
if ($connection->multi_query($sql) === TRUE) {
	echo "Records created";
} else {
	echo "FAIL: " . $sql . "<br>" . $connection->error;
}

//close the connection
$connection->close();

?>