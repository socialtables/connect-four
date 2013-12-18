define('game', ['knockout', 'jquery', 'q', 'underscore', 'stativus'], 
	function (knockout, jquery, q, _, Stativus) {
		var sc;

		function updateViewModelState() {
			var currentStateName = sc.currentState()[0].name;
			log(currentStateName);
			viewModel.setGameState(currentStateName);
		}

		function log() { console.log.apply(console, arguments) }
		
		function begin() {
			applyBindings();
			// Make a fresh one
			sc = Stativus.createStatechart();

			// Add all the states
			sc.addState('chooseExistingOrNew', {
				enterState: function () {
					updateViewModelState()
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
					createAndLoadGame(name);
					this.goToState('game_run');
				}
			});
			sc.addState('load_game', {
				enterState: function () {
					updateViewModelState()
					log('loading')
				},
				beginGame: function () {
					this.goToState('game_run')
				}
			});
			sc.addState('game_run', {
				enterState: function () {
					updateViewModelState()
					log('Game Starting')
				}
				// TODO: Add substates to run the game
			});
			sc.addState('game_over', {
				enterState: function () {
					updateViewModelState()
					log('Game over')
				},
				replay: function () {
					this.goToState('chooseExistingOrNew')
				}
			});

			// Start the engine
			sc.initStates('chooseExistingOrNew');
		}

		function setGameState(name) {
			currentGame.gameState(name);
		}

		function Application() {
			_.extend(this, {
				gameState: ko.observable(),
				choose: choose
			});
		}

		function applyBindings() {
			currentGame = new Application();
			ko.applyBindings(currentGame);
		}

		function getStatechart() { return sc }
		function trigger(name) { sc.sendEvent.apply(sc, arguments); }
		function choose(which) {
			trigger('choose' + which)
		}

		return {
			getStatechart: getStatechart,
			begin: begin,
			trigger: trigger
		}
	});