function crawlTomshardware(lastNews) {
	logEvent('CRAWLING Tomshardware');

	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(lastNewsFullUrl.indexOf('.com') + 4);

	//last news detected
	lastNewsFound = false;

	//create results array
	$('article').each(function() {
		//get news link
		var newsLink = $(this).parent().attr('href');

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://tomshardware.com' + newsLink;
		}

		//check if it's last news
		if (newsLink == lastNewsFullUrl) {
			lastNewsFound = true;

			//break the loop
			return false;
		}

		//get news title
		var newsTitle = $(this).find('h3').text();

		//get news preview
		var preview = $(this).find('p.synopsis').text();

		//get news time
		var newsDate = $(this).find('time').attr('datetime');

		//save to array
		newsArray.push({
			'date':convertForeignTime(newsDate),
			'title':newsTitle,
			'link':newsLink,
			'preview':preview.replace('\n','')
		});

	});


	//get page number
	var url = window.location.href;

	if (url.includes('/page/')) {
		pageNumber = url.slice(-1);
		newLocation = 'https://www.tomshardware.com/news/page/' + (parseInt(pageNumber) + 1);
	} else {
		pageNumber = 1;
		newLocation = 'https://www.tomshardware.com/news/page/2';
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