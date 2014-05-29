/**
 * Reusable utility functions from Connect Four.
 * 
 * (Reusable largely in theory ;-))
 */

/**
* Check whether there are any streaks in the grid
*
* Tests the internal grid using utility functions in `utils.js`, which
* are in theory reusable even though currently they have the Connect Four
* 4-in-a-row win condition hardcoded into them.
*/
function checkGridForStreaks(grid, streakLength) {
    // First do the easy check - a string of 4 or more in a columnn in the
    if (containsStreakOfValues(grid, streakLength)) {
        return true;
    }
    // Now check for the same in a row -- by transposing rows & columns
    var transposed = _.zip.apply(_, grid);
    if (containsStreakOfValues(transposed, streakLength)) {
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
            if (searchDiagonally(i, j, grid, streakLength)) {
                return true;
            }
        }
    }
    return false;
};


/**
 * Determine if a row of the given matrix contains a winning 'streak', i.e.
 * 4 or more of the same value (indicating, in this case, the same player's
 * pieces) in a row.
 */
function containsStreakOfValues(matrix, streakLength) {
    var streak = null,
        streakOf = null,
        current = null;
        streakLength = streakLength || 4;

    for (var c = 0; c < matrix.length; c++) {
        streak = 0;
        // Iterate backwards since in the Connect Four grid 0,0 is the *top*
        // left and we want to try from the bottom up
        for (var r = (matrix[c].length - 1); r >= 0; r--) {
            current = matrix[c][r];
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
            if (streak == streakLength) {
                // That's a win!
                return true;
            }
        }
    }
    // We've tried every row -- no luck.
    return false;
}

/**
 * Find streaks of a given length, and return the cell identifier for the following
 * spot if it is currently empty.
 */
function findStreakOfValues(matrix, streakLength, matrixReversed) {
    var streak = null,
        streakOf = null,
        current = null,
        streakFound = false,
        streakEndings = [];
    streakLength = streakLength || 4;
    matrixReversed = matrixReversed || false;

    for (var c = 0; c < matrix.length; c++) {
        streak = 0;
        // Iterate backwards since in the Connect Four grid 0,0 is the *top*
        // left and we want to try from the bottom up
        for (var r = (matrix[c].length - 1); r >= 0; r--) {
            current = matrix[c][r];
            if ((current === null) || (streakOf && (current != streakOf))) {
                // Check if a streak was found
                if (streakFound) {
                    // Verify that the current spot is empty, before adding it
                    if (matrixReversed === false && current === null) {
                        streakEndings.push({ col: c, row: r, player: streakOf });
                    }
                    streakFound = false;
                }

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
            if (streak == streakLength) {
                if (matrixReversed === false) {
                    // That's a streak of 3, if the next one is empty, it might be the one
                    streakFound = true;
                }
                // Check if the position beneath must not be null
                else if (matrixReversed && (c <= matrix.length - 1)) {
                    var target_r;
                    if (r == 0) {
                        target_r = r + 3;
                    } else {
                        target_r = r;
                    }
                    if ((current === null || matrix[c][target_r] === null) && (c == (matrix.length) - 1 || (matrix[(c+1)][target_r] !== null))) {
                        // Set the target point for r to the column since our matrix is reversed, and the c to the row
                        streakEndings.push({ col: target_r, row: c, player: streakOf });
                    }
                }
            }
        }
        // In case a streak was found at the top of a column reset to false as a streak
        // can't be carried over to the next column
        streakFound = false;
    }

    return streakEndings;
}

/**
 * Given a starting point and a grid, search the diagonals 'up' the virtual
 * game space to see if a streak exists with a empty space after it.
 *
 * NB: It should be safe to limit the search to 'up' the virtual game space,
 * since we start at the bottom and so should catch the first item of any
 * diagonal run before we see the others.
 */
function findDiagonalStreak(x, y, grid, streakLength) {
    var current = grid[x][y],
        iter_x = x,
        iter_y = y,
        max_x = grid.length - 1,
        streak = 0,
        streakFound = false,
        streakEndings = [];
    streakLength = streakLength || 4;

    // First, search decreasing in both indices -- upwards and to the left,
    // in the virtual game space.
    while ((iter_x >= 0) && (iter_y >= 0)) {
        if (streakFound) {
            if (grid[iter_x][iter_y] === null && current !== null && grid[iter_x][iter_y+1] !== null) {
                streakEndings.push({ col: iter_x, row: iter_y, player: current });
            } else {
                streakFound = false;
            }
        }
        if (grid[iter_x][iter_y] != current) {
            // The streak's been broken. Give up.
            break;
        }
        // Optimistic -- keep going.
        streak++;
        if (streak == streakLength) {
            // We matched the streak. Set that we found the streak so we can check the following
            streakFound = true;
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
        if (streakFound) {
            if (grid[iter_x][iter_y] === null && current !== null && grid[iter_x][iter_y+1] !== null) {
                streakEndings.push({ col: iter_x, row: iter_y, player: current });
            } else {
                streakFound = false;
            }
        }
        if (grid[iter_x][iter_y] != current) {
            // Streak broken. Give up.
            break;
        }
        // Optimistic...
        streak++;
        if (streak == streakLength) {
            // We matched the streak. Set that we found the streak so we can check the following
            streakFound = true;
        }
        // Increment and continue the search.
        iter_x++;
        iter_y--;
    }

    return streakEndings;
}

/**
 * Given a starting point and a grid, search the diagonals 'up' the virtual
 * game space to see if a streak of 4 or more values exists.
 * 
 * NB: It should be safe to limit the search to 'up' the virtual game space,
 * since we start at the bottom and so should catch the first item of any 
 * diagonal run before we see the others.
 */
function searchDiagonally(x, y, grid, streakLength) {
    var current = grid[x][y],
        iter_x = x,
        iter_y = y,
        max_x = grid.length - 1,
        streak = 0;
        streakLength = streakLength || 4;

    // First, search decreasing in both indices -- upwards and to the left,
    // in the virtual game space. 
    while ((iter_x >= 0) && (iter_y >= 0)) {
        if (grid[iter_x][iter_y] != current) {
            // The streak's been broken. Give up.
            break;
        }
        // Optimistic -- keep going.
        streak++;
        if (streak == streakLength) {
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
        if (streak == streakLength) {
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
