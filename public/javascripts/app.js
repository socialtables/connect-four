/**********************

	App Namespace

**********************/
var connectFourApp = angular.module('connectFourApp', ['ngResource']);

/**********************

	Services

**********************/
connectFourApp.constant('appConstantValues', {
    gameStates: {
    	START: "START",
    	INPROGRESS: "INPROGRESS",
    	WINNER: "WINNER",
    	DRAW: "DRAW"
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

connectFourApp.factory('gameBoardData', ['appConstantValues', 'GameSlotData', function(appConstantValues, GameSlotData) {
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
				return appConstantValues.gameStates.INPROGRESS;
			},
			insertChecker: function(args) {
				_insertCheckerIntoColumn(args.player, args.columnIndex);
			}
		};

		function _transformIntoGameBoardData(serverData) {
			return serverData.map(function(column) {
				return column.map(function(slot) {
					return new GameSlotData();
				});
			})
		}

		function _insertCheckerIntoColumn(player, columnIndex) {
			var columnData = data[columnIndex];
		
			var firstEmptySlotInColumn = _.find(columnData, function(slot) {
				return !slot.selectedPlayer;
			});

			if(firstEmptySlotInColumn) {
				firstEmptySlotInColumn.selectedPlayer = player;
			}
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

	Filters

**********************/
connectFourApp.filter('reverse', function() {
  return function(array) {
    return array.slice().reverse();
  };
});

/**********************

	Controllers

**********************/
connectFourApp.controller('GameBoardCtrl', ['$scope', 'gameStateManager', 'gameBoardData', 'appConstantValues', function($scope, gameStateManager, gameBoardData, appConstantValues) {
		$scope.$watch(gameStateManager.getCurrentState, function(newState) {
			if(newState === appConstantValues.gameStates.INPROGRESS) {
				$scope.data = gameBoardData.getData();
			}
		});

		$scope.insertCheckerIntoColumn = function(colIndex) {
			var currentPlayer = gameStateManager.getCurrentPlayer();

			gameBoardData.insertChecker({
				player: currentPlayer,
				columnIndex: colIndex
			});
			gameStateManager.checkStateAndAdvanceGame();
		}

		$scope.isSlotSelected = function(slot) {
			if(slot.selectedPlayer) {
				return true;
			} else {
				return false;
			}
		}

		$scope.isSlotSelectedByRedPlayer = function(slot) {
			if(slot.selectedPlayer === appConstantValues.playerId.RED) {
				return true;
			} else {
				return false;
			}
		}

		$scope.isSlotSelectedByBlackPlayer = function(slot) {
			if(slot.selectedPlayer === appConstantValues.playerId.BLACK) {
				return true;
			} else {
				return false;
			}
		}
	}
]);

connectFourApp.controller('MenusSectionCtrl', ['$scope', 'gameStateManager', 'appConstantValues', function($scope, gameStateManager, appConstantValues) {
		$scope.showStartMenu = true;

		$scope.$watch(gameStateManager.getCurrentState, function(newState) {
			if(newState === appConstantValues.gameStates.INPROGRESS) {
				$scope.showStartMenu = false;
				$scope.showGameInfo = true;
			}
		});	
	}
]);

connectFourApp.controller('StartMenuCtrl', ['$scope', 'gameStateManager', 'appConstantValues', function($scope, gameStateManager, appConstantValues) {
		$scope.startingPlayer = appConstantValues.playerId.RED;

		$scope.start = function() {
			gameStateManager.startNewGame($scope.startingPlayer);
		}
	}
]);

connectFourApp.controller('GameInfoCtrl', ['$scope', 'gameStateManager', 'appConstantValues', function($scope, gameStateManager, appConstantValues) {
		/*
			TODO
		*/

		$scope.redPlayerScore = 0;
        $scope.blackPlayerScore = 0;
        $scope.numOfDraws = 0;
	}
]);