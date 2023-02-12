function crawlGuardian(lastNews) {
	logEvent('CRAWLING Guardian');

	newsArray = [];

	//last news link
	lastNewsFullUrl = lastNews[0].lastLink;

	//Delete domain name
	lastNewsShortUrl = lastNewsFullUrl.slice(27);

	//last news detected
	lastNewsFound = false;

	//create results array
	$('section h3').each(function() {
		//get news link
		var newsLink = $(this).find('a').attr('href');

		//check if it's last news
		if (newsLink == lastNewsFullUrl) {
			lastNewsFound = true;

			//break the loop
			return false;
		}

		//check if link releative
		if (!newsLink.includes('https://')) {
			//add domain name
			newsLink = 'https://www.theguardian.com' + newsLink;
		}

		//get news title
		var newsTitle = $(this).find('span').find('span').text().trim();

		//get news preview
		var preview = $(this).parent().next().find('div').html();

		//if undefined, try another way
		if(preview == undefined) {
			preview = $(this).parent().next().find('p').html();

			//if still can't get text, give up
			if(preview == undefined) {
				preview = '';
			}
		}

		//check if preview have timestamp -> means there's no preview
		if (preview.includes('<time')) {
			preview = '';
		}

		//trim and remove strong tag
		preview = preview.trim();
		preview = preview.replace('<strong>','');
		preview = preview.replace('</strong>','');

		//get news time
		var newsDate = $(this).parent().parent().find('time').attr('datetime');

		//save to array
		newsArray.push({
			'date':convertForeignTime(newsDate),
			'title':newsTitle,
			'link':newsLink,
			'preview':preview
		});

	});

	console.log(newsArray);

	//check if any news news
	if (newsArray.length > 0) {

		//get page number
		var url = window.location.href;

		if (url.includes('page=')) {
			pageNumber = url.slice(-1);
			newLocation = url.slice(0,url.length-1) + (parseInt(pageNumber) + 1);

		} else {
			pageNumber = 1;
			newLocation = url + '?page=2';
		}

		//found last news or it's last page
		if (lastNewsFound || pageNumber >= 3) {
			//send data
			harvester_sendData(newsArray);
		} else {
			//send data and go to next page
			harvester_sendData(newsArray,newLocation);
		}

		//harvester_sendData(newsArray);
	} else {
		logEvent('NOTHING TO SEND no new news');
	}

	

}



