var uuid = require("uuid");
var games = {};

exports.save = function(req, res){
	if(games[req.params.id]){
		games[req.params.id] = req.body;
		console.log("server",req.body);
		console.log(games);
		res.send({gameId:req.params.id});
	}
	else{
		res.json(400, {"msg": "invalid id"});
	}
}

exports.detail = function(req, res){
	if(games[req.params.id]){
		res.send({"data":games[req.params.id]});
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