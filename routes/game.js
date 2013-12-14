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
		[null, null, null, null, null, null], /* Col. 1 */
		[null, null, null, null, null, null], /* Col. 2 */
		[null, null, null, null, null, null], /* Col. 3 */
		[null, null, null, null, null, null], /* Col. 4 */
		[null, null, null, null, null, null], /* Col. 5 */
		[null, null, null, null, null, null], /* Col. 6 */
		[null, null, null, null, null, null]  /* Col. 7 */
	];

	games[id] = data;

	res.json({id:id, data:data});

}