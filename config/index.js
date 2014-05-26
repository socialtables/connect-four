exports.mainMenu = [{
  click: 'startNewGame',
  enable: '(currentGame() == null)',
  button: 'success',
  label: 'New Game'
},{
  click: 'saveGame',
  enable: 'currentGame',
  button: 'default',
  label: 'Save Game'
},{
  click: 'quitGame',
  enable: 'currentGame',
  button: 'alert',
  label: 'Quit Game'
}];


exports.players = [{
  id: [1, 'One'],
  label: 'Player One'
}, {
  id: [2, 'Two'],
  label: 'Player Two'
}];

