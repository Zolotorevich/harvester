<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title> • Harvester</title>
	<meta name="referrer" content="unsafe-url">
    <link rel="stylesheet" href="/style/main.css" />
	<script src="/scripts/jquery-3.6.3.min.js"></script>
	<script src="/scripts/harvester/company.js"></script>
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
			<li id="issue_politics" class="menuExportKey1"><a href="/category/politics">POLITICS</a></li>
			<li id="issue_economy" class="menuExportKey2"><a href="/category/economy">ECONOMY</a></li>
			<li id="issue_corporate" class="menuExportKey3"><a href="/category/corporate">CORPORATE</a></li>
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