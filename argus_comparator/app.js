var app = require('express')();
/*
 Static
 */
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname + '/public'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var sync = require('synchronize');
var fiber = sync.fiber;
var await = sync.await;
var defer = sync.defer;


/*
	Modules
 */

var lacentrale = require('./modules/lacentrale.js');
var lacentraleCote = require('./modules/lacentrale-cote.js');
var leboncoinCar = require('./modules/leboncoin-car.js');
var leboncoinSearch = require('./modules/leboncoin-search.js');

app.get('/', function(req, res){
	res.sendfile('index.html');
});
app.get('/search', function(req, res){
	res.sendfile('searchleboncoin.html');
});

app.get('/vue.js', function(req, res){
	res.sendfile(__dirname + '/node_modules/vue/dist/vue.min.js');
});

var users = [];

io.on('connection', function(socket){
	console.log(users);
	users.push({id : socket.id});

	socket.on('disconnect', function(){
		for(var i in users){
			if(users[i].id === socket.id){
				users = users.slice(i);
			}
		}
	});

	socket.on('search url', function(url){
		console.log('message: ' + url);
		var sumCote = 0;
		fiber(function () {

			try{

				var car = await(leboncoinCar(url, defer()));
				car.deal = 'Please wait';
				console.log('car found');
				io.to(socket.id).emit('showcar', car);

				car.cotes = await(lacentrale(car, defer()));
				io.to(socket.id).emit('showcar', car);
				for(var i in car.cotes){

					var cote = await(lacentraleCote(car.cotes[i].href,defer()));
					car.cotes[i].price = cote;
					sumCote = parseInt(sumCote) + parseInt(cote);
					console.log('one cote found');
					io.to(socket.id).emit('showcar', car);

				}
				car.average = parseInt( parseInt(sumCote)/car.cotes.length);
				if(parseInt(car.average) > parseInt(car.prix)){
				car.deal = 'It is a good deal';}else{
				car.deal = 'It is not a good deal';}
				io.to(socket.id).emit('showcar', car);
				console.log('all cotes found for this car');
			}catch(e){
				
			}
		});

	});

	socket.on('search car', function(url){
		//console.log('in search car');
		var sumCote;
		fiber(function () {

			try{
				var cars = await(leboncoinSearch(url, defer()));
				console.log('cars');
				for(var i in cars){
					sumCote = 0;	
					var car = await(leboncoinCar(cars[i], defer()));
					car.url = cars[i];
					console.log('one car found ');
					car.cotes = await(lacentrale(car, defer()));

					for(var j in car.cotes){

						var cote = await(lacentraleCote(car.cotes[j].href,defer()));
						car.cotes[j].price = cote;
						sumCote = parseInt(sumCote) + parseInt(cote);
						console.log('one cote found');

					}
					console.log('all cotes found for this car');
					car.average = parseInt( parseInt(sumCote)/car.cotes.length);
					if(parseInt(car.average) > parseInt(car.prix)){
					car.deal = 'yes';}else{	car.deal = 'no';}
					cars[i] = car;
					io.to(socket.id).emit('showcar', car);
					
				}
			}catch(e){}
		});

	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

