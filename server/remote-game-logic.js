var socketIO = require("socket.io");
var uuid = require("uuid");

var roomName = _generateRoomName();
var io;

exports.init = function(server) {
	io = socketIO.listen(server);
	_bindSocketEventHandlers();
}

/*******************

	  Helpers

********************/
function _bindSocketEventHandlers() {
	io.sockets.on('connection', function(socket) {
		socket.on('createUser', function(username) {
			var newUserInfo = {
				id: uuid.v4(),
				name: username,
				type: _determinePlayerType()
			};

			socket.set('userInfo', newUserInfo, function() {
				socket.emit('userCreated', newUserInfo);
				socket.join(roomName);
				var roomHasTwoPlayers = io.sockets.clients(roomName).length === 2;
				if(roomHasTwoPlayers) {
					_matchupPlayersInRoom(roomName);
					roomName = _generateRoomName();
				}
			});
		}); //End of 'createUser' listener
	}); //End of 'connection' listener
}

function _generateRoomName() {
	return 'room.' + uuid.v4();
}

function _matchupPlayersInRoom(roomName) {
	var playersInRoom = io.sockets.clients(roomName);

	playersInRoom.forEach(function(socket, index) {
		socket.set('roomName', roomName, function() {			
			socket.get('userInfo', function(err, userInfo) {
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
			fnHasNotBeenInvoked = true;
			return 'black';
		}
	}
})();