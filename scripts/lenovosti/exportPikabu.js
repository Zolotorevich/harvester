function exportPikabu() {
	var html = '';

	//change view
	changeView('exportPikabu');

	//clear view
	$('#exportPikabuFullSize').html('');

	//add header
	//number of news
	var numberOfForeignNews = newsData.filter(item => item.source != 'Rus' && item.active == 1 && item.count == 1).length - 1;
	var numberOfHQ = newsData.filter(item => item.groupName == 'hq' && item.active == 1).length - 1;

	html += '<h1>' + dateObj.todayByWordRus + ', ' + numberOfNewsToWord(globalNewsCounter - numberOfForeignNews - numberOfHQ) + ' за ' + calculateReadingTime((globalNewsCounter - numberOfForeignNews) / 12 * 160) + '</h1>';

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
	html += '<br><br><b>Штаб докладывает</b><br><i>* на Пикабу цифры указывать нельзя</i><br/>';

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

	//Teaser
	if (teaserData.length > 0) {
		html += '<br><b><a href="https://t.me/lenovosti">Б̆ в Телеграме</a> и <a href="https://dzen.ru/lenovosti">Дзене</a></b><br>';

		html += '<b><a href="https://t.me/lenovosti/256">' + numberOfNewsToWordFreeExport(teaserData[0].numberOfNews) + ' по подписке, неделя бесплатно →</a></b>';

	} else {
		html += '<br><br>No teaser';
	}

	

	//write HTML
	$('#exportPikabuFullSize').append(html);
}