function crawlVice(lastNews) {
	logEvent('CRAWLING Vice');

	var delay = 5000;
	var attempts = 10;
	var i = 0;
	newsArray = [];

	//scroll to load news
	$("html, body").animate({ scrollTop: $(document).height() }, 0);

	function findNews() {
		setTimeout(function() {

			//get date of last news in list
			var lastNewsInListDate = convertViceTime($('.feed time').last().attr('datetime'));

			if (lastNews[0].lastDate > lastNewsInListDate) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');
				
				//create results array
				$('.feed li').each(function() {
					//get news link
					var newsLink = $(this).find('h3 a').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.vice.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('h3 a').text();

					//get news preview
					var newsPreview = $(this).find('p').text();

					//get news date
					var newsDate = convertViceTime($(this).find('time').attr('datetime'));

					//save to array
					newsArray.push({
						'date':newsDate,
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
				loadButton = $('button:contains("LOAD MORE")');

				//press more news button if exist
				if (loadButton.length > 0) {
					loadButton.click();
				}

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

	function convertViceTime(date) {
		newDate = new Date(parseInt(date));
		return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
	}

}