function crawlBloomberg(lastNews) {
	logEvent('CRAWLING Bloomberg');

	//scroll to bottom for load news
	$("html, body").animate({ scrollTop: $(document).height() }, 0);

	var delay = 5000;
	var attempts = 40;
	var i = 0;
	newsArray = [];

	//last news date
	lastNewsDate = lastNews[0].lastDate;

	function findNews() {
		setTimeout(function() {

			//get date of last news in list
			var lastNewsInListDate = convertForeignTime($('time[class*="RelativeDate_relativeDate"]').last().attr('datetime'));

			if (lastNewsDate > lastNewsInListDate) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//save headlines
				$('section[data-zoneid="Hero"] article').each(function() {

					console.log('data-zoneid="Hero"');
								
					//get news title
					var newsTitle = $(this).find('a').first().text();

					//get news link
					var newsLink = $(this).find('a').first().attr('href');

					//check for ad
					if (typeof newsLink !== 'undefined' && !newsLink.includes('events.bloomberglive.com')) {
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
				$('section[class*="zone_content"] article').each(function() {

					//get news link
					var newsLink = $(this).find('a').first().attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.bloomberg.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('a').first().text();

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