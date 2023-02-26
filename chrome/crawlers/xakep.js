function crawlXakep(lastNews) {
	logEvent('CRAWLING Xakep');

	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(lastNewsFullUrl.indexOf('.ru') + 3);

	//last news detected
	lastNewsFound = false;

	//create results array
	$('#section-content .article-entry:not(.newsAllFeedHideItem)').each(function() {
		//get news link
		var newsLink = $(this).find('a.entry-header').attr('href');

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://3dnews.ru' + newsLink;
		}

		//check if it's last news
		if (newsLink == lastNewsFullUrl) {
			lastNewsFound = true;

			//break the loop
			return false;
		}

		//get news title
		var newsTitle = $(this).find('h1').text();

		//get news preview
		var preview = $(this).find('p').text();

		//get news time
		var newsDate = $(this).find('span.entry-date').text();

		//save to array
		newsArray.push({
			'date':convertRusTime(newsDate),
			'title':newsTitle,
			'link':newsLink,
			'preview':preview
		});

	});


	console.log(newsArray);
	return false;

	//get page number
	var url = window.location.href;

	if (url.includes('page-')) {
		pageNumber = url.slice(28,29);
		newLocation = url.slice(0,28) + (parseInt(pageNumber) + 1) + '.html';
	} else {
		pageNumber = 1;
		newLocation = url + '/page-2.html';
	}

	//found last news or it's last page
	if (lastNewsFound || pageNumber >= 3) {
		//send data
		harvester_sendData(newsArray);
	} else {
		//send data and go to next page
		harvester_sendData(newsArray,newLocation);
	}

}