function crawlReuters(lastNews) {
	logEvent('CRAWLING Reuters');

	var delay = 2000;
	var attempts = 35;
	var i = 0;
	newsArray = [];

	//get date of last news
	lastNewsDate = lastNews[0].lastDate;
	
	function findNews() {
		setTimeout(function() {

			//check if last news found
			lastNewsFound = lastNewsDate > convertReutersDate($('li[class*="stories-feed"]').last().find('a span').html());

			if (lastNewsFound) {
				//create results array
				$('li[class*="stories-feed"]').each(function() {
					//get news link
					var newsLink = $(this).find('a').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.reuters.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('a h5').html();

					//get news preview
					var newsPreview = $(this).find('a p').html();

					//get date
					var rawNewsDate = $(this).find('a span').html();

					//convert date
					newsDate = convertReutersDate(rawNewsDate);

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink,
						'preview':newsPreview
					});

				});

				//send data
				harvester_sendData(newsArray);
				return true;

			}
			
			//Last news not found
			logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

			//find load more button
			loadButton = $('button:contains("Show more articles")');

			//press more news button if exist
			if (loadButton.length > 0) {
				loadButton.click();
			}
			
			//next loop
			i++;
			if (i < attempts) {
				findNews();
			}

		}, delay)
	}

	//launch crawler
	findNews();

}

function crawlReutersSection(lastNews) {
	logEvent('CRAWLING Reuters Section');

	var delay = 2000;
	var attempts = 35;
	var i = 0;
	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(lastNewsFullUrl.indexOf('.com') + 4);

	//last news detected
	lastNewsFound = false;
	
	function findNews() {
		setTimeout(function() {

			//check if last news found
			if ($(`a[href*="${lastNewsShortUrl}"]`).length > 0) {
				//parse hero
				var hero = $('li[class*="story-collection__hero"]');
				var heroLink = hero.find('a[data-testid="Heading"]').attr('href');

				//check if link releative
				if (!heroLink.includes('https://')) {
					//add domain name
					heroLink = 'https://www.reuters.com' + heroLink;
				}

				var heroTitle = hero.find('a[data-testid="Heading"] span').first().text();
				var heroPreview = hero.find('p[data-testid="Body"]').text();

				newsArray.push({
					'date':harvesterDateObj.fullDateTime,
					'title':heroTitle,
					'link':heroLink,
					'preview':heroPreview
				});

				//parse news with images
				$('div[data-testid="MediaStoryCard"]:not(div[class*="media-story-card__hero"])').each(function() {
					//get news link
					var newsLink = $(this).find('a[data-testid="Heading"]').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.reuters.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('a[data-testid="Heading"] span').first().text();

					//convert date
					newsDate = convertForeignTime($(this).find('time').attr('datetime'));

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink,
						'preview':''
					});

				});

				//parse news with preview
				$('div[data-testid="TextStoryCard"]:not(div[class*="text-story-card__hero"])').each(function() {
					//get news link
					var newsLink = $(this).find('a[data-testid="Heading"]').attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.reuters.com' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('a[data-testid="Heading"]').text();

					//get preview
					newsPreview = $(this).find('p[data-testid="Body"]').text();

					//convert date
					newsDate = convertForeignTime($(this).find('time').attr('datetime'));

					//save to array
					newsArray.push({
						'date':newsDate,
						'title':newsTitle,
						'link':newsLink,
						'preview':newsPreview
					});

				});

				//send data
				harvester_sendData(newsArray);
				return true;

			}
			
			//Last news not found
			logEvent('SEARCHING attempt №' + (i + 1) + ' NOT FOUND');

			//find load more button
			loadButton = $('button:contains("Load more articles")');

			//press more news button if exist
			if (loadButton.length > 0) {
				loadButton.click();
			}
			
			//next loop
			i++;
			if (i < attempts) {
				findNews();
			}

		}, delay)
	}

	//launch crawler
	findNews();

}


function convertReutersDate(rawDate) {

	//extract date
	rawDate = rawDate.slice(rawDate.indexOf('·') + 2);

	//News updated
	if (rawDate.includes('Updated')) {

		//minutes ago
		if (rawDate.includes('min ago')) {

			//get number of minutes
			numOfMinutes = parseInt(rawDate.match(/\d+/));

			//check for 1 min ago
			if (isNaN(numOfMinutes)) {
				numOfMinutes = 1;
			}
	
			//Set Date Object
			const newDate = new Date();
			newDate.setMinutes(harvesterDateObj.minutes - numOfMinutes);
	
			return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
		}

		//1 hour ago
		if (rawDate.includes('hour ago')) {
			//Set Date Object
			const newDate = new Date();
			newDate.setHours(harvesterDateObj.hours - 1);
	
			return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
		}

		//hours ago
		if (rawDate.includes('hours ago')) {
			//get number of hours
			numOfHours = parseInt(rawDate.match(/\d+/));
	
			//Set Date Object
			const newDate = new Date();
			newDate.setHours(harvesterDateObj.hours - numOfHours);
	
			return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
		}

		//can't found minutes or hours
		return harvesterDateObj.fullDateTime;
		
	}

	//GMT
	if (rawDate.includes('GMT+3')) {

		//get hours
		newHours = rawDate.match(/\d+/);

		//check for PM
		if (rawDate.includes('PM GMT+3') && newHours != '12') {
			newHours = parseInt(newHours) + 12;
		}

		//check for 12 AM
		if (rawDate.includes('AM GMT+3') && newHours == '12') {
			newHours = 0;
		}

		//get minutes
		newMinutes = (rawDate.match(/:\d+/));
		
		return harvesterDateObj.today + addLeadingZero(newHours) + newMinutes[0].slice(1);
	}

	//Year
	if (rawDate.includes(', ' + harvesterDateObj.year)) {
		//TODO check for previous year

		//remove year
		rawDate = rawDate.slice(0, -6);

		//get day
		newDay = rawDate.match(/\d+/)[0];

		//get month name
		monthName = rawDate.slice(0, rawDate.indexOf(' '));

		//get month number
		monthsArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		newMonth = monthsArray.indexOf(monthName) + 1;

		return harvesterDateObj.year + addLeadingZero(newMonth) + addLeadingZero(newDay) + '2359';
	}


	return harvesterDateObj.fullDateTime;
	

  }