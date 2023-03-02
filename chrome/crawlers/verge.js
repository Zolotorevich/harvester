function crawlVerge(lastNews) {
	logEvent('CRAWLING Verge');

	newsArray = [];

	$('div.duet--content-cards--content-card').each(function() {

		if ($(this).find('h2').length < 1) {
			newsTitle = $(this).find('div.inline').text();
			console.log('inline = ' + $(this).find('div.inline').length);
			
			//get news preview
			preview = $(this).find('p[class*="duet--article"]').text();

			//get link
			var newsLink = $(this).find('a').first().attr('href');

		} else {
			var newsTitle = $(this).find('h2').text();
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