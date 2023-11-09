// const harvesterDateObj = new Object();
// let serevrUrl = 'https://harvester.local';
// var currentCrawler;

$(document).ready(function(){

	//check if it's Bloomberg
	if (window.location.href == 'https://www.bloomberg.com/technology') {
		logEvent('HARVESTER START');

		//launch crawler
		crawlBloomberg_solo();
	}

});

// $(document).ready(function(){

// 	logEvent('HARVESTER START');

// 	//generate date object
// 	create_harvesterDateObj();

// 	//find crawler
// 	var url = window.location.href;
// 	currentCrawler = crawlersList.findIndex(x => url.match(x.url));

// 	//launch crawler if found
// 	if (currentCrawler >= 0) {
// 		harvester_getLastNews();
// 	} else {
// 		logEvent('NO CRAWLER for this page');
// 	}

// });

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

function harvester_getLastNews() {

	//request last news for crawler
	$.ajax({
		beforeSend: function(){
			logEvent('REQUESTING last news');
		  },
		url: serevrUrl + '/core/getLastNews.php',
		method: 'get',
		dataType: 'text',
		data: {crawler: crawlersList[currentCrawler].name},
		success: function(data){
			logEvent('RECIEVED ' + data);
		}
	}).done(function(data) {
		//run crawler
		crawlersList[currentCrawler].crawlerFunction(JSON.parse(data));
	});
}

function harvester_sendData(newsArray, redirect = '') {

	//check if any new news
	if (newsArray.length == 0) {
		crawlerFinish(newsArray.length);
		logEvent('NOTHING TO SEND no new news');
		return false;
	}

	var finalArray = [{carwler:crawlersList[currentCrawler].name}, newsArray];

	$.ajax({
		beforeSend: function(){
			logEvent('SENDING DATA');
			console.log(finalArray);
		  },
		url: serevrUrl + '/core/receiveData.php',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(finalArray),
		complete: function(data){
			logEvent('DATA SEND');
			logEvent('STATUS ' + data.statusText);
			logEvent('RESPONCE ' + data.responseText);
			console.log(data);

			if (data.responseText == 'Records created') {
				crawlerFinish(newsArray.length);
			} else {
				crawlerFinish(newsArray.length, 'fail');
			}

			if (redirect != '') {
				location.href = redirect;
			}

		}
	});

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

function crawlerFinish(message, type = 'normal') {

	//messgae bakc color
	if (type == 'normal') {
		backcolor = '#10b11b';
	} else {
		backcolor = '#cd2424';
	}

	//create message div
	html = '<div style="position:fixed; top:20px; left:20px; z-index:99999999; width:300px; height:150px; background-color:' + backcolor + '; font-size:80px; text-align:center;">' + message + '</div>'

	$('body').append(html);
	
}

//convert '2023-01-14T16:26:50-05:00' -> '202301141626' (MSK)
function convertForeignTime(date) {
	var moscowDate = new Date(date);
	var newDate = moscowDate.toLocaleString('ru-RU', {timeZone: "Europe/Moscow"});

	newDate = newDate.slice(6,10) + newDate.slice(3,5) + newDate.slice(0,2) + newDate.slice(12,14) + newDate.slice(15,17);

	return newDate;
}

//convert '2023-01-14T16:26:50Z' -> '2023-01-14T16:26:50' (MSK)
function convertForeignTime_bloomberg(date) {
	var moscowDate = new Date(date).toLocaleString('ru-RU', {timeZone: "Europe/Moscow"});

	// console.log('moscowDate = ' + moscowDate);

	// hours = moscowDate.slice(12,14);

	// console.log('hours = ' + hours);

	// if (parseInt(hours) < 10) {
	// 	hours = '0' + hours;
	// }

	result = moscowDate.slice(6,10) + '-' + moscowDate.slice(3,5) + '-' + moscowDate.slice(0,2) + ' ' + moscowDate.slice(12,14) + ':' + moscowDate.slice(15,17) + ':00';

	// console.log(result);


	return result;
}

//convert '26.02.2023 19:58' || '26.02.2023, 15:44' -> '202302261958'
function convertRusTime(date) {
	//trim data
	date = date.trim();

	return date.slice(6,10) + date.slice(3,5) + date.slice(0,2) + date.slice(-5,-3) + date.slice(-2);
}

//convert '1677655806' -> '202303010730'
function convertEpochTime(date) {
	newDate = new Date(parseInt(date));
	return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
}

