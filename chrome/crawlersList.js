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
		url: 'theguardian\.com\/world\/africa[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_americas',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/americas[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_asia_pacific',
		alias: 'guardian',
		url: 'theguardian.com\/world\/asia\-pacific[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_asia_center',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/south\-and\-central\-asia[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_middleeast',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/middleeast[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_uk',
		alias: 'guardian',
		url: 'theguardian\.com\/politics[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_us',
		alias: 'guardian',
		url: 'theguardian\.com\/us\-news\/us\-politics[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_australia',
		alias: 'guardian',
		url: 'theguardian\.com\/australia\-news[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'guardian_europe',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/europe\-news[$|\?page=\d$]',
		crawlerFunction: crawlGuardian
	},
	{
		name: 'reuters',
		alias: 'reuters',
		url: 'reuters\.com\/myview\/all\/all\-entities$',
		crawlerFunction: crawlReuters
	},
	{
		name: '3dnews',
		alias: '3dnews',
		url: '3dnews\.ru\/news$',
		crawlerFunction: crawl3dnews
	}
];

