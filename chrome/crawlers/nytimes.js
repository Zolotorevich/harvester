function crawlNytimes(lastNewsUrl) {
	logEvent('CRAWLING New Yourk Times');

	var delay = 5000; //in ms
	var attempts = 10;
	var i = 0;
	newsArray = [];
	
	//save original last news link
	originallastNewsUrl = lastNewsUrl;

	//Delete domain name
	lastNewsUrl = lastNewsUrl.slice(23);

	function findNews() {
		setTimeout(function() {

			if ($(`#stream-panel a[href*="${lastNewsUrl}"]`).length > 0) {

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

					//get news time
					var newsDate = harvesterDateObj.fullDateTime;

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink
					});

					//check if it's last news
					if (newsLink == originallastNewsUrl) {
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

				//scroll to bottom
				$("html, body").animate({ scrollTop: ($(document).height() - 800) }, 2000);

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