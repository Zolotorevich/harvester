function crawlRegister(lastNews) {
	logEvent('CRAWLING Register');

	newsArray = [];

	//create results array
	$('article').each(function() {
		//check if it's 'popular'
		if (!$(this).parent().hasClass('horiz_scroll')) {
			//get news link
			var newsLink = $(this).find('a').attr('href');

			//check if link releative
			if (!newsLink.includes('https://')) {
				//add domain name
				newsLink = 'https://www.theregister.com' + newsLink;
			}

			//get news title
			var newsTitle = $(this).find('h4').text();

			//get news preview
			var newsPreview = $(this).find('div.standfirst').text();

			//check if news month ago
			if ($(this).find('span.time_stamp').text().includes('month') || $(this).find('span.time_stamp').text().includes('months')) {
				var newsDate = harvesterDateObj.fullDateTime;
			} else {
				//get date
				var newsDate = convertRegisterTime($(this).find('span.time_stamp').attr('title'));
			}

			//save to array
			newsArray.push({
				'date':newsDate,
				'title':newsTitle.trim(),
				'link':newsLink,
				'preview':newsPreview.trim()
			});
			
		}

	});

	//send data
	harvester_sendData(newsArray);

	function convertRegisterTime(date) {
		//check if no date or months ago
		if (typeof date === 'undefined') {
			return harvesterDateObj.fullDateTime;
		}

		//generate date with timezone
		newDate = new Date(harvesterDateObj.year + ' ' + date + ' 0Z');

		return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
	}


}