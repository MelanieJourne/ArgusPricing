var request = require('request');
var cherrio = require('cheerio');

/*
 La Centrale Module
 */

module.exports = function (cardata, callback) {

	var centraleUrl = "http://www.lacentrale.fr/cote-voitures-"+cardata.marque+"-"+cardata.modele+"--"+cardata.annee+"-.html";
	centraleUrl = centraleUrl.replace('_','+');
	
	console.log('centraleUrl', centraleUrl);
	
	request(centraleUrl, function (err, res, body) {
		
		var cotes = [];
		var $ = cherrio.load(body);

		$('#listing_quot tr').each( function(){
			if(!$(this).attr("class") && !$(this).attr("id")){
				// try catch

				var href = $(this).find("td.tdSD.QuotMarque>a").attr("href");
				var name =  $(this).find("td.tdSD.QuotMarque>a").text().replace(/\r\n|\n|\r|\t|/g, '').toLowerCase();
				var nrj =  $(this).find("td.tdSD.QuotNrj").text().replace(/\r\n|\n|\r|\t| /g, '').toLowerCase();
				var power = $(this).find("td.tdSD.QuotPower").text().replace(/\r\n|\n|\r|\t| /g, '').toLowerCase();
				var boite = $(this).find("td.tdSD.QuotBoite").text().replace(/\r\n|\n|\r|\t| /g, '').toLowerCase();
				var doors = $(this).find("td.tdSD.QuotDoors").text().replace(/\r\n|\n|\r|\t| /g, '').toLowerCase();

				boite = boite === 'mécanique' ? 'manuelle' : 'automatique';

				if(cardata.vitesse === boite && nrj === cardata.nrj){

					cotes.push({
						name : name,
						href : href,
						nrj : nrj,
						power : power,
						boite : boite,
						doors : doors
					});
					console.log('cote ajoute');						
				}
			}

		});
		callback(null, cotes);
	});

}
