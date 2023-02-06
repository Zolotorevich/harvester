function crawlInterfax(lastNewsUrl) {
	logEvent('CRAWLING Interfax');

	newsArray = [];

	//search for last news
	for (let i = 0; i < 5; i++) {

		//check if last news loaded
		if ($(`.timeline a[href*="${lastNewsUrl}"]`).length > 0) {

			logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

			//create results array
			$('.timeline h3').each(function() {

				//get news time
				var newsTime = $(this).parent().parent().children('time').attr('datetime');

				//TODO convert news time

				//get news title
				var newsTitle = $(this).text();

				//get news link
				var newsLink = $(this).parent().attr('href');

				//check if link releative
				if (!newsLink.includes('https://')) {
					//add domain name
					newsLink = 'https://www.interfax.ru' + newsLink;
				}

				//save to array
				newsArray.push({
					'time':newsTime,
					'title':newsTitle,
					'link':newsLink
				});

			});

			//get out of loop
			i = 1000;
			
		} else {

			logEvent('SEARCHING attempt №' + (i + 1) + ' FAIL');

			//TODO press more news button
			$('div.timeline__more').click();

			//wait a second
			

		}

	}

	console.log(newsArray);


}