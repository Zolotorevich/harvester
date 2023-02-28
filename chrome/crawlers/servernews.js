function crawlServernews(lastNews) {
	logEvent('CRAWLING servernews');
	newsArray = [];

	//last news detected
	lastNewsFound = false;

	//create results array
	$('table.maintable-internal div.content').each(function() {
		//get news link
		var newsLink = $(this).find('h1').parent().attr('href');

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://www.servernews.ru' + newsLink;
		}

		//check if it's last news
		if (newsLink == lastNews[0].lastLink) {
			lastNewsFound = true;

			//break the loop
			return false;
		}

		//get news title
		var newsTitle = $(this).find('h1').text();

		//get news preview
		var preview = $(this).find('p').first().text();

		//get news time
		var newsDate = $(this).find('span.date').text();

		//save to array
		newsArray.push({
			'date':convertServernewsTime(newsDate),
			'title':newsTitle.trim(),
			'link':newsLink,
			'preview':preview
		});

	});

	//get page number
	var url = window.location.href;

	if (url.includes('page-')) {
		pageNumber = url.slice(36,37);
		newLocation = 'https://www.servernews.ru/news/page-' + (parseInt(pageNumber) + 1) + '.html';

	} else {
		pageNumber = 1;
		newLocation = 'https://www.servernews.ru/news/page-2.html';
	}

	//found last news or it's last page
	if (lastNewsFound || pageNumber >= 3) {
		//send data
		harvester_sendData(newsArray);
	} else {
		//send data and go to next page
		harvester_sendData(newsArray,newLocation);
	}

	function convertServernewsTime(date) {
		return date.slice(6,10) + date.slice(3,5) + date.slice(0,2) + date.slice(12,14) + date.slice(15,17);
	}
}