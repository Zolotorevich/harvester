function displayRates(yesterday, today) {
	//round to 1 digit if needed
	if (yesterday % 1 != 0) {
		yesterday = Math.round(yesterday * 10) / 10;
	}

	if (today % 1 != 0) {
		today = Math.round(today * 10) / 10;
	}

	//add space if nessesary
	if (yesterday > 9999) {
		yesterday = yesterday.substring(0, 2) + ' ' + yesterday.substring(2);
	}

	if (today > 9999) {
		today = today.substring(0, 2) + ' ' + today.substring(2);
	}

	//replace dot with comma
	yesterday = yesterday.toString().replace('.', ',');
	today = today.toString().replace('.', ',');

	//display
	return yesterday + ' ⇢ ' + today;

}

function exportDisplayLeaderNews(obj) {

	var html = '';

	//check glue
	if (obj.glue == 0) {
		html += '<br><br>';
	} else {
		html += ' ';
	}

	html += '<a href="' + obj.link + '">';

	//find new line symbol
	var newLineIndex = obj.text.indexOf("\n");
	html += obj.text.slice(0,newLineIndex) + '</a>';
	html += obj.text.slice(newLineIndex + 1);

	return html;
}

function exportDisplayNewsWithTime(obj, dateBefore = false) {
	if (dateBefore) {
		return '<br><br><a href="' + obj.link + '"><b>' + fullDateToShortDate(obj.date) + '</b>, ' + fullDateToTime(obj.date) + '</a> ' + obj.text;
	} else {
		return '<br><br><a href="' + obj.link + '">' + fullDateToTime(obj.date) + '</a> ' + obj.text;
	}
}

