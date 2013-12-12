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
		[
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
		],
		[
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
		],
		[
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
		],
		[
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
		],
		[
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
		],
		[
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
			{
				team: "none"
			},
		],
	];

	games[id] = data;

	res.json({id:id, data:data});

}