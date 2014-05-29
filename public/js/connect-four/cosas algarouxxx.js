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



             if (current) {

                 // if the space is not empty

                 if (current == streakOf){

                     // if the space is part of the current streak

                     streak++;

                 }

                 else{

                     streakOf = current;

                     streak = 1;

                     // we've started a new streak!

                 }

             }



             else {

                 streak = 0;

                 // the space is empty. starting back at 0

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

function test(matrix,ArrayOfValues){
    var streak = null,
        streakOf = null,
        current = null;

    for(var i=0; i<matrix.length;i++){
        streak = 0;

        for(var j = (matrix[i].length -1); j>=0; j--){

            current = matrix[i][j];

            if (current){
                if(current == streakOf){

                    ArrayOfValues.push([i,j,current]);
                    streak++;
                }
            

                else{

                    streakOf = current;
                    
                    streak = 1;
                    ArrayOfValues = [];
                    
                }
            }

            else {

                
                streak = 0;
                ArrayOfValues = [];
            }

            if(streak == 3){

                if((j-1) > -1){

                    if(matrix[i][j-1] != (1 || 2)){

                        return ArrayOfValues;
                    }

                }


            }


        }

    }


}

function checkForRows(matrix,ArrayOfValues){
    var streak = null,
        streakOf = null,
        current = null;

    for(var i=0; i<matrix.length;i++){
        streak = 0;

        for(var j = (matrix[i].length -1); j>=0; j--){

            current = matrix[i][j];

            if (current){
                if(current == streakOf){

                    ArrayOfValues.push([i,j,current]);
                    streak++;
                }
            

                else{


                    streakOf = current;
                    
                    streak = 1;
                    ArrayOfValues = [];
                    
                }
            }

            else {

                
                streak = 0;
                ArrayOfValues = [];
            }
            if(streak == 2){


                if(matrix[i][j+1] == (1||2)){

                    if(matrix[i][j-1] == (null||undefined)){


                        if(matrix[i][j-2] == (1||2)){

                            ArrayOfValues.push([i,j-2,current]);
                            return ArrayOfValues;

                        }

                    }

                }

                if(matrix[i][j+1] == (1||2)){

                    if(matrix[i][j+2] == (null||undefined)){

                        if(matrix[i][j+3] == (1||2)){

                            ArrayOfValues.push([i,j+3,current]);
                            return ArrayOfValues;
                        }

                    }

                }


            }

            if(streak == 3){

                ArrayOfValues.reverse();
                


                //If there is a valid solution for a row
                if((j-1) > -1){

                    if(matrix[i][j-1] == (null || undefined)){

                        if(i == 5){

                            return ArrayOfValues;
                        }

                        else if(matrix[i+1][j-1] == (1 || 2)){

                            return ArrayOfValues;
                        }
                        
                    }
                    //check for diagonals from left to right 
                    
                }
                
                if((j+3) < 7){

                    if(matrix[i][j+3] == (null || undefined)){

                        if(i == 5){

                            return ArrayOfValues;
                        }

                        else if(matrix[i+1][j+3] == (1 || 2)){

                            return ArrayOfValues;
                        }
                        
                    }
                    //check for diagonals from right to left
                   

                }
                return ArrayOfValues;
            }


        }

    }


}



