var cherrio = require('cheerio');
var	request = require('request');
var	JSON5 = require('json5');

/*
    Le bon coin Module
 */

module.exports = function (url, callback) { 
 
	request(url, function(err, res, body){
		
		//if the url is not valid or the request not complete, send back an error
		if (err)
			return callback(err);
			
		//else : get the var in the page containing all the data
		var $ = cherrio.load(body);
		var utag_data = $("script:first-child").first().html();
		var ad =  $("#ad_subject").html();
		//and parse it into a json object
		utag_data = utag_data.replace("var utag_data = ", "");
		utag_data = JSON5.parse(utag_data);
		utag_data.ad = ad;
		//then send it back to the main program
		callback(null, utag_data);
	});
}
