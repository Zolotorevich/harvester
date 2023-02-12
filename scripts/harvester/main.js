//Objects for storing dates
const dateObj = new Object();
const dateObjMeta = new Object();

//data objects
var newsData;
var viewedNews = [];

$(document).ready(function(){

	//create dateObj
	createDateObject();

	//set default issue
	dateObjMeta.issue = 'home';

	//load news
	loadNews();

	//set timer for update viewed news
	setInterval(sendViewedNews,9000);

});

function loadNews() {

	//generate startDate
	if (dateObj.weekends) {
		startDate = dateObj.lastFriday + '1600';
		// startDate = '202302121600';
	} else {
		startDate = dateObj.yesterday + '1600';
	}
	
	$.ajax({
		url: '/core/getNews.php',
		method: 'get',
		dataType: 'json',
		data: {issue: dateObjMeta.issue, startDate: startDate},
		success: function(data){
			newsData = data;
			console.log(newsData);
		}
	}).done(function() {
		displayNews();
	});

}

function sendViewedNews() {

	//check if any viewed news
	if (viewedNews.length > 0) {

		//prepare array
		sendingData = [dateObjMeta.issue, viewedNews];

		//send data
		$.ajax({
			url: '/core/updateViewed.php',
			method: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(sendingData),
			complete: function(data){
				if (data.responseText == 'Records created') {
					//clear array
					viewedNews = [];
				} else {
					console.log(data);
				}
			}
		});
		
	}

}

function displayNews() {

	//Clear view
	$('#harvesterContainer').html();

	//total news
	dateObjMeta.total = newsData.length;

	//display data
	if (dateObjMeta.total > 0) {
		
		//sort by time
		sortJSON(newsData,'date', 'dsc');

		//update meta values
		dateObjMeta.lastUpdate = fullDateToTime(newsData[0].date);
		dateObjMeta.viewedNews = newsData.filter(item => item.viewed == 1).length;

		//display news
		$.each(newsData, function(i) {

			html = '<a href="' + newsData[i].link + '" target="_blank" class="newsContainerLink" data-id="' + newsData[i].id + '">';

			html += '<div class="newsContainer';

			//check if news viewed
			if (newsData[i].viewed == 1) {
				html += ' newsViewed';
			}

			html += '">';

			html += '<div class="sourceIcon"><img src="/style/sourceIcons/' + newsData[i].crawler + '.png"></div>';

			html += '<div class="newsTime">' + fullDateToTime(newsData[i].date) + '</div>';
			
			html += '<div class="newsTitle">' + newsData[i].title + '</div></div></a>';

			$('#harvesterContainer').append(html);
		});

		//update main display
		updateDisplay();

		//add events
		addNewsEvenets();

		//move caret
		moveCarret($('.newsContainer:not(.newsViewed)').first().parent(), true);

	} else {
		//display no data message
		$('#harvesterContainer').append('<div id="noData">NO DATA</div>');

		//update main display
		mainDisplay('status','noData');
	}

}


function updateDisplay() {
	//change display values
	mainDisplay('unreadCounter',(dateObjMeta.total - dateObjMeta.viewedNews));
	mainDisplay('timeOfUpdate',dateObjMeta.lastUpdate);
	mainDisplay('allNewsCounter',dateObjMeta.total);
}

function addNewsEvenets() {
	$('.newsContainerLink').click(function(event) {
		if(event.which == 1) {
			event.preventDefault();
			markPreviousAsViewed($(this));
			moveCarret($(this));
		 }
	});

	$('.newsContainerLink').mouseover(function() {
		$(this).find('.sourceIcon img').show();
		$(this).find('.newsTitle').addClass('newsTitle_hover');
	  })
	  .mouseout(function() {
		$(this).find('.sourceIcon img').hide();
		$(this).find('.newsTitle').removeClass('newsTitle_hover');
	});

	//keyboard hotkeys
	$('body').keydown(function( event ) { keyboardShortcut(event); });
}

function moveCarret(element, scroll = false) {
	
	//add to viewed if needed
	checkForViewed(element);
	
	//add viewed class
	$(element).find('.newsContainer').addClass('newsViewed');

	//clear caret class
	$('.newsContainer').removeClass('newsCaret');

	//add caret class
	$(element).find('.newsContainer').addClass('newsCaret');

	//scroll to caret
	if (scroll) {
		//get caret position
		caretPosition = element.offset().top;

		//calc distance to top
		distanceToTop = caretPosition - $(document).scrollTop();

		//check if caret far away
		if (distanceToTop > 300) {

			//scroll with animation
			$('html, body').animate({
				scrollTop: caretPosition - 200
			}, 200);
			
		} else {
			//scroll without animation
			$('html, body').scrollTop(caretPosition - 200);
		}

	}

}

function checkForViewed(element) {
	if (!$(element).find('.newsContainer').hasClass('newsViewed')) {

		//add as viewed
		viewedNews.push($(element).attr('data-id'));

		//add viewed class
		$(element).find('.newsContainer').addClass('newsViewed');

		//update number of viewed
		dateObjMeta.viewedNews++;

		//update display
		updateDisplay();
	}
}

function markPreviousAsViewed(element) {

	//circle all the news
	$('.newsContainerLink').each(function() {

		//check if it's clicked element
		if ($(this).attr('data-id') == element.attr('data-id')) {
			//break the loop
			return false;
		}

		//add to viewed if needed
		checkForViewed($(this));

	});
}

function keyboardShortcut(event) {

	//DEBUG show keycode in console
	//console.log(event.keyCode);

	//Down arrow or S
	if (event.keyCode == 40 || event.keyCode == 83) {
		
		//prevent page scroll
		event.preventDefault();

		//find next element
		next = $('.newsCaret').parent().next();

		//check if next exist
		if (next.length > 0) {
			moveCarret(next, true);
		}

	}

	//Up arrow or W
	if (event.keyCode == 38 || event.keyCode == 87) {
		
		//prevent page scroll
		event.preventDefault();

		//find prev element
		prev = $('.newsCaret').parent().prev();

		//check if next exist
		if (prev.length > 0) {
			moveCarret(prev, true);		
		}
	}

	//Enter or Space
	if (event.keyCode == 13 || event.keyCode == 32) {
		//prevent page scroll
		event.preventDefault();

		//HOTFIX save caret position cuz chrome extention move it away
		oldPosition = $('.newsCaret').parent().attr('data-id');

		//open current caret
		window.open($('.newsCaret').parent().attr('href'), '_blank');

		setTimeout(function() { 
			//HOTFIX regain position
			moveCarret($(`a[data-id="${oldPosition}"]`));
		}, 10);
		
		
	}
	
}