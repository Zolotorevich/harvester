<?php
// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//Receive the RAW post data.
$content = trim(file_get_contents("php://input"));

//Decode the incoming RAW post data from JSON.
$decoded = json_decode($content, true);

// Init
$sql = '';
$issue = $decoded[0];

//query for news
foreach ($decoded[1] as $value) {

	$sql .= "UPDATE news SET viewed = 1 WHERE id = $value;";

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