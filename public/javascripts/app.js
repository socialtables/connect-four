/**********************

	App Namespace

**********************/
var connectFourApp = angular.module('connectFourApp', []);

/**********************

	Services

**********************/
connectFourApp.constant('appContantValues', {
    gameStates: {
    	START: 0,
    	INPROGRESS: 1,
    	WINNER: 2,
    	DRAW: 3
    },
    playerTypes: {
    	RED: 4,
    	BLACK: 5
    }
});

connectFourApp.factory('GameSlotData', ['appContantValues', function(appContantValues) {

		function GameSlotData() {
			this._selectedPlayer = false;
		}

		Object.defineProperty(GameSlotData.prototype, "selectedPlayer", {
			get : function() { 
				return this._selectedPlayer;
			},
            set : function(newPlayerType) {
            	// TODO: Validate input
            	this._selectedPlayer = newPlayerType;
            }
        });

		return GameSlotData;
	}
]);

connectFourApp.factory('gameBoardData', ['appContantValues', function(appContantValues) {
		return {
			getData : function() {
				return data;
			}
		}
	}
]);

connectFourApp.factory('gameStateManager', ['appContantValues', function(appContantValues) {
		var currentState = appContantValues.gameStates.START;

		return {
			getCurrentState : function() {
				return currentState;
			}
		};
	}
]);

/**********************

	Resources

**********************/

/**********************

	Controllers

**********************/
connectFourApp.controller('GameBoardCtrl', ['$scope', 'gameStateManager', function($scope, gameStateManager) {
	$scope.data = [
		[{}, {}, {}, {}, {}, {}, {}], /* Col. 1 */
		[{}, {}, {}, {}, {}, {}, {}], /* Col. 2 */
		[{}, {}, {}, {}, {}, {}, {}], /* Col. 3 */
		[{}, {}, {}, {}, {}, {}, {}], /* Col. 4 */
		[{}, {}, {}, {}, {}, {}, {}], /* Col. 5 */
		[{}, {}, {}, {}, {}, {}, {}], /* Col. 6 */
		[{}, {}, {}, {}, {}, {}, {}]  /* Col. 7 */
	];

	$scope.selectSlot = function(clickedSlot) {
		var getCurrentPlayerType = gameStateManager.getCurrentPlayer;
		slot.selectedPlayer = getCurrentPlayerType;
	}

	$scope.isSlotSelected = function(slot) {
		if(slot.selectedPlayer) {
			return true;
		} else {
			return false;
		}
	}
}]);

connectFourApp.controller('GameInfoCtrl', ['$scope', 'gameStateManager', 'appContantValues', function($scope, gameStateManager, appContantValues) {
	$scope.startingPlayer = appContantValues.playerTypes.RED;

	$scope.$watch(gameStateManager.getCurrentState, function(newState, previousState) {
		console.log(newState);
		console.log(previousState);
	});
}]);