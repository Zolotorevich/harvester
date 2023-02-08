//Object for storing dates
const dateObj = new Object();

//init data objects
var newsData;
var viewedNews = [];

$(document).ready(function(){

	//create dateObj
	createDateObject();

	//load home news
	loadHomeNews();

});

function loadHomeNews() {

	//if it's friday evening, weekends or monday morning -> get news from last friday
	if (dateObj.weekends) {
		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'home', startDate: dateObj.lastFriday + '1600'},
			success: function(data){
				newsData = data;
			}
		}).done(function() {
			displayHomeNews();
		});
	} else {
		$.ajax({
			url: '/core/getNews.php',
			method: 'get',
			dataType: 'json',
			data: {issue: 'home', startDate: dateObj.yesterday + '1600'},
			success: function(data){
				newsData = data;
			}
		}).done(function() {
			displayHomeNews();
		});
	}
}

function displayHomeNews() {
	console.log(newsData);

	//Clear view
	//clearView();

	//
	if (newsData.length > 0) {
		//sort by time
		sortJSON(newsData,'date', 'dsc');

		

		//display news
		$.each(newsData, function(i) {

			html = '<a href="' + newsData[i].link + '" target="_blank">';
			html += '<div class="newsContainer"><div class="newsTime">' + fullDateToTime(newsData[i].date) + '</div>';
			html += '<div class="newsTitle">' + newsData[i].title + '</div></div></a>';

			$('#harvesterContainer').append(html);
		});

		$('#harvesterContainer').append('<div id="leditorEndLine"></div>');

		
	}
		
}

function addNewsToList(id,date,litle,link,viewed) {

}