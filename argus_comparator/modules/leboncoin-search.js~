var cherrio = require('cheerio');
var request = require('request');


/*
 Le bon coin Module
 */



module.exports = function (url, callback) {

	/*
		This section is commented because I wanted to use it so the user could on my website directly make its research
		Exactly like he would have done on leconboin, so he wouldn't have to switch site,
		process => fill the form => see all the boncoinresult with their average cote argus. 

		Due to a lack of time, for the moment he just put the search url in my website.

	var minPrice = 1;
	var maxPrice = 10;

	var minYear = 2011;
	var maxYear = 2015;

	var minKilometers = 0;
	var maxKilometers = 110000;

	var fuel = 1;
	var gearbox = 1;

	var url = 'http://www.leboncoin.fr/voitures/offres/ile_de_france/?f=a&th=1';

	if(params.minPrice || minPrice){url += '&ps=' + minPrice;}
	if(params.maxPrice || maxPrice){url += '&pe=' + maxPrice;}

	if(params.minYear || minYear){url += '&rs=' + minYear;}
	if(params.maxYear || maxYear){url += '&re=' + maxYear;}

	if(params.minKilometers || minKilometers){url += '&ms=' + minKilometers;}
	if(params.maxKilometers || maxKilometers){url += '&me=' + maxKilometers;}

	if(params.fuel || fuel){url += '&fu=' + fuel;}
	if(params.gearbox || gearbox){url += '&gb=' + gearbox;}*/


	console.log('leboncoinsearch ', url);

	request(url, function (err, res, body) {

		//if the url is not valid or the request not complete, send back an error
		if (err)
			return callback(err);

		var listUrl = [];

		var $ = cherrio.load(body);

		$(".list-lbc>a").each(function () {
			listUrl.push($(this).attr("href"));

		});

		callback(null, listUrl);
	});

}
