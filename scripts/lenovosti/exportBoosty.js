function exportBoosty() {
	var html = '';

	//change view
	changeView('boostyExport');

	//clear view
	$('#exportBoostyFullSize').html('');

	//add header
	html += '<h1>' + dateObj.todayByWordRus + ', ' + numberOfNewsToWord(globalNewsCounter) + ' за ' + calculateReadingTime(globalNewsCounter / 12 * 160) + '</h1>';

	//Leader news
	leaderData = newsData.filter(item => item.groupName == 'leader' && item.active == 1);

	//check if JSON have data
	if (leaderData.length > 0) {

		//sort by groupIndex
		leaderData.sort((a,b) => a.groupIndex - b.groupIndex);

		//Glue first leader news to header
		leaderData[0].glue = 1;

		//Display leader news
		$.each(leaderData, function(i) {
			html += exportDisplayLeaderNews(leaderData[i]);
		});
	}

	//RUS Yesterday
	html += '<br><br><b>';

	//post header
	if (dateObj.weekends) {
		html += 'Пятница и выходные';
	} else {
		html += dateObj.yesterdayByWordRus;
	}

	html += '</b>';


	var yesterdayData = newsData.filter(item => item.groupName == 'body' && item.source == 'Rus' && item.date < (dateObj.today + '0000') && item.active == 1);

	//check if JSON have data
	if (yesterdayData.length > 0) {
		//Sort by groupIndex
		sortJSON(yesterdayData,'date', 'asc');

		//Display news
		$.each(yesterdayData, function(i) {
			html += exportDisplayNewsWithTime(yesterdayData[i]);
		});
	}

	html += '<br><br><b>' + dateObj.todayByWordRus + '</b>';

	//RUS Today
	var todayData = newsData.filter(item => item.groupName == 'body' && item.source == 'Rus' && item.date >= (dateObj.today + '0000') && item.active == 1);

	//check if JSON have data
	if (todayData.length > 0) {
		//Sort by groupIndex
		sortJSON(todayData,'date', 'asc');

		//Display news
		$.each(todayData, function(i) {
			html += exportDisplayNewsWithTime(todayData[i]);
		});
	}

	//Foreign
	html += '<br><br>____________<br><b>Импортные леновости</b><br>Время московское, статьи английские';

	//The New York Times
	var NYTimesData = newsData.filter(item => item.groupName == 'body' && item.source == 'The New York Times' && item.active == 1);

	//check if JSON have data
	if (NYTimesData.length > 0) {
		//display header
		html += '<br><br><b>🇺🇸 Нью-Йорк Таймс (демократы)</b>';

		//Sort by groupIndex
		sortJSON(NYTimesData,'date', 'asc');

		//set date of first object
		var firstDate;

		//Display news
		$.each(NYTimesData, function(i) {
			//check if it's need a date before
			if ((NYTimesData[i].date.slice(4,8) > firstDate) || i == 0) {
				html += exportDisplayNewsWithTime(NYTimesData[i], true);
				firstDate = NYTimesData[i].date.slice(4,8);
			} else {
				html += exportDisplayNewsWithTime(NYTimesData[i]);
			}
		});
	}

	//The Guardian
	var GuardianData = newsData.filter(item => item.groupName == 'body' && item.source == 'The Guardian' && item.active == 1);

	//check if JSON have data
	if (GuardianData.length > 0) {
		//display header
		html += '<br><br><b>🇬🇧 Гардиан</b>';

		//Sort by groupIndex
		sortJSON(GuardianData,'date', 'asc');

		//set date of first object
		var firstDate;

		//Display news
		$.each(GuardianData, function(i) {
			//check if it's need a date before
			if ((GuardianData[i].date.slice(4,8) > firstDate) || i == 0) {
				html += exportDisplayNewsWithTime(GuardianData[i], true);
				firstDate = GuardianData[i].date.slice(4,8);
			} else {
				html += exportDisplayNewsWithTime(GuardianData[i]);
			}
		});
	}

	//Reuters
	var ReutersData = newsData.filter(item => item.groupName == 'body' && item.source == 'Reuters' && item.active == 1);

	//check if JSON have data
	if (ReutersData.length > 0) {
		//disaply header
		html += '<br><br><b>🇬🇧 Рейтер</b>';

		//Sort by groupIndex
		sortJSON(ReutersData,'date', 'asc');

		//set date of first object
		var firstDate;

		//Display news
		$.each(ReutersData, function(i) {
			//check if it's need a date before
			if ((ReutersData[i].date.slice(4,8) > firstDate) || i == 0) {
				html += exportDisplayNewsWithTime(ReutersData[i], true);
				firstDate = ReutersData[i].date.slice(4,8);
			} else {
				html += exportDisplayNewsWithTime(ReutersData[i]);
			}
		});
	}

	//Al Jazeera
	var aljazeeraData = newsData.filter(item => item.groupName == 'body' && item.source == 'Al Jazeera' && item.active == 1);

	//check if JSON have data
	if (aljazeeraData.length > 0) {
		//disaply header
		html += '<br><br><b>🇶🇦 Аль-Джазира</b>';
		
		//Sort by groupIndex
		sortJSON(aljazeeraData,'date', 'asc');

		//set date of first object
		var firstDate;

		//Display news
		$.each(aljazeeraData, function(i) {
			//check if it's need a date before
			if ((aljazeeraData[i].date.slice(4,8) > firstDate) || i == 0) {
				html += exportDisplayNewsWithTime(aljazeeraData[i], true);
				firstDate = aljazeeraData[i].date.slice(4,8);
			} else {
				html += exportDisplayNewsWithTime(aljazeeraData[i]);
			}
		});
	}
	
	//Rates
	html += '<br><br><b>Котировки ';

	if (dateObj.todayDayOfWeekWord == 'Monday') {
		//If it's monday, then take rates from friday
		html += dateRangeToWords(dateObj.lastFriday, dateObj.today, '2->5');
		var yesterdayRates = ratesData.filter(item => item.date == dateObj.lastFriday);

	} else if(dateObj.todayDayOfWeekWord == 'Friday') {
		//On friday takes from Monday
		html += dateRangeToWords(dateObj.lastMonday, dateObj.today, '2->5');
		var yesterdayRates = ratesData.filter(item => item.date == dateObj.lastMonday);

	} else {
		//get yesterday rates
		html += dateRangeToWords(dateObj.yesterday, dateObj.today, '2->5');
		var yesterdayRates = ratesData.filter(item => item.date == dateObj.yesterday);
	}
	
	//get today rates
	var todayRates = ratesData.filter(item => item.date == dateObj.today);


	html += '</b>';
	//display today rates if any
	if (todayRates.length > 0 && yesterdayRates.length > 0) {
		html += '<br><a href="https://quote.ru/ticker/72413">Доллар</a> ' + displayRates(yesterdayRates[0].usd, todayRates[0].usd) + ' ₽';
		html += '<br><a href="https://quote.ru/ticker/72383">Евро</a> ' + displayRates(yesterdayRates[0].eur, todayRates[0].eur) + ' ₽';
		html += '<br><a href="https://quote.ru/ticker/181206">Нефть</a> ' + displayRates(yesterdayRates[0].oil, todayRates[0].oil) + ' $';
		html += '<br><a href="https://www.profinance.ru/charts/ttfusd1000/lc97">Газ</a> ' + displayRates(yesterdayRates[0].gas, todayRates[0].gas) + ' $';
		html += '<br><a href="https://www.namex.org/ru/indices/WHstock">Пшеница</a> ' + displayRates(yesterdayRates[0].gip, todayRates[0].gip) + ' ₽';
	} else {
		html += '<br>no today rates';
	}

	//HQ
	html += '<br><br><b>Штаб докладывает</b><br>';

	//get data from JSON
	HQData = newsData.filter(item => item.groupName == 'hq' && item.active == 1);

	//All other data
	dataOtherSources = HQData.filter(item => item.source == 'Rus' && item.active == 1);
	if (dataOtherSources.length > 0) {
		
		//sort by groupIndex
		dataOtherSources.sort((a,b) => a.groupIndex - b.groupIndex);

		//Glue first leader news to header
		dataOtherSources[0].glue = 1;

		//display news
		$.each(dataOtherSources, function(i) {
			html += exportDisplayLeaderNews(dataOtherSources[i]);
		});
	}


	//next issue on Monday
	if (dateObj.todayDayOfWeekWord == 'Friday') {
		html += '<br><br><b>Следующий выпуск в понедельник</b>';
	}

	//write HTML
	$('#exportBoostyFullSize').append(html);
}