connectFourApp.constant('appConstantValues', {
    gameStates: {
    	START: "START",
    	INPROGRESS: "INPROGRESS",
    	WINNER: "WINNER",
    	DRAW: "DRAW",
    	RESTART: "RESTART"
    },
    playerType: {
    	RED: "red",
    	BLACK: "black"
    }
});


connectFourApp.factory('GameSlotData', ['appConstantValues', 
	function(appConstantValues) {

		function GameSlotData() {
			this.selectedPlayer = null;
			this.isWinningSlot = false;
		}

		return GameSlotData;
	}
]);


connectFourApp.factory('gameBoardClientSideModel', ['appConstantValues', 'GameSlotData', 
	function(appConstantValues, GameSlotData) {
		
		var id;
		var serverData;
		var gameBoardData;
		var recentCheckerPos;
		var recentCheckerPlayer;
		var remainingSlots;
		var numColumns;
		var numRows;

		return {
			get id() {
				return id;
			},
			get gameBoardData() {
				// NOTE: Returns representation of game board data used on the client-side
				return gameBoardData;
			},
			get serverData() {
				// NOTE: Returns representation of game board data used to persist to the server-side
				return serverData;
			},
			reset: function(serverResponse) {
				id = serverResponse.id;
				serverData = serverResponse.data;
				gameBoardData = _transformIntoGameBoardData(serverResponse.data);
				recentCheckerPos = {
					column: null,
					row: null
				};
				recentCheckerPlayer = null;
				numColumns = serverData.length;
				numRows = serverData[0].length;
				remainingSlots = numColumns * numRows;
			},
			determineState: function() {
				return _determineGameState();
			},
			insertChecker: function(args) {
				recentCheckerPlayer = args.playerType;

				var checkerInserted = _insertCheckerIntoColumn(args.playerType, args.columnIndex);
				_updateNewCheckerPositionInServerData(args.playerType, args.columnIndex);

				return checkerInserted;
			}
		};

		function _transformIntoGameBoardData(rawData) {
			return rawData.map(function(column) {
				return column.map(function(slot) {
					return new GameSlotData();
				});
			})
		}

		function _insertCheckerIntoColumn(playerType, columnIndex) {
			var columnData = gameBoardData[columnIndex];
			recentCheckerPos.column = columnIndex;

			var firstEmptySlotInColumn = _.find(columnData, function(slot, index) {
				var isEmptySlot = !slot.selectedPlayer;

				if(isEmptySlot) {
					recentCheckerPos.row = index;
				}
				return isEmptySlot;
			});

			if(firstEmptySlotInColumn) {
				firstEmptySlotInColumn.selectedPlayer = playerType;
				remainingSlots--;
				return true;
			} else {
				return false;
			}
		}

		function _updateNewCheckerPositionInServerData(playerType, columnIndex) {
			var columnData = serverData[columnIndex];
	
			_.every(columnData, function(slot, index) {
				if(slot === null) {
					columnData[index] = playerType;
					return false;
				}
				return true;
			});
		}

		function _determineGameState() {
			/* 
				TODO: Refactor this code to make it purty
			*/

			var recentRow = recentCheckerPos.row;
			var recentCol = recentCheckerPos.column;

			var oneSpotAboveRecentRow = recentRow + 1;
			var oneSpotBelowRecentRow = recentRow - 1;
			var oneSpotLeftOfRecentCol = recentCol - 1;
			var oneSpotRightOfRecentCol = recentCol + 1;

			var fourSpotsAboveRecentRow = recentRow + 4;
			var fourSpotsBelowRecentRow = recentRow - 4;
			var fourSpotsRightOfRecentCol = recentCol + 4;
			var fourSpotsLeftOfRecentCol = recentCol - 4;

			var row;
			var col;
			var slot;
			var failures;
			var counter;

			var recentSlot = gameBoardData[recentCol][recentRow];
			var winningSlots = [];
			winningSlots.push(recentSlot);

			// Top-to-Bottom Check
			for(row = oneSpotBelowRecentRow; row > fourSpotsBelowRecentRow && row >= 0; row--) {
				slot = gameBoardData[recentCol][row];
				if(slot) {
					if(slot.selectedPlayer === recentCheckerPlayer) {
						winningSlots.push(slot);
					} else {
						break;
					}
				} else {
					break
				}
			}

			if(row === fourSpotsBelowRecentRow) { 
				_markWinningSlots(winningSlots);
				return appConstantValues.gameStates.WINNER; 
			} else {
				winningSlots.splice(1, 3);
			}
			
			// Left-to-Right Check
			failures = 0;
			counter = 3;
			
			col = oneSpotLeftOfRecentCol;

			while(counter > 0 && failures < 2) {
				columnData = gameBoardData[col];
				
				if(columnData) {
					slot = columnData[recentRow];
				} else {
					slot = null;
				}

				if(slot) {
					if(slot.selectedPlayer === recentCheckerPlayer) {
						winningSlots.push(slot);

						counter--;
						if(col < recentCol) {
							col--;
						} else {
							col++;
						}
					} else {
						col = oneSpotRightOfRecentCol;
						failures++;
					}
				} else {
					col = oneSpotRightOfRecentCol;
					failures++;
				}
			}

			if(counter === 0) {
				_markWinningSlots(winningSlots);
				return appConstantValues.gameStates.WINNER; 
			} else {
				winningSlots.splice(1, 3);
			}

			// Top Left-to-Bottom Right Check
			failures = 0;
			counter = 3;
			
			col = oneSpotLeftOfRecentCol;
			row = oneSpotAboveRecentRow;

			while(counter > 0 && failures < 2) {
				columnData = gameBoardData[col];
				
				if(columnData) {
					slot = columnData[row];
				} else {
					slot = null;
				}

				if(slot) {
					if(slot.selectedPlayer === recentCheckerPlayer) {
						winningSlots.push(slot);

						counter--;
						if(col < recentCol) {
							col--;
							row++;
						} else {
							col++;
							row--;
						}
					} else {
						col = oneSpotRightOfRecentCol;
						row = oneSpotBelowRecentRow;
						failures++;
					}
				} else {
					col = oneSpotRightOfRecentCol;
					row = oneSpotBelowRecentRow;
					failures++;
				}
			}

			if(counter === 0) {
				_markWinningSlots(winningSlots);
				return appConstantValues.gameStates.WINNER; 
			} else {
				winningSlots.splice(1, 3);
			}

			// Bottom Left-to-Top Right Check
			failures = 0;
			counter = 3;
			
			col = oneSpotLeftOfRecentCol;
			row = oneSpotBelowRecentRow;

			while(counter > 0 && failures < 2) {
				columnData = gameBoardData[col];
				
				if(columnData) {
					slot = columnData[row];
				} else {
					slot = null;
				}

				if(slot) {
					if(slot.selectedPlayer === recentCheckerPlayer) {
						winningSlots.push(slot);

						counter--;
						if(col < recentCol) {
							col--;
							row--;
						} else {
							col++;
							row++;
						}
					} else {
						col = oneSpotRightOfRecentCol;
						row = oneSpotAboveRecentRow;
						failures++;
					}
				} else {
					col = oneSpotRightOfRecentCol;
					row = oneSpotAboveRecentRow;
					failures++;
				}
			}

			if(counter === 0) {
				_markWinningSlots(winningSlots);
				return appConstantValues.gameStates.WINNER; 
			} else {
				winningSlots.splice(1, 3);
			}
	
			// Draw Check
			if(remainingSlots === 0) {
				return appConstantValues.gameStates.DRAW;
			}

			return appConstantValues.gameStates.INPROGRESS;			
		}

		function _markWinningSlots(winningSlots) {
			winningSlots.forEach(function(slot) {
				slot.isWinningSlot = true;
			});
		}
	}
]);


connectFourApp.factory('gameStateManager', ['appConstantValues', 'GameBoardResource', 'gameBoardClientSideModel', 
	function(appConstantValues, GameBoardResource, gameBoardClientSideModel) {
		
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

				currentState = appConstantValues.gameStates.RESTART;
				this.startNewGame({
					startingPlayer: oppositePlayerType
				});
			},
			startNewGame: function(args) {
				currentPlayer.type = args.startingPlayer;
				GameBoardResource.create().$promise
					.then(function(response) {
						gameBoardClientSideModel.reset(response);
						currentState = appConstantValues.gameStates.INPROGRESS;
					});
			},
			checkStateAndAdvanceGame: function() {
				GameBoardResource.update({ id: gameBoardClientSideModel.id }, gameBoardClientSideModel.serverData);
				currentState = gameBoardClientSideModel.determineState();
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