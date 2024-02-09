//NOTE: url is regexp

let crawlersList = [
	{
		name: 'interfax',
		alias: 'interfax',
		url: 'interfax\.ru\/$',
		crawlerFunction: crawlInterfax
	},
	{
		name: 'tass_world',
		alias: 'tass',
		url: 'tass\.ru\/mezhdunarodnaya-panorama$',
		crawlerFunction: crawlTass
	},
	{
		name: 'tass_politics',
		alias: 'tass',
		url: 'tass\.ru\/politika$',
		crawlerFunction: crawlTass
	},
	{
		name: 'tass_society',
		alias: 'tass',
		url: 'tass\.ru\/obschestvo$',
		crawlerFunction: crawlTass
	},
	{
		name: 'tass_economy',
		alias: 'tass',
		url: 'tass\.ru\/ekonomika$',
		crawlerFunction: crawlTass
	},
	{
		name: 'aljazeera',
		alias: 'aljazeera',
		url: 'aljazeera\.com\/news\/$',
		crawlerFunction: crawlAljazeera
	},
	{
		name: 'nytimes',
		alias: 'nytimes',
		url: 'nytimes\.com\/section\/world$',
		crawlerFunction: crawlNytimes
	},
	{
		name: 'guardian_africa',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/africa$|theguardian\.com\/world\/africa.page=',
		crawlerFunction: crawlGuardian
	}
];