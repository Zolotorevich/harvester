//NOTE: Add crawler to manifest, but 'crawlersList' must be the last import
let serverURL = 'https://flintroot.ru';
// let reloadTime_min = 10 * 60 * 1000;
let devServer = true;
let doNotSend = true;


var currentCrawler;

$(document).ready(function(){

	logEvent('HARVESTER START');

	//find crawler
	var url = window.location.href;
	currentCrawler = crawlersList.findIndex(x => url.match(x.url));

	//launch crawler if found
	if (currentCrawler >= 0) {
		//run crawler
		crawlersList[currentCrawler].crawlerFunction();
	} else {
		logEvent('NO CRAWLER for this page');
	}

});

function harvester_sendData(newsArray, reloadTime_min) {

	//check if any new news
	if (newsArray.length == 0) {
		crawlerFinish(newsArray.length);
		logEvent('NOTHING TO SEND no new news');
		return false;
	}

	var finalArray = [{carwler:crawlersList[currentCrawler].name}, newsArray];

	//check for dev mode
	if (doNotSend) {
		console.log(finalArray);
		return false;
	}

	if (devServer) {
		serverURL = 'https://harvester.local';
	}

	$.ajax({
		beforeSend: function(){
			logEvent('SENDING DATA');
			console.log(finalArray);
		},
		url: serverURL + '/core/receiveData.php',
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

			//Wait and reload page
			setTimeout(() => {window.location.reload();}, reloadTime_min);
			
		}
	});
}


function logEvent(message) {
	console.log(message);
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

