let crawlersList = [
	{
		name: 'interfax',
		alias: 'interfax',
		url: 'interfax\.ru\/$',
		function: crawlInterfax
	},
	{
		name: 'tass_world',
		alias: 'tass',
		url: 'tass\.ru\/mezhdunarodnaya-panorama$',
		function: crawlTass
	},
	{
		name: 'tass_politics',
		alias: 'tass',
		url: 'tass\.ru\/politika$',
		function: crawlTass
	},
	{
		name: 'tass_society',
		alias: 'tass',
		url: 'tass\.ru\/obschestvo$',
		function: crawlTass
	},
	{
		name: 'tass_economy',
		alias: 'tass',
		url: 'tass\.ru\/ekonomika$',
		function: crawlTass
	},
	{
		name: 'aljazeera',
		alias: 'aljazeera',
		url: 'aljazeera\.com\/news\/$',
		function: crawlAljazeera
	},
	{
		name: 'nytimes',
		alias: 'nytimes',
		url: 'nytimes\.com\/section\/world$',
		function: crawlNytimes
	},
	{
		name: 'guardian_africa',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/africa$',
		function: crawlGuardian
	},
	{
		name: 'guardian_americas',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/americas$',
		function: crawlGuardian
	},
	{
		name: 'guardian_asia_pacific',
		alias: 'guardian',
		url: 'theguardian.com\/world\/asia\-pacific$',
		function: crawlGuardian
	},
	{
		name: 'guardian_asia_center',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/south\-and\-central\-asia$',
		function: crawlGuardian
	},
	{
		name: 'guardian_middleeast',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/middleeast$',
		function: crawlGuardian
	},
	{
		name: 'guardian_uk',
		alias: 'guardian',
		url: 'theguardian\.com\/politics$',
		function: crawlGuardian
	},
	{
		name: 'guardian_us',
		alias: 'guardian',
		url: 'theguardian\.com\/us\-news\/us\-politics$',
		function: crawlGuardian
	},
	{
		name: 'guardian_australia',
		alias: 'guardian',
		url: 'theguardian\.com\/australia\-news$',
		function: crawlGuardian
	},
	{
		name: 'guardian_europe',
		alias: 'guardian',
		url: 'theguardian\.com\/world\/europe\-news$',
		function: crawlGuardian
	},
	{
		name: 'reuters',
		alias: 'reuters',
		url: 'reuters\.com\/myview\/all\/all\-entities$',
		function: crawlReuters
	}
];