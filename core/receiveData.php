<?php
// DISABLE CORS
include $_SERVER['DOCUMENT_ROOT']."/core/cors.php";

// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

//Decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);

// Init
$sql = '';
$crawlerName = $decoded[0]["carwler"];

//get crawler issue and alias
$result = $connection->query("SELECT issue, alias FROM crawlers WHERE name LIKE '$crawlerName';");

//collect result
$crawlerSpecs = $result->fetch_all(MYSQLI_ASSOC);

//query for news
foreach ($decoded[1] as $key => $value) {

	$newsDate = mysqli_real_escape_string($connection, $value["date"]);
	$newsTitle = mysqli_real_escape_string($connection, $value["title"]);
	$newsLink = mysqli_real_escape_string($connection, $value["link"]);
	$newsPreview = mysqli_real_escape_string($connection, $value["preview"]);

	$sql .= "INSERT INTO ".$crawlerSpecs[0]['issue']." (date, title, link, preview, crawler) VALUES ('$newsDate', '$newsTitle', '$newsLink','$newsPreview','".$crawlerSpecs[0]['alias']."') ON DUPLICATE KEY UPDATE id=id;";

	//update crawler last news
	if ($key === array_key_first($decoded[1])) {
        $sql .= "UPDATE crawlers SET lastDate = '$newsDate', lastTitle = '$newsTitle', lastLink = '$newsLink' WHERE name = '".$crawlerName."';";
    }

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