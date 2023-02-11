//sort JSON
function sortJSON(arr, key, way) {
    return arr.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === 'asc') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === 'dsc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

//get data from textarea
function getTextAreaLines() {
	var text = $("#newsText").val();
	var lines = text.split(/\r|\r\n|\n/);
	return lines;
}

//copy to clipboard
function updateClipboard(newClip) {
	navigator.clipboard.writeText(newClip);
}

//focus on password field on Auth page
function focusOnPassword() {
	$('#authPassword').focus();
}

//update image
function updateMap() {
	//get image src
	imageSrc = $('#mapLink').val();

	//check if no image link
	if (imageSrc != '') {
		//update image src
		$(".mapImage").each(function() {
			$(this).attr("src", imageSrc);
		});
	} else {
		//TODO display placeholder
		// $(".mapImage").each(function() {
		// 	$(this).removeClass();
		// });
	}
	
}

//calculate reading time
function calculateReadingTime(numberOfWords) {
	//calc number of minutes
	readingTime = Math.ceil(numberOfWords / 160);

	if (readingTime == 1) {
		return readingTime + ' минуту';
	}

	if (readingTime > 1 && readingTime < 5) {
		return readingTime + ' минуты';
	}

	return readingTime + ' минут';
}

//Add label to number of news
function numberOfNewsToWord(numberOfNews) {
	//check if its from 11 to 19
	if (numberOfNews >= 11 && numberOfNews <= 19) {
		return numberOfNews + ' леновостей';
	}

	//check if it's gratet that 100
	if (numberOfNews >= 111) {
		//get las two digits
		lastTwoDigits = numberOfNews % 100;

		//check if its from 11 to 19
		if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
			return numberOfNews + ' леновостей';
		}
	}

	//get last digit
	lastDigit = numberOfNews % 10;

	if (lastDigit == 1) {
		return numberOfNews + ' леновость';
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return numberOfNews + ' леновости';
	}

	return numberOfNews + ' леновостей';
	
}

//Add label '70 наших и импортных леновостей'
function numberOfNewsToWordFreeExport(numberOfNews) {
	//check if its from 11 to 19
	if (numberOfNews >= 11 && numberOfNews <= 19) {
		return numberOfNews + ' наших и импортных леновостей';
	}

	//check if it's gratet that 100
	if (numberOfNews >= 111) {
		//get las two digits
		lastTwoDigits = numberOfNews % 100;

		//check if its from 11 to 19
		if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
			return numberOfNews + ' наших и импортных леновостей';
		}
	}

	//get last digit
	lastDigit = numberOfNews % 10;

	if (lastDigit == 1) {
		return numberOfNews + ' нашая и импортная леновость';
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return numberOfNews + ' наших и импортных леновости';
	}

	return numberOfNews + ' наших и импортных леновостей';
	
}

//change main display values
function mainDisplay(type,message) {

	//change main counter
	if (type == 'unreadCounter') {
		$('#displayNewsCounter').html(addLeadingZero(message));
		
		return true;
	}

	//change time
	if (type == 'timeOfUpdate') {
		$('#displayNewsCounterCorrection').html(message);

		return true;
	}

	//change all news
	if (type == 'allNewsCounter') {
		$('#displayNewsTime').html(addLeadingZero(message));

		return true;
	}

	//add leading zero if number < 10 or <100
	function addLeadingZero(number) {
		if (number < 10) {
			return '<span>00</span>' + number;
		}

		if (number < 100) {
			return '<span>0</span>' + number;
		}

		return number;
	}

}