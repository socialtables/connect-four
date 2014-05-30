var h = require('hoquet'),
    util = require('util');

module.exports = function(context) {
  return h.doc('html5', [
    'html',
    head(context.title),
    body(context)
  ]);
};

function head(title) {
  return [
    'head',
    ['meta', { charset: 'utf-8' }],
    ['meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0'
    }],
    ['title', title],
    h.styles('stylesheets/animate.css',
             'stylesheets/grid.css',
             'stylesheets/style.css'),
    h.scripts('js/vendor/modernizr.js')
  ]
}

function body(context) {
  return [
    'body',
    notifications(),
    ['div', { class: 'container animated fadeInDown' },
      title(context.title),
      menu(context.menu),
      form(context.players),
      ['div', { class: 'row' },
        instructions(),
        grid()
      ],
      js()
    ]
  ];
}

function js() {
  return h.scripts(
    'js/vendor/jquery.js',
    'js/vendor/jquery.easyModal.js',
    'js/vendor/underscore.js',
    'js/vendor/knockout.js',
    'js/vendor/smooth-scroll.js',
    'js/connect-four/utils.js',
    'js/connect-four/bindings.js',
    'js/connect-four/main.js'
  ) + h.render(['script', { type: 'text/javascript' },
    String(inlineJs), ';inlineJs();'
  ]);
}

function inlineJs() {
  ko.applyBindings(new ConnectFourViewModel());

  $(window).resize(function() {
    $(".cell").height($(".cell").width());
  });

  smoothScroll.init({
    speed: 1000, // Integer. How fast to complete the scroll in milliseconds
    easing: 'easeInOutCubic', // Easing pattern to use
    updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
    offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
    callbackBefore: function ( toggle, anchor ) {}, // Function to run before scrolling
    callbackAfter: function ( toggle, anchor ) {} // Function to run after scrolling
  });
}

function notifications() {
  return [
    'div', {
      class: 'notifications',
      'data-bind':'foreach: currentNotifications'
    },
    ['span', {
      class: 'radius label',
      'data-bind': 'text: message'
    }, '']
  ];
}

function title(title) {
  return [
    'div', { class: 'row' },
    ['div', { class: 'column full' },
     ['h1', { class: 'title' }, title]
    ]
  ]
}

function menu(obj) {
  return [
    'div', { class: 'row' },
    obj.map(function(item) {
      return [
        'div', { class: 'column third' },
        ['button', {
          'data-bind': util.format('click: %s, enable: %s', item.click, item.enable),
          class: 'button ' + item.button
        }],
        item.label
      ];
    })
  ];
}

function form(players) {
  return [
    'form',
    nameInput(players),
    loadPreviousGameInput()
  ];
}

function nameInput(players) {
  return [
    'div', { class: 'row nameInputRow' },
    players.map(function(player) {
      return [
        'div', { class: 'column half' },
        ['h4', { class: util.format('prefix label-p%s', player.id[0]) }, player.label],
        ['input', {
          type: 'text',
          placeholder: 'name',
          'data-bind': util.format('value: player%sName', player.id[1]),
          class: util.format('nameInput p%s', player.id[0])
        }]
      ]
    })
  ]
}

function loadPreviousGameInput() {
  return     [
    'div', {
      class: 'row',
      'data-bind': 'fadeVisible: (currentGame() == null)'
    },
    [
      'div', { class: 'loadGame column three-fourths' },
      ['h4', { class: 'prefix' }, 'LOAD GAME'],
      ['input', {
        type: 'text',
        placeholder: 'Game ID',
        class: 'nameInput',
        'data-bind': 'value: loadGameId'
      }]
    ],
    [
      'div', { class: 'loadGame column fourth' },
      ['h4', { class: 'prefix' }, '&nbsp;'],
      ['button', {
        class: 'button postfix success',
        'data-bind': 'click: loadGame'
      }, 'Load']
    ]
  ]
}

function instructions() {
  return [
    'div', { class: 'column third' },
    [
      'div',
      {
        class: 'instructionCont',
        'data-bind': 'if: (currentGame() && !gameWinner()), fadeVisible: currentGame'
      },

      ['h3', {
        class: 'turnTicker',
        'data-bind': 'css: { p1Color: currentPlayer() == 1, p2Color: currentPlayer() == 2 }'
      }, 'It\'s ', ['span', { 'data-bind': 'text: currentPlayerName'}, ''], '\'s turn.' ],

      ['p', { class: 'rules' },
       'Click anywhere in a column to drop your piece into that column &mdash; it will appear ',
       'atop any pieces already in the column, or at the bottom of the column if the column ',
       'is empty.'],

      ['a', {
        class: 'ruleButton',
        href: 'http://www.hasbro.com/common/documents/dad2614d1c4311ddbd0b0800200c9a66/1EF6874419B9F36910222EB9858E8CB8.pdf'
      }, 'Rules']

    ],
    saveMe(),
    congratulations()
  ];
}

function saveMe() {
  return [
    'button',{
      class: 'button default save-me',
      'data-bind': 'click: saveMe, visible: hintable'
    }, 'Save Me'
  ];
}

function congratulations() {
  return [
    'h2',
    {
      class: 'youWin',
      'data-bind': 'if: gameWinner, css: { p1Color: currentPlayer() == 1, p2Color: currentPlayer() == 2 }'
    },
    'Congratulations ',
    ['span', { 'data-bind': 'text: currentPlayerName' }, ''],
    ['br'],
    'You\'ve won!'
  ]
}

function grid() {
  return [
    'div', {
      id: 'gridCont',
      class: 'gameRow',
      'data-bind': 'visible: currentGame, css: { p1ColorH: currentPlayer() == 1, p2ColorH: currentPlayer() == 2 }'
    },
    [
      'div', {
        id: 'grid',
        class: 'column two-thirds'
      },
      [
        'table', { class: 'gridTable' },
        [
          'tbody', { 'data-bind': 'foreach: currentGameRows' },
          [
            'tr', { 'data-bind': 'foreach: columns'},
            [
              'td', {
                class: 'cell',
                'data-bind': 'css: valueForCSS, rowColumnClasses: $data, click: $root.selectCell, glow: hint'
              }, ''
            ]
          ]
        ]
      ]
    ]
  ];
}
