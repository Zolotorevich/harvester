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
	$('.block-article-content-wrapper').each(function() {
		//get news link
		var newsLink = $(this).find('h3 a').attr('href');

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://xakep.ru' + newsLink;
		}

		//check if it's last news
		if (newsLink == lastNewsFullUrl) {
			lastNewsFound = true;

			//break the loop
			return false;
		}

		//get news title
		var newsTitle = $(this).find('h3 span').text();

		//get news preview
		var preview = $(this).find('p').text();

		//save to array
		newsArray.push({
			'date':convertUrlToDate(newsLink),
			'title':newsTitle,
			'link':newsLink,
			'preview':preview
		});

	});

	//get page number
	var url = window.location.href;

	if (url.includes('/page/')) {
		pageNumber = url.slice(-2,-1);
		newLocation = url.slice(0,36) + (parseInt(pageNumber) + 1) + '/';
	} else {
		pageNumber = 1;
		newLocation = url + 'page/2/';
	}

	//found last news or it's last page
	if (lastNewsFound || pageNumber >= 3) {
		//send data
		harvester_sendData(newsArray);
	} else {
		//send data and go to next page
		harvester_sendData(newsArray,newLocation);

	}

	//convert 'https://xakep.ru/2023/02/14/' -> '20230214' + current time
	function convertUrlToDate(date) {
		return date.slice(17,21) + date.slice(22,24) + date.slice(25,27) + harvesterDateObj.time;
	}

}