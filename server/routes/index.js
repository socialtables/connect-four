
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
  	title: 'Connect 4',
  	description: 'This is a super cool Connect 4 game!',
  	author: 'Rohit Kalkur'
  });
};