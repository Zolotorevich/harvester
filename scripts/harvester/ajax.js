function loadNews() {

	//generate startDate
	if (dateObj.weekends) {
		startDate = dateObj.lastFriday + '1600';
		//startDate = '202302121600';
	} else {
		startDate = dateObj.yesterday + '1600';
	}
	
	$.ajax({
		url: '/core/getNews.php',
		method: 'get',
		dataType: 'json',
		data: {issue: dateObjMeta.issue, startDate: startDate},
		success: function(data){
			//console.log(data);
			newsData = data;
		}
	}).done(function() {
		displayNews();
	});

}

function sendViewedNews() {

	//check if any viewed news
	if (viewedNews.length > 0) {

		//prepare array
		sendingData = [dateObjMeta.issue, viewedNews];

		//clear viewed array
		viewedNews = [];

		//send data
		$.ajax({
			url: '/core/updateViewed.php',
			method: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(sendingData),
			complete: function(data){
				if (data.responseText != 'Records created') {
					//restore array
					viewedNews = viewedNews.concat(sendingData[1]);
					
					//show error
					console.log(data);
				}
			}
		});
		
	}

}