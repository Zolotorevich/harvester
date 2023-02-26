function crawlRbc(lastNews) {
	logEvent('CRAWLING RBC');

	var delay = 2000;
	var attempts = 50;
	var i = 0;
	newsArray = [];
	var rbcMonths = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя', 'дек'];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(lastNewsFullUrl.indexOf('.ru') + 3);

	function findNews() {
		setTimeout(function() {

			if ($(`a.item__link[href*="${lastNewsShortUrl}"]`).length > 0) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('.item__wrap').each(function() {
					//get news link
					var newsLink = $(this).find('a.item__link').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.rbc.ru' + newsLink;
					}

					//check if it's last news
					if (newsLink == lastNewsFullUrl) {
						//break the loop
						return false;
					}

					//get news title
					var newsTitle = $(this).find('span.item__title').text();

					//get news time
					var newsDate = $(this).find('span.item__category').text();

					//save to array
					newsArray.push({
						'date':convertRbcData(newsDate),
						'title':newsTitle.trim(),
						'link':newsLink,
						'preview':''
					});

				});

				//send data
				harvester_sendData(newsArray);
				
			} else {

				//Last news not found
				logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

				//scroll to bottom
				$("html, body").animate({ scrollTop: $(document).height() }, 500);
				
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

	function convertRbcData(date) {

		//check if date with month
		if (date.includes(',')) {
	
			day = date.slice(0,date.indexOf(' '));

			month = rbcMonths.findIndex(x => date.includes(x)) + 1;
			if (month < 10) { month = '0' + month;}

			time = date.slice(-5).replace(':','');

			return harvesterDateObj.year + month + day + time;
			
		} else {
			return harvesterDateObj.today + date.replace(':','');
		}
	}

}