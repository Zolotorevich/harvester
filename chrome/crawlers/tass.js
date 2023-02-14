function crawlTass(lastNews) {
	logEvent('CRAWLING TASS');

	var delay = 2000; //in ms
	var attempts = 35;
	var i = 0;
	newsArray = [];
	lastNewsFound = false;

	//get date of last news
	lastNewsDate = lastNews[0].lastDate;

	function findNews() {
		setTimeout(function() {

			//clear results array
			newsArray = [];

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

				//convert date
				newsDate = convertTassDate(rawNewsDate);

				//save to array
				newsArray.push({
					'date':newsDate,
					'title':newsTitle,
					'link':newsLink,
					'preview':''
				});

				//check if news older than last one
				if (lastNewsDate > newsDate) {
					//check if news not edited
					isEdited = $(this).find('div:contains("обновлено")').length > 0;

					if (!isEdited) {
						lastNewsFound = true;
						return true;
					}
				}

			});

			//check if last news found
			if (lastNewsFound) {
				//send data
				harvester_sendData(newsArray);
				return true;
			}

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

		}, delay)
	}

	//launch crawler
	findNews();

}

function convertTassDate(rawDate) {

	//Now
	if (rawDate.includes('Сейчас') || rawDate.includes('Молния')) {
		return harvesterDateObj.fullDateTime;
	}

	//Minutes ago
	if (rawDate.includes('минуту') || rawDate.includes('минуты') || rawDate.includes('минут')) {
		//get number of minutes
		numOfMinutes = parseInt(rawDate.slice(0,rawDate.indexOf(' ')));
  
		//Set Date Object
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
		if (rawDate.includes('января')) {
			month = 1;
		} else if (rawDate.includes('февраля')) {
			month = 2;
		} else if (rawDate.includes('марта')) {
			month = 3;
		} else if (rawDate.includes('апреля')) {
			month = 4;
		} else if (rawDate.includes('мая')) {
			month = 5;
		} else if (rawDate.includes('июня')) {
			month = 6;
		} else if (rawDate.includes('июля')) {
			month = 7;
		} else if (rawDate.includes('августа')) {
			month = 8;
		} else if (rawDate.includes('сентября')) {
			month = 9;
		} else if (rawDate.includes('октября')) {
			month = 10;
		} else if (rawDate.includes('ноября')) {
			month = 11;
		} else if (rawDate.includes('декабря')) {
			month = 12;
		}

		finaldate = harvesterDateObj.year + addLeadingZero(month) + addLeadingZero(day) + time.replace(':','');

		if (isNaN(finaldate)) {
			return harvesterDateObj.fullDateTime;
		}

		return finaldate;
		
	} catch (error) {

		return harvesterDateObj.year + '12312359';
		
	}
	

  }