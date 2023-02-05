function changeActive(id, currentActive) {

	currentActive = currentActive == 1 ? 0 : 1;

	$.ajax({
		url: '/core/toggleActive.php',
		method: 'post',
		data: {issue: 'lenovosti', newsId: id, active: currentActive},
		success: function(){
			//fing object by id
			var newsObject = newsData.filter(item => item.id == id);

			//change object values
			newsObject[0].active = currentActive;

			//redraw news
			displayNews();
		}
	});

}

function updateNews(newsID, fomrType) {
	//fing news by id
	var newsObject = newsData.filter(item => item.id == newsID);

	//find it's editform
	if (fomrType == 'shortForm') {
		//update data
		newDate = $('#newsWithTimeEditForm_date').html();
		newDate = newDate.slice(2,4) + newDate.slice(0,2);
		newsObject[0].date = '2023' + newDate + $('#newsWithTimeEditForm_time').html();
		newsObject[0].text = $('#newsWithTimeEditForm_textarea').val();
		newsObject[0].link = $('#newsWithTimeEditForm_link').html();
		
		
	} else {

		//update data
		newsObject[0].text = $('#leaderNewsEditForm_textarea').val();
		newsObject[0].link = $('#leaderNewsEditForm_link').html();

		// update groupIndex
		newsObject[0].groupIndex = $('#leaderNewsEditForm_groupIndex').html();

	}

	console.log(newsObject[0]);

	//send data
	$.ajax({
		url: '/core/updateNews.php',
		method: 'post',
		data: newsObject[0],
		success: function(){
			//redraw news
			displayNews();
		}
	});
}