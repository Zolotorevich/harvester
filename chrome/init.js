const harvesterDateObj = new Object();
const harvesterCrawler = new Object();
let serevrUrl = 'https://harvester.local';

$(document).ready(function(){

	logEvent('HARVESTER START');

	//generate date object
	create_harvesterDateObj();

	//generate crawler object
	create_harvesterCrawlerObj();
	
	//run crawler
	harvester_getLastNews(harvesterCrawler.name);

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

function create_harvesterCrawlerObj() {
	var url = window.location.href;

	if (url.includes('interfax.ru')) {
		harvesterCrawler.name = 'interfax';
		harvesterCrawler.alias = 'interfax';
	}

	else if (url.includes('aljazeera.com')) {
		harvesterCrawler.name = 'aljazeera';
		harvesterCrawler.alias = 'aljazeera';
	}
	
	else if (url.includes('nytimes.com')) {
		harvesterCrawler.name = 'nytimes';
		harvesterCrawler.alias = 'nytimes';
	}

	else if (url.includes('theguardian.com/world/africa')) {
		harvesterCrawler.name = 'guardian_africa';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/world/americas')) {
		harvesterCrawler.name = 'guardian_americas';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/world/asia-pacific')) {
		harvesterCrawler.name = 'guardian_asia_pacific';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/world/south-and-central-asia')) {
		harvesterCrawler.name = 'guardian_asia_center';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/world/middleeast')) {
		harvesterCrawler.name = 'guardian_middleeast';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/politics')) {
		harvesterCrawler.name = 'guardian_uk';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('www.theguardian.com/us-news/us-politics')) {
		harvesterCrawler.name = 'guardian_us';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/australia-news')) {
		harvesterCrawler.name = 'guardian_australia';
		harvesterCrawler.alias = 'guardian';
	}

	else if (url.includes('theguardian.com/world/europe-news')) {
		harvesterCrawler.name = 'guardian_europe';
		harvesterCrawler.alias = 'guardian';
	}


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

		lastNews = JSON.parse(data);

		if (harvesterCrawler.alias == 'aljazeera') { crawlAljazeera(lastNews); }
		else if (harvesterCrawler.alias == 'interfax') { crawlInterfax(lastNews); }
		else if (harvesterCrawler.alias == 'nytimes') { crawlNytimes(lastNews); }
		else if (harvesterCrawler.alias == 'guardian') { crawlGuardian(lastNews); }
	});
}

function harvester_sendData(newsArray, redirect = '') {

	var finalArray = [{carwler:harvesterCrawler.name}, newsArray];

	console.log(finalArray);

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

			if (redirect != '') {
				location.href = redirect;
			}
		}
	});

}

//convert '2023-01-14T16:26:50-05:00' -> '202301141626' (MSK)
function convertForeignTime(date) {
	var moscowDate = new Date(date);
	var newDate = moscowDate.toLocaleString('ru-RU', {timeZone: "Europe/Moscow"});

	newDate = newDate.slice(6,10) + newDate.slice(3,5) + newDate.slice(0,2) + newDate.slice(12,14) + newDate.slice(15,17);

	return newDate;
}