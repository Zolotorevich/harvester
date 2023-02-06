<?php 

$connection = mysqli_connect('localhost', 'root', '', 'harvester');
$connection->set_charset("utf8");
if(!$connection) {die("connection failed");}

 ?>