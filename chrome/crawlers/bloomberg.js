function crawlBloomberg(lastNews) {
	logEvent('CRAWLING Bloomberg');

	//scroll to bottom for load news
	$("html, body").animate({ scrollTop: $(document).height() }, 0);

	var delay = 5000;
	var attempts = 10;
	var i = 0;
	newsArray = [];

	//last news date
	lastNewsDate = lastNews[0].lastDate;

	function findNews() {
		setTimeout(function() {

			//get date of last news in list
			var lastNewsInListDate = convertForeignTime($('.hub-lazy-zones time').last().attr('datetime'));

			if (lastNewsDate > lastNewsInListDate) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//save headlines
				$('section[data-zoneid="Hero"] article').each(function() {
								
					//try to get title and link from main hero
					if ($(this).find('a.single-story-module__headline-link').length > 0) {
						//get news title
						var newsTitle = $(this).find('a.single-story-module__headline-link').text();

						//get news link
						var newsLink = $(this).find('a.single-story-module__headline-link').attr('href');
					} else {
						//get news title
						var newsTitle = $(this).find('a.story-package-module__story__headline-link').text();

						//get news link
						var newsLink = $(this).find('a.story-package-module__story__headline-link').attr('href');
					}

					//check for ad
					if (typeof newsLink !== 'undefined') {
						//check if link releative
						if (!newsLink.includes('https://')) {
							//add domain name
							newsLink = 'https://www.bloomberg.com' + newsLink;
						}

						//get news date
						var newsDate = convertForeignTime($(this).find('time').attr('datetime'));

						//save to array
						newsArray.push({
							'date':newsDate,
							'title':newsTitle.trim(),
							'link':newsLink,
							'preview':''
						});
					}
				
				});
				
				//create results array
				$('.hub-lazy-zones article').each(function() {
					//get news link
					var newsLink = $(this).find('a.story-list-story__info__headline-link').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.bloomberg.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('a.story-list-story__info__headline-link').text();

					//get news date
					var newsDate = convertForeignTime($(this).find('time').attr('datetime'));

					//save to array
					newsArray.push({
						'date':newsDate,
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

				//find load more button
				loadButton = $('button:contains("Load More Stories")');

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
}