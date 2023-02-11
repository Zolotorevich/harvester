//Object for storing dates
const dateObj = new Object();

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

	//display data
	if (newsData.length > 0) {
		
		//sort by time
		sortJSON(newsData,'date', 'dsc');

		//display news
		$.each(newsData, function(i) {

			html = '<a href="' + newsData[i].link + '" target="_blank">';

			html += '<div class="newsContainer';

			//check if news viewed
			if (newsData[i].viewed == 1) {
				html += ' newsViewed';
			}

			html += '">';

			html += '<div class="newsTime">' + fullDateToTime(newsData[i].date) + '</div>';
			
			html += '<div class="newsTitle">' + newsData[i].title + '</div></div></a>';

			$('#harvesterContainer').append(html);
		});

		//add end line
		$('#harvesterContainer').append('<div id="leditorEndLine"></div>');

	}

	//change display values
	totalNews = newsData.length;
	viewedNews = newsData.filter(item => item.viewed == 1).length;
	lastUpdate = fullDateToTime(newsData[0].date);

	mainDisplay('unreadCounter',(totalNews - viewedNews));
	mainDisplay('timeOfUpdate',lastUpdate);
	mainDisplay('allNewsCounter',totalNews);

}