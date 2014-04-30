/**
 * Simple Connect Four Game
 *
 * Requires jQuery 2.0, knockout.js 3.0, underscore.js 1.5
 * Assumes that the 'bindings.js' and 'utils.js' files have been
 * included first -- this is not proper dependency handling or package
 * management but quick & dirty is good enough for now.
 *
 * Copyright (C) 2014 Rami Chowdhury <rami.chowdhury@gmail.com>
 */

/**
 * Represent a notification to the player(s) from the app.
 *
 * Includes properties for display and styling.
 */
function ConnectFourNotification(message, alertType) {
    var self = this;
    self.message = message;
    self.extraClass = alertType || "secondary";
}

/**
 * Represent a cell in Connect Four.
 *
 * Mainly useful as a container for the ko.observable value, and for convenient
 * placement of styling methods.
 */
function ConnectFourCell(x, y, value) {
    var self = this;
    self.x = x;
    self.y = y;
    // This is the really important part -- marks whether a cell is empty or
    // used by a player, and if so which player.
    self.value = ko.observable(value);

    /**
     * Return the CSS class to use to mark ownership of the cell -- i.e. show
     * whether it's empty or filled by Player One or Two.
     */
    self.valueForCSS = ko.computed(function() {
        var val = self.value(),
            cssSuffix = null;
        switch (val) {
            case 1:
              cssSuffix = "p1";
              break;
            case 2:
              cssSuffix = "p2";
              break;
            default: // also covers the `null` (i.e. empty) case
              cssSuffix = "empty";
              break;
        }
        return "cell-" + cssSuffix;
    });
}

/**
 * Convenient container class to hold a column of `ConnectFourCell`s
 */
function ConnectFourColumn(rows) {
    var self = this;
    self.rows = rows;
}

/**
 * Convenient container class to hold a row of `ConnectFourCell`s
 */
function ConnectFourRow(columns) {
    var self = this;
    self.columns = columns;
}

/**
 * Represent an in-progress game of Connect Four.
 *
 * @param id - the unique ID for the game. Entirely arbitrary -- generated by
 *   a UUID library in the backend.
 * @param grid - the nested array of columns representing the state of
 *   the Connect Four grid. A `null` in the array means an empty slot;
 *   otherwise an integer (player ID, 1 or 2) indicates which player's
 *   token occupies the slot. NB: to map this onto the virtual board,
 *   remember grid[0][0] is the top left of the board.
 */
function ConnectFourGame(id, grid) {
    var self = this;

    self.id = id;
    /* Construct the grid -- transform it from raw data into a matrix of
     * `ConnectFourCell`s which can be used to build the UI.
     */
    self.grid = [];
    var i = 0, j = 0, column = null;
    for (i = 0; i < grid.length; i++) {
        column = [];
        for (j = 0; j < grid[i].length; j++) {
            column.push(new ConnectFourCell(i, j, grid[i][j]));
        }
        self.grid.push(column);
    }

    /**
     * Return the grid as an array of rows -- useful since it's easier
     * to handle rows in HTML, but easier to handle Connect Four data as
     * columns.
     */
    self.asRows = function() {
        var rowForm = _.zip.apply(_, self.grid),
            result = [];
        for (var i = 0; i < rowForm.length; i++) {
            result.push(new ConnectFourRow(rowForm[i]));
        }
        return result;
    };

    /**
     * Serialize the grid back from `ConnectFourCell`s into raw data, for
     * transmission to the backend and other uses.
     */
    self.serializedGrid = function() {
        var i = 0,
            j = 0,
            column = null,
            output = [];
        for (i = 0; i < self.grid.length; i++) {
            column = [];
            for (j = 0; j < self.grid[i].length; j++) {
                column.push(self.grid[i][j].value());
            }
            output.push(column);
        }
        return output;
    };

    /**
     * Check whether the game has been won.
     *
     * Tests the internal grid using utility functions in `utils.js`, which
     * are in theory reusable even though currently they have the Connect Four
     * 4-in-a-row win condition hardcoded into them.
     */
    self.isWon = function() {
        // First do the easy check - a string of 4 or more in a columnn in the
        // grid
        var grid = self.serializedGrid();
        if (containsStreakOfValues(grid)) {
            return true;
        }
        // Now check for the same in a row -- by transposing rows & columns
        var transposed = _.zip.apply(_, grid);
        if (containsStreakOfValues(transposed)) {
            return true;
        }
        // Now the tough one -- doing the diagonals.
        for (var i = 0; i < grid.length; i++) {
            // Iterate backwards to go from bottom to top
            for (var j = (grid[i].length - 1); j >= 0; j--) {
                var current = grid[i][j];
                if (current === null) {
                    continue;
                }
                if (searchDiagonally(i, j, grid)) {
                    return true;
                }
            }
        }
        return false;
    };
}

/**
 * The application -- contain and connect all the pieces.
 *
 * Includes no small amount of logic of its own -- could do with a refactoring,
 * although there isn't time for this exercise.
 */
function ConnectFourViewModel() {
    var self = this;

    /* Application state -- not necessarily related to any particular game. */

    self.currentNotifications = ko.observableArray([]);

    self.loadGameId = ko.observable(null);  // serves 'load game' input / button

    /* Game state */

    // If a game is in progress, this holds a `ConnectFourGame` instance.
    self.currentGame = ko.observable(null);

    // Whose turn is it?
    self.currentPlayer = ko.observable(null);

    // If someone has won, this will be populated appropriately
    self.gameWinner = ko.observable(null);

    // Convenience computed function for ease of binding in the view.
    self.currentGameRows = ko.computed(function() {
        if (self.currentGame() === null) {
            return [];
        }
        return self.currentGame().asRows();
    });

    // Players' names, for friendliness and convenience in Knockout bindings
    // at the root level.
    self.playerOneName = ko.observable(null);
    self.playerTwoName = ko.observable(null);

    self.currentPlayerName = ko.computed(function() {
        switch(self.currentPlayer()) {
            case 1:
              return self.playerOneName();
            case 2:
              return self.playerTwoName();
            default:
              return null;
        }
    });

    /**
     * Display a notification to the player(s) with a built-in timeout.
     *
     * Insert a message into the notifications 'tray', with an optional
     * alert type (e.g. green for success, red for warning). Since these are
     * transactional messages, they self-destruct after 5 seconds.
     */
    self.displayTimedNotification = function(message, alertType) {
        var notification = new ConnectFourNotification(message, alertType);
        self.currentNotifications.push(notification);
        setTimeout(function() {
                       self.currentNotifications.destroy(notification);
                   }, 5000);
    };

    /**
     * Indicate the app is loading something from the backend.
     *
     * Do this by fading out the whole app -- quick and dirty.
     */
    self.showLoading = function() {
        $("body").css({ opacity: 0.7 });
    };

    /**
     * Stop the loading indication.
     *
     * Restore full opacity.
     */
    self.hideLoading = function() {
        $("body").css({ opacity: 1.0 });
    };


    /* Game play */

    /**
     * Respond to a player input in the game.
     *
     * Since clicks on cells are how the game is played, this is the key method
     * here. After checking to see that the game is playable (i.e. hasn't been
     * won already), attempts to drop a piece into the column the player clicked
     * on.
     *
     * Once the piece has been dropped, check to see if the game has been won,
     * and if so set the state appropriately; otherwise give the other player
     * a turn.
     *
     * Display an error on an invalid move.
     *
     * @param {ConnectFourCell} cell The cell the player clicked on.
     */
    self.selectCell = function(cell) {
        if (self.gameWinner()) {
            self.displayTimedNotification(
                "Game is over. Please quit this game and start a new one.",
                "alert");
            return;
        }

        var game = self.currentGame(),
            x = cell.x,
            y = cell.y;

        var stored = false;
        var column = game.grid[x];
        // Note because 0,0 is the *top* left of the grid, we iterate
        // backwards to fill it from the bottom up
        for (var i = (column.length - 1); i >= 0; i--) {
            if (!column[i].value()) {
                column[i].value(self.currentPlayer());
                stored = true;
                break;
            }
        }

        if (!stored) {
            self.displayTimedNotification("Invalid move. Please try again.", "alert");
            return;
        }

        var won = self.currentGame().isWon();
        if (won) {
            self.gameWinner(self.currentPlayer());
            return;
        }

        var nextPlayer = (self.currentPlayer() % 2) + 1;
        self.currentPlayer(nextPlayer);
    };

    /**
     * Start a new game of Connect Four.
     *
     * Queries the backend for a new UUID and empty game grid, and sets up the
     * UI to match.
     */
    self.startNewGame = function() {
        // Set up the AJAX request
        var params = {
            url: "/new",
            dataType: "json",
            success: function(data, txtStatus, xhr) {
                // On success, we expect back a JSON object with an ID and
                // a data grid, which we can pass straight into the game
                // constructor.
                self.hideLoading();
                self.currentGame(new ConnectFourGame(data.id, data.data));
                // Start the game!
                self.currentPlayer(1);
            },
            error: function(xhr, txtStatus, error) {
                self.hideLoading();
                self.currentGame(null);
                self.displayTimedNotification("Error creating new game!", "alert");
            }
        };
        // Send off the request and show the loading indicator
        $.ajax(params);
        self.showLoading();
        setTimeout("$('.cell').height($('.cell').width()); smoothScroll.animateScroll( null, '#grid' );", 700);
    };

    /**
     * Zero out any current state.
     */
    self.quitGame = function() {
        self.currentGame(null);
        self.currentNotifications.removeAll();
        self.currentPlayer(null);
        self.gameWinner(null);
    };

    /**
     * Save the current game to the backend.
     *
     * Serializes the current game grid to a simple array and notifies the user of
     * the game ID, in case the user wants to load the saved game in future. Since
     * this isn't critical to the flow of the game, don't interrupt with a loading
     * or other event -- simply notify the player(s) on success / failure.
     */
    self.saveGame = function() {
        var gameData = self.currentGame().serializedGrid(),
            params = {
                url: "/" + self.currentGame().id,
                type: "POST",
                data: JSON.stringify(gameData),
                contentType: "application/json",  // must set manually, jQuery doesn't help
                success: function(data, txtStatus, xhr) {
                    self.displayTimedNotification(
                        "Saved ID '" + self.currentGame().id + "'",
                        "success");
                },
                error: function(xhr, txtStatus, err) {
                    self.displayTimedNotification(
                        "Error saving game: " + xhr.responseJSON.msg,
                        "alert");
                }
            };
        $.ajax(params);
    };

    /**
     * Load a saved game from the backend.
     *
     * Given a game ID (typed into the input box) attempt to load the game from
     * the server backend and continue play. Since this does affect gameplay,
     * use the loading indicator while running.
     */
    self.loadGame = function() {
        var gameId = self.loadGameId(),
            params = {
                url: "/" + gameId,
                dataType: "json",
                success: function(data, txtStatus, xhr) {
                    // On success, we expect simply a grid of positions --
                    // the ID is known to us already
                    self.hideLoading();
                    self.currentGame(new ConnectFourGame(gameId, data.data));
                    self.displayTimedNotification(
                        "Loaded '" + gameId + "'",
                        "success");
                    // Start play!
                    self.currentPlayer(1);
                },
                error: function(xhr, txtStatus, error) {
                    // Display the returned error message to the user in case
                    // it's helpful.
                    self.hideLoading();
                    self.currentGame(null);
                    self.displayTimedNotification(
                        "Error loading game: " + xhr.responseJSON.msg,
                        "alert");
                }
            };
        $.ajax(params);
        self.showLoading();
    };
}
