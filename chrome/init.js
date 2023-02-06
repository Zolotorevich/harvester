const harvesterDateObj = new Object();
let serevrUrl = 'https://harvester.local';

$(document).ready(function(){

	create_harvesterDateObj();

	var url = window.location.href;

	if (url.includes('interfax.ru')) {harvester_getLastNews('interfax');}
	else if (url.includes('aljazeera.com')) {harvester_getLastNews('aljazeera');}
	else if (url.includes('nytimes.com')) {harvester_getLastNews('nytimes');}
	else if (url.includes('tass.ru')) {crawlTass();}

});

function create_harvesterDateObj() {
	// .hours == 12
	// .minutes == 09
	// .seconds == 01
	// .time == 1209
	// .fullDateTime == 202302151209
	// .today == 20230215
	// .yesterday == 20230214
	// .beforeyesterday == 20230213
	// .year == 2023

	const today = new Date();
	var hour = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	var todayDayNumber = today.getDate();
	var todayMonth = today.getMonth();
	var year = today.getFullYear().toString();

	harvesterDateObj.hours = addLeadingZero(hour);
	harvesterDateObj.minutes = addLeadingZero(minutes);
	harvesterDateObj.seconds = addLeadingZero(seconds);
	harvesterDateObj.time = addLeadingZero(hour) + addLeadingZero(minutes);
	harvesterDateObj.fullDateTime = year + addLeadingZero(todayMonth + 1) + addLeadingZero(todayDayNumber) + addLeadingZero(hour) + addLeadingZero(minutes);
	harvesterDateObj.today = year + addLeadingZero(todayMonth + 1) + addLeadingZero(todayDayNumber);
	harvesterDateObj.year = year;

	//Set Object yesterday
	const yesterday = new Date();
	yesterday.setDate(todayDayNumber - 1);
	var yesterdayDayNumber = yesterday.getDate();
	var yesterdayMonth = yesterday.getMonth();
	harvesterDateObj.yesterday = yesterday.getFullYear().toString() + addLeadingZero(yesterdayMonth + 1) + addLeadingZero(yesterdayDayNumber);

	//Set Object beforeyesterday
	const beforeyesterday = new Date();
	beforeyesterday.setDate(todayDayNumber - 2);
	var beforeyesterdayDayNumber = beforeyesterday.getDate();
	var beforeyesterdayMonth = beforeyesterday.getMonth();
	harvesterDateObj.beforeyesterday = beforeyesterday.getFullYear().toString() + addLeadingZero(beforeyesterdayMonth + 1) + addLeadingZero(beforeyesterdayDayNumber);

}

//add leading zero if needed and return string
function addLeadingZero(number) {
	if (number >= 0 && number < 10) {
		numberAsString = '0' + number.toString();
	} else {
		numberAsString = number.toString();
	}

	return numberAsString;
}

function logEvent(message) {
	const today = new Date();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();

	console.log(addLeadingZero(hours) + ':' + addLeadingZero(minutes) + ':' + addLeadingZero(seconds) + ' | ' + message);
}

function harvester_getLastNews(crawlerName) {

	logEvent('HARVESTER START');

	$.ajax({
		beforeSend: function(){
			logEvent('REQUESTING last news');
		  },
		url: serevrUrl + '/core/getLastNews.php',
		method: 'get',
		dataType: 'text',
		data: {crawler: crawlerName},
		success: function(data){
			logEvent('RECIEVED ' + data);
		}
	}).done(function(data) {
		if (crawlerName == 'aljazeera') { crawlAljazeera(data); }
		else if (crawlerName == 'interfax') { crawlInterfax(data); }
		else if (crawlerName == 'nytimes') { crawlNytimes(data); }
	});
}

function harvester_sendData(newsArray) {

	$.ajax({
		beforeSend: function(){
			logEvent('SENDING DATA');
		  },
		url: serevrUrl + '/core/receiveData.php',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(newsArray),
		complete: function(data){
			logEvent('DATA SEND');
			logEvent('STATUS ' + data.statusText);
			logEvent('RESPONCE ' + data.responseText);
			console.log(data);
		}
	});

}