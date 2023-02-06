const harvesterDateObj = new Object();

$(document).ready(function(){

	create_harvesterDateObj();

	var url = window.location.href;

	if (url.includes('interfax.ru')) {harvester_getLastNews('interfax');}

	else if (url.includes('tass.ru/ekonomika')) {crawlTassEconomika();}

	else if (url.includes('aljazeera.com')) {harvester_getLastNews('aljazeera');}

});

function create_harvesterDateObj() {
	// .hours == 12
	// .minutes == 09
	// .seconds == 01
	// .time == 1209
	// .fullDateTime == 202302151209

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
		url: 'https://harvester.local/core/getLastNews.php',
		method: 'get',
		dataType: 'text',
		data: {crawler: crawlerName},
		success: function(data){
			logEvent('RECIEVED ' + data);
		}
	}).done(function(data) {
		if (crawlerName == 'aljazeera') { crawlAljazeera(data); }
	});
}

function harvester_sendData(newsArray) {

	$.ajax({
		beforeSend: function(){
			logEvent('SENDING DATA');
		  },
		url: 'https://harvester.local/core/receiveData.php',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(newsArray),
		complete: function(data){
			logEvent('DATA SEND');
			logEvent('STATUS ' + data.statusText);
			logEvent('RESPONCE ' + data.responseText);
		}
	});

}