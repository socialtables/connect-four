define('gameStatechart', ['knockout', 'jquery', 'q', 'underscore', 'stativus'], 
	function (ko, jquery, q, _, Stativus) {
		var sc;

		function begin() {
			// Make a fresh one
			sc = Stativus.createStatechart();

			// Add all the states
			sc.addState('chooseExistingOrNew', {
				enterState: function () {
					//TODO
				},
				chooseNew: function () {
					this.goToState('new_game', {name: 'NEW GAME NAME'});
				}
			});
			sc.addState('new_game', {
				enterState: function () {
					alert(this.getData('name'))
				}
			});
			sc.addState('third_state', {
				enterState: function () {
					//TODO
				}
			});

			// Start the engine
			sc.initStates('chooseExistingOrNew');
		}

		function getStatechart() { return sc }
		function trigger() { sc.sendEvent.apply(sc, arguments); }

		return {
			sc: getStatechart,
			begin: begin,
			trigger: trigger
		}
	});