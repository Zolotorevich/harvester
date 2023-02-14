function crawlNytimes(lastNews) {
	logEvent('CRAWLING New Yourk Times');

	var delay = 5000; //in ms
	var attempts = 15;
	var i = 0;
	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(23);

	function findNews() {
		setTimeout(function() {

			if ($(`#stream-panel a[href*="${lastNewsShortUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('#stream-panel h2').each(function() {
					//get news link
					var newsLink = $(this).parent().attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.nytimes.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).text();

					//get news preview
					var preview = $(this).next().html();

					//get news time
					var newsDate = harvesterDateObj.fullDateTime;

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink,
						'preview':preview
					});

					//check if it's last news
					if (newsLink == lastNewsFullUrl) {
						//break the loop
						return false;
					}

				});

				//add featured news to array
				$('#collection-highlights-container article h2 a').each(function() {
					//get news link
					var newsLink = $(this).attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.nytimes.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).text();

					//get news preview
					var preview = $(this).parent().nextAll('p').first().html();

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

				//scroll to bottom
				$("html, body").animate({ scrollTop: ($(document).height() - 300) }, 2000);

				//scroll to top
				$("html, body").animate({ scrollTop: 0 }, 2000);
				
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