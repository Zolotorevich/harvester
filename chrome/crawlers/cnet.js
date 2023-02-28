function crawlCnet(lastNews) {
	logEvent('CRAWLING cnet');

	var delay = 5000;
	var attempts = 10;
	var i = 0;
	newsArray = [];
	
	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(lastNewsFullUrl.indexOf('.com') + 4);

	function findNews() {
		setTimeout(function() {

			if ($(`div[section="news-2022-latest"] a[href*="${lastNewsShortUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('div[section="news-2022-latest"] h3').each(function() {
					//get news link
					var newsLink = $(this).parent().parent().attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.cnet.com' + newsLink;
					}

					//check if it's last news
					if (newsLink == lastNewsFullUrl) {
						//break the loop
						return false;
					}

					//get news title
					var newsTitle = $(this).text();

					//get preview
					newsPreview = $(this).parent().find('p').text();

					//save to array
					newsArray.push({
						'date':harvesterDateObj.fullDateTime,
						'title':newsTitle.trim(),
						'link':newsLink,
						'preview':newsPreview.trim()
					});

				});

				//send data
				harvester_sendData(newsArray);
				
			} else {

				//Last news not found
				logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

				//find load more button
				loadButton = $('button:contains("See More")');

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