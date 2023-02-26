function crawlKommersant_it(lastNews) {
	logEvent('CRAWLING Kommersant hitech');

	var delay = 5000; //in ms
	var attempts = 10;
	var i = 0;
	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(lastNewsFullUrl.indexOf('.ru') + 3);

	function findNews() {
		setTimeout(function() {

			if ($(`article a[href*="${lastNewsShortUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('article').each(function() {
					//get news link
					var newsLink = $(this).find('h2 a').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.kommersant.ru' + newsLink;
					}

					//check if it's last news
					if (newsLink == lastNewsFullUrl) {
						//break the loop
						return false;
					}

					//get news title
					var newsTitle = $(this).find('h2 a').text();

					//get news time
					var newsDate = $(this).find('p.hide_desktop').text();

					//save to array
					newsArray.push({
						'date':convertRusTime(newsDate),
						'title':newsTitle,
						'link':newsLink,
						'preview':''
					});

				});

				console.log(newsArray);

				//send data
				harvester_sendData(newsArray);
				
			} else {

				//Last news not found
				logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

				//find load more button
				loadButton = $('button:contains("Показать еще")');

				//scroll to bottom
				$("html, body").animate({ scrollTop: $(document).height() }, 500);

				//press more news button if exist
				if (loadButton.length > 0) {
					loadButton.click();
				}
				
				//next loop
				i++;
				if (i < attempts) {
					findNews();
				}
			}

		}, delay)
	}

	//launch crawler
	findNews();

}