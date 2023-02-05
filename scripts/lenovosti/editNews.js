function editNews(newsId) {

	//find element by id
	newsContainer = $(`[data-id='${newsId}']`);

	//fing news by id
	var newsObject = newsData.filter(item => item.id == newsId);

	//hide edit forms
	$('#interfaceContainer').append($('#newsWithTimeEditForm'));
	$('#interfaceContainer').append($('#leaderNewsEditForm'));

	//get id of hidden news
	hiddenId = $('#newsWithTimeEditForm').data('id');

	if (hiddenId != 0) {
		//show hidden news
		$(`[data-id='${hiddenId}']`).show();
	}

	// same with leader edit
	hiddenId = $('#leaderNewsEditForm').data('id');

	if (hiddenId != 0) {
		//show hidden news
		$(`[data-id='${hiddenId}']`).show();
	}


	//check if its leader or hq
	if (newsObject[0].groupName != 'leader' && newsObject[0].groupName != 'hq') {
		//Move edit form
		newsContainer.after($('#newsWithTimeEditForm'));

		//update edit form
		$('#newsWithTimeEditForm').data('id', newsObject[0].id);
		$('#newsWithTimeEditForm_textarea').val(newsObject[0].text);
		$('#newsWithTimeEditForm_time').html(fullDateToTime_nodot(newsObject[0].date));
		$('#newsWithTimeEditForm_date').html(fullDateToShortDate_nodot(newsObject[0].date));
		$('#newsWithTimeEditForm_link').html(newsObject[0].link);

		//update count
		$('#newsWithTimeEditForm_count').css('textDecoration', 'none');
		if (newsObject[0].count == 0) {
			$('#newsWithTimeEditForm_count').css('textDecoration', 'line-through');
		}

		$('#newsWithTimeEditForm_count').data('id', newsObject[0].id);

		//update lead button
		$('#newsWithTimeEditForm_lead').data('id', newsObject[0].id);

		//update save button
		$('#newsWithTimeEditForm_save').data('id', newsObject[0].id);
		
		
	} else {
		//Move edit form
		newsContainer.after($('#leaderNewsEditForm'));

		//update edit form
		$('#leaderNewsEditForm').data('id', newsObject[0].id);
		$('#leaderNewsEditForm_textarea').val(newsObject[0].text);
		$('#leaderNewsEditForm_time').html(fullDateToTime_nodot(newsObject[0].date));
		$('#leaderNewsEditForm_date').html(fullDateToShortDate_nodot(newsObject[0].date));
		$('#leaderNewsEditForm_link').html(newsObject[0].link);
		$('#leaderNewsEditForm_groupIndex').html(newsObject[0].groupIndex);

		//update count
		$('#leaderNewsEditForm_count').css('textDecoration', 'none');
		if (newsObject[0].count == 0) {
			$('#leaderNewsEditForm_count').css('textDecoration', 'line-through');
		}
		$('#leaderNewsEditForm_count').data('id', newsObject[0].id);


		//update body button
		$('#leaderNewsEditForm_body').data('id', newsObject[0].id);

		//update save button
		$('#leaderNewsEditForm_save').data('id', newsObject[0].id);

		//update glue button
		$('#leaderNewsEditForm_glue').data('id', newsObject[0].id);

		//update groupIndex
		$('#leaderNewsEditForm_groupIndex').data('id', newsObject[0].id);

		//update arraws
		$('#leaderNewsEditForm_arrowup').data('id', newsObject[0].id);
		$('#leaderNewsEditForm_arrowdown').data('id', newsObject[0].id);
	}

	//hide element
	newsContainer.hide();
}


function toggleCount(element) {
	//fing news by id
	var newsObject = newsData.filter(item => item.id == element.data('id'));

	//change data obj
	newsObject[0].count = newsObject[0].count == 0 ? 1 : 0;

	//change button style
	element.css('textDecoration', 'none');
	if (newsObject[0].count == 0) {
		element.css('textDecoration', 'line-through');
	}

}

function toggleLeadBody(element, formType) {
	//fing news by id
	var newsObject = newsData.filter(item => item.id == element.data('id'));

	//change data obj
	newsObject[0].groupName = newsObject[0].groupName == 'body' ? 'leader' : 'body';

	// send data
	updateNews(newsObject[0].id, formType);

}

function glueButtonSend(element) {
	//fing news by id
	var newsObject = newsData.filter(item => item.id == element.data('id'));

	//change data obj
	newsObject[0].glue = newsObject[0].glue == 1 ? 0 : 1;

	// send data
	updateNews(newsObject[0].id, 'longForm');
}

