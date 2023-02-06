function crawlAljazeera(lastNewsUrl) {
	logEvent('CRAWLING AlJazeera');

	newsArray = [];
	var i = 0;

	//Delete domain name
	lastNewsUrl = lastNewsUrl.slice(25);

	function findNews() {
		setTimeout(function() {

			if ($(`article a[href*="${lastNewsUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('article h3').each(function() {
					//get news link
					var newsLink = $(this).find('a').attr('href');

					//check if it's last news
					if (newsLink == lastNewsUrl) {
						//break the loop
						return false;
					}

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.aljazeera.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('span').text();

					//get news time
					var newsDate = harvesterDateObj.fullDateTime;

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink
					});

				});

				console.log(newsArray);

				//send data
				if (newsArray.length > 0) {
					harvester_sendData(newsArray);
				} else {
					logEvent('NOTHING TO SEND no new news');
				}
				
			} else {

				//Last news not found
				logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

				//press more news button if exist
				if ($('.show-more-button').length > 0) {
					$('.show-more-button').click();
				}
				
				//next loop
				i++;
				if (i < 10) {
					findNews();
				}
			}

		}, 3000)
	}

	//launch crawler
	findNews();

}