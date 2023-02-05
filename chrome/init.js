const houndDateObj = new Object();
const houndNewsObj = new Object();
let houndIssuesAndGroups = [
	{
		name : 'lenovosti',
		groups : ['nt', 'leader| glue', 'body| default', 'hq| glue']
		// groups : ['nt', 'lead| glue', 'body| default', 'arms', 'fight', 'dipl']
	},
	{
		name : 'allgood',
		groups : ['nt', 'leader| glue', 'body| default']
	},
	{
		name : 'un',
		groups : ['nt', 'leader| glue', 'body| default']
	},
	{
		name : 'unsc',
		groups : ['nt', 'leader| glue', 'body| default']
	},
	{
		name : 'korea',
		groups : ['leader| default', 'news', 'article']
	}
]

//list of websites where toolbar are not showing, type: RegExp
let houndToolbarHideList = [
	'interfax\.ru\/$',
	'interfax\.ru\/photo\/.*',
	'interfax\.ru\/search\/.*',
	'interfax\.ru\/tags\/.*',
	'tass\.ru\/$',
	'tass\.ru\/mezhdunarodnaya-panorama$',
	'tass\.ru\/politika$',
	'tass\.ru\/obschestvo$',
	'tass\.ru\/ekonomika$',
	'tass\.ru\/search.*',
	'tass\.ru\/tag\/.*',
	'nytimes\.com\/$',
	'nytimes\.com\/section\/world$',
	'theguardian\.com\/$',
	'theguardian\.com\/international$',
	'theguardian\.com\/world$',
	'theguardian\.com\/world\/africa$',
	'theguardian\.com\/world\/americas$',
	'theguardian\.com\/world\/asia-pacific$',
	'theguardian\.com\/australia-news$',
	'theguardian\.com\/world\/europe-news$',
	'theguardian\.com\/world\/middleeast$',
	'theguardian\.com\/world\/south-and-central-asia$',
	'theguardian\.com\/uk-news$',
	'theguardian\.com\/us-news$',
	'reuters\.com\/$',
	'reuters\.com\/myview\/all\/all-entities\/$',
	'aljazeera\.com\/$',
	'aljazeera\.com\/news\/$',
	'interfax\.ru\/$',
	'youtube\.com\/.*',
	'twitch\.tv\/.*',
	'media\.un\.org\/.*',
	'cbr\.ru\/.*',
	'quote\.ru\/ticker\/.*',
	'profinance\.ru\/charts\/.*',
	'namex\.org\/.*'
]

$(document).ready(function(){

	//create date object
	createHoundDateObj();

	//create news data object
	createHoundNewsObj();

	//create toolbar
	createHoundToolbar();

	//set handlers and textarea focus
	setEventHandlers();

	//launch parser
	houndParser();

});


function createHoundDateObj() {
	// .today == 20230124
	// .year == 2023
	// .time == 1200
	// .dayMonth == 0124

	const today = new Date();
	var todayDayNumber = today.getDate();
	var todayMonth = today.getMonth();
	var year = today.getFullYear().toString();
	var hour = today.getHours();
	var minutes = today.getMinutes();

	houndDateObj.today = year + addLeadingZero(todayMonth + 1) + addLeadingZero(todayDayNumber);
	houndDateObj.year = year;
	houndDateObj.time = addLeadingZero(hour) + addLeadingZero(minutes);
	houndDateObj.dayMonth = addLeadingZero(todayMonth + 1) + addLeadingZero(todayDayNumber);

}

function createHoundNewsObj() {
	houndNewsObj.issue = 'lenovosti';
	houndNewsObj.dateAdded = houndDateObj.today + houndDateObj.time;
	houndNewsObj.date = houndDateObj.today + '0000';
	houndNewsObj.text = '';
	houndNewsObj.link = window.location.href;
	houndNewsObj.count = 1;
	houndNewsObj.groupName = 'body';
	houndNewsObj.glue = 0;
	houndNewsObj.key = '427303476425226691285952628631';
}

function createHoundToolbar() {

	var toolbarContainer = document.createElement('div');
	toolbarContainer.id = 'hound_toolbarContainer';
	document.documentElement.appendChild(toolbarContainer);

	var html = '<div id="hound_toolbarContainer">';
	html += '<div id="hound_toolbarDisplay">'

	html += '<div id="hound_displayTitle">' + houndIssuesAndGroups[0].name + '</div>';
	html += '<div id="hound_displayGroupType">';

	//display first isse groups
	html += houndDisplayListOfGroups(houndIssuesAndGroups[0].name);

	html += '</div>';
	html += '<div id="hound_displayStatusMessage" class="hound_messageNormal">Ready</div>';

	html += '</div>';

	html += '<textarea id="hound_toolbarTextarea" rows="3"></textarea>';

	html += '<div class="hound_flexBreak"></div>';

	html += '<div id="hound_issueSelector">';

	//dipslay issue buttons
	houndIssuesAndGroups.forEach((element, index) => {

		//check if it's first element
		if (index == 0) {
			//turn indicator ON
			html += '<div class="hound_selectorOn"';
		} else {
			//indicator OFF
			html += '<div class="hound_selectorOff"';
		}
		
		html += ' data-issue="' + element.name + '"></div>';
		
	});

	html += '</div>';

	html += '<div id="houndSendButtons"><div id="hound_saveButton">SEND</div><div id="hound_sendSeparator">•</div><div id="hound_glueButton">GLUE</div></div>';

	html += '<div id="hound_Time" contenteditable="true">0000</div><div id="hound_DateLabel">D</div><div id="hound_Date" contenteditable="true">' + fullDateToShortDate(houndDateObj.today) + '</div>';

	html += '<div id="hound_Count">COUNT</div>';
	
	html += '</div>'

	document.getElementById('hound_toolbarContainer').innerHTML = html;

}

function setEventHandlers() {
	//Count handler
	$('#hound_Count').click(function(){ houndToggleCounter(); });

	//issue change handler
	$('#hound_issueSelector').children().click( function(){ houndChangeIssue($(this).attr('data-issue')); });

	//group change handler
	$('#hound_displayGroupType').children().click( function(){ houndChangeGroup($(this).attr('data-group')); });
	
	//SAVE and GLUE buttons handlers
	houndEnableSendButtons();

	//Set focus on textarea
	$('#hound_toolbarTextarea').focus();

	//Date label
	$('#hound_DateLabel').click(function(){ $('#hound_Date').focus(); });
	
	//Keyboard shorcuts
	$('body').keydown(function( event ) { houndKeyboardShortcut(event); });
	$('#hound_toolbarTextarea').keydown(function( event ) { houndKeyboardShortcut(event); });
	$('#hound_Time').keydown(function( event ) { houndKeyboardShortcut(event); });
	$('#hound_Date').keydown(function( event ) { houndKeyboardShortcut(event); });
	


}

function houndParser() {

	hideToolbar = false;

	//check if toolbar needed
	houndToolbarHideList.forEach(element => {
		if (houndNewsObj.link.match(element)) {
			hideToolbar = true;
		}
	});

	if (hideToolbar) {houndToggleDisplay();}

	else if (houndNewsObj.link.includes('interfax.ru')) {houndParseInterfax();}

	else if (houndNewsObj.link.includes('tass.ru')) {houndParseTass();}
	
	else if (houndNewsObj.link.includes('static.riafan.ru')) {getMapRiafan();}
	
	else if (houndNewsObj.link.includes('nytimes.com')) {houndParseNYTimes();}
	
	else if (houndNewsObj.link.includes('theguardian.com')) {houndParseGuardian();} 

	else if (houndNewsObj.link.includes('reuters.com')) {houndParseReuters();}
	
	else if (houndNewsObj.link.includes('aljazeera.com')) {houndParseAlJazeera();}

	else if (houndNewsObj.link.includes('https://t.me')) {houndParseTelegram();}

}
