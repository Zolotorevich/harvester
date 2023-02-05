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

function createTemplateObjects() {
	HQtemplateMO.text = 'МО\n: наши ракеты посетили. Наступаем на Донецком направлении, уничтожили 50 противников. Лётчики, ракетчики и артиллеристы прибахнули™ 170 противников на Купянском, Красно-Лиманском и Южно-Донецком направлениях, 3 РЛС, 73 огневые точки и 86 районов с живой силой. Уничтожили МиГ-29 и 2 × Ми-8 в воздушном бою, 15 БПЛА, 17 танков/БТР, РСЗО, 4 артиллерии и 17 автомобилей. Всего: 355 самолётов, 196 вертолётов, 2756 БПЛА, 399 ЗРК, 7313 танков/БТР, 954 РСЗО, 3746 артиллерии и 7827 автомобилей.';
	HQtemplateMO.link = 'https://t.me/mod_russia';
	HQtemplateMO.id = 'temp_mo';
	HQtemplateMO.glue = 0;
	HQtemplateMO.active = 1;
	HQtemplateMO.count = 1;

	HQtemplateDNR.text = 'ДНР\n: уничтожили 100 противников, 2 танка, РСЗО, 2 гаубицы и 6 автомобилей.';
	HQtemplateDNR.link = 'https://t.me/nm_dnr';
	HQtemplateDNR.id ='temp_dnr';
	HQtemplateDNR.glue = 0;
	HQtemplateDNR.active = 1;
	HQtemplateDNR.count = 1;

	HQtemplateLNR.text = 'ЛНР\n: уничтожили 85 противников, 2 танка, 3 БТР, 1 артиллерию и 16 автомобилей.';
	HQtemplateLNR.link = 'https://t.me/millnr';
	HQtemplateLNR.id ='temp_lnr';
	HQtemplateLNR.glue = 0;
	HQtemplateLNR.active = 1;
	HQtemplateLNR.count = 1;

	HQtemplateSDNR.text = 'СЦКК ДНР\n: 68 обстрелов: Донецк, . Погибли 0 мирных, 0 ранены, повреждены 8 зданий.';
	HQtemplateSDNR.link = 'https://t.me/DNR_SCKK';
	HQtemplateSDNR.id ='temp_sdnr';
	HQtemplateSDNR.glue = 0;
	HQtemplateSDNR.active = 1;
	HQtemplateSDNR.count = 1;

	HQtemplateSLNR.text = 'СЦКК ЛНР\n: 1 обстрел: Алчевск. Разрушены 2 здания, 17 повреждены.';
	HQtemplateSLNR.link = 'https://t.me/LPR_JCCC';
	HQtemplateSLNR.id ='temp_slnr';
	HQtemplateSLNR.glue = 0;
	HQtemplateSLNR.active = 1;
	HQtemplateSLNR.count = 1;

}