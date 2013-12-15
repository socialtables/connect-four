/**********************

	App Namespace

**********************/
var connectFourApp = angular.module('connectFourApp', ['ngResource']);

/**********************

	Services

**********************/
connectFourApp.constant('appConstantValues', {
    gameStates: {
    	START: 0,
    	INPROGRESS: 1,
    	WINNER: 2,
    	DRAW: 3
    },
    playerId: {
    	RED: "red",
    	BLACK: "black"
    }
});

connectFourApp.factory('GameSlotData', ['appConstantValues', function(appConstantValues) {

		function GameSlotData() {
			this._selectedPlayer = null;
		}

		Object.defineProperty(GameSlotData.prototype, "selectedPlayer", {
			get: function() { 
				return this._selectedPlayer;
			},
            set: function(newPlayer) {
            	this._selectedPlayer = newPlayer;
            }
        });

		return GameSlotData;
	}
]);

connectFourApp.factory('gameBoardData', ['appConstantValues', 'GameSlotData', 'gameStates', function(appConstantValues, GameSlotData, gameStates) {
		var data;

		return {
			getData: function() {
				return data;
			},
			reset: function(serverData) {
				data = _transformIntoGameBoardData(serverData);
			},
			determineState: function() {
				/* TODO */
			}
		};

		function _transformIntoGameBoardData(serverData) {
			return serverData.map(function(column) {
				return column.map(function(slot) {
					return new GameSlotData();
				});
			})
		}
	}
]);

connectFourApp.factory('gameStateManager', ['appConstantValues', 'GameBoardResource', 'gameBoardData', function(appConstantValues, GameBoardResource, gameBoardData) {
		var currentState = appConstantValues.gameStates.START,
			currentPlayer = null;

		return {
			getCurrentState: function() {
				return currentState;
			},
			getCurrentPlayer: function() {
				return currentPlayer;
			},
			startNewGame: function(startingPlayer) {
				currentPlayer = startingPlayer;
				GameBoardResource.create().$promise
					.then(function(response) {
						gameBoardData.reset(response.data);
						currentState = appConstantValues.gameStates.INPROGRESS;
					});
			},
			checkStateAndAdvanceGame: function() {
				/*
				 TODO: 
				 - Persist the GameBoardResource
				*/
				currentState = gameBoardData.determineState();
				if(currentState === appConstantValues.gameStates.INPROGRESS) {
					_toggleCurrentPlayer();
				};
			}
		};

		function _toggleCurrentPlayer() {
			if(currentPlayer === appConstantValues.playerId.RED) {
				currentPlayer = appConstantValues.playerId.BLACK;
			} else {
				currentPlayer = appConstantValues.playerId.RED;
			}
		}
	}
]);

/**********************

	Resources

**********************/
connectFourApp.factory('GameBoardResource', ['appConstantValues', '$resource', function(appConstantValues, $resource) {
		var customResourceActions = { 
			update: {
				url: '/save/:id',
				method: 'POST'
			},
			create: {
				url: '/new',
				method: 'GET'	
			}
		};

		return $resource('/:id', { id:'@id'}, customResourceActions);
 	}
]);

/**********************

	Controllers

**********************/
connectFourApp.controller('GameBoardCtrl', ['$scope', 'gameStateManager', 'gameBoardData', function($scope, gameStateManager, gameBoardData) {
	$scope.data = gameBoardData.getData();

	$scope.selectSlot = function(clickedSlot) {
		var getCurrentPlayer = gameStateManager.getCurrentPlayer();
		clickedSlot.selectedPlayer = getCurrentPlayer;
		gameStateManager.checkStateAndAdvanceGame();
	}

	$scope.isSlotSelected = function(slot) {
		if(slot.selectedPlayer) {
			return true;
		} else {
			return false;
		}
	}
}]);

connectFourApp.controller('GameMenusSectionCtrl', ['$scope', function($scope) {
	console.log("launching GameMenusSectionCtrl")
}]);

connectFourApp.controller('StartMenuCtrl', ['$scope', 'gameStateManager', 'appConstantValues', function($scope, gameStateManager, appConstantValues) {
		$scope.startingPlayer = appConstantValues.playerId.RED;

		$scope.start = function() {
			gameStateManager.startNewGame($scope.startingPlayer);
		}
	}
]);