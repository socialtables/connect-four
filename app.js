
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var game = require('./routes/game');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');
// var sio = require('socket.io');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(lessMiddleware(__dirname + '/public', { force: true }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/new', game.new);
app.post('/:id', game.save);
app.get('/:id', game.detail);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// var data = [
// 		[null, null, null, null, null, null],
// 		[null, null, null, null, null, null],
// 		[null, null, null, null, null, null],
// 		[null, null, null, null, null, null],
// 		[null, null, null, null, null, null],
// 		[null, null, null, null, null, null],
// 		[null, null, null, null, null, null]
// 	];
// var player1Color = '#ff0000';
// var player2Color = '#00ff00';

// /**
//  * Socket.IO server (single process only)
//  */

// var io = sio.listen(server)
//   , websockets = {},
//   	player1,
//   	player2;
  	
// io.sockets.on('connection', function (socket) {

// 	console.log("CONNECT");
// 	if(player1 == null || player2 == null){


// 		if(player1 == null){
// 			player1 = socket;
// 			socket.emit('Color',player1Color);
// 		}else if(player2 == null){
// 			player2 = socket;
// 			socket.emit('Color',player2Color);
// 		}

// 		socket.on('playerMove', function(row, col, playerColor){

// 			data[row][col] = playerColor;

// 			if(socket == player1){
// 				if(player2)
// 					player2.emit('Opponent', row, col);
// 			}else{
// 				if(player1)
// 					player1.emit('Opponent', row, col);
// 			}

// 		});

// 		socket.on('disconnect', function () {

// 			socket.broadcast.emit('Closed');

// 			if(socket == player1)
// 				player1 = null;
// 			else
// 				player2 = null;
// 		});
//   	}
// });

//