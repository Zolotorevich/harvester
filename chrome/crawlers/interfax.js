function crawlInterfax(lastNewsUrl) {
	logEvent('CRAWLING Interfax');

	var delay = 5000; //in ms
	var attempts = 10;
	var i = 0;
	newsArray = [];
	
	//save original last news link
	originallastNewsUrl = lastNewsUrl;

	//Delete domain name
	lastNewsUrl = lastNewsUrl.slice(lastNewsUrl.indexOf('.ru') + 3);

	function findNews() {
		setTimeout(function() {

			if ($(`.timeline a[href*="${lastNewsUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('.timeline h3').each(function() {
					//get news link
					var newsLink = $(this).parent().attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.interfax.ru' + newsLink;
					}

					//check if it's last news
					if (newsLink == originallastNewsUrl) {
						//break the loop
						return false;
					}

					//get news title
					var newsTitle = $(this).text();

					//get raw date
					var rawNewsDate = $(this).parent().parent().children('time').attr('datetime');

					//extract date
					year = rawNewsDate.slice(0,4);
					day = rawNewsDate.slice(5,7) + rawNewsDate.slice(8,10);
					time = rawNewsDate.slice(11);

					//set date
					var newsDate = year + day + time.replace(':','');

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
				if ($('div.timeline__more').length > 0) {
					$('div.timeline__more').click();
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