//CMD key
var cmdKey = false;

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
			moveCaret(next, true);
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
			moveCaret(prev, true);		
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
			moveCaret($(`a[data-id="${oldPosition}"]`));
		}, 10);

	}

	//CMD key
	if (event.keyCode == 91 || event.keyCode == 93) {
		cmdKey = true;
	}

	//check if Ctrl pressed
	if (event.ctrlKey) {

		//get pressed number
		if (event.keyCode < 96) {
			number = event.keyCode - 48;
		} else {
			number = event.keyCode - 96;
		}
		
		//click on menu item
		$('.menuExportKey' + number).children('a')[0].click();
		
	}
	
}