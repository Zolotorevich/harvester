//Objects for storing dates
const dateObj = new Object();
const dateObjMeta = new Object();

//data objects
var newsData;
var viewedNews = [];

//issues
var issues = ['politics', 'economy', 'corporate'];

$(document).ready(function(){

	//create dateObj
	createDateObject();

	//get page url
	var url = window.location.href;

	//find issue in url
	currentCategory = issues.findIndex(x => url.match(x));
	
	//check if hash has issue
	if (currentCategory >= 0) {
		changeIssue(issues[currentCategory]);
	} else {
		changeIssue('politics');
	}

	//set timer for update viewed news
	setInterval(sendViewedNews,9000);

	// //menu items event
	// $('#menuExportList li').click(function() {
	// 	var clickedIssue = $(this).attr('data-issue');
	// 	if (clickedIssue != dateObjMeta.issue) {
	// 		changeIssue(clickedIssue);
	// 	}
	// });

	$('#viewedSwitch').click(function(){ toggleViewed(); });

});

function changeIssue(issueName) {

	//save viewed
	// sendViewedNews();

	//hide status messages
	$('.listInfoMessage').hide();

	//change menu items
	$('#menuExportList li').removeClass('menuExportSelected');
	$('#issue_' + issueName).addClass('menuExportSelected');

	//set global issue name
	dateObjMeta.issue = issueName;

	//Change page title
	$(document).prop('title', issueName + ' • Harvester');

	//load news
	loadNews();
}


function displayNews() {

	//Clear view
	$('#harvesterContainer a').empty();

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

			html = '<a href="' + newsData[i].url + '" target="_blank" class="newsContainerLink" data-id="' + newsData[i].id + '">';

			html += '<div class="newsContainer';

			//check if news viewed
			if (newsData[i].viewed == 1) {
				html += ' newsViewed';
			}

			html += '">';

			crawler = newsData[i].url.replace(/(https?:\/\/)?(www.)?/i, '');
			crawler = crawler.split('.');

			html += '<div class="sourceIcon"><img src="/style/sourceIcons/' + crawler[0] + '.png"></div>';

			html += '<div class="newsTime">' + fullDateToTime_new(newsData[i].date) + '</div>';
			
			html += '<div class="newsTitle"><span>' + newsData[i].title + '</span>';

			//add preview if any
			if (newsData[i].preview != '') {
				html += '<div class="newsPreview">' + newsData[i].preview + '</div>';
			}

			html += '</div></div></a>';

			$('#harvesterContainer').append(html);
		});

		//update main display
		updateDisplay();

		//add events
		addNewsEvenets();

		//move caret if any not viewed news
		if ($('.newsContainer:not(.newsViewed)').length > 0) {
			moveCaret($('.newsContainer:not(.newsViewed)').first().parent(), true);
		} else {
			moveCaret($('.newsContainer').first().parent(), true);
		}
		

	} else {
		//display no data message
		$('#noData').show();

		//update main display
		mainDisplay('status','noData');
	}

}

function toggleViewed() {
	//check ccurrent state
	var viewedIndicator = $('#viewedSwitch');

	if (viewedIndicator.hasClass('menuIndicatorON')) {
		//turn indicator OFF
		viewedIndicator.removeClass('menuIndicatorON');

		//check for no data
		if ($('#noData').is(':visible')) {
			return false;
		}

		//hide viewed
		$('.newsViewed').hide();

		//check if any left
		if ($('.newsContainer:visible').length == 0) {
			//show nothing to display
			$('#nothingToDisplay').show();
		} else {
			//move caret
			moveCaret($('.newsContainer:not(.newsViewed)').first().parent(), true);
		}
	
	} else {
		//turn indicator ON
		viewedIndicator.addClass('menuIndicatorON');

		//check for no data
		if ($('#noData').is(':visible')) {
			return false;
		}

		//hide nothing to display message
		$('#nothingToDisplay').hide();

		//show viewed
		$('.newsViewed').show();

		//scroll to caret
		scrollToCaret($('.newsCaret'), false);

	}
}


function updateDisplay() {
	//change display values
	mainDisplay('unreadCounter',(dateObjMeta.total - dateObjMeta.viewedNews));
	mainDisplay('timeOfUpdate',dateObjMeta.lastUpdate);
	mainDisplay('allNewsCounter',dateObjMeta.total);
}

function addNewsEvenets() {

	//clear events
	$('.newsContainerLink').off();
	$('body').off();

	//mouse left click on news
	$('.newsContainerLink').click(function(event) {
		if(event.which == 1) {

			markPreviousAsViewed($(this));
			moveCaret($(this));

			//if CMD pressed, make it false cuz keyup event will fire in other window
			if (cmdKey) {
				cmdKey = false;
			} else {
				//prevent if CMD key not pressed
				event.preventDefault();
			}

		}
	});

	//mouse middle click on news
	document.querySelectorAll('.newsContainerLink').forEach(box => {
		box.onauxclick = () => {
			markPreviousAsViewed($(box));
			moveCaret($(box));
		  };
	});

	//mouse over news
	$('.newsContainerLink').mouseover(function() {
		$(this).find('.sourceIcon img').show();
		$(this).find('.newsTitle span').addClass('newsTitle_hover');
	  })
	  .mouseout(function() {
		$(this).find('.sourceIcon img').hide();
		$(this).find('.newsTitle span').removeClass('newsTitle_hover');
	});

	//keyboard hotkeys
	$('body').keydown(function( event ) { keyboardShortcut(event); });

	//CMD key stuck
	$('body').keyup(function( event ) { 
		//CMD key
		if (event.keyCode == 91 || event.keyCode == 93) {
			cmdKey = false;
		}
	 });

	
}

function moveCaret(element, scroll = false) {

	//check if viewded indicator OFF
	if (!$('#viewedSwitch').hasClass('menuIndicatorON')) {
		//hide viewed
		$('.newsViewed').hide();
	}
	
	//add to viewed if needed
	checkForViewed(element);
	
	//add viewed class
	$(element).find('.newsContainer').addClass('newsViewed');

	//clear caret class and hide preview
	$('.newsContainer').removeClass('newsCaret');
	$('.newsPreview').hide();

	//add caret class and show preview
	$(element).find('.newsContainer').addClass('newsCaret');
	$(element).find('.newsPreview').show();

	//scroll to caret
	if (scroll) {
		scrollToCaret(element);
	}

}

function scrollToCaret(element, anumation = true) {
	//get caret position
	caretPosition = element.offset().top;

	//calc distance to top
	distanceToTop = caretPosition - $(document).scrollTop();

	//check if caret far away
	if (distanceToTop > 300 && anumation) {

		//scroll with animation
		$('html, body').animate({
			scrollTop: caretPosition - 200
		}, 200);
		
	} else {
		//scroll without animation
		$('html, body').scrollTop(caretPosition - 200);
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

