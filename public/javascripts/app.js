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
    playerType: {
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
            set: function(newPlayerType) {
            	this._selectedPlayer = newPlayerType;
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
				return appConstantValues.gameStates.DRAW;
			},
			insertChecker: function(args) {
				_insertCheckerIntoColumn(args.playerType, args.columnIndex);
			}
		};

		function _transformIntoGameBoardData(serverData) {
			return serverData.map(function(column) {
				return column.map(function(slot) {
					return new GameSlotData();
				});
			})
		}

		function _insertCheckerIntoColumn(playerType, columnIndex) {
			var columnData = data[columnIndex];
		
			var firstEmptySlotInColumn = _.find(columnData, function(slot) {
				return !slot.selectedPlayer;
			});

			if(firstEmptySlotInColumn) {
				firstEmptySlotInColumn.selectedPlayer = playerType;
			}
		}
	}
]);

connectFourApp.factory('gameStateManager', ['appConstantValues', 'GameBoardResource', 'gameBoardData', function(appConstantValues, GameBoardResource, gameBoardData) {
		var currentState = appConstantValues.gameStates.START;
		var currentPlayer = { // NOTE: Making 'currentPlayer' an object in order to take advantage of Angular's two-way data binding feature
			type: null
		};

		return {
			getCurrentState: function() {
				return currentState;
			},
			getCurrentPlayer: function() {
				return currentPlayer;
			},
			restartGame: function() {
				var oppositePlayerType = _getOppositePlayerType(currentPlayer.type);
				
				this.startNewGame({
					startingPlayer: oppositePlayerType
				});
			},
			startNewGame: function(args) {
				currentPlayer.type = args.startingPlayer;
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
			currentPlayer.type = _getOppositePlayerType(currentPlayer.type);
		}

		function _getOppositePlayerType(playerType) {
			if(playerType === appConstantValues.playerType.RED) {
				return appConstantValues.playerType.BLACK;
			} else {
				return appConstantValues.playerType.RED;
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
			$scope.data = gameBoardData.getData();
		});

		$scope.insertCheckerIntoColumn = function(colIndex) {
			var gameState = gameStateManager.getCurrentState();

			if(gameState === appConstantValues.gameStates.INPROGRESS) {
				var currentPlayer = gameStateManager.getCurrentPlayer();

				gameBoardData.insertChecker({
					playerType: currentPlayer.type,
					columnIndex: colIndex
				});
				gameStateManager.checkStateAndAdvanceGame();
			}
		}

		$scope.isSlotSelected = function(slot) {
			if(slot.selectedPlayer) {
				return true;
			} else {
				return false;
			}
		}

		$scope.isSlotSelectedByRedPlayer = function(slot) {
			if(slot.selectedPlayer === appConstantValues.playerType.RED) {
				return true;
			} else {
				return false;
			}
		}

		$scope.isSlotSelectedByBlackPlayer = function(slot) {
			if(slot.selectedPlayer === appConstantValues.playerType.BLACK) {
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
		$scope.firstPlayer = appConstantValues.playerType.RED;
		$scope.secondPlayer = appConstantValues.playerType.BLACK;
		$scope.startingPlayer = appConstantValues.playerType.RED; // NOTE: Red player set to start by default but can be toggled

		$scope.start = function() {
			gameStateManager.startNewGame({
				startingPlayer: $scope.startingPlayer
			});
		}
	}
]);

connectFourApp.controller('GameInfoCtrl', ['$scope', 'gameStateManager', 'appConstantValues', function($scope, gameStateManager, appConstantValues) {
		$scope.currentPlayer = gameStateManager.getCurrentPlayer();

		$scope.redPlayerScore = 0;
        $scope.blackPlayerScore = 0;
        $scope.numOfDraws = 0;

		$scope.$watch(gameStateManager.getCurrentState, function(newState) {
			if(newState === appConstantValues.gameStates.WINNER) {
				$scope.winner = $scope.currentPlayer.type;
				_updateWinnersScoreOnScope();
			} else if(newState === appConstantValues.gameStates.DRAW) {
				$scope.isDraw = true;
				$scope.numOfDraws++;
			} else {
				// Default case
			}
		});

		$scope.restart = function() {
			$scope.isDraw = false;

			gameStateManager.restartGame();
		}

		$scope.playAgain = function(winner) {
			$scope.winner = null;

			gameStateManager.startNewGame({
				startingPlayer: winner
			});	
		}

		function _updateWinnersScoreOnScope() {
			if($scope.winner === appConstantValues.playerType.RED) {
				$scope.redPlayerScore++;
			} else {
				$scope.blackPlayerScore++;
			}
		}
	}
]);