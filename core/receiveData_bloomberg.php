<?php
// DISABLE CORS
include $_SERVER['DOCUMENT_ROOT']."/core/cors.php";

// BD connect
$connection = mysqli_connect('localhost', 'root', '', 'ntab');
$connection->set_charset("utf8");
if(!$connection) {die("connection failed");}

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

//Decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);

// Init
$sql = '';

//query for news
foreach ($decoded[1] as $key => $value) {

	$newsDate = mysqli_real_escape_string($connection, $value["date"]);
	$newsTitle = mysqli_real_escape_string($connection, $value["title"]);
	$newsLink = mysqli_real_escape_string($connection, $value["link"]);
	$newsPreview = mysqli_real_escape_string($connection, $value["preview"]);

	$sql .= "INSERT INTO harvester_news (title, url, preview, date) VALUES ('$newsTitle', '$newsLink','$newsPreview','$newsDate') ON DUPLICATE KEY UPDATE id=id;";

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