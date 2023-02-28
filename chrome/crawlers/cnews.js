function crawlCnews(lastNews) {
	logEvent('CRAWLING CNews');

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

			if ($(`.allnews_item a[href*="${lastNewsShortUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//add headliners
				$('.newstoplist_main').each(function() {
					//save to array
					newsArray.push({
						'date':harvesterDateObj.fullDateTime,
						'title':$(this).text().trim(),
						'link':$(this).attr('href'),
						'preview':''
					});
				});
				
				//create results array
				$('.allnews_item').each(function() {
					//get news link
					var newsLink = $(this).find('a').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.cnews.ru' + newsLink;
					}

					//check if it's last news
					if (newsLink == lastNewsFullUrl) {
						//break the loop
						return false;
					}

					//get news title
					var newsTitle = $(this).find('a').text();

					//get news day
					var newsDay = $(this).find('time').first().text();
					if (newsDay == '') {
						newsDate = harvesterDateObj.today;
					} else if(newsDay == 'Вчера') {
						newsDate = harvesterDateObj.yesterday;
					} else {
						newsDate = harvesterDateObj.year + newsDay.slice(-2) + newsDay.slice(0,newsDay.indexOf('.'));
					}

					//add news time
					newsDate += $(this).find('time').eq(1).text().replace(':','');

					//save to array
					newsArray.push({
						'date':newsDate,
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

				//scroll to bottom
				$("html, body").animate({ scrollTop: $(document).height() }, 500);

				//press more news link
				$('#allnews_more')[0].click();
				
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