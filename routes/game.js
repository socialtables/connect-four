var uuid = require("uuid");
var games = {};

exports.save = function(req, res){
	if(games[req.params.id]){
		games[req.params.id] = req.body;
		res.json({"msg":"saved"});
	}
	else{
		res.json(400, {"msg": "invalid id"});
	}
}

exports.detail = function(req, res){
	if(games[req.params.id]){
		res.json({"data":games[req.params.id]});
	}
	else{
		res.json(400, {"msg": "invalid id"});
	}
}

exports.new = function(req, res){
	var id = uuid.v4();
	
	var data = [
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null]
	];

	games[id] = data;

	res.json({id:id, data:data});


}

exports.validate = function(req, res){
	var board = req.body;
	var valid = true;

	if(gravityMissing(board) == true){
		valid = false;
		console.log("gravityMissing") 
	}

	if(wrongPlays(board) == true){
		valid = false;
	}


	if(valid == true){
		res.json(200, {"msg": "Board is valid!"})
	} else{
		res.json(200, {"msg": "This board is messed up!"})
	}

}

gravityMissing = function(board){
	var mustHavePiece = false;
	var gravity = true
	console.log("gravityMissing started")
	board.forEach(function(row) {
		row.forEach(function(space) {
			console.log(space)
			console.log(mustHavePiece)
			if(mustHavePiece == true && space == null){
				gravity = false;
			}

			if(space != null){
				mustHavePiece = true;
			}
		})
		mustHavePiece = false;
	})

	if(gravity == false){
		return true;
	}else{
		return false;
	}
}

wrongPlays = function(board){
	var player1count = 0;
	var player2count = 0;

	board.forEach(function(row) {
		row.forEach(function(space) {
			if(space == 1){
				player1count++
			} else if(space == 2)
				player2count++
		})
	});

	if(player1count - player2count > 1) {return true;}
	if(player1count - player2count < 0) {return true;}
	return false
}
