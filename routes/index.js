var views = require('../views'),
    config = require('../config');

/*
 * GET home page.
 */

exports.index = function(req,res) {
  res.send( views.index({
    title: 'Connect 4',
    menu: config.mainMenu,
    players: config.players
  }));
};
