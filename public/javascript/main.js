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

require(['q', 'knockout', 'gameStatechart'], function (Q, ko, gameStatechart) {
	console.log(ko);
	Q.longStackSupport = true;

	gameStatechart.begin();
});
