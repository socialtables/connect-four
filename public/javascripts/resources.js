connectFourApp.factory('GameBoardResource', ['appConstantValues', '$resource', 
	function(appConstantValues, $resource) {
		
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