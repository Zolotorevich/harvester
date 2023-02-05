//Object for storing dates
const dateObj = new Object();
var globalNewsCounter = 0;

//init data objects
var newsData;
var ratesData;
var teaserData;

//templates for HQ
const HQtemplateMO = new Object();
const HQtemplateDNR = new Object();
const HQtemplateLNR = new Object();
const HQtemplateSDNR = new Object();
const HQtemplateSLNR = new Object();

$(document).ready(function(){

	//create dateObj
	createDateObject();

	//Get data from db and display
	getNewsData();
	getRatesData();
	getTeaserData();

	//Menu items handlers
	$('#menuIndicatorsList').on('click', function() {changeView()});
	$('#menuExportTelegram').on('click', function() {exportTelegram()});
	$('#menuExportBoosty').on('click', function() {exportBoosty()});
	$('#menuExportTGFree').on('click', function() {exportTGFree()});
	$('#menuExportPikabu').on('click', function() {exportPikabu()});
	$('#menuExportDzen').on('click', function() {exportDzen()});

	//rates save button
	$('#ratesSaveButton').on('click', function() {saveRates()});

	//rates get button
	$('#ratesGetButton').on('click', function() {getRatesData()});

	//teaser get button
	$('#teaserGetButton').on('click', function() {getTeaserData()});

	//teaser save button
	$('#teaserSaveButton').on('click', function() {saveTeaser()});
	

});


function getNewsData() {
	
	//newsData
	//if it's friday evening, weekends or monday morning -> get news from last friday
	if (dateObj.weekends) {
		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'lenovosti', startDate: dateObj.lastFriday + '1900'},
			success: function(data){
				newsData = data;
			}
		}).done(function() {
			displayNews();
		});
	} else {
		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'lenovosti', startDate: dateObj.yesterday + '1900'},
			success: function(data){
				newsData = data;
			}
		}).done(function() {
			displayNews();
		});
	}
	
}

function getRatesData() {
	//request rates
	if (dateObj.todayDayOfWeekWord == 'Monday') {
		//if it's monday, then take rates from friday

		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'rates', startDate: dateObj.lastFriday},
			success: function(data){
				ratesData = data;
				updateRates();
			}
		});
	} else if(dateObj.todayDayOfWeekWord == 'Friday') {
		//if it's friday, then take rates from monday
		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'rates', startDate: dateObj.lastMonday},
			success: function(data){
				ratesData = data;
				updateRates();
			}
		});
	} else {
		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'rates', startDate: dateObj.yesterday},
			success: function(data){
				ratesData = data;
				updateRates();
			}
		});
	}
}

function saveRates() {
	//get data from div
	const ratesArray = $('#leditorRatesToday').val().split("\n");

	//replace comma with dot
	for (let index = 0; index < ratesArray.length; index++) {
		var element = ratesArray[index];
		ratesArray[index] = parseFloat(element.toString().replace(',', '.'));
	}

	//send data
	$.ajax({
		method: "POST",
		url: "/core/saveRates.php",
		data: { date: dateObj.today, usd: ratesArray[0], eur: ratesArray[1], oil: ratesArray[2], gas: ratesArray[3], gip: ratesArray[4] }
	  }).done(function( msg ) {
			//show saved message
			$('#ratesSavedMessage').show();
			$('#ratesSavedMessage').html(' ' + msg);
	});
}

function getTeaserData() {
	$.ajax({
		url: '/core/getNews.php',
		method: 'get',
		dataType: 'json',
		data: {issue: 'teaser', startDate: dateObj.today},
		success: function(data){
			teaserData = data;
			updateTeaser();
		}
	});
}

function saveTeaser() {

	//send data
	$.ajax({
		method: "POST",
		url: "/core/saveTeaser.php",
		data: { date: dateObj.today, text: $('#leditorTeaserText').val(), numberOfNews: $('#teaserNumberOfNews').val() }
	  }).done(function( msg ) {
			//show saved message
			$('#ratesSavedMessage').show();
			$('#ratesSavedMessage').html(' ' + msg);
	});
}


function changeView(destination) {
	//hide all views
	$('#leditorContainer').hide();
	$('#exportTelegram').hide();
	$('#exportBoosty').hide();
	$('#exportTGFree').hide();
	$('#exportPikabu').hide();
	$('#exportDzen').hide();
	
	//TODO clear all menu items
	
	//display destination view
	switch (destination) {
		case 'telegramExport':
			$('#exportTelegram').show();
			break;
		case 'boostyExport':
			$('#exportBoosty').show();
			break;
		case 'TGFreeExport':
			$('#exportTelegram').show();
			break;
		case 'exportPikabu':
			$('#exportPikabu').show();
			break;
		case 'exportDzen':
			$('#exportDzen').show();
			break;
		default:
			$('#leditorContainer').show();
			break;
	}

	//TODO display destination menu item

}