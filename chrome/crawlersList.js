//name is category name in DB
//url is regexp

let crawlersList = [
	{
		name: 'interfax',
		alias: 'interfax',
		url: 'interfax\.ru\/$',
		crawlerFunction: crawlInterfax
	}
];