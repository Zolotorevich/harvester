//Сreate dateObj
function createDateObject() {
	// .today == 20230110
	// .todayDayOfWeekNumber == 2
	// .todayDayOfWeekWord == 'Tuesday'
	// .todayByWordRus == '10 января'
	// .todayByWordEng == '10 January'
	// .todayNumber == '10'
	// .todayMonth == '1'
	// .yesterday == 202301091700
	// .yesterdayByWordRus == '9 января'
	// .yesterdayByWordEng == '9 January'
	// .yesterdayNumber == '10'
	// .yesterdayMonth == '1'
	// .lastFriday == 20230106
	// .lastFridayByWordRus == '6 января'
	// .lastFridayByWordEng == '6 January'
	// .lastFridayNumber == '6'
	// .lastFridayMonth == '1'
	// .lastMonday == 20230109
	// .currentTime == 1620 ! NO LEADING ZERO ON HOUR
	// .weekends == friday > 20:00, weekends or monday < 20:00 -> true | false
	
	// create object
	const today = new Date();

	//MANUAL
	//const today = new Date('2023-01-13T21:00:00+03:00'); console.log('DATE MANUAL: ' + today);
	

	// .today
	var todayDayNumber = today.getDate();
	var todayDayOfWeek = today.getDay();
	var todayMonth = today.getMonth();
	var year = today.getFullYear().toString();
	dateObj.today = year + addLeadingZero(todayMonth + 1) + addLeadingZero(todayDayNumber);

	//Set Object today day of week
	const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	dateObj.todayDayOfWeekNumber = todayDayOfWeek;
	dateObj.todayDayOfWeekWord = weekday[todayDayOfWeek];
	
	//Set Object today by words
	dateObj.todayByWordRus = todayDayNumber.toString() + ' ' + monthToWordRus(todayMonth);
	dateObj.todayByWordEng = todayDayNumber.toString() + ' ' + monthToWordEng(todayMonth);

	//Set Object yesterday
	const yesterday = new Date();
	yesterday.setDate(todayDayNumber - 1);
	var yesterdayDayNumber = yesterday.getDate();
	var yesterdayMonth = yesterday.getMonth();
	dateObj.yesterday = yesterday.getFullYear().toString() + addLeadingZero(yesterdayMonth + 1) + addLeadingZero(yesterdayDayNumber);

	//Set Object yesterday by words
	dateObj.yesterdayByWordRus = yesterdayDayNumber.toString() + ' ' + monthToWordRus(yesterdayMonth);
	dateObj.yesterdayByWordEng = yesterdayDayNumber.toString() + ' ' + monthToWordEng(yesterdayMonth);


	//Set Object previous friday
	const lastFriday = new Date();
	lastFriday.setDate(todayDayNumber + (6 - todayDayOfWeek - 1) - (todayDayOfWeek == 6 ? 0 : 7));
	var lastFridayDayNumber = lastFriday.getDate();
	var lastFridayMonth = lastFriday.getMonth();
	dateObj.lastFriday = lastFriday.getFullYear().toString() + addLeadingZero(lastFridayMonth + 1) + addLeadingZero(lastFridayDayNumber);
	
	//Set Object previous friday by words
	dateObj.lastFridayByWordRus = lastFridayDayNumber.toString() + ' ' + monthToWordRus(lastFridayMonth);
	dateObj.lastFridayByWordEng = lastFridayDayNumber.toString() + ' ' + monthToWordEng(lastFridayMonth);

	//set today yesterday and list friday day number
	dateObj.todayNumber = todayDayNumber;
	dateObj.yesterdayNumber = yesterdayDayNumber;
	dateObj.lastFridayNumber = lastFridayDayNumber;

	//set today yesterday and list friday month
	dateObj.todayMonth = todayMonth;
	dateObj.yesterdayMonth = yesterdayMonth;
	dateObj.lastFridayMonth = lastFridayMonth;

	//Set Object previous monday
	const lastMonday = new Date();
	lastMonday.setDate(todayDayNumber - todayDayOfWeek + (todayDayOfWeek == 0 ? -6 : 1) + (todayDayOfWeek == 1 ? -7 : 0));
	var lastMondayDayNumber = lastMonday.getDate();
	var lastMondayMonth = lastMonday.getMonth();
	dateObj.lastMonday = lastMonday.getFullYear().toString() + addLeadingZero(lastMondayMonth + 1) + addLeadingZero(lastMondayDayNumber);

	//.currentTime
	var hour = today.getHours();
	var minutes = today.getMinutes();
	dateObj.currentTime = hour + addLeadingZero(minutes);

	//.weekends
	var fridayEvening = dateObj.todayDayOfWeekWord == 'Friday' && dateObj.currentTime > 2000;
	var mondayMorning = dateObj.todayDayOfWeekWord == 'Monday' && dateObj.currentTime < 2000;
	var weekendsDays = dateObj.todayDayOfWeekWord == 'Saturday' || dateObj.todayDayOfWeekWord == 'Sunday';
	dateObj.weekends = fridayEvening || mondayMorning || weekendsDays;

}

//add leading zero if needed and return string
function addLeadingZero(number) {
	if (number >= 0 && number < 10) {
		numberAsString = '0' + number.toString();
	} else {
		numberAsString = number.toString();
	}

	return numberAsString;
}

//convert month number to russian word
function monthToWordRus(monthNumber) {
	const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

	return monthNames[monthNumber];
}

//convert month number to english word
function monthToWordEng(monthNumber) {
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	return monthNames[monthNumber];
}

//convert 202301101700 -> 17:00, opt: round by 5 minutes
function fullDateToTime(input, round = true) {

	//if its weekends -> return date
	if (dateObj.weekends && input < dateObj.today) {
		return input.slice(6,8) + '.' + input.slice(4,6);
	}

	if(round) {
		var hours = input.slice(8,10);
		var minutes = input.slice(10);

		//check if it's >23:55
		if (parseInt(hours) == 23 && parseInt(minutes) > 55) {
			return '23:55';
		} else if(parseInt(minutes) > 55) {
			//checkif it's 55 minutes
			return hours + ':55';
		}

		//round to nearest 5
		minutes = Math.round(parseInt(minutes) / 5) * 5;

		//return with leading zero if needed
		return hours + ':' + addLeadingZero(minutes);
	}

	return input.slice(8,10) + ':' + input.slice(10);
}

//convert 202301101700 -> 10.01
function fullDateToShortDate(input) {
	return input.slice(6,8) + '.' + input.slice(4,6);
}

//convert 202301101700 -> 1001
function fullDateToShortDate_nodot(input) {
	return input.slice(6,8) + input.slice(4,6);
}

//convert 202301101700 -> 17:00, opt: round by 5 minutes
function fullDateToTime_nodot(input) {
	return input.slice(8,10) + input.slice(10);
}

//convert 202301101700 + 202301121700 -> '10, 11 и 12 января', opt: '2,4,5', '2->5'
function dateRangeToWords(stratDate, endDate, $pattern = '2,4,5') {
	//check if dates the same
	if (stratDate == endDate) {
		return 'Error: dateRangeToWords(Same dates)';
	}

	//check if month is the same
	if (stratDate.slice(4,6) == endDate.slice(4,6)) {
		
		//2->5 pattern
		if ($pattern == '2->5') {
			return parseInt(stratDate.slice(6,8)) + ' ⇢ ' + parseInt(endDate.slice(6,8)) + ' ' + monthToWordRus(parseInt(stratDate.slice(4,6)) - 1);
		}

	} else {

		//2->5 pattern
		if ($pattern == '2->5') {
			return parseInt(stratDate.slice(6,8)) + ' ' + monthToWordRus(parseInt(stratDate.slice(4,6)) - 1) + ' ⇢ ' + parseInt(endDate.slice(6,8)) + ' ' + monthToWordRus(parseInt(endDate.slice(4,6)) - 1);
		}
	}
}