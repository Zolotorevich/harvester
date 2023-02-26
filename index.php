<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title> • Harvester</title>
    <link rel="stylesheet" href="/style/main.css" />
	<script src="/scripts/jquery-3.6.3.min.js"></script>
	<script src="/scripts/harvester/main.js"></script>
	<script src="/scripts/harvester/dateFunctions.js"></script>
	<script src="/scripts/harvester/support.js"></script>
	<script src="/scripts/harvester/shortcuts.js"></script>
	<script src="/scripts/harvester/ajax.js"></script>
</head>
<body>


	<div id="mainDisplay">
		<div id="displayNewsCounter"><span>000</span></div>
		<div id="displayNewsTime"></div>
		<div id="displayNewsCounterCorrection"></div>
	</div>

	<div id="leftSideMenu">
		<ul id="menuExportList">
			<li id="issue_home" data-issue="home" class="menuExportKey1">Home</li>
			<li id="issue_foreignNews" data-issue="foreignNews" class="menuExportKey2">Foreign</li>
			<li id="issue_ntab" data-issue="ntab" class="menuExportKey3">ntab</li>
		</ul>
		<div class="menuHLine"></div>
		<ul id="menuIndicatorsList">
			<li class="menuIndicatorON" id="viewedSwitch">Viewed</li>
		</ul>
	</div>

	<div id="harvesterContainer">

	</div>

	<div id="noData" class="listInfoMessage">NO DATA</div>
	<div id="nothingToDisplay" class="listInfoMessage">Nothing to display</div>

	<div id="leditorEndLine"></div>



</body>
</html>