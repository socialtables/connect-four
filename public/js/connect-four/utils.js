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


/* This function determines if there exists a potential winning solution
* consisting of a column. Given a matrix, an empty array, and a number(1 or 2)
* corresponding to a player, it will return an x coordinate, a y coordinate and
* a value for a group of cells that could meet winning criteria
*
* This function operates very similarly to the ContainsStreakofValues function above
* with some minor changes :)
*/
function test(matrix,ArrayOfValues,streakof){
    var streak = null,
        streakOf = streakof,
        current = null;
        

    for(var i=0; i<matrix.length;i++){
        streak = 0;
        ArrayOfValues = [];
        for(var j = (matrix[i].length -1); j>=0; j--){

            current = matrix[i][j];

            if (current){

              //if space is not empty
                if(current == streakOf){

                  //if space part of current streak


                    
                    ArrayOfValues.push([i,j,current]); //push the xval, yval, and value to the array
                    
                    
                    
                    
                    streak++; //and then increment
                }
            

                else{

                    
                    
                    
                    ArrayOfValues = []; //clean up the array just in case
                    ArrayOfValues.push([i,j,current]); //push the new starting coordinates and value 

                    streakOf = streakof;  //ensuring that we're only looking for either a streak of 1's or a streak of 2'streak
                                          //depending on the parameter above
                    
                    streak = 1;

                    //started new streak!
                }
            }

            else {
                //we lost the streak
                streak = 0;
                ArrayOfValues = [];
            }

            if(streak == 3){


                
                ArrayOfValues.reverse(); //readability purposes


                
                
                //If the top part of the column is open, and it does not go
                //beyond the boundaries of the grid, 
                //then this can be considered
                //a valid solution
                if((j-1> -1)){
                    if(matrix[i][j-1] == (null||undefined)){

                        return ArrayOfValues;
                    }
                    
                }
                
        
            }


        }

    }


}

/* Same methodology as above, but with row
* Similar to above, given a matrix, an empty array, and a specific steak value to
* look for, it will draw up potential solutions that manifest themselves in rows. 
*/

function checkForRows(matrix,ArrayOfValues,streakof){
    var streak = null,
        streakOf = streakof,
        current = null;

    for(var i=0; i<matrix.length;i++){
        streak = 0;

        // Iterate backwards since in the Connect Four grid 0,0 is the *top*

         // left and we want to try from the bottom up

        for(var j = (matrix[i].length -1); j>=0; j--){

            current = matrix[i][j];

            if (current){
                if(current == streakOf){

                    ArrayOfValues.push([i,j,current]);
                    streak++;
                }
            

                else{


                    //streakOf = current;
                
                    streakOf = streakof;
                    streak = 1;

                    ArrayOfValues.push([i,j,current]);
                    
                }
            }

            else {

                
                streak = 0;
                ArrayOfValues = [];
            }


            if(streak == 2){
            //Now we check for potential solutions that can be fragmented. that is,
            //neither a column or a row. Something like this, for example:
            // player 1 = 1;
            // player 2 = 2;
            // empty spot = 0;
            //
            // 0 0 0 0 0 0
            // 0 0 0 0 0 0 
            // 0 2 0 2 2 0 -->potential solution
            // 0 0 0 0 0 0
            // 0 1 0 1 1 0 --> this too

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
                
                //We begin at the bottom of the grid 
                if(i == 5){
                    if((j-1)>-1){
                        //if the left hand side of the row is free
                        if(matrix[i][j-1] != (1||2)){
                            return ArrayOfValues;
                        }

                        if((i+3) < 7){
                            //if the right hand side of the row is free
                            if(matrix[i][i+3] != (1||2)){
                                return ArrayOfValues
                            }
                        }
                    }
                    if((i+3) < 7){
                            //if the right hand side of the row is free
                        if(matrix[i][i+3] != (1||2)){
                            return ArrayOfValues
                        }
                    }
                }
                //if the row is not at the bottom of the grid
                if((j-1) > -1){
                    if(matrix[i][j-1] != (1||2)){
                        //This check ensures that there is a piece to support the next
                        if(matrix[i+1][j-1] == (1||2)){
                            return ArrayOfValues;
                        }
                        
                    }
                    if((i+3) < 7){

                        if(matrix[i][i+3] != (1||2)){
                            if(matrix[i+1][i+3] == (1||2)){
                                return ArrayOfValues;
                            }
                        }
                    }
                }
                if((i+3) < 7){

                    if(matrix[i][i+3] != (1||2)){

                        if(matrix[i+1][i+3] == (1||2)){

                            return ArrayOfValues;
                        }
                    }
                }


                //If there is a valid solution for a row
            }


        }

    }


}



