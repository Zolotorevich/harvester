function crawlAljazeera(lastNews) {
	logEvent('CRAWLING AlJazeera');

	var delay = 5000; //in ms
	var attempts = 10;
	var i = 0;
	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(25);

	function findNews() {
		setTimeout(function() {

			if ($(`article a[href*="${lastNewsShortUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('article h3').each(function() {
					//get news link
					var newsLink = $(this).find('a').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.aljazeera.com' + newsLink;
					}

					//check if it's last news
					if (newsLink == lastNewsFullUrl) {
						//break the loop
						return false;
					}

					//get news title
					var newsTitle = $(this).find('span').text();

					//get news preview
					var preview = $(this).parent().next().find('p').html();

					//get news time
					var newsDate = harvesterDateObj.fullDateTime;

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink,
						'preview':preview
					});

				});

				console.log(newsArray);

				//send data
				harvester_sendData(newsArray);
				
			} else {

				//Last news not found
				logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

				//press more news button if exist
				if ($('.show-more-button').length > 0) {
					$('.show-more-button').click();
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