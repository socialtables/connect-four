require.config({
	paths: {
		knockout: './knockout-3.0.0'
	},
	shim: {
	    underscore: {
	      exports: '_'
	    },
	    stativus: {
	    	exports: 'Stativus'
	    }
	}
});

require(['q', 'knockout', 'game'],
	function (Q, ko, game) {
		Q.longStackSupport = true;

		game.begin();
	});
