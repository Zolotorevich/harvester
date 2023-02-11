//Objects for storing dates
const dateObj = new Object();
const dateObjMeta = new Object();

//init data objects
var newsData;
var viewedNews = [];

$(document).ready(function(){

	//create dateObj
	createDateObject();

	//load home news
	loadNews('home');

});

function loadNews(issue) {

	//generate startDate
	if (dateObj.weekends) {
		startDate = dateObj.lastFriday + '1600';
		// startDate = '202302121600';
	} else {
		startDate = dateObj.yesterday + '1600';
	}
	
	$.ajax({
		url: '/core/getNews.php',
		method: 'get',
		dataType: 'json',
		data: {issue: issue, startDate: startDate},
		success: function(data){
			newsData = data;
		}
	}).done(function() {
		displayNews();
	});

}

function displayNews() {
	console.log(newsData);

	//Clear view
	$('#harvesterContainer').html();

	//total news
	dateObjMeta.total = newsData.length;

	//display data
	if (dateObjMeta.total > 0) {
		
		//sort by time
		sortJSON(newsData,'date', 'dsc');

		//update meta values
		dateObjMeta.lastUpdate = fullDateToTime(newsData[0].date);
		dateObjMeta.viewedNews = newsData.filter(item => item.viewed == 1).length;

		//display news
		$.each(newsData, function(i) {

			html = '<a href="' + newsData[i].link + '" target="_blank">';

			html += '<div class="newsContainer';

			//check if news viewed
			if (newsData[i].viewed == 1) {
				html += ' newsViewed';
			}

			html += '">';

			html += '<div class="sourceIcon"><img src="/style/sourceIcons/tass.png"></div>';

			html += '<div class="newsTime">' + fullDateToTime(newsData[i].date) + '</div>';
			
			html += '<div class="newsTitle">' + newsData[i].title + '</div></div></a>';

			$('#harvesterContainer').append(html);
		});

		//update main display
		updateDisplay();

	} else {
		//display no data message
		$('#harvesterContainer').append('<div id="noData">NO DATA</div>');

		//update main display
		mainDisplay('status','noData');
	}

	//add end line
	$('#harvesterContainer').append('<div id="leditorEndLine"></div>');

}


function updateDisplay() {
	//change display values
	mainDisplay('unreadCounter',(dateObjMeta.total - dateObjMeta.viewedNews));
	mainDisplay('timeOfUpdate',dateObjMeta.lastUpdate);
	mainDisplay('allNewsCounter',dateObjMeta.total);
}