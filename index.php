<?php
// BD connect
include $_SERVER['DOCUMENT_ROOT']."/core/bdconnect.php";

//if(!isset($_COOKIE["password"]) || ($_COOKIE["password"] != 'R/WpN)<CN8C7m4K!+35gz&MUE=j8!')){ header("Location: /auth.php"); die(); }


?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Lenovosti Today • Leditor II</title>
    <link rel="stylesheet" href="/style/main.css" />
	<script src="/scripts/jquery-3.6.3.min.js"></script>
	<script src="/scripts/global.js"></script>
	<script src="/scripts/lenovosti/main.js"></script>
	<script src="/scripts/lenovosti/support.js"></script>
	<script src="/scripts/lenovosti/dateFunctions.js"></script>
	<script src="/scripts/lenovosti/displayNews.js"></script>
	<script src="/scripts/lenovosti/export.js"></script>
	<script src="/scripts/lenovosti/exportTelegram.js"></script>
	<script src="/scripts/lenovosti/exportBoosty.js"></script>
	<script src="/scripts/lenovosti/exportTGFree.js"></script>
	<script src="/scripts/lenovosti/exportPikabu.js"></script>
	<script src="/scripts/lenovosti/exportDzen.js"></script>
	<script src="/scripts/lenovosti/updateNews.js"></script>
	<script src="/scripts/lenovosti/editNews.js"></script>
	
</head>
<body>

	<div id="activeButton" data-id="-1" data-active="1"><div class="activeButtonON"></div></div>

	<div id="interfaceContainer">
		

		<div id="newsWithTimeEditForm" class="leditorNewsWithTimeEdit" data-id="0"><textarea name="" id="newsWithTimeEditForm_textarea"></textarea>
			<div class="flexBreak"></div><div class="leditorNewsEditControlsCTA" id="newsWithTimeEditForm_save" data-id="0">SAVE</div>
			<div class="leditorNewsEditControlsInput" contenteditable="true" id="newsWithTimeEditForm_time"></div>
			<div class="leditorNewsEditControlsInput" contenteditable="true" id="newsWithTimeEditForm_date"></div>
			<div class="leditorNewsEditControlsMisc" id="newsWithTimeEditForm_count">COUNT</div><div class="leditorNewsEditControlsMisc" id="newsWithTimeEditForm_lead" data-id="0">LEAD</div>
			<div class="leditorNewsEditControlsInput leditorNewsEditLinkContainer" contenteditable="true" id="newsWithTimeEditForm_link"></div>
		</div>

		<div id="leaderNewsEditForm" class="leditorNewsLeaderEdit" data-id="0">
			<div class="leditorNewsEditOrderArrow">
				<div class="leditorNewsEditOrderArrowUp" id="leaderNewsEditForm_arrowup" data-id="0"></div><div class="leditorNewsEditOrderArrowDown" id="leaderNewsEditForm_arrowdown" data-id="0"></div>
			</div>
			<textarea name="" id="leaderNewsEditForm_textarea" rows="4"></textarea>
			<div class="flexBreak"></div><div class="leditorNewsEditControlsCTA" id="leaderNewsEditForm_save">SAVE</div>
			<div class="leditorNewsEditControlsCTALabel">&nbsp;•&nbsp;</div><div id="leaderNewsEditForm_glue" class="leditorNewsEditControlsGlue">GLUE</div>
			<div class="leditorNewsEditControlsInput" contenteditable="true" id="leaderNewsEditForm_groupIndex"></div>
			<div class="leditorNewsEditControlsMisc" id="leaderNewsEditForm_count">COUNT</div>
			<div class="leditorNewsEditControlsMisc" id="leaderNewsEditForm_body">BODY</div>
			<div class="leditorNewsEditControlsInput leditorNewsEditLinkContainer" contenteditable="true" id="leaderNewsEditForm_link"></div>
		</div>

	</div>

	<div id="issueSelector">
		<div id="issueMainHeader">Leditor II</div>
		<div id="issueTypeContainer">
			<a href="/"><div><img src="style/issueTypes/leToday.jpg" alt="">Today</div></a>
		</div>
		<div id="issueBackButton"><div>BACK</div></div>
	</div>

	<div id="mainDisplay">
		<div id="displayNewsCounter">000</div>
		<div id="displayNewsTime">0</div>
		<div id="displayNewsCounterCorrection">±0</div>
	</div>

	<div id="leftSideMenu">
		<ul id="menuIndicatorsList" class="menuIndicatorsListSelected">
			<li id="menuIndicatorLeader">Leader</li>
			<li id="menuIndicatorBody">Body</li>
			<li id="menuIndicatorForeign">Foreign</li>
			<li id="menuIndicatorRates">Rates</li>
			<li id="menuIndicatorHQ">HQ</li>
		</ul>
		<div class="menuHLine"></div>
		<ul id="menuExportList">
			<li id="menuExportTelegram" class="menuExportKey2">Telegram</li>
			<li id="menuExportBoosty" class="menuExportKey3">Boosty</li>
			<li id="menuExportTGFree" class="menuExportKey4">TG Free</li>
			<li id="menuExportPikabu" class="menuExportKey5">Pikabu</li>
			<li id="menuExportDzen" class="menuExportKey6">Dzen</li>
			<!-- <li id="menuExportVKcom" class="menuExportKey7">VKcom</li> -->
		</ul>
	</div>

	<div id="statusDisplay">
		<ul id="displayStatusMessageContainer">
			<li id="displayStatusMessage" class="">Ready</li>
		</ul>
		<div id="displayTimeUpdate">00:00</div>
	</div>

	<!-- EDITOR -->
	<div id="leditorContainer">

		<div id="leditorNotes">
			<div class="leditroHeader">
				<div>NOTES • <span class="leditorHeaderButton">HIDE</span></div><div class="hLine"></div>
			</div>
			<div id="leditorNotesContent"></div>
		</div>

		<div id="leditorLeader">
			<div class="leditroHeader" id="leditorLeaderHeader">
				<!-- • <span class="textColorRed">Oversize -84</span> -->
			</div>
			<div id="leditorLeaderContent"></div>
		</div>

		<div id="leditorYesterday">
			<div class="leditroHeader" id="leditorYesterdayHeader"></div>
			<div id="leditorYesterdayContent"></div>
		</div>

		<div id="leditorToday">
			<div class="leditroHeader" id="leditorTodayHeader"></div>
			<div id="leditorTodayContent"></div>
		</div>

		<div id="leditorNYTimes">
			<div class="leditroHeader" id="leditorNYTimesHeader"></div>
			<div id="leditorNYTimesContent"></div>
		</div>

		<div id="leditorGuardian">
			<div class="leditroHeader" id="leditorGuardianHeader"></div>
			<div id="leditorGuardianContent"></div>
		</div>

		<div id="leditorReuters">
			<div class="leditroHeader" id="leditorReutersHeader"></div>
			<div id="leditorReutersContent"></div>
		</div>

		<div id="leditorAljazeera">
			<div class="leditroHeader" id="leditorAljazeeraHeader"></div>
			<div id="leditorAljazeeraContent"></div>
		</div>

		<div id="leditorTeaser">
			<div class="leditroHeader">
				<div>Teaser<span class="textColorGreen" id="ratesSavedMessage"></span> • <span class="leditorHeaderButton" id="teaserGetButton">GET</span></div>
				<div class="hLine"></div>
			</div>

			<div id="leditorTeaserContent">
				<textarea id="leditorTeaserText"></textarea><br/>
				<input type="text" id="teaserNumberOfNews" value =""> <span class="leditorHeaderButton" id="teaserSaveButton">SAVE</span>
			</div>

		</div>

		<div id="leditorRates">
			<div class="leditroHeader">
				<div>RATES • <span class="leditorHeaderButton" id="ratesSaveButton">SAVE</span><span class="textColorGreen" id="ratesSavedMessage"></span> • <span class="leditorHeaderButton" id="ratesGetButton">GET</span></div>
				<div class="hLine"></div>
			</div>

			<div id="leditorRatesContent">
				<div class="leditorRates">
					<div class="leditorRatesType">USD<br/>EUR<br/>OIL<br/>GAS<br/>GIP</div>
					<div class="leditorRatesYesterday" id="leditorRatesYesterday"></div>
					<div class="leditorRatesArrows">⇢<br/>⇢<br/>⇢<br/>⇢<br/>⇢</div>
					<textarea class="leditorRatesToday" id="leditorRatesToday"></textarea>
				</div>
			</div>

		</div>

		<div id="leditorHQ">
			<div class="leditroHeader" id="leditorHQHeader"></div>
			<div id="leditorHQContent"></div>
		</div>

		<div id="leditorEndLine"></div>
	
	
	
	</div>

	<!-- TELEGRAM EXPORT -->
	<div id="exportTelegram">
		<div id="exportTelegramFullSize"></div>
	</div>

	<!-- BOOSTY EXPORT -->
	<div id="exportBoosty">
		<div id="exportBoostyFullSize"></div>
	</div>

	<!-- PIKABU EXPORT -->
	<div id="exportPikabu">
		<div id="exportPikabuFullSize"></div>
	</div>

	<!-- DZEN EXPORT -->
	<div id="exportDzen">
		<div id="exportDzenFullSize">123</div>
	</div>

</body>
</html>