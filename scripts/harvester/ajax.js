function loadNews() {

	//generate startDate
	if (dateObj.weekends) {
		//startDate = dateObj.lastFriday + '1500';
		//startDate = '202302121600';

		startDate = new Date();

		let today = new Date();
		let todayDayNumber = today.getDate();
		let todayDayOfWeek = today.getDay();

		startDate.setDate(todayDayNumber + (6 - todayDayOfWeek - 1) - (todayDayOfWeek == 6 ? 0 : 7));
		startDate.setHours(0, 0);

	} else {

		startDate = new Date();
		today = new Date();
		todayDayNumber = today.getDate();

		startDate.setDate(todayDayNumber - 1);
		startDate.setHours(0, 0);

	}

	var timestamp = '@' + Math.round(startDate.getTime()/1000);
	
	$.ajax({
		url: '/core/getNews.php',
		method: 'get',
		dataType: 'json',
		data: {issue: dateObjMeta.issue, startDate: timestamp},
		success: function(data){
			// console.log(data);
			newsData = data;
		}
	}).done(function() {
		// console.log(newsData);
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