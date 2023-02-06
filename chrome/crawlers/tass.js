function crawlTass() {
	logEvent('CRAWLING TASS');

	var delay = 2000; //in ms
	var attempts = 50;
	var i = 0;
	newsArray = [];

	//TODO calculate search date based on cerrent day
	searchDate = 'февраля, ';
	

	function findNews() {
		setTimeout(function() {

			check16 = $(`#infinite_listing div:contains("${searchDate + '16'}")`).length > 0;
			check15 = $(`#infinite_listing div:contains("${searchDate + '15'}")`).length > 0;
			check14 = $(`#infinite_listing div:contains("${searchDate + '14'}")`).length > 0;

			if (check16 && check15 && check14) {

				//Found last news
				logEvent('SEARCHING attempt №' + (i + 1) + ' SUCCESS');

				//create results array
				$('#infinite_listing a').each(function() {
					//get news link
					var newsLink = $(this).attr('href');

					//check if link releative
					if (!newsLink.includes('https://')) {
						//add domain name
						newsLink = 'https://www.tass.ru' + newsLink;
					}

					//get news title
					var newsTitle = $(this).find('span').text();

					//get date
					var rawNewsDate = $(this).find('div[class*="font_weight_black"]').first().text();

					newsDate = convertTassDate(rawNewsDate);

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

				//find load more button
				loadButton = $('button:contains("Загрузить больше результатов")');

				//press more news button if exist
				if (loadButton.length > 0) {
					loadButton.click();
				}

				//scroll to buttom
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

function convertTassDate(rawDate) {

	//Now
	if (rawDate.includes('Сейчас')) {
		return harvesterDateObj.fullDateTime;
	}

	//Minutes ago
	if (rawDate.includes('минуту') || rawDate.includes('минуты') || rawDate.includes('минут')) {
		//get number of minutes
		numOfMinutes = parseInt(rawDate.slice(0,rawDate.indexOf(' ')));
  
		//Set Object yesterday
		const newDate = new Date();
		newDate.setMinutes(harvesterDateObj.minutes - numOfMinutes);
  
		return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
	}

	//Hours ago
	if (rawDate.includes('час') || rawDate.includes('часа') || rawDate.includes('часов')) {
		//get number of hours
		numOfHours = parseInt(rawDate.slice(0,rawDate.indexOf(' ')));
  
		//Set Object yesterday
		const newDate = new Date();
		newDate.setHours(harvesterDateObj.hours - numOfHours);
  
		return newDate.getFullYear().toString() + addLeadingZero(newDate.getMonth() + 1) + addLeadingZero(newDate.getDate()) + addLeadingZero(newDate.getHours()) + addLeadingZero(newDate.getMinutes());
	}
	
	//Today
	if (rawDate.includes('Сегодня,')) {
		//extract time
		rawDate = rawDate.slice(9,14);
  
		return harvesterDateObj.today + rawDate.replace(':','');
	}
  
	//Yesterday
	if (rawDate.includes('Вчера,')) {
		//extract time
		rawDate = rawDate.slice(7,12);
  
		return harvesterDateObj.yesterday + rawDate.replace(':','');
	}

	//day before yesterday
	if (rawDate.includes('Позавчера,')) {
		//extract time
		rawDate = rawDate.slice(11,17);
  
		return harvesterDateObj.beforeyesterday + rawDate.replace(':','');
	}

	try {

		//extract time
		time = rawDate.slice(-5);

		//extract day
		day = parseInt(rawDate.slice(0,rawDate.indexOf(' ')));

		//BUG extract month not working because of &nbsp;
		//month = rawDate.slice(rawDate.indexOf(' ') + 1,rawDate.indexOf(','));

		//find month
		//monthsArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
		//month = monthsArray.indexOf(month);

		//HOTFIX
		if (rawDate.includes('февраля')) {
			month = 2;
		} else if (rawDate.includes('марта')) {
			month = 3;
		} else if (rawDate.includes('апреля')) {
			month = 4;
		}

		return harvesterDateObj.year + addLeadingZero(month) + addLeadingZero(day) + time.replace(':','');
		
	} catch (error) {

		return harvesterDateObj.year + '12312359';
		
	}
	

  }