function crawlInterfax() {
	logEvent('CRAWLING Interfax');

	newsArray = [];

	//create results array
	$('.timeline h3').each(function() {
		//get news link
		var newsLink = $(this).parent().attr('href');

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://www.interfax.ru' + newsLink;
		}

		//get news title
		var newsTitle = $(this).text();

		//save to array
		newsArray.push({
			'title':newsTitle,
			'link':newsLink,
			'preview':''
		});

	});

	//send data
	harvester_sendData(newsArray);

}