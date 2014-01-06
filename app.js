
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./lib/routes');
var game = require('./lib/routes/game');
var http = require('http');
var path = require('path');

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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/new', game.new);
app.post('/save/:id', game.save);
app.get('/:id', game.detail);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.io for multiplayer games
var io = require("socket.io").listen(server);
var uuid = require("uuid");
var firstUserJoined = false;

io.sockets.on('connection', function(socket) {

	socket.on('createUser', function(username) {

		var newUserInfo = {
			id: uuid.v4(),
			name: username,
			type: _determinePlayerType()
		};

		firstUserJoined = true;

		socket.set('userInfo', newUserInfo, function() {
			socket.emit('userCreated', newUserInfo);
			// TODO: Find/assign an opponent
			socket.set('opponentInfo', opponentInfo, function() {
				socket.emit('opponentFound', {
					userInfo: {},
					opponentInfo: {},
					isStartingPlayer: {}
				});
			});
			
			socket.on('makeMove', function(data) {
				// TODO
				// Check data.newGameState to see new game state
				// Find out this player's opponent
				// emit an 'opponentMadeMove' message to this player's opponent
			});
		});

		function _determinePlayerType() {
			if(!firstUserJoined) {
				return 'red';
			} else {
				return 'black';
			}
		}

	}); //End of 'createUser' listener
}); //End of 'connection' listener