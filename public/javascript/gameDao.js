define('gameDao', ['jQuery', 'q'], function ($, Q) {
	function log(data) {
		console.log('Gamedao log');
		console.log(data);
		return data;
	}

	// TODO: QIFY!!!
	// TODO: Make it create DAOs!
	return {
		fetch: function (id) {
			return $.ajax({
				type: 'GET', 
				url: '/' + id
			})
			.then(log)
		},
		save: function(id, data) {
			return $.ajax({
				type: 'POST', 
				url: '/' + id
			})
			.then(log)
		},
		create: function() {
			return $.ajax({
				type: 'GET', 
				url: '/new'
			})
			.then(log)
		}
	}
})