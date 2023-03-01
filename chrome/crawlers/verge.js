function crawlVerge(lastNews) {
	logEvent('CRAWLING Verge');

	newsArray = [];

	$('div[class*="duet--content-cards"]').each(function() {

		var newsTitle = $(this).find('h2').text();

		if (newsTitle == '') {
			newsTitle = $(this).find('div.inline').text();
			
			//get news preview
			preview = $(this).find('p[class*="duet--article"]').text();

			//get link
			var newsLink = $(this).find('a').first().attr('href');

		} else {
			//get news preview
			var preview = '';

			//get link
			var newsLink = $(this).find('a.block').first().attr('href');
		}

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://theverge.com' + newsLink;
		}


		if (newsTitle != 'Advertiser Content') {

			//save to array
			newsArray.push({
				'date':harvesterDateObj.fullDateTime,
				'title':newsTitle,
				'link':newsLink,
				'preview':preview
			});
			
		}

		
	});

	//send data
	harvester_sendData(newsArray);

}