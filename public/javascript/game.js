define('game', ['knockout', 'jquery', 'q', 'underscore', 'stativus'], 
	function (ko, jquery, q, _, Stativus) {
		var sc, currentApplication;

		function updateViewModelState() {
			var gameState = currentApplication.gameState,
				arr = sc.currentState().reverse(),
				names = _.map(arr, function (m) {
					return m.name;
				});
			gameState.removeAll();

			_.each(names, function (name) {
				gameState.push(name);
			});
		}

		function log() { console.log.apply(console, arguments) }
		
		function begin() {
			// Make a fresh one
			sc = Stativus.createStatechart();
			applyBindings();

			// Add all the states
			sc.addState('chooseExistingOrNew', {
				enterState: function () {
					updateViewModelState();
				},
				chooseNew: function () {
					this.goToState('create_game');
				},
				chooseExisting: function () {
					this.goToState('load_game')
				}
			});
			sc.addState('create_game', {
				enterState: function () {
					updateViewModelState();
					$('#newGameName').focus();
				},
				beginGame: function (name) {
					newGame();
					this.goToState('game_run');
				}
			});
			sc.addState('load_game', {
				enterState: function () {
					updateViewModelState();
					log('loading')
				},
				beginGame: function () {
					this.goToState('game_run')
				}
			});
			sc.addState('game_run', {
				initialSubstate: 'running_begin',
				enterState: function () {
					updateViewModelState();
					log('Game Starting')
				},
				winner: function(who) {
					currentApplication.winner(who);
					this.goToState('game_over');
				},
				states: [
					{
						name: 'running_begin',
						enterState: function () {
							updateViewModelState();
							console.log('Black goes first');
							this.goToState('running_turn_black');
						}
					},
					{
						name: 'running_turn_black',
						enterState: function () {
							currentApplication.currentGame().applyGravity();
							currentApplication.currentGame().checkForWinner();
							updateViewModelState();
						},
						takeTurn: function () {
							this.goToState('running_turn_red')
						}
					},
					{
						name: 'running_turn_red',
						enterState: function () {
							currentApplication.currentGame().applyGravity();
							currentApplication.currentGame().checkForWinner();
							updateViewModelState();
						},
						takeTurn: function () {
							this.goToState('running_turn_black')
						}
					}
				]
				// TODO: Add substates to run the game
			});
			sc.addState('game_over', {
				enterState: function () {
					updateViewModelState();
					log('Game over')
				},
				replay: function () {
					this.goToState('chooseExistingOrNew')
				}
			});

			// Start the engine
			sc.initStates('chooseExistingOrNew');
			updateViewModelState();;
		}

		function Application() {
			var game = new Game(),
				application = this;

			_.extend(this, {
				gameState: ko.observableArray([]),
				gameEvent: trigger,
				winner: ko.observable(''),
				currentGame: ko.observable(game)
			});

			this.overallState = ko.computed(function () {
				return application.gameState()[0];
			});

			this.subState = ko.computed(function () {
				return application.gameState()[1];
			});
		}

		function Game() {
			this.rows = ko.observableArray([]);
			this.height = 6;
			this.width = 7;

			for (var i = 0; i < this.height; i++) {
				this.rows.push(new GameRow(this.width));
			}

			this.get = function(r, c) {
				return this.inbounds(r, c) && this.rows()[r].cells()[c];
			}

			this.inbounds = function(r, c) {
				return r >= 0 &&
						c >= 0 &&
						r < this.height &&
						c < this.width;
			}

			this.set = function (r, c, val) {
				this.rows()[r].cells()[c] = val;
			}

			this.applyGravity = function () {
				var rows = this.rows();

				for (var times = 0; times < rows.length; times++) {
					for (var i = rows.length - 1; i >= 0; i--) {
						_.each(rows[i].cells(), function (cell, c) {
							cell.applyGravity(i, c);
						});
					}
				}
			}

			this.checkForWinner = function () {
				var rows = this.rows();

				for (var r = 0; r < rows.length; r++) {
					var cells = rows[r].cells();

					for (var c = 0; c < cells.length; c++) {
						var winner = cells[c].checkForWinner(r, c);
						if (winner) {
							console.log("WINNER! " + winner)
							currentApplication.gameEvent('winner', winner);
						}
					}
				}

				console.log('everyon\'es a loser');
				return false;
			}
		}

		function GameRow(width) {
			this.cells = ko.observableArray([]);

			for (var i = 0; i < width; i++) {
				this.cells.push(new GameCell());
			}
		}

		function GameCell() {
			this.default = 'blank';
			this.value = ko.observable(this.default);
			this.place = function(row, cell) {
				var val = this.default,
					empty = this.value() == this.default;

				if ( ! empty) return;

				switch (currentApplication.subState()) {
					case 'running_turn_black':
						val = 'black';
						break;
					case 'running_turn_red':
						val = 'red';
				}

				this.value(val);
				currentApplication.gameEvent('takeTurn')
			}

			this.applyGravity = function(row, cell) {
				var below = row + 1,
					game = currentApplication.currentGame(),
					cellBelow = game.get(below, cell);

				if ( ! cellBelow) return;

				if (cellBelow.value() != this.default) return;

				cellBelow.value(this.value());
				this.value(this.default);
			}

			this.checkForWinner = function(row, cell) {
				var val = this.value(),
					game = currentApplication.currentGame(),
					isSame = function(r, c, expected) {
						var cell = game.get(r, c);

						if ( ! cell) return false;

						return cell.value() == expected;
					},				
					plus = function (a, b) { return a + b },
					minus = function (a, b) { return a - b },
					nada = function (a, b) { return a; },
					edgeTest = function(yFunc, xFunc) {
						var winningEdge = true;

						for (var i = 1; i < 4; i++) {
							winningEdge = winningEdge && 
								isSame(yFunc(row, i), xFunc(cell, i), val);
						}

						return winningEdge;
					};

				// Blanks definitely not a winner
				if (val == this.default) return;

					// Diagonal up left
				return ( edgeTest(minus, minus) ||
					// Diagonal down left		
					edgeTest(plus, minus) ||
					// Diagonal up right
					edgeTest(minus, plus) ||
					// Diagonal down right
					edgeTest(plus, plus) ||
					// Left
					edgeTest(nada, minus) ||
					// Right
					edgeTest(nada, plus) ||
					// Up
					edgeTest(minus, nada) ||
					// Down
					edgeTest(plus, nada) ) &&

					// and it's goooooood!!!
					val;
			}
		}

		function applyBindings() {
			currentApplication = new Application();
			ko.applyBindings(currentApplication);
		}

		function newGame() {
			currentApplication.currentGame(new Game());
		}

		function noop() {}
		function getStatechart() { return sc }
		function trigger(name) { 
			sc.sendEvent.apply(sc, arguments); 
		}
		function choose(which) {
			trigger('choose' + which)
		}

		return {
			getStatechart: getStatechart,
			begin: begin,
			trigger: trigger
		}
	});