
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
var playersWaitingForOpponent = [];

io.sockets.on('connection', function(socket) {
	socket.on('createUser', function(username) {
		var newUserInfo = {
			id: uuid.v4(),
			name: username,
			type: _determinePlayerType()
		};

		playersWaitingForOpponent.push(socket);

		socket.set('userInfo', newUserInfo, function() {
			socket.emit('userCreated', newUserInfo);
			
			if(playersWaitingForOpponent.length === 2) {
				playersWaitingForOpponent.forEach(function(socket, index) {
					_emitOpponentFoundMessage(socket, index);
				});
			}
		});
	}); //End of 'createUser' listener
}); //End of 'connection' listener

/*******************

	  Helpers

********************/
function _emitOpponentFoundMessage(socket, index) {
	var opponentInfo = _findOpponentInfo(index);
	socket.set('opponentInfo', opponentInfo, function() {
		socket.emit('opponentFound', {
			userInfo: socket.get('userInfo'),
			opponentInfo: opponentInfo,
			isStartingPlayer: _isStartingPlayer(index)
		});

		_bindToMakeMoveEvent(socket, index);
	});
}

function _isStartingPlayer(index) {
	if(index === 0) {
		return true;
	} else {
		return false;
	}
}

function _findOpponentInfo(index) {
	var oppositePlayerIndex = 0; 
	if(index === 0) {
		oppositePlayerIndex = 1;
	}
	return playersWaitingForOpponent[oppositePlayerIndex];
}

function _bindToMakeMoveEvent(socket, index) {
	socket.on('makeMove', function(data) {
		socket.get('opponentInfo', function (err, opponentInfo) {
	     	
	    	// opponentSocket.emit('opponentMadeMove.' + opponentInfo.id, {
	     //  		lastInsertedChecker: data.lastInsertedChecker,
	     //  		newGameState: data.newGameState
	     //  	});
			console.log("DEBUG: Index is: " + index);
			if(index == 1) {
				playersWaitingForOpponent = []; 
			}
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