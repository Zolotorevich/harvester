function bloomberg_solo_send(newsArray) {
	var finalArray = ['bloomberg', newsArray];

	$.ajax({
		beforeSend: function(){
			logEvent('SENDING DATA');
			console.log(finalArray);
		  },
		url: 'https://harvester.local/core/receiveData_bloomberg.php',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(finalArray),
		complete: function(data){
			logEvent('DATA SEND');
			logEvent('STATUS ' + data.statusText);
			logEvent('RESPONCE ' + data.responseText);
			console.log(data);

			if (data.responseText == 'Records created') {
				crawlerFinish(newsArray.length);
			} else {
				crawlerFinish(newsArray.length, 'fail');
			}

		}
	});
}

function crawlBloomberg_solo() {
	logEvent('CRAWLING Bloomberg');

	//scroll to bottom for load news
	$("html, body").animate({ scrollTop: $(document).height() }, 0);

	var delay = 2000;
	newsArray = [];

	function findNews() {
		setTimeout(function() {

			//save headlines
			$('section[data-zoneid="Hero"] article').each(function() {
		
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
					var newsDate = convertForeignTime_bloomberg($(this).find('time').attr('datetime'));

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
				var newsDate = convertForeignTime_bloomberg($(this).find('time').attr('datetime'));

				//save to array
				newsArray.push({
					'date':newsDate,
					'title':newsTitle.trim(),
					'link':newsLink,
					'preview':''
				});

			});

			//send data
			bloomberg_solo_send(newsArray);

		}, delay)
	}

	//launch crawler
	findNews();
}


