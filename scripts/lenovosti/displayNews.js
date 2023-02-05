function displayNews() {
	//Clear view
	clearView();

	//Update left menu display
	updateDisplay();

	//Read JSON
	readNotes();
	readLeader();
	readBody();
	readHQ();

	//add handler for edit news
	$('.leditorNewsContent').on('click', function() {editNews($(this).parent().data('id'));});

	//display active button
	$(".leditorNewsWithTime")
		.mouseenter(function() {
			//show active button
			$('#activeButton').show();

			//get current element position
			var element = $(this).position();

			//move in active button
			$('#activeButton').css('top', element.top);
			$('#activeButton').css('left', element.left);

			//$('.leditorNewsViewController', $(this)).append($('#activeButton'));

			//change active button state
			$('#activeButton div').removeClass();

			if ($(this).data('active') == '1') {
				$('#activeButton div').addClass('activeButtonON');
			} else {
				$('#activeButton div').addClass('activeButtonOFF');
			}

			//change active button data
			$('#activeButton').data('id', $(this).data('id'));
			$('#activeButton').data('active', $(this).data('active'));

		})
		.mouseleave(function() {
			//moveout active button
			//$('#interfaceContainer').append($('#activeButton'));

			//hide active button
			//$('#activeButton').hide();
		});
	
	//handler for active button
	$('#activeButton').click( function() {
		//move active button to park
		//$('#interfaceContainer').append($('#activeButton'));

		changeActive($(this).data('id'), $(this).data('active'));
	} );

	//Edit with time form handlers
	$('#newsWithTimeEditForm_count').click(function() { toggleCount($(this)); });
	$('#newsWithTimeEditForm_lead').click(function() { toggleLeadBody($(this), 'shortForm'); });
	$('#newsWithTimeEditForm_save').click(function() { updateNews($(this).data('id'), 'shortForm'); });

	//Leader edit handlers
	$('#leaderNewsEditForm_count').click(function() { toggleCount($(this)); });
	$('#leaderNewsEditForm_body').click(function() { toggleLeadBody($(this), 'longForm'); });
	$('#leaderNewsEditForm_glue').click(function() { glueButtonSend($(this)); });
	$('#leaderNewsEditForm_save').click(function() { updateNews($(this).data('id'), 'longForm'); });
	$('#leaderNewsEditForm_arrowdown').click(function() {});
	$('#leaderNewsEditForm_arrowup').click(function() {});

}

function clearView() {

	//hide edit forms
	$('#interfaceContainer').append($('#newsWithTimeEditForm'));
	$('#interfaceContainer').append($('#leaderNewsEditForm'));

	//Clear dispaly
	$('#displayNewsCounter').html('000');
	$('#displayNewsTime').html('0');
	$('#displayNewsCounterCorrection').html('±0');

	//Clear indicators
	$('#menuIndicatorLeader').removeClass('menuIndicatorON');
	$('#menuIndicatorBody').removeClass('menuIndicatorON');
	$('#menuIndicatorForeign').removeClass('menuIndicatorON');
	$('#menuIndicatorRates').removeClass('menuIndicatorON');
	$('#menuIndicatorHQ').removeClass('menuIndicatorON');

	//clear content
	$('#leditorNotes').hide();
	$('#leditorNotesContent').html();

	$('#leditorLeaderHeader').html('<div>Leader</div><div class="hLine"></div>');
	$('#leditorLeaderHeader').addClass('leditorHeaderNoContent');
	$('#leditorLeaderContent').html('');

	if (dateObj.weekends) {
		$('#leditorYesterdayHeader').html('<div>Пятница и выходные</div><div class="hLine"></div>');
		$('#leditorYesterdayHeader').addClass('leditorHeaderNoContent');
		$('#leditorYesterdayContent').html('');
	} else {
		$('#leditorYesterdayHeader').html('<div>' + dateObj.yesterdayByWordEng + '</div><div class="hLine"></div>');
		$('#leditorYesterdayHeader').addClass('leditorHeaderNoContent');
		$('#leditorYesterdayContent').html('');
	}

	
	$('#leditorTodayHeader').html('<div>' + dateObj.todayByWordEng + '</div><div class="hLine"></div>');
	$('#leditorTodayHeader').addClass('leditorHeaderNoContent');
	$('#leditorTodayContent').html('');

	$('#leditorNYTimesHeader').html('<div>THE NEW YORK TIMES</div><div class="hLine"></div>');
	$('#leditorNYTimesHeader').addClass('leditorHeaderNoContent');
	$('#leditorNYTimesContent').html('');

	$('#leditorGuardianHeader').html('<div>THE GUARDIAN</div><div class="hLine"></div>');
	$('#leditorGuardianHeader').addClass('leditorHeaderNoContent');
	$('#leditorGuardianContent').html('');

	$('#leditorReutersHeader').html('<div>Reuters</div><div class="hLine"></div>');
	$('#leditorReutersHeader').addClass('leditorHeaderNoContent');
	$('#leditorReutersContent').html('');

	$('#leditorAljazeeraHeader').html('<div>Al Jazeera</div><div class="hLine"></div>');
	$('#leditorAljazeeraHeader').addClass('leditorHeaderNoContent');
	$('#leditorAljazeeraContent').html('');

	//Clear Rates
	$('#leditorRatesToday').html('');
	$('#leditorRatesYesterday').html('ND<br>ND<br>ND<br>ND<br>ND');

	//Сlear HQ
	$('#leditorHQHeader').html('<div>HQ</div><div class="hLine"></div>');
	$('#leditorHQHeader').addClass('leditorHeaderNoContent');
	$('#leditorHQContent').html('');


}

function updateDisplay() {
	//Number of disabled news
	var disabledNews = newsData.filter(item => item.active == 0).length;
	if (disabledNews > 0) {
		$('#displayNewsCounterCorrection').html(disabledNews);
	}

	var activeNews = newsData.filter(item => item.active == 1).length;
	
	//Number of news
	var numberOfGlueAndCount = newsData.filter(item => item.glue == 1 && item.count == 1).length;
	var numberOfMaps = newsData.filter(item => item.source == 'Map').length;
	var numberOfNotCount = newsData.filter(item => item.count == 0).length;
	var numberOfNotes = newsData.filter(item => item.groupName == 'notes').length;

	var numberOfNews = activeNews - numberOfNotCount - numberOfGlueAndCount - numberOfMaps - numberOfNotes;

	if (numberOfNews > 0) {
		$('#displayNewsCounter').html(numberOfNews);
		globalNewsCounter = numberOfNews;
	}

	//TODO reading time
}

function updateRates() {
	//get data from JSON
	var todayRates = ratesData.filter(item => item.date == dateObj.today);	
	
	if (dateObj.todayDayOfWeekWord == 'Monday') {
		//if it's monday, then take rates from friday
		var yesterdayRates = ratesData.filter(item => item.date == dateObj.lastFriday);
	} else if (dateObj.todayDayOfWeekWord == 'Friday') {
		//if it's friday, then take rates from monday
		var yesterdayRates = ratesData.filter(item => item.date == dateObj.lastMonday);
	} else {
		var yesterdayRates = ratesData.filter(item => item.date == dateObj.yesterday);
	}

	//display yesterday rates
	$('#leditorRatesYesterday').html(yesterdayRates[0].usd + '<br>' + yesterdayRates[0].eur + '<br>' + yesterdayRates[0].oil + '<br>' + yesterdayRates[0].gas + '<br>' + yesterdayRates[0].gip + '<br>');

	//display today rates if any
	if (todayRates.length > 0) {
		$('#leditorRatesToday').html(todayRates[0].usd + '\n' + todayRates[0].eur + '\n' + todayRates[0].oil + '\n' + todayRates[0].gas + '\n' + todayRates[0].gip);

		//Indicator ON
		$('#menuIndicatorRates').addClass('menuIndicatorON');
	}
	

}

function updateTeaser() {
	//check if data exist
	if (teaserData.length > 0) {
		$('#leditorTeaserText').val(teaserData[0].text);
		$('#teaserNumberOfNews').val(teaserData[0].numberOfNews);
	} else {
		$('#leditorTeaserText').val('none');
	}

}

function readNotes() {
	//get data from JSON
	dataNotes = newsData.filter(item => item.groupName == 'notes');

	//check if JSON have data
	if (dataNotes.length > 0) {
		//show notes block
		$('#leditorNotes').show();

		//clear notes
		$('#leditorNotesContent').html('');

		//Display notes
		$.each(dataNotes, function(i) {
			$('#leditorNotesContent').append('<div class="leditorNewsWithTime" data-id="' + dataNotes[i].id + '" data-active="' + dataNotes[i].active + '"><div class="leditorNewsViewController"></div><div class="leditorNewsTime"><a href="' + dataNotes[i].link + '">' + fullDateToShortDate(dataNotes[i].date) + '</a></div><div class="leditorNewsContent">' + dataNotes[i].text + '</div></div>');
		});
	}

}

function readLeader() {
	//get data from JSON
	leaderData = newsData.filter(item => item.groupName == 'leader');

	//check if JSON have data
	if (leaderData.length > 0) {

		//sort by groupIndex
		leaderData.sort((a,b) => a.groupIndex - b.groupIndex);

		//Display leader news
		$.each(leaderData, function(i) {
			$('#leditorLeaderContent').append(displayLeaderNews(leaderData[i]));
		});

		//make header black
		$('#leditorLeaderHeader').removeClass('leditorHeaderNoContent');
	
		//Indicator ON
		$('#menuIndicatorLeader').addClass('menuIndicatorON');
	}

}

function readBody() {

	//RUS Yesterday
	var rusYesterdayData = newsData.filter(item => item.groupName == 'body' && item.source == 'Rus' && item.date < (dateObj.today + '0000'));

	if (rusYesterdayData.length > 0) {
		//sort by time
		sortJSON(rusYesterdayData,'date', 'asc');

		//display news
		$.each(rusYesterdayData, function(i) {
			$('#leditorYesterdayContent').append(displayNewsWithTime(rusYesterdayData[i]));
		});

		//make header black
		$('#leditorYesterdayHeader').removeClass('leditorHeaderNoContent');
		
	}

	//RUS Today
	var rusTodayData = newsData.filter(item => item.groupName == 'body' && item.source == 'Rus' && item.date >= (dateObj.today + '0000'));

	if (rusTodayData.length > 0) {
		//sort by time
		sortJSON(rusTodayData,'date', 'asc');

		//display news
		$.each(rusTodayData, function(i) {
			$('#leditorTodayContent').append(displayNewsWithTime(rusTodayData[i]));
		});

		//make header black
		$('#leditorTodayHeader').removeClass('leditorHeaderNoContent');
		
	}

	//The New York Times
	var NYTimesData = newsData.filter(item => item.groupName == 'body' && item.source == 'The New York Times');

	if (NYTimesData.length > 0) {
		//sort by time
		sortJSON(NYTimesData,'date', 'asc');

		//display news
		$.each(NYTimesData, function(i) {
			$('#leditorNYTimesContent').append(displayNewsWithTime(NYTimesData[i]));
		});

		//make header black
		$('#leditorNYTimesHeader').removeClass('leditorHeaderNoContent');

	}

	//The Guardian
	var GuardianData = newsData.filter(item => item.groupName == 'body' && item.source == 'The Guardian');

	if (GuardianData.length > 0) {
		//sort by time
		sortJSON(GuardianData,'date', 'asc');

		//display news
		$.each(GuardianData, function(i) {
			$('#leditorGuardianContent').append(displayNewsWithTime(GuardianData[i]));
		});

		//make header black
		$('#leditorGuardianHeader').removeClass('leditorHeaderNoContent');

	}

	//Reuters
	var reutersData = newsData.filter(item => item.groupName == 'body' && item.source == 'Reuters');

	if (reutersData.length > 0) {
		//sort by time
		sortJSON(reutersData,'date', 'asc');

		//display news
		$.each(reutersData, function(i) {
			$('#leditorReutersContent').append(displayNewsWithTime(reutersData[i]));
		});

		//make header black
		$('#leditorReutersHeader').removeClass('leditorHeaderNoContent');

	}

	//Al Jazeera
	var aljazeeraData = newsData.filter(item => item.groupName == 'body' && item.source == 'Al Jazeera');

	if (aljazeeraData.length > 0) {
		//sort by time
		sortJSON(aljazeeraData,'date', 'asc');

		//display news
		$.each(aljazeeraData, function(i) {
			$('#leditorAljazeeraContent').append(displayNewsWithTime(aljazeeraData[i]));
		});

		//make header black
		$('#leditorAljazeeraHeader').removeClass('leditorHeaderNoContent');

	}

	//TODO Check menu indicators
	

}


function readHQ() {

	//menu indicator
	var menuIndicator = true;

	//get data from JSON
	HQData = newsData.filter(item => item.groupName == 'hq');

	//All other data
	dataOtherSources = HQData.filter(item => item.source == 'Rus');

	if (dataOtherSources.length > 0) {

		//sort by groupIndex
		dataOtherSources.sort((a,b) => a.groupIndex - b.groupIndex);

		//display news
		$.each(dataOtherSources, function(i) {
			$('#leditorHQContent').append(displayLeaderNews(dataOtherSources[i]));
		});		
	}

	//MAP
	dataMap = HQData.filter(item => item.source == 'Map');
	if (dataMap.length > 0) {
		$('#leditorHQContent').append('<div class="leditorNewsMap"><div class="leditorNewsMapContent">MAP:&nbsp;</div><div id="leditorNewsMapLink" contenteditable="true">' + dataMap[0].link + '</div></div>');
	} else {
		$('#leditorHQContent').append('<div class="leditorNewsMap"><div class="leditorNewsMapContent textColorRed">NO MAP:&nbsp;</div><div id="leditorNewsMapLink" contenteditable="true"></div></div>');
		menuIndicator = false;
	}

	//Indicator
	if (menuIndicator) {
		$('#menuIndicatorHQ').addClass('menuIndicatorON');
	}
	
}



//Generate HTML for news with time
function displayNewsWithTime(obj) {

	var html = '<div class="leditorNewsWithTime';

	//check if active
	if (obj.active == 0) {
		html += ' disabledNews';
	}

	html += '" data-id="' + obj.id + '" data-active="' + obj.active + '"><div class="leditorNewsViewController">';

	//check for count
	if (obj.count == 0) {
		html += '×&nbsp;';
	}

	html += '</div><div class="leditorNewsTime"><a href="' + obj.link + '">' + fullDateToTime(obj.date) + '</a></div>';
	html += '<div class="leditorNewsContent">' + obj.text + '</div></div>';

	return html;
}

//Generate HTML for leader news
function displayLeaderNews(obj) {

	var html = '<div class="leditorNewsWithTime';

	//check if active
	if (obj.active == 0) {
		html += ' disabledNews';
	}

	html += '" data-id="' + obj.id + '" data-active="' + obj.active + '"><div class="leditorNewsViewController">';

	//check glue
	if (obj.glue == 1) {
		html += '⇡&nbsp;';
	} else if (obj.count == 0) {
		html += '×&nbsp;';
	}

	html += '</div><div class="leditorNewsContent"><a href="' + obj.link + '">';

	//find new line symbol
	var newLineIndex = obj.text.indexOf("\n");

	html += obj.text.slice(0,newLineIndex) + '</a>';
	html += obj.text.slice(newLineIndex + 1) + '</div></div>';

	return html;
}
