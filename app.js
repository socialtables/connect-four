
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

io.sockets.on('connection', function(socket) {
	socket.on('createUser', function(username) {
		var newUserInfo = {
			id: uuid.v4(),
			name: username,
			type: _determinePlayerType()
		};

		socket.set('userInfo', newUserInfo, function() {
			socket.emit('userCreated', newUserInfo);
			//TODO: var roomName = generateRoomName();
			var roomName = 'room0';
			socket.join(roomName);

			var roomHasTwoPlayers = io.sockets.clients(roomName).length === 2;
			if(roomHasTwoPlayers) {
				_matchupPlayersInRoom(roomName);
			}
		});
	}); //End of 'createUser' listener
}); //End of 'connection' listener

/*******************

	  Helpers

********************/
function _matchupPlayersInRoom(roomName) {
	var playersInRoom = io.sockets.clients(roomName);

	playersInRoom.forEach(function(socket, index) {
		socket.set('roomName', roomName, function() {			
			socket.get('userInfo', function(err, userInfo) {
				console.log("Dat user info: " + userInfo);
				var opponentSocket = _getOpponentSocket(playersInRoom, index);
				opponentSocket.get('userInfo', function(err, opponentInfo) {
					_sendOpponentFoundMessage(socket, index, userInfo, opponentInfo);
					_bindToMakeMoveEvent(socket, index);
				});
			});
		});
	});
}

function _isStartingPlayer(index) {
	if(index === 0) {
		return true;
	} else {
		return false;
	}
}

function _sendOpponentFoundMessage(socket, index, userInfo, opponentInfo) {
	socket.emit('opponentFound', {
		userInfo: userInfo,
		opponentInfo: opponentInfo,
		isStartingPlayer: _isStartingPlayer(index)
	});
}

function _getOpponentSocket(playersInRoom, playerIndex) {
	var oppositePlayerIndex = 0; 
	if(playerIndex === 0) {
		oppositePlayerIndex = 1;
	}
	return playersInRoom[oppositePlayerIndex];
}

function _bindToMakeMoveEvent(socket, index) {
	socket.on('makeMove', function(data) {
		socket.get('roomName', function (err, roomName) {
	    	socket.broadcast.to(roomName).emit('opponentMadeMove', {
	      		lastInsertedChecker: data.lastInsertedChecker,
	      		newGameState: data.newGameState
	      	});
	    });
	});
}

var _determinePlayerType = (function() {
	var fnHasNotBeenInvoked = true;

	return function() {

		if(fnHasNotBeenInvoked) {
			fnHasNotBeenInvoked = false;
			return 'red';
		} else {
			fnHasNotBeenInvoked = true
			return 'black';
		}
	}
})();