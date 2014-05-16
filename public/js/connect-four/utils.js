/**
 * Reusable utility functions from Connect Four.
 * 
 * (Reusable largely in theory ;-))
 */

/**
 * Determine if a row of the given matrix contains a winning 'streak', i.e.
 * 4 or more of the same value (indicating, in this case, the same player's
 * pieces) in a row.
 */
function containsStreakOfValues(matrix) {
    var streak = null,
        streakOf = null,
        current = null;
    for (var i = 0; i < matrix.length; i++) {
        streak = 0;
        // Iterate backwards since in the Connect Four grid 0,0 is the *top*
        // left and we want to try from the bottom up
        for (var j = (matrix[i].length - 1); j >= 0; j--) {
            current = matrix[i][j];
            if ((current === null) || (streakOf && (current != streakOf))) {
                // If the cell is empty or doesn't match the current streak, 
                // we have to give up
                streak = 0; 
                streakOf = null;
                continue;
            } else if (!streakOf) {
                // Perhaps start a new streak?
                streakOf = current;
            }
            if (current == streakOf) {
                // Increment the current streak, if we've found a corresponding
                // value.
                streak++;
            }
            if (streak == 4) {
                // That's a win!
                return true;
            }
        }
    }
    // We've tried every row -- no luck.
    return false;
}

/**
 * Given a starting point and a grid, search the diagonals 'up' the virtual
 * game space to see if a streak of 4 or more values exists.
 * 
 * NB: It should be safe to limit the search to 'up' the virtual game space,
 * since we start at the bottom and so should catch the first item of any 
 * diagonal run before we see the others.
 */
function searchDiagonally(x, y, grid) {
    var current = grid[x][y],
        iter_x = x,
        iter_y = y,
        max_x = grid.length - 1,
        streak = 0;

    // First, search decreasing in both indices -- upwards and to the left,
    // in the virtual game space. 
    while ((iter_x >= 0) && (iter_y >= 0)) {
        if (grid[iter_x][iter_y] != current) {
            // The streak's been broken. Give up.
            break;
        }
        // Optimistic -- keep going.
        streak++;
        if (streak == 4) {
            // Winning condition reached!
            return true;
        }
        // Now increment and continue the search
        iter_x--;
        iter_y--;
    }
    // If we haven't found a match, try again in the other diagonal direction.
    // Reset the counters first.
    iter_x = x;
    iter_y = y;
    streak = 0;
    // This is upwards and to the right, in the virtual space.
    while ((iter_x <= max_x) && (iter_y >= 0)) {
        if (grid[iter_x][iter_y] != current) {
            // Streak broken. Give up.
            break;
        }
        // Optimistic...
        streak++;
        if (streak == 4) {
            // Winning condition reached!
            return true;
        }
        // Increment and continue the search.
        iter_x++;
        iter_y--;
    }
    // We've tried everything, no luck.
    return false;    
}

var scoreGameGrid = function (matrix, transposed) {

    var column = null,
        current,
        streak = 0,
        streakOf = null,
        bestOf = {1: 0, 2: 0 }; // Player 1, 2
    
    /* Vertical checks */
    for (var i = 0; i < matrix.length; i++) {
        streakOf = null;
        column = matrix[i];

        for (var j = 0; j < column.length; j++) {
            current = column[j];

            if (current) {
                // If we have a new piece, start counting.
                if (streakOf == null) {
                    streakOf = current;
                    streak = 1;
                }
                // Keep counting as we have the same.
                else if (streakOf == current) {
                    ++streak;
                }
                // Otherwise, this one is useless anymore, ignore this column.
                else {
                    break;
                }
            }
            else {
                streakOf = null;
            }
        }
        // Having a better score, save it.
        if (bestOf[streakOf] < streak) bestOf[streakOf] = streak;
    }

    /* Horizontal checks */
    for (var i = 0; i < transposed.length; i++) {
        streakOf = null;
        column = transposed[i];

        for (var j = 0; j < column.length; j++) {
            current = column[j];
            if (current) {
                // If we have a new piece, start counting.
                if (streakOf == null) {
                    streakOf = current;
                    streak = 1;
                }
                // Keep counting as we have the same.
                else if (streakOf == current) {
                    ++streak;
                }
                // We have a different piece, this prevents previous one to
                // get better, so we should ignore it. Well the other end can
                // be open, but ignore it for now. Besides, start counting the
                // new streak.
                else {
                    // Only if this is a win.
                    if (streak == 4) bestOf[streakOf] = streak;
                    streakOf = current;
                    streak = 1;
                }
            }
            // We have an empty spot.
            else {
                if (bestOf[streakOf] < streak) bestOf[streakOf] = streak;
                streakOf = null;
            }
        }
        // Having a better score, save it.
        if (bestOf[streakOf] < streak) bestOf[streakOf] = streak;
    }

    /* Diagonal checks */
    // I don't do diagonal checks for the sake of simplicity. It's gonna be
    // like reinventing the wheel, because there are much better algorithms.

    return bestOf;
}

