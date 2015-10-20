var request = require('request');
var cherrio = require('cheerio');

/*
 La Centrale Module-cote
 */

module.exports = function (href, callback) {

	var coteUrl = "http://www.lacentrale.fr/" + href;

	request(coteUrl, function (err, res, body) {
		var $ = cherrio.load(body);
		var cote1 = $(".Result_Cote").html().replace("&#x20AC;", "");
		var cote = cote1.replace(" ","");
		callback(null, cote);
	});
}
